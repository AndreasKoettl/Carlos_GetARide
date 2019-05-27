"use strict";


var carlos_meineFahrten = carlos_meineFahrten || {};


carlos_meineFahrten.app = new Vue({

    el: "#app",

    data: {
        listUpcomingRides: [],
        listPastRides: []
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

                this.listUpcomingRides = [];
                this.listPastRides = [];
                this.loadCodriversRides();
            }
            else {
                slider.style.left = '0px';
                codriver.classList.remove('active_menu');
                driver.classList.add('active_menu');

                this.listUpcomingRides = [];
                this.listPastRides = [];
                this.loadDriversRides();
            }
        },
        
        loadDriversRides: function () {

            // get user id
            let iduser = JSON.parse(localStorage.getItem(STORAGE_KEY))["idusers"];
            var appAccess = this;

                // AJAX-Post Request starten.
                $.ajax({
                    accepts: "application/json",
                    async: true,
                    contentType: false,
                    processData: false,
                    url: "/carlos/Carlos_GetARide/www/php/load_rides.php?/driver/" + iduser,
                    data: iduser,
                    success: function (data) {
                        let result = JSON.parse(data);

                        // Prüfen ob das Anmelden erfolgreich war.
                        if (result["status"] === "success") {
                            // Ausgabe in Box
                            for (let i = 0; i < result["data"].length; i++) {
                                let route = result["data"][i]["locationStart"] + " - " + result["data"][i]["locationEnd"];
                                let date = new Date(result["data"][i]["driveDate"]);
                                //let time = result["data"][i]["driveTime"];

                                let currentDate = new Date();

                                if (currentDate <= date) {
                                    if (result["data"][i]["iddrives"] === result["data"][i]["initialDriveId"]) {
                                        appAccess.listUpcomingRides.push(new Ride(route, date));
                                    }
                                    else if (result["data"][i]["initialDriveId"] === null) {
                                        appAccess.listUpcomingRides.push(new Ride(route, date));
                                    }
                                }
                                else {
                                    if (result["data"][i]["iddrives"] === result["data"][i]["initialDriveId"]) {
                                        appAccess.listPastRides.push(new Ride(route, date));
                                    }
                                    else if (result["data"][i]["initialDriveId"] === null) {
                                        appAccess.listPastRides.push(new Ride(route, date));
                                    }
                                }
                            }
                            appAccess.sortRides(appAccess.listUpcomingRides);
                            appAccess.sortRides(appAccess.listPastRides);
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
        },

        loadCodriversRides: function () {

            // get user id
            let iduser = JSON.parse(localStorage.getItem(STORAGE_KEY))["idusers"];
            var appAccess = this;

            let drives = [];

            // AJAX-Post Request starten.
            $.ajax({
                accepts: "application/json",
                async: true,
                contentType: false,
                processData: false,
                url: "/carlos/Carlos_GetARide/www/php/load_rides.php?/codriver/" + iduser,
                data: iduser,
                success: function (data) {
                    let result = JSON.parse(data);

                    // Prüfen ob das Anmelden erfolgreich war.
                    if (result["status"] === "success") {
                        for (let i = 0; i < result["data"].length; i++) {
                            let route = result["data"][i][0]["locationStart"] + " - " + result["data"][i][0]["locationEnd"];
                            let date = new Date(result["data"][i][0]["driveDate"]);

                            let currentDate = new Date();

                            if (currentDate <= date) {
                                if (result["data"][i][0]["iddrives"] === result["data"][i][0]["initialDriveId"]) {
                                    appAccess.listUpcomingRides.push(new Ride(route, date));
                                }
                                else if (result["data"][i][0]["initialDriveId"] === null) {
                                    appAccess.listUpcomingRides.push(new Ride(route, date));
                                }
                            }
                            else {
                                if (result["data"][i][0]["iddrives"] === result["data"][i][0]["initialDriveId"]) {
                                    appAccess.listPastRides.push(new Ride(route, date));
                                }
                                else if (result["data"][i][0]["initialDriveId"] === null) {
                                    appAccess.listPastRides.push(new Ride(route, date));
                                }
                            }
                        }
                        appAccess.sortRides(appAccess.listUpcomingRides);
                        appAccess.sortRides(appAccess.listPastRides);
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
        },

        sortRides: function (rides) {
            let i = 0;
            while (i < rides.length - 1) {
                if (rides[i].originalDate > rides[i + 1].originalDate) {
                    let tmp = rides[i];
                    rides[i] = rides[i + 1];
                    rides[i + 1] = tmp;
                    i = 0;
                }
                else {
                    i++;
                }
            }
            
        }

    },

    mounted: function () {
        
        this.loadDriversRides();
    }
});

class Ride {
    constructor(route, date) {
        this._route = route;
        this._date = date;
        this._originalDate = date;
        this.formatDate();
    }

    get route() {return this._route;}
    set route(route) {this._route = route;}
    get date() {return this._date;}
    set originalDate(date) { this._originalDate = date; }
    get originalDate() { return this._originalDate; }
    set date(date) { this._date = date; }

    formatDate() {
        let day = this._date.getDay();

        switch (day) {
            case 1: day = "Mo"; break;
            case 2: day = "Di"; break;
            case 3: day = "Mi"; break;
            case 4: day = "Do"; break;
            case 5: day = "Fr"; break;
            case 6: day = "Sa"; break;
            case 0: day = "So"; break;
            default: day = ""; break;
        }

        let dayNB = this._date.getDate();
        let month = this._date.getMonth()+1;
        let year = this._date.getFullYear();
        let hours = this._date.getHours();
        let minutes = this._date.getMinutes();

        if (minutes < 10) {
            minutes = "0"+minutes;
        }

        this._date = day + ", " + dayNB + "." + month + "." + year + " " + hours + ":" + minutes + " Uhr";
    }
}