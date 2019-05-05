/**
 * Ändert das Passwort des Users.
 * Wenn alle Daten richtig eingegeben wurden, wird der User an die Login Seite weitergeleitet,
 * und muss sich neu anmelden.
 * Ansonsten wird eine entsprechende Fehlermeldung angezeigt.
 */
function changePassword() {
    event.preventDefault();

    // User Daten aus dem local storage holen.
    let userData = JSON.parse(localStorage.getItem(STORAGE_KEY));

    // Eingegebene Formulardaten holen.
    let formData = new FormData($("#change-password-form")[0]);

    // Email des Users an die Formulardaten anhängen.
    formData.append("email", userData["email"]);

    // AJAX-Post Request starten.
    $.post({
        accepts: "application/json",
        dataType: "json",
        async: true,
        contentType: false,
        processData: false,
        url: getAbsPath("php/auth.php?/changePassword"),
        data: formData,
        success: function (data) {
            // Prüfen ob das Passwort erfolgreich geändert wurde.
            if (data["status"] === "success") {
                // User ausloggen.
                logoutUser();
            }
            else {
                // Fehlermeldung ausgeben, wenn die Registrierung nicht erfolgreich war.
                $("#error-message").text("Passwort ändern fehlgeschlagen: " + data["statusmessage"]);
                $("#password-old").val("");
                $("#password").val("");
                $("#password-repeat").val("");
            }
        },
        error: function () {
            $("#error-message").text("Server Verbindung fehlgeschlagen.");
        }
    });
}

$(document).ready(function () {
    // User an die Startseite weiterleiten, wenn dieser bereits eingeloggt ist.
    redirectNotAuthUser("pages/login/login.html");

    $("#change-password-form").submit(changePassword);
});