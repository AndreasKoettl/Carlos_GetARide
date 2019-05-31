<?php
require_once '../lib/limonade-master/lib/limonade.php';
require_once 'DatabaseAccess.php';
require_once 'utilities.php';

dispatch('/driver/:iduser', 'loadDriversRides');
dispatch('/codriver/:iduser', 'loadCodriversRides');
dispatch('/codriverDetails/:drives', 'loadCodriversDetails');


function loadDriversRides()
{
	// Datenbankverbindung aufbauen.
	$dbConnection = new DatabaseAccess;

    // Fahrten mit mit gegebenen User als Fahrer suchen.
    $dbConnection->prepareStatement("SELECT * FROM drives WHERE users_idusers = :iduser ORDER BY driveDate ASC");
    $dbConnection->bindParam(":iduser", htmlentities(params("iduser"), ENT_QUOTES));
    $dbConnection->executeStatement();
    $result = $dbConnection->fetchAll();
    // Prüfen ob User vorhanden ist, und das angegebene Passwort mit dem gespeicherten Hash übereinstimmt.
    if ($dbConnection->getRowCount() > 0) {

        $result = setSuccessMessage($result, "Ladevorgang erfolgreich.");
    }
    else {
        $result = setErrorMessage($result, "Keine Fahrten vorhanden.");
    }

    // Userdaten und Statusnachrichten zurückgeben.
    return json_encode($result);
	
}

function loadCodriversRides()
{
	// Datenbankverbindung aufbauen.
	$dbConnection = new DatabaseAccess;
	
    // Fahrten mit mit gegebenen User als Mitfahrer suchen.
    $dbConnection->prepareStatement("SELECT drives_iddrives FROM requests WHERE users_idusers = :iduser");
    $dbConnection->bindParam(":iduser", htmlentities(params("iduser"), ENT_QUOTES));
    $dbConnection->executeStatement();
    $drives = $dbConnection->fetchAll();

	$result["data"] = array();

	foreach ($drives["data"] as $val) {
		$dbConnection->prepareStatement("SELECT * FROM drives WHERE iddrives = :iddrive");
		$dbConnection->bindParam(":iddrive", $val["drives_iddrives"]);
		$dbConnection->executeStatement();
		$singleDrive = $dbConnection->fetchAll();
		array_push($result["data"], $singleDrive["data"]);
	}

	//sort array by driveDate
    $i = 0;
            while ($i < sizeof($result["data"]) - 1) {
                if ($result["data"][$i][0]["driveDate"] > $result["data"][$i+1][0]["driveDate"]) {
                    $tmp = $result["data"][$i][0]["driveDate"];
                    $result["data"][$i][0]["driveDate"] = $result["data"][$i+1][0]["driveDate"];
                    $result["data"][$i+1][0]["driveDate"] = $tmp;
                    $i = 0;
                }
                else {
                    $i++;
                }
            }

    // Prüfen ob User vorhanden ist, und das angegebene Passwort mit dem gespeicherten Hash übereinstimmt.
    if ($dbConnection->getRowCount() > 0) {

        $result = setSuccessMessage($result, "Ladevorgang erfolgreich.");
    }
    else {
        $result = setErrorMessage($result, "Keine Fahrten vorhanden.");
    }
    // Userdaten und Statusnachrichten zurückgeben.
	
    return json_encode($result);
	
}

run();
