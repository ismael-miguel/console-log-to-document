(function(window, undefined){

	window.console._RELAY_TO_DOC = false;
	window.console._USE_JSON = false;
	window.console._SHOW_COOL_NUMBERS = false;
	window.console._SHOW_TYPES = false;
	window.console._SHOW_STRING_LENGTH = false;

	if (window.console.log.toString() != window.Math.log.toString() && window.console.warn)
	{
		window.console.warn('The current console.log() may not be the native method!');
	}

	var messages = [],
		times = {},
		icons = {
			log:'',
			error:'<span style="background:red;border-radius:50%;display:inline-block;width:13px;height:13px;font-size:12px;text-align:center;color:#FFF;border:1px solid #000;">&times;</span> ',
			info:'<span style="background:blue;border-radius:50%;display:inline-block;width:13px;height:13px;font-size:12px;font-weight:bold;text-align:center;color:#FFF;border:1px solid #000;">i</span> ',
			warn:'<span style="background:orange;border-radius:50%;display:inline-block;width:13px;height:13px;font-size:12px;font-weight:bold;text-align:center;color:#000;border:1px solid #000;">!</span> ',
			time:'<span style="background:#FFF;border-radius:50%;display:inline-block;width:14px;height:14px;font-size:8px;line-height:14px;font-family:sans-serif;text-align:center;color:red;border:1px solid #000;position:relative;top:-2px;">v</span> ',
			timeEnd:'<span style="background:#FFF;border-radius:50%;display:inline-block;width:14px;height:14px;font-size:8px;line-height:14px;font-family:sans-serif;text-align:center;color:green;border:1px solid #000;position:relative;top:-2px;">v</span> '
		},
		old_console = {
			log:window.console.log,
			error:window.console.error,
			info:window.console.info,
			warn:window.console.warn,
			time:window.console.time,
			timeEnd:window.console.timeEnd,
			clear:window.console.clear
		},
		escapeHTML = function(string){
			return string.replace(/[&<>"'\/]/g, function(c){
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
		isEmpty = function(o){
			
			for (var k in o)
			{
				return false;
			}
			return true;
		},
		format = function(string){
			
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
		pre_style = 'border:none;background:white;color:black;margin:0;padding:3px 0px 0px 3px;font-family:monospace;word-wrap:break-word;',

		generateHTML = function(args, sub, recursion){

			switch (typeof args)
			{
			case 'undefined':
			case 'boolean':
			case 'function':
				return (window.console._SHOW_TYPES ? '(<span style="color:#00F">' + (typeof args) + '</span>) ' : '') + escapeHTML(args ? args.toString() : 'undefined');
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
						if(recursion)
						{
							html += '<pre style="' + pre_style + '"><span style="color:#F00;">' + k + '</span>: ' + generateHTML(args[k], true, !(args instanceof Element) && args.self!=args) + '</pre>';
						}
						else
						{
							if((typeof args[k])=='object')
							{
								html += '<pre style="' + pre_style + '"><span style="color:#F00;">' + k + '</span>: ' + (args[k]||'null').toString() + '</pre>';
							}
							else
							{
								html += '<pre style="' + pre_style + '"><span style="color:#F00;">' + k + '</span>: ' + generateHTML(args[k], true, false) + '</pre>';
							}
							
						}
					}

					return html + '</div></div>';
				}
			}

		},

		logger = function(icon, args){
			
			var skip = false;
			
			if ( icon == 'time' )
			{
				if(old_console.time)
				{
					old_console.time.apply(window.console, [args[0]]);
				}
				times[ args[0] + '' ] = new Date();
				args[0] += ': timer started';
				skip = true;
			}
			else if ( icon == 'timeEnd' )
			{
				var timer = args[0] + '';
				if( times[ timer ] )
				{
					if(old_console.timeEnd)
					{
						old_console.timeEnd.apply(window.console, [ timer ]);
					}
					args[0] += ': timer took ' + ( (new Date()) - times[ timer ] ) + 'ms';
					delete times[ timer ];
					skip = true;
				}
				else
				{
					icon = 'error';
					args[0] += ': unknown timer (removal attempted)';
					
					if(old_console.timeEnd)
					{
						try
						{
							delete times[ timer ];
							old_console.timeEnd.apply(window.console, [ timer ]);
						}
						catch(e){}
					}
				}
			}

			//logs into the desired function or into console.log
			if(!skip)
			{
				( old_console[icon] || old_console.log ).apply(window.console, window.Array.prototype.slice.call(args));
			}

			if (window.console._RELAY_TO_DOC)
			{
				
				var div = window.document.createElement('div');

				messages[messages.length] = div;

				div.style.border = '1px solid #333';
				div.style.background = '#666';
				div.className = 'console-log';
				div.innerHTML = '<span style="color:#CDCDCD;font-family:sans-serif;font-size:13px;">'+icons[icon]+'Console message at ' + (new Date()) + '</span><b onclick="this.parentNode.parentNode.removeChild(this.parentNode)" style="float:right;color:#CDCDCD;cursor:pointer;">&times;</b>';


				for (i = 0, l = args.length; i < l; i++)
				{
					div.innerHTML += '<pre style="' + pre_style + '">' + (window.console._USE_JSON ? escapeHTML(JSON.stringify(args[i])) : generateHTML(args[i],false,true)) + '</pre>';
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
		
	window.console.log = function(){
		logger('log', arguments);
	};
	window.console.error = function(){
		logger('error',arguments);
	};
	window.console.info = function(){
		logger('info', arguments);
	};
	window.console.warn = function(){
		logger('warn', arguments);
	};
	window.console.time = function(){
		logger('time', arguments);
	};
	window.console.timeEnd = function(){
		logger('timeEnd', arguments);
	};
	
	window.console.clear = function(){
		old_console.clear.apply(window.console);
		
		for(var k in messages)
		{
			if(messages[k] && messages[k].parentNode)
			{
				messages[k].parentNode.removeChild(messages[k]);
				messages[k] = null;
			}
		}
		
		messages = [];
	};

	window.addEventListener('error', function(e){
		var x = new Error(e.message);

		x.message = e.message;
		x.filename = e.filename;
		x.lineno = e.lineno;
		x.colno = e.colno;

		logger('error',[e.message, x]);
	});
    
    console._restore_old_method = function(method){
        if( old_console[method] )
		{
			window.console[method] = old_console[method];
		}
    };
    console._restore_relay_method = function(method){
        if( old_console[method] && window.console[method] == old_console[method] )
		{
			window.console[method] = function(){
				logger(method, arguments);
			};
		}
    };

})(Function('return this')());

