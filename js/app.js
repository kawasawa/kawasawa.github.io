$(function() {
    // スムーススクロール
    $('nav a[href^="#"]').click(function() {
        var speed = 500;
        var href= $(this).attr("href");
        var target = $(href == "#" || href == "" ? 'html' : href);
        var position = target.offset().top;
        $("html, body").animate({scrollTop:position}, speed, "swing");
        return false;
    });

    // トップへ戻るボタンを表示する
    var btnGoToTop = $('#btn-gototop');
    btnGoToTop.hide();
    $(window).scroll(function () {
        if (1000 < $(this).scrollTop()) {
            btnGoToTop.fadeIn();
        } else {
            btnGoToTop.fadeOut();
        }
    });
    btnGoToTop.click(function () {
        // スクロールしてトップへ移動する
        $('body,html').animate({ scrollTop: 0 }, 500);
        return false;
    });
    if (navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/)) {
        // スマホで表示された場合は、ボタンを無効化する
        $(function() {
            $("#btn-gototop").hide();
        });
    }
});

