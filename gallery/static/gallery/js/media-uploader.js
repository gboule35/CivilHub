(function ($) {
"use strict";
//
// Obsługa media-pluginu dla CKEditora.
// -----------------------------------------------------------------------------

Dropzone.autoDiscover = false;

// Media uploader
// --------------
var mediaUploader = function (options) {

    var defaults = {
            callback: function (selected) {
                console.log(selected);
            }
        },

        options = $.extend(defaults, options),

        fetchGallery = function (callback) {
            sendAjaxRequest('GET', '/rest/usermedia', {
                success: function (resp) {
                    if (typeof(callback) === 'function') {
                        callback(resp);
                    }
                }
            });
        },

        createDropzone = function () {
            var $dz = $('#dropzone-input');
            if ($dz.data('dropzone') !== undefined) {
                // If dropzone already exists, 
                // their is no need to create new one.
                return $dz.data('dropzone');
            } else {
                return new Dropzone('#dropzone-input', {
                    init: function () {
                        var that = this;
                        that.on("complete", function (file) {
                            if (that.getUploadingFiles().length === 0 &&
                                that.getQueuedFiles().length === 0) {
                                // re-fetch gallery after media upload
                                //uploader.fetchUserGallery();
                                $('#media-upload-modal')
                                    .data('mediaUploader')
                                    .refetch();
                            }
                        });
                        // Add dropzone to element's data to avoid 'Dropzone
                        // already attached' error.
                        $('#dropzone-input')
                            .addClass('dropzone')
                            .data('dropzone', that);
                    }
                });
            }
        },

        MediaItemModel = Backbone.Model.extend({}),

        MediaItemView = Backbone.View.extend({
            tagName:   'div',
            className: 'media-entry',
            template:  _.template($('#media-item-tpl').html()),
            render: function () {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            },
        }),

        MediaList = Backbone.Collection.extend({
            model: MediaItemModel
        }),

        Uploader = Backbone.View.extend({
            active: false,

            selected: null,

            el: '#media-upload-modal',

            initialize: function () {
                var that = this;
                that.$el.find('#tabs').tabs();
                that.$userGallery = that.$el.find('#tabs-2');
                that.$sBtn = that.$el.find('.submit-btn');
                that.dz = createDropzone();
                fetchGallery(function (items) {
                    that.collection = new MediaList(items);
                    that.render();
                    that.active = true;
                });
            },

            refetch: function () {
                var that = this;
                that.$userGallery.empty();
                fetchGallery(function (items) {
                    that.collection = new MediaList(items);
                    that.render();
                });
            },

            render: function () {
                var that = this;
                this.collection.each(function (item) {
                    this.renderEntry(item);
                }, this);
                this.$el
                    .modal('show')
                    .data('mediaUploader', this)
                    .one('hidden.bs.modal', function () {
                        that.$userGallery.empty();
                    });
                this.$sBtn.one('click', function () {
                    if (typeof(options.callback) === 'function') {
                        options.callback(that.selected);
                    }
                    that.$el.modal('hide');
                });
            },

            renderEntry: function (item) {
                var that = this,
                    entry = new MediaItemView({
                        model: item
                    });
                $(entry.render().el)
                    .appendTo(this.$userGallery)
                    .bind('click', function () {
                        that.selected = entry.model.get('picture_url');
                        that.$el.find('.media-entry').removeClass('active');
                        entry.$el.addClass('active');
                    });
            }
        });

    return new Uploader;
};

// CKEditor plugin
// ---------------
$.fn.customCKEditor = function (settings) {
    return $(this).each(function () {
        var $el = $(this),
            editor = CKEDITOR.replace($el.attr('id')),
            uploader = null,
            image = {};
        editor.ui.addButton('MediaUploader', {
            label: gettext('Add Media'),
            command: 'Uploader'
        });
        editor.addCommand('Uploader', {exec: function () {
            uploader = mediaUploader({
                callback: function (item) {
                    if (!_.isNull(item)) {
                        image = CKEDITOR.dom.element
                            .createFromHtml( '<img src="' + item + '" border="0" />' );
                        editor.insertElement(image);
                    }
                }
            });
        }});
        // Load additional CKEDITOR configuration
        for (var key in window.CONFIG.ckeditor[settings]) {
            if (window.CONFIG.ckeditor[settings].hasOwnProperty(key)) {
                editor.config[key] = window.CONFIG.ckeditor[settings][key];
            }
        }
        // Give API endpoint to manipulate editor instance.
        $el.data('editor', editor);
    });
};
})(jQuery);