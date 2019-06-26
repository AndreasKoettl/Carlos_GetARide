<?php
require_once '../lib/limonade-master/lib/limonade.php';
require_once 'DatabaseAccess.php';
require_once 'utilities.php';

dispatch('/driver/:iduser', 'loadDriversRides');
dispatch('/codriver/:iduser', 'loadCodriversRides');
dispatch('/driverRepeating/:initialDriveId', 'loadDriversRepeatingRides');
dispatch('/driverName/:iddriver', 'loadDriversName');
dispatch('/coDriverNames/:iddrive', 'loadCoDriverNames');
dispatch('/loadRequests', 'loadRequests');
dispatch('/initialDriveId/:iddrive', 'getInitialDriveId');
dispatch('/cancelRide/:iddrive/:iduser', 'cancelRide');
dispatch('/deleteRide/:iddrive', 'deleteRide');
dispatch('/declineRide/:iddrive/:iduser', 'declineRide');
dispatch('/reducePassengers/:iddrive/:iduser', 'reducePassengers');
dispatch('/confirmRequest/:iddrive/:iduser', 'confirmRequest');

function loadDriversRides()
{
	// Datenbankverbindung aufbauen.
	$dbConnection = new DatabaseAccess;

    // Fahrten mit mit gegebenen User als Fahrer suchen.
    $dbConnection->prepareStatement("SELECT * FROM drives WHERE users_idusers = :iduser ORDER BY driveDate ASC");
    $dbConnection->bindParam(":iduser", htmlentities(params("iduser"), ENT_QUOTES));
    $dbConnection->executeStatement();
    $result = $dbConnection->fetchAll();


    // Prüfen ob Fahrten gefunden wurden
    if ($dbConnection->getRowCount() > 0) {

        $result = setSuccessMessage($result, "Ladevorgang erfolgreich.");
    }
    else {
        $result = setErrorMessage($result, "Keine Fahrten vorhanden.");
    }

    // Fahrten und Statusnachrichten zurückgeben.
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

	// Details zu gefundenen Fahrten auslesen
	foreach ($drives["data"] as $val) {
		$dbConnection->prepareStatement("SELECT * FROM drives WHERE iddrives = :iddrive");
		$dbConnection->bindParam(":iddrive", $val["drives_iddrives"]);
		$dbConnection->executeStatement();
		$singleDrive = $dbConnection->fetchAll();

        $accepted = array("accepted" => $val["accepted"]);
        $merged = array_merge($singleDrive["data"], $accepted);
		array_push($result["data"], $merged);
	}

	// result-array nach driveDate sortieren
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

    // Prüfen ob Fahrten gefunden wurden
    if ($dbConnection->getRowCount() > 0) {

        $result = setSuccessMessage($result, "Ladevorgang erfolgreich.");
    }
    else {
        $result = setErrorMessage($result, "Keine Fahrten vorhanden.");
    }
    // Fahrten und Statusnachrichten zurückgeben.
	
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

    // Prüfen ob Fahrten gefunden wurden
    if ($dbConnection->getRowCount() > 0) {

        $result = setSuccessMessage($result, "Ladevorgang erfolgreich.");
    }
    else {
        $result = setErrorMessage($result, "Keine wiederholenden Fahrten vorhanden.");
    }

    // Fahrten und Statusnachrichten zurückgeben.
    return json_encode($result);

}

function loadDriversName()
{
	// Datenbankverbindung aufbauen.
	$dbConnection = new DatabaseAccess;

    // Vor- und Nachnamen von gegebenen Fahrer suchen
    $dbConnection->prepareStatement("SELECT firstname, lastname FROM users WHERE idusers = :iddriver");
    $dbConnection->bindParam(":iddriver", htmlentities(params("iddriver"), ENT_QUOTES));
    $dbConnection->executeStatement();
    $result = $dbConnection->fetchAll();

    for ($i = 0; $i < sizeof($result["data"]); $i++) {
        $result["data"][$i]["firstname"] = html_entity_decode($result["data"][$i]["firstname"]);
        $result["data"][$i]["lastname"] = html_entity_decode($result["data"][$i]["lastname"]);
    }

    if ($dbConnection->getRowCount() > 0) {

        $result = setSuccessMessage($result, "Ladevorgang erfolgreich.");
    }
    else {
        $result = setErrorMessage($result, "Fahrer wurde nicht gefunden.");
    }


    return json_encode($result);
	
}

