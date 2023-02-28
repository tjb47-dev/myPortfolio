
"use strict";

var Portfolio = {

	start: function()
	{
		body.innerHTML = Portfolio.main.wrap_tmp();
		
		//Portfolio.main.start();
		Portfolio.intro.after = Portfolio.main.start;
		Portfolio.intro.start();

		window.addEventListener('message', function(e)
		{
			(Portfolio.uploader.handlers[e.data.eventName] || function() { })(e.data);
		});
	},
};

Portfolio.main = {
	
	start: function()
	{
		main_wrap.innerHTML = Portfolio.main.tmp(
									Portfolio.menu.logo_tmp(),
									Portfolio.menu.items_tmp(Config.main_menu),
									Portfolio.radio.player_tmp(),
									Portfolio.uploader.tmp()
								);

		if(typeof background_video !== 'undefined')
			background_video.className = 'background-video';
		
		Portfolio.radio.mute(false);
		Portfolio.menu.onClick(0);
		let fw = menu.offsetHeight;
		menu.className = 'menu-wrap menu-wrap-opened';
	},
	
	tmp: function(logo_html, menu_html, player_html, uploader_html)
	{
		return `	<div id="menu" class="menu-wrap">${logo_html}${menu_html}${player_html}</div>
				<div id="content_wrap" class="content-wrap"></div>
				<div id="uploader_wrap" class="uploader-wrap">${uploader_html}</div>
				<div id="cursor" class="cursor"></div>
				`;
	},
	
	wrap_tmp: function()
	{
		let vl = `https://www.youtube.com/embed/${Config.bg_video}?autoplay=1&amp;showinfo=0&amp;controls=0&amp;loop=1&amp;playsinline=1&amp;mute=1&amp;rel=0&amp;playlist=${Config.bg_video}`;
		return `	<iframe id="background_video" class="background-video background-video-hide" src="${vl}" frameborder="0" allow="autoplay" allowfullscreen=""></iframe>
				<div id="main_wrap" class="main-wrap" onmousemove="Portfolio.cursor.onMouseMove(event)"></div>`;
	},
	
	content_tmp: function(header, content)
	{
		return `<div class="content-header">${header}</div><div class="content-items-wrap custom-slider">${content}</div>`;
	},
	
	contentHideAnimate: function(after)
	{
		content_wrap.className = 'content-wrap';		
		setTimeout(after, 700);
	},
	
	contentShowAnimate: function()
	{
		content_wrap.className = 'content-wrap content-wrap-opened';
	}
};

Portfolio.cursor = {
	
	onMouseMove: function(event)
	{
		// console.log(event.clientX event.clientY);
		cursor.style.left = event.clientX + 'px';
		cursor.style.top = event.clientY + 'px';
	}
};

Portfolio.uploader = {
	
	progress: 0,
	count: 0,
	thisCount: 0,
	
	handlers: {
		
		startInitFunctionOrder(data) 
		{
			Portfolio.uploader.count = data.count;
		},
		
		initFunctionInvoking(data) 
		{
			let localdata = ((data.idx / Portfolio.uploader.count) * 100);
			Portfolio.uploader.updateProgress(localdata);
		},
		
		startDataFileEntries(data) 
		{
			Portfolio.uploader.count = data.count;
		},
		
		performMapLoadFunction(data) 
		{
			++Portfolio.uploader.thisCount;
			let localdata = ((Portfolio.uploader.thisCount / Portfolio.uploader.count) * 100);
			Portfolio.uploader.updateProgress(localdata);
		}
	},
	
	updateProgress: function(progress)
	{
		if(progress > Portfolio.uploader.progress)
		{
			uploader_line.style.width = progress + '%';
			Portfolio.uploader.progress = progress;
		}
	},
	
	tmp: function()
	{
		return `<div id="uploader_line" class="uploader-line"></div>`;
	},	
};

