function registerUser() {
    event.preventDefault();

    let formData = new FormData($("#register-form")[0]);

    $.post({
        accepts: "application/json",
        dataType: "json",
        async: true,
        contentType: false,
        processData: false,
        url: "/Carlos_GetARide/www/php/auth.php?/registerUser",
        data: formData,
        success: function (data) {
            if (data["status"] === "success") {
                window.location.href = "/Carlos_GetARide/www/pages/login/login.html";
            }
            else {
                $("#errorMessage").text("Registrierung fehlgeschlagen: " + data["statusmessage"]);
                $("#password").val("");
                $("#passwordRepeat").val("");
            }
        },
        error: function () {
            $("#errorMessage").text("Server Verbindung fehlgeschlagen");
        }
    });
}

$(document).ready(function () {
    $("#register-form").submit(registerUser);
});