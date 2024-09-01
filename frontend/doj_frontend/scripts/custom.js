jQuery.noConflict();
(function($) {
  function _getCookie(name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
      var j = i + alen;
      if (document.cookie.substring(i, j) == arg) {
        return _getCookieVal(j);
      }
      i = document.cookie.indexOf(" ", i) + 1;
      if (i == 0) break;
    }
    return null;
  }

  // function _deleteCookie(name, path, domain) {
  //   if (_getCookie(name)) {
  //     document.cookie =
  //         name +
  //         "=" +
  //         (path ? "; path=" + path : "") +
  //         (domain ? "; domain=" + domain : "") +
  //         "; expires=Thu, 01-Jan-70 00:00:01 GMT";
  //   }
  // }

  function _setCookie(name, value, expires, path, domain, secure) {
    var vurl = true;
    if (path != "" && path != undefined) {
      vurl = validUrl(path);
    }
    if (jQuery.type(name) == "string" && vurl) {
      document.cookie =
        name +
        "=" +
        escape(value) +
        (expires ? "; expires=" + expires.toGMTString() : "") +
        (path ? "; path=" + path : "") +
        (domain ? "; domain=" + domain : "") +
        (secure ? "; secure" : "");
    }
  }

  function _getCookieVal(offset) {
    var endstr = document.cookie.indexOf(";", offset);
    if (endstr == -1) {
      endstr = document.cookie.length;
    }
    return unescape(document.cookie.substring(offset, endstr));
  }

  if (_getCookie("fontSize") != null) {
    var fontSize = _getCookie("fontSize");
    jQuery("body").css("font-size", fontSize + "px");
  } else {
    var fs = jQuery("body").css("font-size");
    var fontSize = fs;
    jQuery("body").css("font-size", fs);
  }

  $(".fontSizeEvent").on("fontSelected", function() {
    let fontSizeStatus = _getCookie("fontSizeStatus");

    if (fontSizeStatus == null) {
      fontSizeStatus = "normal";
    }

    let label = $(
      '.fontSizeEvent a[data-event-type="' + fontSizeStatus + '"]'
    ).attr("data-label");
    let dataSelected = $(
      '.fontSizeEvent a[data-event-type="' + fontSizeStatus + '"]'
    ).attr("data-selected-text");

    $('.fontSizeEvent a[data-event-type="' + fontSizeStatus + '"')
      .attr("aria-label", label + " - " + dataSelected)
      .attr("title", label + " - " + dataSelected)
      .addClass("link-selected");

    $('.fontSizeEvent a[data-event-type="' + fontSizeStatus + '"')
      .parent()
      .siblings()
      .each(function() {
        let label = $(this)
          .find("a")
          .attr("data-label");
        $(this)
          .find("a")
          .attr("aria-label", label)
          .attr("title", label)
          .removeClass("link-selected");
      });
  });

  $(".fontSizeEvent").trigger("fontSelected");

  $(".fontSizeEvent a").on("click", function(event) {
    event.stopPropagation();
    event.preventDefault();
    let fontEvent = $(this).attr("data-event-type");

    if (fontEvent == "increase") {
      if (parseInt(fontSize) < 18) {
        fontSize = parseInt(fontSize) + 2;
        _setCookie("fontSizeStatus", "increase");
      }
    } else if (fontEvent == "decrease") {
      if (parseInt(fontSize) > 10) {
        fontSize = parseInt(fontSize) - 2;
      }
      _setCookie("fontSizeStatus", "decrease");
    } else {
      fontSize = 14;
      _setCookie("fontSizeStatus", "normal");
    }

    $(this)
      .addClass("link-selected")
      .parent()
      .siblings()
      .find("a")
      .removeClass("link-selected");
    _setCookie("fontSize", fontSize);
    $("body").css("font-size", fontSize + "px");
    $(".fontSizeEvent").trigger("fontSelected");
  });

  function printbody() {
    window.print();
  }

  //Keyboard accessing functions

  function addFocusClass() {
    jQuery("#accessibility")
      .find("li")
      .each(function(index, element) {
        jQuery(this)
          .children("a")
          .focus(function(e) {
            jQuery(this)
              .parent("li")
              .addClass("mFocus");
          });
      });
    jQuery("#accessibilityMenu>li>a").focusin(function(e) {
      jQuery("#accessibilityMenu")
        .find("li")
        .each(function(index, element) {
          jQuery(this).removeClass("mFocus");
        });
      jQuery(this).addClass("mFocus");
    });

    jQuery("#accessibilityMenu>li>a").click(function(e) {
      jQuery(this).addClass("focus");
      jQuery(this)
        .next("ul")
        .addClass("visible");
    });

    jQuery("#accessibilityMenu>li:last-child ul li:last-child").focusout(
      function(e) {
        jQuery("#accessibilityMenu>li:last-child").removeClass("mFocus");
      }
    );

    jQuery("html").click(function(e) {
      if (
        e.target.id == "accessibilityMenu" ||
        jQuery(e.target).parents("#accessibilityMenu").length > 0
      ) {
      } else {
        jQuery(".goiSearch")
          .removeClass("visible")
          .attr("style", "");
        jQuery("#accessibilityMenu>li").each(function(index, element) {
          jQuery(this).removeClass("mFocus");
          jQuery(this)
            .children("a")
            .removeClass("focus");
        });
      }
    });
  }

  jQuery(document).ready(function(e) {
    jQuery("a[href='#top']").click(function() {
      jQuery("html, body").animate(
        {
          scrollTop: 0
        },
        1000
      );
      return false;
    });

    function printData() {
      var divToPrint = document.getElementById("row-content");
      newWin = window.open("");
      newWin.document.write(divToPrint.outerHTML);
      newWin.print();
      newWin.close();
    }
    jQuery("#print").on("click", function() {
      jQuery("table").attr("border", "1");
      printData();
    });

    // Skip Content

    jQuery("a.skipContent").bind("click", function(event) {
      var $anchor = jQuery(this);

      jQuery("html, body")
        .stop()
        .animate(
          {
            scrollTop: jQuery($anchor.attr("href")).offset().top
          },
          800
        );
      event.preventDefault();
    });

    jQuery("#flexSlider").flexslider({
      animation: "slide",
      controlNav: true
    });

    jQuery("#flexSlider2").flexslider({
      animation: "slide",
      controlNav: true
    });

    jQuery("#flexSlider3").flexslider({
      animation: "slide",
      controlNav: true,
      directionNav: true
    });

    jQuery("#footerScrollbar").flexslider({
      animation: "slide",
      animationLoop: false,
      controlNav: false,
      itemWidth: 200,
      itemMargin: 10
    });

    jQuery("#footerScrollbar2").flexslider({
      animation: "slide",
      animationLoop: false,
      controlNav: false,
      itemMargin: 10,
      maxItems: 6
    });

    jQuery(".galleryCarasole").flexslider({
      animation: "slide",
      animationLoop: false,
      controlNav: false,
      itemWidth: 200,
      itemMargin: 20
    });

    jQuery(".galleryCarousel8").flexslider({
      animation: "slide",
      controlNav: false,
      animationLoop: false,
      slideshow: false,
      direction: "vertical"
    });

    jQuery(".galleryCarousel9").flexslider({
      animation: "slide",
      controlNav: false,
      animationLoop: false,
      slideshow: false,
      itemWidth: 150,
      itemMargin: 5,
      asNavFor: "#slider"
    });

    /* Photo gallery type 2 */

    jQuery("#carousel").flexslider({
      animation: "slide",
      controlNav: false,
      directionNav: false,
      animationLoop: true,
      minItems: 3,
      slideshow: false,
      itemWidth: 210,
      itemMargin: 5,
      direction: "vertical",
      asNavFor: "#slider"
    });

    jQuery("#slider").flexslider({
      animation: "slide",
      controlNav: false,
      animationLoop: false,
      slideshow: false,
      sync: "#carousel"
    });

    jQuery(".fancybox").fancybox({
      beforeShow: function() {
        if (this.title) {
          this.title += "<br/>";
        }
        if (jQuery(this.element).parents(".fancyShare").length > 0) {
          this.title += jQuery(this.element)
            .parents(".fancyShare")
            .find(".hide.fancySocial")
            .html();
        }
      },
      helpers: {
        title: {
          type: "inside"
        }
      },
      afterShow: function() {
        jQuery(".fancybox-skin")
          .attr("tabindex", -1)
          .focus();
      },
      afterClose: function() {
        jQuery(this.element).focus();
      }
    });

    jQuery("img.svg").each(function() {
      var e = jQuery(this),
        t = e.attr("id"),
        i = e.attr("class"),
        o = e.attr("src");
      jQuery.get(
        o,
        function(o) {
          var n = jQuery(o).find("svg");
          "undefined" != typeof t && (n = n.attr("id", t)),
            "undefined" != typeof i &&
              (n = n.attr("class", i + " replaced-svg")),
            (n = n.removeAttr("xmlns:a")),
            e.replaceWith(n);
        },
        "xml"
      );
    }),
      addFocusClass(),
      jQuery(".various").fancybox({
        maxWidth: 800,
        maxHeight: 600,
        fitToView: !1,
        width: "70%",
        height: "70%",
        autoSize: !1,
        closeClick: !1,
        openEffect: "none",
        closeEffect: "none",
        afterShow: function() {
          jQuery(".fancybox-skin")
            .attr("tabindex", -1)
            .focus();
        },
        afterClose: function() {
          jQuery(this.element).focus();
        }
      });

    jQuery("#infotab").easyResponsiveTabs({
      type: "default", //Types: default, vertical, accordion
      width: "auto", //auto or any width like 600px
      fit: true, // 100% fit in a container
      tabidentify: "hor_1", // The tab groups identifier
      activate: function(event) {
        // Callback function if tab is switched
        var $tab = jQuery(this);
        var $info = jQuery("#nested-tabInfo");
        var $name = jQuery("span", $info);
        $name.text($tab.text());
        $info.show();
      }
    });

    jQuery("#galleryTab").easyResponsiveTabs({
      type: "default", //Types: default, vertical, accordion
      width: "auto", //auto or any width like 600px
      fit: true, // 100% fit in a container
      tabidentify: "hor_1", // The tab groups identifier
      activate: function(event) {
        // Callback function if tab is switched
        var $tab = jQuery(this);
        var $info = jQuery("#nested-tabInfo");
        var $name = jQuery("span", $info);
        $name.text($tab.text());
        $info.show();
      }
    });

    jQuery(".tabassign").easyResponsiveTabs({
      type: "default", //Types: default, vertical, accordion
      width: "auto", //auto or any width like 600px
      fit: true, // 100% fit in a container
      tabidentify: "hor_1", // The tab groups identifier
      activate: function(event) {
        // Callback function if tab is switched
        var $tab = jQuery(this);
        var $info = jQuery("#nested-tabInfo");
        var $name = jQuery("span", $info);
        $name.text($tab.text());
        $info.show();
      }
    });

    jQuery(".tabassignVertical").easyResponsiveTabs({
      type: "vertical", //Types: default, vertical, accordion
      width: "auto", //auto or any width like 600px
      fit: true, // 100% fit in a container
      tabidentify: "hor_1", // The tab groups identifier
      activate: function(event) {
        // Callback function if tab is switched
        var $tab = jQuery(this);
        var $info = jQuery("#nested-tabInfo");
        var $name = jQuery("span", $info);
        $name.text($tab.text());
        $info.show();
      }
    });

    jQuery("table")
      .not(".no-responsive")
      .basictable({
        breakpoint: 991,
        forceResponsive: true
      });

    jQuery("img.svg").each(function() {
      var $img = jQuery(this);
      var imgID = $img.attr("id");
      var imgClass = $img.attr("class");
      var imgURL = $img.attr("src");

      jQuery.get(
        imgURL,
        function(data) {
          var $svg = jQuery(data).find("svg");

          if (typeof imgID !== "undefined") {
            $svg = $svg.attr("id", imgID);
          }
          if (typeof imgClass !== "undefined") {
            $svg = $svg.attr("class", imgClass + " replaced-svg");
          }

          $svg = $svg.removeAttr("xmlns:a");

          // Replace image with new SVG
          $img.replaceWith($svg);
        },
        "xml"
      );
    });

    addFocusClass();

    //$('.appendedemblemList').remove();

    jQuery(".viewSwicther .thumbs-view-btn").click(function(e) {
      e.preventDefault();
      jQuery(".thumbs_view").removeClass("list-view");
    });

    jQuery(".viewSwicther .thumbs-list-view-btn").click(function(e) {
      e.preventDefault();
      jQuery(".thumbs_view").addClass("list-view");
      //$(".viewSwicther a").removeClass('viewSwictherActive');

      //$(this).addClass('viewSwictherActive');
    });

    jQuery(".HomeGalleryCarasole.single-page-gallery").flexslider({
      animation: "slide",
      controlNav: false,
      animationLoop: false,
      slideshow: false,
      itemWidth: 252,
      minItems: getGridSize(),
      maxItems: getGridSize()
    });

    function getGridSize() {
      return window.innerWidth <= 320
        ? 1
        : window.innerWidth < 600
        ? 2
        : window.innerWidth < 800
        ? 3
        : window.innerWidth < 900
        ? 3
        : 4;
    }
  });

  //Accessibility Mobile
  jQuery(window).resize(function() {
    jQuery(".accessiblelinks").removeAttr("style");
    if (jQuery(window).innerWidth() <= 940) {
      jQuery(".accessible-icon").click(function() {
        jQuery(".accessiblelinks").show();
      });

      jQuery(document).on("click", function(e) {
        if (jQuery(window).innerWidth() <= 940) {
          if (jQuery(e.target).closest(".accessible-icon").length === 0) {
            jQuery(".accessiblelinks").hide();
          }
        }
      });

      jQuery(".accessible-icon").on("keyup", function(e) {
        if (e.keyCode == 9) {
          if (e.shiftKey) {
          } else {
            jQuery(".accessiblelinks").show();
          }
        }
      });

      jQuery(".accessiblelinks ul a:last").on("keydown", function(e) {
        if (e.keyCode == 9) {
          if (e.shiftKey) {
          } else {
            jQuery(".accessiblelinks").hide();
          }
        }
      });
    }
  });
  jQuery(document).ready(function() {
    jQuery(".accessiblelinks").removeAttr("style");
    if (jQuery(window).innerWidth() <= 940) {
      jQuery(".accessible-icon").click(function() {
        jQuery(".accessiblelinks").show();
      });

      jQuery(document).on("click", function(e) {
        if (jQuery(window).innerWidth() <= 940) {
          if (jQuery(e.target).closest(".accessible-icon").length === 0) {
            jQuery(".accessiblelinks").hide();
          }
        }
      });

      jQuery(".accessible-icon").on("keyup", function(e) {
        if (e.keyCode == 9) {
          if (e.shiftKey) {
          } else {
            jQuery(".accessiblelinks").show();
          }
        }
      });

      jQuery(".accessiblelinks ul a:last").on("keydown", function(e) {
        if (e.keyCode == 9) {
          if (e.shiftKey) {
          } else {
            jQuery(".accessiblelinks").hide();
          }
        }
      });
    }
  });
})(jQuery);

