<?php
session_start();
header("Content-Type: application/json");
error_reporting(0);

require_once 'config.php'; // يفترض أن $mysqli موجود هنا


if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$action = $_GET['action'] ?? "";

switch ($action) {

  case "get_profile":
    $q = $mysqli->prepare(
      "SELECT full_name,email,phone,profile_image,created_at 
       FROM users WHERE id=?"
    );
    $q->bind_param("i", $user_id);
    $q->execute();
    $u = $q->get_result()->fetch_assoc();

    [$f,$l] = array_pad(explode(" ", $u['full_name'], 2), 2, "");

    echo json_encode([
      "firstName" => $f,
      "lastName" => $l,
      "email" => $u['email'],
      "phone" => $u['phone'],
      "avatar" => $u['profile_image'],
      "registeredDate" => $u['created_at']
    ]);
    break;

  case "update_profile":
    $d = json_decode(file_get_contents("php://input"), true);
    $name = $d['firstName']." ".$d['lastName'];

    $q = $mysqli->prepare(
      "UPDATE users SET full_name=?,email=?,phone=? WHERE id=?"
    );
    $q->bind_param("sssi",$name,$d['email'],$d['phone'],$user_id);
    $q->execute();

    echo json_encode(["success"=>true]);
    break;

  case "change_password":
    $d = json_decode(file_get_contents("php://input"), true);

    $q = $mysqli->prepare("SELECT password_hash FROM users WHERE id=?");
    $q->bind_param("i",$user_id);
    $q->execute();
    $row = $q->get_result()->fetch_assoc();

    if (!password_verify($d['currentPassword'],$row['password_hash'])) {
      echo json_encode(["error"=>"Wrong password"]);
      exit;
    }

    $new = password_hash($d['newPassword'], PASSWORD_DEFAULT);
    $u = $mysqli->prepare("UPDATE users SET password_hash=? WHERE id=?");
    $u->bind_param("si",$new,$user_id);
    $u->execute();

    echo json_encode(["success"=>true]);
    break;

  case "get_orders":
    $q = $mysqli->prepare(
      "SELECT order_number,status,total FROM orders WHERE user_id=?"
    );
    $q->bind_param("i",$user_id);
    $q->execute();
    echo json_encode($q->get_result()->fetch_all(MYSQLI_ASSOC));
    break;

  case "get_wishlist":
    $q = $mysqli->prepare(
      "SELECT p.id,p.name,p.base_price,
      (SELECT image_path FROM product_images WHERE product_id=p.id LIMIT 1) image
      FROM wishlist w JOIN products p ON w.product_id=p.id
      WHERE w.user_id=?"
    );
    $q->bind_param("i",$user_id);
    $q->execute();
    echo json_encode($q->get_result()->fetch_all(MYSQLI_ASSOC));
    break;

  case "remove_wishlist":
    $d = json_decode(file_get_contents("php://input"), true);
    $q = $mysqli->prepare(
      "DELETE FROM wishlist WHERE user_id=? AND product_id=?"
    );
    $q->bind_param("ii",$user_id,$d['product_id']);
    $q->execute();
    echo json_encode(["success"=>true]);
    break;

  case "upload_avatar":
    if (!isset($_FILES['avatar'])) {
      echo json_encode(["error"=>"No file"]);
      exit;
    }

    $dir = "uploads/";
    if (!is_dir($dir)) mkdir($dir,0777,true);

    $name = uniqid()."_".$_FILES['avatar']['name'];
    move_uploaded_file($_FILES['avatar']['tmp_name'],$dir.$name);

    $path = "api/uploads/".$name;

    $q = $mysqli->prepare(
      "UPDATE users SET profile_image=? WHERE id=?"
    );
    $q->bind_param("si",$path,$user_id);
    $q->execute();

    echo json_encode(["path"=>$path]);
    break;

  default:
    echo json_encode(["error"=>"Invalid action"]);
}
