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

	// insert driveData into table drives
	$query="INSERT INTO `drives` (`locationStart`, `locationEnd`, `cityStart`, `cityEnd`, `driveDate`, `passengers`, `maxPassengers`, `dateAdded`, `dateChanged`, `price`, `licensePlate`, `details`, `initialDriveId`, `users_idusers`) 
	VALUES (:start, :destination, :cityStart, :cityEnd, :datetime, '0', :maxPassengers, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, :price, :licensePlate, :carDetails, NULL, :iduser);";
	$dbConnection = new DatabaseAccess;
	$dbConnection->prepareStatement($query);
	$dbConnection->bindParam(":price", $driveData["price"]);
	$dbConnection->bindParam(":start", $driveData["start"]);
	$dbConnection->bindParam(":cityStart", $driveData["cityStart"]);
	$dbConnection->bindParam(":destination", $driveData["destination"]);
	$dbConnection->bindParam(":cityEnd", $driveData["cityEnd"]);
	$dbConnection->bindParam(":maxPassengers", $driveData["passengers"]);	
	$dbConnection->bindParam(":datetime", $datetime);	
	$licensePlate= isset($driveData["licensePlate"]) ? $driveData["licensePlate"] : NULL;			
	$dbConnection->bindParam(":licensePlate", $licensePlate);
	$carDetails= isset($driveData["carDetails"]) ? $driveData["carDetails"] : NULL;			
	$dbConnection->bindParam(":carDetails", $carDetails);
	$dbConnection->bindParam(":iduser", $driveData["iduser"]);
	$dbConnection->executeStatement();	
	$result=$dbConnection->fetchAll();
    return json_encode($result);
	
	// update the initialDriveId if the drive is repeating
	// create all the following drives
	if($driveData["repeating"]){
		// get iddrives of repeating drive
		$query="SELECT max(iddrives) FROM drives;";		
		$dbConnection->prepareStatement($query);
		$dbConnection->executeStatement();
		$result = $dbConnection->fetchAll();		
		$initialDriveId=$result["data"][0]["max(iddrives)"];		

		// set initialDriveId to this id
		$query="UPDATE drives
		SET initialDriveId=:initialDriveId
		WHERE iddrives=:initialDriveId;";		
		$dbConnection->prepareStatement($query);
		$dbConnection->bindParam(":initialDriveId", $initialDriveId);
		$dbConnection->executeStatement();		
		
		// create repeating drives				
		$weekdays = $driveData['weekdays'];				
		$weekdaysEngl = array("MO" => "Mon", "DI" => "THU", "MI" => "Wed", "DO" => "Thu", "FR" => "Fri", "SA" => "Sat", "SO" => "Sun");			

		for($i=0; $i < sizeof($weekdays); $i++){
			$weekdays[$i]=$weekdaysEngl[$weekdays[$i]];			
		}

        $startDate=strtotime("now");
		$endDate=strtotime('+1 months', $startDate);
		for($i = $startDate; $i <= $endDate; $i = strtotime('+1 day', $i)){
			$date=date('Y M D d', $i);
			for($j=0; $j<sizeof($weekdays); $j++){
				if(strpos($date, $weekdays[$j])){
					$datetime = date('Y-m-d', $i) . " " . $driveData["time"] . ":00";					
					$query="INSERT INTO `drives` (`locationStart`, `locationEnd`, `driveDate`, `passengers`, `maxPassengers`, `dateAdded`, `dateChanged`, `price`, `licensePlate`, `details`, `initialDriveId`, `users_idusers`) 
					VALUES (:start, :destination, :cityStart, :cityDestination, :datetime, '0', :maxPassengers, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, :price, :licensePlate, :carDetails, NULL, :iduser);";					
					$dbConnection->prepareStatement($query);
					$dbConnection->bindParam(":price", htmlentities ($driveData["price"]));
					$dbConnection->bindParam(":start", htmlentities ($driveData["start"]));
					$dbConnection->bindParam(":cityStart", htmlentities ($driveData["cityStart"]));
					$dbConnection->bindParam(":destination", htmlentities ($driveData["destination"]));	
					$dbConnection->bindParam(":cityDestination", htmlentities ($driveData["cityDestination"]));	
					$dbConnection->bindParam(":maxPassengers", $driveData["passengers"]);	
					$dbConnection->bindParam(":datetime", $datetime);	
					$licensePlate= isset($driveData["licensePlate"]) ? $driveData["licensePlate"] : NULL;			
					$dbConnection->bindParam(":licensePlate", $licensePlate);
					$carDetails= isset($driveData["carDetails"]) ? $driveData["carDetails"] : NULL;			
					$dbConnection->bindParam(":carDetails", $carDetails);
					$dbConnection->bindParam(":iduser", $driveData["iduser"]);
					$dbConnection->executeStatement();
				}
			}                  
		}		
	} 		
}

run();

?>

