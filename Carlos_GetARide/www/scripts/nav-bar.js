$('#nav-bar-container').load("/pages/nav-bar.html");
$(document).ready(function () {
    $('.icon').click(function () {
        let id = $(this).attr('id');
        sessionStorage.setItem('active', id);
    });

    let id = sessionStorage.getItem('active');
    $("#" + id).addClass('active');
    let parent = $("#" + id).parent();
    parent.addClass('active-border');
});


