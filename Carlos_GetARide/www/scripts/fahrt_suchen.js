"use strict";

var mtd280 = mtd280 || {};

mtd280.app = new Vue({ 
    el: "#app",

    data: {
      
    },

    methods: {
        submitSearch: function () {
            let formData = new FormData($("#search-form")[0]);
            event.preventDefault();
            $.post({
                accepts: "application/json",
                dataType: "json",
                async: true,
                contentType: false,
                processData: false,
                url: "../../php/search.php?/searchRide",
                data: formData,
                success: function (data) {
                    $console.log(JSON.stringify(data["data"][0]));
                },
                error: function () {
                    console.log("Server Verbindung fehlgeschlagen.");
                }
            });
        }
    }
});