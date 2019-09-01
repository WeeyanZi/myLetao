$(function () {

    // 左侧一级分类数据 请求及泫然
    $.ajax({
        type: 'get',
        url: '/category/queryTopCategory',
        dataTyple: 'json',
        success: function (info) {
            var htmlStr = template('leftTpl', info);
            $('.lt_category_left ul').html(htmlStr);
            renderSecondById(info.rows[0].id);
        }
    });

    function renderSecondById(id) {
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategory',
            data: { id: id },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                var htmlStr = template('rightTpl', info);
                $('.lt_category_right ul').html(htmlStr);
            }
        })
    }

    $('.lt_category_left').on('click', 'li a', function () {
        $(this).parent().addClass('current').siblings().removeClass('current');
        renderSecondById($(this).data('id'));
    });
})