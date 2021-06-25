
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
	'play':	'Play',
	'mute':	'Mute',
	'loop':	'Loop',
	'full':	'Fullscreen',
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
let opts = [];

page_load(load);

function load() {

	// Quick reference for control element IDs
	for (let x = 0; x < config.controls.length; x++) {
		page.elements[config.controls[x]] = x;
	}

	let div_main = 'div.' +  config.class;
	let css_rules = [

		div_main + ' { --' + config.class +'_icons: url("icons.png")',
		'@font-face { font-family: "fixed"; src: url("fixed.ttf"); }',

		div_main + ' { z-index: 0; position: relative; overflow: visible; min-width: 350px; font-family: fixed_embed, fixed, monospace; user-select: none; }',

		div_main + ' > video { width: 100%; height: 100%; margin: 0; padding: 0; border: 0; outline: 0; }',

		// Main overlay
		//div_main + ' > div.overlay { z-index: 1; position: absolute; top: 0; right: 0; bottom: 0; left: 0; width: 100px; height: 100px; margin: auto; border-radius: 100px; opacity: 0; filter: opacity(0%); text-align: center; color: #FFFFFF; background: var(--' + config.class +'_icons) 0 0 no-repeat #666666; pointer-events: none; transition: opacity 0.1s linear 0s; }',
		//div_main + ' > div.overlay.visible { opacity: 0.75; filter: opacity(75%); transition-duration: 0s; }',

		div_main + ' > div.overlay { z-index: 1; position: absolute; top: 0; right: 0; bottom: 0; left: 0; width: 100px; height: 100px; margin: auto; pointer-events: none; }',
		div_main + ' > div.overlay.visible { }',
		div_main + ' > div.overlay.visible.hiding { }',

		div_main + ' > div.overlay > span { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; filter: opacity(0%); transition: all 0.25s linear; }',
		div_main + ' > div.overlay > span:nth-of-type(1) { width: 0; height: 0; top: 50%; left: 50%; border-radius: 100px; background-color: #333333; }',
		div_main + ' > div.overlay > span:nth-of-type(2) { background: var(--' + config.class +'_icons) 0 0 no-repeat; transition-property: opacity; }',

		div_main + ' > div.overlay.visible > span:nth-of-type(1) { width: 100%; height: 100%; top: 0; left: 0; opacity: 1; filter: opacity(100%); }',
		div_main + ' > div.overlay.visible > span:nth-of-type(2) { opacity: 1; filter: opacity(100%); }',

		div_main + ' > div.overlay.visible.hiding > span { opacity: 0; filter: opacity(0%); }',
		div_main + ' > div.overlay.visible.hiding > span:nth-of-type(1) { width: 150px; height: 150px; top: -25%; left: -25%; }',
		div_main + ' > div.overlay.visible.hiding > span:nth-of-type(2) { }',

		// Controls
		div_main + ' > div.controls { display: flex; flex-flow: row; position: absolute; bottom: 0; left: 0; width: 100%; height: 30px; font-size: 12px; color: #FFFFFF; background-color: #333333; transition: all 0.25s linear 0s; }',
		div_main + '.hidden > div.controls { opacity: 0; filter: opacity(0%); }',

		div_main + ' > div.controls > div { position: relative; flex: 0 0 auto; width: 30px; height: 30px; }',
		div_main + ' > div.controls > div.play { background: var(--' + config.class +'_icons) 0 -100px no-repeat; cursor: pointer; }',
		div_main + ' > div.controls > div.play.pause { background-position: -30px -100px; }',

		div_main + ' > div.controls > div.time1 { width: auto; padding-top: 0.65em; background: none; }',
		div_main + ' > div.controls > div.time2 { width: auto; padding-top: 0.65em; background: none; }',
		div_main + ' > div.controls > div.slider { flex-grow: 1; margin: 0 0.5em; height: 30px; border: 2px solid #222222; border-width: 0 2px; background-color: #444444; cursor: pointer; }',
		div_main + ' > div.controls > div.slider > div:nth-of-type(1) { display: block; position: absolute; top: 0; left: 2px; width: 0; height: 30px; background-color: #555555; transition: width 0.1s linear 0s; content: ""; pointer-events: none; }',
		div_main + ' > div.controls > div.slider > span { display: block; position: absolute; top: 0; left: 2px; width: 0; height: 30px; background-color: #999999; transition: width 0.1s linear 0s; content: ""; pointer-events: none; }',
		div_main + ' > div.controls > div.slider > div:nth-of-type(2) { display: none; position: absolute; top: -25px; left: 0; padding: 1px 5px; border: 1px solid #666666; border-radius: 5px; background-color: #333333; }',
		div_main + ' > div.controls > div.slider:hover > div:nth-of-type(2) { display: block; }',

		// Volume controls
		div_main + ' > div.controls > div.volume { background: var(--' + config.class +'_icons) -60px -100px no-repeat; cursor: pointer; }',
		div_main + ' > div.controls > div.volume.mute { background-position: -90px -100px; }',
		div_main + ' > div.controls > div.vol_slider { top: 10px; margin: 0 1em 0 0.5em; width: 70px; height: 10px; border: 2px solid #222222; border-width: 0 2px; border-radius: 2em; background-color: #222222; cursor: pointer; }',
		div_main + ' > div.controls > div.vol_slider > span { display: block; position: absolute; top: -0.5em; left: -0.5em; width: 100%; height: 10px; border: 0.5em solid #333333; border-radius: 2em;  background-color: #999999; transition: width 0.1s linear 0s; content: ""; pointer-events: none; }',
		div_main + ' > div.controls > div.vol_slider > span > div { position: absolute; top: -3px; right: -8px; width: 16px; height: 16px; border-radius: 100%; background-color: #EEEEEE; content: ""; pointer-events: auto; }',

		// Fullscreen control
		div_main + ' > div.controls > div.full { background: var(--' + config.class +'_icons) -120px -100px no-repeat; cursor: pointer; }',
		div_main + ':fullscreen > div.controls > div.full { background-position: -150px -100px; }',

		// Context menu
		div_main + ' > ul { display: none; position: absolute; top: 30px; left: 30px; list-style-type: none; margin: 0; padding: 0.25em; background-color: rgba(51,51,51,0.75); }',
		div_main + ' > ul li { position: relative; margin: 0; padding: 0.25em 1em 0.25em 1.75em; text-align: left; color: #FFFFFF; cursor: pointer; }',
		div_main + ' > ul li:before { position: absolute; top: -2px; left: 0; width: 30px; height: 30px; background: var(--' + config.class +'_icons) -210px -100px; content: none; }',
		div_main + ' > ul li.on:before { content: ""; }',
		div_main + ' > ul li:hover { background-color: #666666; }',

		div_main + ' > ul.show { display: block; }',

		// Video title
		div_main + ' > div.title { position: absolute; top: 0; left: 0; width: calc(100% - 1em); padding: 0.5em; text-align: left; font-size: 16px; font-weight: bold; color: #FFFFFF; background-color: rgba(51,51,51,0.5); transition: all 0.1s linear 0s; }',
		div_main + '.hidden > div.title { opacity: 0; filter: opacity(0%); transition-duration: 0.5s; }',

		// Help icon
		div_main + ' > div.help { position: absolute; top: 1px; right: 1px; width: 30px; height: 30px; font-size: 14px; background: var(--' + config.class +'_icons) -180px -100px no-repeat; cursor: help; opacity: 1; filter: opacity:(100%); transition: all 0.1s linear 0s; }',
		div_main + ' > div.help > ul { display: none; position: absolute; top: 32px; right: 0; list-style-type: none; width: 150px; margin: 0; padding: 0; background-color: rgba(51,51,51,0.5); }',
		div_main + ' > div.help > ul > li { margin: 0; padding: 0.25em 0.5em; text-align: left; color: #FFFFFF; }',

		div_main + '.hidden > div.help { opacity: 0; filter: opacity(0%); }',
		div_main + ' > div.help:hover > ul { display: block; }',

		'body.nocursor ' + div_main + ' > video { cursor: none; }',

		div_main + ':fullscreen > video { width: 100%; height: 100%; }',
		div_main + ':fullscreen > ul li[data-do=full]:before { content: ""; }',
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

		// Set options
		players[x].setAttribute('data-id',x.toString()); // Set options index
		let data_opts = players[x].getAttribute('data-opts');
		data_opts = (data_opts ? data_opts.toString() : '');

		let player_opts = [];
		for (let y = 0; y < data_opts.length; y++) {
			player_opts[y] = parseInt(data_opts.substr(y,1));
		}

		while (player_opts.length < 5) { player_opts.push(0); }
		opts[x] = {
			'focus':	player_opts[0],
			'play':		player_opts[1],
			'loop':		player_opts[2],
			'help':		player_opts[3],
			'keys':		player_opts[4],
		};
		// Example: opts[player.getAttribute('data-id')]['help']

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
		overlay.appendChild(document.createElement('SPAN'));
		overlay.appendChild(document.createElement('SPAN'));
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
				control.appendChild(document.createElement('DIV'));
				control.appendChild(document.createElement('SPAN'));
				let div = document.createElement('DIV');
				div.innerHTML = timeify(0,video.duration);
				control.appendChild(div);
			}
			if (config.controls[x] === 'vol_slider') {
				let span = document.createElement('SPAN');
				let div = document.createElement('DIV');
				div.className = 'vol_grabber';
				span.appendChild(div);
				control.appendChild(span);
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
			li.innerHTML = menu_items[key];
			menu.appendChild(li);
		} }
		if (menu.childNodes.length) { players[x].appendChild(menu); }

