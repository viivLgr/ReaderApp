$.get('/ajax/book', function(data) {
	var screenHeight = $(window).height();
	if(screenHeight<480){
		screenHeight = 480;
	}
	new Vue({
		el: '#appBook',
		data: {
			item:data.item,
			author_books: data.author_books,
			related: data.related,
			screenHeight:{
				height: (screenHeight-44) + 'px'
			},
			ishide: true
		},
		methods: {
			readBook:function(){
				location.href = "/reader"
			},
			hide:function(){
				this.ishide = !this.ishide;
			}
		}

	})
},'json');