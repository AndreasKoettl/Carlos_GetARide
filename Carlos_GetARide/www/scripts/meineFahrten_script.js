"use strict";


var carlos = carlos || {};

function switchMenu() {
    let slider = $("#slider");
    let driver = $("#driver");
    let codriver = $("#codriver");

    if (slider.css('left') == '0px') {
        slider.animate({ left: '40vw' }, 400, function () {
            driver.removeClass('active_menu');
            codriver.addClass('active_menu');
        });
        
    }
    else {
        slider.animate({ left: '0vw' }, 400, function () {
            codriver.removeClass('active_menu');
            driver.addClass('active_menu');
        });
    }
}

//const STORAGE_KEY = "VUE-G2";

carlos.app = new Vue({

    el: "#app",

    data: {
    },

    methods: {
        switchMenu: function () {
            console.log("hi");
            //$(".slider").css({ left: 50 });

        }
    }
});