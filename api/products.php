<?php
// إعدادات قاعدة البيانات
$host = 'localhost';
$dbname = 'stilletto';
$username = 'root';
$password = '';

// السماح بالطلبات من أي مصدر (للتطوير فقط)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

try {
    // الاتصال بقاعدة البيانات
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );

    // الحصول على طريقة الطلب
    $method = $_SERVER['REQUEST_METHOD'];
    
    // الحصول على المعاملات من URL
    $action = isset($_GET['action']) ? $_GET['action'] : 'list';
    $productId = isset($_GET['id']) ? intval($_GET['id']) : null;
    $category = isset($_GET['category']) ? $_GET['category'] : null;

    // معالجة الطلبات
    switch ($method) {
        case 'GET':
            handleGet($pdo, $action, $productId, $category);
            break;
        
        case 'POST':
            handlePost($pdo);
            break;
        
        case 'PUT':
            handlePut($pdo, $productId);
            break;
        
        case 'DELETE':
            handleDelete($pdo, $productId);
            break;
        
        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            break;
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error',
        'error' => $e->getMessage()
    ]);
}

// ==================== GET REQUESTS ====================
function handleGet($pdo, $action, $productId, $category) {
    switch ($action) {
        case 'list':
            getProducts($pdo, $category);
            break;
        
        case 'detail':
            if ($productId) {
                getProductDetail($pdo, $productId);
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Product ID is required']);
            }
            break;
        
        case 'new':
            getNewProducts($pdo);
            break;
        
        case 'sale':
            getSaleProducts($pdo);
            break;
        
        case 'search':
            searchProducts($pdo);
            break;
        
        default:
            getProducts($pdo, $category);
            break;
    }
}

// جلب جميع المنتجات
function getProducts($pdo, $category = null) {
    $sql = "SELECT 
                p.id,
                p.name,
                p.description,
                p.category,
                p.base_price,
                p.is_new,
                p.is_on_sale,
                p.created_at,
                GROUP_CONCAT(DISTINCT pi.image_path) as images,
                GROUP_CONCAT(DISTINCT pv.size) as available_sizes,
                GROUP_CONCAT(DISTINCT pv.color) as available_colors,
                MIN(pv.price) as min_price,
                MAX(pv.price) as max_price,
                SUM(pv.stock) as total_stock
            FROM products p
            LEFT JOIN product_images pi ON p.id = pi.product_id
            LEFT JOIN product_variants pv ON p.id = pv.product_id";
    
    $params = [];
    
    if ($category) {
        $sql .= " WHERE p.category = ?";
        $params[] = strtoupper($category);
    }
    
    $sql .= " GROUP BY p.id ORDER BY p.created_at DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $products = $stmt->fetchAll();
    
    // تنسيق البيانات
    $formattedProducts = array_map(function($product) {
        return [
            'id' => $product['id'],
            'name' => $product['name'],
            'description' => $product['description'],
            'category' => $product['category'],
            'price' => $product['base_price'],
            'minPrice' => $product['min_price'],
            'maxPrice' => $product['max_price'],
            'isNew' => (bool)$product['is_new'],
            'isOnSale' => (bool)$product['is_on_sale'],
            'images' => $product['images'] ? explode(',', $product['images']) : [],
            'availableSizes' => $product['available_sizes'] ? array_unique(explode(',', $product['available_sizes'])) : [],
            'availableColors' => $product['available_colors'] ? array_unique(explode(',', $product['available_colors'])) : [],
            'inStock' => $product['total_stock'] > 0,
            'stock' => (int)$product['total_stock'],
            'createdAt' => $product['created_at']
        ];
    }, $products);
    
    echo json_encode([
        'success' => true,
        'count' => count($formattedProducts),
        'products' => $formattedProducts
    ]);
}

// جلب تفاصيل منتج واحد
function getProductDetail($pdo, $productId) {
    // جلب بيانات المنتج الأساسية
    $sql = "SELECT * FROM products WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$productId]);
    $product = $stmt->fetch();
    
    if (!$product) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Product not found']);
        return;
    }
    
    // جلب الصور
    $sql = "SELECT image_path FROM product_images WHERE product_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$productId]);
    $images = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    // جلب المتغيرات (الأحجام والألوان)
    $sql = "SELECT id, size, color, stock, price FROM product_variants WHERE product_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$productId]);
    $variants = $stmt->fetchAll();
    
    // تنظيم البيانات
    $sizes = [];
    $colors = [];
    foreach ($variants as $variant) {
        if ($variant['size'] && !in_array($variant['size'], $sizes)) {
            $sizes[] = $variant['size'];
        }
        if ($variant['color'] && !in_array($variant['color'], $colors)) {
            $colors[] = $variant['color'];
        }
    }
    
    echo json_encode([
        'success' => true,
        'product' => [
            'id' => $product['id'],
            'name' => $product['name'],
            'description' => $product['description'],
            'category' => $product['category'],
            'price' => $product['base_price'],
            'isNew' => (bool)$product['is_new'],
            'isOnSale' => (bool)$product['is_on_sale'],
            'images' => $images,
            'variants' => $variants,
            'availableSizes' => $sizes,
            'availableColors' => $colors,
            'createdAt' => $product['created_at']
        ]
    ]);
}

