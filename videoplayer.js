
let config = {
	'class':		'videoplayer',
	'controls':	['play','time1','slider','time2','volume','vol_slider','full'],
	'cookie':		'videoplayer_',
	'hide':			2000,
	'interval':	100,
};

/**/

let page = {
	'volume':		[],
	'elements':	{},
};

let menu_items = {
	'play':	['Play','Pause'],
	'mute':	['Mute','Unmute'],
	'loop':	['Loop','Loop Off'],
	'full':	['Fullscreen','Exit Fullscreen'],
};

let help = [
	'Pause: Space',
	'Fullscreen: F',
	'Mute: M',
	'Volume: Up / Down',
	'5s jump: &laquo; &raquo;',
	'Speed: Shift &amp; , .',
];

let speeds = [0.25,0.5,0.75,1,1.25,1.5,1.75,2];

let mouse = [];
let downkeys = {};

page_load(load);

function load() {

	// Quick reference for control element IDs
	for (let x = 0; x < config.controls.length; x++) {
		page.elements[config.controls[x]] = x;
	}

	let div_main = 'div.' +  config.class;
	let css_rules = [

		':root { --' + config.class +'_icons: url("data:image/png;base64,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"); }',

		'@font-face { font-family: "fixed"; src: url("inconsolata-regular.ttf"); }',

		div_main + ' { z-index: 0; position: relative; overflow: visible; min-width: 350px; font-family: fixed, monospace; user-select: none; }',

		div_main + ' > video { width: 100%; height: 100%; margin: 0; padding: 0; border: 0; outline: 0; }',

		div_main + ' > div.overlay { z-index: 1; position: absolute; top: 0; right: 0; bottom: 0; left: 0; width: 100px; height: 100px; margin: auto; border-radius: 100px; opacity: 0; filter: opacity(0%); text-align: center; color: #FFFFFF; background: var(--' + config.class +'_icons) 0 0 no-repeat #666666; pointer-events: none; transition: opacity 0.1s linear 0s; }',
		div_main + ' > div.overlay.visible { opacity: 0.75; filter: opacity(75%); transition-delay: 0s; }',

		div_main + ' > div.controls { display: flex; flex-flow: row; position: absolute; bottom: 0; left: 0; width: 100%; height: 30px; font-size: 12px; color: #FFFFFF; background-color: #333333; transition: all 0.1s linear 0s; }',
		div_main + '.hidden > div.controls { opacity: 0; filter: opacity(0%); transition-duration: 0.5s; }',

		div_main + ' > div.controls > div { position: relative; flex: 0 0 auto; width: 30px; height: 30px; }',
		div_main + ' > div.controls > div.play { background: var(--' + config.class +'_icons) 0 -100px no-repeat; cursor: pointer; }',
		div_main + ' > div.controls > div.play.pause { background-position: -30px -100px; }',

		div_main + ' > div.controls > div.time1 { width: auto; padding-top: 0.65em; background: none; }',
		div_main + ' > div.controls > div.time2 { width: auto; padding-top: 0.65em; background: none; }',
		div_main + ' > div.controls > div.slider { flex-grow: 1; margin: 0 0.5em; height: 30px; border: 2px solid #222222; border-width: 0 2px; background-color: #555555; cursor: pointer; }',
		div_main + ' > div.controls > div.slider > span { display: block; position: absolute; top: 0; left: 2px; width: 0; height: 30px; background-color: #999999; transition: width 0.1s linear 0s; content: ""; pointer-events: none; }',
		div_main + ' > div.controls > div.slider > div { display: none; position: absolute; top: -25px; left: 0; padding: 1px 5px; border: 1px solid #666666; border-radius: 5px; background-color: #333333; }',
		div_main + ' > div.controls > div.slider:hover > div { display: block; }',

		div_main + ' > div.controls > div.volume { background: var(--' + config.class +'_icons) -60px -100px no-repeat; cursor: pointer; }',
		div_main + ' > div.controls > div.volume.mute { background-position: -90px -100px; }',
		div_main + ' > div.controls > div.vol_slider { top: 10px; margin: 0 1em 0 0.5em; width: 70px; height: 10px; border: 2px solid #222222; border-width: 0 2px; border-radius: 2em; background-color: #222222; cursor: grab; }',
		div_main + ' > div.controls > div.vol_slider > span { display: block; position: absolute; top: -0.5em; left: -0.5em; width: 100%; height: 10px; border: 0.5em solid #333333; border-radius: 2em;  background-color: #999999; transition: width 0.1s linear 0s; content: ""; pointer-events: none; }',
		div_main + ' > div.controls > div.vol_slider > span:before { position: absolute; top: -3px; right: -8px; width: 16px; height: 16px; border-radius: 100%; background-color: #EEEEEE; content: ""; }',

		div_main + ' > div.controls > div.full { background: var(--' + config.class +'_icons) -120px -100px no-repeat; cursor: pointer; }',
		div_main + ':fullscreen > div.controls > div.full { background-position: -150px -100px; }',

		div_main + ' > ul { display: none; position: absolute; top: 30px; left: 30px; list-style-type: none; margin: 0; padding: 0.25em; background-color: rgba(51,51,51,0.75); }',
		div_main + ' > ul li { position: relative; margin: 0; padding: 0.25em 1em 0.25em 1.75em; text-align: left; color: #FFFFFF; cursor: pointer; }',
		div_main + ' > ul li:before { position: absolute; top: 9px; left: 0.5em; width: 0.5em; height: 0.5em; border: 1px solid #FFFFFF; border-radius: 1em; background: none; content: ""; }',
		div_main + ' > ul li.on:before { background-color: #FFFFFF; }',
		div_main + ' > ul li:hover { background-color: #666666; }',

		div_main + ' > ul.show { display: block; }',

		div_main + ' > div.title { position: absolute; top: 0; left: 0; width: calc(100% - 1em); padding: 0.5em; text-align: left; font-size: 16px; font-weight: bold; color: #FFFFFF; background-color: rgba(51,51,51,0.5); transition: all 0.1s linear 0s; }',
		div_main + '.hidden > div.title { opacity: 0; filter: opacity(0%); transition-duration: 0.5s; }',

		div_main + ' > div.help { position: absolute; top: 1px; right: 1px; width: 30px; height: 30px; font-size: 14px; background: var(--' + config.class +'_icons) -180px -100px no-repeat; cursor: help; opacity: 1; filter: opacity:(100%); transition: all 0.1s linear 0s; }',
		div_main + ' > div.help > ul { display: none; position: absolute; top: 32px; right: 0; list-style-type: none; width: 150px; margin: 0; padding: 0; background-color: rgba(51,51,51,0.5); }',
		div_main + ' > div.help > ul > li { margin: 0; padding: 0.25em 0.5em; text-align: left; color: #FFFFFF; }',

		div_main + '.hidden > div.help { opacity: 0; filter: opacity(0%); }',
		div_main + ' > div.help:hover > ul { display: block; }',

		'body.nocursor ' + div_main + ' > video { cursor: none; }',

		div_main + ':fullscreen > video { width: 100%; height: 100%; }',
		div_main + ':fullscreen > ul li[data-do=full]:before { background-color: #FFFFFF; }',
	];

	let css = document.styleSheets[0];
	for (let x = 0; x < css_rules.length; x++) { css.insertRule(css_rules[x],css.cssRules.length); }

	// Global events
	document.addEventListener('mousedown',	() => { body_mouse(); });
	document.addEventListener('keydown',		(e) => { keydown(e); });
	document.addEventListener('keyup',			(e) => { keyup(e); });

	// Per-player routines
	let players = document.querySelectorAll('div.' + config.class);
	for (let x = 0; x < players.length; x++) {
		let video = players[x].childNodes[0];

		// Set container size to match video ratio
		let player_size = players[x].getBoundingClientRect();
		if (video.videoWidth > video.videoHeight) { // Landscape video
			players[x].style.height = video.videoHeight * (player_size.width / video.videoWidth) + 'px';
		} else { // Vertical or square video
			players[x].style.width = video.videoWidth * (player_size.height / video.videoHeight) + 'px';
		}

		let cookie_vol = parseFloat(do_cookie('get','volume'));
		if (cookie_vol) { video.volume = cookie_vol; }
		page['volume'][x] = video.volume;

		mouse[x] = {
			'down':		false,
			'clock':	false,
			'timer':	0,
			'xpos':		0,
			'ypos':		0,
		};

		players[x].setAttribute('tabindex',100 + x);
		players[x].removeAttribute('controls');

		// Define player-level listeners
		players[x].addEventListener('mousedown',	(e) => { mousedown(e); });
		players[x].addEventListener('mouseup',		(e) => { mouseup(e); });
		players[x].addEventListener('mousemove',	(e) => { mousemove(e); });
		players[x].addEventListener('mouseleave',	(e) => { mouseleave(e); });
		players[x].addEventListener('dblclick',		(e) => { dblclick(e); });
		players[x].addEventListener('contextmenu',(e) => { contextmenu(e); });

		// Information overlay (play, pause etc)
		let overlay = document.createElement('DIV');
		overlay.className = 'overlay';
		overlay.innerHTML = '';
		players[x].appendChild(overlay);

		// Controls bar
		let controls = document.createElement('DIV');
		controls.className = 'controls';

		for (let x = 0; x < config.controls.length; x++) {

			let control = document.createElement('DIV');
			control.className = config.controls[x];

			if (config.controls[x] === 'play') {
				control.setAttribute('title','Play / Pause');
			}
			if (config.controls[x] === 'time1') {
				control.innerHTML = timeify(0,video.duration);
			}
			if (config.controls[x] === 'time2') {
				control.innerHTML = timeify(video.duration);
			}
			if (config.controls[x] === 'slider') {
				control.appendChild(document.createElement('SPAN'));
				let div = document.createElement('DIV');
				div.innerHTML = timeify(0,video.duration);
				control.appendChild(div);
			}
			if (config.controls[x] === 'vol_slider') {
				control.appendChild(document.createElement('SPAN'));
			}
			if (config.controls[x] === 'full') {
				control.setAttribute('title','Toggle Fullscreen');
			}
			controls.appendChild(control);

		}
		players[x].appendChild(controls);

		// Context menu
		let menu = document.createElement('UL');
		for (let key in menu_items) { if (menu_items.hasOwnProperty(key)) {
			let li = document.createElement('LI');
			li.setAttribute('data-do',key);
			li.innerHTML = menu_items[key][0];
			menu.appendChild(li);
		} }
		if (menu.childNodes.length) { players[x].appendChild(menu); }

		// Video Title if specified
		let video_title = players[x].getAttribute('data-title');
		if (video_title) {
			let title = document.createElement('DIV');
			title.className = 'title';
			title.innerHTML = video_title;
			players[x].appendChild(title);
		}

		// Help icon, if specified
		if (players[x].getAttribute('data-help') === 'true') {
			let icon_help = document.createElement('DIV');
			icon_help.className = 'help';

			let help_list = document.createElement('UL');
			for (let y = 0; y < help.length; y++) {
				let li = document.createElement('LI');
				li.innerHTML = help[y];
				help_list.appendChild(li);
			}
			icon_help.appendChild(help_list);

			players[x].appendChild(icon_help);
		}

		// Give focus if specified
		if (players[x].getAttribute('data-autofocus') === 'true') {
			players[x].childNodes[0].focus();
		}

		// Autoplay if specified
		if (players[x].getAttribute('data-autoplay') === 'true') {
			players[x].childNodes[0].play().then().catch(() => {
				set_volume(players[x],0);
				players[x].childNodes[0].play().then();
			});
		}

		// Set background if specified
		if (players[x].getAttribute('data-bgcolor')) {
			players[x].style.backgroundColor = players[x].getAttribute('data-bgcolor');
		}

		// Update timers
		setInterval(() => {

			update_menu(players[x]);
			players[x].childNodes[2].childNodes[page.elements['time1']].innerHTML = timeify(video.currentTime,video.duration);

			let slider = players[x].childNodes[2].childNodes[page.elements['slider']];
			let size = slider.getBoundingClientRect();
			slider.childNodes[0].style.width = ((size.width - 8) / video.duration) * video.currentTime + 'px';

			let volume = players[x].childNodes[2].childNodes[page.elements['volume']];
			if (video.volume) {
				volume.classList.remove('mute');
			} else {
				volume.classList.add('mute');
			}

			let vol_slider = players[x].childNodes[2].childNodes[page.elements['vol_slider']];
			size = vol_slider.getBoundingClientRect();
			vol_slider.childNodes[0].style.width = ((size.width - 4) * video.volume) + 'px';

			if (video.paused && video.currentTime === video.duration) {
				set_controls(players[x],true);
				document.body.classList.remove('nocursor');
			}

		},config.interval);

	}

} // function load() {

