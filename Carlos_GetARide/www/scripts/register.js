/**
 * Registiert den User in der Datenbank.
 * Wenn alle Daten richtig eingegeben wurden, wird der User an die Login Seite weitergeleitet,
 * ansonsten wird eine entsprechende Fehlermeldung angezeigt.
 */
new Vue({
    el: "#app",

    data: {
        errors: [],
        succeeded: false,
        formData: {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            passwordRepeat: ""
        }
    },
    methods: {
        registerUser: function() {
            event.preventDefault();

            // Alle Fehlermeldungen löschen.
            this.errors = [];
            // Vue Objekt innerhalb Callback Funktionen verfügbar machen.
            let vueObject = this;
            // Post Request starten.
            var postRequest = $.post(getAbsPath("php/auth.php?/registerUser"), this.formData, null, "json");

            // Callback Funktionen wenn Request erfolgreich war.
            postRequest.done(function(data) {
                // Prüfen ob das Registrieren erfolgreich war.
                if (succeeded(data)) {
                    // User an die Login Seite weiterleiten.
                    //redirectUser("pages/login/login.html");

                    vueObject.succeeded = true;
                }
                else {
                    // Fehlermeldung hinzufügen.
                    vueObject.errors.push("Registrierung fehlgeschlagen: " + data["statusmessage"]);
                    // Passwort Eingabefelder leeren.
                    vueObject.formData.password = "";
                    vueObject.formData.passwordRepeat = "";
                }
            });

            // Callback Funktionen wenn der Request fehlerhaft war.
            postRequest.fail(function(data) {
                // Fehlermeldung hinzufügen.
                vueObject.errors.push("Server Verbindung fehlgeschlagen.");
                // Passwort Eingabefelder leeren.
                vueObject.formData.password = "";
                vueObject.formData.passwordRepeat = "";
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

