<?php
require_once 'utilities.php';

    $filename = $_FILES['profile-picture-upload']['name'];
    $iduser = $_POST['iduser'];
    $fileExtension = pathinfo($filename, PATHINFO_EXTENSION);
    $sourcePath = $_FILES['profile-picture-upload']['tmp_name'];
    $targetPath = "../images/profilePictures/" . $iduser . "." . $fileExtension;

    move_uploaded_file($sourcePath, $targetPath);

    $dbConnection = new DatabaseAccess;
    $dbConnection->prepareStatement("UPDATE users SET profileImageUrl = :profileImagePath WHERE idusers = :iduser");
    $dbConnection->bindParam(":profileImagePath", "../" . $targetPath);
    $dbConnection->bindParam(":iduser", $iduser);
    $dbConnection->executeStatement();

    $file = 'profil.html';
    header('Location: '. '../pages/profil/'.$file);

?>