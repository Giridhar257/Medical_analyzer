<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../db.php';

$data = json_decode(file_get_contents("php://input"), true);
$report_id = $data['report_id'] ?? null;

if (!$report_id) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Report ID is required"]);
    exit();
}

$stmt = $pdo->prepare("DELETE FROM medical_reports WHERE id = ?");
$stmt->execute([$report_id]);

echo json_encode(["status" => "success", "message" => "Report deleted successfully"]);



?>