function loadCoDriverNames()
{
    // Datenbankverbindung aufbauen.
    $dbConnection = new DatabaseAccess;

    // Mitfahrer von gegebener Fahrt suchen.
    $dbConnection->prepareStatement("SELECT users_idusers FROM requests WHERE drives_iddrives = :iddrive");
    $dbConnection->bindParam(":iddrive", htmlentities(params("iddrive"), ENT_QUOTES));
    $dbConnection->executeStatement();
    $idusers = $dbConnection->fetchAll();

    $result["data"] = array();

    for ($i = 0; $i < sizeof($idusers["data"]); $i++) {
        // Userdaten von Mitfahrern auslesen
        $dbConnection->prepareStatement("SELECT * FROM users WHERE idusers = :iduser");
        $dbConnection->bindParam(":iduser", $idusers["data"][$i]["users_idusers"]);
        $dbConnection->executeStatement();
        $user = $dbConnection->fetchAll();

        // auslesen, ob Mitfahrer schon akzeptiert wurde
        $dbConnection->prepareStatement("SELECT accepted FROM requests WHERE users_idusers = :iduser AND drives_iddrives = :iddrive");
        $dbConnection->bindParam(":iduser", $idusers["data"][$i]["users_idusers"]);
        $dbConnection->bindParam(":iddrive", htmlentities(params("iddrive"), ENT_QUOTES));
        $dbConnection->executeStatement();
        $accepted = $dbConnection->fetchAll();

        array_push($user["data"], $accepted["data"]);
        array_push($result["data"], $user["data"]);
    }

    for ($i = 0; $i < sizeof($result["data"]); $i++) {
        $result["data"][$i][0]["firstname"] = html_entity_decode($result["data"][$i][0]["firstname"]);
        $result["data"][$i][0]["lastname"] = html_entity_decode($result["data"][$i][0]["lastname"]);
    }

    if ($dbConnection->getRowCount() > 0) {

        $result = setSuccessMessage($result, "Ladevorgang erfolgreich.");
    }
    else {
        $result = setErrorMessage($result, "Kein Mitfahrer gefunden.");
    }


    return json_encode($result);

}

function loadRequests()
{
    // Datenbankverbindung aufbauen.
    $dbConnection = new DatabaseAccess;
    $result = array();

    // Mitfahrer von gegebener Fahrt suchen.
    $dbConnection->prepareStatement("SELECT * FROM requests");
    $dbConnection->executeStatement();
    $result = $dbConnection->fetchAll();


    if ($dbConnection->getRowCount() > 0) {

        $result = setSuccessMessage($result, "Ladevorgang erfolgreich.");
    }
    else {
        $result = setErrorMessage($result, "Kein Anfragen gefunden.");
    }


    return json_encode($result);

}

function getInitialDriveId()
{
    // Datenbankverbindung aufbauen.
    $dbConnection = new DatabaseAccess;

    // Details zu gegebener Fahrt auslesen
    $dbConnection->prepareStatement("SELECT * FROM drives WHERE iddrives = :iddrive");
    $dbConnection->bindParam(":iddrive", htmlentities(params("iddrive"), ENT_QUOTES));
    $dbConnection->executeStatement();
    $result = $dbConnection->fetchAll();

    if ($dbConnection->getRowCount() > 0) {

        $result = setSuccessMessage($result, "Ladevorgang erfolgreich.");
    }
    else {
        $result = setErrorMessage($result, "Keine Fahrt vorhanden.");
    }


    return json_encode($result);

}

function cancelRide()
{
    // Datenbankverbindung aufbauen.
    $dbConnection = new DatabaseAccess;

    $result = array();

    // Anfrage des gegebenen Users bei gegebener Fahrt löschen
        $dbConnection->prepareStatement("DELETE FROM requests WHERE users_idusers = :iduser AND drives_iddrives = :iddrive");
        $dbConnection->bindParam(":iduser", htmlentities(params("iduser"), ENT_QUOTES));
        $dbConnection->bindParam(":iddrive", htmlentities(params("iddrive"), ENT_QUOTES));
        $dbConnection->executeStatement();
        $result = $dbConnection->fetchAll();


    // Prüfen ob User vorhanden ist, und das angegebene Passwort mit dem gespeicherten Hash übereinstimmt.
    if ($dbConnection->getRowCount() > 0) {

        $result = setSuccessMessage($result, "Ladevorgang erfolgreich.");
    }
    else {
        $result = setErrorMessage($result, "Keine Fahrt vorhanden.");
    }

    // Userdaten und Statusnachrichten zurückgeben.
    return json_encode($result);

}

