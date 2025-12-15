<?php
// ============================================
// AUTH.PHP - User Authentication using MySQLi
// ============================================

header('Content-Type: application/json');
session_start();

require_once 'config.php'; // يفترض أن $mysqli موجود هنا

// التحقق من الاتصال
if (!$mysqli || $mysqli->connect_errno) {
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed',
        'debug' => $mysqli->connect_error ?? ''
    ]);
    exit;
}

// قراءة البيانات من JSON
$input = json_decode(file_get_contents('php://input'), true);
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

// التحقق من الحقول المطلوبة
if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'error' => 'Email and password are required']);
    exit;
}

try {
    // تحضير استعلام لجلب المستخدم
    $stmt = $mysqli->prepare("SELECT id, full_name, email, password_hash, phone, role, profile_image, created_at FROM users WHERE email = ? LIMIT 1");
    if (!$stmt) throw new Exception('Prepare failed: ' . $mysqli->error);

    $stmt->bind_param("s", $email);
    if (!$stmt->execute()) throw new Exception('Execute failed: ' . $stmt->error);

    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    // التحقق من وجود المستخدم
    if (!$user || !password_verify($password, $user['password_hash'])) {
        echo json_encode(['success' => false, 'error' => 'Invalid email or password']);
        $stmt->close();
        exit;
    }

    // تحديث آخر تسجيل دخول
    $updateStmt = $mysqli->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
    if ($updateStmt) {
        $updateStmt->bind_param("i", $user['id']);
        $updateStmt->execute();
        $updateStmt->close();
    }

    // حفظ بيانات الجلسة
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_role'] = $user['role'];

    // تقسيم الاسم الكامل
    $nameParts = explode(' ', trim($user['full_name']));
    $firstName = $nameParts[0];
    $lastName = count($nameParts) > 1 ? implode(' ', array_slice($nameParts, 1)) : '';

    // تجهيز البيانات للإرسال
    $userData = [
        'id' => (int)$user['id'],
        'firstName' => $firstName,
        'lastName' => $lastName,
        'fullName' => $user['full_name'],
        'email' => $user['email'],
        'phone' => $user['phone'],
        'role' => $user['role'],
        'profileImage' => $user['profile_image'],
        'lastLogin' => date('Y-m-d H:i:s'),
        'createdAt' => $user['created_at']
    ];

    // تحديد صفحة التحويل بناءً على الدور
    $redirect = ($user['role'] === 'ADMIN') ? './admin.html' : 'api/home.php';

    echo json_encode([
        'success' => true,
        'user' => $userData,
        'role' => $user['role'],
        'redirect' => $redirect,
        'message' => 'Login successful'
    ]);

    $stmt->close();

} catch (Exception $e) {
    error_log("Auth error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Authentication failed. Please try again.',
        'debug' => $e->getMessage() // يمكن حذفه في الإنتاج
    ]);
}

$mysqli->close();
?>
