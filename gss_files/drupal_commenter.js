/*global define, window, document*/

define('drupal_commenter', ['jquery'], function ($) {
	"use strict";
	var private_functions = {},
		cached_meta_data,
		public_functions = {};

	private_functions.arrayEach = function (array, func) {
		var i, len;
		for (i = 0, len = array.length; i < len; i = i + 1) {
			func(array[i], i);
		}
	};

	private_functions.extract_meta_data = function (form) {
		var meta_data = {};
        meta_data.comment_url = form.attr('action');
        meta_data.form_build_id = form.find('input[name="form_build_id"]').attr('value');
        meta_data.form_token = form.find('input[name="form_token"]').attr('value');
        meta_data.form_id = form.find('input[name="form_id"]').attr('value');
		return meta_data;
	};

	private_functions.build_data = function (data_parts) {
		var build_data;
        private_functions.arrayEach(data_parts, function (obj) {
            build_data = build_data + '&' + window.escape(obj.key) + '=' + window.escape(obj.value);
        });

        build_data = build_data.replace(/^&/, '');
		return build_data;
	};

	public_functions.add_comment = function (message, options, func) {
		$.get(options.node_url, function (data) {
            var form = $(data).find('#comment-form'),
                data_parts = [],
				build_data = "",
                meta_data = private_functions.extract_meta_data(form);

            data_parts.push({ key: 'comment_body[und][0][value]', value: message});
            data_parts.push({ key: 'comment_body[und][0][format]', value: 'markdown'});
            data_parts.push({ key: 'form_build_id', value: meta_data.form_build_id});
            data_parts.push({ key: 'form_token', value: meta_data.form_token});
            data_parts.push({ key: 'form_id', value: meta_data.form_id});
            data_parts.push({ key: 'subscriptions_notify', value: '1'});
            data_parts.push({ key: 'op', value: 'Submit+comment'});

            // These two add ajax comment support???
			// data_parts.push({ key: '_triggering_element_name', value: 'op'});
            // data_parts.push({ key: '_triggering_element_value', value: 'Submit+comment'});

            $.post(meta_data.comment_url, private_functions.build_data(data_parts), function (data, textStatus, jqXHR) {
				if (typeof func === 'function') {
					func(data, textStatus, jqXHR);
				}
			});
        });

	};

	return public_functions;
});
