/*
 * MODAL VIEWS
 */

'use strict';

+function(window, $, _) {

    window.LCB = window.LCB || {};

    window.LCB.ModalView = Backbone.View.extend({
        events: {
        	'submit form': 'submit'
        },
        initialize: function(options) {
            this.render();
        },
        render: function() {
            this.$('form.validate').validate();
            this.$el.on('shown.bs.modal hidden.bs.modal',
                        _.bind(this.refresh, this));
        },
        refresh: function() {
            var that = this;
            this.$('[data-model]').each(function() {
                $(this).val && $(this).val(that.model.get($(this).data('model')));
            });
        },
        success: function() {
            swal('更新成功!', '', 'success');
            this.$el.modal('hide');
        },
        error: function() {
            swal('额!', '', 'error');
        },
        submit: function(e) {
        	e && e.preventDefault();

            var $form = this.$('form[action]');
            var opts = {
                type: $form.attr('method') || 'POST',
                url: $form.attr('action'),
                data: $form.serialize(),
                dataType: 'json'
            };

            if (this.success) {
                opts.success = _.bind(this.success, this);
            }
            if (this.error) {
                opts.error = _.bind(this.error, this);
            }
            if (this.complete) {
                opts.complete = _.bind(this.complete, this);
            }

            $.ajax(opts);
        }
    });

    window.LCB.ProfileModalView = window.LCB.ModalView.extend({
        success: function() {
            swal('资料更改成功!', '您的资料已经更改.',
                 'success');
            this.$el.modal('hide');
        },
        error: function() {
            swal('额!', '资料变更失败.', 'error');
        }
    });

    window.LCB.AccountModalView = window.LCB.ModalView.extend({
        success: function() {
            swal('账户修改成功!', '您的账户已经更改.', 'success');
            this.$el.modal('hide');
            this.$('[type="password"]').val('');
        },
        error: function(req) {
            var message = req.responseJSON && req.responseJSON.reason ||
                          '您的账户更改失败.';

            swal('额!', message, 'error');
        },
        complete: function() {
            this.$('[name="current-password"]').val('');
        }
    });

    window.LCB.AuthTokensModalView = Backbone.View.extend({
        events: {
            'click .generate-token': 'generateToken',
            'click .revoke-token': 'revokeToken'
        },
        initialize: function(options) {
            this.render();
        },
        render: function() {
            this.$el.on('shown.bs.modal hidden.bs.modal',
                        _.bind(this.refresh, this));
        },
        refresh: function() {
            this.$('.token').val('');
            this.$('.generated-token').hide();
        },
        getToken: function() {
            var that = this;
            $.post('./account/token/generate', function(data) {
                if (data.token) {
                    that.$('.token').val(data.token);
                    that.$('.generated-token').show();
                }
            });
        },
        removeToken: function() {
            var that = this;
            $.post('./account/token/revoke', function(data) {
                that.refresh();
                swal('赞', 'Authentication token revoked!', 'success');
            });
        },
        generateToken: function() {
            swal({
                title: 'Are you sure?',
                text: 'This will overwrite any existing authentication token you may have.',   type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                closeOnConfirm: true },
                _.bind(this.getToken, this)
            );
        },
        revokeToken: function() {
            swal({
                title: 'Are you sure?',
                text: 'This will revoke access from any process using your current authentication token.',   type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                closeOnConfirm: false },
                _.bind(this.removeToken, this)
            );
        }
    });

    window.LCB.NotificationsModalView = Backbone.View.extend({
        events: {
            'click [name=desktop-notifications]': 'toggleDesktopNotifications'
        },
        initialize: function() {
            this.render();
        },
        render: function() {
            var $input = this.$('[name=desktop-notifications]');
            $input.find('.disabled').show()
              .siblings().hide();
            if (!notify.isSupported) {
                $input.attr('disabled', true);
                // Welp we're done here
                return;
            }
            if (notify.permissionLevel() === notify.PERMISSION_GRANTED) {
                $input.find('.enabled').show()
                  .siblings().hide();
            }
            if (notify.permissionLevel() === notify.PERMISSION_DENIED) {
                $input.find('.blocked').show()
                  .siblings().hide();
            }
        },
        toggleDesktopNotifications: function() {
            var that = this;
            if (!notify.isSupported) {
                return;
            }
            notify.requestPermission(function() {
                that.render();
            });
        }
    });

}(window, $, _);
