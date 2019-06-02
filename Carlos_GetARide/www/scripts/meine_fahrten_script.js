"use strict";


var carlos_meineFahrten = carlos_meineFahrten || {};


carlos_meineFahrten.app = new Vue({

    el: "#app",

    data: {
        listUpcomingRides: [],
        listPastRides: [],
        listAccepted: [],
        listNotAccepted: [],
        isDriver: true,
        isDriverDetails: false,
        isCoDriverDetails: false,
        indexUpcomingRide: -1,
        indexPastRide: -1
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

                this.isDriver = false;

                this.listUpcomingRides = [];
                this.listPastRides = [];
                this.loadCodriversRides();
            }
            else {
                slider.style.left = '0px';
                codriver.classList.remove('active_menu');
                driver.classList.add('active_menu');

                this.isDriver = true;

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
                                let iddrive = result["data"][i]["iddrives"];
                                let routeStart = result["data"][i]["locationStart"];
                                let routeEnd = result["data"][i]["locationEnd"];
                                let dateTime = new Date(result["data"][i]["driveDate"]);
                                let accepted = result["data"][i]["accepted"];
                                let price = result["data"][i]["price"];
                                let passengers = result["data"][i]["passengers"];
                                let maxPassengers = result["data"][i]["maxPassengers"];
                                let licensePlate = result["data"][i]["licensePlate"];
                                let details = result["data"][i]["details"];

                                let currentDate = new Date();

                                if (currentDate <= dateTime) {
                                        if (result["data"][i]["iddrives"] === result["data"][i]["initialDriveId"]) {
                                            appAccess.listUpcomingRides.push({
                                                iddrive: iddrive,
                                                routeStart: routeStart,
                                                routeEnd: routeEnd,
                                                date: appAccess.formatDate(dateTime),
                                                time: appAccess.formatTime(dateTime),
                                                repeating: 1,
                                                initialDriveId: result["data"][i]["iddrives"],
                                                accepted: accepted,
                                                price: price,
                                                passengersAvailable: maxPassengers - passengers,
                                                licensePlate: licensePlate,
                                                details: details
                                            });
                                        }
                                        else if (result["data"][i]["initialDriveId"] === null) {
                                            appAccess.listUpcomingRides.push({
                                                iddrive: iddrive,
                                                routeStart: routeStart,
                                                routeEnd: routeEnd,
                                                date: appAccess.formatDate(dateTime),
                                                time: appAccess.formatTime(dateTime),
                                                repeating: 0,
                                                accepted: accepted,
                                                price: price,
                                                passengersAvailable: maxPassengers - passengers,
                                                licensePlate: licensePlate,
                                                details: details
                                            });
                                        }
                                }
                                else {
                                        if (result["data"][i]["iddrives"] === result["data"][i]["initialDriveId"]) {
                                            appAccess.listPastRides.push({
                                                iddrive: iddrive,
                                                routeStart: routeStart,
                                                routeEnd: routeEnd,
                                                date: appAccess.formatDate(dateTime),
                                                time: appAccess.formatTime(dateTime),
                                                repeating: 1,
                                                initialDriveId: result["data"][i]["iddrives"],
                                                accepted: accepted,
                                                price: price,
                                                passengersAvailable: maxPassengers - passengers,
                                                licensePlate: licensePlate,
                                                details: details
                                            });
                                        }
                                        else if (result["data"][i]["initialDriveId"] === null) {
                                            appAccess.listPastRides.push({
                                                iddrive: iddrive,
                                                routeStart: routeStart,
                                                routeEnd: routeEnd,
                                                date: appAccess.formatDate(dateTime),
                                                time: appAccess.formatTime(dateTime),
                                                repeating: 0,
                                                accepted: accepted,
                                                price: price,
                                                passengersAvailable: maxPassengers - passengers,
                                                licensePlate: licensePlate,
                                                details: details
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
                url: "/carlos/Carlos_GetARide/www/php/load_rides.php?/codriver/" + iduser,
                data: iduser,
                success: function (data) {
                    let result = JSON.parse(data);

                    // Prüfen ob das Anmelden erfolgreich war.
                    if (result["status"] === "success") {
                        for (let i = 0; i < result["data"].length; i++) {
                            let iddrive = result["data"][i][0]["iddrives"];
                            let routeStart = result["data"][i][0]["locationStart"];
                            let routeEnd = result["data"][i][0]["locationEnd"];
                            let dateTime = new Date(result["data"][i][0]["driveDate"]);
                            let accepted = result["data"][i]["accepted"];
                            let price = result["data"][i][0]["price"];
                            let passengers = result["data"][i][0]["passengers"];
                            let maxPassengers = result["data"][i][0]["maxPassengers"];
                            let licensePlate = result["data"][i][0]["licensePlate"];
                            let details = result["data"][i][0]["details"];
                            let idDriver = result["data"][i][0]["users_idusers"];

                            let currentDate = new Date();

                            if (currentDate <= dateTime) {
                                if (result["data"][i][0]["iddrives"] === result["data"][i][0]["initialDriveId"]) {
                                    appAccess.listUpcomingRides.push({
                                        iddrive: iddrive,
                                        routeStart: routeStart,
                                        routeEnd: routeEnd,
                                        date: appAccess.formatDate(dateTime),
                                        time: appAccess.formatTime(dateTime),
                                        repeating: 1,
                                        initialDriveId: result["data"][i][0]["iddrives"],
                                        isAccepted: accepted,
                                        price: price,
                                        passengersAvailable: maxPassengers - passengers,
                                        licensePlate: licensePlate,
                                        details: details,
                                        idDriver: idDriver,
                                        firstName: "Driver",
                                        lastName: idDriver
                                    });
                                }
                                else if (result["data"][i][0]["initialDriveId"] === null) {

                                    appAccess.listUpcomingRides.push({
                                        iddrive: iddrive,
                                        routeStart: routeStart,
                                        routeEnd: routeEnd,
                                        date: appAccess.formatDate(dateTime),
                                        time: appAccess.formatTime(dateTime),
                                        repeating: 0,
                                        isAccepted: accepted,
                                        price: price,
                                        passengersAvailable: maxPassengers - passengers,
                                        licensePlate: licensePlate,
                                        details: details,
                                        idDriver: idDriver,
                                        firstName: "Driver",
                                        lastName: idDriver
                                    });
                                }
                            }
                            else {
                                if (result["data"][i][0]["iddrives"] === result["data"][i][0]["initialDriveId"] && accepted == 1) {
                                    appAccess.listPastRides.push({
                                        iddrive: iddrive,
                                        routeStart: routeStart,
                                        routeEnd: routeEnd,
                                        date: appAccess.formatDate(dateTime),
                                        time: appAccess.formatTime(dateTime),
                                        repeating: 1,
                                        initialDriveId: result["data"][i][0]["iddrives"],
                                        isAccepted: accepted,
                                        price: price,
                                        passengersAvailable: maxPassengers - passengers,
                                        licensePlate: licensePlate,
                                        details: details,
                                        idDriver: idDriver,
                                        firstName: "Driver",
                                        lastName: idDriver
                                    });
                                }
                                else if (result["data"][i][0]["initialDriveId"] === null && accepted == 1) {
                                    appAccess.listPastRides.push({
                                        iddrive: iddrive,
                                        routeStart: routeStart,
                                        routeEnd: routeEnd,
                                        date: appAccess.formatDate(dateTime),
                                        time: appAccess.formatTime(dateTime),
                                        repeating: 0,
                                        isAccepted: accepted,
                                        price: price,
                                        passengersAvailable: maxPassengers - passengers,
                                        licensePlate: licensePlate,
                                        details: details,
                                        idDriver: idDriver,
                                        firstName: "Driver",
                                        lastName: idDriver
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


            this.setAcceptedCss();
        },

        setAcceptedCss: function () {
            for (let i = 0; i < this.listUpcomingRides.length; i++) {
                if (this.listUpcomingRides[i].isAccepted == 0) {
                    document.getElementsByClassName("box-meine-fahrten")[i].style.backgroundColor = "var(--grey-extralight)";
                }
            }
            for (let i = 0; i < this.listPastRides.length; i++) {
                if (this.listPastRides[i].isAccepted == 0) {
                    document.getElementsByClassName("box-meine-fahrten")[i+this.listUpcomingRides.length].style.backgroundColor = "var(--grey-extralight)";
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
            let month = date.getMonth()+1;
            let year = date.getFullYear();


            return day + ", " + dayNB + "." + month + "." + year;
        },

        formatTime: function (date) {
            let hours = date.getHours();
            let minutes = date.getMinutes();

            if (minutes < 10) {
                minutes = "0"+minutes;
            }

            if (hours < 10) {
                hours = "0"+hours;
            }

            return hours + ":" + minutes + " Uhr";
        },

        showDetails: async function (index, isUpcoming) {
            let list;
            isUpcoming ? list = this.listUpcomingRides : list = this.listPastRides;
                if (list[index].repeating === 1) {
                    let loadedRepetitions;
                    if (this.isDriver) {
                        loadedRepetitions = await this.loadDriversRepetitions(index, isUpcoming);
                    } else {
                        loadedRepetitions = await this.loadCoDriversRepetitions(index, isUpcoming);
                    }
                    list[index].repeating = 2;
                    this.setRepetitionCss();
                    this.setAcceptedCss();
                }
                else if (list[index].repeating === 2) {
                    for (let i = 0; i < list.length; i++) {
                        if (list[i].initialDriveId === list[index].initialDriveId) {
                            if (i !== index) {
                                list.splice(i, 1);
                                //document.getElementsByClassName("box-meine-fahrten")[i].style.backgroundColor = "white";
                                if (isUpcoming) {
                                    document.getElementsByClassName("box-meine-fahrten")[i].style.width = "80vw";
                                    document.getElementsByClassName("box-meine-fahrten")[i].style.margin = "0 auto 3vh auto";
                                }
                                else {
                                    document.getElementsByClassName("box-meine-fahrten")[i+this.listUpcomingRides.length].style.width = "80vw";
                                    document.getElementsByClassName("box-meine-fahrten")[i+this.listUpcomingRides.length].style.margin = "0 auto 3vh auto";
                                }
                                i--;
                            }
                        }
                    }
                    list[index].repeating = 1;
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

                    this.isDriver ? this.isDriverDetails = true : this.isCoDriverDetails = true;

                    if (list[index].isAccepted == 0) {
                        document.getElementsByTagName("body")[0].classList.remove("main");
                        document.getElementsByTagName("body")[0].classList.add("main-light-grey");
                    }
                    else {
                        document.getElementsByTagName("body")[0].classList.remove("main");
                        document.getElementsByTagName("body")[0].classList.add("main-white");
                    }
                    this.isDriver ? this.getCoDriversNames(index, isUpcoming) : this.getDriversName(list[index].idDriver, isUpcoming);
                }

        },

        setRepetitionCss: function () {
            for (let i = 0; i < this.listUpcomingRides.length; i++) {
                if (this.listUpcomingRides[i].repeating === 3) {
                    //document.getElementsByClassName("box-meine-fahrten")[i].style.backgroundColor = "var(--grey-extralight)";
                    document.getElementsByClassName("box-meine-fahrten")[i].style.width = "73vw";
                    document.getElementsByClassName("box-meine-fahrten")[i].style.marginRight = "10vw";
                }
            }
            for (let i = 0; i < this.listPastRides.length; i++) {
                if (this.listPastRides[i].repeating === 3) {
                    //document.getElementsByClassName("box-meine-fahrten")[i+this.listUpcomingRides.length].style.backgroundColor = "var(--grey-extralight)";
                    document.getElementsByClassName("box-meine-fahrten")[i+this.listUpcomingRides.length].style.width = "73vw";
                    document.getElementsByClassName("box-meine-fahrten")[i+this.listUpcomingRides.length].style.marginRight = "10vw";
                }
            }
        },

        loadDriversRepetitions: async function (index, isUpcoming) {

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
                            let iddrive = result["data"][i]["iddrives"];
                            let dateTime = new Date(result["data"][i]["driveDate"]);
                            let routeStart = result["data"][i]["locationStart"];
                            let routeEnd = result["data"][i]["locationEnd"];
                            let price = result["data"][i]["price"];
                            let passengers = result["data"][i]["passengers"];
                            let maxPassengers = result["data"][i]["maxPassengers"];
                            let licensePlate = result["data"][i]["licensePlate"];
                            let details = result["data"][i]["details"];

                            //if (result["data"][i]["iddrives"] !== result["data"][i]["initialDriveId"]) {
                                list.splice(index + 1, 0, {
                                    iddrive: iddrive,
                                    routeStart: routeStart,
                                    routeEnd: routeEnd,
                                    date: appAccess.formatDate(dateTime),
                                    time: appAccess.formatTime(dateTime),
                                    repeating: 3,
                                    initialDriveId: result["data"][i]["initialDriveId"],
                                    price: price,
                                    passengersAvailable: maxPassengers - passengers,
                                    licensePlate: licensePlate,
                                    details: details
                                });
                            //}
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
            let initalDriveId = list[index].initialDriveId;

            let ajaxRequest = await $.ajax({
                accepts: "application/json",
                async: true,
                contentType: false,
                processData: false,
                url: "/carlos/Carlos_GetARide/www/php/load_rides.php?/codriver/" + iduser,
                data: iduser,
                success: function (data) {
                    let result = JSON.parse(data);

                    // Prüfen ob das Laden erfolgreich war.
                    if (result["status"] === "success") {
                        let reversedResult = result["data"].reverse();

                        for (let i = 0; i < reversedResult.length; i++) {
                            let iddrive = result["data"][i][0]["iddrives"];
                            let dateTime = new Date(reversedResult[i][0]["driveDate"]);
                            let routeStart = result["data"][i][0]["locationStart"];
                            let routeEnd = result["data"][i][0]["locationEnd"];
                            let price = result["data"][i][0]["price"];
                            let passengers = result["data"][i][0]["passengers"];
                            let maxPassengers = result["data"][i][0]["maxPassengers"];
                            let licensePlate = result["data"][i][0]["licensePlate"];
                            let details = result["data"][i][0]["details"];
                            let idDriver = result["data"][i][0]["users_idusers"];

                            if (reversedResult[i][0]["initialDriveId"] === initalDriveId) {
                                list.splice(index + 1, 0, {
                                    iddrive: iddrive,
                                    routeStart: routeStart,
                                    routeEnd: routeEnd,
                                    date: appAccess.formatDate(dateTime),
                                    time: appAccess.formatTime(dateTime),
                                    repeating: 3,
                                    initialDriveId: initalDriveId,
                                    isAccepted: reversedResult[i]["accepted"],
                                    price: price,
                                    passengersAvailable: maxPassengers - passengers,
                                    licensePlate: licensePlate,
                                    details: details,
                                    idDriver: idDriver,
                                    firstName: "Driver",
                                    lastName: idDriver
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

        getDriversName: async function (iddriver, isUpcoming) {
            var appAccess = this;
            let list;
            isUpcoming ? list = this.listUpcomingRides : list = this.listPastRides;

            let ajaxRequest = await $.ajax({
                accepts: "application/json",
                async: true,
                contentType: false,
                processData: false,
                url: "/carlos/Carlos_GetARide/www/php/load_rides.php?/driverName/" + iddriver,
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
                url: "/carlos/Carlos_GetARide/www/php/load_rides.php?/coDriverNames/" + iddrive,
                data: iddrive,
                success: function (data) {
                    let result = JSON.parse(data);

                    // Prüfen ob das Laden erfolgreich war.
                    if (result["status"] === "success") {

                        for (let i = 0; i < result["data"].length; i++) {

                            let firstName = result["data"][i][0]["firstname"];
                            let lastName = result["data"][i][0]["lastname"];
                            let accepted = result["data"][i][1][0]["accepted"];

                            if (accepted == 0) {
                                appAccess.listNotAccepted.push({
                                    firstName: firstName,
                                    lastName: lastName
                                });
                            }
                            else {
                                appAccess.listAccepted.push({
                                    firstName: firstName,
                                    lastName: lastName
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

        goBack: function (val) {
            (val === "isDriverDetails") ? this.isDriverDetails = false : this.isCoDriverDetails = false;
            this.listUpcomingRides = [];
            this.listPastRides = [];
            this.listAccepted = [];
            this.listNotAccepted = [];
            if (document.getElementsByTagName("body")[0].classList.contains("main-light-grey")) {
                document.getElementsByTagName("body")[0].classList.remove("main-light-grey");
            }
            else {
                document.getElementsByTagName("body")[0].classList.remove("main-white");
            }
            document.getElementsByTagName("body")[0].classList.add("main");
            this.isDriver ? this.loadDriversRides() : this.loadCodriversRides();
            this.setAcceptedCss();
        }

    },



    mounted: function () {
        
        this.loadDriversRides();
    }
});