////////////////////////
//   Optional Extras  //
////////////////////////

		// Video Title
		let video_title = players[x].getAttribute('data-title');
		if (video_title) {
			let title = document.createElement('DIV');
			title.className = 'title';
			title.innerHTML = video_title;
			players[x].appendChild(title);
		}

		// Help icon
		if (opts[players[x].getAttribute('data-id')]['help']) {
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

		// Give focus
		if (opts[players[x].getAttribute('data-id')]['focus']) {
			players[x].childNodes[0].focus();
		}

		// Autoplay
		if (opts[players[x].getAttribute('data-id')]['play']) {
			players[x].childNodes[0].play().then().catch(() => {
				toggle_mute(players[x]);
				players[x].childNodes[0].play().then();
			});
		}

		// Set background
		if (players[x].getAttribute('data-bgcolor')) {
			players[x].style.backgroundColor = players[x].getAttribute('data-bgcolor');
		}

		// Set loop
		if (opts[players[x].getAttribute('data-id')]['loop']) {
			players[x].childNodes[0].loop = true;
		}

		// Timers
		setInterval(() => {

			update_menu(players[x]);

			let size;
			if (video.duration) {
				players[x].childNodes[2].childNodes[page.elements['time1']].innerHTML = timeify(video.currentTime,video.duration);
				players[x].childNodes[2].childNodes[page.elements['time2']].innerHTML = timeify(video.duration);

				let slider = players[x].childNodes[2].childNodes[page.elements['slider']];
				size = slider.getBoundingClientRect();
				slider.childNodes[0].style.width = ((size.width - 8) / video.duration) * video.buffered.end((video.buffered.length - 1)) + 'px';
				slider.childNodes[1].style.width = ((size.width - 8) / video.duration) * video.currentTime + 'px';
			}

			let volume = players[x].childNodes[2].childNodes[page.elements['volume']];
			if (!video.volume || video.muted) {
				volume.classList.add('mute');
			} else {
				volume.classList.remove('mute');
			}

			let vol_slider = players[x].childNodes[2].childNodes[page.elements['vol_slider']];
			if (video.muted) {
				vol_slider.childNodes[0].style.width = '0';
			} else {
				size = vol_slider.getBoundingClientRect();
				vol_slider.childNodes[0].style.width = ((size.width - 4) * video.volume) + 'px';
			}

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
				if (in_array(target.className,['vol_slider','vol_grabber'])) { set_volume(player,e.pageX); }
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
	if (mouse.down && player && in_array(target.className,['vol_slider','vol_grabber'])) { set_volume(player,e.pageX); }
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
				let size = target.childNodes[2].getBoundingClientRect();
				let data = set_time(player,e.pageX,true);
				target.childNodes[2].style.left = data[0] - (size.width / 2) + 'px';
				target.childNodes[2].innerHTML = timeify(data[1],video.duration);
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
	let key = e.key;
	let player = get_player(target);
	downkeys[keyid] = true;

	if (player) {

		if (opts[player.getAttribute('data-id')]['keys']) {
			do_timer(e,'reset');
			do_timer(e,'start',true);
		}

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

		// Numbered jumps
		if (in_array(key,['0','1','2','3','4','5','6','7','8','9'])) {
			video.currentTime = (video.duration / 10) * parseInt(key);
		}

	} // if (player) {

}

function keyup(e) {
	let keyid = e.which;
	downkeys[keyid] = false;
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
	video.muted = !video.muted;
	overlay(video.muted ? 'mute' : 'vol_max',player);
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
	let result;
	if (val) {
		max = (max ? max : val);
		let date = new Date(val * 1000).toISOString(); // 1970-01-01T01:32:11.989Z
		if (max < 3600) {
			result = date.substr(14,5);
		} else if (max < (3600 * 24)) {
			result = date.substr(11,8);
		} else {
			result = date.substr(8,2) + 'd' + date.substr(11,8);
		}
	} else {
		result = '00:00';
	}
	return result;
}

function overlay(choice,player) {
	let overlay = player.childNodes[1];
	let value = overlay.style.getPropertyValue('background-position');

	let choices = [
		'play','pause','vol_up','vol_down','mute','vol_max','skip_left','skip_right',
		'0.25x','0.5x','0.75x','1x','1.25x','1.5x','1.75x','2x'
	];
	for (let x = 0; x < choices.length; x++) {
		if (choice === choices[x]) { value = (x * -100) + 'px  0px'; }
	}

	overlay.childNodes[1].style.backgroundPosition = value;
	overlay.classList.add('visible');
	setTimeout(() => { overlay.classList.add('hiding'); },250);
	setTimeout(() => { overlay.classList.remove('visible','hiding'); },500);
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
					item.classList.remove('on');
				} else {
					item.classList.add('on');
				}
			break;
			case 'mute':
				if (video.muted) {
					item.classList.add('on');
				} else {
					item.classList.remove('on');
				}
			break;
			case 'loop':
				if (video.loop) {
					item.classList.add('on');
				} else {
					item.classList.remove('on');
				}
			break;
		}
	}
}
