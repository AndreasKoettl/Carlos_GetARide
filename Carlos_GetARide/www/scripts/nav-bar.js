let id = "";
$(document).ready(function () {
    $('.icon').click(function () {
        id = $(this).attr('id');
        $("#" + id).addClass('active');
    });

    if (id != "") {
        $("#"+ id).addClass('active');
        alert($(this).attr('id'));
    }
});


