<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../db.php';

$report_id = $_GET['report_id'] ?? null;

if (!$report_id) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Report ID is required"]);
    exit();
}

$stmt = $pdo->prepare("SELECT * FROM analysis_results WHERE report_id = ?");
$stmt->execute([$report_id]);
$result = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode($result ?: null);

?>
