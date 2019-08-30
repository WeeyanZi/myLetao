$(function () {

    var currentPage = 1;
    var pageSize = 5;
    var picArr = [];

    render();

    function render() {
        $.ajax({
            type: 'get',
            url: '/product/queryProductDetailList',
            data: { page: currentPage, pageSize: pageSize },
            dataType: 'json',
            success: function (info) {
                var htmlStr = template('productTpl', info);
                $('#productBody').html(htmlStr);

                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage: currentPage,//当前页
                    totalPages: Math.ceil(info.total / pageSize),//总页数
                    size: "small",//设置控件的大小，mini, small, normal,large
                    onPageClicked: function (event, originalEvent, type, page) {
                        //为按钮绑定点击事件 page:当前点击的按钮值
                        currentPage = page;
                        render();
                    },
                    itemTexts: function (type, page, current) {
                        switch (type) {
                            case "next":
                                return '下一页'
                                break;
                            case "last":
                                return '尾页'
                                break;
                            case "prev":
                                return '上一页'
                                break;
                            case "first":
                                return '首页'
                                break;
                            case "page":
                                return page
                                break;
                        }
                    }
                });

            }
        })
    }

    $('#addBtn').click(function () {
        $('#addModal').modal('show');
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: { page: 1, pageSize: 100 },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                var htmlStr = template('dropdownTpl', info);
                $('.dropdown-menu').html(htmlStr);
            }
        })
    })

    $('.dropdown-menu').on('click', 'a', function () {
        $('#dropdownText').text($(this).text());
        console.log($(this).data('id'));
        $('[name="brandId"]').val($(this).data('id'));
        $("#addProductForm").data('bootstrapValidator').updateStatus('brandId', 'VALID');
    })

    $("#fileupload").fileupload({
        dataType: "json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done: function (e, data) {
            // console.log(data);
            var picObj = data.result;
            var picAddr = picObj.picAddr;
            //<img src="./images/none.png" alt="" width="100px">
            $('#imgBox').prepend('<img src="' + picAddr + '" alt="" width="100px">');
            picArr.unshift(picObj);
            if (picArr.length > 3) {
                picArr.pop();
                $('#imgBox img').eq(-1).remove();
            }
            if (picArr.length === 3) {
                $("#addProductForm").data('bootstrapValidator').updateStatus('picStatus', 'VALID');
            }
        }
    });

    // 检验表单
    $('#addProductForm').bootstrapValidator({
        //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        excluded: [],

        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        fields: {
            brandId: {
                validators: {
                    notEmpty: {
                        message: '请选择二级分类'
                    }
                }
            },
            proName: {
                validators: {
                    notEmpty: {
                        message: '请输入商品名称'
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: '请输入商品描述'
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: '请输入商品库存'
                    },
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '商品库存必须是非0开头的数字'
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: '请输入商品尺码'
                    },
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '商品尺码必须是xx-xx,例如30-40'
                    }
                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: '请输入商品原价'
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: '请输入商品现价'
                    }
                }
            },
            picStatus: {
                validators: {
                    notEmpty: {
                        message: '请上传三张图片'
                    }
                }
            }
        }

    });


    $("#addProductForm").on('success.form.bv', function (e) {
        e.preventDefault();
        var parameter = $('#addProductForm').serialize();
        picArr.forEach(function (v, i) {
            parameter = parameter + '&picName' + (i + 1) + '=' + v.picName + '&picAddr' + (i + 1) + '=' + v.picAddr;
        })
        $.ajax({
            type: 'post',
            url: '/product/addProduct',
            data: parameter,
            dataType: 'json',
            success: function (info) {
                if (info.success) {
                    $('#addModal').modal('hide');
                    currentPage = 1;
                    render();
                    $('#addProductForm').data('bootstrapValidator').resetForm(true);
                    $('#dropdownText').text('请选择二级分类');
                    $('#imgBox img').remove();
                    picArr = [];
                }
            }
        })
    });



})