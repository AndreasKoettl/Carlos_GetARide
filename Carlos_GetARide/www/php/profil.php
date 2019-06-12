﻿<?php
require_once '../lib/limonade-master/lib/limonade.php';
require_once 'utilities.php';


dispatch('/loadUserData/:iduser', 'loadUserData');
dispatch_post('/saveUserData/:iduser/:firstname/:lastname/:email', 'saveUserData');
dispatch_post('/changeNotifications/:iduser/:setNotification', 'toggleNotifications');

function loadUserData(){

		$dbConnection = new DatabaseAccess;
		$dbConnection->prepareStatement("SELECT firstname, lastname, email, notifications FROM users WHERE idusers = :iduser");
		$dbConnection->bindParam(":iduser", htmlentities(params("iduser"), ENT_QUOTES));
		$dbConnection->executeStatement();
		$result = $dbConnection->fetchAll();
				
		if ($dbConnection->getRowCount() > 0) {
			$result = setSuccessMessage($result, "Ladevorgang erfolgreich.");
		}
		else {
			$result = setErrorMessage($result, "User nicht vorhanden.");
		}
		return json_encode($result);
}

function saveUserData(){
		$result = array();

		$dbConnection = new DatabaseAccess;
		$dbConnection->prepareStatement("UPDATE users SET firstname = :firstname, lastname = :lastname, email = :email WHERE idusers = :iduser");
		
		$dbConnection->bindParam(":iduser", htmlentities(params("iduser"), ENT_QUOTES));
		$dbConnection->bindParam(":firstname", htmlentities(params("firstname"), ENT_QUOTES));
		$dbConnection->bindParam(":lastname", htmlentities(params("lastname"), ENT_QUOTES));
		$dbConnection->bindParam(":email", htmlentities(params("email"), ENT_QUOTES));
		$dbConnection->executeStatement();

		$result = setSuccessMessage($result, "Daten erfolgreich aktualisiert.");

		return json_encode($result);
}

function toggleNotifications(){
		$result = array();

		$dbConnection = new DatabaseAccess;
		$dbConnection->prepareStatement("UPDATE users SET notifications = :setNotification WHERE idusers = :iduser");
		$dbConnection->bindParam(":iduser", htmlentities(params("iduser"), ENT_QUOTES));
		$dbConnection->bindParam(":setNotification", htmlentities(params("setNotification"), ENT_QUOTES));
		$dbConnection->executeStatement();

		$result = setSuccessMessage($result, "Notifications aktualisiert.");

		return json_encode($result);
}

run();

?>