<?php
require_once '../lib/limonade-master/lib/limonade.php';
require_once 'utilities.php';

/**
 * Routings festlegen.
 */
dispatch_post('/loginUser', 'loginUser');
dispatch_post('/logoutUser', 'logoutUser');
dispatch_post('/registerUser', 'registerUser');
dispatch_post('/deleteUser', 'deleteUser');
dispatch_post('/changePassword', 'changePassword');

/**
 * Meldet den User an der Seite an.
 * Gibt die Userdaten und eine Statusnachricht zurück, ob der Login erfolgreich war.
 *
 * @return false|string|void
 */
function loginUser() {
    // User mit engegebener Email Adresse suchen.
    $result = getUserByMail($_POST["email"]);

    // Prüfen ob User vorhanden ist, und das angegebene Passwort mit dem gespeicherten Hash übereinstimmt.
    if (verifyUser($result, $_POST["password"])) {
        // Gespeicherte Session Variablen löschen.
        session_unset();

        // Am Server speichern, dass der User eingeloggt ist.
        $_SESSION["email"] = $result["data"][0]["email"];
        $_SESSION["isloggedin"] = true;

        $result = setSuccessMessage($result, "Login erfolgreich.");
    }
    else {
        $result = setErrorMessage($result, "Email-Passwort Kombination ungültig.");
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
        hasValue($_POST["password-repeat"])) {

        // Prüfen ob die Email Adresse bereits registriert ist.
        if (!userExists($_POST["email"])) {
            // Prüfen ob die Email Adresse gültiges Format besitzt.
            if (filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
                // Prüfen ob beide Passwörter übereinstimmen.
                if ($_POST["password"] == $_POST["password-repeat"]) {
                    // Prüfen ob die Passwörter die minimale Länge überschreiten.
                    if (strlen($_POST["password"]) >= MIN_PWD_LENGTH) {
                        // Datenbankverbindung aufbauen.
                        $dbConnection = new DatabaseAccess;

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
        $result = getUserByMail($_POST["email"]);

        // Prüfen ob der User gefunden wurde, und ob das angegebene Passwort mit dem gespeicherten übereinstimmt.
        if (verifyUser($result, $_POST["password"])) {
            // Am Server speichern, dass der User nicht mehr eingeloggt ist.
            session_unset();

            // ------------------------------------------------------------------
            // Userdaten aus allen anderen Tabellen löschen, FKs berücksichtigen!
            // ------------------------------------------------------------------

            // Statement zum Löschen aller Daten des Users.
            $sql = <<<'SQL'
DELETE FROM settings WHERE users_idusers = :idusers;
DELETE FROM notifications WHERE users_idusers = :idusers;
DELETE FROM messages WHERE users_idusers = :idusers;
DELETE FROM chats WHERE users_idusers = :idusers;
DELETE FROM passengers WHERE drives_iddrives IN (SELECT iddrives FROM drives WHERE users_idusers =:idusers);
DELETE FROM drives WHERE users_idusers = :idusers;
UPDATE drives SET passengers = passengers - 1 WHERE iddrives IN (SELECT drives_iddrives FROM passengers WHERE users_idusers=:idusers);
DELETE FROM passengers WHERE users_idusers = :idusers;
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
        } else {
            $result = setErrorMessage($result, "Passwort ungültig.");
        }
    } else {
        $result = createErrorArray("Kein Passwort angegeben.");
    }

    // Statusnachricht zurückgeben.
    return json_encode($result);
}

/**
 * Ändert das Passwort eines gegebenen Users.
 *
 * @return false|string|void
 */
function changePassword() {
    $result = array();

    // Prüft ob der User am Server angemeldet ist.
    if (isLoggedIn()) {
        if (hasValue($_POST["password-old"]) &&
            hasValue($_POST["password"]) &&
            hasValue($_POST["password-repeat"])) {

            // Die Userdaten aus der Datenbank holen.
            $result = getUserByMail($_POST["email"]);

            // Prüfen ob das alte Passwort zum User passt.
            if (verifyUser($result, $_POST["password-old"])) {
                // Prüfen ob das neue Passwort alle Kriterien erfüllt.
                if (verifyNewPassword($_POST["password"], $_POST["password-repeat"])) {
                    // Prüfen ob altes und neues Passwort ident sind.
                    if ($_POST["password-old"] != $_POST["password"]) {
                        // Datenbankverbindung aufbauen.
                        $dbConnection = new DatabaseAccess;

                        // Passwort in der Datenbank ändern.
                        $dbConnection->prepareStatement("UPDATE users SET password = :password WHERE idusers = :idusers");
                        $dbConnection->bindParam(":idusers", $result["data"][0]["idusers"]);
                        $dbConnection->bindParam(":password", password_hash(htmlentities($_POST["password"], ENT_QUOTES), PASSWORD_DEFAULT));
                        $dbConnection->executeStatement();
                    } else {
                        $result = setErrorMessage($result, "Das neue Passwort muss sich vom alten unterscheiden.");
                    }
                } else {
                    $result = setErrorMessage($result, "Passwörter müssen mindestens " . MIN_PWD_LENGTH . " Zeichen lang sein und übereinstimmen.");
                }
            } else {
                $result = setErrorMessage($result, "Altes Passwort ist nicht korrekt.");
            }
        } else {
            $result = setErrorMessage($result, "Nicht alle Felder ausgefüllt.");
        }
    } else {
        $result = createErrorArray("User ist nicht eingeloggt.");
    }

    // Statusnachricht zurückgeben.
    return json_encode($result);
}

run();