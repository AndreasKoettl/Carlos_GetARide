<?php
require_once '../lib/limonade-master/lib/limonade.php';
require_once 'DatabaseAccess.php';

dispatch_post('/loginUser', 'loginUser');
function loginUser() {

    $dbConnection = new DatabaseAccess;

    $dbConnection->prepareStatement("SELECT * FROM users WHERE email = :email AND active = '1'");
    $dbConnection->bindParam(":email", htmlentities($_POST["email"], ENT_QUOTES));
    $dbConnection->executeStatement();
    $result = $dbConnection->fetchAll();

    // if ($dbConnection->getRowCount() > 0 && password_verify($_POST["password"], $result["data"][0]["password"]))
    if ($dbConnection->getRowCount() > 0 && ($_POST["password"] == $result["data"][0]["password"])) {
        $_SESSION["username"] = $result["data"][0]["email"];
        $_SESSION["isloggedin"] = true;

        $result = setSuccessMessage($result, "Login erfolgreich.");
    }
    else {
        $result = setErrorMessage($result, "Email-passwort Kombination ungültig.");
    }

    return json_encode($result);
}
run();