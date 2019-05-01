"use strict";

//var mtd280 = mtd280 || {};

import DatePick from '../node_modules/vue-date-pick';
import '../node_modules/vue-date-pick/dist/vueDatePick.css';


export default {
    components: { DatePick },
    data: () => ({
        date: '2019-01-01'
    })
};
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