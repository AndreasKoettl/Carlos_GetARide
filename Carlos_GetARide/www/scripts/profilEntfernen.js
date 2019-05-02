/**
 * Entfernt den User aus der Datenbank, meldet ihn ab, und leitet ihn an die Login Seite weiter.
 */
function deleteUser() {
    event.preventDefault();

    // User Daten aus dem local storage holen.
    let userData = JSON.parse(localStorage.getItem(STORAGE_KEY));

    // Eingegebene Formulardaten holen.
    let formData = new FormData($("#profilEntfernen-form")[0]);

    // Email des Users an die Formulardaten anhängen.
    formData.append("email", userData["email"]);

    // AJAX-Post Request starten.
    $.post({
        accepts: "application/json",
        dataType: "json",
        async: true,
        contentType: false,
        processData: false,
        url: getAbsPath("php/auth.php?/deleteUser"),
        data: formData,
        success: function (data) {
            // Prüfen ob das Profil entfernt wurde.
            if (data["status"] === "success") {
                // User Daten aus dem local storage löschen.
                localStorage.removeItem(STORAGE_KEY);

                // User an die Login Seite weiterleiten.
                redirectUser("pages/login/login.html");
            } else {
                // Fehlermeldung ausgeben, wenn das Profil nicht entfernt werden konnte.
                $("#errorMessage").text("Profil entfernen fehlgeschlagen: " + data["statusmessage"]);
                $("#password").val("");
            }
        },
        error: function () {
            $("#errorMessage").text("Server Verbindung fehlgeschlagen");
        }
    });
}

$(document).ready(function () {
    // User an die Login Seite weiterleiten, wenn dieser nicht eingeloggt ist.
    redirectNotAuthUser("pages/login/login.html");

    $("#profilEntfernen-form").submit(deleteUser);
});