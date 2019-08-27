NProgress.configure(false);

$('document').ajaxStart(function () {
    NProgress.start();
});

$('document').ajaxStop(function () {
    NProgress.done();
});


if (location.href.indexOf('login.html') === -1) {
    $.ajax({
        type: 'get',
        url: '/employee/checkRootLogin',
        dataType: 'json',
        success: function (info) {
            if (info.error === 400) {
                location.href = 'login.html';
            }
        }
    })
}


$(function () {
    $('.category').click(function () {
        console.log('123');
        $('.child').stop().slideToggle(500);
    });

    $('.icon_menu').click(function () {
        $('.lt_aside').toggleClass('hidemenu');
        $('.lt_main').toggleClass('hidemenu');
        $('.lt_main .lt_topbar').toggleClass('hidemenu');
    });

    $('.icon_logout').click(function () {
        $('#logoutModal').modal("show")
    });

    $('#logoutBtn').click(function () {
        $.ajax({
            type: 'get',
            url: '/employee/employeeLogout',
            dataType: 'json',
            success: function (info) {
                if (info.success) {
                    location.href = 'login.html';
                }
            }
        });
    })



})