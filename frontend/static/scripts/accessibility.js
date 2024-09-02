jQuery(document).ready(function($){

    let excludeExternalLinks = S3WaaSAccessibilityParams.excludeExternalLinks.split(',').filter(n => n);

    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function(searchString, position){
            position = position || 0;
            return this.substr(position, searchString.length) === searchString;
        };
    }

    $('body').on('targetExternalLinks',function(){

        var isExternal = function(url) {
            if( !url.match('^(https?:)?(\\/\\/).*$')) return false;
            return !(location.href.replace("http://", "").replace("https://", "").split("/")[0] === url.replace("http://", "").replace("https://", "").split("/")[0]);
        }
        var isExternalExcluded = function(url) {
            if( !url.match('^(https?:)?(\\/\\/).*$')) return false;
            let excludeThisLink = false;
            return excludeExternalLinks.some(function (item, index){
                console.log(item);
                if(url.indexOf(item) > -1){
                    excludeThisLink = true;
                    return true;
                }
            });
        }

        $('a').each(function(){
            var href = $(this).attr('href');
            if(typeof href == 'undefined' ){
                $(this).attr('href','javascript:void(0)');
                href = '#';
            }

            if($(this).attr('hreflang') !== undefined){
                if($(this).attr('hreflang') == 'od'){
                    $(this).attr({  hreflang: 'or', lang:'or'});
                }
                if($(this).attr('aria-label') !== typeof undefined){
                    $(this).attr('aria-label', $(this).text()).attr('title',$(this).text());
                }
            }else if(isExternal(href)){

                if(
                    href.indexOf('cdn.s3waas.gov.in') == -1
                    && href.indexOf('auth.s3waas.gov.in') == -1
                    && href.indexOf('cdnbbsr.s3waas.gov.in') == -1
                    && href.indexOf('parichay') == -1
                    && !$(this).hasClass('fancybox.iframe')
                    && !$(this).hasClass('fancybox')
                ) {
                    if(typeof $(this).attr('onclick') === "undefined" && !isExternalExcluded(href)){
                        $(this).attr("onclick", "return confirm('You are being redirected to an external website. Please note that "+S3WaaSAccessibilityParams.blogInfoName+" cannot be held responsible for external websites content & privacy policies.');");
                    }
                }

                if(typeof $(this).attr('aria-label') === "undefined" || typeof $(this).attr('title') === "undefined"){
                    var text = '';
                    if($(this).text().trim() !== ''){
                        text = $(this).text().trim()+' - ';
                    }else {
                        text = $(this).attr('href')+' - ';
                    }

                    if(
                        href.indexOf('cdn.s3waas.gov.in') == -1
                        && href.indexOf('auth.s3waas.gov.in') == -1
                        && href.indexOf('cdnbbsr.s3waas.gov.in') == -1
                        && href.indexOf('parichay') == -1
                        && !$(this).hasClass('fancybox.iframe')
                        && !$(this).hasClass('fancybox')
                    ){

                        if(typeof $(this).attr('aria-label') === "undefined"){
                            $(this).attr('aria-label', text + S3WaaSAccessibilityParams.defaultLinkAriaLabel);
                        }
                        if(typeof $(this).attr('title') === "undefined"){
                            $(this).attr('title', text + S3WaaSAccessibilityParams.defaultLinkTitle);
                        }
                    }
                }

                if(href.indexOf('auth.s3waas.gov.in') == -1 && href.indexOf('parichay') == -1) {
                   $(this).prop({target: '_blank', rel: 'noopener noreferrer'});
                }
            }
        });

    })
    $('body').trigger('targetExternalLinks');
    $('.flex-direction-nav a.flex-prev').attr({'title' : S3WaaSAccessibilityParams.flexNavPrevTitle,'aria-label': S3WaaSAccessibilityParams.flexNavPrevTitle});
    $('.flex-pauseplay a.flex-pause').attr({'title' : S3WaaSAccessibilityParams.flexNavPlayPauseTitle,'aria-label': S3WaaSAccessibilityParams.flexNavPlayPauseTitle});
    $('.flex-direction-nav a.flex-next').attr({'title' : S3WaaSAccessibilityParams.flexNavNextTitle,'aria-label':S3WaaSAccessibilityParams.flexNavNextTitle});

    $('a[download]').each(function(){
        var ariaLabelPrevious = $(this).prev().attr('aria-label');
        if(typeof ariaLabelPrevious !== typeof undefined && typeof $(this).attr('aria-label') == typeof undefined){
            var ariaLabel = $(this).prev().attr('aria-label').split('-')[0];
            ariaLabel = S3WaaSAccessibilityParams.ariaLabelDownload +' '+ ariaLabel;
            $(this).attr('aria-label',ariaLabel).removeAttr('aria-hidden');
        }
    });
});