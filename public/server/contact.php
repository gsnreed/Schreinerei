<?php

declare(strict_types=1);

/*
 * Contact form endpoint (src/components/sections/Contact.astro).
 *
 * Two response modes, same validation:
 *  - Request with "Accept: application/json" (the form's JavaScript):
 *    JSON { ok, code, message?, errors? } with a matching HTTP status.
 *  - Plain form POST (no JavaScript): 303 redirect back to the page with
 *    ?sent=1 or ?sent=0&reason=<code>.
 *
 * Delivery uses PHP mail() via the host's local MTA. The sender address must
 * be on the site's own domain (SPF/DKIM) — see the deployment notes.
 */

// --- Configuration ------------------------------------------------------------

const RECIPIENT = 'schreinerei_siegfried@yahoo.com';
const SENDER = 'kontakt@schreinerei-siegfried.de'; // must exist / be allowed on the host
const SENDER_NAME = 'Website Schreinerei Siegfried';
const SUBJECT_PREFIX = 'Kontaktanfrage';

const SUCCESS_URL = '/?sent=1#contact';
const ERROR_URL = '/?sent=0&reason=%s#contact';

const HONEYPOT_FIELD = 'website';
const MIN_FILL_MS = 3000;          // faster than this = bot
const RATE_LIMIT_MAX = 5;          // submissions per IP ...
const RATE_LIMIT_WINDOW = 600;     // ... within this many seconds

const MAX_LENGTH = [
    'name' => 150,
    'email' => 254,
    'telephone' => 50,
    'project_type' => 100,
    'message' => 5000,
];

// Never show PHP errors to visitors; they go to the server's error log.
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// --- Helpers ------------------------------------------------------------------

function wantsJson(): bool
{
    return str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');
}

/** Send the response and stop. $code is a short machine-readable reason. */
function respond(int $status, string $code, string $message = '', array $errors = []): never
{
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');

    if (wantsJson()) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        $payload = ['ok' => $status < 300, 'code' => $code];
        if ($message !== '') {
            $payload['message'] = $message;
        }
        if ($errors) {
            $payload['errors'] = $errors;
        }
        echo json_encode($payload, JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($status === 405) {
        http_response_code(405);
        header('Content-Type: text/plain; charset=utf-8');
        echo 'Method Not Allowed';
        exit;
    }

    $location = $status < 300 ? SUCCESS_URL : sprintf(ERROR_URL, rawurlencode($code));
    header('Location: ' . $location, true, 303);
    exit;
}

/** Log without personal data (no names, addresses or message text). */
function logEvent(string $event): void
{
    error_log('[contact-form] ' . $event);
}

/** Read a POST field as a clean UTF-8 string ('' if missing, null if malformed). */
function field(string $key, bool $multiline = false): ?string
{
    $value = $_POST[$key] ?? '';
    if (!is_string($value) || !mb_check_encoding($value, 'UTF-8')) {
        return null;
    }
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    // Strip control characters; keep line breaks and tabs only in multiline fields.
    $value = $multiline
        ? preg_replace('/[^\P{C}\n\t]/u', '', $value)
        : preg_replace('/\p{C}/u', ' ', $value);
    return trim((string) $value);
}

/** Simple per-IP sliding-window limit. Stores only timestamps under a hashed key. */
function rateLimited(): bool
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $key = hash('sha256', $ip . '|' . __FILE__ . '|' . gmdate('Y-m-d'));
    $file = sys_get_temp_dir() . '/contact-rl-' . substr($key, 0, 32) . '.json';

    $handle = @fopen($file, 'c+');
    if ($handle === false) {
        logEvent('rate limit storage unavailable');
        return false; // fail open: never block real visitors because of storage
    }

    flock($handle, LOCK_EX);
    $now = time();
    $hits = json_decode((string) stream_get_contents($handle), true);
    $hits = array_values(array_filter(
        is_array($hits) ? $hits : [],
        static fn ($t) => is_int($t) && $t > $now - RATE_LIMIT_WINDOW
    ));

    $limited = count($hits) >= RATE_LIMIT_MAX;
    if (!$limited) {
        $hits[] = $now;
    }

    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($hits));
    flock($handle, LOCK_UN);
    fclose($handle);

    return $limited;
}

// --- Request checks -----------------------------------------------------------

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, 'method_not_allowed');
}

// Cross-site protection: browsers send Origin on POST; it must be this site.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && $origin !== 'null') {
    $originHost = parse_url($origin, PHP_URL_HOST);
    $host = preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? '');
    if (!is_string($originHost) || strcasecmp($originHost, (string) $host) !== 0) {
        logEvent('rejected: foreign origin');
        respond(403, 'forbidden', 'Die Anfrage wurde abgelehnt.');
    }
}

// --- Spam checks (answer "success" so bots learn nothing) ---------------------

$honeypot = $_POST[HONEYPOT_FIELD] ?? '';
if (!is_string($honeypot) || trim($honeypot) !== '') {
    logEvent('spam: honeypot');
    respond(200, 'sent');
}

