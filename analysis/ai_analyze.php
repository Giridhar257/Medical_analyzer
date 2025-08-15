<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once __DIR__ . '/../db.php'; // <-- Make sure this path is correct
require __DIR__ . '/../vendor/autoload.php';

use Smalot\PdfParser\Parser;

// Gemini API key
$GEMINI_API_KEY = "AIzaSyBkDiycoLijFfxNSxsmuR__XrHdLUb23C8";

// 1. Get report_id
$reportId = $_GET['report_id'] ?? null;
if (!$reportId) {
    echo json_encode(["error" => "Missing report_id"]);
    exit;
}

// 2. Fetch file path
$stmt = $pdo->prepare("SELECT file_path FROM medical_reports WHERE id = ?");
$stmt->execute([$reportId]);
$report = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$report) {
    echo json_encode(["error" => "Report not found"]);
    exit;
}

$filePath = realpath(__DIR__ . '/../' . $report['file_path']);
if (!$filePath || !file_exists($filePath)) {
    echo json_encode(["error" => "File not found"]);
    exit;
}

// 3. Try to extract text from PDF
$pdfText = '';
try {
    $parser = new Parser();
    $pdf = $parser->parseFile($filePath);
    $pdfText = trim($pdf->getText());
} catch (Exception $e) {
    $pdfText = '';
}

// 4. If no text, use OCR (Tesseract)
if (empty($pdfText)) {
    $tempImage = __DIR__ . "/temp_ocr.png";
    // Convert first page of PDF to image (requires Poppler installed)
    $cmd = "\"pdftoppm\" -f 1 -l 1 -singlefile -png \"" . $filePath . "\" \"" . __DIR__ . "/temp_ocr\"";
    shell_exec($cmd);

    $cmd = "\"tesseract\" \"" . __DIR__ . "/temp_ocr.png\" \"" . __DIR__ . "/temp_ocr\" -l eng";
    shell_exec($cmd);


    if (file_exists($tempImage)) {
        $ocrOutputFile = __DIR__ . "/temp_ocr.txt";
        $cmd = "tesseract " . escapeshellarg($tempImage) . " " . escapeshellarg(__DIR__ . "/temp_ocr") . " -l eng";
        shell_exec($cmd);

        if (file_exists($ocrOutputFile)) {
            $pdfText = trim(file_get_contents($ocrOutputFile));
        }
        @unlink($tempImage);
        @unlink($ocrOutputFile);
    }
}

// 5. If still no text, return error
if (empty($pdfText)) {
    echo json_encode([
        "summary" => "Could not extract readable text from the PDF.",
        "recommendations" => [],
        "key_findings" => [],
        "risk_factors" => []
    ]);
    exit;
}

// 6. Prepare Gemini prompt
$prompt = "You are a medical assistant.
Analyze the following medical report and return JSON only, with the keys:
summary (string),
recommendations (array of strings),
key_findings (array of {label, value, status}),
risk_factors (array of {factor, level, color}).

Report Text:
$pdfText";

// 7. Call Gemini API
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=$GEMINI_API_KEY",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ["Content-Type: application/json"],
    CURLOPT_POSTFIELDS => json_encode([
        "contents" => [
            ["parts" => [["text" => $prompt]]]
        ]
    ]),
]);

$response = curl_exec($ch);
if ($response === false) {
    echo json_encode([
        "summary" => "Gemini API request failed: " . curl_error($ch),
        "recommendations" => [],
        "key_findings" => [],
        "risk_factors" => []
    ]);
    curl_close($ch);
    exit;
}
curl_close($ch);

// 8. Parse Gemini response
$data = json_decode($response, true);
$analysisText = $data['candidates'][0]['content']['parts'][0]['text'] ?? "";

// Clean ```json formatting
$cleanJson = preg_replace('/^```json/i', '', trim($analysisText));
$cleanJson = preg_replace('/```$/', '', trim($cleanJson));

// Try to parse JSON
$parsed = json_decode($cleanJson, true);

// 9. Ensure output has all keys
if (json_last_error() !== JSON_ERROR_NONE || !is_array($parsed)) {
    // Fallback: treat whole text as summary
    $parsed = [
        "summary" => $analysisText ?: "No AI summary generated.",
        "recommendations" => [],
        "key_findings" => [],
        "risk_factors" => []
    ];
} else {
    $parsed['summary'] = $parsed['summary'] ?? "";
    $parsed['recommendations'] = $parsed['recommendations'] ?? [];
    $parsed['key_findings'] = $parsed['key_findings'] ?? [];
    $parsed['risk_factors'] = $parsed['risk_factors'] ?? [];
}

// 10. Return structured JSON
echo json_encode($parsed, JSON_PRETTY_PRINT);



?>
