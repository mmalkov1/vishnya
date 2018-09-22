<?php 
require 'db.php';
$limit = isset_data ($_GET["limit"], 10);
$start = isset_data ($_GET["start"], 0);

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
	$request = 'get';
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
	$request = 'add';
} elseif ($_SERVER['REQUEST_METHOD'] == 'PUT') {
	$request = 'update';
} elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
	$request = 'delete';
}

function isset_data ($data, $default) {
	if($data) {
		return $data;
	} else {
		return $default;
	}
}

function get_orders ($limit, $start) {
	require 'db.php';
	$query = "SELECT * FROM acc_orders AS t1 LEFT JOIN acc_order_status AS t3 ON t1.order_status = t3.status_id";
	$result = mysqli_query($db, $query);
	$total = mysqli_num_rows($total);

	if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
    	$result_products = mysqli_query($db, "SELECT * FROM acc_order_products WHERE order_id={$row['order_id']}");
    	$sum = 0;
    	while ($products = mysqli_fetch_assoc($result_products)) {
    		
    		$product_info = mysqli_query($db, "SELECT * FROM acc_products WHERE product_id={$products['product_id']}");
    		while ($info = mysqli_fetch_assoc($product_info)) {
    			$products['product_quantity'] = $info['product_quantity'];
    		}
    		$row['products'][] = $products;
    		$sum += $products['product_price']*$products['product_count'];
    	}
    	$row['total_orders'] = $total;
    	$row['sum_order'] = $sum;
		$arr[] = $row;
   	}
   	echo json_encode($arr);
  }	    	
}

function update_order ($data) {
	require 'db.php';
	$query = "UPDATE acc_order_products SET product_count={$data['product_count']}, product_price={$data['product_price']} WHERE product_id={$data['product_id']}";
	$result = mysqli_query($db, $query);
	if (result) {
		echo true;
	} else {
		echo false;
	}
	mysqli_close($db);
}

function add_product_order ($data) {
	require 'db.php';
	$name = mysqli_real_escape_string($db, $data['product_name']);
	$query = "INSERT INTO acc_order_products (order_id, product_id, product_art, product_name, product_price, product_count, product_unit) VALUES ('{$data['order_id']}','{$data['product_id']}','{$data['product_art']}','{$name}','{$data['product_price']}','{$data['product_count']}','{$data['product_unit']}')";
	$result = mysqli_query($db, $query);
	if (result) {
		echo $query;
	} else {
		echo false;
	}
	mysqli_close($db);
}
switch ($request) {
	case 'get':
		get_orders();
		break;
	
	case 'update':
		update_order ($_REQUEST);
		break;

	case 'add': 
		add_product_order ($_REQUEST);
		break;
	default: 
		echo $_SERVER['REQUEST_METHOD'];
		break;		
}


 ?>