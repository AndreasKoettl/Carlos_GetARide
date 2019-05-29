<?php
require_once '../lib/limonade-master/lib/limonade.php';
require_once 'utilities.php';
require_once 'Mail.php';

use \PHPMailer\PHPMailer\PHPMailer;

/**
 * Routings festlegen.
 */
dispatch_post('/loginUser', 'loginUser');
dispatch_post('/logoutUser', 'logoutUser');
dispatch_post('/registerUser', 'registerUser');
dispatch_post('/deleteUser', 'deleteUser');
dispatch_post('/changePassword', 'changePassword');
dispatch_post('/forgotPassword', 'forgotPassword');
dispatch_post('/resetPasswordLink', 'resetPasswordLink');
dispatch_post('/resetPassword', 'resetPassword');

// Dispatch get resetPasswordLink

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
                        $dbConnection->prepareStatement("INSERT INTO users (firstname, lastname, email, password, active, notifications, dateAdded, dateChanged) VALUES (:firstname, :lastname, :email, :password, 1, 1, NOW(), NOW())");
                        $dbConnection->bindParam(":firstname", htmlentities($_POST["firstname"], ENT_QUOTES));
                        $dbConnection->bindParam(":lastname", htmlentities($_POST["lastname"], ENT_QUOTES));
                        $dbConnection->bindParam(":email", htmlentities($_POST["email"], ENT_QUOTES));
                        $dbConnection->bindParam(":password", password_hash(htmlentities($_POST["password"], ENT_QUOTES), PASSWORD_DEFAULT));
                        $dbConnection->executeStatement();

                        $result = setSuccessMessage($result, "Registrierung erfolgreich.");

                        // ----------------------------------------------------
                        // Mail an User schicken, dass Email registriert wurde.
                        // ----------------------------------------------------
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

            // ------------------------------------------------------------------
            // Userdaten aus allen anderen Tabellen löschen, FKs berücksichtigen!
            // ------------------------------------------------------------------

            // Statement zum Löschen aller Daten des Users.
            $sql = <<<'SQL'
DELETE FROM messages WHERE users_idusers = :idusers;
DELETE FROM chats WHERE users_idusers = :idusers;
DELETE FROM requests WHERE drives_iddrives IN (SELECT iddrives FROM drives WHERE users_idusers =:idusers);
DELETE FROM drives WHERE users_idusers = :idusers;
UPDATE drives SET passengers = passengers - 1 WHERE iddrives IN (SELECT drives_iddrives FROM requests WHERE users_idusers=:idusers);
DELETE FROM requests WHERE users_idusers = :idusers;
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
                        $dbConnection->prepareStatement("UPDATE users SET password = :password, dateChanged = NOW() WHERE idusers = :idusers");
                        $dbConnection->bindParam(":idusers", $result["data"][0]["idusers"]);
                        $dbConnection->bindParam(":password", password_hash(htmlentities($_POST["password"], ENT_QUOTES), PASSWORD_DEFAULT));
                        $dbConnection->executeStatement();

                        // ----------------------------------------------------
                        // Mail an User schicken, dass Passwort geändert wurde.
                        // ----------------------------------------------------
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

/**
 * Sendet eine Mail an den User, mit einen Link, über den er das Passwort ändern kann.
 *
 * @return false|string|void
 */
