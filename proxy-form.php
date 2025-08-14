<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Google Apps Script URL
$googleScriptUrl = 'https://script.google.com/macros/s/AKfycby.../exec';

// Daten weiterleiten
$data = file_get_contents('php://input');
$options = [
    'http' => [
        'header'  => "Content-type: application/json\r\n",
        'method'  => 'POST',
        'content' => $data
    ]
];

$context = stream_context_create($options);
$result = file_get_contents($googleScriptUrl, false, $context);

// Fehlerbehandlung
if ($result === FALSE) {
    http_response_code(500);
    echo json_encode(['error' => 'Proxy-Fehler: Verbindung fehlgeschlagen']);
} else {
    echo $result;
}
?>