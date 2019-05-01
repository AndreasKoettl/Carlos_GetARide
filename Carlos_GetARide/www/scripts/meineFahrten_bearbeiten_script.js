"use strict";


var carlos_meineFahrten_bearbeiten = carlos_meineFahrten_bearbeiten || {};


carlos_meineFahrten_bearbeiten.app5 = new Vue({

    el: "#app5",

    data: {
    },

    methods: {
        backToDetails: function () {
            window.location.href = "/carlos/Carlos_GetARide/www/pages/meine_fahrten/meine_fahrten_details.html";
        }
    }
});

carlos_meineFahrten_bearbeiten.app6 = new Vue({

    el: "#app6",

    data: {
    },

    methods: {
        saveData: function () {
            //change data
            event.preventDefault();
            window.location.href = "/carlos/Carlos_GetARide/www/pages/meine_fahrten/meine_fahrten_details.html";
        }
    }
});