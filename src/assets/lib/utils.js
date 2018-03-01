/**
 * Created by 小黑 on 2017/10/19.
 */
var res = {
    ret: 0,
    data: {
        info_list: [
            {
                name: "新服黑鳄战刀",
                game_id: "17",
                game_name: "魔法门挂机",
                game_img: "",
                push_time: "1509415200",
                is_android: "1",
                is_ios: "1"
            },
            {
                name: "新服破军突击",
                game_id: "16",
                game_name: "重装突击",
                game_img: "",
                push_time: "1506564000",
                is_android: "1",
                is_ios: "0"
            },
            {
                name: "新服s24-我勒个去",
                game_id: "15",
                game_name: "十万个冷笑话2",
                game_img: "",
                push_time: "1506222000",
                is_android: "1",
                is_ios: "0"
            },
            {
                name: "新服陈仓暗渡",
                game_id: "10",
                game_name: "三国战纪群雄逐鹿",
                game_img: "",
                push_time: "1505966400",
                is_android: "1",
                is_ios: "0"
            },
            {
                name: "新服铁索连环",
                game_id: "44",
                game_name: "一骑当千2",
                game_img: "",
                push_time: "1509415200",
                is_android: "1",
                is_ios: "0"
            },
            {
                name: "新服死亡森林",
                game_id: "39",
                game_name: "乐土",
                game_img: "",
                push_time: "1509417000",
                is_android: "1",
                is_ios: "0"
            },
            {
                name: "新服46服",
                game_id: "50",
                game_name: "西游诀",
                game_img: "",
                push_time: "1509418800",
                is_android: "1",
                is_ios: "0"
            },
            {
                name: "新服399服 梦绕魂牵",
                game_id: "121",
                game_name: "永恒仙域",
                game_img: "",
                push_time: "1509440400",
                is_android: "1",
                is_ios: "0"
            },
            {
                name: "新服398服 浮生若梦",
                game_id: "121",
                game_name: "永恒仙域",
                game_img: "",
                push_time: "1509415200",
                is_android: "1",
                is_ios: "0"
            }
        ],
        all_page: 3
    }
};



function Event () {
    this.eventList = {}
}

Event.prototype.on = function ( key, fn ) {
    if( ! this.eventList[ key ] ){
        this.eventList[ key ] = [];
    }
    this.eventList[ key ].push(fn);
};

Event.prototype.emit = function () {
    var key = Array.prototype.shift.apply(arguments),
        cache = this.eventList[key];
    if( cache ){
        for(var i = 0, fn; fn = cache[i++];){
            fn.apply(this, arguments);
        }
    }
};

Event.prototype.remove = function ( key, fn ) {
    var cache = this.eventList[key];

    if( cache ){
        if(fn){
            for(var i = 0, itemFn; itemFn = cache[i++];){
                if ( fn === itemFn ){
                    cache.splice( i, 1 );
                }
            }
        }else{
            this.eventList[key] = [];
        }
    }
};

