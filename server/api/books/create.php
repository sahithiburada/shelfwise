<?php

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Max-Age: 86400"); 
    http_response_code(200);
    exit;
}


header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");


error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once "../../config/database.php";
include_once "../../models/book.php";

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed"]);
    exit;
}

$book = new Book($db);

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['user_id']) || !isset($data['title']) || !isset($data['author_name']) || !isset($data['genre']) ||
    empty($data['user_id']) || empty($data['title']) || empty($data['author_name']) || empty($data['genre'])) {
    http_response_code(400);
    echo json_encode(["message" => "Missing or empty required fields"]);
    exit;
}

$book->user_id = $data['user_id'];
$book->title = $data['title'];
$book->author_name = $data['author_name'];
$book->genre = $data['genre'];
$book->description = $data['description'] ?? '';

if ($book->create()) {
    http_response_code(201);
    echo json_encode(["message" => "Book created successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Failed to create book"]);
}
?>