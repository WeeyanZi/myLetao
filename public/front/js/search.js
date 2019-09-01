$(function () {
    var storageKey = "search_list";

    renderHistory();

    function renderHistory() {
        var htmlStr = template('historyTpl', { arr: getHistory() || [] });
        $('.lt_history').html(htmlStr);
    }

    function getHistory() {
        var storageStr = localStorage.getItem(storageKey);
        var jsonArr = JSON.parse(storageStr);
        return jsonArr;
    }

    $('.lt_history').on('click', '.btn_empty', function () {
        mui.confirm('你确定要清空历史记录吗？', '温馨提示', ['取消', '确认'], function (e) {
            if (e.index === 1) {
                localStorage.removeItem(storageKey);
                renderHistory();
            }
        })

    });

    $('.lt_history').on('click', '.btn_delete', function () {
        var that = this;
        mui.confirm('你确定要删除该条记录吗？', '温馨提示', ['取消', '确认'], function (e) {
            if (e.index === 1) {
                var index = $(that).data('index');
                var arr = getHistory();
                arr.splice(index, 1);
                localStorage.setItem(storageKey, JSON.stringify(arr));
                renderHistory();
            }
        })
    });

    $('.search_btn').click(function () {
        var val = $('.search_input').val().trim();
        if (val === '') {
            mui.toast('请输入搜索内容');
            return;
        }

        var arr = getHistory() || [];
        var index = arr.indexOf(val);
        if (index != -1) {
            arr.splice(index, 1);
        }
        arr.unshift(val);
        if (arr.length > 10) {
            arr.pop();
        }
        localStorage.setItem(storageKey, JSON.stringify(arr));

        location.href = 'searchList.html?key=' + val;
    });
})