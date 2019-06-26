/**
 * Ändert das Passwort des Users.
 * Wenn alle Daten richtig eingegeben wurden, wird der User an die Login Seite weitergeleitet,
 * und muss sich neu anmelden.
 * Ansonsten wird eine entsprechende Fehlermeldung angezeigt.
 */
new Vue({
    el: "#app",

    data: {
        errors: [],
        succeeded: false,
        formData: {
            email: "",
            password: "",
            passwordRepeat: ""
        }
    },
    methods: {
        resetPassword: function() {
            event.preventDefault();

            // Alle Fehlermeldungen löschen.
            this.errors = [];
            // Vue Objekt innerhalb Callback Funktionen verfügbar machen.
            let vueObject = this;
            // Post Request starten.
            var postRequest = $.post(getAbsPath("php/auth.php?/resetPassword"), this.formData, null, "json");

            // Callback Funktionen wenn Request erfolgreich war.
            postRequest.done(function(data) {
                // Prüfen ob das Registrieren erfolgreich war.
                if (succeeded(data)) {
                    logoutUser();
                    vueObject.succeeded = true;
                }
                else {
                    // Fehlermeldung hinzufügen.
                    vueObject.errors.push("Passwort ändern fehlgeschlagen: " + data["statusmessage"]);
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
        initResetForm: function(paramUser) {
            // Vue Objekt innerhalb Callback Funktionen verfügbar machen.
            let vueObject = this;
            // Post Request starten.
            var postRequest = $.post(getAbsPath("php/auth.php?/resetPasswordLink"), { "passwordHash": paramUser }, null, "json");

            // Callback Funktionen wenn Request erfolgreich war.
            postRequest.done(function(data) {
                // Prüfen ob das Registrieren erfolgreich war.
                if (succeeded(data)) {
                    vueObject.formData.email = data["data"][0]["email"];
                }
                else {
                    // Wenn kein User existiert, an die Startseite weiterleiten.
                    redirectUser("index.html");
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
        // Get Parameter aus der URL holen.
        let url = new URL(window.location.href);
        let getParamUser = url.searchParams.get("user");

        // Prüfen ob Parameter vorhanden ist.
        if (getParamUser) {
            // Formular zum zurücksetzen des Passworts initialisieren.
            this.initResetForm(getParamUser);
        } else {
            // User an die Startseite weiterleiten, wenn Parameter nicht gesetzt war.
            redirectUser("index.html");
        }
    }
});