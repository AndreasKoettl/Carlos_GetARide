/**
 * Ändert das Passwort des Users.
 * Wenn alle Daten richtig eingegeben wurden, wird der User an die Login Seite weitergeleitet,
 * und muss sich neu anmelden.
 * Ansonsten wird eine entsprechende Fehlermeldung angezeigt.
 */
function resetPassword() {
    event.preventDefault();

    // Eingegebene Formulardaten holen.
    let formData = new FormData($("#reset-password-form")[0]);

    // AJAX-Post Request starten.
    $.post({
        accepts: "application/json",
        dataType: "json",
        async: true,
        contentType: false,
        processData: false,
        url: getAbsPath("php/auth.php?/resetPassword"),
        data: formData,
        success: function (data) {
            // Prüfen ob das Passwort erfolgreich geändert wurde.
            if (data["status"] === "success") {
                // User zur login Seite weiterleiten.
                logoutUser();
            }
            else {
                // Fehlermeldung ausgeben, wenn das Passwort nicht geändert wurde.
                $("#error-message").text("Passwort ändern fehlgeschlagen: " + data["statusmessage"]);
                $("#password").val("");
                $("#password-repeat").val("");
            }
        },
        error: function () {
            $("#error-message").text("Server Verbindung fehlgeschlagen.");
        }
    });
}

/**
 * Initialisiert das Formular zum zurücksetzen des Passwortes.
 *
 * @param paramUser Der Get Parameter der dem Passwort zurücksetzen Link angefügt wurde.
 */
function initResetForm(paramUser) {

    // AJAX-Post Request starten.
    $.post({
        dataType: "json",
        async: true,
        url: getAbsPath("php/auth.php?/resetPasswordLink"),
        data: { "passwordHash": paramUser },
        success: function (data) {
            // Prüfen ob ein entsprechender User existiert.
            if (succeeded(data)) {
                // Email in verstecktes Feld schreiben.
                $("#email").val(data["data"][0]["email"]);
            }
            else {
                // Wenn kein User existiert, an die Startseite weiterleiten.
                redirectUser("index.html");
            }
        },
        error: function () {
            $("#error-message").text("Server Verbindung fehlgeschlagen.");
        }
    });
}

$(document).ready(function () {
    // Get Parameter aus der URL holen.
    let url = new URL(window.location.href);
    let getParamUser = url.searchParams.get("user");

    // Prüfen ob Parameter vorhanden ist.
    if (getParamUser) {
        // Formular zum zurücksetzen des Passworts initialisieren.
        initResetForm(getParamUser);
        $("#reset-password-form").submit(resetPassword);
    } else {
        // User an die Startseite weiterleiten, wenn Parameter nicht gesetzt war.
        redirectUser("index.html");
    }
});