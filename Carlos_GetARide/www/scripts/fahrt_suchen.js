﻿"use strict";

var mtd280 = mtd280 || {};

mtd280.app = new Vue({ 
    el: "#app",

    data: {
        inputForm: true,
        resultsOverview: true,
        searchData: [],
        index: 0,
        start: "Startort nicht angegeben",
        end: "Zielort nicht angegeben",
        date: "",
        time: "",
        fullname: "",
        disable: false,
        isScrolling: false
    },

    methods: {
        submitSearch: function () {
            let tmp = this.$el.querySelector('#start').value;
            if (tmp !== "") {
                this.start = this.toUcFirst(tmp);
            }
            tmp = this.$el.querySelector('#end').value;
            if (tmp !== "") {
                this.end = this.toUcFirst(tmp);
            }
            tmp = this.$el.querySelector('#dateDrive').value;
            let tmp2 = this.$el.querySelector('#timeDrive').value;
            if (tmp !== "") {
                this.date = tmp;
                if (tmp2 !== "") {
                    this.time = ", " + tmp2 + " Uhr";
                }
            } else {
                if (tmp2 !== "") {
                    this.time = tmp2+" Uhr";
                } else {
                    this.date = "kein Datum/Uhrzeit angegeben"
                }
            }        

            let locationStart = this.$el.querySelector('#start').value || null;
            let locationEnd = this.$el.querySelector('#end').value || null;
            let dateDrive = this.$el.querySelector('#dateDrive').value || null;
            let timeDrive = this.$el.querySelector('#timeDrive').value || null;
            var appAccess = this;

            event.preventDefault();
            $.ajax({
                accepts: "application/json",
                dataType: "json",
                async: true,
                contentType: false,
                processData: false,
                url: "../../php/search.php?/searchRide/" + locationStart + "/" + locationEnd + "/" + dateDrive + "/" + timeDrive,
                success: function (data) {
                    //console.log(JSON.stringify(data["data"][0]));
                    if (data === false) {
                        console.log("Bitte geben Sie einen Startort oder einen Zielort an.");
                    } else {
                        console.log(data["data"]);
                        appAccess.searchData = data["data"];
                        for (let i = 0; i < appAccess.searchData.length; i++) {
                            let current = appAccess.searchData[i];
                            current["passengersAvailable"] = current["maxPassengers"] - current["passengers"];
                            let datetime = current["driveDate"];
                            datetime = datetime.split(" ");
                            current["formatDate"] = datetime[0].substring(8, 10) + "." + datetime[0].substring(5, 7) + "." + datetime[0].substring(0, 4) ;
                            current["formatTime"] = datetime[1].substring(0, 5);
                            let day = new Date(datetime[0]);
                            day = day.getDay();

                            switch (day) {
                                case 0:
                                    day = "So";
                                    break;
                                case 1:
                                    day = "Mo";
                                    break;
                                case 2:
                                    day = "Di";
                                    break;
                                case 3:
                                    day = "Mi";
                                    break;
                                case 4:
                                    day = "Do";
                                    break;
                                case 5:
                                    day = "Fr";
                                    break;
                                case 6:
                                    day = "Sa";
                                    break;
                            }

                            current["day"] = day;                      
                        }
                        appAccess.inputForm = false;
                        appAccess.$el.querySelector('#backbutton').classList.remove('hide'); 
                    }                      
                },
                error: function () {
                    console.log("Server Verbindung fehlgeschlagen.");
                }
            });
          
        },

        showDetails: function (index) {
            this.getUserById(this.searchData[index]["users_idusers"], index);
            this.index = index;
            let iduser = JSON.parse(localStorage.getItem("carlosUser"))["idusers"];
            this.checkIfCoDriver(iduser, this.searchData[index]["iddrives"]);
        },

        toUcFirst: function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },

        getUserById: function (iduser, index) {
            var appAccess = this;
            console.log("index" + index);
            $.ajax({
                accepts: "application/json",
                dataType: "json",
                async: true,
                contentType: false,
                processData: false,
                url: "../../php/search.php?/getUser/"+iduser,
                success: function (data) {
                    //console.log(JSON.stringify(data["data"][0]));
                    if (data === false) {
                        console.log("Bitte geben Sie einen Startort oder einen Zielort an.");
                    } else {
                        console.log(data["data"]);
                        let thename = data["data"][0]["firstname"] + " " + data["data"][0]["lastname"];
                        appAccess.searchData[index]["fullname"] = thename;
                        appAccess.resultsOverview = false;

                    }
                },
                error: function () {
                    console.log("Server Verbindung fehlgeschlagen.");
                }
            });
        },


        goBack: function () {
            if (this.resultsOverview) {
                this.inputForm = true;
                this.$el.querySelector('#backbutton').classList.add('hide');    
            } else {           
                this.resultsOverview = true;
            }
        },

        rideAlong: function () {
            let iduser = JSON.parse(localStorage.getItem("carlosUser"))["idusers"];
            let iddrives = this.searchData[this.index]["iddrives"];
            console.log("inside ride");
            $.post({
                accepts: "application/json",
                dataType: "json",
                async: true,
                contentType: false,
                processData: false,
                url: "../../php/search.php?/addRequest/" + iduser + "/" + iddrives,
                success: function (data) {
                    //console.log(JSON.stringify(data["data"][0]));
                    console.log(data + " Anfrage zum Mitfahren gesendet");
                },
                error: function () {
                    console.log("Server Verbindung fehlgeschlagen.");
                }
            });
        },

        checkIfCoDriver: function (iduser, iddrives) {
            var appAccess = this;

            $.ajax({
                accepts: "application/json",
                dataType: "json",
                async: true,
                contentType: false,
                processData: false,
                url: "../../php/search.php?/checkIfCoDriver/" + iduser + "/" + iddrives,
                success: function (data) {
                    //console.log(JSON.stringify(data["data"][0]));
                
                    if (data["data"][0]) {
                        appAccess.disable = true;
                    } else {
                        appAccess.disable = false;
                    }
                },
                error: function () {
                    console.log("Server Verbindung fehlgeschlagen.");
                }
            });
        }



    },

    mounted: function () {
        this.$el.querySelector('#backbutton').classList.add('hide');

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