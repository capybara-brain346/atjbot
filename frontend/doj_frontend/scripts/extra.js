//custom flexslider start
jQuery(document).ready(function($) {
//js for photo gallery component design 1
jQuery('.thumb-bottom-scroll').flexslider({
        animation: "fade",
		controlNav: false,
		animationLoop: false,
		slideshow: false,
        sync: ".thumb-bottom-crucel"
}),
jQuery('.thumb-bottom-crucel').flexslider({
        animation: "slide",
		controlNav: false,
		animationLoop: false,
		slideshow: false,
		itemWidth: 210,
		//itemMargin: 5,
        asNavFor: ".thumb-bottom-scroll"
     }),
//=========================

jQuery('.thumb-bottom').flexslider({
        animation: "fade",
        controlNav: "thumbnails",
        start: function(slider){
          jQuery('body').removeClass('loading');
        }
      });
//=========================
jQuery('.no-thumb').flexslider({
        animation: "fade",
        controlNav: false,
        start: function(slider){
          jQuery('body').removeClass('loading');
        }
      });
//=========================
jQuery('.thumb-right').flexslider({
        animation: "fade",
        controlNav: "thumbnails",
        start: function(slider){
          jQuery('body').removeClass('loading');
        }
      });
//=========================
jQuery('.thumb-left').flexslider({
        animation: "fade",
        controlNav: "thumbnails",
        start: function(slider){
          jQuery('body').removeClass('loading');
        }
      });

//=========================


  //js for photo gallery component design 2
  jQuery(".HomeGalleryCarasole").flexslider({
    animation: "slide",
    controlNav: false,
    animationLoop: false,
    slideshow: false,
    itemWidth: 200
  });
  jQuery("#HomeVideoCarasole").flexslider({
    animation: "slide",
    controlNav: false,
    animationLoop: false,
    slideshow: false,
    itemWidth: 200
  });


  $("#doc-filter-form-container .datepicker.start-date").datepicker({
    dateFormat: "dd-mm-yy",
    changeYear: true,
    changeMonth: true,
    onSelect: function () {
      let endDate = $('#doc-filter-form-container .datepicker.end-date');
      if (endDate.val() != '') endDate.val('');
      endDate.datepicker('option', 'minDate', $(this).val());
    }
  });
  $("#doc-filter-form-container .datepicker.end-date").datepicker({ dateFormat: "dd-mm-yy", changeYear: true, changeMonth: true });
  if ($("#doc-filter-form-container .datepicker.start-date").val() != '') {
    let startDate = $('#doc-filter-form-container .datepicker.start-date');
    let endDate = $('#doc-filter-form-container .datepicker.end-date');
    endDate.datepicker('option', 'minDate', startDate.val());
  }
  $("form#doc-filter-form-container button[type='submit']").click(function (event) {

    event.preventDefault();
    $('input,select').each(function () {
      if ($(this).val() == "") {
        $(this).attr("disabled", "disabled");
      }
    });
    $(this).parents('form').submit();

  });
  $("form#doc-filter-form-container button[type='reset']").click(function (event) {

    event.preventDefault();
    let redirectUrl = $(this).attr('data-reset-url');
    if (redirectUrl == '') return;

    window.location.href = redirectUrl;
  });
  $('form#doc-filter-form-container select#document_category').on('change', function () {
    var formAction = $(this).val();
    if (formAction != '')
      $(this).parents('form').attr('action', formAction);
  });

  document.addEventListener("keyup", function (e) {
    if (e.keyCode === 9) {
      jQuery("body").addClass("show-focus-outlines");
    }
  });

  document.addEventListener("mousedown", function (e) {
    jQuery("body").removeClass("show-focus-outlines");
  });


});
