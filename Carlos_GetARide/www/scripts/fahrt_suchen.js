"use strict";

const NO_START = "Startort nicht angegeben";
const NO_END = "Zielort nicht angegeben";

var mtd280 = mtd280 || {};

mtd280.app = new Vue({ 
    el: "#app",

    data: {
        inputForm: true,
        resultsOverview: true,
        searchData: [],
        index: 0,
        start: NO_START,
        cityStart: null,
        end: NO_END,
        cityEnd: null,
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

            let iduser = JSON.parse(localStorage.getItem("carlosUser"))["idusers"];
            this.cityStart = this.$el.querySelector('#start').dataset.city || this.cityStart;
            this.cityEnd = this.$el.querySelector('#end').dataset.city || this.cityEnd;
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
                url: "../../php/search.php?/searchRide/" + this.cityStart + "/" + this.cityEnd + "/" + dateDrive + "/" + timeDrive+ "/" + iduser,
                success: function (data) {
                    //console.log(JSON.stringify(data["data"][0]));
                    if (data === false) {
                        console.log("Bitte geben Sie einen Startort oder einen Zielort an.");
                    } else {
                        console.log(data);
                        appAccess.searchData = data["data"];
                        for (let i = 0; i < appAccess.searchData.length; i++) {
                            //calculate remaining passengers
                            let current = appAccess.searchData[i];
                            current["passengersAvailable"] = current["maxPassengers"] - current["passengers"];
                            //generate a readable Time and Date (Format)
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
                        console.log("User nicht gefunden");
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

                if (this.start != NO_START) {
                    this.$nextTick(function () {
                        this.$el.querySelector('#start').value = this.start;
                    })              
                }
                if (this.end != NO_END) {
                    this.$nextTick(function () {
                        this.$el.querySelector('#end').value = this.end;
                    })
                }
                if (this.date != "kein Datum/Uhrzeit angegeben") {
                    this.$nextTick(function () {
                        this.$el.querySelector('#dateDrive').value = this.date;
                    })
                }
                if (this.time != "") {
                    this.$nextTick(function () {
                        this.$el.querySelector('#timeDrive').value = this.time;
                    })
                }

            } else {           
                this.resultsOverview = true;
            }
        },

        rideAlong: function () {
            var appAccess = this;
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
                    appAccess.disable = true;
                    appAccess.$el.querySelector('#ride-along').disabled = true;
                    console.log(data);
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
        },

        searchBoxLeave: function (param) {
            this.checkStartOrEnd();
            if(param == 'start'){
                this.cityStart = this.$el.querySelector('#start').dataset.city || null;
                this.start = this.$el.querySelector('#start').value || NO_START;
            } else if (param == 'end') {
                this.cityEnd = this.$el.querySelector('#end').dataset.city || null;
                this.end = this.$el.querySelector('#end').value || NO_END;
            }              
        },

        checkStartOrEnd: function () {
            let tmpStart = this.$el.querySelector('#start').value;
            let tmpEnd = this.$el.querySelector('#end').value;
            console.log('tmpStart ' + tmpStart);
            if (tmpStart != "" || tmpEnd != "") {
                this.$el.querySelector('#searchButton').classList.remove('disabled');   
            } else {
                this.$el.querySelector('#searchButton').classList.add('disabled');   
            }
        }

    },

    mounted: function () {
        redirectNotAuthUser("pages/login/login.html");
        this.$el.querySelector('#backbutton').classList.add('hide');
        this.$el.querySelector('#dateDrive').min = new Date().toISOString().split("T")[0];

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
    },

    updated: function () {
        console.log('updated');
        this.$nextTick(function () {
            if (this.inputForm) {
                console.log('check');
                this.checkStartOrEnd();
            }  
        })
             
    }
});