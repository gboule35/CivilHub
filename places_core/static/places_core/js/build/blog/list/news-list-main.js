//
// Lista wpisów na blogu
//
//  => /templates/locations/location_news.html
//
// -------------------------------------------

require.config({
    
    baseUrl: window.STATIC_URL,
    
    urlArgs: "bust=" + (new Date()).getTime(),
    
    waitSeconds: 200,
    
    paths: {
        jquery: 'includes/jquery/jquery',
        jpaginate: 'includes/jquery/jquery.paginate',
        underscore: 'includes/underscore/underscore',
        backbone: 'includes/backbone/backbone',
        bootstrap: 'includes/bootstrap/bootstrap',
        bootbox: 'includes/bootstrap/bootbox',
        paginator: 'includes/backbone/backbone.paginator',
        tagsinput: 'includes/jquery/jquery.tagsinput',
        moment: 'includes/momentjs/moment'
    },
    
    shim: {
        jpaginate: { deps: ['jquery'] },
        
        underscore: {
            deps: ['jquery'],
            exports: '_'
        },
        
        backbone: {
            deps: ['underscore'],
            exports: 'Backbone'
        },
        
        bootstrap: {
            deps: ['jquery']
        },
        
        bootbox: {
            deps: ['bootstrap'],
            exports: 'bootbox'
        },
        
        tagsinput: {
            deps: ['jquery']
        }
    }
});

require(['jquery',
         'js/common',
         'js/locations/follow',
         'js/inviter/userinviter',
         'js/blog/category-creator',
         'js/blog/news-list/blog'], 
         
function ($) {

    "use strict";

    $(document).trigger('load');
    
});