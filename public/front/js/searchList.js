$(function () {

    var keyword = getSearch('key');
    $('.search_input').val(keyword);
    var page = 0;

    var getDataType = '';

    // render();
    function render() {
        // $('.lt_product').html('<div class="loading"></div>');
        var parameter = {}
        parameter.proName = $('.search_input').val().trim();
        parameter.page = page;
        parameter.pageSize = 4;

        var $current = $('.lt_sort a.current');
        if ($current.length > 0) {
            var sortName = $current.data('type');
            var sortValue = $current.find('i').hasClass('fa-angle-down') ? 2 : 1;
            parameter[sortName] = sortValue;
        }

        setTimeout(() => {
            $.ajax({
                type: 'get',
                url: '/product/queryProduct',
                data: parameter,
                dataType: 'json',
                success: function (info) {
                    var htmlStr = template('productTpl', info);
                    if (getDataType === 'down') {
                        $('.lt_product').html(htmlStr);
                        mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
                        mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh();
                    } else {
                        if (info.data.length === 0) {
                            // console.log('123');
                            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
                        } else {
                            $('.lt_product').append(htmlStr);
                            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
                        }
                    }
                }
            });
        }, 500);

    }

    $('.lt_sort a[data-type]').click(function () {
        if ($(this).hasClass('current')) {
            $(this).find('i').toggleClass('fa fa-angle-down').toggleClass('fa fa-angle-up');
        } else {
            $(this).addClass('current').siblings().removeClass('current');
            if ($(this).siblings().find('i').hasClass('fa fa-angle-up')) {
                $(this).siblings().find('i').removeClass('fa fa-angle-up').addClass('fa fa-angle-down');
            }
        }

        render();
    })

    $('.search_btn').click(function () {
        var val = $('.search_input').val().trim();
        if (val === '') {
            mui.toast('请输入搜索的内容');
            return;
        }
        $('.lt_sort a[data-type]').removeClass('current').find('i').removeClass('fa fa-angle-up').addClass('fa fa-angle-down');

        var storageStr = localStorage.getItem('search_list');
        var jsonArr = JSON.parse(storageStr);
        var index = jsonArr.indexOf(val);
        if (index > -1) {
            jsonArr.splice(index, 1);
        }
        if (jsonArr.length >= 10) {
            jsonArr.pop();
        }
        jsonArr.unshift(val);
        localStorage.setItem('search_list', JSON.stringify(jsonArr));
        render();
    })


    mui.init({
        pullRefresh: {
            container: ".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等

            down: {
                // auto: true,//可选,默认false.首次加载自动下拉刷新一次
                // contentrefresh: "正在加载...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                callback: function () {
                    page = 1;
                    getDataType = 'down';
                    render();
                }
            },
            up: {
                auto: true,//可选,默认false.首次加载自动下拉刷新一次
                contentrefresh: "正在加载...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                contentnomore: '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
                callback: function () {
                    page++;
                    getDataType = 'up';
                    render();
                }
            }
        }
    });

    $('.lt_product').on('tap','.lt_product_item a',function(){
        location.href =  $(this).attr('href');
    })

})