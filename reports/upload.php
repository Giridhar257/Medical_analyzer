<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../cors.php';
require_once '../db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit();
}

if (!isset($_FILES['file']) || !isset($_POST['user_id'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing file or user_id"]);
    exit();
}

$userId = intval($_POST['user_id']);
$uploadDir = __DIR__ . '/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$filename = time() . '_' . basename($_FILES['file']['name']);
$targetFilePath = $uploadDir . $filename;
$filePathForDB = 'reports/uploads/' . $filename; // relative path for DB

if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFilePath)) {
    try {
        $stmt = $pdo->prepare("INSERT INTO medical_reports (user_id, file_name, file_path) VALUES (?, ?, ?)");
        $stmt->execute([$userId, $filename, $filePathForDB]);

        $reportId = $pdo->lastInsertId();
        echo json_encode(["status" => "success", "report_id" => $reportId]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "File upload failed"]);
}
?>
