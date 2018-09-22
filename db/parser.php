<?php
require 'db.php';

function parse_photo ($id) {
	require 'db.php';
	$query = "SELECT ID, guid FROM acc_posts WHERE ID = {$id}";
	$result_photo = mysqli_query($db, $query);
	while ($row = mysqli_fetch_assoc($result_photo)) {
		return $row["guid"];
	}
}

$result = mysqli_query($db,	"SELECT * FROM acc_products");

if ($result) {
	while ($row = mysqli_fetch_assoc($result)) { 
		$query = "UPDATE acc_products SET product_photo = '".parse_photo ($row['product_art'])."' WHERE product_id =".$row['product_id'];
		echo $query."<br>";
		mysqli_query($db, $query);
		echo $row['product_id']."<br>";
	}
}

// $query = "UPDATE acc_products SET product_photo =''";
// mysqli_query($db, $query);
 ?>