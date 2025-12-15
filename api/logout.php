<?php
// api/logout.php

session_start();

// حذف كل بيانات السيشن
$_SESSION = [];
session_destroy();

// حذف كوكي السيشن (لو موجود)
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

// رد JSON (لو انطلب من fetch)
header("Content-Type: application/json");
echo json_encode([
    "success" => true,
    "message" => "Logged out successfully"
]);
exit;
