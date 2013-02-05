/**
 * Used by the user/util/userchooser handler to provide a
 * user chooser dialog for app developers.
 */
;(function () {
	var self = {};

	// Current list of options
	self.opts = {};

	// List of users
	self.users = [];

	// Initialized
	self.initialized = false;

	self.init = function () {
		$.get (
			'/user/chooser',
			function (res) {
				self.users = res;
				self.initialized = true;
			}
		);
	};

	self.search_users = function () {
		var q = this.elements['userchooser-input'].value.toLowerCase ();

		$('.simplePagerNav, .simplePagerContainer').remove ();
		var list = $('<ul id="userchooser-list" class="clearfix"></ul>');
		
		for (var i = 0; i < self.users.length; i++) {
			if (q === '' || self.users[i].name.toLowerCase ().match (q)) {
				if ($.inArray (parseInt (self.users[i].id), self.opts.chosen) > -1) {
					if (self.opts.chosen_visible) {
						list.append ('<li><span class="userchooser-disabled"><i class="icon-user"></i> ' + self.users[i].name + '</span></li>');
					}
				} else {
					list.append (
						$('<li></li>').append (
							$('<a href="#"></a>')
								.addClass ('userchooser-user')
								.data ('id', self.users[i].id)
								.data ('name', self.users[i].name)
								.data ('email', self.users[i].email)
								.html ('<i class="icon-user"></i> ' + self.users[i].name)
						)
					);
				}
			}
		}

		$('#userchooser-wrapper').append (list);
		list.quickPager ();
		
		$('.userchooser-user').click (self.return_user);

		return false;
	};

	self.return_user = function () {
		var id = $(this).data ('id'),
			name = $(this).data ('name'),
			email = $(this).data ('email');

		if (self.opts.set_id_value) {
			var el = $(self.opts.set_id_value),
				tag = el.get (0).nodeName.toLowerCase ();
			if (tag === 'input') {
				$(el).val (id);
			} else {
				$(el).text (id);
			}
		}

		if (self.opts.set_name_value) {
			var el = $(self.opts.set_name_value),
				tag = el.get (0).nodeName.toLowerCase ();
			if (tag === 'input') {
				$(el).val (name);
			} else {
				$(el).text (name);
			}
		}

		if (self.opts.set_email_value) {
			var el = $(self.opts.set_email_value),
				tag = el.get (0).nodeName.toLowerCase ();
			if (tag === 'input') {
				$(el).val (email);
			} else {
				$(el).text (email);
			}
		}

		if (self.opts.set_mailto) {
			$(self.opts.set_mailto).attr ('href', 'mailto:' + email);
		}

		if (self.opts.callback) {
			self.opts.callback (id, name, email);
		}

		$.close_dialog ();
		return false;
	};
	
	$.userchooser = function (opts) {
		var defaults = {
			callback: null,
			set_id_value: null,
			set_name_value: null,
			set_email_value: null,
			set_mailto: null,
			title: $.i18n ('Choose a User'),
			chosen: [],
			chosen_visible: true
		};
	
		self.opts = $.extend (defaults, opts);
		
		if (! self.initialized) {
			alert ($.i18n ('Unable to load the user list. Please try again in a few seconds.'));
			return;
		}

		var html = '<div id="userchooser-wrapper">' +
			'<div id="userchooser-search">' +
				'<form id="userchooser-form">' +
					'<input type="text" name="userchooser-input" size="30" />' +
					'<input type="submit" value="' + $.i18n ('Search') + '" />' +
				'</form>' +
			'</div>' +
			'<ul id="userchooser-list" class="clearfix"></ul>' +
		'</div>';

		$.open_dialog (self.opts.title, html, {height: 325});

		var list = $('#userchooser-list');
		
		for (var i = 0; i < self.users.length; i++) {
			if ($.inArray (parseInt (self.users[i].id), self.opts.chosen) > -1) {
				if (self.opts.chosen_visible) {
					list.append ('<li><span class="userchooser-disabled"><i class="icon-user"></i> ' + self.users[i].name + '</span></li>');
				}
			} else {
				list.append (
					$('<li></li>').append (
						$('<a href="#"></a>')
							.addClass ('userchooser-user')
							.data ('id', self.users[i].id)
							.data ('name', self.users[i].name)
							.data ('email', self.users[i].email)
							.html ('<i class="icon-user"></i> ' + self.users[i].name)
					)
				);
			}
		}

		list.quickPager ();
		
		$('#userchooser-form').submit (self.search_users);
		$('.userchooser-user').click (self.return_user);
	};

	self.init ();
})(jQuery);