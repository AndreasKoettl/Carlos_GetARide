"use strict";


var carlos_meineFahrten = carlos_meineFahrten || {};


carlos_meineFahrten.app = new Vue({

    el: "#app",

    data: {
        listUpcomingRides: [],
        listPastRides: [],
        allUpcomingDriverRides: [],
        listAccepted: [],
        listNotAccepted: [],
        isDriver: true,
        isDriverDetails: false,
        isCoDriverDetails: false,
        indexUpcomingRide: -1,
        indexPastRide: -1,
        date: new Date(),
        isScrolling: false,
        acceptDR: false
    },

    methods: {
        switchMenu: function () {
            let slider = document.getElementById('slider');
            let driver = document.getElementById('driver');
            let codriver = document.getElementById('codriver');

            var appAccess = this;

            if (slider.offsetLeft === 0) {
                slider.style.left = '50%';
                driver.classList.remove('active_menu');
                codriver.classList.add('active_menu');

                this.isDriver = false;

                this.listUpcomingRides = [];
                this.listPastRides = [];
                this.allUpcomingDriverRides = [];
                this.loadCodriversRides();
            }
            else {
                setTimeout(function () {
                    appAccess.loadDriversRides();
                }, 400);
                slider.style.left = '0px';
                codriver.classList.remove('active_menu');
                driver.classList.add('active_menu');

                this.isDriver = true;

                this.listUpcomingRides = [];
                this.listPastRides = [];
                this.allUpcomingDriverRides = [];

            }
        },

        loadDriversRides: function () {

            // get user id
            let iduser = JSON.parse(localStorage.getItem(STORAGE_KEY))["idusers"];
            var appAccess = this;

            // AJAX-Get Request starten.
            $.ajax({
                accepts: "application/json",
                async: true,
                contentType: false,
                processData: false,
                url: getAbsPath("php/load_rides.php?/driver/") + iduser,
                data: iduser,
                success: function (data) {
                    let result = JSON.parse(data);

                    // Prüfen ob das Auslesen erfolgreich war.
                    if (result["status"] === "success") {
                        // Ausgabe in Box
                        for (let i = 0; i < result["data"].length; i++) {
                            let isInitialized = false;

                            let drive = {
                                iddrive: result["data"][i]["iddrives"],
                                routeStart: result["data"][i]["locationStart"],
                                routeEnd: result["data"][i]["locationEnd"],
                                cityStart: result["data"][i]["cityStart"],
                                cityEnd: result["data"][i]["cityEnd"],
                                date: appAccess.formatDate(new Date(result["data"][i]["driveDate"])),
                                time: appAccess.formatTime(new Date(result["data"][i]["driveDate"])),
                                dateTime: new Date(result["data"][i]["driveDate"]),
                                initialDriveId: result["data"][i]["initialDriveId"],
                                allAccepted: 1,
                                childrenAccepted: 1,
                                price: result["data"][i]["price"],
                                passengersAvailable: result["data"][i]["maxPassengers"] - result["data"][i]["passengers"],
                                licensePlate: result["data"][i]["licensePlate"],
                                details: result["data"][i]["details"],
                                weekDays: result["data"][i]["weekDays"]
                            };

                            let currentDate = new Date();

                            if (currentDate <= drive.dateTime) {

                                appAccess.allUpcomingDriverRides.push(drive);

                                if (drive.iddrive === drive.initialDriveId) {
                                    drive.repeating = 1;
                                    appAccess.listUpcomingRides.push(drive);
                                }
                                else if (drive.initialDriveId === null) {
                                    drive.repeating = 0;
                                    appAccess.listUpcomingRides.push(drive);
                                }
                                else if (drive.initialDriveId !== null) {
                                    let isInitialDrive = true;
                                    for (let j = 0; j < result["data"].length; j++) {
                                        if (result["data"][j]["iddrives"] === drive.initialDriveId) {
                                            isInitialDrive = false;

                                        }
                                    }
                                    if (isInitialDrive) {
                                        if (!isInitialized) {
                                            drive.repeating = 1;
                                            appAccess.listUpcomingRides.push(drive);
                                            isInitialized = true;
                                        }
                                    }
                                }
                            }
                            else {
                                if (drive.iddrive === drive.initialDriveId) {
                                    drive.repeating = 1;
                                    appAccess.listPastRides.push(drive);
                                }
                                else if (drive.initialDriveId === null) {
                                    drive.repeating = 0;
                                    appAccess.listPastRides.push(drive);
                                }
                                else if (drive.initialDriveId !== null) {
                                    let isInitialDrive = true;
                                    for (let j = 0; j < result["data"].length; j++) {
                                        if (result["data"][j]["iddrives"] === drive.initialDriveId) {
                                            isInitialDrive = false;
                                        }
                                    }
                                    if (isInitialDrive) {
                                        if (!isInitialized) {
                                            drive.repeating = 1;
                                            appAccess.listPastRides.push(drive);
                                            isInitialized = true;
                                        }
                                    }
                                }
                            }
                        }
                        for (let i = 0; i < appAccess.allUpcomingDriverRides.length; i++) {
                            appAccess.loadOpenRequests(2);
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

        loadCodriversRides: async function () {

            // get user id
            let iduser = JSON.parse(localStorage.getItem(STORAGE_KEY))["idusers"];
            var appAccess = this;

            // AJAX-Post Request starten.
            let ajaxRequest = await $.ajax({
                accepts: "application/json",
                async: true,
                contentType: false,
                processData: false,
                url: getAbsPath("php/load_rides.php?/codriver/") + iduser,
                data: iduser,
                success: function (data) {
                    let result = JSON.parse(data);

                    // Prüfen ob das Anmelden erfolgreich war.
                    if (result["status"] === "success") {
                        for (let i = 0; i < result["data"].length; i++) {
                            let isInitialized = false;

                            let drive = {
                                iddrive: result["data"][i][0]["iddrives"],
                                routeStart: result["data"][i][0]["locationStart"],
                                routeEnd: result["data"][i][0]["locationEnd"],
                                cityStart: result["data"][i][0]["cityStart"],
                                cityEnd: result["data"][i][0]["cityEnd"],
                                date: appAccess.formatDate(new Date(result["data"][i][0]["driveDate"])),
                                time: appAccess.formatTime(new Date(result["data"][i][0]["driveDate"])),
                                dateTime: new Date(result["data"][i][0]["driveDate"]),
                                initialDriveId: result["data"][i][0]["initialDriveId"],
                                accepted: result["data"][i]["accepted"],
                                price: result["data"][i][0]["price"],
                                passengersAvailable: result["data"][i][0]["maxPassengers"] - result["data"][i][0]["passengers"],
                                licensePlate: result["data"][i][0]["licensePlate"],
                                details: result["data"][i][0]["details"],
                                idDriver: result["data"][i][0]["users_idusers"],
                                firstName: "Max",
                                lastName: "Mustermann",
                                weekDays: result["data"][i][0]["weekDays"]
                            };

                            let currentDate = new Date();

                            if (currentDate <= drive.dateTime) {
                                if (drive.iddrive === drive.initialDriveId) {
                                    drive.repeating = 1;
                                    appAccess.listUpcomingRides.push(drive);
                                }
                                else if (drive.initialDriveId === null) {
                                    drive.repeating = 0;
                                    appAccess.listUpcomingRides.push(drive);
                                }
                                else if (drive.initialDriveId !== null) {
                                    let isInitialDrive = true;
                                    for (let j = 0; j < result["data"].length; j++) {
                                        if (result["data"][j][0]["iddrives"] === drive.initialDriveId) {
                                            isInitialDrive = false;
                                        }
                                    }
                                    if (isInitialDrive) {
                                        if (!isInitialized) {
                                            drive.repeating = 1;
                                            appAccess.listUpcomingRides.push(drive);
                                            isInitialized = true;
                                        }
                                    }
                                }
                            }
                            else {
                                if (drive.iddrive === drive.initialDriveId) {
                                    drive.repeating = 1;
                                    appAccess.listPastRides.push(drive);
                                }
                                else if (drive.initialDriveId === null) {
                                    drive.repeating = 0;
                                    appAccess.listPastRides.push(drive);
                                }
                                else if (drive.initialDriveId !== null) {
                                    let isInitialDrive = true;
                                    for (let j = 0; j < result["data"].length; j++) {
                                        if (result["data"][j][0]["iddrives"] === drive.initialDriveId) {
                                            isInitialDrive = false;
                                        }
                                    }
                                    if (isInitialDrive) {
                                        if (!isInitialized) {
                                            drive.repeating = 0;
                                            appAccess.listPastRides.push(drive);
                                            isInitialized = true;
                                        }
                                    }

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


            this.setAcceptedCss();
        },

        setAcceptedCss: function () {
            if (!this.isDriver) {
                for (let i = 0; i < this.listUpcomingRides.length; i++) {
                    document.getElementsByClassName("grey-box")[i].classList.remove("red-outline-box");
                    if (this.listUpcomingRides[i].accepted == 0) {
                        document.getElementsByClassName("grey-box")[i].classList.add("red-outline-box");
                    }
                }
                for (let i = 0; i < this.listPastRides.length; i++) {
                    document.getElementsByClassName("grey-box")[i].classList.remove("red-outline-box");
                    if (this.listPastRides[i].accepted == 0) {
                        document.getElementsByClassName("grey-box")[i].classList.add("red-outline-box");
                    }
                }
            }
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
            let month = date.getMonth() + 1;
            let year = date.getFullYear();


            return day + ", " + dayNB + "." + month + "." + year;
        },

        formatTime: function (date) {
            let hours = date.getHours();
            let minutes = date.getMinutes();

            if (minutes < 10) {
                minutes = "0" + minutes;
            }

            if (hours < 10) {
                hours = "0" + hours;
            }

            return hours + ":" + minutes + " Uhr";
        },

        showDetails: async function (index, isUpcoming) {
            let list;
            isUpcoming ? list = this.listUpcomingRides : list = this.listPastRides;
            if (list[index].repeating === 1) {
                if (this.isDriver) {
                    await this.loadDriversRepetitions(index, isUpcoming);
                } else {
                    await this.loadCoDriversRepetitions(index, isUpcoming);
                }
                list[index].repeating = 2;
                this.setRepetitionCss(index, isUpcoming);
                this.setAcceptedCss();
            }
            else if (list[index].repeating === 2) {
                for (let i = 0; i < list.length; i++) {
                    if (list[i].initialDriveId === list[index].initialDriveId) {
                        if (i !== index) {
                            list.splice(i, 1);
                            i--;
                        }
                    }
                }
                list[index].repeating = 1;
                this.removeRepetitionCss(index, isUpcoming);
                this.setAcceptedCss();
            }
            else if (list[index].repeating === 0 || list[index].repeating === 3) {
                if (isUpcoming) {
                    this.indexUpcomingRide = index;
                    this.indexPastRide = -1;
                }
                else {
                    this.indexPastRide = index;
                    this.indexUpcomingRide = -1;
                }

                if (this.isDriver) {
                    await (this.isDriverDetails = true);
                    this.listAccepted = [];
                    this.listNotAccepted = [];
                    this.getCoDriversNames(index, isUpcoming, 0);
                } else {
                    await (this.isCoDriverDetails = true);
                    if (list[index].accepted == 0) {
                        document.getElementsByTagName('button')[0].innerHTML = "Anfrage löschen";
                    }
                    this.listAccepted = [];
                    this.listNotAccepted = [];
                    this.getDriversName(list[index].idDriver, isUpcoming);
                }
            }

        },

        setRepetitionCss: function (index, isUpcoming) {
            if (isUpcoming) {
                for (let i = index + 1; i < this.listUpcomingRides.length; i++) {
                    document.getElementsByClassName("grey-box")[i].classList.remove("grey-outline-box");
                    if (this.listUpcomingRides[i].repeating === 3) {
                        document.getElementsByClassName("grey-box")[i].classList.add("grey-outline-box");
                    }
                }
            } else {
                let pos = this.listUpcomingRides.length + index + 1;
                for (let i = 1; i < this.listPastRides.length; i++) {
                    document.getElementsByClassName("grey-box")[pos].classList.remove("grey-outline-box");
                    if (this.listPastRides[i].repeating === 3) {
                        document.getElementsByClassName("grey-box")[pos].classList.add("grey-outline-box");
                    }
                    pos++;
                }

            }
        },

        removeRepetitionCss: function (index, isUpcoming) {
            if (isUpcoming) {
                for (let i = index + 1; i < this.listUpcomingRides.length; i++) {
                    if (this.listUpcomingRides[i].repeating !== 3) {
                        document.getElementsByClassName("grey-box")[i].classList.remove("grey-outline-box");
                    }
                }
            } else {
                let pos = this.listUpcomingRides.length + index + 1;
                for (let i = 1; i < this.listPastRides.length; i++) {
                    if (this.listPastRides[i].repeating !== 3) {
                        document.getElementsByClassName("grey-box")[pos].classList.remove("grey-outline-box");
                    }
                    pos++;
                }
            }
        },

        loadDriversRepetitions: async function (index, isUpcoming) {

            var appAccess = this;
            let list;
            isUpcoming ? list = this.listUpcomingRides : list = this.listPastRides;
            let initialDriveId = list[index].initialDriveId;
            let iddrive = list[index].iddrive;
            let originalInitialDriveId;

            await $.ajax({
                accepts: "application/json",
                async: true,
                contentType: false,
                processData: false,
                url: getAbsPath("php/load_rides.php?/initialDriveId/") + iddrive,
                data: iddrive,
                success: function (data) {
                    let result = JSON.parse(data);

                    // Prüfen ob das Laden erfolgreich war.
                    if (result["status"] === "success") {

                        for (let i = 0; i < result["data"].length; i++) {
                            originalInitialDriveId = result["data"][i]["initialDriveId"];
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

            await $.ajax({
                accepts: "application/json",
                async: true,
                contentType: false,
                processData: false,
                url: getAbsPath("php/load_rides.php?/driverRepeating/") + originalInitialDriveId,
                data: originalInitialDriveId,
                success: function (data) {
                    let result = JSON.parse(data);

                    // Prüfen ob das Laden erfolgreich war.
                    if (result["status"] === "success") {

                        for (let i = 0; i < result["data"].length; i++) {

                            let drive = {
                                iddrive: result["data"][i]["iddrives"],
                                routeStart: result["data"][i]["locationStart"],
                                routeEnd: result["data"][i]["locationEnd"],
                                cityStart: result["data"][i]["cityStart"],
                                cityEnd: result["data"][i]["cityEnd"],
                                allAccepted: 1,
                                date: appAccess.formatDate(new Date(result["data"][i]["driveDate"])),
                                time: appAccess.formatTime(new Date(result["data"][i]["driveDate"])),
                                dateTime: new Date(result["data"][i]["driveDate"]),
                                initialDriveId: result["data"][i]["initialDriveId"],
                                price: result["data"][i]["price"],
                                passengersAvailable: result["data"][i]["maxPassengers"] - result["data"][i]["passengers"],
                                licensePlate: result["data"][i]["licensePlate"],
                                details: result["data"][i]["details"],
                                weekDays: result["data"][i]["weekDays"]
                            };

                            if (drive.initialDriveId === initialDriveId) {
                                drive.repeating = 3;
                                list.splice(index + 1, 0, drive);
                            }
                            else if (drive.initialDriveId !== null) {
                                let isInitialDrive = true;
                                for (let j = 0; j < result["data"].length; j++) {
                                    if (result["data"][j]["iddrives"] === result["data"][j]["initialDriveId"]) {
                                        isInitialDrive = false;
                                    }
                                }
                                if (isInitialDrive && drive.initialDriveId === originalInitialDriveId) {
                                    drive.repeating = 3;
                                    list.splice(index + 1, 0, drive);
                                }
                            }
                        }
                        for (let i = 0; i < appAccess.listUpcomingRides.length; i++) {
                            appAccess.loadOpenRequests(1);
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

        loadCoDriversRepetitions: async function (index, isUpcoming) {

            var appAccess = this;
            let list;
            isUpcoming ? list = this.listUpcomingRides : list = this.listPastRides;
            let iduser = JSON.parse(localStorage.getItem(STORAGE_KEY))["idusers"];
            let initialDriveId = list[index].initialDriveId;
            let iddrive = list[index].iddrive;
            let originalInitialDriveId;

            await $.ajax({
                accepts: "application/json",
                async: true,
                contentType: false,
                processData: false,
                url: getAbsPath("php/load_rides.php?/initialDriveId/") + iddrive,
                data: iddrive,
                success: function (data) {
                    let result = JSON.parse(data);

                    // Prüfen ob das Laden erfolgreich war.
                    if (result["status"] === "success") {

                        for (let i = 0; i < result["data"].length; i++) {
                            originalInitialDriveId = result["data"][i]["initialDriveId"];
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

            await $.ajax({
                accepts: "application/json",
                async: true,
                contentType: false,
                processData: false,
                url: getAbsPath("php/load_rides.php?/codriver/") + iduser,
                data: iduser,
                success: function (data) {
                    let result = JSON.parse(data);

                    // Prüfen ob das Laden erfolgreich war.
                    if (result["status"] === "success") {
                        let reversedResult = result["data"].reverse();

                        for (let i = 0; i < reversedResult.length; i++) {

                            let drive = {
                                iddrive: reversedResult[i][0]["iddrives"],
                                routeStart: reversedResult[i][0]["locationStart"],
                                routeEnd: reversedResult[i][0]["locationEnd"],
                                cityStart: reversedResult[i][0]["cityStart"],
                                cityEnd: reversedResult[i][0]["cityEnd"],
                                date: appAccess.formatDate(new Date(reversedResult[i][0]["driveDate"])),
                                time: appAccess.formatTime(new Date(reversedResult[i][0]["driveDate"])),
                                dateTime: new Date(reversedResult[i][0]["driveDate"]),
                                initialDriveId: reversedResult[i][0]["initialDriveId"],
                                accepted: reversedResult[i]["accepted"],
                                price: reversedResult[i][0]["price"],
                                passengersAvailable: reversedResult[i][0]["maxPassengers"] - reversedResult[i][0]["passengers"],
                                licensePlate: reversedResult[i][0]["licensePlate"],
                                details: reversedResult[i][0]["details"],
                                idDriver: reversedResult[i][0]["users_idusers"],
                                firstName: "Max",
                                lastName: "Mustermann",
                                weekDays: result["data"][i][0]["weekDays"]
                            };

                            if (drive.initialDriveId === initialDriveId) {
                                drive.repeating = 3;
                                list.splice(index + 1, 0, drive);
                            }
                            else if (reversedResult[i][0]["initialDriveId"] !== null) {
                                let isInitialDrive = true;
                                for (let j = 0; j < result["data"].length; j++) {
                                    if (reversedResult[j][0]["iddrives"] === reversedResult[j][0]["initialDriveId"]) {
                                        isInitialDrive = false;
                                    }
                                }
                                if (isInitialDrive && reversedResult[i][0]["initialDriveId"] === originalInitialDriveId) {
                                    drive.repeating = 3;
                                    list.splice(index + 1, 0, drive);
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

        getDriversName: async function (iddriver, isUpcoming) {
            var appAccess = this;
            let list;
            isUpcoming ? list = this.listUpcomingRides : list = this.listPastRides;

            let ajaxRequest = await $.ajax({
                accepts: "application/json",
                async: true,
                contentType: false,
                processData: false,
                url: getAbsPath("php/load_rides.php?/driverName/") + iddriver,
                data: iddriver,
                success: function (data) {
                    let result = JSON.parse(data);

                    // Prüfen ob das Laden erfolgreich war.
                    if (result["status"] === "success") {

                        for (let i = 0; i < result["data"].length; i++) {

                            let firstName = result["data"][i]["firstname"];
                            let lastName = result["data"][i]["lastname"];

                            for (let i = 0; i < list.length; i++) {
                                if (list[i].idDriver === iddriver) {
                                    list[i].firstName = firstName;
                                    list[i].lastName = lastName;
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

        getCoDriversNames: async function (index, isUpcoming) {
            var appAccess = this;
            let list;
            isUpcoming ? list = this.listUpcomingRides : list = this.listPastRides;
            let iddrive = list[index].iddrive;

            let ajaxRequest = await $.ajax({
                accepts: "application/json",
                async: true,
                contentType: false,
                processData: false,
                url: getAbsPath("php/load_rides.php?/coDriverNames/") + iddrive,
                data: iddrive,
                success: function (data) {
                    let result = JSON.parse(data);

                    // Prüfen ob das Laden erfolgreich war.
                    if (result["status"] === "success") {

                        for (let i = 0; i < result["data"].length; i++) {

                            let firstName = result["data"][i][0]["firstname"];
                            let lastName = result["data"][i][0]["lastname"];
                            let iduser = result["data"][i][0]["idusers"];
                            let accepted = result["data"][i][1][0]["accepted"];


                            if (accepted == 0) {
                                appAccess.listNotAccepted.push({
                                    firstName: firstName,
                                    lastName: lastName,
                                    iduser: iduser,
                                    iddrive: iddrive
                                });
                            }
                            else {
                                appAccess.listAccepted.push({
                                    firstName: firstName,
                                    lastName: lastName,
                                    iduser: iduser,
                                    iddrive: iddrive
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
        },

        loadOpenRequests: async function (func) {
            let appAccess = this;
            let ajaxRequest = await $.ajax({
                accepts: "application/json",
                async: true,
                contentType: false,
                processData: false,
                url: getAbsPath("php/load_rides.php?/loadRequests"),
                success: function (data) {
                    let result = JSON.parse(data);

                    // Prüfen ob das Laden erfolgreich war.
                    if (result["status"] === "success") {
                        for (let i = 0; i < result["data"].length; i++) {
                            if (result["data"][i]["accepted"] == 0) {

                                if (func === 2) {
                                    for (let n = 0; n < appAccess.allUpcomingDriverRides.length; n++) {
                                        if (appAccess.allUpcomingDriverRides[n].iddrive == result["data"][i]["drives_iddrives"]) {
                                            for (let j = 0; j < appAccess.listUpcomingRides.length; j++) {
                                                if (appAccess.allUpcomingDriverRides[n].repeating == 0) {
                                                    appAccess.listUpcomingRides[j].allAccepted = 0;
                                                    j = appAccess.listUpcomingRides.length;
                                                } else if (appAccess.allUpcomingDriverRides[n].initialDriveId === appAccess.listUpcomingRides[j].iddrive)
                                                    appAccess.listUpcomingRides[j].childrenAccepted = 0;
                                            }
                                        }
                                    }
                                }

                                else if (func === 1) {
                                    for (let n = 0; n < appAccess.listUpcomingRides.length; n++) {
                                        if (appAccess.listUpcomingRides[n].iddrive == result["data"][i]["drives_iddrives"]) {
                                            appAccess.listUpcomingRides[n].allAccepted = 0;
                                        }
                                    }
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

        cancelRide: async function (index, isUpcoming) {

            var appAccess = this;
            let list;
            isUpcoming ? list = this.listUpcomingRides : list = this.listPastRides;
            let iduser = JSON.parse(localStorage.getItem(STORAGE_KEY))["idusers"];
            let iddrive = list[index].iddrive;
            let initialDriveId = list[index].initialDriveId;

            await $.ajax({
                    accepts: "application/json",
                    async: true,
                    contentType: false,
                    processData: false,
                    url: getAbsPath("php/load_rides.php?/cancelRide/") + iddrive + "/" + iduser,
                    data: iddrive, iduser,
                    success: function (data) {
                        let result = JSON.parse(data);

                    // Prüfen ob das Laden erfolgreich war.
                    if (result["status"] === "success") {
                        appAccess.goBack('isCoDriverDetails');
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

        deleteRide: async function (index, isUpcoming) {

            var appAccess = this;
            let list;
            isUpcoming ? list = this.listUpcomingRides : list = this.listPastRides;
            let iddrive = list[index].iddrive;

            await $.ajax({
                accepts: "application/json",
                async: true,
                contentType: false,
                processData: false,
                url: getAbsPath("php/load_rides.php?/deleteRide/") + iddrive,
                data: iddrive,
                success: function (data) {
                    let result = JSON.parse(data);

                    // Prüfen ob das Laden erfolgreich war.
                    if (result["status"] === "success") {
                        appAccess.goBack('isDriverDetails');
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

        declineRequest: async function (index) {

            var appAccess = this;
            let iddrive = this.listNotAccepted[index].iddrive;
            let firstname = this.listNotAccepted[index].firstName;
            let lastname = this.listNotAccepted[index].lastName;
            let iduser = this.listNotAccepted[index].iduser;

            await $.ajax({
                accepts: "application/json",
                async: true,
                contentType: false,
                processData: false,
                url: getAbsPath("php/load_rides.php?/declineRide/") + iddrive + "/" + iduser,
                data: iddrive, iduser,
                success: async function (data) {
                    let result = JSON.parse(data);

                    // Prüfen ob das Laden erfolgreich war.
                    if (result["status"] === "success") {
                        appAccess.$refs.m1[index].classList.add('displayNone');
                        await appAccess.listNotAccepted.splice(index, 1);
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

        declineCommitment: async function (index) {

            let iddrive = this.listAccepted[index].iddrive;
            let firstname = this.listAccepted[index].firstName;
            let lastname = this.listAccepted[index].lastName;
            let iduser = this.listAccepted[index].iduser;
            let appAccess = this;

            await $.ajax({
                accepts: "application/json",
                async: true,
                contentType: false,
                processData: false,
                url: getAbsPath("php/load_rides.php?/reducePassengers/") + iddrive + "/" + iduser,
                data: iddrive, iduser,
                success: async function (data) {
                    let result = JSON.parse(data);

                    // Prüfen ob das Laden erfolgreich war.
                    if (result["status"] === "success") {
                        appAccess.$refs.m2[index].classList.add('displayNone');
                        await appAccess.listAccepted.splice(index, 1);
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

        confirmRequest: async function (index) {

            let iddrive = this.listNotAccepted[index].iddrive;
            let firstname = this.listNotAccepted[index].firstName;
            let lastname = this.listNotAccepted[index].lastName;
            let iduser = this.listNotAccepted[index].iduser;
            let appAccess = this;
            console.log("index");
            console.log(index);

            await $.ajax({
                accepts: "application/json",
                async: true,
                contentType: false,
                processData: false,
                url: getAbsPath("php/load_rides.php?/confirmRequest/") + iddrive + "/" + iduser,
                data: iddrive, iduser,
                success: async function (data) {
                    console.log(data);
                    let result = JSON.parse(data);


                    // Prüfen ob das Laden erfolgreich war.
                    if (result["status"] === "success") {
                        appAccess.$refs.m1[index].classList.add('displayNone');
                        let request = appAccess.listNotAccepted[index];
                        await appAccess.listNotAccepted.splice(index, 1);
                        await appAccess.listAccepted.push(request);
                    }

                    else {
                        // wenn maximale Anzahl an Mitfahrern schon erreicht
                        let errorField = document.getElementsByClassName("row-no-padding")[index];
                        errorField.innerHTML = result["statusmessage"];
                        errorField.classList.add("codriver-acceptance");
                        console.log(result["statusmessage"]);
                    }
                },
                error: function () {
                    console.log("Server Verbindung fehlgeschlagen.");
                }
            });

        },

        deletePastRides: async function () {
            let appAccess = this;
            let indizes = [];
            let list = this.listPastRides;
            for (let i = 0; i < this.listPastRides.length; i++) {
                if (this.listPastRides[i].iddrive === this.listPastRides[i].initialDriveId) {
                    indizes.push(i);
                }
            }
            for (let i = 0; i < indizes.length; i++) {
                await this.loadDriversRepetitions(indizes[i], false);
            }
            let currentDate = new Date();
            for (let i = 0; i < this.listPastRides.length; i++) {
                let iddrive = this.listPastRides[i].iddrive;
                console.log(this.listPastRides.length);
                if (this.listPastRides[i].dateTime < currentDate) {
                    Vue.set(this.listPastRides, i, 0);

                    await $.ajax({
                        accepts: "application/json",
                        async: true,
                        contentType: false,
                        processData: false,
                        url: getAbsPath("php/load_rides.php?/deleteSingleRide/") + iddrive,
                        data: iddrive,
                        success: function (data) {
                            let result = JSON.parse(data);

                            // Prüfen ob das Laden erfolgreich war.
                            if (result["status"] === "success") {
                                appAccess.goBack('isDriverDetails');
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
            }
        },

        goBack: async function (val) {
            (val === "isDriverDetails") ? this.isDriverDetails = false : this.isCoDriverDetails = false;
            this.listUpcomingRides = [];
            this.listPastRides = [];
            this.listAccepted = [];
            this.listNotAccepted = [];
            this.allUpcomingDriverRides = [];
            await (this.indexUpcomingRide = -1);
            await (this.indexPastRide = -1);

            if (val === "isDriverDetails") {
                this.loadDriversRides();
            } else {
                this.switchMenu();
            }
            this.setAcceptedCss();
        },

        openModal: function (index) {
            this.$refs.m1[index].classList.remove('displayNone');
        },

        openModal2: function (index) {
            this.$refs.m2[index].classList.remove('displayNone');
        },

        dontChangeCommitment: function (index) {
            this.$refs.m2[index].classList.add('displayNone');
        }

    },


    mounted: function () {
        redirectNotAuthUser("pages/login/login.html");
        this.loadDriversRides();

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