// جلب المنتجات الجديدة
function getNewProducts($pdo) {
    $sql = "SELECT 
                p.id,
                p.name,
                p.description,
                p.category,
                p.base_price,
                p.is_new,
                p.is_on_sale,
                GROUP_CONCAT(DISTINCT pi.image_path) as images
            FROM products p
            LEFT JOIN product_images pi ON p.id = pi.product_id
            WHERE p.is_new = 1
            GROUP BY p.id
            ORDER BY p.created_at DESC
            LIMIT 20";
    
    $stmt = $pdo->query($sql);
    $products = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'count' => count($products),
        'products' => $products
    ]);
}

// جلب منتجات التخفيضات
function getSaleProducts($pdo) {
    $sql = "SELECT 
                p.id,
                p.name,
                p.description,
                p.category,
                p.base_price,
                p.is_new,
                p.is_on_sale,
                GROUP_CONCAT(DISTINCT pi.image_path) as images
            FROM products p
            LEFT JOIN product_images pi ON p.id = pi.product_id
            WHERE p.is_on_sale = 1
            GROUP BY p.id
            ORDER BY p.created_at DESC
            LIMIT 20";
    
    $stmt = $pdo->query($sql);
    $products = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'count' => count($products),
        'products' => $products
    ]);
}

// البحث عن المنتجات
function searchProducts($pdo) {
    $query = isset($_GET['q']) ? $_GET['q'] : '';
    $minPrice = isset($_GET['min_price']) ? floatval($_GET['min_price']) : 0;
    $maxPrice = isset($_GET['max_price']) ? floatval($_GET['max_price']) : 999999;
    $color = isset($_GET['color']) ? $_GET['color'] : null;
    $size = isset($_GET['size']) ? $_GET['size'] : null;
    
    $sql = "SELECT DISTINCT
                p.id,
                p.name,
                p.description,
                p.category,
                p.base_price,
                p.is_new,
                p.is_on_sale,
                GROUP_CONCAT(DISTINCT pi.image_path) as images
            FROM products p
            LEFT JOIN product_images pi ON p.id = pi.product_id
            LEFT JOIN product_variants pv ON p.id = pv.product_id
            WHERE 1=1";
    
    $params = [];
    
    if ($query) {
        $sql .= " AND (p.name LIKE ? OR p.description LIKE ?)";
        $searchTerm = "%$query%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    if ($minPrice > 0 || $maxPrice < 999999) {
        $sql .= " AND p.base_price BETWEEN ? AND ?";
        $params[] = $minPrice;
        $params[] = $maxPrice;
    }
    
    if ($color) {
        $sql .= " AND pv.color = ?";
        $params[] = $color;
    }
    
    if ($size) {
        $sql .= " AND pv.size = ?";
        $params[] = $size;
    }
    
    $sql .= " GROUP BY p.id ORDER BY p.created_at DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $products = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'count' => count($products),
        'products' => $products
    ]);
}

// ==================== POST REQUESTS ====================
function handlePost($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['name']) || !isset($input['category']) || !isset($input['base_price'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        return;
    }
    
    try {
        $pdo->beginTransaction();
        
        // إدراج المنتج
        $sql = "INSERT INTO products (name, description, category, base_price, is_new, is_on_sale, created_at)
                VALUES (?, ?, ?, ?, ?, ?, NOW())";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $input['name'],
            $input['description'] ?? null,
            strtoupper($input['category']),
            $input['base_price'],
            $input['is_new'] ?? 0,
            $input['is_on_sale'] ?? 0
        ]);
        
        $productId = $pdo->lastInsertId();
        
        // إدراج الصور إذا وجدت
        if (isset($input['images']) && is_array($input['images'])) {
            $sqlImage = "INSERT INTO product_images (product_id, image_path) VALUES (?, ?)";
            $stmtImage = $pdo->prepare($sqlImage);
            
            foreach ($input['images'] as $image) {
                $stmtImage->execute([$productId, $image]);
            }
        }
        
        // إدراج المتغيرات إذا وجدت
        if (isset($input['variants']) && is_array($input['variants'])) {
            $sqlVariant = "INSERT INTO product_variants (product_id, size, color, stock, price) VALUES (?, ?, ?, ?, ?)";
            $stmtVariant = $pdo->prepare($sqlVariant);
            
            foreach ($input['variants'] as $variant) {
                $stmtVariant->execute([
                    $productId,
                    $variant['size'] ?? null,
                    $variant['color'] ?? null,
                    $variant['stock'] ?? 0,
                    $variant['price'] ?? $input['base_price']
                ]);
            }
        }
        
        $pdo->commit();
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Product created successfully',
            'product_id' => $productId
        ]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }
}

// ==================== PUT REQUESTS ====================
function handlePut($pdo, $productId) {
    if (!$productId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Product ID is required']);
        return;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    $sql = "UPDATE products SET 
            name = COALESCE(?, name),
            description = COALESCE(?, description),
            category = COALESCE(?, category),
            base_price = COALESCE(?, base_price),
            is_new = COALESCE(?, is_new),
            is_on_sale = COALESCE(?, is_on_sale)
            WHERE id = ?";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $input['name'] ?? null,
        $input['description'] ?? null,
        isset($input['category']) ? strtoupper($input['category']) : null,
        $input['base_price'] ?? null,
        $input['is_new'] ?? null,
        $input['is_on_sale'] ?? null,
        $productId
    ]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Product updated successfully'
        ]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Product not found or no changes made']);
    }
}

// ==================== DELETE REQUESTS ====================
function handleDelete($pdo, $productId) {
    if (!$productId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Product ID is required']);
        return;
    }
    
    $sql = "DELETE FROM products WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$productId]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Product not found']);
    }
}
?>