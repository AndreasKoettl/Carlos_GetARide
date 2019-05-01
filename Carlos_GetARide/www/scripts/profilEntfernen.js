function deleteUser() {
    event.preventDefault();

    let storageData = localStorage.getItem("carlosUser");

    if (storageData !== null) {

        let userData = JSON.parse(storageData);

        let formData = new FormData($("#profilEntfernen-form")[0]);

        formData.append("email", userData["email"]);

        $.post({
            accepts: "application/json",
            dataType: "json",
            async: true,
            contentType: false,
            processData: false,
            url: "/Carlos_GetARide/www/php/auth.php?/deleteUser",
            data: formData,
            success: function (data) {
                if (data["status"] === "success") {
                    window.location.href = "/Carlos_GetARide/www/index.html";
                } else {
                    $("#errorMessage").text(data["statusmessage"]);
                    $("#password").val("");
                }
            },
            error: function () {
                $("#errorMessage").text("Server Verbindung fehlgeschlagen");
            }
        });
    } else {
        window.location.href = "/Carlos_GetARide/www/index.html";
    }
}

$(document).ready(function () {
    $("#profilEntfernen-form").submit(deleteUser);
});