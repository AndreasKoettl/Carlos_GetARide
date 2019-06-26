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
            passwordOld: "",
            password: "",
            passwordRepeat: ""
        },
        isScrolling: false
    },
    methods: {
        changePassword: function() {
            event.preventDefault();

            // User Daten aus dem local storage holen und an Formulardaten anhängen
            let userData = JSON.parse(localStorage.getItem(STORAGE_KEY));
            this.formData.email = userData["email"];

            // Alle Fehlermeldungen löschen.
            this.errors = [];
            // Vue Objekt innerhalb Callback Funktionen verfügbar machen.
            let vueObject = this;
            // Post Request starten.
            var postRequest = $.post(getAbsPath("php/auth.php?/changePassword"), this.formData, null, "json");

            // Callback Funktionen wenn Request erfolgreich war.
            postRequest.done(function(data) {
                // Prüfen ob das Passwort ändern erfolgreich war.
                if (succeeded(data)) {
                    // User ausloggen.
                    logoutUser();
                    vueObject.$el.querySelector('#backbutton').classList.add('hide');
                    vueObject.succeeded = true;
                }
                else {
                    // Fehlermeldung hinzufügen.
                    vueObject.errors.push("Passwort ändern fehlgeschlagen: " + data["statusmessage"]);
                    // Passwort Eingabefelder leeren.
                    vueObject.formData.passwordOld = "";
                    vueObject.formData.password = "";
                    vueObject.formData.passwordRepeat = "";
                }
            });

            // Callback Funktionen wenn der Request fehlerhaft war.
            postRequest.fail(function(data) {
                // Fehlermeldung hinzufügen.
                vueObject.errors.push("Server Verbindung fehlgeschlagen.");
                // Passwort Eingabefelder leeren.
                vueObject.formData.passwordOld = "";
                vueObject.formData.password = "";
                vueObject.formData.passwordRepeat = "";
            });
        },
        redirectToHome: function() {
            redirectUser("index.html");
        },
        redirectToLogin: function() {
            redirectUser("pages/login/login.html");
        },
        redirectToProfile: function () {
            redirectUser("pages/profil/profil.html")
        }
    },
    mounted: function() {
        redirectNotAuthUser("pages/login/login.html");

        // activate scrolling shadow
        let self = this;
        let scrollPosition = 0;
        document.addEventListener("scroll", function () {
            self.isScrolling = true;
            scrollPosition = window.scrollY;
            if (scrollPosition === 0) {
                self.isScrolling = false;
            }
        });
    }
});