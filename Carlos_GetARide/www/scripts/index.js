/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        // Testzwecke
        //alert("initialize");
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {

        // Testzwecke
        //alert("DeviceReady");

        this.fcmGetToken();

        FCMPlugin.onTokenRefresh(function(token){
            // Testzwecke
            //alert("token: " + token );

            this.fcmSaveToken(token);
        });

        FCMPlugin.onNotification(
            function(data){
                if(data.wasTapped){
                    //Notification was received on device tray and tapped by the user.
                    alert( JSON.stringify(data) );
                }else{
                    //Notification was received in foreground. Maybe the user needs to be notified.
                    alert( JSON.stringify(data) );
                }
            },
            function(msg){
                console.log('onNotification callback successfully registered: ' + msg);
            },
            function(err){
                console.log('Error registering onNotification callback: ' + err);
            }
        );

        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    fcmSaveToken: function(token) {
        //alert("Save token");

        // Post request schicken und Token in db speichern.
        var postRequest = $.post(getAbsPath("php/notifications.php?/saveToken"), {"token": token}, null, "json");

        // Callback Funktionen wenn Request erfolgreich war.
        postRequest.done(function(data) {
            //alert("Token erfolgreich gespeichert.");
        });

        // Callback Funktionen wenn der Request fehlerhaft war.
        postRequest.fail(function(data) {
            //alert("Token nicht erfolgreich gespeichert: " + data["statusmessage"]);
        });
    },
    fcmGetToken: function() {
        FCMPlugin.getToken(function(token){
            //alert("Success token: " + token);

            //this.fcmSaveToken(token);

            //alert("Save token");
            //alert("Url: " + getAbsPath("php/notifications.php?/saveToken"));

            // Post request schicken und Token in db speichern.
            var postRequest = $.post(getAbsPath("php/notifications.php?/saveToken"), {token: token}, null, "json");

            // Callback Funktionen wenn Request erfolgreich war.
            postRequest.done(function(data) {
                //alert("Token erfolgreich gespeichert.");
            });

            // Callback Funktionen wenn der Request fehlerhaft war.
            postRequest.fail(function(data) {
                //alert("Token nicht erfolgreich gespeichert: " + data["statusmessage"]);
            });
        }, function(err) {
            alert("Error token: " + err)
        });
    },
};

/**
 * Key für den local storage.
 * @type {string}
 */
const STORAGE_KEY = "carlosUser";

/**
 * Absoluter Pfad vom Root- bis ins www-Verzeichnis (localhost).
 * @type {string}
 */
const ABS_PATH = "/Carlos/Carlos_GetARide/www/";

/**
 * Absoluter Pfad vom Root- bis ins www-Verzeichnis (Android).
 * @type {string}
 */
const ABS_APPPATH = "/android_asset/www/";

/**
 * Absoluter Pfad vom Root- bis ins www-Verzeichnis (Website).
 * @type {string}
 */
const ABS_WEBPATH = "https://mitfahrboerse.projekte.fh-hagenberg.at/";


/**
 * Gibt den absoluten Pfad vom Root- bis zum angegebenen Pfad zurück.
 * Je nachdem, ob der User sich in einem Webbrowser oder der App befindet.
 * @param websitePath
 * @returns {string}
 */
function getAbsPath(websitePath) {
    if (document.URL.indexOf('http://') !== -1 || document.URL.indexOf('https://') !== -1 || websitePath.indexOf('.php') !== -1) {
        return ABS_WEBPATH + websitePath;
    } else if (document.URL.indexOf('localhost') !== -1) {
        return ABS_PATH + websitePath;
    } else {
        return ABS_APPPATH + websitePath;
    }
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

function succeeded(resultArray) {
    return resultArray["status"] === "success";
}

function failed(resultArray) {
    return resultArray["status"] === "error";
}

app.initialize();