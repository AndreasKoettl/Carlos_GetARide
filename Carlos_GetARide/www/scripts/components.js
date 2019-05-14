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
    template: `<input v-on:click="placeInputClicked" class="textinput" type="text" v-bind:id="id" v-bind:placeholder="placeholder"/>`,
    methods: {
        placeInputClicked: function () {
            if (this.clickCounter == 0) {
            // change back button
            if (window.location.href.includes('wohin')) {
                this.header.classList.toggle("backButtonInvisible");
            }

            document.querySelector('#back').onclick = function () {
                // adjust so that changes dont disappear
                location.reload();
                
            }                     
           
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
            }
            this.clickCounter++;

            // Create the search box and link it to the UI element.
            var input = document.getElementById(this.id);
            var searchBox = new google.maps.places.SearchBox(input);           
        }
    }, 
    mounted: function () {
        this.header = document.querySelector('header');
        if (window.location.href.includes('wohin')) {
            this.header.classList.add("backButtonInvisible");
        }
    }
});

var carlos = carlos || {};

carlos.app = new Vue({
    el: "#app",
    data: {},
    methods: {
        submitWohin: function () {
            event.preventDefault();
            window.location.href = ANDROID_ROOT+"pages/fahrt_erstellen/wiederholend.html";
            //window.location.href = "/carlos/Carlos_GetARide/www/pages/fahrt_erstellen/wiederholend.html";
        },
        clickYes: function () {
            document.querySelector('#yes').classList += ' active';
            if (document.querySelector('#no').classList.contains('active')) {
                document.querySelector('#no').classList.remove('active');
            }
        },
        clickNo: function () {
            document.querySelector('#no').classList += ' active';
            if (document.querySelector('#yes').classList.contains('active')) {
                document.querySelector('#yes').classList.remove('active');
            }
        },
        submitWiederholend: function () {
            window.location.href = ANDROID_ROOT + "pages/fahrt_erstellen/wann.html";
            //window.location.href = "/carlos/Carlos_GetARide/www/pages/fahrt_erstellen/wann.html";
        },
        submitWannEinzelfahrt: function () {
        }
    }
});
