//
// ui.js
// -----
//
// Scripts related to user interface, such as flash
// messages, date pickers etc.
//
var app = app || {};

//
// Flash messages framework.
// -----------------------------------------------------------------------------

//
// Single message constructor.
// ---------------------------
app.FlashMsg = Backbone.View.extend({
    tagName: 'div',
    
    className: 'alert',
    
    template: _.template('<%= message %><button type="button" class="close" \
        data-dismiss="alert"><span aria-hidden="true">&times;</span> \
        <span class="sr-only">Close</span></button>'),
    
    events: {
        'mouseover': 'highlight'
    },
    
    render: function (msg, lvl) {
        this.$el.html(this.template({'message': msg}));
        this.$el.addClass('alert-' + lvl);
        this.setClock();
        return this;
    },
    
    setClock: function () {
        var that = this;
        this.clock = setTimeout(function () {
            that.remove.call(that)
        }, 5000);
    },
    
    highlight: function () {
        var that = this;
        this.$el.addClass('active');
        this.stopClock();
        this.$el.one('mouseout', function () {
            that.setClock();
            that.$el.removeClass('active');
        });
    },
    
    stopClock: function () {
        clearTimeout(this.clock);
    },
    
    remove: function () {
        var that = this;
        this.$el.fadeOut('slow', function () {
            that.$el.empty().remove();
        });
    }
});

//
// Represents entire messages area on screen.
// ------------------------------------------
app.MessageArea = Backbone.View.extend({
    el: '#messages',
    
    addMessage: function (msg, lvl) {
        var view = new app.FlashMsg();
        $(view.render(msg, lvl).el).appendTo(this.$el);
    },
    
    alert: function (msg) {
        this.addMessage(msg, 'danger');
    },
    
    warning: function (msg) {
        this.addMessage(msg, 'warning');
    },
    
    info: function (msg) {
        this.addMessage(msg, 'info');
    },
    
    success: function (msg) {
        this.addMessage(msg, 'success');
    }
});

//
// Handy interface for messages via app object.
// --------------------------------------------
app.message = new app.MessageArea();


//
// Misc utils.
// -----------------------------------------------------------------------------

//
// Confirmation window
// -------------------
// Mostly used when users try to delete model, to avoid
// unintentional deletion. It is made to be used with bootbox
// confirm window.
//
// @param callback {function} Callback method
// @param context  {object}   Object, on which we want to act
// @param params   {void}     Additional params for function call
//
// @returns undefined
//
app.confirmWindow = function (callback, context, params) {
    var msg = gettext("Are you sure you want to do this?");
    context = context || {};
    params = params || {};
    bootbox.confirm(msg, function (resp) {
        if (resp && typeof(callback) === 'function') {
            callback.apply(context, params);
        }
    });
};