////////////////////////
//   Mouse functions  //
////////////////////////

function body_mouse() {
	let players = document.querySelectorAll('div.' + config.class);
	for (let x = 0; x < players.length; x++) {
		hide_menu(players[x]);
	}
}

function mousedown(e) {
	let target = e.target;
	let player = get_player(target);
	let video = player.childNodes[0];
	switch (e.which) {
		case 1: // Left click

			mouse.down = true;
			if (player) {

				if (target === video) { hide_menu(player); }
				if (target === video || in_array('play',target.classList)) { toggle_play(e); }
				if (in_array('slider',target.classList)) { set_time(player,e.pageX); }
				if (in_array('vol_slider',target.classList)) { set_volume(player,e.pageX); }
				if (in_array('volume',target.classList)) { toggle_mute(player); }
				if (in_array('full',target.classList)) { toggle_fullscreen(player); }

				if (target.nodeName === 'LI') {
					switch (target.getAttribute('data-do')) {
						case 'play':
							toggle_play(e);
						break;
						case 'mute':
							toggle_mute(player);
						break;
						case 'loop':
							video.loop = !video.loop;
						break;
						case 'full':
							toggle_fullscreen(player);
						break;
					}
					hide_menu(player);
				}

			}

		break;
	}
}

function contextmenu(e) {
	let target = e.target;
	let player = get_player(target);
	let video = player.childNodes[0];

	if (player && target === video) {
		e.preventDefault();
		show_menu(e);
	}
}

