<?php
require_once "config.php";

/*
  جلب جميع منتجات HEELS
  + أول صورة لكل منتج
  + الأسعار من variants (لو موجودة)
*/

$sql = "
SELECT 
    p.id,
    p.name,
    p.description,
    p.base_price,
    p.is_new,
    p.is_on_sale,
    MIN(pv.price) AS variant_price,
    GROUP_CONCAT(DISTINCT pv.size ORDER BY pv.size) AS sizes,
    GROUP_CONCAT(DISTINCT pv.color) AS colors,
    pi.image_path
FROM products p
LEFT JOIN product_variants pv ON pv.product_id = p.id
LEFT JOIN product_images pi ON pi.product_id = p.id
WHERE p.category = 'HEELS'
GROUP BY p.id
ORDER BY p.created_at DESC
";

$result = $conn->query($sql);

$heels = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {

        $heels[] = [
            "id"          => $row["id"],
            "name"        => $row["name"],
            "description" => $row["description"],
            "price"       => $row["variant_price"] ?? $row["base_price"],
            "base_price"  => $row["base_price"],
            "sizes"       => $row["sizes"] ? explode(",", $row["sizes"]) : [],
            "colors"      => $row["colors"] ? explode(",", $row["colors"]) : [],
            "image"       => $row["image_path"] ?? "heels/default.png",
            "is_new"      => (bool)$row["is_new"],
            "is_on_sale"  => (bool)$row["is_on_sale"]
        ];
    }
}

/* لو بدك JSON (للـ JS / AJAX) */
header("Content-Type: application/json");
echo json_encode($heels, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
