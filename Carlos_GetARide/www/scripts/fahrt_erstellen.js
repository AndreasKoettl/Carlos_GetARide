"use strict";

var carlos = carlos || {};

carlos.app = new Vue({
    el: "#app",
    data: {
        driveData: {},
        process: ['route', 'repeating', 'dateTime', 'details', 'passengers', 'price'],
        index: 0,
        startValue: "",
        destinationValue: "",
        dateValue: "",
        timeValue: "",
        weekdays: ["MO", "DI", "MI", "DO", "FR", "SA", "SO"],
        passengersValue: "",
        licensePlateValue: "",
        carDetailsValue: "",
        priceValue: "",
        slide: "slide",
        complete: false,
        isScrolling: false
    },
    methods: {
        // This method is called when a user clicks the back-button        
        goBack: function () {
            if (document.querySelector('.placeActive') == undefined) {
                this.slide = "reverse-slide";
                this.$nextTick(function () {
                    this.index--;
                })
            }            
        },

        // This method is called when a user leaves the place-input field
        // can be when he picks a place or when he hits the back-button        
        searchBoxLeave: function () {
            this.checkIfComplete();
        },

        // checks if all the data has been entered for the different pages
        // if so set the corresponding submit-button enabled (red)
        checkIfComplete: function () {
            switch (this.process[this.index]) {
                case 'route':
                    if (this.start.value != "" && this.destination.value != "") {
                        document.querySelector('#submitRoute').classList.remove('disabled');
                        this.complete = true;
                    } else {
                        document.querySelector('#submitRoute').classList.add('disabled');
                        this.complete = false;
                    }
                    break;
                case 'dateTime':
                    if (this.driveData["repeating"]) {
                        if (this.daysSelected.length > 0 && this.time.value != "" && this.startDate.value != "" && this.endDate.value != "") {
                            document.querySelector('#submitDateTimeRepeating').classList.remove('disabled');
                            this.complete = true;
                        } else {
                            document.querySelector('#submitDateTimeRepeating').classList.add('disabled');
                            this.complete = false;
                        }
                    } else {
                        if (this.date.value != "" && this.time.value != "") {
                            document.querySelector('#submitDateTime').classList.remove('disabled');
                            this.complete = true;
                        }
                    }
                    break;
                case 'passengers':
                    if (this.passengers.value != "" && this.passengers.value > 0) {
                        document.querySelector('#submitPassengers').classList.remove('disabled');
                        this.complete = true;
                    } else {
                        document.querySelector('#submitPassengers').classList.add('disabled');
                        this.complete = false;
                    }
                    break;
                case 'details':
                    document.querySelector('#submitDetails').classList.remove('disabled');
                    this.complete = true;
                    break;
                case 'price':
                    if (this.price.value != "" && this.price.value > 0) {
                        document.querySelector('#submitDriveData').classList.remove('disabled');
                        document.querySelector('#submitDriveData').classList.remove('red-button');
                        document.querySelector('#submitDriveData').classList.add('green-button');
               
                        this.complete = true;
                    } else {
                        document.querySelector('#submitDriveData').classList.add('disabled');
                        document.querySelector('#submitDriveData').classList.add('red-button');
                        document.querySelector('#submitDriveData').classList.remove('active-green');
                        this.complete = false;
                    }
                    break;
            }
        },

        clickYes: function () {
            document.querySelector('#yes').classList += ' active';
            if (document.querySelector('#no').classList.contains('active')) {
                document.querySelector('#no').classList.remove('active');
            }
            this.repeating = true;
            this.complete = true;
            document.querySelector('#submitRepeating').classList.remove('disabled');
        },

        clickNo: function () {
            document.querySelector('#no').classList += ' active';
            if (document.querySelector('#yes').classList.contains('active')) {
                document.querySelector('#yes').classList.remove('active');
            }
            this.repeating = false;
            this.complete = true;
            document.querySelector('#submitRepeating').classList.remove('disabled');
        },

        weekdayChoosen: function () {
            event.target.classList.toggle('active-weekday');
            this.checkIfComplete();
        },

        submitData: function (data) {
            event.preventDefault();
            // automatically save the different drive-data depending on the values of the paramater
            for (let i = 0; i < data.length; i++) {
                let element = this[data[i]];
                if (element.nodeName == 'INPUT') {
                    this.driveData[data[i]] = element.value;
                } else if (typeof (element) == 'boolean') {
                    this.driveData[data[i]] = element;
                }
            }

            if (this.process[this.index] == 'route') {
                this.driveData['cityStart'] = this.start.dataset.city;
                this.driveData['cityEnd'] = this.destination.dataset.city;
            } else if (this.process[this.index] == 'price') {
                this.submitForm();
            } else if (this.process[this.index] == 'dateTime' && this.driveData['repeating']) {
                let weekdays = {};
                for (let i = 0; i < this.daysSelected.length; i++) {
                    weekdays[i] = this.daysSelected[i].innerHTML;
                }
                this.driveData['weekdays'] = weekdays;
            }

            this.slide = "slide";
            this.$nextTick(function () {
                this.index++;

                if (this.index == 2) {
                    this.$nextTick(function () {
                        this.$el.querySelector('#date').min = new Date().toISOString().split("T")[0];
                    })                 
                }

            });
            this.complete = false;

        },

        submitForm: function () {
            let driveData = JSON.stringify(this.driveData);
            $.post({
                async: true,
                url: "/carlos/Carlos_GetARide/www/php/saveRide.php?/saveRide",
                data: { driveData: driveData },
                success: function (data) {
                    console.log(data);
                    //window.location = "/carlos/Carlos_GetARide/www/pages/fahrt_erstellen/fahrt_erstellen_success.html";
                },
                error: function () {
                    console.log("Server Verbindung fehlgeschlagen.");
                }
            });
        },

        init: function () {
            this.start = document.querySelector('#start');
            this.destination = document.querySelector('#destination');
            this.date = document.querySelector('#date');
            this.time = document.querySelector('#time');
            this.startDate = document.querySelector('#startDate');
            this.endDate = document.querySelector('#endDate');
            this.daysSelected = document.getElementsByClassName('active-weekday');
            this.passengers = document.querySelector('#numPassengers');
            this.licensePlate = document.querySelector('#licensePlate');
            this.carDetails = document.querySelector('#carDetails');
            this.price = document.querySelector('#priceValue');

            // deactivate back-button on first page of the process
            if (this.process[this.index] == 'route') {
                document.querySelector('#backbutton').classList.add("hide");
            } else {
                document.querySelector('#backbutton').classList.remove("hide");
            }

            // activate the right circle
            let activeCircle = document.querySelectorAll('.circle-active');
            if (activeCircle[0] != undefined) {
                activeCircle[0].classList.remove("circle-active");
            }
            document.querySelector('#circle-' + this.process[this.index]).classList.add('circle-active');

            if (this.driveData['repeating'] != null && this.process[this.index] == "repeating") {
                if (this.driveData['repeating']) {
                    this.clickYes();
                } else {
                    this.clickNo();
                }
            } else if (this.process[this.index] == "dateTime" && this.driveData['repeating'] && this.driveData['weekdays'] != undefined) {
                let indices = Object.keys(this.driveData['weekdays']);
                for (let i = 0; i < indices.length; i++) {
                    let id = this.driveData['weekdays'][i];
                    document.getElementById(id).classList.add('active-weekday');
                }
            }
        },
    },
    mounted: function () {
        redirectNotAuthUser("pages/login/login.html");
        let iduser = JSON.parse(localStorage.getItem(STORAGE_KEY))["idusers"];
        this.driveData["iduser"] = iduser;
        this.init();

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
        this.init();
        this.checkIfComplete();
        this.back = false;
    }
});
