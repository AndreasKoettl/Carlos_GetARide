<?php
require_once '../lib/limonade-master/lib/limonade.php';
require_once 'DatabaseAccess.php';
require_once 'utilities.php';

header("Access-Control-Allow-Origin: *");

dispatch_post('/saveRide', 'saveRide');

function saveRide(){
	$data=$_POST["driveData"];		 
	//Decode the JSON string and convert it into a PHP associative array.
	$driveData = json_decode($data, true);		
	$dbConnection = new DatabaseAccess;		
	
	if($driveData["repeating"]){				
		// replace German weekdays with English
		$driveData['weekdaysString']="";		
		$weekdays = $driveData['weekdays'];				
		$weekdaysEngl = array("MO" => "Mon", "DI" => "THU", "MI" => "Wed", "DO" => "Thu", "FR" => "Fri", "SA" => "Sat", "SO" => "Sun");			
		for($i=0; $i < sizeof($weekdays); $i++){
			$driveData['weekdaysString'] .= " " . $weekdays[$i];		
			$weekdays[$i]=$weekdaysEngl[$weekdays[$i]];			
		}
		var_dump($driveData['weekdaysString']);

		// create repeating drives
		$isInitialDrive = true;
        $startDate = strtotime($driveData['startDate']);
		$endDate = strtotime($driveData['endDate']);
		for($i = $startDate; $i <= $endDate; $i = strtotime('+1 day', $i)){
			$date=date('Y M D d', $i);
			for($j=0; $j<sizeof($weekdays); $j++){
				if(strpos($date, $weekdays[$j])){
					$datetime = date('Y-m-d', $i) . " " . $driveData["time"] . ":00";	
					$driveData["datetime"]=$datetime;
					insertDrive($dbConnection, $driveData);
					if($isInitialDrive){
						// get iddrives of repeating first drive
						$query="SELECT max(iddrives) FROM drives;";		
						$dbConnection->prepareStatement($query);
						$dbConnection->executeStatement();
						$result = $dbConnection->fetchAll();		
						$initialDriveId=$result["data"][0]["max(iddrives)"];
						$driveData["initialDriveId"] = $initialDriveId;
		
						// set initialDriveId for first drive to it's own id
						$query="UPDATE drives
						SET initialDriveId=:initialDriveId
						WHERE iddrives=:initialDriveId;";		
						$dbConnection->prepareStatement($query);
						$dbConnection->bindParam(":initialDriveId", $initialDriveId);
						$dbConnection->executeStatement();	
						$isInitialDrive=false;
					}
				}
			}                  
		}		
	} else {
		$driveData["datetime"]= $driveData['date'] . " " . $driveData["time"] . ":00";	
		insertDrive($dbConnection, $driveData);
	}
}

function insertDrive($dbConnection, $driveData){
// insert driveData into table drives
	$query="INSERT INTO `drives` (`locationStart`, `locationEnd`, `cityStart`, `cityEnd`, `driveDate`, `passengers`, `maxPassengers`, `dateAdded`, `dateChanged`, `weekDays`, `price`, `licensePlate`, `details`, `initialDriveId`, `users_idusers`) 
	VALUES (:start, :destination, :cityStart, :cityEnd, :datetime, '0', :maxPassengers, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, :weekdays, :price, :licensePlate, :carDetails, :initialDriveId, :iduser);";	
	$dbConnection->prepareStatement($query);
	$dbConnection->bindParam(":price", $driveData["price"]);
	$dbConnection->bindParam(":start", $driveData["start"]);
	$dbConnection->bindParam(":cityStart", $driveData["cityStart"]);
	$dbConnection->bindParam(":destination", $driveData["destination"]);
	$dbConnection->bindParam(":cityEnd", $driveData["cityEnd"]);
	$dbConnection->bindParam(":maxPassengers", $driveData["passengers"]);	
	$dbConnection->bindParam(":datetime", $driveData["datetime"]);
	$weekdays = isset($driveData["weekdaysString"]) ? $driveData["weekdaysString"] : NULL;			
	$dbConnection->bindParam(":weekdays", $weekdays);
	$licensePlate = isset($driveData["licensePlate"]) ? $driveData["licensePlate"] : NULL;			
	$dbConnection->bindParam(":licensePlate", $licensePlate);
	$carDetails = isset($driveData["carDetails"]) ? $driveData["carDetails"] : NULL;			
	$dbConnection->bindParam(":carDetails", $carDetails);
	$dbConnection->bindParam(":iduser", $driveData["iduser"]);
	$initialDriveId = isset($driveData["initialDriveId"]) ? $driveData["initialDriveId"] : NULL;
	$dbConnection->bindParam(":initialDriveId", $initialDriveId);
	$dbConnection->executeStatement();	
	$result=$dbConnection->fetchAll();
    return json_encode($result);
}

run();

?>

