<?php
require_once '../lib/limonade-master/lib/limonade.php';
require_once 'DatabaseAccess.php';
require_once 'utilities.php';

/**
 * Routings festlegen.
 */
dispatch_post('/loginUser', 'loginUser');
dispatch_post('/logoutUser', 'logoutUser');
dispatch_post('/registerUser', 'registerUser');
dispatch_post('/deleteUser', 'deleteUser');

// Minimale Passwortlänge.
define('MIN_PWD_LENGTH', 8);

/**
 * Meldet den User an der Seite an.
 * Gibt die Userdaten und eine Statusnachricht zurück, ob der Login erfolgreich war.
 *
 * @return false|string|void
 */
function loginUser() {
    // Datenbankverbindung aufbauen.
    $dbConnection = new DatabaseAccess;

    // User mit engegebener Email Adresse suchen.
    $dbConnection->prepareStatement("SELECT * FROM users WHERE email = :email AND active = '1'");
    $dbConnection->bindParam(":email", htmlentities($_POST["email"], ENT_QUOTES));
    $dbConnection->executeStatement();
    $result = $dbConnection->fetchAll();

    // Prüfen ob User vorhanden ist, und das angegebene Passwort mit dem gespeicherten Hash übereinstimmt.
    if ($dbConnection->getRowCount() > 0 && password_verify($_POST["password"], $result["data"][0]["password"])) {
        // Am Server speichern, dass der User eingeloggt ist.
        $_SESSION["email"] = $result["data"][0]["email"];
        $_SESSION["isloggedin"] = true;

        $result = setSuccessMessage($result, "Login erfolgreich.");
    }
    else {
        $result = setErrorMessage($result, "Email-passwort Kombination ungültig.");
    }

    // Userdaten und Statusnachrichten zurückgeben.
    return json_encode($result);
}

/**
 * Meldet den User an der Seite ab.
 * Gibt die Userdaten und eine Statusnachricht zurück, ob der Login erfolgreich war.
 *
 * @return false|string|void
 */
function logoutUser() {
    // Am Server speichern, dass der User nicht mehr eingeloggt ist.
    session_unset();

    $result = createSuccessArray("Logout erfolgreich");

    // Statusnachricht zurückgeben.
    return json_encode($result);
}

/**
 * Registriert den User in der Datenbank.
 * Gibt eine Statusnachricht zurück, ob die Registrierung erfolgreich war.
 *
 * @return false|string|void
 */
