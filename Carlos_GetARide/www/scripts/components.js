"use strict";
/*
 * CARLOS Mitfahrbörse
 *
 */

const ANDROID_ROOT = "/carlos/Carlos_GetARide/www/";

// nav-bar links for xampp testing


/*<div id="nav-bar">
    <a href="/android_asset/www/pages/meine_fahrten/meine_fahrten.html" class="menu-item" id="meine-fahrten" v-on:click="clickMenu"><img class="icon" src="/android_asset/www/images/icons/hakerl_icon.svg" /></a>
    <a href="/android_asset/www/pages/fahrt-suchen/suchen.html" class="menu-item" id="fahrt-suchen" v-on:click="clickMenu"><img class="icon" src="/android_asset/www/images/icons/magnifying-glass.svg" /></a>
    <a href="/android_asset/www/pages/fahrt_erstellen/fahrt_erstellen.html" v-on:click="clickMenu" id="fahrt_erstellen" class="menu-item"><img class="icon" src="/android_asset/www/images/icons/plus-button.svg" /></a>
    <a href="/android_asset/www/pages/chat/chat.html" class="menu-item" v-on:click="clickMenu"><img class="icon chat-icon" id="chat" src="/android_asset/www/images/icons/speech-bubble.svg" /></a>
    <a href="/android_asset/www/pages/profil/profil.html" class="menu-item" id="profil" v-on:click="clickMenu"><img class="icon" src="/android_asset/www/images/icons/user_colored.svg" /></a>
    </div >*/

// Navigation Bar component
Vue.component('nav-bar', {
    template: `
    <div id="nav-bar">
    <a href="/carlos/Carlos_GetARide/www/pages/meine_fahrten/meine_fahrten.html" class="menu-item" id="meine-fahrten" v-on:click="clickMenu"><img class="icon" src="/carlos/Carlos_GetARide/www/images/icons/hakerl_icon.svg" /></a>
    <a href="/carlos/Carlos_GetARide/www/pages/fahrt-suchen/suchen.html" class="menu-item" id="fahrt-suchen" v-on:click="clickMenu"><img class="icon" src="/carlos/Carlos_GetARide/www/images/icons/magnifying-glass.svg" /></a>
    <a href="/carlos/Carlos_GetARide/www/pages/fahrt_erstellen/fahrt_erstellen.html" v-on:click="clickMenu" id="fahrt_erstellen" class="menu-item"><img class="icon" src="/carlos/Carlos_GetARide/www/images/icons/plus-button.svg" /></a>
    <a href="/carlos/Carlos_GetARide/www/pages/chat/chat.html" class="menu-item" v-on:click="clickMenu"><img class="icon chat-icon" id="chat" src="/carlos/Carlos_GetARide/www/images/icons/speech-bubble.svg" /></a>
    <a href="/carlos/Carlos_GetARide/www/pages/profil/profil.html" class="menu-item" id="profil" v-on:click="clickMenu"><img class="icon" src="/carlos/Carlos_GetARide/www/images/icons/user_colored.svg" /></a>
    </div >
    `,
    methods: {
        clickMenu: function (event) {
            let id = event.target.id;
            if (id != "") {
                sessionStorage.setItem('active', id);
            } else {
                sessionStorage.setItem('active', event.target.parentElement.id);
            }
        }
    },
    mounted: function () {
        // highlight active Menu-Item
        let id = sessionStorage.getItem('active');
        if (id != null) {
        let target = document.getElementById(id);
        target.className += ' active-border';
        let child = target.childNodes[0];
        child.className += ' active';  
        }        
    }
});


Vue.component('header-title', {
    props: ['title'],
    template: `
    <header>
            <h1 class="mainHeading">{{title}}</h1>
    </header>
`
});
 // /carlos/Carlos_GetARide/www/images/icons/back.svg
Vue.component('header-back', {
    props: ['title'],
    template: `
    <header class="row">
        <img src="/carlos/Carlos_GetARide/www/images/icons/back.svg" class="header_icon" @click="goBack">
        <h1>{{title}}</h1>
    </header>
`,
    methods: {
        goBack: function () {
            history.back();
        }
    }
});