function mouseup(e) {
	switch (e.which) {
		case 1: // Left click
			 mouse.down = false;
		break;
	}
}

function mousemove(e) {
	let target = e.target;
	let player = get_player(target);
	let video = player.childNodes[0];
	if (mouse.down && player && target.className === 'slider') { set_time(player,e.pageX); }
	if (mouse.down && player && target.className === 'vol_slider') { set_volume(player,e.pageX); }
	document.body.classList.remove('nocursor');

	if (player) {
		let cont = false;
		let x;
		let players = document.querySelectorAll('div.' + config.class);
		for (x = 0; x < players.length; x++) {
			if (players[x] === player) { cont = true; break; }
		}
		if (cont) {

			// Do controls timeout
			if (mouse[x].xpos !== e.pageX || mouse[x].ypos !== e.pageY) {
				mouse[x].xpos = e.pageX;
				mouse[x].ypos = e.pageY;
				do_timer(e,'start');
			}

			// Update slider hover time
			if (in_array('slider',target.classList)) {
				let size = target.childNodes[1].getBoundingClientRect();
				let data = set_time(player,e.pageX,true);
				target.childNodes[1].style.left = data[0] - (size.width / 2) + 'px';
				target.childNodes[1].innerHTML = timeify(data[1],video.duration);
			}

		}
	}
}

