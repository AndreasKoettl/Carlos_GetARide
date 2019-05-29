/**
 * Setzt das Passwort des Benutzers zurück.
 * Wenn alle Daten richtig eingegeben wurden, wird dem User eine Mail zugesendet,
 * über den der User sein Passwort zurücksetzen kann.
 * Ansonsten wird eine entsprechende Fehlermeldung angezeigt.
 */
function forgotPassword() {
    event.preventDefault();

    // Eingegebene Formulardaten holen.
    let formData = new FormData($("#forgot-password-form")[0]);

    // AJAX-Post Request starten.
    $.post({
        accepts: "application/json",
        dataType: "json",
        async: true,
        contentType: false,
        processData: false,
        url: getAbsPath("php/auth.php?/forgotPassword"),
        data: formData,
        success: function (data) {
            // Prüfen ob die Mail erfolgreich gesendet wurde.
            if (data["status"] === "success") {
                // Nur zu Testzwecken, im Live Betrieb wird der Link per Mail zugesendet.
                $("#error-message").html('Passwort zurücksetzen: <a href="' + data["data"]["resetlink"] + '">Hier klicken</a>');
            }
            else {
                // Fehlermeldung ausgeben, wenn die Mail nicht gesendet werden konnte.
                $("#error-message").text("Passwort zurücksetzen fehlgeschlagen: " + data["statusmessage"]);
            }
        },
        error: function () {
            $("#error-message").text("Server Verbindung fehlgeschlagen.");
        }
    });
}

$(document).ready(function () {
    // User an die Login Seite weiterleiten, wenn dieser nicht eingeloggt ist.
    redirectNotAuthUser("pages/login/login.html");

    $("#forgot-password-form").submit(forgotPassword);
});