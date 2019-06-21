/**
 * Meldet den User an der Seite an.
 * Bei richtiger Email-Passwort-Kombination wird der User an die Startseite weitergeleitet,
 * ansonsten wird eine entsprechende Fehlermeldung angezeigt.
 */
function loginUser() {
    event.preventDefault();

    // Eingegebene Formulardaten holen.
    let formData = new FormData($("#login-form")[0]);

    // AJAX-Post Request starten.
    $.post({
        accepts: "application/json",
        dataType: "json",
        async: true,
        contentType: false,
        processData: false,
        url: getAbsPath("php/auth.php?/loginUser"),
        data: formData,
        success: function (data) {
            // Prüfen ob das Anmelden erfolgreich war.
            if (data["status"] === "success") {
                // Userdaten in JSON-String formatieren.
                let userData = JSON.stringify(data["data"][0]);

                // Userdaten im local storage speichern.
                localStorage.setItem(STORAGE_KEY, userData);

                // User an die Startseite weiterleiten.
                redirectUser( "index.html");
            }
            else {
                // Fehlermeldung ausgeben, wenn die Anmeldung nicht erfolgreich war.
                $("#error-message").text("Login fehlgeschlagen: " + data["statusmessage"]);
                $("#password").val("");
            }
        },
        error: function () {
            $("#error-message").text("Server Verbindung fehlgeschlagen.");
        }
    });
}


function goToRegister() {
    redirectUser("pages/login/register.html");
}

$(document).ready(function () {
    // User an die Startseite weiterleiten, wenn dieser bereits eingeloggt ist.
    redirectAuthUser("index.html");

    $("#login-form").submit(loginUser);
    $("#register-button").click(goToRegister);
});