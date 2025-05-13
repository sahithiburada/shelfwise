<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';

// Enable error reporting for debugging
ini_set('display_errors', 0);
error_reporting(E_ALL);
file_put_contents('php://stderr', print_r("Starting login.php\n", TRUE));

$database = new Database();
$db = $database->getConnection();

if ($db === null) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => "Database connection failed."));
    file_put_contents('php://stderr', print_r("Database connection failed\n", TRUE));
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Email and password are required."));
    exit();
}

$email = trim($data->email);
$password = $data->password;

try {
    $query = "SELECT id, first_name, last_name, email, phone, password FROM users WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $email);
    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode(array("status" => "error", "message" => "Failed to query user."));
        file_put_contents('php://stderr', print_r("User query failed\n", TRUE));
        exit();
    }

    if ($stmt->rowCount() === 0) {
        http_response_code(401);
        echo json_encode(array("status" => "error", "message" => "Invalid credentials."));
        exit();
    }

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(array("status" => "error", "message" => "Invalid credentials."));
        exit();
    }

    $session_id = bin2hex(random_bytes(16));
    $user_data = array(
        "id" => $user['id'],
        "first_name" => $user['first_name'],
        "last_name" => $user['last_name'],
        "email" => $user['email'],
        "phone" => $user['phone']
    );

    http_response_code(200);
    echo json_encode(array(
        "status" => "success",
        "message" => "Login successful.",
        "user" => $user_data,
        "session_id" => $session_id
    ));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => "Database error: " . $e->getMessage()));
    file_put_contents('php://stderr', print_r("Database error: " . $e->getMessage() . "\n", TRUE));
    exit();
}
?>