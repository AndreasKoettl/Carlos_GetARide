/*/ Eine Einführung zur leeren Vorlage finden Sie in der folgenden Dokumentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Zum Debuggen von Code beim Laden einer Seite in cordova-simulate oder auf Android-Geräten/-Emulatoren: Starten Sie Ihre App, legen Sie Haltepunkte fest, 
// und führen Sie dann "window.location.reload()" in der JavaScript-Konsole aus.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Verarbeiten der Cordova-Pause- und -Fortsetzenereignisse
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova wurde geladen. Führen Sie hier eine Initialisierung aus, die Cordova erfordert.
        var parentElement = document.getElementById('deviceready');
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

    };

    function onPause() {
        // TODO: Diese Anwendung wurde ausgesetzt. Speichern Sie hier den Anwendungszustand.
    };

    function onResume() {
        // TODO: Diese Anwendung wurde erneut aktiviert. Stellen Sie hier den Anwendungszustand wieder her.
    };
<<<<<<< HEAD

} )();
=======
} )();*/

/**
 * Key für den local storage.
 * @type {string}
 */
const STORAGE_KEY = "carlosUser";

/**
 * Absoluter Pfad vom Root- bis ins www-Verzeichnis.
 * @type {string}
 */
const ABS_PATH = "/Carlos/Carlos_GetARide/www/";

/**
 * Gibt den absoluten Pfad vom Root- bis zum angegebenen Pfad zurück.
 * @param websitePath
 * @returns {string}
 */
function getAbsPath(websitePath) {
    return ABS_PATH + websitePath;
}

/**
 * Gibt zurück, ob ein User derzeit eingeloggt ist.
 * @returns {boolean}
 */
function isLoggedIn() {
    return (localStorage.getItem("carlosUser") !== null);
}

/**
 * Leitet den User an die angegebenen Pfad innerhalb des www-Verzeichnis weiter.
 * @param websitePath
 */
function redirectUser(websitePath) {
    window.location.href = getAbsPath(websitePath);
}

/**
 * Leitet den User an die angegebenen Pfad innerhalb des www-Verzeichnis weiter,
 * wenn dieser nicht eingeloggt ist.
 * @param websitePath
 */
function redirectNotAuthUser(websitePath) {
    if (!isLoggedIn()) {
        window.location.href = getAbsPath(websitePath);
    }
}

/**
 * Leitet den User an die angegebenen Pfad innerhalb des www-Verzeichnis weiter,
 * wenn dieser eingeloggt ist.
 * @param websitePath
 */
function redirectAuthUser(websitePath) {
    if (isLoggedIn()) {
        window.location.href = getAbsPath(websitePath);
    }
}

