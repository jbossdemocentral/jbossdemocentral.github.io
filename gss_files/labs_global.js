/*global define, window, document, chrometwo_require*/

define('labs_global', ['jquery'], function (jq) {
	"use strict";

	var private_functions = {},
		public_functions = {};

	private_functions.add_action_menu = function (href) {
		chrometwo_require(['action-menu', 'drupal_commenter'], function (action_menu, drupal_commenter) {
			jq('head').prepend('<link rel="stylesheet" type="text/css" media="all" href="/webassets/avalon/j/lib/action-menu/css/style.css" />');
			var menu = action_menu.generateMenu('portal_action_menu');

			if (href.indexOf('labsinfo') !== -1) {
				menu.addWidget({
					name: 'comment',
					title: 'Leave a comment about this lab',
					style: 'icon-comment',
					submenu: function () {
						var commenter = jq('<div><label for="comment">Leave a Comment on the <a href="' + href + '#comments">info page</a></label><br />'
										   + '<textarea name="comment"></textarea>'
										   + '<button id="labs_drupal_comment_submit" class="btn btn-primary" type="button">Submit</button>'
										   + '<span class="loading">Adding Comment</span>'
										   + '<span class="comment_message" style="display: none;"><a href=' + href + '#comments"">Click here to see the comments</a></span>'
										   + '</div>');

						jq('#labs_drupal_comment_submit').button('loading');
						commenter.find('.btn').click(function () {

							commenter.find('textarea').attr('disabled', 'disabled');
							commenter.find('button').attr('disabled', 'disabled');
							commenter.find('.loading').show();

							drupal_commenter.add_comment(commenter.find('textarea').val(), {
								node_url: href
							}, function () {
								commenter.find('textarea').val('');
								commenter.find('textarea').removeAttr('disabled');
								commenter.find('button').removeAttr('disabled');
								commenter.find('.loading').hide();
								commenter.find('comment_message').show();
							});
						});
						return commenter;
					}
				});
			}

			menu.addWidget({
				name: 'jump',
				title: (href.indexOf('labsinfo') !== -1) ?  "Go to the app info page" : "Go to the app",
				style: (href.indexOf('labsinfo') !== -1) ?  "icon-info-circle" : "labs-icon-labs",
				action: function (nav_entry) {
					nav_entry.find('a').attr('href', href);
				}
			});

			menu.expose('#main');
		});

	};

	private_functions.do_labs_app_page_stuff = function () {
		var path_parts,
			app_id;

		// lab app specific
		if (window.location.pathname.indexOf('/labs/') === 0) {
			path_parts = window.location.pathname.match(/\/labs\/(.*?)\//);
			if (path_parts !== null && path_parts.length === 2) {
				app_id = path_parts[1];

				private_functions.add_action_menu('/labsinfo/' + app_id);

				chrometwo_require(['chrome_lib'], function (lib) {
					if (lib.getAuthorizationValue('chrome_user_info') === false) {
						window.location.href = jq('#accountLogin').attr('href');
					}
				});
			}
		}
	};

	private_functions.get_push_status = function (app_id) {
		jq.getJSON('https://labsmanager-hands.itos.redhat.com/labs/' + app_id + '/job_status', function (data) {
			var job_string = "";
			if(Object.prototype.toString.call(data) === '[object Array]') {
				jq('#lab_status .finished').hide();
				jq('#lab_status .reloading').show();
				chrometwo_require(['chrome_lib'], function (lib) {
					lib.arrayEach(data, function (job) {
						job_string = job_string + " " + job.queue;
					});
					jq('#lab_status .reloading').html('There are ' + data.length + ' update(s) in the job queue: ' + job_string);
					window.setTimeout(private_functions.get_push_status, 2000, [ app_id ]);
				});
			} else {
				jq('#lab_status .loading').hide();
				jq('#lab_status .finished').show();
				window.setTimeout(private_functions.get_push_status, 10000, [ app_id ]);
			}
		});
	};

	private_functions.do_labsinfo_page_stuff = function () {
		var path_parts,
			app_id;
		if (window.location.pathname.indexOf('/labsinfo') === 0) {

			path_parts = window.location.pathname.match(/\/labsinfo\/([a-zA-Z0-9]*)[/]*/);

			if (path_parts !== null && path_parts.length === 2) {
                app_id = path_parts[1];
				jq('.btn--go-labs').remove();
				private_functions.add_action_menu('/labs/' + app_id + '/');
			}

			try {
				(function () {
					if (window.Drupal.portal.currentUser.isInternal) {
						var status_element = jq('<dl class="labs-version" id="lab_status">'
							+ '<dt>Application Update Status: </dt>'
							+ '<dd>'
							+ '<div class="finished" style="display: inline;">Application is not currently being updated.</div>'
							+ '<div class="loading reloading" style="display: inline;"></div>'
							+ '</dd>'
							+ '</dl>');

						jq('.labs-version').after(status_element);
						jq('#lab_status .loading').hide();
						private_functions.get_push_status(app_id);
					}
				}());
			} catch (e) {}

			chrometwo_require(['/webassets/avalon/j/lib/easypaginate.js'], function () {
				window.jQuery('.item-list ul').each(function (i, element) {
					var $element = jq(element),
						safe_id = $element.parent().find('h2:first').text();

					safe_id = safe_id.toLowerCase();
					safe_id = 'paginate_' + safe_id;
					safe_id = safe_id.replace(/ /, '');

					window.jQuery(element).easyPaginate({
						delay: 0,
						nextprev: false,
						step: 3,
						controls: safe_id
					});
				});
			});
		}
	};

	public_functions.init = function () {
		// force sitemap state
		window.siteMapState = "support";
		window.changeNavigationState();

		// do branding
		jq("head").append("<link rel=\"stylesheet\" type=\"text/css\" media=\"all\" href=\"/chrome_themes/umbra/s/labs.css\" />");
		jq('#portalHome').html('Access Labs').attr('href', '/labs/');
		jq('body').addClass('portal-labs');

		private_functions.do_labsinfo_page_stuff();
		private_functions.do_labs_app_page_stuff();
	};



	return public_functions;
});