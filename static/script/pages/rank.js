$.get('/ajax/rank', function(data) {
	var screenWidth = $(window).width();
	if(screenWidth<320){
		screenWidth = 320;
	}
	var screenHeight = $(window).height();
	if(screenHeight<480){
		screenHeight = 480;
	}
	new Vue({
		el:'#rank',
		data:{
			data:data,
			screenWidth:{
				width: screenWidth + 'px'
			},
			screenHeight:{
				height: screenHeight + 'px'
			},
		},
		methods:{

		}
	})
},'json');