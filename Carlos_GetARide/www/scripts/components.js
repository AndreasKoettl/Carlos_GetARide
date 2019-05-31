"use strict";
/*
 * CARLOS Mitfahrbörse
 * Components General
 *
 */

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
    props: ['title'],
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
            clickCounter: 0,
            noSearchBox: true
        }
    },
    props: ['id', 'placeholder'],
    template: `<input v-on:click="placeInputClicked()" v-on:change="$emit('data-input', $event.target.value)" class="textinput" type="text" v-bind:id="id" v-bind:placeholder="placeholder"/>`,
    methods: {
        initAutocomplete: function () {
            alert('fail');
        },

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

            if (this.noSearchBox) {                
                // Create the autocomplete object, restricting the search predictions to
                // geographical location types.
                this.searchBox = new google.maps.places.Autocomplete(this.inputField, { types: ['geocode'] });
                
                // Avoid paying for data that you don't need by restricting the set of
                // place fields that are returned to just the address components.
                this.searchBox.setFields(['address_component']);

                // When the user selects an address from the drop-down, populate the
                // address fields in the form.                
                this.searchBox.addListener('place_changed', this.placePicked);

                //restrict search to certain countries
                this.searchBox.setComponentRestrictions({ 'country': ['at'] });                
                this.noSearchBox = false;
            }
        },

        placePicked: function () {            
            let componentForm = {
                street_number: 'short_name',
                route: 'long_name',
                locality: 'long_name',
                administrative_area_level_1: 'short_name',
                country: 'long_name',
                postal_code: 'short_name'
            };


            let place = this.searchBox.getPlace();
            for (var i = 0; i < place.address_components.length; i++) {
                var addresstype = place.address_components[i].types[0];
                if (addresstype == 'locality') {
                    var val = place.address_components[i][componentForm[addresstype]];
                    console.log(val);
                }
            }
            //var addressType = place.address_components[i].types[0];
            //console.log(place.address_components);
            //console.log(place.address_components[i][componentForm['administrative_area_level_1']]);
           

            this.clickCounter--;            

            // remove class of active place-input
            this.inputField.classList.remove("placeInputActive");

            // display all hidden elements again
            let hiddenElements = document.querySelectorAll('.displayNone');
            for (let i = 0; i < hiddenElements.length; i++) {
                hiddenElements[i].classList.remove('displayNone');
            }

            document.querySelector('#processHeader').classList.add("backButtonInvisible");            
        }
    }
});