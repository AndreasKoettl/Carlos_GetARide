"use strict";


var carlos_meineFahrten = carlos_meineFahrten || {};


carlos_meineFahrten.app = new Vue({

    el: "#app",

    data: {
        listUpcomingRides: [],
        isDriverActivated: true
    },

    methods: {
        switchMenu: function () {
            let slider = document.getElementById('slider');
            let driver = document.getElementById('driver');
            let codriver = document.getElementById('codriver');

            var appAccess = this;

            if (slider.offsetLeft === 0) {
                slider.style.left = '40vw';
                driver.classList.remove('active_menu');
                codriver.classList.add('active_menu');
                appAccess.isDriverActivated = true;
            }
            else {
                slider.style.left = '0px';
                codriver.classList.remove('active_menu');
                driver.classList.add('active_menu');
                appAccess.isDriverActivated = false;
            }
        },
        
        loadUpcomingRides: function () {

            // get user id
            let iduser = JSON.parse(localStorage.getItem(STORAGE_KEY))["idusers"];
            let userData = JSON.stringify('{ "userid":' + iduser + '}');
            var appAccess = this;

            if (this.isDriverActivated) {

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
                            for (let i = 0; i < result["data"].length; i++) {
                                let route = result["data"][i]["locationStart"] + " - " + result["data"][i]["locationEnd"];
                                let date = new Date(result["data"][i]["driveDate"]);
                                let time = result["data"][i]["driveTime"];
                                let dateTime = document.getElementsByClassName("datetime")[i];

                                appAccess.listUpcomingRides.push(new Ride(route, date, time));
                            }
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

            } else {

                console.log("mitfahrer wurde aktiviert");

            }
        }

    },

    mounted: function () {
        this.ridesUpcoming = document.getElementById('rides-upcoming');
        this.ridesPast = document.getElementById('rides-past');

        this.loadUpcomingRides();
    }
});

class Ride {
    constructor(route, date, time) {
        this._route = route;
        this._date = date;
        this._time = time;
        this.formatDate();
    }

    get route() {return this._route;}
    set route(route) {this._route = route;}
    get date() {return this._date;}
    set date(date) {this._date = date;}
    get time() {return this._time;}
    set time(time) {this._time = time;}

    formatDate() {
        let day = this._date.getDay();

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

        let dayNB = this._date.getDate();
        let month = this._date.getMonth();
        let year = this._date.getFullYear();

        this._date = day + ", " + dayNB + "." + month + "." + year;
    }
}