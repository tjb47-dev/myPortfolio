var Config = {
	
	myName: 'Portfolio of Thomas Bailey',
	pause_after_intro: 3000,
	bg_video: 'MvkvaJ8tB4A',

	radio_volume: 0.05,
	radio_playlist: [
        {name: '', link:'custom_data/code.mp3' }
    ],
	
	main_menu: [
		{caption: 'HOME', onclick: Portfolio.home.show},
		{caption: 'GitHub', onclick: Portfolio.GitHub.show},
		{caption: 'About Me', onclick: Portfolio.about.show},	
	],
	
	assets :
	{
		bad_tv: './assets/bad_tv.mp4',
	},
};