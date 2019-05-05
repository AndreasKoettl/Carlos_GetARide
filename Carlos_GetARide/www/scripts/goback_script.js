"use strict";


var carlos_goBack = carlos_goBack || {};


carlos_goBack.app = new Vue({

    el: "#app",

    data: {
    },

    methods: {
        goBack: function () {
            history.back();
        }
    }
});