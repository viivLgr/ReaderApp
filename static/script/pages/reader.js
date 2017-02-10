(function(){
    'use strict';
    var Util = (function(){
        var prefix = 'html5_reader_';
        var StorageGetter = function(key){
          return localStorage.getItem(prefix + key);
        };
        var StorageSetter = function(key,val){
            return localStorage.setItem(prefix +key,val);
        };
        var getBSONP = function(url,callback){
            return $.jsonp({
                url: url,
                cache: true,
                callback: 'duokan_fiction_chapter',
                success: function(result){
                    var data = $.base64.decode(result);
                    var json = decodeURIComponent(escape(data));
                    callback(json);
                }
            });
        };
        return {
            getBSONP : getBSONP,
            StorageGetter:StorageGetter,
            StorageSetter:StorageSetter
        }
    })();
    var Dom = {
        top_nav: $('#top_nav'),
        bottom_nav: $('#footer_nav'),
        font_con: $('#font-con'),
        font_containor: $('.font-containor'),
        night_day_switch_button: $('#night-con')
    };
    var Win = $(window);
    var Doc = $(document);
    var readerModel;
    var readerUI;
    var RootContainer = $('#fiction_container');
    var initBgColor = Util.StorageGetter('bg_color');
    var initBgColorIndex = parseInt(Util.StorageGetter('bg_color_index'));
    var initFontColor = Util.StorageGetter('font_color');
    var initFontSize = parseInt(Util.StorageGetter('font_size'));
    var initChapterNum = Util.StorageGetter('chapter_num');
    if(!initFontColor) {
        initFontColor = '#000';
    }
    if(!initFontSize) {
        initFontSize = 14;
    }
    if(!initBgColorIndex) {
        initBgColorIndex = 0;
    }
    if(initBgColorIndex == 4) {
        //当前状态是白天，要设置成夜间
        Dom.night_day_switch_button.addClass('active');
        Dom.night_day_switch_button.html('白天');
    } else {
        //当前状态是黑夜，要设置成白天
        Dom.night_day_switch_button.removeClass('active');
        Dom.night_day_switch_button.html('夜间');
    }
    $('body').css('background-color',initBgColor);
    RootContainer.css('color',initFontColor);
    RootContainer.css('font-size',initFontSize);
    $('.font-bg-p button').css('border','none');
    $('.font-bg-p button').eq(initBgColorIndex).css('border','1px solid #ff7800');
    function main() {
        //todo 整个项目的入口函数
        readerModel = ReaderModel();
        readerUI = ReaderBaseFrame(RootContainer);
        readerModel.init(function(data){
            readerUI(data);
        });
        EventHanlder();
    }
    function ReaderModel(){
        //todo 实现和阅读器相关的数据交互的方法
        var Chapter_id;
        var ChapterTotal;
        var init = function(UIcallback){
            /*getFictionInfo(function(){
                getCurChapterContent(Chapter_id,function(data){
                    //todo
                    UIcallback && UIcallback(data);
                });
            })*/
            getFictionInfoPromise().then(function(d){
                return getCurChapterContentPromise();
            }).then(function(data){
                UIcallback && UIcallback(data);
            });
        }
        var getFictionInfo = function(callback){
            $.get('/ajax/chapter',function(data){
                //todo 获得章节信息之后的回调
                Chapter_id = initChapterNum;
                if(Chapter_id == null){
                    Chapter_id = data.chapters[1].chapter_id;
                }
                ChapterTotal = data.chapters.length;
                callback && callback();
            },'json');
        };
        var getFictionInfoPromise = function(){
            return new Promise(function(resolve,reject){
                $.get('/ajax/chapter',function(data){
                    //todo 获得章节信息之后的回调
                    if(data.result == 0){
                        Chapter_id = initChapterNum;
                        if(Chapter_id == null){
                            Chapter_id = data.chapters[1].chapter_id;
                        }
                        ChapterTotal = data.chapters.length;
                        resolve(); //替换callback
                    }else{
                        reject();
                    }
                },'json');
            });
        };
        //获得当前章节内容
        var getCurChapterContent = function(chapter_id,callback){
            $.get('/ajax/chapter_data',{
            	id:chapter_id
            },function(data){
                if(data.result == 0){
                    var url = data.jsonp;
                    Util.getBSONP(url,function(data){

                        callback && callback(data);
                    });
                }
            },'json');
            Util.StorageSetter('chapter_num',Chapter_id);
        };

        var getCurChapterContentPromise = function(){
            return new Promise(function(resolve,reject){
                $.get('/ajax/chapter_data',{
                	id:Chapter_id
                },function(data){
                    if(data.result == 0){
                        var url = data.jsonp;
                        Util.getBSONP(url,function(data){
                            resolve(data);
                        });
                    }else{
                        reject({msg: 'fail'});
                    };
                },'json');
                Util.StorageSetter('chapter_num',Chapter_id);
            });
        };
        var prevChapter = function(UIcallback){
            Chapter_id = parseInt(Chapter_id,10);
            if(Chapter_id <= 0) {
                return;
            }
            Chapter_id -= 1;
            getCurChapterContent(Chapter_id,UIcallback);
        }

        var nextChapter = function(UIcallback){
            Chapter_id = parseInt(Chapter_id,10);
            if(Chapter_id >= ChapterTotal) {
                return;
            }
            Chapter_id += 1;
            getCurChapterContent(Chapter_id,UIcallback);
        }
        return {
            init : init,
            prevChapter : prevChapter,
            nextChapter : nextChapter
        }
    }

    function ReaderBaseFrame(container){
        //todo 渲染基本的UI结构
        function parseChapterData(jsonData){
            var jsonObj = JSON.parse(jsonData);
            var html = '<h4>' + jsonObj.t + '</h4>';
            for(var i = 0;i<jsonObj.p.length;i++){
                html += '<p>' + jsonObj.p[i] + '</p>';
            }
            return html;
        }
        return function(data){
            container.html(parseChapterData(data));
        }
    }

    function dayStatus(){
        //设置白天状态
        RootContainer.css('color','#000'); //设置字体
        Util.StorageSetter('font_color','#000'); //浏览器记忆字体颜色
        $('body').css('background-color','#e9dfc7'); //设置背景色
        Util.StorageSetter('bg_color','#e9dfc7'); //浏览器记忆背景色
        Dom.night_day_switch_button.removeClass('active'); //更改白天夜间按钮
        Dom.night_day_switch_button.html('夜间');//更改白天夜间按钮
        $('.font-bg-p button').css('border','none'); //重置色块状态
        $('.font-bg-p button').eq(1).css('border','1px solid #ff7800'); //白天色块状态
        Util.StorageSetter('bg_color_index',1); //浏览器存储白天色块状态
    }

    function nightStatus(){
        //设置夜间状态
        RootContainer.css('color','rgb(118, 133, 162)');
        Util.StorageSetter('font_color','rgb(118, 133, 162)');
        $('body').css('background-color','#283548');
        Util.StorageSetter('bg_color','#283548');
        Dom.night_day_switch_button.addClass('active');
        Dom.night_day_switch_button.html('白天');
        $('.font-bg-p button').css('border','none');
        $('.font-bg-p button').eq(4).css('border','1px solid #ff7800');
        Util.StorageSetter('bg_color_index',4);
    }

    function EventHanlder() {
        //todo 交互的事件绑定
        $('#action_mid').click(function(){
            if(Dom.top_nav.css('display') == 'none'){
                Dom.top_nav.show();
                Dom.bottom_nav.show();
            } else {
                Dom.top_nav.hide();
                Dom.bottom_nav.hide();
                Dom.font_containor.hide();
                Dom.font_con.removeClass('active');
            }
        });
        Dom.font_con.click(function(){
            if(Dom.font_containor.css('display') == 'none') {
                Dom.font_containor.show();
                Dom.font_con.addClass('active');
            } else {
                Dom.font_containor.hide();
                Dom.font_con.removeClass('active');
            }
        });

        $('#night-con').click(function(){
            //todo 触发背景切换的事件
            if(Dom.night_day_switch_button.hasClass('active')){
                //白天效果
                dayStatus();
            } else {
                //夜间效果
                nightStatus();
            }
        });

        //字体加大
        $('#large-font').click(function () {
            if(initFontSize < 20) {
                initFontSize += 1;
                RootContainer.css('font-size',initFontSize);
                Util.StorageSetter('font_size',initFontSize);
            } else {
                return;
            }
        });

        //字体减小
        $('#small-font').click(function () {
            if(initFontSize > 14) {
                initFontSize -= 1;
                RootContainer.css('font-size',initFontSize);
                Util.StorageSetter('font_size',initFontSize);
            } else {
                return;
            }
        });

        $('.font-bg-p button').each(function (index) {
            $(this).click(function(){
                initBgColor = $(this).css('background-color');
                Util.StorageSetter('bg_color',initBgColor);
                $(this).siblings('button').css('border','none');
                $(this).css('border','1px solid #ff7800');
                $('body').css('background-color',initBgColor);
                RootContainer.css('color','#000');
                Util.StorageSetter('font_color','#000');
                Util.StorageSetter('bg_color_index',index);
                Dom.night_day_switch_button.removeClass('active');
                Dom.night_day_switch_button.html('夜间');
                if(index == 4) {
                    RootContainer.css('color','rgb(118, 133, 162)');
                    Util.StorageSetter('font_color','rgb(118, 133, 162)');
                    Dom.night_day_switch_button.addClass('active');
                    Dom.night_day_switch_button.html('白天');
                }
            });
        });

        //滚动时菜单隐藏
        Win.scroll(function(){
            Dom.top_nav.hide();
            Dom.bottom_nav.hide();
            Dom.font_containor.hide();
            Dom.font_con.removeClass('active');
        });

        /*翻页*/
        $('#prev_button').click(function(){
            //todo  获得章节的翻页数据-->把数据拿出来渲染
            readerModel.prevChapter(function(data){
                readerUI(data);
            });

        });
        $('#next_button').click(function(){
            //todo
            readerModel.nextChapter(function(data){
                readerUI(data);
            });
        });
    }

    main();

})();