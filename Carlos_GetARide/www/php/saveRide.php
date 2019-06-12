<?php
require_once '../lib/limonade-master/lib/limonade.php';
require_once 'DatabaseAccess.php';
require_once 'utilities.php';

dispatch_post('/saveRide', 'saveRide');

function saveRide(){
	$data=$_POST["driveData"];		 
	//Decode the JSON string and convert it into a PHP associative array.
	$driveData = json_decode($data, true);
	

	// insert driveData into table drives
	$query="INSERT INTO `drives` (`locationStart`, `locationEnd`, `driveDate`, `passengers`, `maxPassengers`, `dateAdded`, `dateChanged`, `price`, `licensePlate`, `details`, `initialDriveId`, `users_idusers`) 
	VALUES (:start, :destination, :datetime, '0', :maxPassengers, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, :price, :licensePlate, :carDetails, NULL, '1');";
	$dbConnection = new DatabaseAccess;
	$dbConnection->prepareStatement($query);
	$dbConnection->bindParam(":price", htmlentities ($driveData["price"]));
	$dbConnection->bindParam(":start", htmlentities ($driveData["start"]));
	$dbConnection->bindParam(":destination", htmlentities ($driveData["destination"]));	
	$dbConnection->bindParam(":maxPassengers", $driveData["passengers"]);
	if(!$driveData['repeating']){
		$datetime=$driveData["date"] . " " . $driveData["time"] . ":00";	
		$dbConnection->bindParam(":datetime", $datetime);
	} else {
		$dbConnection->bindParam(":datetime", CURRENT_TIMESTAMP);
	}
	$licensePlate=$driveData['licensePlate'] != undefined ? $driveData['licensePlate'] : NULL;			
	$dbConnection->bindParam(":licensePlate", $licensePlate);
	$carDetails= isset($driveData['carDetails']) ? $driveData['carDetails'] : NULL;			
	$dbConnection->bindParam(':carDetails', $carDetails);
	$dbConnection->executeStatement();
	
	// update the initialDriveId if the drive is repeating
	// create all the following drives
	if($driveData["repeating"]){
		// get iddrives of repeating drive
		$query="SELECT max(iddrives) FROM drives;";
		$dbConnection = new DatabaseAccess;
		$dbConnection->prepareStatement($query);
		$dbConnection->executeStatement();
		$result = $dbConnection->fetchAll();		
		$initialDriveId=$result["data"][0]["max(iddrives)"];		

		// set initialDriveId to this id
		$query="UPDATE drives
		SET initialDriveId=:initialDriveId
		WHERE iddrives=:initialDriveId;";
		$dbConnection = new DatabaseAccess;
		$dbConnection->prepareStatement($query);
		$dbConnection->bindParam(":initialDriveId", $initialDriveId);
		$dbConnection->executeStatement();		
		
		// create repeating drives		
		$weekdays = $driveData['weekdays'];			
		for($i=0; $i< sizeof($weekdays); $i++){
			$weekday=$weekdays[$i];
			
		}
	} 		
}

run();

?>

