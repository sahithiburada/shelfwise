<?php

include_once '../../config/database.php';


header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


$database = new Database();
$db = $database->getConnection();


$data = json_decode(file_get_contents("php://input"));


$response = array();


if(!empty($data->id) && !empty($data->user_id)){
    
    
    $check_query = "SELECT id FROM books WHERE id = ? AND user_id = ?";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(1, $data->id);
    $check_stmt->bindParam(2, $data->user_id);
    $check_stmt->execute();
    
    if($check_stmt->rowCount() > 0){
       
        $query = "DELETE FROM books WHERE id = ? AND user_id = ?";
        $stmt = $db->prepare($query);
        
        
        $stmt->bindParam(1, $data->id);
        $stmt->bindParam(2, $data->user_id);
        
       
        if($stmt->execute()){
            $response = array(
                "status" => "success",
                "message" => "Book was successfully deleted."
            );
        } else {
            $response = array(
                "status" => "error",
                "message" => "Unable to delete book."
            );
        }
    } else {
        $response = array(
            "status" => "error",
            "message" => "Book not found or you don't have permission to delete it."
        );
    }
} else {
    $response = array(
        "status" => "error",
        "message" => "Book ID and user ID are required."
    );
}

echo json_encode($response);
?>