jQuery(document).ready(function($) {
  jQuery("table").each(function() {
    var numCols = jQuery(this).find("tr")[0].cells.length;
    if (numCols < 4) {
      jQuery(this).css("table-layout", "fixed");
    }
  });
  //less than 4 column table layout fixed end

  //Skip to main content focus jump
  jQuery(".skipContent").click(function(e) {
    e.preventDefault();
    jQuery("#SkipContent").focus();
  });
  $(".goiSearch form,.search-aria form").on("submit", function(e) {
    let search = $(this).find("#search");
    if (search.val() == "" || search.val().length < 3) {
      alert("Search text should be minimum 3 characters long!");
      search.focus();
      e.preventDefault();
    }
  });

  $("#heading1 .accordian-head").attr("aria-expanded", "true");

  jQuery(".menuToggle").click(function(e) {
    $(this).toggleClass("clicked");
  });
});

jQuery(document).ready(function($) {
  let audioTag = document.getElementById("audioTag");
  let isPlaying = false;
  $("#play-btn").on("click", function() {
    if (isPlaying) {
      audioTag.pause();
      isPlaying = false;
      $(this).html("Play");
    } else {
      audioTag.play();
      isPlaying = true;
      $(this).html("Pause");
    }
  });
  $("#s3waas-read-text").on("click", function() {
    $("#show-description").slideToggle();
  });

  //Breadcrumb add attribute current page
  jQuery("#breadcrumb").find("li.current").attr("aria-current", "page");
});
