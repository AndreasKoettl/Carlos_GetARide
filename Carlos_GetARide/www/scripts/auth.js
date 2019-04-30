$(document).ready(function () {
    $("#login-button").on("click", function (e) {
        //disable the button so we can't resubmit while we wait
        $("#login-button", this).attr("disabled", "disabled");
        var u = $("#email", this).val();
        var p = $("#password", this).val();
        if (u != '' && p != '') {
            $.post("https://www.coldfusionjedi.com/demos/2011/nov/10/service.cfc?method=login&returnformat=json", { username: u, password: p }, function (res) {
                if (res == true) {
                    $.mobile.changePage("some.html");
                } else {
                    navigator.notification.alert("Your login failed", function () { });
                }
                $("#login-button").removeAttr("disabled");
            }, "json");
        } else {
            console.log('username or password empty!');
        }
});