<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");


error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once "../../config/database.php";
include_once "../../models/book.php";

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$book = new Book($db);


$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$per_page = isset($_GET['per_page']) ? (int)$_GET['per_page'] : 5;
$sort_by = isset($_GET['sort_by']) ? $_GET['sort_by'] : 'title';
$sort_order = isset($_GET['sort_order']) ? $_GET['sort_order'] : 'ASC';
$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;

$offset = ($page - 1) * $per_page;


$allowed_sort_fields = ['title', 'author_name', 'genre'];
$allowed_sort_orders = ['ASC', 'DESC'];

if (!in_array($sort_by, $allowed_sort_fields)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid sort_by parameter"]);
    exit;
}

if (!in_array($sort_order, $allowed_sort_orders)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid sort_order parameter"]);
    exit;
}

try {
    $stmt = $book->read($offset, $per_page, $sort_by, $sort_order, $user_id);
    $num = $stmt->rowCount();

    $records = [];
    if ($num > 0) {
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $record = [
                "id" => $id,
                "title" => $title,
                "author_name" => $author_name,
                "genre" => $genre,
                "description" => $description,
                "user_id" => $user_id
            ];
            array_push($records, $record);
        }
    }

    $total_records = $book->count($user_id);
    $total_pages = ceil($total_records / $per_page);

    
    echo json_encode([
        "records" => $records,
        "pagination" => [
            "total_pages" => $total_pages,
            "current_page" => $page
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>