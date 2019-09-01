$(function () {

    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005,
        indicators: false
    });

})


function getSearch(name) {
    var searchStr = decodeURI(location.search);
    searchStr = searchStr.slice(1);
    var arr = searchStr.split('&');
    var obj = {};
    arr.forEach(function (v, i) {
        var one = v.split('=');
        obj[one[0]] = one[1];
    })
    return obj[name];
}