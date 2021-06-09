
let config = {
	'class':	'videoplayer',
};

/**/

page_load(load);

function page_load(item) {
	let load = window.onload;
	if (typeof load == 'function') {
		window.onload = function() { if (load) { load(); } item(); };
	} else {
		window.onload = item;
	}
}

function load() {

	let div_main = 'div.' +  config.class;
	let css_rules = [
		div_main + ' { z-index: 0; position: relative; }',
		div_main + ' > div.overlay { z-index: 1; position: absolute; top: 0; right: 0; bottom: 0; left: 0; width: 100px; height: 100px; margin: auto; border-radius: 100px; opacity: 0; filter: opacity(0%); text-align: center; color: #FFFFFF; background: url("icons.png") 0 0 no-repeat #666666; pointer-events: none; user-select: none; transition: opacity 0.1s linear 0s; }',
		div_main + ' > div.overlay.visible { opacity: 0.75; filter: opacity(75%); transition-delay: 0s; }',
		div_main + ' > div.controls { position: absolute; bottom: 0; left: 0; width: 100%; height: 36px; background-color: #333333; }',

		div_main + ' > video { max-width: 100%; max-height: 100%; }',
		div_main + ':fullscreen > video { width: 100%; height: 100%; }',
	];

	let css = document.styleSheets[0];
	for (let x = 0; x < css_rules.length; x++) { css.insertRule(css_rules[x],css.cssRules.length); }

	let players = document.querySelectorAll('div.' + config.class);
	for (let x = 0; x < players.length; x++) {

		players[x].removeAttribute('controls');

		players[x].addEventListener('click',		(e) => { click(e); });
		players[x].addEventListener('dblclick',	(e) => { dblclick(e); });
		players[x].addEventListener('keydown',	(e) => { keypress(e); });

		let overlay = document.createElement('DIV');
		overlay.className = 'overlay';
		overlay.innerHTML = '';
		players[x].appendChild(overlay);

		let controls = document.createElement('DIV');
		controls.className = 'controls';
		players[x].appendChild(controls);

		// Give focus if requested
		if (players[x].getAttribute('data-autofocus') === 'true') {
			players[x].childNodes[0].focus();
		}

	}

}

function click(e) {
	let target = (e.target.nodeName === 'DIV' ? e.target : getitem(e.target));
	let video = target.childNodes[0];
	switch (e.which) {
		case 1: // Left click
			if (video.paused) {
				overlay('play',target);
				video.play();
			} else {
				overlay('pause',target);
				video.pause();
			}
		break;
	}
}

function dblclick(e) {
	let target = (e.target.nodeName === 'DIV' ? e.target : getitem(e.target));
	switch (e.which) {
		case 1: // Left click
			toggle_fullscreen(target);
		break;
	}
}

function keypress(e) {
	let target = (e.target.nodeName === 'DIV' ? e.target : getitem(e.target));
	let video = target.childNodes[0];

	let keycode = e.key;
	switch (keycode.toLowerCase()) {
		case ' ':
			e.preventDefault();
			if (video.paused) {
				video.play();
				overlay('play',target);
			} else {
				video.pause();
				overlay('pause',target);
			}
		break;
		case 'f':
			toggle_fullscreen(target);
		break;
	}

	let keyid = e.which;
	let show;
	if (in_array(keyid,[37,38,39,40])) {
		e.preventDefault();
		switch (keyid) {
			case 37: // Arrow left
				video.currentTime = (video.currentTime ? video.currentTime - 5 : 0);
				show = 'skip_left';
			break;
			case 39: // Arrow right
				video.currentTime = (video.currentTime < (video.duration - 5) ? video.currentTime + 5 : video.length);
				show = 'skip_right';
			break;
			case 38: // Arrow up
				video.volume += (video.volume < 1 ? 0.1 : 0);
				show = (video.volume < 1 ? 'vol_up' : 'vol_max');
			break;
			case 40: // Arrow down
				video.volume -= (video.volume ? 0.1 : 0);
				show = (video.volume ? 'vol_down' : 'mute');
			break;
		}
		video.volume = video.volume.toFixed(2);
		if (show) { overlay(show,target); }
	}

}

function overlay(choice,elem) {
	let overlay = elem.childNodes[1];
	let value = overlay.style.getPropertyValue('background-position');

	let choices = ['play','pause','vol_up','vol_down','mute','vol_max','skip_left','skip_right'];
	for (let x = 0; x < choices.length; x++) {
		if (choice === choices[x]) {
			value = (x * -100) + 'px  0px';
		}
	}

	overlay.classList.add('visible');
	overlay.style.backgroundPosition = value;
	setTimeout(() => { overlay.classList.remove('visible'); },200);

}

function toggle_fullscreen(elem) {
	if (!document['fullscreenElement']) { // Done in bracket notation to prevent validation errors
		elem.requestFullscreen().then();
	} else {
		document.exitFullscreen().then();
	}
}

function getitem(e,item_type = 'DIV') {
	// Go back up the DOM tree until we find a parent with a tag matching item_type
	item_type = item_type.toUpperCase();
	if (e.nodeName !== 'HTML') {
		while (e && e.nodeName !== item_type && e.nodeName !== 'HTML') { e = e.parentNode; }
	}
	return (e && e.nodeName === item_type ? e : false);
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
