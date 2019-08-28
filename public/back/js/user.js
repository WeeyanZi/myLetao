$(function () {
    var current = 1;
    var pageSize = 5;

    render();

    function render() {
        $.ajax({
            type: 'get',
            url: '/user/queryUser',
            data: { page: current, pageSize: pageSize },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                var htmlStr = template('userTpl', info);
                $('.userBody').html(htmlStr);

                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage: current,//当前页
                    totalPages: Math.ceil(info.total / pageSize),//总页数
                    size: "small",//设置控件的大小，mini, small, normal,large
                    onPageClicked: function (event, originalEvent, type, page) {
                        current = page;
                        render();
                    }
                });
            }
        })
    }

    $('.userBody').on('click', '.btn', function () {
        var isDelete = $(this).hasClass("btn-success") ? 1 : 0;
        var id = $(this).parent().data('id');
        $('#userModal').modal('show');
        $('#submitBtn').click(function () {
            $.ajax({
                type: 'post',
                url: '/user/updateUser',
                data: { id: id, isDelete: isDelete },
                dataType: 'json',
                success: function (info) {
                    if (info.success) {
                        $('#userModal').modal('hide');
                        current = 1;
                        render();
                    }
                }
            })
        });
    });


})