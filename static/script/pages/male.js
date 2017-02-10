$.get('/ajax/male', function(data) {
	var screenWidth = $(window).width();
	if(screenWidth<320){
		screenWidth = 320;
	}
	var screenHeight = $(window).height();
	if(screenHeight<480){
		screenHeight = 480;
	}
	new Vue({
		el:"#male",
		data: {
			data1: data.items[0].data.data,
			data2: data.items[1].data.data,
			data3: data.items[2].data.data,
			data4: data.items[3].data.data,
			data1_tit: data.items[0].ad_name,
			data2_tit: data.items[1].ad_name,
			data3_tit: data.items[2].ad_name,
			data4_tit: data.items[3].ad_name,
			screenWidth:{
				width: screenWidth + 'px'
			},
			screenHeight:{
				height: screenHeight + 'px'
			}
		},
		methods:{

		}
	})
},'json');