<?php
require_once "config.php";

header("Content-Type: application/json");

$sql = "
SELECT
  p.id,
  p.name,
  p.description,
  p.base_price,
  pi.image_path,
  pv.size,
  pv.color,
  pv.stock
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id
LEFT JOIN product_variants pv ON p.id = pv.product_id
WHERE p.category = 'HEELS'
ORDER BY p.id DESC
";

$result = $conn->query($sql);

$products = [];

while ($row = $result->fetch_assoc()) {
    $id = $row['id'];

    if (!isset($products[$id])) {
        $products[$id] = [
            "id" => $id,
            "name" => $row['name'],
            "description" => $row['description'],
            "price" => $row['base_price'],
            "images" => [],
            "colors" => [],
            "sizes" => []
        ];
    }

    // Add image if exists and not duplicate
    if (!empty($row['image_path']) && !in_array($row['image_path'], $products[$id]["images"])) {
        $products[$id]["images"][] = $row['image_path'];
    }

    // Add color if exists and not duplicate
    if (!empty($row['color']) && !in_array($row['color'], $products[$id]["colors"])) {
        $products[$id]["colors"][] = $row['color'];
    }

    // Add size if exists and not duplicate
    if (!empty($row['size']) && !in_array($row['size'], $products[$id]["sizes"])) {
        $products[$id]["sizes"][] = $row['size'];
    }
}

echo json_encode(array_values($products), JSON_UNESCAPED_SLASHES);