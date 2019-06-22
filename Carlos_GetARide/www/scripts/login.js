/**
 * Meldet den User an der Seite an.
 * Bei richtiger Email-Passwort-Kombination wird der User an die Startseite weitergeleitet,
 * ansonsten wird eine entsprechende Fehlermeldung angezeigt.
 */
new Vue({
    el: "#app",

    data: {
        errors: [],
        formData: {
            email: "",
            password: ""
        }
    },
    methods: {
        loginUser: function() {
            event.preventDefault();

            // Alle Fehlermeldungen löschen.
            this.errors = [];
            // Vue Objekt innerhalb Callback Funktionen verfügbar machen.
            let vueObject = this;
            // Post Request starten.
            var postRequest = $.post(getAbsPath("php/auth.php?/loginUser"), this.formData, null, "json");

            // Callback Funktionen wenn Request erfolgreich war.
            postRequest.done(function(data) {
                // Prüfen ob das Anmelden erfolgreich war.
                if (succeeded(data)) {
                    // Userdaten in JSON-String formatieren.
                    let userData = JSON.stringify(data["data"][0]);
                    // Userdaten im local storage speichern.
                    localStorage.setItem(STORAGE_KEY, userData);
                    // User an die Startseite weiterleiten.
                    redirectUser( "index.html");
                }
                else {
                    // Fehlermeldung hinzufügen.
                    vueObject.errors.push("Login fehlgeschlagen: " + data["statusmessage"]);
                    // Passwort Eingabefeld leeren.
                    vueObject.formData.password = "";
                }
            });

            // Callback Funktionen wenn der Request fehlerhaft war.
            postRequest.fail(function(data) {
                // Fehlermeldung hinzufügen.
                vueObject.errors.push("Server Verbindung fehlgeschlagen.");
                // Passwort Eingabefeld leeren.
                vueObject.formData.password = "";
            });
        },
        redirectToRegister: function() {
            redirectUser("pages/login/register.html");
        }
    },
    mounted: function () {
        this.$el.querySelector('#backbutton').classList.add('hide');
        redirectAuthUser("index.html");
    }

});