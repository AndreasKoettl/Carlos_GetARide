"use strict";


var carlos_meineFahrten = carlos_meineFahrten || {};


carlos_meineFahrten.app = new Vue({

    el: "#app",

    data: {
    },

    methods: {
        switchMenu: function () {
            let slider = document.getElementById('slider');
            let driver = document.getElementById('driver');
            let codriver = document.getElementById('codriver');

            if (slider.offsetLeft == 0) {
                slider.style.left = '40vw';
                driver.classList.remove('active_menu');
                codriver.classList.add('active_menu');
            }
            else {
                slider.style.left = '0px';
                codriver.classList.remove('active_menu');
                driver.classList.add('active_menu');
            }
        },
        
        loadUpcomingRides: function () {
            // get user id
            let iduser = JSON.parse(localStorage.getItem(STORAGE_KEY))["idusers"];
            console.log(iduser);


            // AJAX-Post Request starten.
            $.post({
                accepts: "application/json",
                dataType: "json",
                async: true,
                contentType: false,
                processData: false,
                url: "/carlos/Carlos_GetARide/www/php/load_rides.php?/upcoming",
                data: iduser,
                success: function (data) {
                    // Prüfen ob das Anmelden erfolgreich war.
                    //if (data["status"] === "success") {
                        console.log(data["data"]);
                    //}
                    //else {
                        // Fehlermeldung ausgeben, wenn die Anmeldung nicht erfolgreich war.
                        console.log("Login fehlgeschlagen: " + data["statusmessage"]);
                    //}
                },
                error: function () {
                    console.log("Server Verbindung fehlgeschlagen.");
                }
            });
        }
    },

    mounted: function () {
        let ridesUpcoming = document.getElementById('rides-upcoming');
        let ridesPast = document.getElementById('rides-past');
        
        this.loadUpcomingRides();
    }
});