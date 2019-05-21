<?php
require_once '../lib/limonade-master/lib/limonade.php';
require_once 'utilities.php';


dispatch_post('/searchRide', 'searchRide');
	
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
	
			//	 if (hasValue($_POST["dateDrive"]))
			//    {
			//	  if(hasValue($_POST["timeDrive"])){
			//		$datetime = $date." ".$time;
			//	  } else {
			//		$datetime = $date." ";
			//		$dt = new DateTime()->format('H:i:s');
			//		$datetime .= $dt;
			//	  }
			//	} else {
			//		if(hasValue($_POST["timeDrive"])){
			//			$datetime = new DateTime()->format('Y-m-d');
			//			$datetime .= " ".$time;
			//		} else{
			//			$datetime = new DateTime()->format('Y-m-d H:i:s');
			//		}
			//	}
					

				$datetime= $date." ".$time;
				$query .= ($set===TRUE ? " AND" : " WHERE") . " driveDate = '$datetime'";

				$dbConnection = new DatabaseAccess;

				$dbConnection->prepareStatement($query);
				$dbConnection->executeStatement();
				$results = $dbConnection->fetchAll();
				
			
			} else {
				$results = "Please enter a start or end location";
			}
				

           // if(hasValue($_POST["locationStart"]){
			//	$result = htmlentities($_POST["locationStart"], ENT_QUOTES);
			//}

			return json_encode($results);
        }
run();

?>