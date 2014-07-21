//
// create-poll.js
// ==============
//
// Scripts to handle creating new poll.
//
require(['jquery',
         'underscore',
         'js/editor/customCKEditor'], 

function ($, _) {
    "use strict";
    $('#id_question').customCKEditor('custom');
    $('#id_title').focus();
    $('#id_tags').tagsInput({
        autocomplete_url: '/rest/tags/',
    });
    function ActiveAnswer (id) {
        return {
            id: id,
            $el: $('<div class="answer-entry"></div>'),
            tpl: _.template($('#answer-entry-tpl').html()),
            render: function () {
                var _that = this;
                _that.$el.html(_that.tpl({id: id}));
                _that.$el.find('.delete-entry-btn').on('click', function (evt) {
                    evt.preventDefault();
                    _that.$el.fadeOut('slow', function () {
                        _that.$el.empty().remove();
                    });
                });
                return _that.$el;
            }
        }
    }
    function createAnswer () {
        var id = $('.answer-entry').length + 1,
            a = new ActiveAnswer(id);
        $('#poll-answer-form').append(a.render());
    }
    $('.add-answer-btn').tooltip().bind('click', function (evt) {
        evt.preventDefault();
        createAnswer();
    });
});