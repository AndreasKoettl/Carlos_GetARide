"use strict";
/*
 * CARLOS Mitfahrbörse
 *
 */

var carlos = carlos || {};

carlos.app = new Vue({
    el: "#app",
    data: {
        driveData: [],
        process: ['route', 'repeating', 'dateTime', 'passengers', 'details', 'price', 'success'],
        index: 0,
        startValue: "",
        destinationValue: "",
        dateValue:"",
        timeValue: "",   
        passengersValue: "",
        licensePlateValue: "",
        carDetailsValue: "",
        priceValue:"",
        complete: false,        

    },
    methods: {
        goBack: function () {
            this.index--;
        },

        // checks if all the data has been entered for the different pages
        // if so set the corresponding submit-button enabled (red)
        checkIfComplete: function () {            
            switch (this.process[this.index]) {
                case 'route':
                    if (this.start.value != "" && this.destination.value != "") {
                        document.querySelector('#submitRoute').classList.remove('disabled');
                        this.complete = true;
                    }
                    break;
                case 'dateTime':              
                    if (this.date.value != "" && this.time.value != "") {                        
                        document.querySelector('#submitDateTime').classList.remove('disabled');
                        this.complete = true;
                    }
                    break;
                case 'passengers':
                    if (this.passengers.value != "") {
                        document.querySelector('#submitPassengers').classList.remove('disabled');
                        this.complete = true;
                    }
                    break;
                case 'details':
                    document.querySelector('#submitDetails').classList.remove('disabled');
                    this.complete = true;
                    break;
                case 'price':
                    if (this.price.value != "") {
                        document.querySelector('#submitDriveData').classList.remove('disabled');
                        document.querySelector('#submitDriveData').classList.add('active-green');
                        this.complete = true;
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

        submitData: function (data) {
            event.preventDefault();
            for (let i = 0; i < data.length; i++) {
                let element = this[data[i]];              
                if (typeof (element) == "object") {
                    this.driveData[data[i]] = element.value;
                } else if (typeof (element) == "boolean") {
                    this.driveData[data[i]] = element;
                }
            }                     
            this.index++;     
            this.complete = false;
        },        

        loadData: function () {
            // make sure that data that has been entered before is displayed again!
            switch (this.process[this.index]) {
                case 'route':        
                    if (this.driveData['start'] != null) {
                        this.startValue = this.driveData['start'];                        
                    }
                    if (this.driveData['destination'] != null) {
                        this.destinationValue = this.driveData['destination'];
                    }                    
                    break;
                case 'repeating':                    
                    if (this.driveData['repeating'] != null) {
                        if (this.driveData['repeating']) {
                            this.clickYes();
                        } else {
                            this.clickNo();
                        }
                    }
                    break;
                case 'dateTime':                    
                    if (this.driveData['date'] != null) {
                        this.dateValue = this.driveData['date'];
                    }
                    if (this.driveData['time'] != null) {
                        this.timeValue = this.driveData['time'];
                    }      
                    break;
                case 'passengers':
                    if (this.driveData['passengers'] != null) {
                        this.passengersValue = this.driveData['passengers'];
                    }
                    break;
                case 'details':
                    if (this.driveData['licensePlate'] != null) {
                        this.licensePlateValue = this.driveData['licensePlate'];
                    }
                    if (this.driveData['carDetails'] != null) {
                        this.carDetailsValue = this.driveData['carDetails'];
                    }
                    break;
                case 'price':
                    if (this.driveData['price'] != null) {
                        this.priceValue = this.driveData['price'];
                    }
                    break;
            }
        },
        init: function () {
            this.start = document.querySelector('#start');            
            this.destination = document.querySelector('#destination');
            this.date = document.querySelector('#date');
            this.time = document.querySelector('#time');
            this.passengers = document.querySelector('#numPassengers');
            this.licensePlate = document.querySelector('#licensePlate');
            this.carDetails = document.querySelector('#carDetails');
            this.price = document.querySelector('#priceValue');


            let activeCircle = document.querySelectorAll('.circle-active');
            if (activeCircle[0] != undefined) {
                activeCircle[0].classList.remove("circle-active");
            }
            document.querySelector('#circle-' + this.process[this.index]).className += (' circle-active');
        },

        placeInputGoBack: function () { 
     
        }
    },

    mounted: function () {       
        if (this.process[this.index] == 'route') {
            document.querySelector('#processHeader').classList.add("backButtonInvisible");
        }
        this.init();
    },
    beforeUpdate: function () {                
    },

    updated: function () {  
        if (this.process[this.index] != 'route') {
            document.querySelector('#processHeader').classList.remove("backButtonInvisible");
        }        
        this.init();
        this.loadData();
        this.checkIfComplete(); 
    }
});
