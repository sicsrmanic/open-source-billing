// // This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require jquery-ui.js
//= require twitter/bootstrap
//= require jquery.jqplot.js
//= require jqplot.barRenderer.min.js
//= require jqplot.categoryAxisRenderer.min.js
//= require jqplot.pointLabels.min.js
//= require jqplot.highlighter.js
//= require jquery_nested_form
//= require nav.js
//= require chosen.jquery
//= require jquery.css3caching.js
//= require inline-forms.js.coffee
//= require invoices.js.coffee
//= require formatCurrency.js
//= require tableSorter.js
//= require tablesorter.staticrow.js
//= require jquery.metadata.js
//= require application.js
//= require bootstrap.js.coffee
//= require clients.js.coffee
//= require client_additional_contacts.js.coffee
//= require client_contacts.js.coffee
//= require accounts.js.coffee
//= require dashboard.js.coffee
//= require invoice_line_items.js.coffee
//= require items.js.coffee
//= require jqamp-ui-spinner.min.js
//= require jquery.qtip.min.js
//= require jwerty.js
//= require payments.js.coffee
//= require payment_terms.js.coffee
//= require reports.js.coffee
//= require taxes.js.coffee
//= require sonic.js
//= require progress_indicator.js.coffee
//= require jquery.tablehover.min.js
//= require tax-calculations.js.coffee
//= require jquery.formatCurrency-1.4.0.js
//= require table-listing.js.coffee
//= require credit-payment.js.coffee
//= require cc-validation.js.coffee
//= require jquery.customScrollbar.min.js
//= require users.js.coffee
//= require validate-forms.js.coffee
//= require jquery.ellipsis.js
//= require companies.js.coffee
//= require email_templates.js.coffee
//= require tinymce
//= require email_template.js


jQuery(function () {

    //override default behavior of inserting new subforms into form    
    window.NestedFormEvents.prototype.insertFields = function (content, assoc, link) {
        if (document.location.pathname.search(/\/invoices\//) != -1) {
            var $tr = $(link).closest('tr');
            return $(content).insertBefore($tr);
        } else if (document.location.pathname.search(/\/clients\//) != -1) {
            var $contact_container = $(link).parents('#adCntcts').find(".client_contacts_container");
            return $contact_container.append(content)
        }
    }

    jQuery("#nav .select .sub li").find("a.active").parents("ul.sub").prev("a").addClass("active");

//    jQuery("#nav ul.select > li").mouseenter(function () {
//        jQuery(".sub").hide();
//        jQuery(".sub", jQuery(this)).show();
//    });

    // Show sub menu on mouseover
    jQuery('#nav .select li.dropdown .dropdown-toggle,#nav .dropdown-menu').mouseover(function () {
        jQuery(this).parents('li.dropdown').find('.dropdown-menu').show();
        jQuery(".sub").hide();
        jQuery('#nav .dropup, #nav .dropdown').css('position','relative');
    }).mouseout(function () {
            jQuery(this).parents('li.dropdown').find('.dropdown-menu').hide();
            jQuery('#nav .dropup, #nav .dropdown').css('position','static');
        });
    // Hide other open header menu on mouseover
    jQuery('.primary_menu .dropdown').mouseover(function () {
       jQuery(this).siblings().removeClass('open');
    });

    jQuery("#nav").on("mouseleave", function (event) {
        if (event.pageY - $(window).scrollTop() <= 1) {
            jQuery(".sub").hide();
            jQuery("li a.active", jQuery(this)).next(".sub").show();
        }
        try {
            var e = event.toElement || event.relatedTarget;
            if (e.parentNode == jQuery(this).find('ul.select') || e == this)
                return;
            else {
                jQuery(".sub").hide();
                jQuery("li a.active", jQuery(this)).next(".sub").show();
            }
        }
        catch (e) {
        }
    });

    // toggle page effect by clicking on alpha tag
    jQuery(".logo_tag").click(function () {
        jQuery("#main-container").toggleClass("page-effect");
    }).qtip();

    (function ($) {
        $(window).load(function () {
            $(".scrollContainer").mCustomScrollbar({
                scrollInertia: 150
            });
        });
    })(jQuery);

    //jQuery(".revenue_by_client .grid_table table, .payments_collected .grid_table table").tableHover({colClass: 'col_hover', footCols: true, footRows: true, rowClass: 'row_hover'})

});


