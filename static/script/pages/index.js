$.get('/ajax/index',function(data){
	var screenWidth = $(window).width();
	if(screenWidth<320){
		screenWidth = 320;
	}
	var screenHeight = $(window).height();
	if(screenHeight<480){
		screenHeight = 480;
	}
	new Vue({
		el: '#appIndex',
		data: {
			screenWidth:{
				width: screenWidth + 'px'
			},
			screenHeight:{
				height: screenHeight + 'px'
			},
			swiper: data.items[0].data.data,
			hot: data.items[1].data.data,
			recommend: data.items[2].data.data,
			female: data.items[3].data.data,
			male: data.items[4].data.data,
			free: data.items[5].data.data,
			topic: data.items[6].data.data,
			swiper_tab1_on: true,
			swiper_tab2_on: false,
			header_transform: {
			    transitionDuration:'0.5s',
			    transform: 'translate3d(0px,0px,0px)'
			},
			index_transform: {
				width: screenWidth*2+'px',
			    transitionDuration:'0.5s',
			    transform: 'translate3d(0px,0px,0px)'
			}
		},
		methods:{
			go:function(book_id){
				return '/book?id='+book_id;
			},
			tabSwitch:function(pos){
				var scrollTop = $('.slide-wrap').scrollTop();//获得元素的滚动条高度
				if(scrollTop>0){
					$('.slide-wrap').scrollTop(0);
				}
				if(pos == 1){
					this.swiper_tab1_on = false;
					this.swiper_tab2_on = true;
					this.header_transform = {
						transitionDuration:'0.5s',
			    		transform: 'translate3d('+screenWidth/4+'px,0px,0px)'
					};
					this.index_transform = {
						width: screenWidth*2+'px',
						transitionDuration:'0.5s',
			    		transform: 'translate3d(-'+screenWidth+'px,0px,0px)'
					};
				}else{
					this.swiper_tab1_on = true;
					this.swiper_tab2_on = false;
					this.header_transform = {
						transitionDuration:'0.5s',
			    		transform: 'translate3d(0px,0px,0px)'
					};
					this.index_transform = {
						width: screenWidth*2+'px',
						transitionDuration:'0.5s',
			    		transform: 'translate3d(0px,0px,0px)'
					};
				}
			}
		}
	})
},'json')