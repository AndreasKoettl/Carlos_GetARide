/**
 * Setzt das Passwort des Benutzers zurück.
 * Wenn alle Daten richtig eingegeben wurden, wird dem User eine Mail zugesendet,
 * über den der User sein Passwort zurücksetzen kann.
 * Ansonsten wird eine entsprechende Fehlermeldung angezeigt.
 */
redirectAuthUser("index.html");

new Vue({
    el: "#app",

    data: {
        errors: [],
        succeeded: false,
        formData: {
            email: ""
        }
    },
    methods: {
        forgotPassword: function() {
            event.preventDefault();

            // Alle Fehlermeldungen löschen.
            this.errors = [];
            // Vue Objekt innerhalb Callback Funktionen verfügbar machen.
            let vueObject = this;
            // Post Request starten.
            var postRequest = $.post(getAbsPath("php/auth.php?/forgotPassword"), this.formData, null, "json");

            // Callback Funktionen wenn Request erfolgreich war.
            postRequest.done(function(data) {
                // Prüfen ob das Registrieren erfolgreich war.
                if (succeeded(data)) {
                    logoutUser();
                    vueObject.succeeded = true;
                }
                else {
                    // Fehlermeldung hinzufügen.
                    vueObject.errors.push("Passwort zurücksetzen fehlgeschlagen: " + data["statusmessage"]);
                }
            });

            // Callback Funktionen wenn der Request fehlerhaft war.
            postRequest.fail(function(data) {
                // Fehlermeldung hinzufügen.
                vueObject.errors.push("Server Verbindung fehlgeschlagen.");
            });
        },
        redirectToLogin: function() {
            redirectUser("pages/login/login.html");
        }
    },
    mounted: function() {
        redirectAuthUser("index.html");
    }
});