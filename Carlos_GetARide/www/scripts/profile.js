"use strict";

new Vue({
    el: "#profilec",

    data: {
        profile: true,
        settings: false,
        edit: false,
        hasNotifications: true,
        firstname: "",
        lastname: "",
        email: ""
    },

    methods: {
        loadUser: function () {
     
            var appAccess = this;
            let iduser = JSON.parse(localStorage.getItem("carlosUser"))["idusers"];
            $.ajax({
                accepts: "application/json",
                dataType: "json",
                async: true,
                contentType: false,
                processData: false,
                url: "../../php/profil.php?/loadUserData/" + iduser,
                success: function (data) {
                    //console.log(JSON.stringify(data["data"][0]));
                    console.log(data);
                    if (data) {
                        console.log(data["data"]);
                   
                        appAccess.firstname = data["data"][0]["firstname"];
                        appAccess.lastname = data["data"][0]["lastname"];
                        appAccess.email = data["data"][0]["email"];
                        appAccess.hasNotifications = (data["data"][0]["notifications"] == 0) ? false : true;
                       
                    }
                },
                error: function () {
                    console.log("Server Verbindung fehlgeschlagen.");
                }
            });
        },

        saveNewData: function () {
            event.preventDefault();
            let iduser = JSON.parse(localStorage.getItem("carlosUser"))["idusers"];
            let formData = new FormData($("#edit-profile-form")[0]);
            var appAccess = this;
            console.log(this.lastname);
            console.log(iduser);
            
            $.post({
                accepts: "application/json",
                dataType: "json",
                async: true,
                contentType: false,
                processData: false,
                url: "../../php/profil.php?/saveUserData/" + iduser + "/" + this.firstname + "/" + this.lastname + "/" + this.email,
                data: formData,
                success: function (data) {
                    //console.log(JSON.stringify(data["data"][0]));
                    console.log(data);
                    appAccess.profile = true;    
                },
                error: function () {
                    console.log("Server Verbindung fehlgeschlagen.");
                }
            });
        },

        changeNotifications: function (setTo) {
            this.hasNotifications = setTo;
            let iduser = JSON.parse(localStorage.getItem("carlosUser"))["idusers"];

            console.log(this.hasNotifications);

            $.post({
                accepts: "application/json",
                dataType: "json",
                async: true,
                contentType: false,
                processData: false,
                url: "../../php/profil.php?/changeNotifications/" + iduser + "/" + this.hasNotifications,
                success: function (data) {
                    //console.log(JSON.stringify(data["data"][0]));
                    console.log(data);
                },
                error: function () {
                    console.log("Server Verbindung fehlgeschlagen.");
                }
            });
        }
    },

    created: function () {
        this.loadUser();
    }

});