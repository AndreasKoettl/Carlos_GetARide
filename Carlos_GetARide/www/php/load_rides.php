<?php
require_once '../lib/limonade-master/lib/limonade.php';
require_once 'DatabaseAccess.php';
require_once 'utilities.php';

dispatch('/driver/:iduser', 'loadDriversRides');
dispatch('/codriver/:iduser', 'loadCodriversRides');
dispatch('/driverRepeating/:initialDriveId', 'loadDriversRepeatingRides');
dispatch('/driverName/:iddriver', 'loadDriversName');
dispatch('/coDriverNames/:iddrive', 'loadCoDriverNames');
dispatch('/cancelRide/:iddrive/:iduser', 'cancelRide');
dispatch('/deleteRide/:iddrive', 'deleteRide');

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
    $dbConnection->prepareStatement("SELECT drives_iddrives, accepted FROM requests WHERE users_idusers = :iduser");
    $dbConnection->bindParam(":iduser", htmlentities(params("iduser"), ENT_QUOTES));
    $dbConnection->executeStatement();
    $drives = $dbConnection->fetchAll();

	$result["data"] = array();

	foreach ($drives["data"] as $val) {
		$dbConnection->prepareStatement("SELECT * FROM drives WHERE iddrives = :iddrive");
		$dbConnection->bindParam(":iddrive", $val["drives_iddrives"]);
		$dbConnection->executeStatement();
		$singleDrive = $dbConnection->fetchAll();

        $accepted = array("accepted" => $val["accepted"]);
        $merged = array_merge($singleDrive["data"], $accepted);
		array_push($result["data"], $merged);
	}

	//sort array by driveDate
    $i = 0;
            while ($i < sizeof($result["data"]) - 1) {
                if ($result["data"][$i][0]["driveDate"] > $result["data"][$i+1][0]["driveDate"]) {
                    $tmp = $result["data"][$i];
                    $result["data"][$i] = $result["data"][$i+1];
                    $result["data"][$i+1] = $tmp;
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

function loadDriversRepeatingRides()
{
    // Datenbankverbindung aufbauen.
    $dbConnection = new DatabaseAccess;

    // Fahrten mit mit gegebenen User als Fahrer suchen.
    $dbConnection->prepareStatement("SELECT * FROM drives WHERE initialDriveId = :initialDriveId ORDER BY driveDate DESC");
    $dbConnection->bindParam(":initialDriveId", htmlentities(params("initialDriveId"), ENT_QUOTES));
    $dbConnection->executeStatement();
    $result = $dbConnection->fetchAll();
    // Prüfen ob User vorhanden ist, und das angegebene Passwort mit dem gespeicherten Hash übereinstimmt.
    if ($dbConnection->getRowCount() > 0) {

        $result = setSuccessMessage($result, "Ladevorgang erfolgreich.");
    }
    else {
        $result = setErrorMessage($result, "Keine wiederholenden Fahrten vorhanden.");
    }

    // Userdaten und Statusnachrichten zurückgeben.
    return json_encode($result);

}

function loadDriversName()
{
	// Datenbankverbindung aufbauen.
	$dbConnection = new DatabaseAccess;

    // Fahrten mit mit gegebenen User als Fahrer suchen.
    $dbConnection->prepareStatement("SELECT firstname, lastname FROM users WHERE idusers = :iddriver");
    $dbConnection->bindParam(":iddriver", htmlentities(params("iddriver"), ENT_QUOTES));
    $dbConnection->executeStatement();
    $result = $dbConnection->fetchAll();

    for ($i = 0; $i < sizeof($result["data"]); $i++) {
        $result["data"][$i]["firstname"] = html_entity_decode($result["data"][$i]["firstname"]);
        $result["data"][$i]["lastname"] = html_entity_decode($result["data"][$i]["lastname"]);
    }
    // Prüfen ob User vorhanden ist, und das angegebene Passwort mit dem gespeicherten Hash übereinstimmt.
    if ($dbConnection->getRowCount() > 0) {

        $result = setSuccessMessage($result, "Ladevorgang erfolgreich.");
    }
    else {
        $result = setErrorMessage($result, "Fahrer wurde nicht gefunden.");
    }

    // Userdaten und Statusnachrichten zurückgeben.
    return json_encode($result);
	
}

function loadCoDriverNames()
{
    // Datenbankverbindung aufbauen.
    $dbConnection = new DatabaseAccess;

    // Fahrten mit mit gegebenen User als Fahrer suchen.
    $dbConnection->prepareStatement("SELECT users_idusers FROM requests WHERE drives_iddrives = :iddrive");
    $dbConnection->bindParam(":iddrive", htmlentities(params("iddrive"), ENT_QUOTES));
    $dbConnection->executeStatement();
    $idusers = $dbConnection->fetchAll();

    $result["data"] = array();

    for ($i = 0; $i < sizeof($idusers["data"]); $i++) {
        $dbConnection->prepareStatement("SELECT * FROM users WHERE idusers = :iduser");
        $dbConnection->bindParam(":iduser", $idusers["data"][$i]["users_idusers"]);
        $dbConnection->executeStatement();
        $user = $dbConnection->fetchAll();


        $dbConnection->prepareStatement("SELECT accepted FROM requests WHERE users_idusers = :iduser AND drives_iddrives = :iddrive");
        $dbConnection->bindParam(":iduser", $idusers["data"][$i]["users_idusers"]);
        $dbConnection->bindParam(":iddrive", htmlentities(params("iddrive"), ENT_QUOTES));
        $dbConnection->executeStatement();
        $accepted = $dbConnection->fetchAll();

        //$accepted = array("accepted" => $val["accepted"]);
        //$merged = array_merge($user["data"][$i], $accepted["data"][$i][0]);
        array_push($user["data"], $accepted["data"]);
        array_push($result["data"], $user["data"]);
    }

    for ($i = 0; $i < sizeof($result["data"]); $i++) {
        $result["data"][$i][0]["firstname"] = html_entity_decode($result["data"][$i][0]["firstname"]);
        $result["data"][$i][0]["lastname"] = html_entity_decode($result["data"][$i][0]["lastname"]);
    }
    // Prüfen ob User vorhanden ist, und das angegebene Passwort mit dem gespeicherten Hash übereinstimmt.
    if ($dbConnection->getRowCount() > 0) {

        $result = setSuccessMessage($result, "Ladevorgang erfolgreich.");
    }
    else {
        $result = setErrorMessage($result, "Kein Mitfahrer gefunden.");
    }

    // Userdaten und Statusnachrichten zurückgeben.
    return json_encode($result);

}

function cancelRide()
{
    // Datenbankverbindung aufbauen.
    $dbConnection = new DatabaseAccess;

    $dbConnection->prepareStatement("SELECT initialDriveId FROM drives WHERE iddrives = :iddrive");
    $dbConnection->bindParam(":iddrive", htmlentities(params("iddrive"), ENT_QUOTES));
    $dbConnection->executeStatement();
    $initialDriveId = $dbConnection->fetchAll();

    $result = array();

    // überprüfen ob es sich bei Fahrt um wiederholende Fahrt handelt
    //if ($initialDriveId["data"][0]["initialDriveId"] !== htmlentities(params("iddrive"), ENT_QUOTES)) {
        // Fahrt löschen
        $dbConnection->prepareStatement("DELETE FROM requests WHERE users_idusers = :iduser AND drives_iddrives = :iddrive");
        $dbConnection->bindParam(":iduser", htmlentities(params("iduser"), ENT_QUOTES));
        $dbConnection->bindParam(":iddrive", htmlentities(params("iddrive"), ENT_QUOTES));
        $dbConnection->executeStatement();
        $result = $dbConnection->fetchAll();
    //}
    /*else {
        $dbConnection->prepareStatement("SELECT iddrives FROM drives WHERE initialDriveId = :initialDriveId ORDER BY driveDate ASC");
        $dbConnection->bindParam(":initialDriveId", $initialDriveId["data"][0]["initialDriveId"]);
        $dbConnection->executeStatement();
        $nextRides = $dbConnection->fetchAll();

        for ($i = 1; $i < sizeof($nextRides["data"]); $i++) {
            $dbConnection->prepareStatement("UPDATE drives SET initialDriveId = :newInitialDriveId WHERE iddrives = :iddrive");
            $dbConnection->bindParam(":newInitialDriveId", $nextRides["data"][1]["iddrives"]);
            $dbConnection->bindParam(":iddrive", $nextRides["data"][$i]["iddrives"]);
            $dbConnection->executeStatement();
            $newRepetitions = $dbConnection->fetchAll();
        }

        $dbConnection->prepareStatement("DELETE FROM requests WHERE users_idusers = :iduser AND drives_iddrives = :iddrive");
        $dbConnection->bindParam(":iduser", htmlentities(params("iduser"), ENT_QUOTES));
        $dbConnection->bindParam(":iddrive", htmlentities(params("iddrive"), ENT_QUOTES));
        $dbConnection->executeStatement();
        $result = $dbConnection->fetchAll();
    }
*/

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

function deleteRide()
{
    // Datenbankverbindung aufbauen.
    $dbConnection = new DatabaseAccess;

    $dbConnection->prepareStatement("SELECT initialDriveId FROM drives WHERE iddrives = :iddrive");
    $dbConnection->bindParam(":iddrive", htmlentities(params("iddrive"), ENT_QUOTES));
    $dbConnection->executeStatement();
    $initialDriveId = $dbConnection->fetchAll();

    $result = array();

    // überprüfen ob es sich bei Fahrt um wiederholende Fahrt handelt
    if ($initialDriveId["data"][0]["initialDriveId"] !== htmlentities(params("iddrive"), ENT_QUOTES)) {
        // Fahrt löschen
        $dbConnection->prepareStatement("DELETE FROM requests WHERE drives_iddrives = :iddrive");
        $dbConnection->bindParam(":iddrive", htmlentities(params("iddrive"), ENT_QUOTES));
        $dbConnection->executeStatement();
        $result = $dbConnection->fetchAll();
    }
    else {
        $dbConnection->prepareStatement("SELECT iddrives FROM drives WHERE initialDriveId = :initialDriveId ORDER BY driveDate ASC");
        $dbConnection->bindParam(":initialDriveId", $initialDriveId["data"][0]["initialDriveId"]);
        $dbConnection->executeStatement();
        $nextRides = $dbConnection->fetchAll();

        for ($i = 1; $i < sizeof($nextRides["data"]); $i++) {
            $dbConnection->prepareStatement("UPDATE drives SET initialDriveId = :newInitialDriveId WHERE iddrives = :iddrive");
            $dbConnection->bindParam(":newInitialDriveId", $nextRides["data"][1]["iddrives"]);
            $dbConnection->bindParam(":iddrive", $nextRides["data"][$i]["iddrives"]);
            $dbConnection->executeStatement();
            $newRepetitions = $dbConnection->fetchAll();
        }

        $dbConnection->prepareStatement("DELETE FROM requests WHERE users_idusers = :iduser AND drives_iddrives = :iddrive");
        $dbConnection->bindParam(":iduser", htmlentities(params("iduser"), ENT_QUOTES));
        $dbConnection->bindParam(":iddrive", htmlentities(params("iddrive"), ENT_QUOTES));
        $dbConnection->executeStatement();
        $result = $dbConnection->fetchAll();
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
