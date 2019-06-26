<?php

require_once ("DatabaseAccess.php");

$dbConnection = new DatabaseAccess;

$dbConnection->prepareStatement("SELECT * FROM users WHERE idusers = :idusers");
$dbConnection->bindParam(":idusers", $_POST["idusers"]);
$dbConnection->executeStatement();
$result = $dbConnection->fetchAll();

echo json_encode($result);
