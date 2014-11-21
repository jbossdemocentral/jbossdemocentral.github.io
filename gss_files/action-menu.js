/*global define, console, document, window */

define('action-menu', ['jquery'], function ($) {
	"use strict";
	var private_functions = {},
		template = "",
		public_functions = {};

	private_functions.build_menu = function (id) {
		var action_menu = {};

		action_menu.wrapper = $('<div class="menu-wrapper right"></div>');
		action_menu.menu = $('<menu class="actions-menu"></menu>');
		action_menu.button = $('<button class="btn-actions"><span class="icon-cog"></span></button>');
		action_menu.nav = $('<ul class="actions-menu-nav"></ul>');
		action_menu.submenu = $('<ul class="sub-menu"></ul>');

		action_menu.menu.attr('id', id);
		action_menu.button.attr('id', id + "-toggle-actions");
		action_menu.nav.attr('id', id + "-nav");
		action_menu.submenu.attr('id', id + "-submenu");

		action_menu.menu.append(action_menu.button);
		action_menu.menu.append(action_menu.nav);
		action_menu.wrapper.append(action_menu.menu);

		action_menu.addWidget = private_functions.addWidget;
		action_menu.expose = private_functions.expose;

		return action_menu;
	};


	// Close Menu function
	private_functions.closeUpShop = function (action_menu) {
		if ($('.action-item').hasClass('active-sub')) {
			var $active_sub = $('.active-sub');
			$active_sub.find('.cell').slideUp(250, 'linear', function () {
				action_menu.button.add(action_menu.nav).removeClass('active');
				action_menu.nav.find('li').removeClass('active-sub');
			});
		} else {
			action_menu.button.add(action_menu.nav).removeClass('active');
		}
	};

	public_functions.generateMenu = function (id) {
		return private_functions.build_menu(id);
	};

	private_functions.addWidget = function (widget) {
		var action_menu = this,
			nav_entry = $('<li class="action-item"><a title="' + widget.title + '" class="toggle"><span class="' + widget.style + '"></span></a><div class="cell"></div></li>');

		if (typeof widget.submenu !== 'undefined') {
			action_menu.nav.append(nav_entry);
			nav_entry.find('.cell').prepend(widget.submenu());
		} else if (typeof widget.action === 'function') {
			action_menu.nav.prepend(nav_entry);
			nav_entry.addClass('action');
			widget.action(nav_entry);
		}
	};

	private_functions.expose = function (selector) {
		//alert('exposed!');
		var action_menu = this;

		// Add the markup
		$(selector).prepend(action_menu.wrapper);

		// ============================================= //
		// OPEN MENU ON TOGGLE BUTTON CLICK / SHOW THE SUB-MENU
		// ============================================= //
		action_menu.button.click(function () {
			var $cell = $('.active-sub .cell'),
				$active_item = $('.action-item');

			// If the toggle button is 'active,' remove the active-sub styling and close menu
			if ($(this).hasClass('active')) {
				if($active_item.hasClass('active-sub')) {
					$cell.slideUp('fast', 'linear', function () {
						action_menu.button.removeClass('active');
						action_menu.nav.removeClass('active');
						$active_item.removeClass('active-sub');
					});
				} else {
					action_menu.button.add(action_menu.nav).removeClass('active');
				}
			} else {
				action_menu.button.add(action_menu.nav).addClass('active');
				//action_menu.button.add(action_menu.nav).addClass('active').css('overflow', 'visible');
			}
		});


		// ============================================= //
		// OPEN SUB-MENU ON ICON CLICK
		// ============================================= //
		action_menu.nav.find('.action-item .toggle').click(function () {
			// Define variables
			var $nav_element = $(this).parent(),
				toggle = $nav_element.find('.toggle'),
				cell = $nav_element.find('.cell'),
				notcurrent = $('.action-item .toggle').not(this).parent('.active-sub');

			// if the sub-menu is active/visible
			if (!$nav_element.hasClass('action')) {
				if ($nav_element.hasClass('active-sub')) {
					$nav_element.removeClass('active-sub');
					cell.slideUp(200, 'linear');
				} else if (notcurrent.hasClass('active-sub')) {
					$nav_element.addClass('active-sub');
					notcurrent.removeClass('active-sub').find('.cell').slideUp(200, 'linear', function() {
						$nav_element.find('.cell').slideDown(200, 'linear');
					});
				} else {
					$nav_element.find('.cell').slideDown(200, 'linear');
					$nav_element.addClass('active-sub');
				}
			}
			//action_menu.nav.find('li').not(this).removeClass('active-sub');
		});


		// ============================================= //
		// ESC EVENT LISTENER
		// ============================================= //
		$(document).keyup(function (e) {
			if (e.keyCode === 27) {
				private_functions.closeUpShop(action_menu);
			}
		});

		// ============================================= //
		// DOCUMENT CLICK EVENT LISTENER
		// ============================================= //
		$('html').click(function () {
			private_functions.closeUpShop(action_menu);
		});

		action_menu.menu.click(function (event) {
			event.stopPropagation();
		});

		return action_menu;
	};

	return public_functions;
});