// Set by the form's JavaScript. Missing (no JavaScript) is allowed.
$elapsed = $_POST['form_elapsed'] ?? '';
if (is_string($elapsed) && ctype_digit($elapsed) && (int) $elapsed < MIN_FILL_MS) {
    logEvent('spam: submitted too fast');
    respond(200, 'sent');
}

// --- Validation -----------------------------------------------------------------

$name = field('name');
$email = field('email');
$telephone = field('telephone');
$projectType = field('project_type');   // optional dropdown "Worum geht es?"
$message = field('message', true);
$consent = $_POST['privacy_consent'] ?? '';

if ($name === null || $email === null || $telephone === null || $projectType === null || $message === null) {
    logEvent('rejected: malformed fields');
    respond(400, 'bad_request', 'Die Anfrage war ungültig. Bitte laden Sie die Seite neu.');
}

$errors = [];

if ($name === '') {
    $errors['name'] = 'Bitte geben Sie Ihren Namen an.';
} elseif (mb_strlen($name) > MAX_LENGTH['name']) {
    $errors['name'] = 'Der Name ist zu lang (maximal ' . MAX_LENGTH['name'] . ' Zeichen).';
}

if ($email === '') {
    $errors['email'] = 'Bitte geben Sie Ihre E-Mail-Adresse an.';
} elseif (mb_strlen($email) > MAX_LENGTH['email'] || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    $errors['email'] = 'Bitte geben Sie eine gültige E-Mail-Adresse an.';
}

// Optional, but if given it should look like a phone number.
if ($telephone !== '') {
    if (mb_strlen($telephone) > MAX_LENGTH['telephone']) {
        $errors['telephone'] = 'Die Telefonnummer ist zu lang.';
    } elseif (!preg_match('/^[0-9+()\/.\-\s]{5,}$/', $telephone)) {
        $errors['telephone'] = 'Bitte geben Sie eine gültige Telefonnummer an.';
    }
}

// Optional dropdown; only its length is checked (the options come from the site).
if (mb_strlen($projectType) > MAX_LENGTH['project_type']) {
    $errors['project_type'] = 'Bitte wählen Sie einen Eintrag aus der Liste.';
}

if ($message === '') {
    $errors['message'] = 'Bitte schreiben Sie uns eine Nachricht.';
} elseif (mb_strlen($message) > MAX_LENGTH['message']) {
    $errors['message'] = 'Die Nachricht ist zu lang (maximal ' . MAX_LENGTH['message'] . ' Zeichen).';
}

if ($consent !== 'yes') {
    $errors['privacy_consent'] = 'Bitte stimmen Sie der Datenschutzerklärung zu.';
}

if ($errors) {
    respond(422, 'validation', 'Bitte prüfen Sie Ihre Eingaben.', $errors);
}

// Counted only for valid submissions, so correcting typos never locks anyone out.
if (rateLimited()) {
    logEvent('rate limited');
    respond(429, 'rate_limited', 'Zu viele Anfragen. Bitte versuchen Sie es in einigen Minuten erneut.');
}

// --- Build the email ------------------------------------------------------------
// Plain text only (no HTML → no XSS in mail clients). Visitor data never goes
// into a header except the validated address in Reply-To and the name in the
// MIME-encoded subject (control characters already removed).

mb_internal_encoding('UTF-8');

// e.g. "Anfrage (Küchen nach Maß) von Max Muster"
$subjectText = SUBJECT_PREFIX
    . ($projectType !== '' ? ' (' . $projectType . ')' : '')
    . ' von ' . $name;
$subject = mb_encode_mimeheader($subjectText, 'UTF-8', 'B', "\r\n");

$body = implode("\n", [
    'Neue Kontaktanfrage über die Website',
    '====================================',
    '',
    'Name:     ' . $name,
    'E-Mail:   ' . $email,
    'Telefon:  ' . ($telephone !== '' ? $telephone : '–'),
    'Thema:    ' . ($projectType !== '' ? $projectType : '–'),
    'Datenschutzerklärung akzeptiert: Ja',
    '',
    'Nachricht:',
    $message,
    '',
    '--',
    'Antworten Sie direkt auf diese E-Mail, um dem Absender zu schreiben.',
]);

$headers = [
    'From: ' . mb_encode_mimeheader(SENDER_NAME, 'UTF-8', 'Q') . ' <' . SENDER . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    // base64: safe for umlauts and for long lines (SMTP limit 998 chars/line)
    'Content-Transfer-Encoding: base64',
];

$sent = mail(
    RECIPIENT,
    $subject,
    rtrim(chunk_split(base64_encode(str_replace("\n", "\r\n", $body)), 76, "\r\n")),
    implode("\r\n", $headers),
    '-f' . SENDER
);

if (!$sent) {
    logEvent('mail() returned false — check the host mail configuration');
    respond(500, 'server', 'Ihre Nachricht konnte nicht gesendet werden.');
}

respond(200, 'sent');
