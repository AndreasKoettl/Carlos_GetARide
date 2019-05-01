"use strict";


var carlos_meineFahrten = carlos_meineFahrten || {};


carlos_meineFahrten.app = new Vue({

    el: "#app",

    data: {
    },

    methods: {
        switchMenu: function () {
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
    }
});

carlos_meineFahrten.app2 = new Vue({

    el: "#app2",

    data: {
    },

    methods: {
        switchToDetails: function () {
            window.location.href = "/carlos/Carlos_GetARide/www/pages/meine_fahrten/meine_fahrten_details.html";
        }
    }
});