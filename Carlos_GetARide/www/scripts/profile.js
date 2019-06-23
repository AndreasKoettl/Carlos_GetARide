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
        email: "",
        profilePicture: "../../images/illustrationen/profile_default.svg",
        defaultProfilePicture: "../../images/illustrationen/profile_default.svg",
        iduser: "",
        newProfilePicture: false,
        isScrolling: false
    },

    methods: {
        loadUser: function () {
     
            var appAccess = this;
            let iduser = JSON.parse(localStorage.getItem("carlosUser"))["idusers"];
            this.iduser = iduser;
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

                        if (data["data"][0]["profileImageUrl"] != null) {
                            appAccess.profilePicture = data["data"][0]["profileImageUrl"];
                        }
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
            let formData = new FormData($("edit-profile-form")[0]);
            let appAccess = this;
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

                    console.log(data);
                    if (appAccess.newProfilePicture) {
                        document.getElementsByTagName("form")[0].submit();
                    }
                    else {
                        appAccess.profile = true;
                        appAccess.$el.querySelector('#settings-icon').classList.remove('hide');
                        appAccess.$el.querySelector('#backbutton').classList.add('hide');
                    }

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
        },

        loadProfilePicture: function () {
            this.newProfilePicture = true;
            let file    = document.querySelector('input[type=file]').files[0];
            let reader  = new FileReader();
            let appAccess = this;

            reader.addEventListener("load", function () {
                appAccess.profilePicture = reader.result;
            }, false);

            if (file) {
                reader.readAsDataURL(file);
            }

            if (this.newProfilePicture && this.profile) {
                document.getElementsByTagName("form")[0].submit();
                this.newProfilePicture = false;
            }
        },

        goBack: function () {
            console.log('going back');
            this.profile = true;
            this.loadUser();
            this.$el.querySelector('#settings-icon').classList.remove('hide');
            this.$el.querySelector('#backbutton').classList.add('hide'); 
        },

        goToSettings: function () {
            this.profile = false;
            this.settings = true;
            this.$el.querySelector('#settings-icon').classList.add('hide');
            this.$el.querySelector('#backbutton').classList.remove('hide');    
        },

        goToEdit: function () {
            this.profile = false;
            this.settings = false;
            this.$el.querySelector('#settings-icon').classList.add('hide');
            this.$el.querySelector('#backbutton').classList.remove('hide');   
        },

        logout: function () {
            $.post({
                accepts: "application/json",
                dataType: "json",
                async: true,
                contentType: false,
                processData: false,
                url: "../../php/auth.php?/logoutUser",
                success: function (data) {
                    //console.log(JSON.stringify(data["data"][0]));
                    console.log(data);
                    localStorage.removeItem(STORAGE_KEY);
                    redirectUser("./pages/login/login.html");
                },
                error: function () {
                    console.log("Server Verbindung fehlgeschlagen.");
                }
            });
        }
    },

    created: function () {
        this.loadUser();
    },

    mounted: function () {
        this.$el.querySelector('#settings-icon').classList.remove('hide');
        this.$el.querySelector('#backbutton').classList.add('hide');


        // activate scrolling shadow
        let self = this;
        let scrollPosition = 0;
        document.addEventListener("scroll", function () {
            self.isScrolling = true;
            scrollPosition = window.scrollY;
            if (scrollPosition === 0) {
                self.isScrolling = false;
            }
        });
    }

});