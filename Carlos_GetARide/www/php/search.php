﻿<?php
require_once '../lib/limonade-master/lib/limonade.php';
require_once 'utilities.php';


dispatch('/searchRide/:start/:end/:date/:time', 'searchRide');
dispatch('/getUser/:iduser', 'getUserById');
	
        function searchRide()
        {
			$query = array();

			$start = (params('start') == "null") ? "" : params('start');
			$end = (params('end') == "null") ? "" : params('end');
			$date = (params('date') == "null") ? "" : params('date');
			$time = (params('time') == "null") ? "" : params('time');

				
			if(hasValue($start) || hasValue($end)){
				$set = FALSE;
				$query  = "SELECT * FROM drives";

				if (hasValue($start))
				{
				  $query .= " WHERE locationStart = '$start'";
				  $set = TRUE;
				}
			    if (hasValue($end))
			    {
				  $query .= ($set===TRUE ? " AND" : " WHERE") . " locationEnd = '$end'";
				  $set = TRUE;
			    }
	
				$datetime = new Datetime();
				$datetime = $datetime->format('Y-m-d H:i:s');
				
				 if (hasValue($date))
			    {
				  if(hasValue($time)){
					$datetime = $date." ".$time.":00";
				  } 
				  else {
					$datetime = $date." ";
					$dt = new DateTime();
					$dt = $dt->setTime(00, 01);
					$dt = $dt->format('H:i:s');
					$datetime .= $dt;
				  }
				} else {
					if(hasValue($time)){
						$datetime = new DateTime();
						$datetime = $datetime->format('Y-m-d');
						$datetime .= " ".$time.":00";
					} 
				}
					
				$query .= ($set===TRUE ? " AND" : " WHERE") . " driveDate >= '$datetime'";

				$query .= " ORDER BY driveDate ASC";

				$dbConnection = new DatabaseAccess;

				$dbConnection->prepareStatement($query);
				$dbConnection->executeStatement();
				$results = $dbConnection->fetchAll();
				
			} else {
				$results = false;
			}
				

           // if(hasValue($_POST["locationStart"]){
			//	$result = htmlentities($_POST["locationStart"], ENT_QUOTES);
			//}

			return json_encode($results);
        }

		function getUserById(){

			$dbConnection = new DatabaseAccess;
			$dbConnection->prepareStatement("SELECT firstname, lastname FROM users WHERE idusers = :iduser");
			$dbConnection->bindParam(":iduser", htmlentities(params("iduser"), ENT_QUOTES));
			$dbConnection->executeStatement();
			$result = $dbConnection->fetchAll();

			if ($dbConnection->getRowCount() > 0) {
				$result = setSuccessMessage($result, "Ladevorgang erfolgreich.");
			}
			else {
				$result = setErrorMessage($result, "Keine Fahrten vorhanden.");
			}

			return json_encode($result);
		}

run();

?>