jQuery(document).ready(function ($) {

    let overflowMenuWidth = $("#overflowMenu").width();

    function openMenu() {
        if ($("body").hasClass("rtl")) {
            $("#overflowMenu").animate({ left: "0px" });
        } else {
            $("#overflowMenu").animate({ right: "0px" }).css({display: "block"});
        }
        $('#overflowMenu ul').find(' > li > a').attr('tabindex', 0);
        $('#overflowMenu a.closeMenu').attr('tabindex', 0);
    }

    function onMenuItemClick(event) {
        $(this).siblings("li").find("ul").hide();
        $(this).children("ul").slideToggle();
        if ($(this).children("ul").length && $(this).find("> ul").is(":visible")) {
            $(this).find("> a").attr("aria-expanded", "true");
            $(this).find("> ul").attr("aria-hidden", "false");
            $(this).find("> ul > li > a").attr("tabIndex", 0);
            if ($(this).hasClass('has-sub-child')) {
                $(this).find("> ul").css('left', '100%');
            }
        } else {
            $(this).find("> a").attr("aria-expanded", "false");
            $(this).find("> ul").attr("aria-hidden", "true");
            $(this).find("> ul > li > a").attr("tabIndex", -1);
        }

        event.stopPropagation();
    }

    function menuEachLiKeyup() {
        if ($(this).children("ul").length) {
            if (!$(this).find("> ul").is(":visible")) {
                $(this).find("> a").attr("aria-expanded", "false");
                $(this).find("> ul").attr("aria-hidden", "true");
                $(this).find("> ul > li > a").attr("tabIndex", -1);
            }
        }
    }

    function eachLiLinkPrevent() {
        if ($(this).next("ul").length) {
            $(this).click(function (event) {
                event.preventDefault();
            })
        }
    }

    /***** Navigation Setup *****/

    $(".menuWrapper nav ul li")
        .mouseover(function () {
            $(".menuWrapper nav ul li").not('.hide-child').each(function () {
                if ($(this).children("ul").length && $(this).find("> ul").is(":visible")) {
                    $(this).find("> a").attr("aria-expanded", "true");
                    $(this).find("> ul").attr("aria-hidden", "false");
                }
            });

            $(this).find("> ul > li > a").attr("tabIndex", 0);
        })
        .mouseout(function () {
            $(".menuWrapper nav ul li").each(function () {
                if ($(this).children("ul").length && !$(this).find("> ul").is(":visible")) {
                    $(this).find("> a").attr("aria-expanded", "false");
                    $(this).find("> ul").attr("aria-hidden", "true");
                }
            });
            $(this).find("> ul > li > a").attr("tabIndex", -1);
        })

    $(document).on('keydown', function (event) {
        if (event.which == 9) {
            $(".menuWrapper nav ul li a").each(eachLiLinkPrevent);
        }
    })

    $(".menuWrapper nav ul li").on("keyup", function (event) {
        if (event.which == 9) {
            $(this).siblings("li").find("ul").hide();
            $(".menuWrapper nav ul li").each(menuEachLiKeyup);
        }
    });

    $(".menuWrapper ul.nav li").on("keydown", function (event) {
        if (event.which == 27) {
            $('main a:visible').eq(0).focus();
            return false;
        }
    })

    $(".menuWrapper nav ul li").on("click", onMenuItemClick);

    //Sub menu open according to screen width
    $("nav li li").mouseover(function () {
        if ($(this).children("ul").length == 1) {
            let parent = $(this);
            let child_menu = $(this).children("ul");
            if (
                $(parent).offset().left + $(parent).width() + $(child_menu).width() >
                $(window).width()
            ) {
                $(child_menu).css("left", "-" + $(parent).width() + "px");
            } else {
                $(child_menu).css("right", "-" + $(parent).width() + "px");
            }
        }
    });

    /***** Overflow Navigation Setup *****/

    if ($(window).innerWidth() >= 640) {
        let menuContanerWidth = $(".menuWrapper .container").width(),
            itemsTotalWith = 0;
        $(".menu > ul > li").each(function (s, a) {
            let itemClone = $(this).clone();
            itemClone.find('a').attr("tabindex", -1);
            if (
                ((itemsTotalWith += $(this).width()),
                    itemsTotalWith > menuContanerWidth - 100 &&
                    ($(this).hasClass("moreNav") ||
                        ($(this).remove(),
                            $("#overflowMenu .ofMenu > ul").append(itemClone)),
                        !($(".menu ul .moreNav").length > 0)))
            ) {
                let n = $(
                    '<li class="moreNav">' +
                    '<a href="#" aria-label="More Menu" title="More Menu"><span class="icon-menu" aria-hidden="true"></span><span class="hide">' +
                    $(".menuMoreText").html() +
                    "</span> </a></li>"
                );
                $(".menuMoreText").html("");
                $(".menu>ul").append(n), n.click(openMenu);
            }
        });
    }

    // More Button
    $(".moreNav a").on("click", function (event) {
        event.preventDefault(), event.stopPropagation();
        openMenu();
    });

    $(".moreNav a").on("focusin", function (event) {
        $("ul.sub-menu").hide();
        $(".closeMenu").trigger('click')
    });

    // Close Button
    //$(".closeMenu").on("keyup", function (event) { if (event.keyCode == 9 && event.shiftKey) openMenu();});

    $(".closeMenu").on("keydown", function (event) {
        if (event.keyCode == 9 && !event.shiftKey) {
            if ($("body").hasClass("rtl")) {
                $(this).parent("#overflowMenu").stop().animate({ left: -overflowMenuWidth });
            } else {
                $(this).parent("#overflowMenu").stop().animate({ right: -overflowMenuWidth }).hide(100);
            }
            $('#overflowMenu ul').find('a').attr('tabindex', -1);
            $('#overflowMenu a.closeMenu').attr('tabindex', -1);
        }
    });


    $(".closeMenu").on("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        if ($("body").hasClass("rtl")) {
            $(this).parent("#overflowMenu").stop().animate({ left: -overflowMenuWidth });
        } else {
            $(this).parent("#overflowMenu").stop().animate({ right: -overflowMenuWidth }).css({display: "none"});
        }
        $('#overflowMenu ul').find('a').attr('tabindex', -1);
        $('#overflowMenu a.closeMenu').attr('tabindex', -1);
    });

    $('html').click(function (event) {
        if ($('#overflowMenu').is(":visible")) {
            let t = $("#overflowMenu").width();
            if ($("body").hasClass("rtl")) {
                $("#overflowMenu").stop().animate({ left: -t, });
            } else {
                $("#overflowMenu").stop().animate({ right: -t, }).hide(100);
            }
        }
    });

    $('#overflowMenu').click(function (event) {
        event.stopPropagation();
    })
    $(".ofMenu ul li:first a").on('keyup', function () {
        $(".ofMenu ul li a").each(eachLiLinkPrevent);
    })
    $(".ofMenu ul li").on("keyup", function (event) {
        if (event.which == 9) {
            $(this).siblings("li").find("ul").hide();
            $(".ofMenu ul li").each(menuEachLiKeyup);
        }
    });

    $(".ofMenu ul li").on("click", onMenuItemClick);

    $('.ofMenu ul li').hover(function (e) {
        $(this).siblings().children('ul').slideUp();
        $(this).children('ul').slideDown();
    }, function () {
        $(this).parent().siblings().children('ul').slideUp();
    });

    /***** Responsive Navigation Setup *****/

    $(".menuToggle").click(function (event) {
        event.preventDefault();
        $(".menuWrapper").stop().slideToggle();
    });

    if ($(window).width() <= 639) {
        $(".menu ul li").each(function (index, element) {
            $(this).off('click');
            if ($(this).children("ul").length) {
                $(".indicator").hide();
                $("<a href='javascript:void(0)' aria-label='Click to expand submenu' class='menu-toggle'>&nbsp;</a>")
                    .insertAfter($(element).find(" > a "));
            }
        });
    }

    $(".menu-toggle").click(function (event) {
        event.preventDefault();
        $(this).toggleClass("open").parents('li').siblings().children("ul").stop().slideUp('fast');
        $(this).next("ul").slideToggle('fast');

        $(this).parents('li').siblings().children("a").removeClass("open");
        $(this).parents('li').siblings().children("a.menu-select").removeClass("menu-select");
        $(this).prev().toggleClass("menu-select");

        if ($(this).hasClass("open")) {
            $(this).attr("aria-label", "Click to collapse submenu");
        } else {
            $(this).attr("aria-label", "Click to expand submenu");
        }
    });
});

