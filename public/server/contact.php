<?php

declare(strict_types=1);

// Konfiguration

$recipient = 'schreinerei-siegfried@yahoo.com';

$sender = 'kontakt@schreinerei-siegfried.de';

// Nach erfolgreichem Versand
$successUrl = '/?sent=1#contact';

// Bei Fehlern
$errorUrl = '/?sent=0#contact';


// Nur POST erlauben

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}


// Honeypot

$honeypotField = 'website';

// Wenn der Bot das unsichtbare Feld ausfüllt: ablehnen.
if (!empty($_POST[$honeypotField] ?? '')) {
    // Absichtlich keine Details verraten.
    header('Location: ' . $successUrl);
    exit;
}


// Daten einlesen

$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$telephone = trim((string) ($_POST['telephone'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));
$privacyConsent = $_POST['privacy_consent'] ?? '';


// Validierung

if ($name === '' || mb_strlen($name) > 150) {
    header('Location: ' . $errorUrl);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: ' . $errorUrl);
    exit;
}

if (mb_strlen($email) > 254) {
    header('Location: ' . $errorUrl);
    exit;
}

if ($telephone === '' || mb_strlen($telephone) > 50) {
    header('Location: ' . $errorUrl);
    exit;
}

if ($message === '' || mb_strlen($message) > 10000) {
    header('Location: ' . $errorUrl);
    exit;
}

// Datenschutz muss akzeptiert worden sein.
if ($privacyConsent !== 'yes') {
    header('Location: ' . $errorUrl);
    exit;
}


// Header Injection verhindern

$name = str_replace(["\r", "\n"], ' ', $name);
$email = str_replace(["\r", "\n"], '', $email);
$telephone = str_replace(["\r", "\n"], ' ', $telephone);


// Email erstellen

$subject = 'Neue Kontaktanfrage über die Website';
$subject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$body =
    "Neue Kontaktanfrage\n" .
    "====================\n\n" .
    "Name: " . $name . "\n" .
    "E-Mail: " . $email . "\n" .
    "Telefon: " . $telephone . "\n" .
    "Datenschutzerklärung akzeptiert: Ja\n\n" .
    "Nachricht:\n" .
    $message . "\n\n";

$headers = [
    'From: Website <' . $sender . '>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8',
    "Content-Transfer-Encoding: 8bit" ,
    'MIME-Version: 1.0',
];


// Versenden

$success = mail(
    $recipient,
    $subject,
    $body,
    implode("\r\n", $headers),
    '-f ' . $sender
);


// Ergebnis

if ($success) {
    header('Location: ' . $successUrl);
    exit;
}

header('Location: ' . $errorUrl);
exit;
