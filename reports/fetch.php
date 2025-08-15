<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../db.php';

if (!isset($_GET['report_id'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing report_id"]);
    exit();
}

$report_id = intval($_GET['report_id']);

try {
    $stmt = $pdo->prepare("SELECT * FROM analysis_results WHERE report_id = ?");
    $stmt->execute([$report_id]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        echo json_encode($result);
    } else {
        echo json_encode(["status" => "error", "message" => "No analysis found"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}




?>