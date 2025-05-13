<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';


ini_set('display_errors', 0);
error_reporting(E_ALL);
file_put_contents('php://stderr', print_r("Starting register.php\n", TRUE));

$database = new Database();
$db = $database->getConnection();

if ($db === null) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => "Database connection failed."));
    file_put_contents('php://stderr', print_r("Database connection failed\n", TRUE));
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->first_name) || !isset($data->last_name) || !isset($data->email) || !isset($data->phone) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Incomplete data provided."));
    exit();
}

$first_name = trim($data->first_name);
$last_name = trim($data->last_name);
$email = trim($data->email);
$phone = trim($data->phone);
$password = $data->password;

if (strlen($first_name) < 3 || strlen($last_name) < 3) {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "First name and last name must be at least 3 characters long."));
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !preg_match("/@gmail\.com$/", $email)) {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Invalid email format. Only Gmail addresses are allowed."));
    exit();
}

if (!preg_match("/^\+[0-9]{1,4}[0-9]{6,14}$/", $phone)) {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Phone number must include country code and be 6 to 14 digits long."));
    exit();
}

if (!preg_match("/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?=.{8,})/", $password)) {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character."));
    exit();
}

try {
    $query = "SELECT id FROM users WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $email);
    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode(array("status" => "error", "message" => "Failed to check email existence."));
        file_put_contents('php://stderr', print_r("Email check query failed\n", TRUE));
        exit();
    }

    if ($stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(array("status" => "error", "message" => "Email already registered."));
        exit();
    }

    $hashed_password = password_hash($password, PASSWORD_BCRYPT);

    $query = "INSERT INTO users (first_name, last_name, email, phone, password) VALUES (:first_name, :last_name, :email, :phone, :password)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':first_name', $first_name);
    $stmt->bindParam(':last_name', $last_name);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':phone', $phone);
    $stmt->bindParam(':password', $hashed_password);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("status" => "success", "message" => "User registered successfully."));
    } else {
        http_response_code(500);
        echo json_encode(array("status" => "error", "message" => "Failed to insert user into database."));
        file_put_contents('php://stderr', print_r("Insert query failed\n", TRUE));
        exit();
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => "Database error: " . $e->getMessage()));
    file_put_contents('php://stderr', print_r("Database error: " . $e->getMessage() . "\n", TRUE));
    exit();
}
?>