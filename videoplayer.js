
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
		'@font-face { font-family: "fixed"; src: url("inconsolata-regular.ttf"); }',

		div_main + ' { z-index: 0; position: relative; overflow: visible; min-width: 350px; font-family: fixed, monospace; user-select: none; }',

		div_main + ' > video { width: 100%; height: 100%; }',

		div_main + ' > div.overlay { z-index: 1; position: absolute; top: 0; right: 0; bottom: 0; left: 0; width: 100px; height: 100px; margin: auto; border-radius: 100px; opacity: 0; filter: opacity(0%); text-align: center; color: #FFFFFF; background: url("icons.png") 0 0 no-repeat #666666; pointer-events: none; transition: opacity 0.1s linear 0s; }',
		div_main + ' > div.overlay.visible { opacity: 0.75; filter: opacity(75%); transition-delay: 0s; }',

		div_main + ' > div.controls { display: flex; flex-flow: row; position: absolute; bottom: 0; left: 0; width: 100%; height: 30px; font-size: 12px; color: #FFFFFF; background-color: #333333; transition: all 0.1s linear 0s; }',
		div_main + '.hidden > div.controls { opacity: 0; filter: opacity(0%); transition-duration: 0.5s; }',

		div_main + ' > div.controls > div { position: relative; flex: 0 0 auto; width: 30px; height: 30px; }',
		div_main + ' > div.controls > div.play { background: url("icons.png") 0 -100px no-repeat; cursor: pointer; }',
		div_main + ' > div.controls > div.play.pause { background-position: -30px -100px; }',

		div_main + ' > div.controls > div.time1 { width: auto; padding-top: 0.65em; background: none; }',
		div_main + ' > div.controls > div.time2 { width: auto; padding-top: 0.65em; background: none; }',
		div_main + ' > div.controls > div.slider { flex-grow: 1; margin: 0 0.5em; height: 30px; border: 2px solid #222222; border-width: 0 2px; background-color: #555555; cursor: pointer; }',
		div_main + ' > div.controls > div.slider > span { display: block; position: absolute; top: 0; left: 2px; width: 0; height: 30px; background-color: #999999; transition: width 0.1s linear 0s; content: ""; pointer-events: none; }',
		div_main + ' > div.controls > div.slider > div { display: none; position: absolute; top: -25px; left: 0; padding: 1px 5px; border: 1px solid #666666; border-radius: 5px; background-color: #333333; }',
		div_main + ' > div.controls > div.slider:hover > div { display: block; }',

		div_main + ' > div.controls > div.volume { background: url("icons.png") -60px -100px no-repeat; cursor: pointer; }',
		div_main + ' > div.controls > div.volume.mute { background-position: -90px -100px; }',
		div_main + ' > div.controls > div.vol_slider { top: 10px; margin: 0 1em 0 0.5em; width: 70px; height: 10px; border: 2px solid #222222; border-width: 0 2px; border-radius: 2em; background-color: #222222; cursor: grab; }',
		div_main + ' > div.controls > div.vol_slider > span { display: block; position: absolute; top: -0.5em; left: -0.5em; width: 100%; height: 10px; border: 0.5em solid #333333; border-radius: 2em;  background-color: #999999; transition: width 0.1s linear 0s; content: ""; pointer-events: none; }',
		div_main + ' > div.controls > div.vol_slider > span:before { position: absolute; top: -3px; right: -8px; width: 16px; height: 16px; border-radius: 100%; background-color: #EEEEEE; content: ""; }',

		div_main + ' > div.controls > div.full { background: url("icons.png") -120px -100px no-repeat; cursor: pointer; }',
		div_main + ':fullscreen > div.controls > div.full { background-position: -150px -100px; }',

		div_main + ' > ul { display: none; position: absolute; top: 30px; left: 30px; list-style-type: none; margin: 0; padding: 0.25em; background-color: rgba(51,51,51,0.75); }',
		div_main + ' > ul li { position: relative; margin: 0; padding: 0.25em 1em 0.25em 1.75em; text-align: left; color: #FFFFFF; cursor: pointer; }',
		div_main + ' > ul li:before { position: absolute; top: 9px; left: 0.5em; width: 0.5em; height: 0.5em; border: 1px solid #FFFFFF; border-radius: 1em; background: none; content: ""; }',
		div_main + ' > ul li.on:before { background-color: #FFFFFF; }',
		div_main + ' > ul li:hover { background-color: #666666; }',

		div_main + ' > ul.show { display: block; }',

		div_main + ' > div.title { position: absolute; top: 0; left: 0; width: calc(100% - 1em); padding: 0.5em; text-align: left; color: #FFFFFF; background-color: rgba(51,51,51,0.5); transition: all 0.1s linear 0s; }',
		div_main + '.hidden > div.title { opacity: 0; filter: opacity(0%); transition-duration: 0.5s; }',

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
		if (players[x].style.width && video.videoWidth > video.videoHeight) { // Landscape video
			players[x].style.height = video.videoHeight * (player_size.width / video.videoWidth) + 'px';
		} else if (players[x].style.height) { // Vertical or square video
			players[x].style.height = video.videoWidth * (player_size.height / video.videoHeight) + 'px';
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

		players[x].addEventListener('mousedown',	(e) => { mousedown(e); });
		players[x].addEventListener('mouseup',		(e) => { mouseup(e); });
		players[x].addEventListener('mousemove',	(e) => { mousemove(e); });
		players[x].addEventListener('mouseleave',	(e) => { mouseleave(e); });
		players[x].addEventListener('dblclick',		(e) => { dblclick(e); });
		players[x].addEventListener('contextmenu',(e) => { contextmenu(e); });

		let overlay = document.createElement('DIV');
		overlay.className = 'overlay';
		overlay.innerHTML = '';
		players[x].appendChild(overlay);

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

		let video_title = players[x].getAttribute('data-title');
		if (video_title) {
			let title = document.createElement('DIV');
			title.className = 'title';
			title.innerHTML = video_title;
			players[x].appendChild(title);
		}

		// Give focus if requested
		if (players[x].getAttribute('data-autofocus') === 'true') {
			players[x].childNodes[0].focus();
		}

		// Autoplay if requested
		if (players[x].getAttribute('data-autoplay') === 'true') {
			players[x].childNodes[0].play().then().catch(() => {
				set_volume(players[x],0);
				players[x].childNodes[0].play().then();
			});
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

function page_load(item) {
	let load = window.onload;
	if (typeof load == 'function') {
		window.onload = function() { if (load) { load(); } item(); };
	} else {
		window.onload = item;
	}
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