function deleteRide()
{
    // Datenbankverbindung aufbauen.
    $dbConnection = new DatabaseAccess;

    $result = array();

    // alle Anfragen für gegebene Fahrt löschen
    $dbConnection->prepareStatement("DELETE FROM requests WHERE drives_iddrives = :iddrive");
    $dbConnection->bindParam(":iddrive", htmlentities(params("iddrive"), ENT_QUOTES));
    $dbConnection->executeStatement();
    $deletedRequests = $dbConnection->fetchAll();

    // die gegebene Fahrt selbst löschen
    $dbConnection->prepareStatement("DELETE FROM drives WHERE iddrives = :iddrive");
    $dbConnection->bindParam(":iddrive", htmlentities(params("iddrive"), ENT_QUOTES));
    $dbConnection->executeStatement();
    $result = $dbConnection->fetchAll();

    if ($dbConnection->getRowCount() > 0) {

        $result = setSuccessMessage($result, "Ladevorgang erfolgreich.");
    }
    else {
        $result = setErrorMessage($result, "Keine Fahrt vorhanden.");
    }


    return json_encode($result);

}

function declineRide()
{
    // Datenbankverbindung aufbauen.
    $dbConnection = new DatabaseAccess;

    $result = array();

    // Anfrage von User mit gefundener Id bei gegebener Fahrt löschen
    $dbConnection->prepareStatement("DELETE FROM requests WHERE users_idusers = :iduser AND drives_iddrives = :iddrive");
    $dbConnection->bindParam(":iduser", htmlentities(params("iduser"), ENT_QUOTES));
    $dbConnection->bindParam(":iddrive", htmlentities(params("iddrive"), ENT_QUOTES));
    $dbConnection->executeStatement();
    $result = $dbConnection->fetchAll();


    if ($dbConnection->getRowCount() > 0) {

        $result = setSuccessMessage($result, "Ladevorgang erfolgreich.");
    }
    else {
        $result = setErrorMessage($result, "Keine Anfragen vorhanden.");
    }


    return json_encode($result);

}

function reducePassengers()
{
    // Datenbankverbindung aufbauen.
    $dbConnection = new DatabaseAccess;

    $result = array();

    // Anfrage von User mit gefundener Id bei gegebener Fahrt löschen
    $dbConnection->prepareStatement("DELETE FROM requests WHERE users_idusers = :iduser AND drives_iddrives = :iddrive");
    $dbConnection->bindParam(":iduser", htmlentities(params("iduser"), ENT_QUOTES));
    $dbConnection->bindParam(":iddrive", htmlentities(params("iddrive"), ENT_QUOTES));
    $dbConnection->executeStatement();
    $request = $dbConnection->fetchAll();

    // bei jeweiligen Drive passengers um 1 vermindern
    $dbConnection->prepareStatement("UPDATE drives SET passengers = passengers - 1 WHERE iddrives = :iddrive");
    $dbConnection->bindParam(":iddrive", htmlentities(params("iddrive"), ENT_QUOTES));
    $dbConnection->executeStatement();
    $result = $dbConnection->fetchAll();

    if ($dbConnection->getRowCount() > 0) {

        $result = setSuccessMessage($result, "Ladevorgang erfolgreich.");
    }
    else {
        $result = setErrorMessage($result, "Keine Anfragen vorhanden.");
    }


    return json_encode($result);

}

function confirmRequest()
{
    // Datenbankverbindung aufbauen.
    $dbConnection = new DatabaseAccess;

    $result = array();

    // Details zu gegebener Fahrt auslesen
    $dbConnection->prepareStatement("SELECT * FROM drives WHERE iddrives = :iddrive");
    $dbConnection->bindParam(":iddrive", htmlentities(params("iddrive"), ENT_QUOTES));
    $dbConnection->executeStatement();
    $drive = $dbConnection->fetchAll();

    // wenn maxPassengers noch nicht erreicht ist
    if ($drive["data"][0]["passengers"] < $drive["data"][0]["maxPassengers"]) {

        // accepted bei gegebener Fahrt und gegebenen User auf 1 setzen
        $dbConnection->prepareStatement("UPDATE requests SET accepted = 1 WHERE users_idusers = :iduser AND drives_iddrives = :iddrive");
        $dbConnection->bindParam(":iduser", htmlentities(params("iduser"), ENT_QUOTES));
        $dbConnection->bindParam(":iddrive", htmlentities(params("iddrive"), ENT_QUOTES));
        $dbConnection->executeStatement();
        $request = $dbConnection->fetchAll();

        // bei gegebener Fahrt passengers um 1 erhöhen
        $dbConnection->prepareStatement("UPDATE drives SET passengers = passengers + 1 WHERE iddrives = :iddrive");
        $dbConnection->bindParam(":iddrive", htmlentities(params("iddrive"), ENT_QUOTES));
        $dbConnection->executeStatement();
        $result = $dbConnection->fetchAll();
    }

    if (sizeof($result) > 0) {

        $result = setSuccessMessage($result, "Ladevorgang erfolgreich.");
    }
    else {
        $result = setErrorMessage($result, "Die maximale Anzahl an Mitfahrern ist bereits erreicht." . $lastname);
    }


    return json_encode($result);

}

run();
