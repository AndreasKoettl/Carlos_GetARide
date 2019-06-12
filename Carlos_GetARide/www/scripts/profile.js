"use strict";

new Vue({
    el: "#profilec",

    data: {
        profile: "true",
        settings: "false",
        edit: "false",
        firstname: "",
        lastname: "",
        email: ""

    },

    methods: {
        loadUser: function () {
            this.profile = false;
            this.settings = false;
            this.firstname = "Myfirstname";
            this.lastname= "Mylastname";
            this.email = "mymail@mail.com";
            console.log("hellomam");
        }
    },

    mounted: function() {
        console.log("dis go?");
    }

});