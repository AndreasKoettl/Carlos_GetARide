<?php
require_once '../lib/limonade-master/lib/limonade.php';
require_once 'utilities.php';


dispatch_post('/searchRide', 'hello');
dispatch_post('/lel', 'lel');
	
        function hello()
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
			    if (hasValue($_POST["dateDrive"]))
			    {
				  $query .= ($set===TRUE ? " AND" : " WHERE") . " driveDate = '$date'";
				}
				if (hasValue($_POST["timeDrive"]))
			    {
				  $query .= ($set===TRUE ? " AND" : " WHERE") . " driveTime = '$time'";
				}
				
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

		function lel()
		{
			
				$set = FALSE;
				$query  = "SELECT * FROM table_name";
				
				if (hasValue($_POST["locationStart"]))
				   {
					  $query .= " WHERE name = '$name'";
					  $set = TRUE;
				   }
				   if (!empty($address))
				   {
					  $query .= ($set===TRUE ? " AND" : " WHERE") . " address = '$address'";
					  $set = TRUE;
				   }
				   if (!empty($country))
				   {
					  $query .= ($set===TRUE ? " AND" : " WHERE") . " country = '$country'";
					}
			
		}
run();

?>