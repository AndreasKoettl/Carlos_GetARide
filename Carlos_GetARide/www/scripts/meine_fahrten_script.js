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

                                let currentDate = new Date();

                                if (currentDate <= date) {
                                        if (result["data"][i]["iddrives"] === result["data"][i]["initialDriveId"]) {
                                            appAccess.listUpcomingRides.push({
                                                route: route,
                                                date: appAccess.formatDate(date),
                                                repeating: 1,
                                                initialDriveId: result["data"][i]["iddrives"]
                                            });
                                        }
                                        else if (result["data"][i]["initialDriveId"] === null) {
                                            appAccess.listUpcomingRides.push({
                                                route: route,
                                                date: appAccess.formatDate(date),
                                                repeating: 0
                                            });
                                        }
                                }
                                else {
                                        if (result["data"][i]["iddrives"] === result["data"][i]["initialDriveId"]) {
                                            appAccess.listPastRides.push({
                                                route: route,
                                                date: appAccess.formatDate(date),
                                                repeating: 1,
                                                initialDriveId: result["data"][i]["iddrives"]
                                            });
                                        }
                                        else if (result["data"][i]["initialDriveId"] === null) {
                                            appAccess.listPastRides.push({
                                                route: route,
                                                date: appAccess.formatDate(date),
                                                repeating: 0
                                            });
                                        }
                                    }
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
        },

        loadCodriversRides: function () {

            // get user id
            let iduser = JSON.parse(localStorage.getItem(STORAGE_KEY))["idusers"];
            var appAccess = this;

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
                                    appAccess.listUpcomingRides.push({
                                        route: route,
                                        date: appAccess.formatDate(date),
                                        repeating: 1,
                                        initialDriveId: result["data"][i][0]["iddrives"]
                                    });
                                }
                                else if (result["data"][i][0]["initialDriveId"] === null) {
                                    appAccess.listUpcomingRides.push({
                                        route: route,
                                        date: appAccess.formatDate(date),
                                        repeating: 0
                                    });
                                }
                            }
                            else {
                                if (result["data"][i][0]["iddrives"] === result["data"][i][0]["initialDriveId"]) {
                                    appAccess.listPastRides.push({
                                        route: route,
                                        date: appAccess.formatDate(date),
                                        repeating: 1,
                                        initialDriveId: result["data"][i][0]["iddrives"]
                                    });
                                }
                                else if (result["data"][i][0]["initialDriveId"] === null) {
                                    appAccess.listPastRides.push({
                                        route: route,
                                        date: appAccess.formatDate(date),
                                        repeating: 0
                                    });
                                }
                            }
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
        },

        formatDate: function (date) {
            let day = date.getDay();

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

            let dayNB = date.getDate();
            let month = date.getMonth()+1;
            let year = date.getFullYear();
            let hours = date.getHours();
            let minutes = date.getMinutes();

            if (minutes < 10) {
                minutes = "0"+minutes;
            }

            return day + ", " + dayNB + "." + month + "." + year + " " + hours + ":" + minutes + " Uhr";
        },

        showDetails: async function (index, isUpcoming) {
            let list;
            isUpcoming ? list = this.listUpcomingRides : list = this.listPastRides;
                if (list[index].repeating === 1) {
                    let loadedRepetitions = await this.loadRepetitions(index, isUpcoming);
                    list[index].repeating = 2;
                    this.setRepetitionCss();
                }
                else if (list[index].repeating === 2) {
                    for (let i = 0; i < list.length; i++) {
                        if (list[i].initialDriveId === list[index].initialDriveId) {
                            if (i !== index) {
                                list.splice(i, 1);
                                document.getElementsByClassName("box-meine-fahrten")[i].style.backgroundColor = "white";
                                i--;
                            }
                        }
                    }
                    list[index].repeating = 1;
                }

        },

        setRepetitionCss: function () {
            for (let i = 0; i < this.listUpcomingRides.length; i++) {
                if (this.listUpcomingRides[i].repeating === 3) {
                    document.getElementsByClassName("box-meine-fahrten")[i].style.backgroundColor = "var(--grey-extralight)";
                }
            }
            for (let i = 0; i < this.listPastRides.length; i++) {
                if (this.listPastRides[i].repeating === 3) {
                    document.getElementsByClassName("box-meine-fahrten")[i+this.listUpcomingRides.length].style.backgroundColor = "var(--grey-extralight)";
                }
            }
        },

        loadRepetitions: async function (index, isUpcoming) {

            var appAccess = this;
            let list;
            isUpcoming ? list = this.listUpcomingRides : list = this.listPastRides;

            let ajaxRequest = await $.ajax({
                accepts: "application/json",
                async: true,
                contentType: false,
                processData: false,
                url: "/carlos/Carlos_GetARide/www/php/load_rides.php?/driverRepeating/" + list[index].initialDriveId,
                data: list[index].initialDriveId,
                success: function (data) {
                    let result = JSON.parse(data);

                    // Prüfen ob das Laden erfolgreich war.
                    if (result["status"] === "success") {

                        for (let i = 0; i < result["data"].length; i++) {
                            if (result["data"][i]["iddrives"] !== result["data"][i]["initialDriveId"]) {
                                list.splice(index + 1, 0, {
                                    route: result["data"][i]["locationStart"] + " - " + result["data"][i]["locationEnd"],
                                    date: appAccess.formatDate(new Date(result["data"][i]["driveDate"])),
                                    repeating: 3,
                                    initialDriveId: result["data"][i]["initialDriveId"]
                                });
                            }
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
        }

    },

    mounted: function () {
        
        this.loadDriversRides();
    }
});