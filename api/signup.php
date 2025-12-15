<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");


if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method not allowed"
    ]);
    exit;
}

require_once __DIR__ . "/config.php";

$data = json_decode(file_get_contents("php://input"), true);

if (
    empty($data["firstName"]) ||
    empty($data["lastName"]) ||
    empty($data["email"]) ||
    empty($data["password"])
) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields"
    ]);
    exit;
}

$fullName = trim($data["firstName"] . " " . $data["lastName"]);
$email = strtolower(trim($data["email"]));
$password = $data["password"];
$phone = $data["phone"] ?? null;

/* validations */
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid email"
    ]);
    exit;
}

if (strlen($password) < 8) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Password must be at least 8 characters"
    ]);
    exit;
}

try {
    // تحقق من البريد الإلكتروني
    $stmt = $mysqli->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        http_response_code(409);
        echo json_encode([
            "success" => false,
            "message" => "Email already exists"
        ]);
        exit;
    }

    $stmt->close();

    // تشفير كلمة المرور
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    // إدراج المستخدم الجديد
    $stmt = $mysqli->prepare("
        INSERT INTO users (full_name, email, password_hash, phone, role)
        VALUES (?, ?, ?, ?, 'USER')
    ");
    $stmt->bind_param("ssss", $fullName, $email, $passwordHash, $phone);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Account created successfully"
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Failed to register user",
            "error" => $stmt->error
        ]);
    }

    $stmt->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Serve error",
        "error" => $e->getMessage()
    ]);
}
