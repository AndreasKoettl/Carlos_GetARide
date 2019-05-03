/**
 * Meldet den User von der Website ab, und leitet ihn an die Login Seite weitergeleitet.
 */
function logoutUser() {
    event.preventDefault();

    // User Daten aus dem local storage holen.
    let userData = JSON.parse(localStorage.getItem(STORAGE_KEY));

    // AJAX-Post Request starten.
    $.post({
        accepts: "application/json",
        dataType: "json",
        async: true,
        contentType: false,
        processData: false,
        url: getAbsPath("php/auth.php?/logoutUser"),
        data: userData,
        success: function (data) {
            // Prüfen ob das Abmelden erfolgreich war.
            if (data["status"] === "success") {
                // User Daten aus dem local storage löschen.
                localStorage.removeItem(STORAGE_KEY);

                // User an die Startseite weiterleiten.
                redirectUser( "pages/login/login.html");
            }
            else {
                // Fehlermeldung ausgeben, wenn die Anmeldung nicht erfolgreich war.
                alert("Login fehlgeschlagen: " + data["statusmessage"]);
            }
        },
        error: function () {
            alert("Server Verbindung fehlgeschlagen.");
        }
    });
}