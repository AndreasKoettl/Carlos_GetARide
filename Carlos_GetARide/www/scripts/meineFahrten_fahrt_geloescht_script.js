"use strict";


var carlos_meineFahrten_fahrt_geloescht = carlos_meineFahrten_fahrt_geloescht || {};


carlos_meineFahrten_fahrt_geloescht.app7 = new Vue({

    el: "#app7",

    data: {
    },

    methods: {
        backToOverview: function () {
            window.location.href = "/carlos/Carlos_GetARide/www/pages/meine_fahrten/meine_fahrten.html";
        }
    }
});