function mouseleave(e) {
	let target = e.target;
	let player = get_player(target);
	let video = player.childNodes[0];
	if (player && !video.paused) { do_timer(e,'reset',false); }
}

function dblclick(e) {
	let target = e.target;
	let player = get_player(target);
	let video = player.childNodes[0];
	switch (e.which) {
		case 1: // Left click
			if (player && target === video) { toggle_fullscreen(player); }
		break;
	}
}

////////////////////////
// Keyboard functions //
////////////////////////

function keydown(e) {
	let target = e.target;
	let keyid = e.which;
	let player = get_player(target);
	downkeys[keyid] = true;

	if (player) {

		let video = player.childNodes[0];
		let show;
		let current = video.currentTime;
		if (in_array(keyid,[27,32,37,38,39,40,70,77,188,190])) {
			e.preventDefault();
			switch (keyid) {
				case 27: // Esc
					hide_menu(player);
				break;
				case 32: // Space
					toggle_play(e);
				break;
				case 37: // Arrow left
					video.currentTime = (current ? current - 5 : 0);
					show = 'skip_left';
				break;
				case 39: // Arrow right
					video.currentTime = (current < (video.duration - 5) ? current + 5 : video.duration);
					show = 'skip_right';
				break;
				case 38: // Arrow up
					video.volume = (video.volume < 0.9 ? video.volume + 0.1 : 1);
					show = (video.volume < 1 ? 'vol_up' : 'vol_max');
				break;
				case 40: // Arrow down
					video.volume = (video.volume > 0.1 ? video.volume - 0.1 : 0);
					show = (video.volume ? 'vol_down' : 'mute');
				break;
				case 70: // F
					toggle_fullscreen(player);
				break;
				case 77: // M
					toggle_mute(player);
				break;
				case 188: case 190: // < and >
					if (downkeys[16]) {
						let index = -1;
						for (let x = 0; x < speeds.length; x++) {
							if (parseFloat(video.playbackRate) === speeds[x]) {
								index = x;
								break;
							}
						}
						if (index > -1) {
							index += (keyid === 188 ? -1 : 1);
							if (index < 0) {
								index = 0;
							} else if (index === speeds.length) {
								index = speeds.length - 1;
							}
							video.playbackRate = speeds[index];
							overlay(speeds[index] + 'x',player);
						}
					}
				break;
			}
			video.volume = video.volume.toFixed(2);
			if (show) { overlay(show,player); }
		}
	} // if (player) {

}

