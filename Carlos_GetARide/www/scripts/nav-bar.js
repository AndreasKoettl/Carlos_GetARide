$(document).ready(function () {
    $('.icon').click(function () {
        let id = $(this).attr('id');
        localStorage.setItem('active', id);
    });

    let id = localStorage.getItem('active');
    $("#" + id).addClass('active');
    let parent = $("#" + id).parent();
    parent.addClass('active-border');
});


