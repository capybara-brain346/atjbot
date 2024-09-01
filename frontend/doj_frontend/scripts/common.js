jQuery(document).ready(function($) {
  $("body").on("focus", ".enter-captcha", function() {
    $(this).attr("autocomplete", "off");
  });

  function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  $("li.languageCont ul li a").on("click", function() {
    if (confirm("This will lead you to " + $(this).text() + " language")) {
      return true;
    }
    return false;
  });

  $("script,style").each(function() {
    var attr = $(this).attr("type");
    if (typeof attr !== typeof undefined && attr !== false) {
      $(this).removeAttr("type");
    }
  });

  $("#SkipContent")
    .attr({ tabindex: "-1" })
    .hide();

  $(".skipContent").click(function() {
    $("#SkipContent").show();
  });
  $("iframe").each(function() {
    $(this).removeAttr("frameborder");
    $(this).removeAttr("width");
  });

  /* Where To Stay Ajax Load*/

  jQuery(".festivalLoadDom").on("change", ".wts-filter", function(event) {
    event.preventDefault();

    let data = {},
      $this = $(this),
      parents = $(this).parents(".wts-filter-hold");
    let isSelectParentTerm = $(this).attr("data-parent"),
      action = "where_to_stay_ajax";
    data.filterTermId = parseInt($this.val());

    $.post({
      url: AwaasData.ajaxUrl,
      method: "POST",
      dataType: "JSON",
      data: { data: data, action: action },
      beforeSend: function() {
        $this
          .parents(".festivalLoadDom")
          .find(".festivalcontainer")
          .attr("data-filter-term-id", data.filterTermId);
        $this
          .parents(".festivalLoadDom")
          .find(".festivalcontainer")
          .attr("data-current-page", 1);
        parents.data("ajaxRunning", true);
        $(".loader").show();
      },
      success: function(responseResults, status, xhr) {
        $this
          .parents(".festivalLoadDom")
          .find(".festivalcontainer")
          .html(responseResults.html);
        parents.data("ajaxRunning", false);
        if (responseResults.found_posts > 1) {
          if (
            typeof isSelectParentTerm !== typeof undefined &&
            isSelectParentTerm !== false
          ) {
            parents
              .find(".wts-child-filter")
              .off()
              .attr("disabled", "disabled");
            if (parseInt($this.val()) !== 0) {
              $.post({
                url: AwaasData.ajaxUrl,
                method: "POST",
                dataType: "JSON",
                data: { data: data, action: "where_to_stay_child_term_ajax" },
                beforeSend: function() {
                  $this
                    .parents(".festivalLoadDom")
                    .find(".festivalcontainer")
                    .attr("data-filter-term-id", data.filterTermId);
                  parents.data("ajaxRunning", true);
                },
                success: function(responseTemrs) {
                  parents
                    .find(".wts-child-filter")
                    .removeAttr("disabled")
                    .html(responseTemrs.html);
                  parents.data("ajaxRunning", false);
                  $(".loader").hide();
                }
              });
            } else {
              $(".loader").hide();
            }
          } else {
            $(".loader").hide();
          }
        } else {
          $(".loader").hide();
          if (
            typeof isSelectParentTerm !== typeof undefined &&
            isSelectParentTerm !== false
          ) {
            parents.find(".wts-child-filter").attr("disabled", "disabled");
          }
        }
      }
    });
  });

  jQuery(".festivalLoadDom").on(
    "click",
    ".festivalLoad .pagination li a",
    function(event) {
      event.preventDefault();
      let data = {};
      let $this = $(this);
      let parentUl = $this.parents("ul");

      let action = "where_to_stay_ajax";
      data.filterTermId = parseInt(
        $this
          .parents(".festivalLoadDom")
          .find(".festivalcontainer")
          .attr("data-filter-term-id")
      );
      data.currentPage = parseInt($this.attr("data-page-id"));

      if (parentUl.data("ajaxRunning")) {
        alert("Please wait!");
        return;
      }

      $.post({
        url: AwaasData.ajaxUrl,
        method: "POST",
        dataType: "JSON",
        data: { data: data, action: action },
        beforeSend: function() {
          parentUl.data("ajaxRunning", true);
          $(".loader").show();
        },
        success: function(response, status, xhr) {
          $this
            .parents(".festivalLoadDom")
            .find(".festivalcontainer")
            .html(response.html);
          $(".festivalcontainer").attr("data-current-page", response.current);
          parentUl.data("ajaxRunning", false);
          $(".loader").hide();
          $("html, body").animate(
            { scrollTop: $(".festivalLoadDom").offset().top },
            800
          );
        }
      });
    }
  );

  // Feedback Form Js

  if (jQuery(".wpcf7-form").length > 0) {
    jQuery(
      ".wpcf7-form span.wpcf7-form-control-wrap input,.wpcf7-form span.wpcf7-form-control-wrap textarea,.wpcf7-form span.wpcf7-form-control-wrap select"
    ).each(function() {
      var name = $(this).attr("name");

      $(this).attr("id", name);
      $(this)
        .parent("span")
        .prevAll("label:first")
        .attr("for", name);
    });

    $("img.siwp_img")
      .attr("tabindex", "0")
      .attr("aria-label", "CAPTCHA Image");

    jQuery("form.wpcf7-form input#your-name").on("keyup blur", function() {
      var name = $(this);
      var errorMsg = "";
      var nameregex = new RegExp("^[A-Za-z ]+$");
      var ariaRequired = name.attr("aria-required");

      if (
        typeof ariaRequired !== typeof undefined &&
        ariaRequired !== false &&
        name.val().trim() == ""
      ) {
        errorMsg = "Name is a required field";
        $(this).data("error", true);
      } else if (
        $("body").hasClass("lang-en") &&
        (name.val() != "" && !nameregex.test(name.val()))
      ) {
        errorMsg =
          "The Name entered is invalid. Only alphabets and space are supported.";
        $(this).data("error", true);
      }

      if (errorMsg !== "") {
        name.css("border", "2px solid #ff0000");
        if (name.parent().find(".wpcf7-not-valid-tip").length == 0) {
          $(
            '<span role="alert" class="wpcf7-not-valid-tip" tabindex="0" aria-label="' +
              errorMsg +
              '">' +
              errorMsg +
              "</span>"
          ).insertAfter(name);
        } else {
          name
            .parent()
            .find(".wpcf7-not-valid-tip")
            .text(errorMsg);
        }
      } else {
        $(this).data("error", false);
        name
          .parent()
          .find(".wpcf7-not-valid-tip")
          .remove();
        name.css("border", "1px solid #e1e1e1");
      }
    });

    jQuery("form.wpcf7-form input#your-email").on("keyup blur", function() {
      var email = $(this);
      var errorMsg = "";
      var ariaRequired = email.attr("aria-required");

      if (
        typeof ariaRequired !== typeof undefined &&
        ariaRequired !== false &&
        email.val().trim() == ""
      ) {
        errorMsg = "Email is a required field";
        $(this).data("error", true);
      } else if (!validateEmail(email.val())) {
        errorMsg = "Email id is invalid";
        $(this).data("error", true);
      }

      if (errorMsg !== "") {
        email.css("border", "2px solid #ff0000");
        if (email.parent().find(".wpcf7-not-valid-tip").length == 0) {
          $(
            '<span role="alert" class="wpcf7-not-valid-tip" tabindex="0" aria-label="' +
              errorMsg +
              '">' +
              errorMsg +
              "</span>"
          ).insertAfter(email);
        } else {
          email
            .parent()
            .find(".wpcf7-not-valid-tip")
            .text(errorMsg);
        }
      } else {
        $(this).data("error", false);
        email
          .parent()
          .find(".wpcf7-not-valid-tip")
          .remove();
        email.css("border", "1px solid #e1e1e1");
      }
    });

    jQuery("form.wpcf7-form input#your-subject").on("keyup blur", function() {
      var subject = $(this);
      var errorMsg = "";
      var subregex = new RegExp("^[A-Za-z0-9- ]+$");

      var ariaRequired = subject.attr("aria-required");

      if (
        typeof ariaRequired !== typeof undefined &&
        ariaRequired !== false &&
        subject.val().trim() == ""
      ) {
        errorMsg = "Subject is a required field";
        $(this).data("error", true);
      } else if (
        subject.val() !== "" &&
        $("body").hasClass("lang-en") &&
        !subregex.test(subject.val())
      ) {
        errorMsg = "Subject is invalid";
        $(this).data("error", true);
      }

      if (errorMsg !== "") {
        subject.css("border", "2px solid #ff0000");
        if (subject.parent().find(".wpcf7-not-valid-tip").length == 0) {
          $(
            '<span role="alert" class="wpcf7-not-valid-tip" tabindex="0" aria-label="' +
              errorMsg +
              '">' +
              errorMsg +
              "</span>"
          ).insertAfter(subject);
        } else {
          subject
            .parent()
            .find(".wpcf7-not-valid-tip")
            .text(errorMsg);
        }
      } else {
        $(this).data("error", false);
        subject
          .parent()
          .find(".wpcf7-not-valid-tip")
          .remove();
        subject.css("border", "1px solid #e1e1e1");
      }
    });

    jQuery("form.wpcf7-form textarea#your-message").on(
      "keyup blur",
      function() {
        var message = $(this);
        var errorMsg = "";
        var ariaRequired = message.attr("aria-required");

        if (
          typeof ariaRequired !== typeof undefined &&
          ariaRequired !== false &&
          message.val().trim() == ""
        ) {
          errorMsg = "Message is a required field";
          $(this).data("error", true);
        }

        if (errorMsg !== "") {
          message.css("border", "2px solid #ff0000");
          if (message.parent().find(".wpcf7-not-valid-tip").length == 0) {
            $(
              '<span role="alert" class="wpcf7-not-valid-tip" tabindex="0" aria-label="' +
                errorMsg +
                '">' +
                errorMsg +
                "</span>"
            ).insertAfter(message);
          } else {
            message
              .parent()
              .find(".wpcf7-not-valid-tip")
              .text(errorMsg);
          }
        } else {
          $(this).data("error", false);
          message
            .parent()
            .find(".wpcf7-not-valid-tip")
            .remove();
          message.css("border", "1px solid #e1e1e1");
        }
      }
    );

    jQuery('form.wpcf7-form input[name="siwp_captcha_value"]').on(
      "keyup blur",
      function() {
        var captcha = $(this);
        var errorMsg = "";

        if (captcha.val().trim() == "") {
          errorMsg = "Captcha is a required field";
          $(this).data("error", true);
        }

        if (errorMsg !== "") {
          if (captcha.parent().find(".wpcf7-not-valid-tip").length == 0) {
            $(
              '<span role="alert" class="wpcf7-not-valid-tip " tabindex="0" aria-label="' +
                errorMsg +
                '">' +
                errorMsg +
                "</span>"
            ).insertAfter(captcha);
          } else {
            captcha
              .parent()
              .find(".wpcf7-not-valid-tip")
              .text(errorMsg);
          }
        } else {
          $(this).data("error", false);
          captcha
            .parent()
            .find(".wpcf7-not-valid-tip")
            .remove();
          captcha.css("border", "1px solid #e1e1e1");
        }
      }
    );

    jQuery("form.wpcf7-form").on("submit", function() {
      var offset = AwaasData.isUserLoggedIn ? 150 : 65;
      var scrollTo = "";
      var error = false;

      error = jQuery("form.wpcf7-form input#your-name")
        .trigger("keyup")
        .data("error");

      if (!error) {
        error = jQuery("form.wpcf7-form input#your-email")
          .trigger("keyup")
          .data("error");
      }

      if (!error) {
        error = jQuery("form.wpcf7-form input#your-email")
          .trigger("keyup")
          .data("error");
      }
      if (!error) {
        error = jQuery("form.wpcf7-form input#your-subject")
          .trigger("keyup")
          .data("error");
      }
      if (!error) {
        error = jQuery("form.wpcf7-form textarea#your-message")
          .trigger("keyup")
          .data("error");
      }
      if (!error) {
        error = jQuery('form.wpcf7-form input[name="siwp_captcha_value"]')
          .trigger("keyup")
          .data("error");
      }

      if (error) {
        $("html, body").animate(
          {
            scrollTop:
              $("span.wpcf7-not-valid-tip")
                .first()
                .offset().top - offset
          },
          1500
        );
        setTimeout(function() {
          $("span.wpcf7-not-valid-tip")
            .first()
            .focus();
        }, 1400);
        return false;
      }
    });

    $("span.wpcf7-form-control-wrap").each(function(i, element) {
      var ariaLabel = "";
      if ($(this).find("input").length > 0) {
        ariaLabel =
          $(this)
            .find("input")
            .attr("name") + " ";
      }

      ariaLabel += $(this)
        .find("span.wpcf7-not-valid-tip")
        .text();

      $(this)
        .find("span.wpcf7-not-valid-tip")
        .attr("tabindex", "0")
        .attr("aria-label", ariaLabel);
    });
  }
  $("img").each(function() {
    if (typeof $(this).attr("alt") === "undefined") {
      $(this).attr("alt", "");
    }
  });

  if ($("nav").length == 0) {
    $(".menuToggle").remove();
  }
});
