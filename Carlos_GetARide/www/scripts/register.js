/**
 * Registiert den User in der Datenbank.
 * Wenn alle Daten richtig eingegeben wurden, wird der User an die Login Seite weitergeleitet,
 * ansonsten wird eine entsprechende Fehlermeldung angezeigt.
 */
function registerUser() {
    event.preventDefault();

    // Eingegebene Formulardaten holen.
    let formData = new FormData($("#register-form")[0]);

    // AJAX-Post Request starten.
    $.post({
        accepts: "application/json",
        dataType: "json",
        async: true,
        contentType: false,
        processData: false,
        url: getAbsPath("php/auth.php?/registerUser"),
        data: formData,
        success: function (data) {
            // Prüfen ob die Registrierung erfolgreich war.
            if (data["status"] === "success") {
                // User an die Login Seite weiterleiten.
                redirectUser("pages/login/login.html");
            }
            else {
                // Fehlermeldung ausgeben, wenn die Registrierung nicht erfolgreich war.
                $("#errorMessage").text("Registrierung fehlgeschlagen: " + data["statusmessage"]);
                $("#password").val("");
                $("#passwordRepeat").val("");
            }
        },
        error: function () {
            $("#errorMessage").text("Server Verbindung fehlgeschlagen.");
        }
    });
}

$(document).ready(function () {
    $("#register-form").submit(registerUser);
});