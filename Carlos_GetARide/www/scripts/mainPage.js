"use strict";

var carlos = carlos || {};

carlos.app = new Vue({
    el: "#app",
    methods: {
        loadFahrtSuchen: function () {
            sessionStorage.setItem('active', 'fahrt-suchen');
            window.location.href = "pages/suchen/fahrt_suchen.html";
        },
        loadFahrtErstellen: function () {
            sessionStorage.setItem('active', 'fahrt-erstellen');
            window.location.href = "pages/fahrt_erstellen/fahrt_erstellen.html";
        }
    },
    created: function () {
        sessionStorage.setItem('active', '');
    },
    mounted: function () {        
        redirectNotAuthUser("pages/login/login.html");
    }
});