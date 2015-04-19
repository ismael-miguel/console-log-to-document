	(function (window, undefined)
	{

		window.console._RELAY_TO_DOC = false;
		window.console._USE_JSON = false;
		window.console._SHOW_COOL_NUMBERS = false;
		window.console._SHOW_TYPES = false;
		window.console._SHOW_STRING_LENGTH = false;

		if (window.console.log.toString() != window.Math.log.toString() && window.console.warn)
		{
			window.console.warn('The current console.log() may not be the native method!');
		}

		var old_console_log = window.console.log,
			escapeHTML = function (string)
			{
				return string.replace(/[&<>"'\/]/g, function (c)
				{
					return {
						'&': '&amp;',
						'<': '&lt;',
						'>': '&gt;',
						'"': '&quot;',
						'\'': '&#39;',
						'/': '&#x2F;'
					}[c];
				});
			},
			isEmpty = function (o)
			{
				for (var k in o)
				{
					return false;
				}
				return true;
			},
			format = function (string)
			{
				return string.replace(/%([difs])(?:\.(\d+))?/g, function (all, type, size)
				{
					if ((i + 1) < args.length)
					{
						i++;
					}

					switch (type)
					{
					case 's':
						return args[i] + '';
					case 'd':
					case 'i':
						return (args[i] / 1).toFixed(0);
					case 'f':
						if (size)
						{
							return (args[i] / 1).toFixed(size);
						}
						else
						{
							return args[i] / 1;
						}
					}
				});
			},

			args, i,
			pre_style = 'background:white;color:black;margin:0;padding:3px 0px 0px 3px;font-family:monospace;word-wrap:break-word;',

			generateHTML = function (args, sub)
			{

				switch (typeof args)
				{
				case 'undefined':
				case 'boolean':
				case 'function':
					return (window.console._SHOW_TYPES ? '(<span style="color:#00F">' + (typeof args) + '</span>) ' : '') + args.toString();
				case 'number':
					return (window.console._SHOW_TYPES ? '(<span style="color:#00F">number</span>) ' : '') + args + (window.console._SHOW_COOL_NUMBERS && args == args ? ' <span style="color:#777">(0x' + args.toString(16) + ', 0o' + args.toString(8) + ', 0b' + args.toString(2) + ')</span>' : '');
				case 'string':
					var tmp = format(args.toString());
					return (window.console._SHOW_TYPES ? '(<span style="color:#00F">string</span>) ' : '') + '"' + escapeHTML(tmp) + '"' + (window.console._SHOW_STRING_LENGTH ? ' <span style="color:#777">(length: ' + tmp.length + ')</span>' : '');
				case 'object':
					if (args == null)
					{
						return (window.console._SHOW_TYPES ? '(<span style="color:#00F">object</span>) ' : '') + 'null';
					}
					else if (args instanceof window.String)
					{
						return '[object String]: "' + escapeHTML(args) + '"' + (window.console._SHOW_STRING_LENGTH ? ' <span style="color:#777">(length: ' + args.length + ')</span>' : '');
					}
					else if (args instanceof window.RegExp)
					{
						return '[object RegExp]: ' + escapeHTML(args.toString());
					}
					else if (isEmpty(args))
					{
						var tmp;
						return window.Object.prototype.toString.call(args) + (
							args.valueOf ? ': ' + ((tmp = args.valueOf()) == args && (typeof tmp == 'object') ? ('length' in tmp ? '[]' : '{}') : tmp) : ''
						);
					}
					else
					{
						var html = '<div style="display:block;color:black;background:white;"><label style="cursor:pointer;"><span style="font-family:sans-serif;font-size:13px;">&#9654;</span><input type="checkbox" style="display:none;" onchange="this.parentNode.parentNode.getElementsByTagName(\'div\')[0].style.display=this.checked?\'block\':\'none\';this.parentNode.getElementsByTagName(\'span\')[0].innerText=this.checked?\'&#9660;\':\'&#9654;\';">' + Object.prototype.toString.call(args) + '</label><div style="width:100%;border:1px solid #999;border-right:0px;' + (sub ? 'border-bottom:0px;' : '') + 'padding-left:6px;box-sizing:border-box;display:none;">';

						for (var k in args)
						{
							html += '<pre style="' + pre_style + '"><span style="color:#F00;">' + k + '</span>: ' + generateHTML(args[k], true) + '</pre>';
						}

						return html + '</div></div>';
					}
				}

			},

			redirect_log = window.console.log = function ()
			{

				old_console_log.apply(window.console, arguments);

				if (window.console._RELAY_TO_DOC)
				{
					var div = window.document.createElement('div');

					args = arguments;

					div.style.border = '1px solid #333';
					div.style.background = '#666';
					div.className = 'console-log';
					div.innerHTML = '<span style="color:#CDCDCD;font-family:sans-serif;font-size:13px;">Console message at ' + (new Date()) + '</span><b onclick="this.parentNode.parentNode.removeChild(this.parentNode)" style="float:right;color:#CDCDCD;cursor:pointer;">&times;</b>';


					for (i = 0, l = args.length; i < l; i++)
					{
						div.innerHTML += '<pre style="' + pre_style + '">' + (window.console._USE_JSON ? escapeHTML(JSON.stringify(args[i])) : generateHTML(args[i])) + '</pre>';
					}

					if (window.console._RELAY_TO_DOC instanceof window.Element)
					{
						window.console._RELAY_TO_DOC.appendChild(div);
					}
					else
					{
						window.document.body.appendChild(div);
					}
				}

			};

		window.console._restore_old_log = function ()
		{
			window.console.log = old_console_log;
		};

		window.console._restore_redirect_log = function ()
		{
			window.console.log = redirect_log;
		};

		window.addEventListener('error', function (e)
		{

			var x = new Error(e.message);

			x.message = e.message;
			x.filename = e.filename;
			x.lineno = e.lineno;
			x.colno = e.colno;

			console.log(e.message, x);
		});

	})(Function('return this')());
