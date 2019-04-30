$(document).ready(function () {
    $("#login-button").on("click", function (e) {
        //disable the button so we can't resubmit while we wait
        $("#login-button", this).attr("disabled", "disabled");
        var u = $("#email").val();
        var p = $("#password").val();
  
        $.post("http://localhost/carlos/Carlos_GetARide/www/php/auth.php/hello", function (data) {
                alert(data);
            }, "json");  
       
       
    });
});