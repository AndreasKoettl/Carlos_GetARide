function loginUser() {
    event.preventDefault();

    let formData = new FormData($("#login-form")[0]);

    $.post({
        accepts: "application/json",
        dataType: "json",
        async: true,
        contentType: false,
        processData: false,
        url: "/Carlos_GetARide/www/php/auth.php?/loginUser",
        data: formData,
        success: function (data) {
            if (data["status"] === "success") {
                window.location.href = "/Carlos_GetARide/www/index.html";
            }
            else {
                $("#errorMessage").text("Login fehlgeschlagen!");
                $("#password").val("");
            }
        },
        error: function () {
            $("#errorMessage").text("Server Verbindung fehlgeschlagen");
        }
    });
}

$(document).ready(function () {
    $("#login-form").submit(loginUser);
});