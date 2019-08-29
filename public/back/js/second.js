$(function () {

    var currentPage = 1;
    var pageSize = 5;

    render();

    function render() {
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: { page: currentPage, pageSize: pageSize },
            dataType: 'json',
            success: function (info) {
                var htmlStr = template('categroyTpl', info);
                $('#categoryBody').html(htmlStr);

                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage: currentPage,//当前页
                    totalPages: Math.ceil(info.total / pageSize),//总页数
                    size: "small",//设置控件的大小，mini, small, normal,large
                    onPageClicked: function (event, originalEvent, type, page) {
                        currentPage = page;
                        render();
                    }
                });

            }
        });
    }

    $('#addBtn').click(function () {
        $('#addModal').modal('show');
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data: { page: 1, pageSize: 100 },
            dataType: 'json',
            success: function (info) {
                var htmlStr = template('dropdownTpl', info);
                $('.dropdown-menu').html(htmlStr);
            }
        })
    });

    $('.dropdown-menu').on('click', 'a', function () {
        var txt = $(this).text();
        $('#dropdownText').text(txt);
        $('[name="categoryId"]').val($(this).data('id'));
        $("#addSecondForm").data('bootstrapValidator').updateStatus('categoryId', 'VALID');
    })

    $("#fileupload").fileupload({
        dataType: "json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done: function (e, data) {
            var imgSrc = data.result.picAddr;
            $('#imgBox img').attr('src', imgSrc);
            $('[name="brandLogo"]').val(imgSrc);
            $("#addSecondForm").data('bootstrapValidator').updateStatus('brandLogo', 'VALID');
        }
    });

    //使用表单校验插件
    $('#addSecondForm').bootstrapValidator({
        //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        excluded: [],

        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //3. 指定校验字段
        fields: {
            //校验用户名，对应name表单的name属性
            brandName: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入二级分类'
                    }
                }
            },
            categoryId: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请选择一级分类'
                    }
                }
            },
            brandLogo: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请上传图片'
                    }
                }
            }
        }

    });


    $("#addSecondForm").on('success.form.bv', function (e) {
        e.preventDefault();
        //使用ajax提交逻辑
        $.ajax({
            type: 'post',
            url: '/category/addSecondCategory',
            data: $('#addSecondForm').serialize(),
            dataType: 'json',
            success: function (info) {
                if (info.success) {
                    $('#addModal').modal('hide');
                    currentPage = 1;
                    render();
                    $("#addSecondForm").data('bootstrapValidator').resetForm();
                    $('#dropdownText').text('请选择一级分类');
                    $('#imgBox img').attr('src','./images/none.png');
                    $('[name="brandName"]').val('');
                }
            }
        })
    });

})