function keyup(e) {
	let keyid = e.which;
	downkeys[keyid] = false;
}

function overlay(choice,player) {
	let overlay = player.childNodes[1];
	let value = overlay.style.getPropertyValue('background-position');

	let choices = [
		'play','pause','vol_up','vol_down','mute','vol_max','skip_left','skip_right',
		'0.25x','0.5x','0.75x','1x','1.25x','1.5x','1.75x','2x'
	];
	for (let x = 0; x < choices.length; x++) {
		if (choice === choices[x]) {
			value = (x * -100) + 'px  0px';
		}
	}

	overlay.classList.add('visible');
	overlay.style.backgroundPosition = value;
	setTimeout(() => { overlay.classList.remove('visible'); },250);

}

////////////////////////
//  Player functions  //
////////////////////////

function toggle_play(e) {
	let target = e.target;
	let player = get_player(target);
	let video = player.childNodes[0];
	if (video.paused) {
		video.play();
		overlay('play',player);
		player.childNodes[2].childNodes[page.elements['play']].style.backgroundPosition = '-30px -100px';
		do_timer(e,'start');
	} else {
		video.pause();
		overlay('pause',player);
		player.childNodes[2].childNodes[page.elements['play']].style.backgroundPosition = '0 -100px';
		set_controls(player,true);
		do_timer(e,'reset');
	}
}

function toggle_fullscreen(player) {
	if (!document['fullscreenElement']) { // Done in bracket notation to prevent validation errors
		player.requestFullscreen().then();
	} else {
		document.exitFullscreen().then();
	}
}

function toggle_mute(player) {
	let video = player.childNodes[0];
	video.volume = (video.volume ? 0 : page.volume[get_player_id(player)]);
}

function get_player(elem) {
	// Go back up the DOM tree until we find a player
	if (elem.nodeName !== 'HTML') {
		while (elem && elem.nodeName !== 'HTML' && !is_player(elem)) { elem = elem.parentNode; }
	}
	return (elem && is_player(elem) ? elem : false);
}

function is_player(elem) {
	return (elem && elem.nodeName === 'DIV' && in_array(config.class,elem.classList));
}

function set_time(player,x_pos,visual = false) {
 	let video = player.childNodes[0];
	let size = player.childNodes[2].childNodes[page.elements['slider']].getBoundingClientRect();
	let time = (video.duration / 100) * (((x_pos - size.x) / size.width) * 100);
	if (visual) { return [(x_pos - size.x),time]; } else {
		video.currentTime = (video.duration / 100) * (((x_pos - size.x) / size.width) * 100);
	}
}

function set_volume(player,x_pos) {
 	let video = player.childNodes[0];
	let size = player.childNodes[2].childNodes[page.elements['vol_slider']].getBoundingClientRect();
	let vol = ((x_pos - size.x) - 8) / (size.width - 16);
	video.volume = (vol < 0 ? 0 : (vol > 1 ? 1 : vol));
	do_cookie('set','volume',video.volume);
}

function set_controls(player,show) {
 	if (show) { player.classList.remove('hidden'); } else { player.classList.add('hidden'); }
}

////////////////////////
//  Utility functions //
////////////////////////

function page_load(item) {
	let load = window.onload;
	if (typeof load == 'function') {
		window.onload = function() { if (load) { load(); } item(); };
	} else {
		window.onload = item;
	}
}