Portfolio.menu = {
	
	selecteds: [],
	selected: -1,
	
	onClick: function(select)
	{
		if(Portfolio.menu.selecteds[select])
			throw 'selected';
		
		Portfolio.menu.selected = select;
			
		Portfolio.menu.selecteds.forEach(function(item, i)
		{
			window['menu_item_' + i].className = i == select ? 'menu-item-wrap menu-wrap-selected' : 'menu-item-wrap';
			Portfolio.menu.selecteds[i] = i == select ? true : false;
		});
		
		Portfolio.main.contentHideAnimate(function()
		{
			Config.main_menu[select].onclick();
			Portfolio.main.contentShowAnimate();			
		});
	},
	
	logo_tmp: function()
	{
		return `<div class="menu-logo-wrap"><div class="menu-logo"></div></div><div class="menu-server-name">${Config.myName}</div>`;
	},
	
	items_tmp: function(items)
	{
		var html = '';
		
		items.forEach(function(item, i)
		{
			Portfolio.menu.selecteds[i] = i == Portfolio.menu.selected ? true : false;
			let selected = Portfolio.menu.selecteds[i] ? ' menu-wrap-selected' : '';
				
			html += `<div class="menu-item-wrap${selected}" id="menu_item_${i}" onclick="Portfolio.menu.onClick(${i});"><div class="menu-item">${item.caption}</div></div>`;
		});
		
		return html;
	},
};

Portfolio.radio = {
	
	muted: true,
	playlist_pointer: 0,
	
	onVolumeChange: function()
	{
		Config.radio_volume = radio_volume.value;
		
		if(Config.radio_volume > 0 && Portfolio.radio.muted)
			Portfolio.radio.mute(false);
		
		if(Config.radio_volume == 0 && !Portfolio.radio.muted)
			Portfolio.radio.mute(true);

		radio.volume = Config.radio_volume;
		radio_volume_range.style.width = radio.volume * 100 + '%';
		Portfolio.radio.play();
	},
	
	onMuteClick: function()
	{
		Portfolio.radio.mute(!Portfolio.radio.muted);
	},
	
	onSelectorClick: function()
	{
		radio.pause();
		
		if(Portfolio.radio.muted)
			Portfolio.radio.mute(false);
		else
			Portfolio.radio.play();
	},
	
	mute: function(mute)
	{
		Portfolio.radio.muted = mute;
		
		if(Portfolio.radio.muted)
		{
			radio.volume = 0;
			radio_volume.value = 0;
			radio_eq.style.opacity = 0;
			radio_name.style.opacity = 0;
			radio_speaker.className = 'radio-speaker-muted';
		}
		else
		{
			Config.radio_volume = Config.radio_volume == 0 ? 0.05 : Config.radio_volume;
			radio_volume.value = Config.radio_volume;
			radio.volume = Config.radio_volume;
			radio_eq.style.opacity = 1;
			radio_name.style.opacity = 1;
			radio_speaker.className = 'radio-speaker';
			Portfolio.radio.play();
		}
		
		radio_volume_range.style.width = radio.volume * 100 + '%';
	},
	
	play: function()
	{
		if(!(radio.duration > 0 && !radio.paused))
		{
			let stream = Config.radio_playlist[Portfolio.radio.playlist_pointer];
			radio.src = stream.link;
			radio_name.innerHTML = stream.name;
			radio.volume = Config.radio_volume;
			radio_volume_range.style.width = radio.volume * 100 + '%';
			radio.play();
			
			Portfolio.radio.playlist_pointer++;
			if(Portfolio.radio.playlist_pointer > Config.radio_playlist.length - 1)
				Portfolio.radio.playlist_pointer = 0;
		}
	},
	
	player_tmp: function()
	{
		return `
				<div id="radio_eq" class="radio-eq"></div>
				<div class="radio-volume-wrap">
					<div id="radio_speaker" onclick="Portfolio.radio.onMuteClick()" class="radio-speaker-muted"></div>
					<div class="radio-volume-range-wrap">
						<input id="radio_volume" class="radio-volume" type="range" min="0" max="1" step=".05" value="0" oninput="Portfolio.radio.onVolumeChange()" onchange="Portfolio.radio.onVolumeChange()">
						<div id="radio_volume_range" class="radio-volume-range"></div>
					</div>
					<div class="radio-selector" onclick="Portfolio.radio.onSelectorClick()"></div>
				</div>
				<div id="radio_name" class="radio-name"></div>
				<audio id="radio"></audio>`;
	}
};