function forgotPassword() {

    $result = array();

    // Prüfen ob Email angegeben wurde.
    if (hasValue($_POST["email"])) {

        // Userdaten anhand Email Adresse abfragen.
        $result = getUserByMail($_POST["email"]);

        // Prüfen ob User gefunden wurde.
        if (count($result["data"]) > 0) {
            // Einstellungen für Mail festlegen.
            // Der Passwort Hash wird als Get Parameter an den Link angehängt.
            // Somit kann später entschieden werden, welches Passwort geändert werden soll.
            $recipientMail = $result["data"][0]["email"];
            $recipientName = $result["data"][0]["firstname"] . " " . $result["data"][0]["lastname"];
            $subject = "Passwort zurücksetzen";
            $link = 'passwort_zuruecksetzen.html?user=' . $result["data"][0]["password"];
            $htmlBody = 'Auf den folgenden Link klicken, um das Passwort zurückzusetzen: <a href="' . $link . '">Passwort zurücksetzen</a>';
            $altBody = 'Auf den folgenden Link klicken, um das Passwort zurückzusetzen: ' . $link;

            // Nur zu Testzecken
            $result["data"]["resetlink"] = $link;

            // Auskommentieren, um tatsächlich Mail zu senden

            // Neue Mail erstellen.
            /*$mail = new Mail($recipientMail, $recipientName, $subject, $htmlBody, $altBody);

            // Prüfen ob Erstellung erfolgreich war.
            if (succeeded($mail->getResultArray())) {
                $mail->send();
                $result = $mail->getResultArray();

                // Prüfen ob Mail erfolgreich gesendet wurde.
                if (succeeded($result)) {*/

            // Datenbankverbindung aufbauen.
            $dbConnection = new DatabaseAccess;

            // Active auf 0 setzen, damit der User sich nicht mehr anmelden kann, bis er sein Passwort ändert.
            $dbConnection->prepareStatement("UPDATE users SET active = 0, dateChanged = NOW() WHERE idusers = :idusers");
            $dbConnection->bindParam(":idusers", $result["data"][0]["idusers"]);
            $dbConnection->executeStatement();

                /*}
            }*/
        } else {
            $result = setErrorMessage($result, "Es existiert kein User mit dieser Email Adresse.");
        }
    } else {
        $result = createErrorArray("Keine Email Adresse angegeben.");
    }

    return json_encode($result);
}

/**
 * Holt die Userdaten anhand des Get Parameters, wenn der User auf den Passwort zurücksetzen Link klickt.
 *
 * @return false|string|void
 */
function resetPasswordLink() {

    $result = array();

    // Prüfen ob ein Get Parameter vorhanden ist.
    if (hasValue($_POST["passwordHash"])) {

        // Datenbankverbindung aufbauen.
        $dbConnection = new DatabaseAccess;

        // Userdaten holen, zu denen der Passwort Hash passt.
        $dbConnection->prepareStatement("SELECT * FROM users WHERE password = :password AND active = 0");
        $dbConnection->bindParam(":password", $_POST["passwordHash"]);
        $dbConnection->executeStatement();
        $result = $dbConnection->fetchAll();

        // Fehlermeldung wenn kein User gefunden wurde.
        if (count($result["data"]) == 0) {
            $result = setErrorMessage($result, "User existiert nicht");
        }
    } else {
        $result = createErrorArray("Ungültiger Passwort zurücksetzen Link.");
    }

    return json_encode($result);
}

/**
 * Aktualisiert das Passwort, wenn der User das Passwort vergessen hat.
 *
 * @return false|string|void
 */
function resetPassword() {

    $result = array();

    // Formulardaten prüfen.
    if (hasValue($_POST["email"]) &&
        hasValue($_POST["password"]) &&
        hasValue($_POST["password-repeat"])) {

        // Userdaten anhand Mail Adresse abfragen.
        $result = getUserByMail($_POST["email"]);

        // Prüfen ob neues Passwort allen Kriterien entspricht.
        if (verifyNewPassword($_POST["password"], $_POST["password-repeat"])) {

            // Datenbankverbindung aufbauen.
            $dbConnection = new DatabaseAccess;

            // Neues Passwort setzen, und User wieder auf aktiv schalten, damit Login wieder möglich ist.
            $dbConnection->prepareStatement("UPDATE users SET password = :password, dateChanged = NOW(), active = 1 WHERE idusers = :idusers");
            $dbConnection->bindParam(":idusers", $result["data"][0]["idusers"]);
            $dbConnection->bindParam(":password", password_hash(htmlentities($_POST["password"], ENT_QUOTES), PASSWORD_DEFAULT));
            $dbConnection->executeStatement();
        } else {
            $result = setErrorMessage($result, "Passwörter müssen mindestens " . MIN_PWD_LENGTH . " Zeichen lang sein und übereinstimmen.");
        }
    } else {
        $result = setErrorMessage($result, "Nicht alle Felder ausgefüllt.");
    }

    return json_encode($result);
}

run();