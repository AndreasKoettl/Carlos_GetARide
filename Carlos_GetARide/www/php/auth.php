<?php
require_once '../lib/limonade-master/lib/limonade.php';
require_once 'DatabaseAccess.php';

dispatch_post('/loginUser', 'loginUser');
dispatch_post('/registerUser', 'registerUser');
dispatch_post('/deleteUser', 'deleteUser');

define('MIN_PWD_LENGTH', 8);

function loginUser() {

    $dbConnection = new DatabaseAccess;

    $dbConnection->prepareStatement("SELECT * FROM users WHERE email = :email AND active = '1'");
    $dbConnection->bindParam(":email", htmlentities($_POST["email"], ENT_QUOTES));
    $dbConnection->executeStatement();
    $result = $dbConnection->fetchAll();

    if ($dbConnection->getRowCount() > 0 && password_verify($_POST["password"], $result["data"][0]["password"])) {
        $_SESSION["email"] = $result["data"][0]["email"];
        $_SESSION["isloggedin"] = true;

        $result = setSuccessMessage($result, "Login erfolgreich.");
    }
    else {
        $result = setErrorMessage($result, "Email-passwort Kombination ungültig.");
    }

    return json_encode($result);
}

function registerUser() {
    $dbConnection = new DatabaseAccess;

    $dbConnection->prepareStatement("SELECT * FROM users WHERE email = :email AND active = '1'");
    $dbConnection->bindParam(":email", htmlentities($_POST["email"], ENT_QUOTES));
    $dbConnection->executeStatement();
    $result = $dbConnection->fetchAll();

    if ($dbConnection->getRowCount() == 0) {
        if (filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
            if (isset($_POST["firstname"]) &&
                isset($_POST["lastname"]) &&
                isset($_POST["email"]) &&
                isset($_POST["password"]) &&
                isset($_POST["passwordRepeat"])) {

                if ($_POST["password"] == $_POST["passwordRepeat"]) {
                    if (strlen($_POST["password"]) >= MIN_PWD_LENGTH) {
                        $dbConnection->prepareStatement("INSERT INTO users (firstname, lastname, email, password, active) VALUES (:firstname, :lastname, :email, :password, 1)");
                        $dbConnection->bindParam(":firstname", htmlentities($_POST["firstname"], ENT_QUOTES));
                        $dbConnection->bindParam(":lastname", htmlentities($_POST["lastname"], ENT_QUOTES));
                        $dbConnection->bindParam(":email", htmlentities($_POST["email"], ENT_QUOTES));
                        $dbConnection->bindParam(":password", password_hash(htmlentities($_POST["password"], ENT_QUOTES), PASSWORD_DEFAULT));
                        $dbConnection->executeStatement();

                        $result = setSuccessMessage($result, "Registrierung erfolgreich.");
                    } else {
                        $result = setErrorMessage($result, "Passwörter müssen mindestens " . MIN_PWD_LENGTH . " Zeichen lang sein.");
                    }
                } else {
                    $result = setErrorMessage($result, "Passwörter stimmen nicht überein.");
                }
            } else {
                $result = setErrorMessage($result, "Nicht alle Felder ausgefüllt.");
            }
        } else {
            $result = setErrorMessage($result, "Email-Adresse ist ungültig.");
        }
    } else {
        $result = setErrorMessage($result, "Email-Adresse ist bereits registriert.");
    }

    return json_encode($result);
}

function deleteUser() {
    $result = array();

    if (isset($_POST["password"]) && strlen($_POST["password"]) > 0) {
        $dbConnection = new DatabaseAccess;

        $dbConnection->prepareStatement("SELECT * FROM users WHERE email = :email AND active = '1'");
        $dbConnection->bindParam(":email", htmlentities($_POST["email"], ENT_QUOTES));
        $dbConnection->executeStatement();
        $result = $dbConnection->fetchAll();

        if ($dbConnection->getRowCount() > 0 && password_verify($_POST["password"], $result["data"][0]["password"])) {
            session_unset();

            $dbConnection->prepareStatement("DELETE FROM users WHERE idusers = :idusers");
            $dbConnection->bindParam(":idusers", $result["data"][0]["idusers"]);
            $dbConnection->executeStatement();

            $result = setSuccessMessage($result, "Profil erfolgreich gelöscht.");
        } else {
            $result = setErrorMessage($result, "Passwort ungültig.");
        }

    } else {
        $result = createErrorArray("Kein Passwort angegeben.");
    }

    return json_encode($result);
}

run();