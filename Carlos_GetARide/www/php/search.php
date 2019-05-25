<?php
require_once '../lib/limonade-master/lib/limonade.php';
require_once 'utilities.php';


dispatch_post('/searchRide', 'searchRide');
dispatch_post('/getUser/:iduser', 'getUserById');
	
        function searchRide()
        {
			$query = array();
				
			if(hasValue($_POST["locationStart"]) || hasValue($_POST["locationEnd"])){
				$set = FALSE;
				$query  = "SELECT * FROM drives";

				$start = $_POST["locationStart"];
				$end = $_POST["locationEnd"];
				$date = $_POST["dateDrive"];
				$time = $_POST["timeDrive"];
				
				if (hasValue($_POST["locationStart"]))
				{
				  $query .= " WHERE locationStart = '$start'";
				  $set = TRUE;
				}
			    if (hasValue($_POST["locationEnd"]))
			    {
				  $query .= ($set===TRUE ? " AND" : " WHERE") . " locationEnd = '$end'";
				  $set = TRUE;
			    }
	
				$datetime = new Datetime();
				$datetime = $datetime->format('Y-m-d H:i:s');
				
				 if (hasValue($_POST["dateDrive"]))
			    {
				  if(hasValue($_POST["timeDrive"])){
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
					if(hasValue($_POST["timeDrive"])){
						$datetime = new DateTime();
						$datetime = $datetime->format('Y-m-d');
						$datetime .= " ".$time.":00";
					} 
				}
					
				$query .= ($set===TRUE ? " AND" : " WHERE") . " driveDate >= '$datetime'";

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