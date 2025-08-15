<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../db.php';

// Get request body (JSON or form-data)
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// If no JSON, try form-data
if (!$data && isset($_POST['report_id'])) {
    $data = $_POST;
}

// Validate required fields
if (
    !isset($data['report_id'], $data['summary'], $data['recommendations'], 
    $data['key_findings'], $data['risk_factors'])
) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing fields"]);
    exit();
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO analysis_results (report_id, summary, recommendations, key_findings, risk_factors)
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $data['report_id'],
        $data['summary'],
        $data['recommendations'],
        $data['key_findings'],
        $data['risk_factors']
    ]);

    echo json_encode(["status" => "success", "message" => "Analysis saved successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}



?>