Portfolio.about = {
	
	images_path: './custom_data/',
	avatar_default: 'avatar-default.png',
	
	show: function()
	{
		let caption = Config.main_menu[Portfolio.menu.selected].caption;
		let html = Portfolio.about.items_tmp(About.about);
		
		content_wrap.innerHTML = Portfolio.main.content_tmp(caption, html);
	},
	
	items_tmp: function(items)
	{
		var html = `<div class="about-wrap">`;
		
		items.forEach(function(item, i)
		{
			let avatar = item.avatar.trim() == '' ? Portfolio.about.avatar_default : item.avatar.trim();
				
			html += `<div class="about-item">
							<div class="about-title">${item.title}</div>
							<div class="about-status">${item.status}</div>
							<div class="about-avatar" style="background-image: url(${Portfolio.about.images_path}${avatar})"></div>
							<div class="about-description">${item.description}</div>
					</div>`;
		});
		
		html += `<div class="bottom-break"></div></div>`;
		
		return html;
	}
};

Portfolio.home = {
	
	show: function()
	{
		content_wrap.innerHTML = Portfolio.home.tmp(Home);
	},
	
	tmp: function(html)
	{
		let fhtml = html.replace('{{myName}}', Config.myName);
		return `<div class="home-wrap-0"><div class="home-wrap-1"><div class="home-wrap-2">${fhtml}</div></div></div>`;
	}
};

Portfolio.GitHub = {
	
	images_path: './custom_data/',

	show: function()
	{
		let caption = Config.main_menu[Portfolio.menu.selected].caption;
		let html = Portfolio.GitHub.items_tmp(GitHub.contents);
		
		content_wrap.innerHTML = Portfolio.main.content_tmp(caption, html);
	},
	
	items_tmp: function(items)
	{
		var html = '';
		
		items.forEach(function(item, i)
		{
			let img = item.img.trim() == '' ? '' : `<img class="GitHub-img" src="${Portfolio.GitHub.images_path}${item.img}">`; 
				
			html += `<div class="GitHub-item">
						<div class="GitHub-header">
							<div class="GitHub-title">${item.title}</div>
							<div class="GitHub-data">${item.data}</div>
						</div>
						<div class="GitHub-text">${img}${item.text}</div>
					<div class="GitHub-item-end"></div>
					</div>`;
		});
		
		html += `<div class="bottom-break"></div>`;
		
		return html;
	}
};



Portfolio.intro = {
	
	start: function()
	{
		main_wrap.innerHTML = Portfolio.intro.tmp();
		let fh = intro_logo.offsetHeight;
		
		setTimeout(function()
		{
			intro_logo.className = 'intro-logo intro-logo-show';
			
			setTimeout(function()
			{
				Portfolio.intro.after();
			}, Config.pause_after_intro + 1500);
		}, 1000);
		
	},
	
	tmp: function()
	{
		return `	<div id="intro_logo" class="intro-logo">
					<div class="intro-hor-pad"></div>
					<div class="intro-logo-wrap-1">
						<div class="intro-hor-wpad">	</div>
						<div class="intro-logo-wrap-2">
							<div class="intro-hor-pad intro-class-3"></div>
								<div class="intro-logo-wrap-3">
									<div class="intro-hor-wpad intro-class-1"></div>
									<div class="intro-logo-wrap-4 intro-logo-main"></div>
									<div class="intro-hor-wpad intro-class-2"></div>
								</div>
							<div class="intro-hor-pad intro-class-4"></div>						
						</div>
						<div class="intro-hor-wpad"></div>
					</div>
					<div class="intro-hor-pad"></div>
				</div>`;
	}
};
