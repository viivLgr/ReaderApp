var koa = require('koa');
var controller = require('koa-route');
var app = koa();

var views = require('co-views');
var render = views('./view',{
	map: {html: 'ejs'}
});

var koa_static = require('koa-static-server');
var service = require('./service/webAppService.js');


app.use(koa_static({
	rootDir: './static/', //静态资源文件
	rootPath: '/static/', //url路径访问
	maxage: 0    //缓存时间
}))

app.use(controller.get('/route_test',function*(){
	this.set('Cache-Control','no-cache');
	this.body = 'hello koa!';
}));

app.use(controller.get('/ejs_test',function*(){
	this.set('Cache-Control','no-cache');
	this.body = yield render('test',{title:'title_test'});
}));


app.use(controller.get('/api_test',function*(){
	this.set('Cache-Control','no-cache');
	this.body = service.get_test_data();
}));

//首页
app.use(controller.get('/',function*(){
	this.set('Cache-Control','no-cache');
	this.body = yield render('index',{nav:'书城首页'});
}));

//搜索
app.use(controller.get('/search',function*(){
	this.set('Cache-Control','no-cache');
	this.body = yield render('search',{nav:'搜索'});
}));

//render
app.use(controller.get('/reader',function*(){
	this.set('Cache-Control','no-cache');
	this.body = yield render('reader');
}));

//male
app.use(controller.get('/male',function*(){
	this.set('Cache-Control','no-cache');
	this.body = yield render('male',{nav:'男生类别'});
}));

//female
app.use(controller.get('/female',function*(){
	this.set('Cache-Control','no-cache');
	this.body = yield render('female',{nav:'女生类别'});
}));

//category
app.use(controller.get('/category',function*(){
	this.set('Cache-Control','no-cache');
	this.body = yield render('category',{nav:'分类'});
}));

//rang
app.use(controller.get('/rank',function*(){
	this.set('Cache-Control','no-cache');
	this.body = yield render('rank',{nav:'排行'});
}));

//book
var querystring = require('querystring');
app.use(controller.get('/book',function*(){
	this.set('Cache-Control','no-cache');
	var params = querystring.parse(this.req._parsedUrl.query);
	var bookId = params.id;
	this.body = yield render('book',{nav:"书籍详情",bookId:bookId});
}));


//线上接口
app.use(controller.get('/ajax/book',function*(){
	this.set('Cache-Control','no-cache');
	var params = querystring.parse(this.req._parsedUrl.query);
	var id = params.id;
	if(!id){
		id = "18218";
	}
	this.body = service.get_book_data(id);
}));

app.use(controller.get('/ajax/chapter',function*(){
	this.set('Cache-Control','no-cache');
	this.body = service.get_chapter_data();
}));

app.use(controller.get('/ajax/chapter_data',function*(){
	this.set('Cache-Control','no-cache');
	var params = querystring.parse(this.req._parsedUrl.query);
	var id = params.id;
	if(!id){
		id = '1';
	}
	this.body = service.get_chapter_content_data(id);
}));

app.use(controller.get('/ajax/search',function*(){
	this.set('Cache-Control','no-cache');
	var params = querystring.parse(this.req._parsedUrl.query);
	var start = params.start;
	var end = params.end;
	var keyword = params.keyword;
	this.body = yield service.get_search_data(start,end,keyword);   //yield  异步返回需要
}));
//index
app.use(controller.get('/ajax/index',function*(){
	this.set('Cache-Control','no-cache');
	this.body = service.get_index_data();
}));
//rank
app.use(controller.get('/ajax/rank',function*(){
	this.set('Cache-Control','no-cache');
	this.body = service.get_rank_data();
}));
//male
app.use(controller.get('/ajax/male',function*(){
	this.set('Cache-Control','no-cache');
	this.body = service.get_male_data();
}));
//female
app.use(controller.get('/ajax/female',function*(){
	this.set('Cache-Control','no-cache');
	this.body = service.get_female_data();
}));
//category
app.use(controller.get('/ajax/category',function*(){
	this.set('Cache-Control','no-cache');
	this.body = service.get_category_data();
}));

app.listen(3001);
console.log('ReaderApp is start');