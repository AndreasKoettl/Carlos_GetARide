"use strict";


var carlos_meineFahrten_details = carlos_meineFahrten_details || {};


carlos_meineFahrten_details.app3 = new Vue({

    el: "#app3",

    data: {
    },

    methods: {
        switchToEditing: function () {
            event.preventDefault();
            window.location.href = "/carlos/Carlos_GetARide/www/pages/meine_fahrten/meine_fahrten_bearbeiten.html";
        },
        deleteRide: function () {
            event.preventDefault();
            window.location.href = "/carlos/Carlos_GetARide/www/pages/meine_fahrten/meine_fahrten_fahrt_geloescht.html";
        }
    }
});

carlos_meineFahrten_details.app4 = new Vue({

    el: "#app4",

    data: {
    },

    methods: {
        backToOverview: function () {
            window.location.href = "/carlos/Carlos_GetARide/www/pages/meine_fahrten/meine_fahrten.html";
        }
    }
});