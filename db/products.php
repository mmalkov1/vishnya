<?php 
	require 'db.php';
	$limit = isset_data ($_GET["limit"], 1000);
	$start = isset_data ($_GET["start"], 0);

	if ($_GET) {
		$request = 'get';
	} elseif ($_POST) {
		$request = 'add';
	} elseif ($_PUT) {
		$request = 'update';
	} elseif ($_DELETE) {
		$request = 'delete';
	}

	function isset_data ($data, $default) {
		if($data) {
			return $data;
		} else {
			return $default;
		}
	}

	function get_products ($limit, $start) {
		require 'db.php';
		$query = "SELECT * FROM acc_products AS t1 LEFT JOIN acc_product_status AS t3 ON t1.product_status = t3.status_id";
		if ($_GET["search"]) {
			$query .= " WHERE product_name LIKE '%{$_GET['search']}%'";
		}	 
		$query_limit = $query." LIMIT {$start}, {$limit}";	 
		$result = mysqli_query($db, $query_limit); 		
		$total = mysqli_query($db, $query);
		$total = mysqli_num_rows($total);
		
		if ($result) {
		    while ($row = mysqli_fetch_assoc($result)) {
		    	$result_price = mysqli_query($db, "SELECT product_price_count, price_id, price_name FROM acc_product_price AS t1 JOIN acc_price AS t2 ON t1.product_price_id=t2.price_id WHERE product_id={$row['product_id']}");
		    	while ($row_price = mysqli_fetch_assoc($result_price)) {
		    		$row['price'][] = $row_price;
		    	}
		    	$result_parent = mysqli_query($db, "SELECT * FROM acc_category WHERE category_id={$row['product_parent']}");
		    	while ($row_category = mysqli_fetch_assoc($result_parent)) {
		    		$row['product_parent'] = '';
		    		$row['product_parent'][] = $row_category;
		    	}
		    	$row['total_products'] = $total;
		    	$arr[] = $row;	
		    }			    
		} else {
			$arr["error"]="Запрос не выполнен";
		}		
		echo json_encode($arr);	
	}

	function get_price () {
		require 'db.php';
		$query = "SELECT * FROM acc_price";
		$result = mysqli_query ($db, $query);
		if ($result) {
			while ($row = mysqli_fetch_assoc($result)) {
				$arr[] = $row;
			}	
		} else {
			$arr["error"] = false;
		}
		echo json_encode($arr);
	}

	function get_category () {
		require 'db.php';
		$query = "SELECT * FROM acc_category WHERE category_id != 1";
		$result = mysqli_query($db, $query);
		if ($result) {
			while ($row = mysqli_fetch_assoc($result)) {
				$arr[] = $row;
			} 
		} else {
			$arr["error"] = false;
		}
		echo json_encode($arr);
	}

	function get_status () {
		require 'db.php';
		$query = "SELECT * FROM acc_product_status";
		$result = mysqli_query($db, $query);
		if ($result) {
			while ($row = mysqli_fetch_assoc($result)) {
				$arr[] = $row;
			} 
		} else {
			$arr["error"] = false;
		}
		echo json_encode($arr);
	}

	function add_products () {
		require 'db.php';
		$column = '';
		$values = '';
		$post = $_POST;
		foreach ($post as $key => $value) {
			if ($key != 'price' AND $key != 'add_products') {
				$column .= "{$key},";
				$values .= "'{$value}',";
			} 
		}	
		$column = substr($column, 0, -1);
		$values = substr($values, 0, -1);
		$query = "INSERT INTO acc_products ({$column}) VALUES ({$values})";
		$result = mysqli_query($db, $query);
		$id = mysqli_insert_id($db);
		foreach ($post as $key => $value) {	
			if ($key = 'price') {
				$value = json_decode($value);
				foreach ($value as $key_price) {	
					$query_price = "INSERT INTO acc_product_price (product_price_count, product_price_id, product_id) VALUES ('{$key_price->product_price_count}', '{$key_price->product_price_id}', '{$id}')";
					mysqli_query($db, $query_price);
				}
			}		 
		}
		
		if ($result) {
			echo json_encode($data['response']=true);
		} else {
			echo json_encode($data['response']=false);
		}
	}

	function add_category () {
		require 'db.php';
		$column = '';
		$values = '';
		$post = $_POST;
		foreach ($post as $key => $value) {
			if ($key != "add_category") {
				$column .= "{$key},";
				$values .= "'{$value}',";
				
			}
		}
		$column = substr($column, 0, -1);
		$values = substr($values, 0, -1);
		$query = "INSERT INTO acc_category ({$column}) VALUES ({$values})";
		$result = mysqli_query($db, $query);
		if ($result) {
			echo json_encode($data['response']=true);
		} else {
			echo json_encode($data['response']=$query);
		}
	}

	if (!mysqli_query($db, "SELECT * FROM acc_products LIMIT 10")) {
	    printf("Errormessage: %s\n", mysqli_error($db));
	}
	$arr = [];

	switch ($request) {
		case 'get':
			if ($_GET["get_products"]) {
				get_products ($limit, $start);
			}
			if ($_GET["get_price"]) {
				get_price ();	
			}
			if ($_GET["get_category"]) {
				get_category ();
			}	
			if ($_GET["get_status"]) {
				get_status ();
			}
			break;
		case 'add':
			if ($_POST["add_products"]) {
				add_products ();
			}
			if ($_POST["add_category"]) {
				add_category ();
			}
			break;
		case 'update':
			
			break;
		case 'delete':
			
			break;		
		default:
			# code...
			break;
	}


	mysqli_close($db);

 ?>

