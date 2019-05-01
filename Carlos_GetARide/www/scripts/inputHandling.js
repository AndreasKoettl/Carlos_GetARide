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

                // add list with search-entries
                $('#form-wrapper').after("<ul><ul>");

                this.clickCounter++;
            }
        }
    },

    mounted: function () {
        $('#header-container').load("/pages/fahrt-erstellen/header-fahrt-erstellen.html");
        $('#nav-bar-container').load("/pages/nav-bar.html");
    }

});
