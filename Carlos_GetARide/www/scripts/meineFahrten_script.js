"use strict";


var carlos_meineFahrten = carlos_meineFahrten || {};


carlos_meineFahrten.app = new Vue({

    el: "#app",

    data: {
    },

    methods: {
        switchMenu: function () {
            let slider = document.getElementById('slider');
            let driver = document.getElementById('driver');
            let codriver = document.getElementById('codriver');

            if (slider.offsetLeft == 0) {
                slider.style.left = '40vw';
                driver.classList.remove('active_menu');
                codriver.classList.add('active_menu');
            }
            else {
                slider.style.left = '0px';
                codriver.classList.remove('active_menu');
                driver.classList.add('active_menu');
            }
        }
    }
});