<?php 
	header('Content-type: application/json; charset=UTF-8');
	$db = mysqli_connect('vishny00.mysql.tools','vishny00_acc', 'xbv2juuf', 'vishny00_acc');
	mysqli_query($db, "SET NAMES 'utf8'"); 

	if (mysqli_connect_errno()) {
	    printf("Connect failed: %s\n", mysqli_connect_error());
	    exit();
	}
?>