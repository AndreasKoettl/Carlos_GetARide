/**
 * Entfernt den User aus der Datenbank, meldet ihn ab, und leitet ihn an die Login Seite weiter.
 */
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
            email: "",
            password: ""
        }

    },
    methods: {
        deleteUser: function() {
            event.preventDefault();

            // User Daten aus dem local storage holen und an Formulardaten anhängen
            let userData = JSON.parse(localStorage.getItem(STORAGE_KEY));
            this.formData.email = userData["email"];

            // Alle Fehlermeldungen löschen.
            this.errors = [];
            // Vue Objekt innerhalb Callback Funktionen verfügbar machen.
            let vueObject = this;
            // Post Request starten.
            var postRequest = $.post(getAbsPath("php/auth.php?/deleteUser"), this.formData, null, "json");

            // Callback Funktionen wenn Request erfolgreich war.
            postRequest.done(function(data) {
                // Prüfen ob das Profil entfernen erfolgreich war.
                if (succeeded(data)) {
                    // User Daten aus dem local storage löschen.
                    localStorage.removeItem(STORAGE_KEY);
                    vueObject.$el.querySelector('#backbutton').classList.add('hide');
                    vueObject.succeeded = true;
                }
                else {
                    // Fehlermeldung hinzufügen.
                    vueObject.errors.push("Profil entfernen fehlgeschlagen: " + data["statusmessage"]);
                    // Passwort Eingabefelder leeren.
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
        redirectToHome: function() {
            redirectUser("index.html");
        },
        redirectToLogin: function() {
            redirectUser("pages/login/login.html");
        },
        redirectToRegister: function() {
            redirectUser("pages/login/register.html");
        },
        redirectToProfile: function () {
            redirectUser("pages/profil/profil.html");
        }
    },
    mounted: function() {
        redirectNotAuthUser("pages/login/login.html");
    }
});