// Header with the process bar for "fahrt-erstellen"
Vue.component('header-fahrt-erstellen', {
    props:['title'],
    template: `
    <header id="processHeader">
    <a @click="$emit('go-back', $event.target.value)" id="back"><img src="/carlos/Carlos_GetARide/www/images/icons/back.svg"/></a>
    <div>
        <h3>{{title}}</h3>
        <div id="page-navigation">
            <div class="circle" id="circle-route"></div>
            <div class="circle" id="circle-repeating"></div>
            <div class="circle" id="circle-dateTime"></div>
            <div class="circle" id="circle-passengers"></div>            
            <div class="circle" id="circle-details"></div>            
            <div class="circle" id="circle-price"></div>
        </div>
    </div>
</header>
    `
});

// Input field for places, with search-functionality
// disables and hides all other elements on the page
// emits a data-input Event on change
Vue.component('place-input', {
    data: function () {
        return {
            clickCounter : 0
        }
    },
    props: ['id', 'placeholder'],
    template: `<input v-on:click="placeInputClicked()" v-on:change="$emit('data-input', $event.target.value)" class="textinput" type="text" v-bind:id="id" v-bind:placeholder="placeholder"/>`,
    methods: {
        placeInputClicked: function () {
            if (this.clickCounter == 0) {
                // change back-button here !!!
                document.querySelector('#processHeader').classList.remove("backButtonInvisible");                
           
                // hide all unnecessary elements
                document.querySelectorAll('.illustration-big')[0].classList.add('displayNone');
                document.querySelectorAll('h1')[0].classList.add('displayNone');
                this.inputField = event.target;
                this.inputField.classList.add("placeInputActive");

                // hide all fields of the form, except active
                let children = this.inputField.parentElement.childNodes;
                for (let i = 0; i < children.length; i += 2) {
                    if (!children[i].className.includes('placeInputActive')) {
                        children[i].classList.add('displayNone');
                    }
                }            
            }
            this.clickCounter++;

            // Create the search box and link it to the UI element.          
            //let defaultBounds = new google.maps.LatLngBounds(
            //    new google.maps.LatLng(48.087166, 17.303634),
            //    new google.maps.LatLng(47.396249, 10.731279));

            var defaultBounds = new google.maps.LatLngBounds(                
                new google.maps.LatLng(46.959182, 10.886682),
                new google.maps.LatLng(48.498183, 16.646211));
            this.searchBox = new google.maps.places.SearchBox(this.inputField, { bounds: defaultBounds });
            this.searchBox.addListener('places_changed', this.placePicked);            
                  
        },

        placePicked: function () {            
            this.clickCounter--;
            // get the place that has been picked
            // let place = this.searchBox.getPlaces()[0];

            // remove class of active place-input
            this.inputField.classList.remove("placeInputActive");

            // display all hidden elements again
            let hiddenElements = document.querySelectorAll('.displayNone');
            for (let i = 0; i < hiddenElements.length; i++) {
                hiddenElements[i].classList.remove('displayNone');
            }           
        }
    }
});

// vue for fahrt_anbieten
var carlos = carlos || {};

carlos.app = new Vue({
    el: "#app",
    data: {
        driveData: [],
        process: ['route', 'repeating', 'dateTime', 'passengers', 'details', 'price'],
        index: 0,
        startValue: "",
        destinationValue: "",
        dateValue:"",
        timeValue: "",   
        passengersValue:"",
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
                    break;
                case 'price':
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
                    if (this.driveData['start'] != null) {
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
                    break;
                case 'price':
                    break;
            }
        },
        init: function () {
            this.start = document.querySelector('#start');            
            this.destination = document.querySelector('#destination');
            this.date = document.querySelector('#date');
            this.time = document.querySelector('#time');
            this.passengers = document.querySelector('#numPassengers');


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

    updated: function () {  
        if (this.process[this.index] != 'route') {
            document.querySelector('#processHeader').classList.remove("backButtonInvisible");
        }        
        this.init();
        this.loadData();
        this.checkIfComplete(); 
    }
});
