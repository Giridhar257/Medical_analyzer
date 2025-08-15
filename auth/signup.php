<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../db.php';

// Read JSON body
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['email'], $data['password'], $data['first_name'], $data['last_name'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
    exit();
}

$email = trim($data['email']);
$passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);
$first_name = trim($data['first_name']);
$last_name = trim($data['last_name']);

try {
    // Insert into DB
    $stmt = $pdo->prepare("INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)");
    $stmt->execute([$email, $passwordHash, $first_name, $last_name]);

    echo json_encode(["status" => "success", "message" => "User registered successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Email already exists or database error"]);
}

?>
