"use strict";
/*
 * MTD280 Online Multimedia
 * http://www.fh-ooe.at/mtd
 *
 * 5_WDP Web-Development
 * http://www.fh-ooe.at/mc
 *
 * Simple Vue.js Application Template
 *
 */

Vue.component('app-menu', {
    template: `
    <div id="nav-bar">
        <a href="/pages/mein-fahrten/fahrten.html" class="menu-item"><img class="icon" id="meine-fahrten" src="/images/icons/hakerl_icon.svg" /></a>
        <a href="/pages/fahrt-suchen/suchen.html" class="menu-item"><img class="icon" id="fahrt-suchen" src="/images/icons/magnifying-glass.svg" /></a>
        <a href="/pages/fahrt-erstellen/wohin.html" class="menu-item"><img class="icon" id="fahrt-erstellen" src="/images/icons/plus-button.svg" /></a>
        <a href="/pages/chat/chat.html" class="menu-item"><img class="icon chat-icon" id="chat" src="/images/icons/speech-bubble.svg" /></a>
        <a href="/pages/profil/profil.html" class="menu-item"><img class="icon" id="profil" src="/images/icons/user_colored.svg" /></a>
    </div>
    `
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

var carlos = carlos || {};

carlos.app = new Vue({
    el: "#app",
    data: {clickCounter:0},
    methods: {
        placeInputClick: function () {
            // change back button

            // change styles
            if (this.clickCounter==0) {
                // hide all unnecessary elements
                $('#illustration-big').css("display", "none");
                $('h1').css("display", "none");
                $('button').css("display", "none");
                let clickedId = '#'+event.target.id;
                $(clickedId).siblings().css("display", "none");
                $(clickedId).css("margin-top", "25vw");

             
                this.clickCounter++;
            }
        },
        clickMenu: function () {
            alert('hello');
            this.id = $(this).attr('id');
            sessionStorage.setItem('active', id);
            $("#" + id).addClass('active');
            let parent = $("#" + id).parent();
            parent.addClass('active-border');

        }
    },

    mounted: function () {
        //$('#header-container').load("/pages/fahrt-erstellen/header-fahrt-erstellen.html");
        //$('#nav-bar-container').load("/pages/nav-bar.html");
        //$('#nav-bar-container').load("/pages/nav-bar.html");

        //let id = sessionStorage.getItem('active');
        //$("#" + id).addClass('active');
        //let parent = $("#" + id).parent();
        //parent.addClass('active-border');       
    }

});
