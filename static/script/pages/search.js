var screenHeight = $(window).height();
if(screenHeight<480){
	screenHeight = 480;
}
new Vue({
		el: '#search',
		data: {
			search:[],
			empty: false,
			screenHeight:{
				height: (screenHeight-44) + 'px'
			},
			listHeight:{
				height: (screenHeight-99) + 'px'
			}
		},
		methods:{
			doSearch:function(e){
				var keyword = $('#searchValue').val();
				console.log(keyword);
				var _this = this;
				$.get('/ajax/search',{
					keyword: keyword
				}, function(data) {
					_this.search = data.items;
					console.log(data.items)
					if(_this.search.length == 0){
						_this.empty = true;
					}else{
						_this.empty = false;
					}
				},'json');
			},
			go:function(book_id){
				return '/book?id='+book_id;
			},
		}
	})