function in_array(needle,haystack,separator = ' ') {
	// Important: Leave separator default as space; allows for use checking classes
	let output = false;
	if (!Array.isArray(haystack)) {
		haystack = haystack.toString().split(separator);
	}
	for (let x = 0; x < haystack.length; x++) {
		if (haystack[x] === needle) { output = true; break; }
	}
	return output;
}

function do_cookie(act,name,value = '') {
	name = config.cookie + name;
	let result = '';
	switch (act) {
		case 'set':
			let d = new Date(); d.setTime(d.getTime() + (365 * 24 * 3600 * 1000));
			document.cookie = name + '=' + value + '; expires=' + d.toUTCString() + '; path=/; SameSite=None; Secure';
			break;
		case 'get':
			let data = document.cookie.split('; ');
			for (let x = 0; x < data.length; x++) {
				let cookie = data[x].split('=');
				if (cookie[0] === name) { result = cookie[1]; }
			}
			break;
	}
	return result;
}

function do_timer(e,act,controls = true) {
	let target = e.target;
	let player = get_player(target);
	let video = player.childNodes[0];

	let cont = false;
	let x;
	let players = document.querySelectorAll('div.' + config.class);
	for (x = 0; x < players.length; x++) {
		if (players[x] === player) { cont = true; break; }
	}

	if (cont) { switch (act) {
		case 'start':
			if (!video.paused) {

				// Detect whether timer is running by using mouse[x].time
				if (mouse[x].clock) {
					mouse[x].timer = 0;
					set_controls(player,true);
				} else {
					mouse[x].clock = setInterval(() => {
						mouse[x].timer += config.interval;
						if (mouse[x].timer >= config.hide) {
							do_timer(e,'reset');
							set_controls(player,false);
							document.body.classList.add('nocursor');
						}
					},config.interval);
				}

			}
		break;
		case 'reset':
			mouse[x].timer = 0;
			clearInterval(mouse[x].clock);
			mouse[x].clock = false;
			set_controls(player,controls);
			document.body.classList.remove('nocursor');
			break;
	} }
}

function timeify(val,max = 0) {
	max = (max ? max : val);
	let date = new Date(val * 1000).toISOString(); // 1970-01-01T01:32:11.989Z
	let result;
	if (max < 3600) {
		result = date.substr(14,5);
	} else if (max < (3600 * 24)) {
		result = date.substr(11,8);
	} else {
		result = date.substr(8,2) + 'd' + date.substr(11,8);
	}
	return result;
}

function get_player_id(player) {
	let players = document.querySelectorAll('div.' + config.class);
	let index;
	for (let x = 0; x < players.length; x++) {
		if (players[x] === player) { index = x; break; }
	}
	return index;
}

function show_menu(e) {
	let target = e.target;
	let player = get_player(target);
	let menu = player.childNodes[3];
	let container = player.getBoundingClientRect();

	menu.classList.add('show');
	menu.style.top = (e.pageY - container.top) + 'px';
	menu.style.left = (e.pageX - container.left) + 'px';
}

function hide_menu(player) {
	let menu = player.childNodes[3];
	menu.classList.remove('show');
}

function update_menu(player) {
	let video = player.childNodes[0];
	let menu = player.childNodes[3];

	for (let x = 0; x < menu.childNodes.length; x++) {
		let item = menu.childNodes[x];
		switch (item.getAttribute('data-do')) {
			case 'play':
				if (video.paused) {
					item.innerHTML = menu_items.play[0];
					item.classList.remove('on');
				} else {
					item.innerHTML = menu_items.play[1];
					item.classList.add('on');
				}
			break;
			case 'mute':
				if (video.volume) {
					item.innerHTML = menu_items.mute[0];
					item.classList.remove('on');
				} else {
					item.innerHTML = menu_items.mute[1];
					item.classList.add('on');
				}
			break;
			case 'loop':
				if (video.loop) {
					item.innerHTML = menu_items.loop[1];
					item.classList.add('on');
				} else {
					item.innerHTML = menu_items.loop[0];
					item.classList.remove('on');
				}
			break;
			case 'full':
				item.innerHTML = menu_items.full[(document['fullscreenElement'] ? 1 : 0)];
			break;
		}
	}
}