function registerUser() {
    $result = array();

    // Prüfen ob alle gültigen Felder ausgefüllt wurden.
    if (hasValue($_POST["firstname"]) &&
        hasValue($_POST["lastname"]) &&
        hasValue($_POST["email"]) &&
        hasValue($_POST["password"]) &&
        hasValue($_POST["passwordRepeat"])) {

        // Datenbankverbindung aufbauen.
        $dbConnection = new DatabaseAccess;

        // Prüfen ob die Email Adresse bereits registriert ist.
        $dbConnection->prepareStatement("SELECT * FROM users WHERE email = :email AND active = '1'");
        $dbConnection->bindParam(":email", htmlentities($_POST["email"], ENT_QUOTES));
        $dbConnection->executeStatement();
        $result = $dbConnection->fetchAll();

        // Prüfen ob die Email Adresse gefunden wurde.
        if ($dbConnection->getRowCount() == 0) {
            // Prüfen ob die Email Adresse gültiges Format besitzt.
            if (filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
                // Prüfen ob beide Passwörter übereinstimmen.
                if ($_POST["password"] == $_POST["passwordRepeat"]) {
                    // Prüfen ob die Passwörter die minimale Länge überschreiten.
                    if (strlen($_POST["password"]) >= MIN_PWD_LENGTH) {
                        // Den User in der Datenbank anlegen, Passwort wird gehasht.
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
                $result = setErrorMessage($result, "Email-Adresse ist ungültig.");
            }
        } else {
            $result = setErrorMessage($result, "Email-Adresse ist bereits registriert.");
        }
    } else {
        $result = setErrorMessage($result, "Nicht alle Felder ausgefüllt.");
    }

    // Statusnachricht zurückgeben.
    return json_encode($result);
}

/**
 * Entfernt den User von der Datenbank.
 * Gibt Statusnachricht zurück, ob das Entfernen erfolgreich war.
 *
 * @return false|string|void
 */
function deleteUser() {
    $result = array();

    // Prüfen ob ein Passwort angegeben wurde.
    if (isset($_POST["password"]) && strlen($_POST["password"]) > 0) {
        // Datenbankverbindung aufbauen.
        $dbConnection = new DatabaseAccess;

        // Die Userdaten aus der Datenbank holen.
        $dbConnection->prepareStatement("SELECT * FROM users WHERE email = :email AND active = '1'");
        $dbConnection->bindParam(":email", htmlentities($_POST["email"], ENT_QUOTES));
        $dbConnection->executeStatement();
        $result = $dbConnection->fetchAll();

        // Prüfen ob der User gefunden wurde, und ob das angegebene Passwort mit dem gespeicherten übereinstimmt.
        if ($dbConnection->getRowCount() > 0 && password_verify($_POST["password"], $result["data"][0]["password"])) {
            // Am Server speichern, dass der User nicht mehr eingeloggt ist.
            session_unset();

            // ------------------------------------------------------------------
            // Userdaten aus allen anderen Tabellen löschen, FKs berücksichtigen!
            // ------------------------------------------------------------------

            // Statement zum Löschen aller Daten des Users.
            $sql = <<<'SQL'
DELETE FROM settings WHERE idusers = :idusers;
DELETE FROM notifications WHERE idusers = :idusers;
DELETE FROM messages WHERE idusers = :idusers;
DELETE FROM chats WHERE idusers = :idusers;
DELETE FROM passengers WHERE iddrives IN (SELECT iddrives FROM drives WHERE idusers =:idusers);
DELETE FROM drives WHERE idusers = :idusers;
UPDATE drives SET passengers = passengers - 1 WHERE iddrives IN (SELECT iddrives FROM passengers WHERE isusers=:idusers);
DELETE FROM passengers WHERE idusers = :idusers;
DELETE FROM users WHERE idusers = :idusers;
SQL;

            // Statement ausführen.
            $dbConnection->prepareStatement($sql);
            $dbConnection->bindParam(":idusers", $result["data"][0]["idusers"]);
            $dbConnection->executeStatement();

            $result = $dbConnection->getResultArray();

            // Prüfen ob Statement erfolgreich ausgeführt wurde.
            if (succeeded($result)) {
                $result = setSuccessMessage($result, "Profil erfolgreich gelöscht.");

                // Am Server speichern, dass der User nicht mehr eingeloggt ist.
                session_unset();
            }
            else {
                $result = setErrorMessage($result, "Profil löschen fehlgeschlagen.");
            }

            /*
            // Userdaten aus Tabelle settings löschen.
            $dbConnection->prepareStatement("DELETE FROM settings WHERE idusers = :idusers");
            $dbConnection->bindParam(":idusers", $idusers);
            $dbConnection->executeStatement();

            // Userdaten aus Tabelle notifications löschen.
            $dbConnection->prepareStatement("DELETE FROM notifications WHERE idusers = :idusers");
            $dbConnection->bindParam(":idusers", $idusers);
            $dbConnection->executeStatement();

            // Userdaten aus Tabelle messages löschen.
            $dbConnection->prepareStatement("DELETE FROM messages WHERE idusers = :idusers");
            $dbConnection->bindParam(":idusers", $idusers);
            $dbConnection->executeStatement();

            // Userdaten aus Tabelle chats löschen.
            $dbConnection->prepareStatement("DELETE FROM chats WHERE idusers = :idusers");
            $dbConnection->bindParam(":idusers", $idusers);
            $dbConnection->executeStatement();

            // Alle Fahrten aus Tabelle drives auslesen, die der User anbietet.
            // Alle mitfahrer aus Tabelle passengers löschen, die bei diesen Fahrten mitfahren.
            $dbConnection->prepareStatement("DELETE FROM passengers WHERE iddrives IN (SELECT iddrives FROM drives WHERE idusers =:idusers)");
            $dbConnection->bindParam(":idusers", $idusers);
            $dbConnection->executeStatement();

            // Userdaten aus Tabelle drives löschen.
            $dbConnection->prepareStatement("DELETE FROM drives WHERE idusers = :idusers");
            $dbConnection->bindParam(":idusers", $idusers);
            $dbConnection->executeStatement();

            // Bei allen Fahrten, bei denen der User mitgefahren wäre, die passengers Anzahl
            // in Tabelle drives um eins reduzieren.
            $dbConnection->prepareStatement("UPDATE drives SET passengers = passengers - 1 WHERE iddrives IN (SELECT iddrives FROM passengers WHERE isusers=:idusers)");
            $dbConnection->bindParam(":idusers", $idusers);
            $dbConnection->executeStatement();

            // Alle Fahrten aus Tabelle passengers auslesen, bei denen der User mitfährt.
            // Userdaten aus Tabelle passengers löschen.
            $dbConnection->prepareStatement("DELETE FROM passengers WHERE idusers = :idusers");
            $dbConnection->bindParam(":idusers", $idusers);
            $dbConnection->executeStatement();

            // Userdaten aus der Tabelle users löschen.
            $dbConnection->prepareStatement("DELETE FROM users WHERE idusers = :idusers");
            $dbConnection->bindParam(":idusers", $idusers);
            $dbConnection->executeStatement();
            */
        } else {
            $result = setErrorMessage($result, "Passwort ungültig.");
        }

    } else {
        $result = createErrorArray("Kein Passwort angegeben.");
    }

    // Statusnachricht zurückgeben.
    return json_encode($result);
}

run();