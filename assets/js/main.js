var Portfolio = {

	start: function()
	{
		body.innerHTML = Portfolio.main.wrap_tmp();
		
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


