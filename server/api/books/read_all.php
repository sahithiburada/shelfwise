<?php

include_once '../../config/database.php';


header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


$database = new Database();
$db = $database->getConnection();

$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$per_page = isset($_GET['per_page']) ? intval($_GET['per_page']) : 10;
$sort_by = isset($_GET['sort_by']) ? $_GET['sort_by'] : 'title';
$sort_order = isset($_GET['sort_order']) ? strtoupper($_GET['sort_order']) : 'ASC';


$valid_sort_fields = ['title', 'author_name', 'genre'];
if(!in_array($sort_by, $valid_sort_fields)) {
    $sort_by = 'title';
}

$valid_sort_orders = ['ASC', 'DESC'];
if(!in_array($sort_order, $valid_sort_orders)) {
    $sort_order = 'ASC';
}


$offset = ($page - 1) * $per_page;


$count_query = "SELECT COUNT(*) as total FROM books";
$count_stmt = $db->prepare($count_query);
$count_stmt->execute();
$total_row = $count_stmt->fetch(PDO::FETCH_ASSOC);
$total_books = $total_row['total'];
$total_pages = ceil($total_books / $per_page);


$query = "SELECT b.id, b.title, b.author_name, b.genre, b.description, b.created_at, b.updated_at, u.first_name, u.last_name, b.user_id 
          FROM books b
          JOIN users u ON b.user_id = u.id
          ORDER BY b.{$sort_by} {$sort_order}
          LIMIT :offset, :per_page";

$stmt = $db->prepare($query);
$stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
$stmt->bindParam(':per_page', $per_page, PDO::PARAM_INT);
$stmt->execute();


if($stmt->rowCount() > 0){
  
    $books_arr = array();
    $books_arr["records"] = array();
    $books_arr["pagination"] = array(
        "total_books" => $total_books,
        "total_pages" => $total_pages,
        "current_page" => $page,
        "per_page" => $per_page
    );
    
  
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
        
        $book_item = array(
            "id" => $id,
            "title" => $title,
            "author_name" => $author_name,
            "genre" => $genre,
            "description" => $description,
            "created_at" => $created_at,
            "updated_at" => $updated_at,
            "added_by" => $first_name . " " . $last_name,
            "user_id" => $user_id
        );
        
        array_push($books_arr["records"], $book_item);
    }
    
   
    http_response_code(200);
    
    
    echo json_encode($books_arr);
} else {
    
    http_response_code(404);
    
    
    echo json_encode(
        array("message" => "No books found.")
    );
}
?>