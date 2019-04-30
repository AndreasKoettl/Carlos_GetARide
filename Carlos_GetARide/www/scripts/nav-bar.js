$(document).ready(function () {
    let url = window.location.href;
    if (url.indexOf('fahrt-erstellen')) {
        $('#fahrt-erstellen').addClass("active");
    }
});