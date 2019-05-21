﻿"use strict";
/*
 * CARLOS Mitfahrbörse
 *
 */

const ANDROID_ROOT = "/carlos/Carlos_GetARide/www/";

// nav-bar links for xampp testing



/*<div id="nav-bar">
    <a href="/android_asset/www/pages/meine_fahrten/meine_fahrten.html" class="menu-item" id="meine-fahrten" v-on:click="clickMenu"><img class="icon" src="/android_asset/www/images/icons/hakerl_icon.svg" /></a>
    <a href="/android_asset/www/pages/fahrt-suchen/suchen.html" class="menu-item" id="fahrt-suchen" v-on:click="clickMenu"><img class="icon" src="/android_asset/www/images/icons/magnifying-glass.svg" /></a>
    <a href="/android_asset/www/pages/fahrt_erstellen/wohin.html" v-on:click="clickMenu" id="fahrt_erstellen" class="menu-item"><img class="icon" src="/android_asset/www/images/icons/plus-button.svg" /></a>
    <a href="/android_asset/www/pages/chat/chat.html" class="menu-item" v-on:click="clickMenu"><img class="icon chat-icon" id="chat" src="/android_asset/www/images/icons/speech-bubble.svg" /></a>
    <a href="/android_asset/www/pages/profil/profil.html" class="menu-item" id="profil" v-on:click="clickMenu"><img class="icon" src="/android_asset/www/images/icons/user_colored.svg" /></a>
    </div >*/

// Navigation Bar component
Vue.component('nav-bar', {
    template: `
    <div id="nav-bar">
    <a href="/carlos/Carlos_GetARide/www/pages/meine_fahrten/meine_fahrten.html" class="menu-item" id="meine-fahrten" v-on:click="clickMenu"><img class="icon" src="/carlos/Carlos_GetARide/www/images/icons/hakerl_icon.svg" /></a>
    <a href="/carlos/Carlos_GetARide/www/pages/fahrt-suchen/suchen.html" class="menu-item" id="fahrt-suchen" v-on:click="clickMenu"><img class="icon" src="/carlos/Carlos_GetARide/www/images/icons/magnifying-glass.svg" /></a>
    <a href="/carlos/Carlos_GetARide/www/pages/fahrt_erstellen/wohin.html" v-on:click="clickMenu" id="fahrt_erstellen" class="menu-item"><img class="icon" src="/carlos/Carlos_GetARide/www/images/icons/plus-button.svg" /></a>
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
    <header>
    <a @click="goBack" id="back"><img src="/carlos/Carlos_GetARide/www/images/icons/back.svg"/></a>
    <div>
        <h3>{{title}}</h3>
        <div id="page-navigation">
            <div class="circle" id="circle-wohin"></div>
            <div class="circle" id="circle-wiederholend"></div>
            <div class="circle" id="circle-wann"></div>
            <div class="circle" id="circle-merkmale"></div>
            <div class="circle" id="circle-personen"></div>
            <div class="circle" id="circle-preis"></div>
        </div>
    </div>
</header>
    `,
    methods: {
        goBack: function () {
            history.back();
        }
    },
    mounted: function () {
        let path = document.location.pathname.match(/[^\/]+$/)[0];
        let id = path.slice(0, -5);
        document.querySelector('#circle-' + id).className += (' circle-active');
    }
});

// Input field for places, with search-functionality
Vue.component('place-input', {
    data: function () {
        return {
            clickCounter : 0
        }
    },
    props: ['id', 'placeholder'],
    template: `<input v-on:click="placeInputClicked" v-on:change="$emit('data-input', $event.target.value)" class="textinput" type="text" v-bind:id="id" v-bind:placeholder="placeholder"/>`,
    methods: {
        placeInputClicked: function () {
            if (this.clickCounter == 0) {
           
                if (window.location.href.includes('wohin')) {
                    this.header.classList.toggle("backButtonInvisible");
                }

                // change back button
                document.querySelector('#back').onclick = function () {
                    // adjust back so that changes dont disappear
                    location.reload();                
                }                     
           
                // hide all unnecessary elements
                document.querySelector('#illustration-big').classList.add('displayNone');
                document.querySelector('h1').classList.add('displayNone');
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
                new google.maps.LatLng(45.721952, 9.329633),
                new google.maps.LatLng(48.914576, 17.239527));
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
    }, 
    mounted: function () {
        this.header = document.querySelector('header');
        if (window.location.href.includes('wohin')) {
            this.header.classList.add("backButtonInvisible");
        }
    }
});

// vue for fahrt_anbieten
var carlos = carlos || {};

carlos.app = new Vue({  

    el: "#app",
    data: {
        driveData: []
    },
    methods: {
        submitWohin: function (start, ziel) {            
            this.driveData.push({
                start: start,
                ziel: ziel
            });
            localStorage.setItem("driveData", JSON.stringify(this.driveData));

            event.preventDefault();
            window.location.href = ANDROID_ROOT + "pages/fahrt_erstellen/wiederholend.html";           
            //window.location.href = "/carlos/Carlos_GetARide/www/pages/fahrt_erstellen/wiederholend.html";
        },

        checkIfComplete: function (page) {           
            if (page == "wohin") {
                let start = document.querySelector('#start').value;
                let ziel = document.querySelector('#ziel').value;
                if (start != "" && ziel != "") {
                    document.querySelector('#submitWohin').classList.remove('disabled');
                    this.complete = true;
                }
            }
        },

        addSubmit: function (page) {            
            if (this.complete) {
                if (page == "wohin") {
                    this.submitWohin(document.querySelector('#start').value, document.querySelector('#ziel').value);
                } else if (page == "wiederholend") {
                    this.submitWiederholend(this.wiederholend);
                }
            }            
            this.complete = false;
        },

        clickYes: function () {
            document.querySelector('#yes').classList += ' active';
            if (document.querySelector('#no').classList.contains('active')) {
                document.querySelector('#no').classList.remove('active');
            }
            this.wiederholend = true;
            this.complete = true;
            document.querySelector('#submitWiederholend').classList.remove('disabled');
        },
        clickNo: function () {
            document.querySelector('#no').classList += ' active';
            if (document.querySelector('#yes').classList.contains('active')) {
                document.querySelector('#yes').classList.remove('active');
            }
            this.wiederholend = false;
            this.complete = true;
            document.querySelector('#submitWiederholend').classList.remove('disabled');
        },
        submitWiederholend: function (wiederholend) {            
            this.driveData.push({
                wiederholend: wiederholend
            });
            localStorage.setItem("driveData", JSON.stringify(this.driveData));
            window.location.href = ANDROID_ROOT + "pages/fahrt_erstellen/wann.html";
            //window.location.href = "/carlos/Carlos_GetARide/www/pages/fahrt_erstellen/wann.html";
        },
        submitWannEinzelfahrt: function () {
        }
    },

    mounted: function () {
        this.driveData = JSON.parse(localStorage.getItem("driveData"));
    },

    updated: function () {
        
    }
});
