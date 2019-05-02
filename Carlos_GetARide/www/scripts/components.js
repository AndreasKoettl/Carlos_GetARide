"use strict";
/*
 * CARLOS Mitfahrbörse
 *
 */

// Navigation Bar component
Vue.component('nav-bar', {
    template: `
    <div id="nav-bar">
        <a href="/carlos/Carlos_GetARide/www/pages/mein-fahrten/fahrten.html" class="menu-item" id="meine-fahrten" v-on:click="clickMenu"><img class="icon" src="/carlos/Carlos_GetARide/www/images/icons/hakerl_icon.svg" /></a>
        <a href="/Carlos_GetARide/www/pages/fahrt-suchen/suchen.html" class="menu-item" id="fahrt-suchen" v-on:click="clickMenu"><img class="icon" src="/carlos/Carlos_GetARide/www/images/icons/magnifying-glass.svg" /></a>
        <a href="/carlos/Carlos_GetARide/www/pages/fahrt-erstellen/wohin.html" v-on:click="clickMenu" id="fahrt-erstellen" class="menu-item"><img class="icon" src="/carlos/Carlos_GetARide/www/images/icons/plus-button.svg" /></a>
        <a href="/pages/chat/chat.html" class="menu-item" v-on:click="clickMenu"><img class="icon chat-icon" id="chat" src="/carlos/Carlos_GetARide/www/images/icons/speech-bubble.svg" /></a>
        <a href="/carlos/Carlos_GetARide/www/pages/profil/profil.html" class="menu-item" id="profil" v-on:click="clickMenu"><img class="icon" src="/carlos/Carlos_GetARide/www/images/icons/user_colored.svg" /></a>
    </div>
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
        let target = document.getElementById(id);
        target.className += ' active-border';
        let child = target.childNodes[0];
        child.className += ' active';  
    }
});


// Header with the process bar for "fahrt-erstellen"
Vue.component('header-fahrt-erstellen', {
    template: `
    <header>
    <a @click="$route.go(-1)" id="back"><img src="/carlos/Carlos_GetARide/www/images/icons/back.svg"/></a>
    <div>
        <h3>Fahrt erstellen</h3>
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
    template: `<input v-on:click="placeInputClicked" class="textinput" type="text" v-bind:id="id" v-bind:placeholder="placeholder"/>`,
    methods: {
        placeInputClicked: function () {
            // change back button
            document.querySelector('#back').onclick = function () {
                // adjust so that changes dont disappear
                location.reload();
            }

            // change styles
            if (this.clickCounter == 0) {
            // hide all unnecessary elements
            document.querySelector('#illustration-big').style.display = "none";
            document.querySelector('h1').style.display = "none";
            let inputField = event.target;
            inputField.className += " placeInputActive";

            // hide all fields of the form, except active
            let children = inputField.parentElement.childNodes;
            for (let i = 0; i < children.length; i += 2) {
                if (!children[i].className.includes('placeInputActive')) {
                    children[i].style.display = "none";
                }
            }        
            this.clickCounter++;
            }
        }
    }
});

var carlos = carlos || {};

carlos.app = new Vue({
    el: "#app",
    data: {clickCounter:0},
    methods: {
       
    }
});
