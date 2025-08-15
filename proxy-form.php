<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Debug: Log to a simple file for now (replace with actual Google Sheets integration)
$logFile = 'contact_submissions.log';

try {
    // Get JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        throw new Exception('Ungültige JSON-Daten erhalten');
    }
    
    // Validate required fields
    if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
        throw new Exception('Pflichtfelder fehlen');
    }
    
    // Create log entry
    $logEntry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'name' => $data['name'] ?? '',
        'email' => $data['email'] ?? '',
        'topic' => $data['topic'] ?? '',
        'message' => $data['message'] ?? '',
        'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? ''
    ];
    
    // Write to log file
    $logLine = json_encode($logEntry) . "\n";
    file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);
    
    // TODO: Replace this with actual Google Sheets API integration
    // For now, we'll simulate success after logging
    
    echo json_encode([
        'success' => true,
        'message' => 'Daten erfolgreich verarbeitet',
        'id' => uniqid('contact_')
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>