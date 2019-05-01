
$(document).ready(function () {
    console.log("ready");

    $.post({
        accepts: "application/json",
        dataType: "json",
        async: true,
        url: "php/dbTest.php",
        data: { idusers: "1" },
        success: function (data) {
      
            let user = data["data"][0];
       
            console.log(user);
        }
    });
});