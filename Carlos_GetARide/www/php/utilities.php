<?php

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