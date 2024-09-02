jQuery(window).load(function () {
    // Menu expandable accessibility
    jQuery(".menu").find('[aria-haspopup=true]').attr('aria-expanded', 'false');
    jQuery(".menu").find('[aria-haspopup=true]').hover(function () {
        jQuery(this).attr('aria-expanded', 'true');
    }, function () {
        jQuery(this).attr('aria-expanded', 'false');
    });

    jQuery("#overflowMenu").find('.menu-item-has-children').attr('aria-expanded', 'false');
    jQuery("#overflowMenu").find('.menu-item-has-children').hover(function () {
        jQuery(this).attr('aria-expanded', 'true');
    }, function () {
        jQuery(this).attr('aria-expanded', 'false');
    });

});


jQuery(document).ready(function ($) {
    document.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode == 27) {
            jQuery(":focus").each(function () {
                if (jQuery(this).parents('.wpb_column').next('div').length === 1) {
                    jQuery(this).parents('.wpb_column').next().find('a:first').focus();
                }

                if (jQuery(this).parents('.wpb_column').next('div').length === 0) {
                    if (jQuery(this).parents('.vc_row').next('div').length === 0) {
                        jQuery('.footerMenu').find(':focusable').eq(0).focus();
                    }
                    if (jQuery(this).parents('.vc_row').next('div').length === 1) {
                        jQuery(this).parents('.vc_row').next('div').find('a:first').focus();
                    }

                }
            });
        }
    };

    //jQuery('body').addClass('show-focus-outlines');
    document.addEventListener('keydown', function (e) {
        if (e.keyCode === 9) {
            jQuery(".menu").find('[aria-haspopup=true]').focusin(function () {
                jQuery(this).attr('aria-expanded', 'true');
            });
            jQuery(".menu").find('[aria-haspopup=true]').focusout(function () {
                jQuery(this).attr('aria-expanded', 'false');
            });

            jQuery("#overflowMenu").find('.menu-item-has-children').focusin(function () {
                jQuery(this).attr('aria-expanded', 'true');
            });
            jQuery("#overflowMenu").find('.menu-item-has-children').focusout(function () {
                jQuery(this).attr('aria-expanded', 'false');
            });

            jQuery('body').addClass('show-focus-outlines');

        }

    });

    //jQuery('body').addClass('show-focus-outlines');
    document.addEventListener('keydown', function (e) {
        if (e.keyCode === 9) {
            jQuery('body').addClass('show-focus-outlines');

        }

    });


    document.addEventListener('mousedown', function (e) {
        //e.preventDefault();
        jQuery('body').removeClass('show-focus-outlines');
    });

    //header accessibility search show hide (safari)
    jQuery("#accessibilityMenu li.searchbox a").click(function (e) {
        e.preventDefault();
        jQuery('.goiSearch').css("visibility", "visible");
    });
    jQuery('html').click(function (e) {
        if (e.target.id == 'accessibilityMenu' || jQuery(e.target).parents('#accessibilityMenu').length > 0) { } else {
            jQuery('.goiSearch').css("visibility", "hidden");
        }
    });
    //search end

    jQuery(".skip-to-content").click(function (e) {
        e.preventDefault();
        jQuery('#SkipContent').focus();
    });

    /* jQuery("a.yes").click(function(e) {
         location.href = '/login';
     });
     jQuery("r.yes").click(function(t) {
         location.href = '/login';
     });*/

    jQuery(".read-text").click(function (t) {
        t.preventDefault();
        jQuery('#show-description').focus();
    });

    //code for collaps/expand start
    jQuery(".colspexp_header").click(function () {
        jQuerycolspexp_header = jQuery(this);
        jQuerycolspexp_content = jQuerycolspexp_header.next();
        jQuerycolspexp_content.slideToggle(500, function () {
            jQuerycolspexp_header.text(function () {
                return jQuerycolspexp_content.is(":visible") ? "Hide Code" : "Show Code";
            });
        });

    });
    //code for collaps/expand end
    //less than 4 column table layout fixed start
    jQuery('table').each(function () {
        var numCols = jQuery(this).find('tr')[0].cells.length
        if (numCols < 4) {
            jQuery(this).css('table-layout', 'fixed');
        }
    });
    //less than 4 column table layout fixed end

    //VC Tabs keyboard accessibility start
    jQuery('.vc_tta-tabs-list').attr('role', 'tablist');
    jQuery('.vc_tta-panel').attr('role', 'tabpanel');
    jQuery('.vc_tta-tab a').attr('role', 'tab');

    //Parmod code start
    jQuery(".vc_tta-panels .vc_active").siblings().attr("hidden", true);
    jQuery("li a[role='tab']").click(function () {
        jQuery("li a[role='tab']").attr("hidden", false);
        var tabpanid = jQuery(this).attr("aria-controls");
        var tabpan = jQuery("#" + tabpanid);
        jQuery("div[role='tabpanel']").attr("hidden", true);
        tabpan.attr("hidden", false);
    });

    jQuery('[data-vc-tabs]').each(function () {
        var id = jQuery(this).attr('href');
        id = id.replace('#', '');
        jQuery(this).attr('aria-controls', id);
        if (jQuery(this).parent().hasClass('vc_active')) {
            jQuery(this).attr('aria-selected', true)
        } else {
            jQuery(this).attr('aria-selected', false)
        }
    });
    jQuery('[data-vc-tabs]').click(function () {
        jQuery(this).parent().siblings().find('a').attr('aria-selected', false);
        jQuery(this).attr('aria-selected', true);
    });


    $('ul.vc_tta-tabs-list li.vc_tta-tab').not(".vc_active").each(function () {
        let jQueryToggleButtons = $(this).find('a');

        jQueryToggleButtons.on('click.flexSetup', function () {

            let flex = $(this).parents('.vc_tta-tabs-container')
                .next('.vc_tta-panels-container').find('.vc_tta-panel' + jQueryToggleButtons.attr('href'))
                .find('.flexslider');
            if (flex.length > 0) {
                flex.data('flexslider').setup();
            }
        });
    });

    let $tabAtags = null;
    let $thisTab = null;

    $('ul.vc_tta-tabs-list li.vc_tta-tab a').on('keyup', function (event) {

        $thisTab = $(this);
        let $thisTabParent = $thisTab.parent();
        let $tabId = $thisTab.attr('href');
        $tabAtags = $($tabId).find('.vc_tta-panel-body a');
        let $tabsListATags = $thisTab.parents('.vc_tta-tabs-list').find('a');

        $($tabId).find('a').removeAttr('tabindex');
        $thisTab.removeAttr('tabindex');
        $($tabId).find('a:last').off('focusout');
        $thisTabParent.nextAll().find('a').attr('tabindex', -1);
        $thisTabParent.prevAll().find('a').removeAttr('tabindex');

        if ($tabsListATags.length == $tabsListATags.index($thisTab) + 1) {
            let $activePrevSibling = $thisTabParent.siblings('li.vc_active');
            if ($activePrevSibling.length > 0) {
                let $visibleTab = $activePrevSibling.find('a').attr('href');
                $($visibleTab).find('a').attr('tabindex', -1);
            }
        }

        if ($tabAtags.length == 0 || !$($tabId).find('.vc_tta-panel-body').is(':visible')) {
            $thisTab.parent().next('li').find('a').removeAttr('tabindex')
        }

    });
    $('div.vc_tta-panel-body').on('keydown', 'a', function (event) {

        let itemIndex = $tabAtags.index($(this)) + 1;
        if ($tabAtags.length === itemIndex && event.key === 'Tab' && event.shiftKey === false) {
            $(this).focusout(function () {
                $thisTab.parent().next('li').find('a').focus();
            })
        }
    })

    $('div.vc_tta-panel-body').on('keyup', 'ul.flex-direction-nav a', function (event) {
        if (event.key === 'Tab' && event.shiftKey === false) {
            if ($(this).hasClass('flex-next')) {
                $(this).css({ 'opacity': '0.7', 'right': '10px', 'text-align': 'center' });
            } else if ($(this).hasClass('flex-prev')) {
                $(this).removeClass('flex-disabled').css({ 'opacity': '0.7', 'left': '10px', 'text-align': 'center' });
            }
        }
    })
    $('div.vc_tta-panel-body').on('keydown', 'ul.flex-direction-nav a', function (event) {
        if (event.key === 'Tab' && event.shiftKey === false) {
            $(this).removeAttr('style');
        }
    })

    //Code for Public Utilities keyboard tab accessible

    let $thisUtilityTab = null;
    let $thisTabContentId = null;

    $('ul.resp-tabs-list li a').on('keyup', function (event) {

        $thisUtilityTab = $(this);
        let $thisTabParent = $thisUtilityTab.parent();
        $thisTabContentId = $thisTabParent.attr('data');
        let $tabAtags = $thisUtilityTab.parents('ul').find('a');
        let $tabUtilityAtags = $('#' + $thisTabContentId).find('a:visible');

        $thisTabParent.nextAll().find('a').attr('tabindex', -1);
        $thisTabParent.prevAll().find('a').removeAttr('tabindex');

        $('#' + $thisTabContentId).find('a:last').off('focusout');
        $tabUtilityAtags.removeAttr('tabindex');
        $thisUtilityTab.removeAttr('tabindex');

        if ($tabAtags.length == $tabAtags.index($thisUtilityTab) + 1) {
            let $activePrevSibling = $thisTabParent.siblings('li.resp-tab-active');

            if ($activePrevSibling.length > 0) {
                let $visibleTab = $activePrevSibling.attr('data');
                $('#' + $visibleTab).find('a').attr('tabindex', -1);
            }
        }

        if ($tabUtilityAtags.length == 0 || !$('#' + $thisTabContentId).is(':visible')) {
            $thisTabParent.next('li').find('a').removeAttr('tabindex');
        }

    })
    $('div.resp-tabs-container').on('keydown', 'a:visible', function (event) {

        let $thiATag = $(this);
        let $tabUtilityAtags = $thiATag.parents('#' + $thisTabContentId).find('a:visible');
        let itemIndex = $tabUtilityAtags.index($thiATag) + 1;
        if ($tabUtilityAtags.length === itemIndex && event.key === 'Tab' && event.shiftKey === false) {
            $(this).focusout(function () {
                $thisUtilityTab.parent().next('li').find('a').focus();
            })
        }
    })
    //VC Tabs keyboard accessibility end

});


