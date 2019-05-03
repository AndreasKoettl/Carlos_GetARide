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
            let userData = JSON.stringify('{ "userid":' + iduser + '}');

            // AJAX-Post Request starten.
            $.ajax({
                accepts: "application/json",
                async: true,
                contentType: false,
                processData: false,
                url: "/carlos/Carlos_GetARide/www/php/load_rides.php?/upcoming/" + iduser,
                data: iduser,
                success: function (data) {
                    let result = JSON.parse(data);
                    // Prüfen ob das Anmelden erfolgreich war.
                    if (result["status"] === "success") {

                        // Ausgabe in Box

                        let startDestination = document.getElementsByClassName("start-destination")[0];
                        startDestination.innerHTML = result["data"][0]["locationStart"] + " - " + result["data"][0]["locationEnd"];
                        
                        let date = new Date(result["data"][0]["driveDate"]);
                        let day = date.getDay();

                        switch (day) {
                            case 1: day = "Mo"; break;
                            case 2: day = "Di"; break;
                            case 3: day = "Mi"; break;
                            case 4: day = "Do"; break;
                            case 5: day = "Fr"; break;
                            case 6: day = "Sa"; break;
                            case 7: day = "So"; break;
                            default: day = ""; break;
                        }

                        let dayNB = date.getDate();
                        let month = date.getMonth();
                        let year = date.getFullYear();

                        let dateString = day + ", " + dayNB + "." + month + "." + year;

                        let dateTime = document.getElementsByClassName("datetime")[0];
                        dateTime.innerHTML = dateString + ", " + result["data"][0]["driveTime"];
                        
                    }

                    else {
                        // Fehlermeldung ausgeben, wenn die Anmeldung nicht erfolgreich war.
                        console.log("Laden fehlgeschlagen: " + result["statusmessage"]);
                    }
                },
                error: function () {
                    console.log("Server Verbindung fehlgeschlagen.");
                }
            });
        }

    },

    mounted: function () {
        this.ridesUpcoming = document.getElementById('rides-upcoming');
        this.ridesPast = document.getElementById('rides-past');
        
        this.loadUpcomingRides();
    }
});