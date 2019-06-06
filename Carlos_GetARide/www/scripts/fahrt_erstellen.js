"use strict";

var carlos = carlos || {};

carlos.app = new Vue({
    el: "#app",
    data: {
        driveData: [],
        process: ['route', 'repeating', 'dateTime', 'details', 'passengers','price', 'success'],
        index: 0,          
        startValue: "",
        destinationValue: "",
        dateValue:"",
        timeValue: "",   
        passengersValue: "",
        licensePlateValue: "",
        carDetailsValue: "",
        priceValue: "",
        slide:"slide",
        complete: false               
    },    
    methods: {
        // This method is called when a user clicks the back-button        
        goBack: function () {                                    
            // check if the back button has been hit on a place-input-page
            // or on a normal page
            if (document.getElementsByClassName('placeInputActive')[0] != null) {
                this.searchBoxLeave('back-button');
            } else {
                this.slide = "reverse-slide";
                this.$nextTick(function () {
                    this.index--;
                })
                
            }
        },

        // This method is called when a user clicks the place-input field
        // CSS-changes for a specific page should be made here
        searchBoxEnter: function () {            
            // unhide back-button
            document.querySelector('#processHeader').classList.remove("backButtonInvisible");            

            document.getElementsByClassName('placeInputActive')[0].classList.add('placeInputActiveChanges');

            // hide all unnecessary elements
            document.querySelectorAll('.illustration-big')[0].classList.add('displayNone');
            document.querySelectorAll('h1')[0].classList.add('displayNone');
            let button = document.getElementsByClassName('red-button');
            button[0].classList.add('displayNone');

            // hide all fields of the form, except active            
            let children = document.getElementsByClassName('textinput');
            for (let i = 0; i < children.length; i++) {
                if (!children[i].className.includes('placeInputActive')) {
                    children[i].classList.add('displayNone');
                }
            }            
        },

        // This method is called when a user leaves the place-input field
        // CSS-changes for a specific page should be made here
        searchBoxLeave: function (leaveMethod) {            
            document.getElementsByClassName('placeInputActiveChanges')[0].classList.remove('placeInputActiveChanges');

            // changes for going back from place-input with the back-button
            if (leaveMethod == 'back-button') {
                // remove active and content from place-input
                this.inputField = document.getElementsByClassName('placeInputActive')[0];
                this.inputField.classList.remove('placeInputActive');
                this.inputField.value = "";

                document.getElementById('suggestions').classList.add('displayNone');
                this.clearIcon = document.getElementById('clear-' + this.inputField.id);
                this.clearIcon.classList.add('displayNone');
                this.checkIfComplete();
            }

            //changes for going back from place-input in general
            // display all hidden elements again
            let hiddenElements = document.querySelectorAll('.displayNone');
            for (let i = 0; i < hiddenElements.length; i++) {
                if (!hiddenElements[i].classList.contains('clear-icon')){
                    hiddenElements[i].classList.remove('displayNone');
                }
            }     

            

            document.querySelector('#processHeader').classList.add("backButtonInvisible");  
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

            if (this.process[this.index] == "route") {
                this.driveData['start-city'] = sessionStorage.getItem('start-city');
                this.driveData['destination-city'] = sessionStorage.getItem('destination-city');
            }

            this.index++;     
            this.complete = false;
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

            // deactivate back-button on first page of the process
            if (this.process[this.index] == 'route') {
                document.querySelector('#processHeader').classList.add("backButtonInvisible");
            } else {
                document.querySelector('#processHeader').classList.remove("backButtonInvisible");
            }

            // activate the right circle
            let activeCircle = document.querySelectorAll('.circle-active');
            if (activeCircle[0] != undefined) {
                activeCircle[0].classList.remove("circle-active");
            }
            document.querySelector('#circle-' + this.process[this.index]).className += (' circle-active');

            // loadData for page repeating
            if (this.driveData['repeating'] != null) {
                if (this.driveData['repeating']) {
                    this.clickYes();
                } else {
                    this.clickNo();
                }
            }
        },        
    },

    mounted: function () {               
        this.init();        
    },   
    updated: function () {            
        this.init();        
        this.checkIfComplete();
        this.back = false;
        this.slide = "slide";
        console.log(this.driveData);
    }
});
