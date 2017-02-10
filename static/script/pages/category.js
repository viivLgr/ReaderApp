$.get('/ajax/category', function(data) {
	var screenWidth = $(window).width();
	if(screenWidth<320){
		screenWidth = 320;
	}
	var screenHeight = $(window).height();
	if(screenHeight<480){
		screenHeight = 480;
	}
	new Vue({
		el: '#category',
		data: {
			section:data.section,
			magazine:data.magazine,
			book:data.book,
			male:data.male,
			female:data.male,
			screenWidth:{
				width: screenWidth + 'px'
			},
			screenHeight:{
				height: screenHeight + 'px'
			}
		},
		methods: {

		}
	})
},'json');