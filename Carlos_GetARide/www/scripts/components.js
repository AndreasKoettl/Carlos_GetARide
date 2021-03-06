﻿"use strict";
/*
 * CARLOS Mitfahrbörse
 * Components General
 *
 */

// Navigation Bar component
Vue.component('nav-bar', {
    template: `
    <div id="menu">
    <a href="/carlos/Carlos_GetARide/www/pages/meine_fahrten/meine_fahrten.html" class="menu-item" id="meine-fahrten" v-on:click="clickMenu"><img class="icon" src="/carlos/Carlos_GetARide/www/images/icons/hakerl_icon.svg" /></a>
    <a href="/carlos/Carlos_GetARide/www/pages/suchen/fahrt_suchen.html" class="menu-item" id="fahrt-suchen" v-on:click="clickMenu"><img class="icon" src="/carlos/Carlos_GetARide/www/images/icons/magnifying-glass.svg" /></a>
    <a href="/carlos/Carlos_GetARide/www/pages/fahrt_erstellen/fahrt_erstellen.html" v-on:click="clickMenu" id="fahrt-erstellen" class="menu-item"><img class="icon" src="/carlos/Carlos_GetARide/www/images/icons/plus-button.svg" /></a>
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
    props: ['title', 'scrolling'],
    template: `
    <header v-bind:class="{'header-scroll-shadow': scrolling}">
       <h1>{{title}}</h1>
    </header>
`
});

Vue.component('header-back', {
    props: ['title', 'scrolling'],
    template: `
    <header v-bind:class="{'header-scroll-shadow': scrolling}">
        <a id="backbutton" @click="$emit('go-back', $event.target.value)"><img src="/carlos/Carlos_GetARide/www/images/icons/back.svg" class="header_icon"></a>
        <div><h1>{{title}}</h1></div>
        <a @click="$emit('go-there', $event.target.value)"><img src="/carlos/Carlos_GetARide/www/images/icons/settings.svg" id="settings-icon" class="header_icon hide"></a>
    </header>
`
});

// Header with the process bar for "fahrt-erstellen"
Vue.component('header-fahrt-erstellen', {
    props: ['title', 'scrolling'],
    template: `
    <header id="processHeader" v-bind:class="{'header-scroll-shadow': scrolling}">
    <a @click="$emit('go-back', $event.target.value)" id="backbutton"><img src="/carlos/Carlos_GetARide/www/images/icons/back.svg"/></a>
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

/**
* Input field for Place-Autocomplete
* disables and hides all other elements on the page
* emits: searchbox-leave
*/
Vue.component('place-input', {
    data: function () {
        return {
            clickCount: 0,
            formattedPlace:false
        }
    },
    props: ['id', 'placeholder', 'clearid', 'loadvalue'],
    template: `<div class="placeInputWrapper textinput"><img src="/carlos/Carlos_GetARide/www/images/icons/place.svg"/><input class="placeInput" v-bind:value="loadvalue" v-on:click="placeInputClicked()" type="text" v-bind:id="id" v-bind:placeholder="placeholder" v-on:keyup="return autoCompleteListener(event.target, event);"/>
<img src="/carlos/Carlos_GetARide/www/images/icons/x_ohne_kreis.svg" v-bind:id="clearid" class="clear-icon hide" v-on:click="clearInput()"/></div>`,
    methods: {
        placeInputClicked: function () {
            if (this.clickCount == 0) {

                this.inputField = event.target;
                this.inputField.classList.add("placeActive");
                this.clearIcon = document.getElementById('clear-' + this.inputField.id);
                this.backbutton = document.querySelector('#backbutton');


                // hide all unnecessary elements
                let children = document.querySelectorAll('#inputForm')[0].querySelectorAll("*");
                for (let i = 0; i < children.length; i++) {
                    if (children[i].childElementCount == 0 || children[i].classList.contains('placeInputWrapper')) {
                        children[i].classList.add('displayNone');
                    }
                }

                this.inputField.parentElement.classList.remove('displayNone');
                this.inputField.parentElement.childNodes[0].classList.remove('displayNone');
                this.inputField.classList.remove('displayNone');
                this.clearIcon.classList.remove('hide');
                this.clearIcon.classList.remove('displayNone');

                document.getElementById('menu').classList.add('displayNone');

                // unhide back-button if not visible
                this.backbutton.classList.remove("hide");

                // change back-button-event               
                this.backbutton.addEventListener('click', this.placeGoBack);
                this.clickCount++;
            }

            // Ajax-Request abschicken
            this.AUTOCOMPLETION_URL = 'https://autocomplete.geocoder.api.here.com/6.2/suggest.json';
            this.ajaxRequest = new XMLHttpRequest();
            this.query = '';

            // Attach the event listeners to the XMLHttpRequest object
            this.ajaxRequest.addEventListener("load", this.onAutoCompleteSuccess);
            this.ajaxRequest.addEventListener("error", this.onAutoCompleteFailed);
            this.ajaxRequest.responseType = "json";

            // set up containers for the panel
            this.suggestionsContainer = document.getElementById('suggestions');
            this.suggestionsContainer.classList.remove('displayNone');

            // initialize communication with the platform
            this.APPLICATION_ID = 'l4fIqul1eFhApaijcp0i';
            this.APPLICATION_CODE = 'dUxBZHyGQYjDx1AMP169Bw';

            var platform = new H.service.Platform({
                app_id: this.APPLICATION_ID,
                app_code: this.APPLICATION_CODE,
                useCIT: false,
                useHTTPS: true
            });

            var defaultLayers = platform.createDefaultLayers();
            var geocoder = platform.getGeocodingService();
        },

        /**
        * If the text in the text box  has changed, and is not empty,
        * send a geocoding auto-completion request to the server.
        *
        * @param {Object} textBox the textBox DOM object linked to this event
        * @param {Object} event the DOM event which fired this listener
        */
        autoCompleteListener: function (textBox, event) {            
            if (this.query != textBox.value) {
                if (textBox.value.length >= 1) {
                    var params = '?' +
                        'query=' + encodeURIComponent(textBox.value) +
                        '&maxresults=10' +
                        '&language=de' +
                        '&country=AUT' +
                        //'&mapview=48.217489, 16.049675;47.221794, 13.228341' +                       
                        '&app_id=' + this.APPLICATION_ID +
                        '&app_code=' + this.APPLICATION_CODE;
                    this.ajaxRequest.open('GET', this.AUTOCOMPLETION_URL + params);
                    this.ajaxRequest.send();
                }
            }
            this.query = textBox.value;
        },

        onAutoCompleteSuccess: function () {
            this.addSuggestionsToPanel(this.ajaxRequest.response);  // In this context, 'this' means the XMLHttpRequest itself.        
        },

        addSuggestionsToPanel: function (response) {
            this.suggestionsContainer.innerHTML = "";
            for (let i = 0; i < response['suggestions'].length; i++) {
                let data = response['suggestions'][i];

                let suggestion = document.createElement('li');
                suggestion.classList.add('suggestion');

                let matchlevel = data['matchLevel'];
                if (matchlevel == 'city') {
                    if (data['address']['state'] != undefined) {
                        suggestion.innerHTML = data['address']['city'] + ", " + data['address']['state'];
                        suggestion.dataset.city = data['address']['city'];
                    } else {
                        suggestion.innerHTML = data['address']['city'] + ", " + data['address']['country'];
                    }                    
                    suggestion.dataset.city = data['address']['city'];
                } else if (matchlevel == 'street') {
                    suggestion.innerHTML = data['address']['street'] + ", " + data['address']['city'];
                    suggestion.dataset.city = data['address']['city'];
                } else if (matchlevel == 'houseNumber') {
                    suggestion.innerHTML = data['address']['street'] + " " + data['address']['houseNumber'] + ", " + data['address']['city'];
                    suggestion.dataset.city = data['address']['city'];
                } else if (matchlevel == 'district') {
                    continue;                    
                } else if (matchlevel == 'state') {
                    continue;
                } else if (matchlevel == 'county') {
                    continue;
                } else if (matchlevel == 'country') {
                    continue;
                } 

                if (this.suggestionsContainer.childElementCount < 5) {
                    this.suggestionsContainer.appendChild(suggestion);
                    suggestion.addEventListener("click", this.placePicked);
                } else {
                    break;
                }                
            }

            if (this.suggestionsContainer.childElementCount == 0) {
                let emptySuggestionError = document.createElement('p');
                emptySuggestionError.innerHTML = "Es konnte leider kein Ort gefunden werden."
                this.suggestionsContainer.appendChild(emptySuggestionError);
            }
        },

        placePicked: function () {
            this.clickCount = 0;
            this.formattedPlace = true;

            // remove class of active place-input
            this.inputField.classList.remove("placeActive");            

            // set input-value to selected place
            this.inputField.value = event.target.innerHTML;
            this.inputField.dataset.city = event.target.dataset.city;
            
            // display all hidden elements again
            let hiddenElements = document.querySelectorAll('.displayNone');
            for (let i = 0; i < hiddenElements.length; i++) {
                if (!hiddenElements[i].classList.contains('clear-icon')) {
                    hiddenElements[i].classList.remove('displayNone');
                }
            }

            // hide and empty suggestionBox
            this.suggestionsContainer.classList.add('displayNone');
            this.suggestionsContainer.innerHTML = "";
            this.clearIcon.classList.add('displayNone');       

            // hide back-button, change back-event
            this.backbutton.classList.add("hide");
            this.backbutton.removeEventListener('click', this.placeGoBack);

            this.$emit('searchbox-leave');
        },

        clearInput: function () {
            this.formattedPlace = false;
            document.getElementsByClassName('placeActive')[0].value = "";
            document.getElementById('suggestions').innerHTML = "";
        },

        placeGoBack: function () {
            if (!this.formattedPlace) {
                // remove active and content from place-input           
                this.inputField.classList.remove('placeActive');
                this.inputField.value = "";

            }
            
            // display all hidden elements again
            let hiddenElements = document.querySelectorAll('.displayNone');
            for (let i = 0; i < hiddenElements.length; i++) {
                if (!hiddenElements[i].classList.contains('clear-icon')) {
                    hiddenElements[i].classList.remove('displayNone');
                }
            }

            // hide and empty suggestionBox     
            this.clearIcon = document.getElementById('clear-' + this.inputField.id);
            this.clearIcon.classList.add('displayNone');            
            this.suggestionsContainer.classList.add('displayNone');
            this.suggestionsContainer.innerHTML = "";
            this.clearIcon.classList.add('displayNone');
            this.clickCount = 0;

            // hide back-button, change back-event
            this.backbutton.classList.add("hide");
            this.backbutton.removeEventListener('click', this.placeGoBack);
            this.$emit('searchbox-leave');
        }
    }
});