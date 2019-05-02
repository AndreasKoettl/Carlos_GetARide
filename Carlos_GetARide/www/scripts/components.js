"use strict";
/*
 * CARLOS Mitfahrbörse
 *
 */

Vue.component('nav-bar', {
    template: `
    <div id="nav-bar">
        <a href="/pages/mein-fahrten/fahrten.html" class="menu-item" id="meine-fahrten" v-on:click="clickMenu"><img class="icon" src="/images/icons/hakerl_icon.svg" /></a>
        <a href="/pages/fahrt-suchen/suchen.html" class="menu-item" id="fahrt-suchen" v-on:click="clickMenu"><img class="icon" src="/images/icons/magnifying-glass.svg" /></a>
        <a href="/pages/fahrt-erstellen/wohin.html" v-on:click="clickMenu" id="fahrt-erstellen" class="menu-item"><img class="icon" src="/images/icons/plus-button.svg" /></a>
        <a href="/pages/chat/chat.html" class="menu-item" v-on:click="clickMenu"><img class="icon chat-icon" id="chat" src="/images/icons/speech-bubble.svg" /></a>
        <a href="/pages/profil/profil.html" class="menu-item" id="profil" v-on:click="clickMenu"><img class="icon" src="/images/icons/user_colored.svg" /></a>
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

Vue.component('header-fahrt-erstellen', {
    template: `
    <header>
    <a href=""><img src="../../images/icons/back.svg" id="back"/></a>
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
    `
});


Vue.component('place-input', {
    data: function () {
        return {
            clickcounter: 0
        }
    },
    props: ['id', 'placeholder'],
    template: `
    <input v-on:click="placeInputClicked" class="textinput" type="text" v-bind:id="id" v-bind:placeholder="placeholder"/>
    `,
    methods: {
        placeInputClicked: function () {
            // change back button
            alert('hi');
            // change styles
            if (this.clickCounter == 0) {
                // hide all unnecessary elements
                $('#illustration-big').css("display", "none");
                $('h1').css("display", "none");
                $('button').css("display", "none");
                let clickedId = '#' + event.target.id;
                event.target.siblings().css("display", "none");
                $(clickedId).css("margin-top", "25vw");


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
       
    },

    mounted: function () {
        //$('#header-container').load("/pages/fahrt-erstellen/header-fahrt-erstellen.html");
        //$('#nav-bar-container').load("/pages/nav-bar.html");
        //$('#nav-bar-container').load("/pages/nav-bar.html");

            
    }

});
