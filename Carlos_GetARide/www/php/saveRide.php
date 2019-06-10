<?php
require_once '../lib/limonade-master/lib/limonade.php';
require_once 'DatabaseAccess.php';
require_once 'utilities.php';

dispatch_post('/saveRide', 'saveRide');

function saveRide(){
	$data=$_POST["driveData"];		 
	//Decode the JSON string and convert it into a PHP associative array.
	$driveData = json_decode($data, true);

	$datetime=$driveData["date"] . " " . $driveData["time"] . ":00";
	var_dump($datetime);

	$query="INSERT INTO `drives` (`iddrives`, `locationStart`, `locationEnd`, `driveDate`, `passengers`, `maxPassengers`, `dateAdded`, `dateChanged`, `price`, `licensePlate`, `details`, `initialDriveId`, `users_idusers`) 
	VALUES (NULL, :start, :destination, :datetime, '0', :maxPassengers, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, :price, NULL, NULL, NULL, '1');";
	$dbConnection = new DatabaseAccess;
	$dbConnection->prepareStatement($query);
	$dbConnection->bindParam(":price", utf8_encode($driveData["price"]));
	$dbConnection->bindParam(":start", utf8_encode($driveData["start"]));
	$dbConnection->bindParam(":destination", $driveData["destination"]);
	$dbConnection->bindParam(":datetime", $datetime);
	$dbConnection->bindParam(":maxPassengers", $driveData["passengers"]);
	$dbConnection->executeStatement();

	return "success";
}

run();

?>