// 工具函数
var utils = {

    //获取url参数
    getParams : function () {
        var url = window.location.href;
        var params = url.split('/');

        return params[params.length - 2];
    },

    //获取cate和tag的name
    setDataItem : function (item) {
        var _self = this;
        item.cate = _self.getText(globalData.cates, item.cate_id);

        item.tags = item.tags.map( function (item) {
            return _self.getText(globalData.tags, item.tag_id );
        });
    },

    //判断是否在数字范围
    checkNum: function (value) {
        var Regx = /^[0-9]*$/;
        if ( Regx.test(value)) {
            return true;
        }else{
            return false;
        }
    },

    getText : function (targetArr, id){
        var i = 0,
            name = '',
            len = targetArr.length;

        for( i; i < len; i++){
            if(id !== 0 && targetArr[i].id === id){
                name =  targetArr[i].name;
                break;
            }
        }
        return name;
    },

    getLocalTime: function (nS) {
        return new Date(parseInt(nS) * 1000).toLocaleString().replace(/\//g,'-');
    }
};

/**
 * LoadData对象： 加载更多数据功能-通用
 *
 * config对象
 *      config = {
*          btn: btn选择器 必选
*          list:  被插入的列表的选择器 必选
*          url: 数据接口 必选
*          id: number dom节点类型 必选
*              0: 主页资讯模板
*              1: 找游戏列表模板
*              2: [侧边]最新游戏列表模板
*          listType: ''  可选  获取的data的数据类型 'game'：游戏类型的数据; 其他：其他类型的数据
*          renderType: '' 可选 渲染的方式 'refresh': 刷新; 'load': 下拉加载
*          limit: ajax发送的参数 可选
*      }
 * */

function LoadData( config ) {
    this.main( config );
}

LoadData.prototype.main = function ( config ) {
    this.init( config );
    this.$btn.data( this.targetName, { dom: this.$list, lastPage: this.page } );
    this.bindBtnEvent( this.$btn, this.$list, "click" );
};

/*初始化一些全局参数*/
LoadData.prototype.init = function ( config ) {

    this.$btn = $(config.btn);
    this.$list = $(config.list);
    this.page = config.page || 2;
    this.listType = config.listType || 'game';
    this.renderType = config.renderType || 'load';
    this.id = config.id || 4;
    this.limit = config.limit || '';
    this.url = config.url;
    this.targetName = config.targetName;


    if( config.limit ){
        this.limit =  config.limit;
    }
    var key = utils.getParams();

    if(key){
        switch(key){
            case 'mobile' : this.type = key; break;
            case 'h5' : this.type = key; break;
            case utils.checkNum(key): this.url = config.url + key;
            default : this.cate = key;
        }
    }



    //插入节点的方式
    this.addNodeMethod = {
        load : 'append',
        refresh : 'replaceWith'
    };

};

LoadData.prototype.reset = function ( config ) {

    this.url = config.url;
    this.$list = $(config.list);
    this.targetName = config.targetName;
    var pageObj = this.$btn.data( this.targetName );


    if( pageObj ) {
        this.page = pageObj.lastPage;
        if( !pageObj.all_page ){
            this.resetBtnStyle(this.$btn);
        }
        this.rebindBtnEvent(this.$btn, this.$list, "click", this.targetName);
    }else{
        this.$btn.data( this.targetName, { dom: this.$list, lastPage: 2 } );
        this.bindBtnEvent( this.$btn, this.$list, "click" );
    }

};


LoadData.prototype.resetBtnStyle = function (selector) {
    selector.removeClass('game-list-more-end');
    selector.text( "点击加载更多.." );

};
/*绑定事件*/
LoadData.prototype.bindBtnEvent = function ( selector, $target, eventType ) {
    var _self = this;

    //给btn绑定events对象，将绑定过的事件加入到该对象中
    var event = selector.data( "events" ) ? selector.data("events")[ eventType ] : '';
    if( ! event ){
        var events = {};
        events[ eventType ] = true;
        selector.data( "events", events );
    }


    //每点击一次，加载数据，并记录下最后的page数;
    selector.on( eventType, function () {
        var lastPage = selector.data( this.targetName )[ "lastPage" ] = _self.page++;
        console.log(selector.data( this.targetName ));
        _self.getListData( _self.listType, _self.renderType, $target, lastPage);
    });

};

LoadData.prototype.removeEvent = function ( selector, eventType ) {

    //清除btn.event的该事件
    console.log( eventType );
    selector.off( eventType );

};

LoadData.prototype.rebindBtnEvent = function ( selector, $target, eventType, targetName ) {
    var _self = this;

    if ( selector.data("events")[eventType] ) {
        // 如果该事件被绑定过且该类型的target不同于之前的 则先解除之前绑定的 再重新绑定

        if(selector.data( targetName )["dom"] !== $target ){
            this.removeEvent( selector, eventType );
            this.bindBtnEvent( selector, $target, eventType, targetName );
        }
    }
    //如果该事件没有被绑定过
    // if( !selector.data("events")[ eventType ]){
    //     this.bindBtnEvent( selector, $target, eventType, targetName );
    // }


};

/**
 * LoadData.prototype.getListData 发送ajax 获取新数据
 * @params $target 需要插入的父节点
 * @params type 获取的数据类型 game or news etc.
 * @params renderType 选择元素插入节点的方式
 * */
LoadData.prototype.getListData = function ( type, renderType, $target, lastPage ) {
    var _self = this;
    var configObj = {
        type: "GET",
        url: _self.url,
        data: {
            page : lastPage,
            type : _self.type,
            limit : _self.limit
        },
        dataType:"json"
    };
    //如果是获取的游戏数据，需要查找cate名和tag名
    var lists = res.data[ type + '_list' ];
    if( lists.length ){
        //如果是获取的游戏数据，需要查找cate名和tag名
        if( type == 'game' ){
            lists.map(function( item ){
                utils.setDataItem(item);
            });
        }
        //获取到最后一条数据时的钩子函数
        if( lastPage > res.data.all_page ){

            if( renderType == 'load' ){
                _self.$btn.addClass('game-list-more-end');
                _self.$btn.data('allPage', res.data.all_page);
                _self.$btn.text( "已经到底啦！" );
                _self.$btn.off( "click" );
            }
            if( renderType == 'refresh' ){
                _self.page = 1;
            }
        }

        //渲染最新数据到页面
        _self.renderDom( $target, lists, renderType );
    }
};

/**
 * LoadData.prototype.renderDom 渲染节点
 * */

LoadData.prototype.renderDom = function ( $target, data, renderType ) {
    var type = this.addNodeMethod[renderType];
    var len = data.length,
        i = 0 , node;

    var childrenDom = $target.children("li");
    for( i ; i < len ; i++){
        node = this.createListItem( data[i], this.id );

        if(type == 'replaceWith'){
            $(childrenDom[i])[type](node);
        }else{
            $target[type](node);
        }
    }
};

/**
 * LoadData.prototype.createListItem  创建单个节点Dom结构,并插入获取到的数据
 * @return DomString[key] 返回对应节点的信息
 * */
LoadData.prototype.createListItem = function (item, id) {
    var _self = this,
        DomString = [],
        newsCateName = {
            news: '资讯',
            gonglve: '攻略',
            shipin: '视频',
            pingce: '评测'
        };

    //创建icon
    var iconDomString = '';
    if(item.is_android){
        iconDomString += this.createIcons('anzhuo');
    }
    if(item.is_ios){
        iconDomString += this.createIcons('iOS');
    }

    //创建tag
    if(item.tags && item.tags.length){
        var tag = item.tags[0];
        var tagDomString = this.createTags(item.tags);
    }


    //format Time
    if(item.push_time){
        var time = utils.getLocalTime(item.push_time);
    }


    DomString[0] = '<div class="game  news-list-item"><div class="game-pic"><a href="/topic/'
        + item.id
        + '" target="_blank"><img src="'
        + item.img
        + '" alt="'
        + item.title
        + '"></a></div><div class="game-content"><div class="news-item-head"><a class="news-item-logo" href="/game/detail/'
        + item.game_id
        + '" target="_blank"><img src="'
        + item.game_img
        + '" alt="'
        + item.game_name
        + '"></a><div class="news-item-title">'
        + '<h2><a class="ellipse" href="/topic/'
        + item.id
        + '" target="_blank">'
        + item.title
        + '</a></h2><div class="news-item-desc"><span class="cate-common news-desc-cate ellipse">'
        + newsCateName[_self.cate]
        + '</span><div class="article-time ellipse"><span class="iconfont icon-shijian"></span>'
        + time
        + '</div></div></div></div><p class="news-item-content ellipse">'
        + item.intro
        + '</p></div></div>';

    DomString[1] = '<li><a class="game-panel-logo" href="/game/detail/'
        + item.id
        + '"><img src="'
        + item.img
        + '" alt=""></a><div class="game-panel-detail"><h2><a href="/game/detail/'
        + item.id
        + '" alt="">'
        + item.name
        + '</a>'
        + iconDomString
        + '</h2><div class="game-panel-describe"><p>类型： <span>'
        + item.cate
        + '</span></p><p><span>'
        + item.nums
        + '</span>人关注</p></div><div class="game-panel-tags">'
        + tagDomString
        + '</div></div></li>';

    DomString[2] = '<li><div class="gl-detail"><a href="/game/detail/'
        + item.id
        + '" target="_blank"><img src="'
        + item.img
        + '" alt="'
        + item.name
        + '"></a><div><h2><a href="/game/detail/'
        + item.id
        + '" target="_blank">'
        + item.name
        + '</a></h2><span>'
        + item.cate
        + '</span><span>'
        + tag
        + '</span></div></div><div class="gl-btn">关注</div></li>';

    DomString[3] = '<li class="os-list-item"><div class="os-item-time"><span class="iconfont icon-shijian"></span>' +
        + time
        + '</div><div class="os-item-game"><img src="'
        + item.game_img
        + '" alt="'
        + item.game_name
        + '"><h2>'
        + item.game_name
        + '</h2>'
        + tag
        + '</div><p class="os-item-server">'
        + item.name
        + '</p><a href="/fuli/'
        + item.id
        + '" class="os-item-btn">下载</a></li>';

    return DomString[id - 1];
};

LoadData.prototype.createIcons = function (key) {
    var domString = '<span class="iconfont icon-' + key + '"></span>';

    return domString.trim();
};

LoadData.prototype.createTags = function (tags) {
    var domString = '',
        len = tags.length,
        i = 0;

    for ( i ; i < len; i++ ) {
        domString += '<span>' + tags[i] + '</span>'
    }

    return domString;
};



export { utils }