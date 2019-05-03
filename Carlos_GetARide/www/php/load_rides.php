<?php
require_once '../lib/limonade-master/lib/limonade.php';
require_once 'DatabaseAccess.php';
require_once 'utilities.php';

dispatch('/upcoming/:iduser', 'loadUpcomingRides');


function loadUpcomingRides()
{
	// Datenbankverbindung aufbauen.
	$dbConnection = new DatabaseAccess;

    // User mit engegebener Email Adresse suchen.
    $dbConnection->prepareStatement("SELECT * FROM drives WHERE users_idusers = :iduser");
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

run();
