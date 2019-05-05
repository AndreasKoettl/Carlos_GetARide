<?php

require_once 'DatabaseAccess.php';

// Minimale Passwortlänge.
define('MIN_PWD_LENGTH', 8);

/**
 * Prüft ob eine Variable definiert, ein String ist und einen Wert besitzt.
 * Ein leerer String wird nicht als Wert betrachtet.
 *
 * @param $var
 * @return bool
 */
function hasValue($var): bool {
    return (isset($var) && is_string($var) && strlen($var) > 0);
}

/**
 * Prüft ob der User am Server eingeloggt ist.
 *
 * @return bool
 */
function isLoggedIn(): bool {
    return $_SESSION["isloggedin"];
}

/**
 * Liest die Daten eines Users anhand der gegebenen Email Adresse aus, und gibt diese zurück.
 *
 * @param $email
 * @return array
 */
function getUserByMail($email): array {
    // Datenbankverbindung aufbauen.
    $dbConnection = new DatabaseAccess;

    // Die Userdaten aus der Datenbank holen.
    $dbConnection->prepareStatement("SELECT * FROM users WHERE email = :email AND active = '1'");
    $dbConnection->bindParam(":email", htmlentities($email, ENT_QUOTES));
    $dbConnection->executeStatement();
    $result = $dbConnection->fetchAll();

    return $result;
}

/**
 * Prüft ob ein User mit gegebener Email Adresse vorhanden ist.
 *
 * @param $email
 * @return bool
 */
function userExists($email): bool {
    return count(getUserByMail($email)["data"]) > 0;
}

/**
 * Prüft ob das gegebene Passwort zum gegebenen User gehört.
 *
 * @param $userData
 * @param $password
 * @return bool
 */
function verifyUser($userData, $password): bool {
    return (isset($userData) && isset($password) && count($userData["data"]) > 0 && password_verify($password, $userData["data"][0]["password"]));
}

/**
 * Prüft ob das neue gegebene Passwort gültig ist.
 * password und passwordRepeat müssen ident sein und eine Mindestlänge überschreiten.
 *
 * @param $password
 * @param $passwordRepeat
 * @return bool
 */
function verifyNewPassword($password, $passwordRepeat): bool {
    return $password == $passwordRepeat && strlen($password) >= MIN_PWD_LENGTH;
}