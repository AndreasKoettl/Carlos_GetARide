"use strict";

//var mtd280 = mtd280 || {};

var options = {
    type: 'date',         // 'date' or 'time', required
    date: new Date(),     // date or timestamp, default: current date
    minDate: new Date(),  // date or timestamp
    maxDate: new Date()   // date or timestamp
};

function myfunction() {
    window.DateTimePicker.pick(options, function (timestamp) {
        window.alert(timestamp);
    });
}



//mtd280.app = new Vue({ //{ => Object literal
//    el: "#app",

//    data: {
      
//    },

//    methods: {
//        hello: function(){
//            event.preventDefault();
//            console.log("HelloHello");
//        },

//        myfunction: function () {
//            window.DateTimePicker.pick(options, function (timestamp) {
//                window.alert(timestamp);
//            });
//        }
//    }
//});