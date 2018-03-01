import '../common/global'
import './article.less'

import * as Global from '../common/global'

//储存下之前的tab内容
var Tabs = {};

function main() {
    //初始化panel
    initPanel();

    //绑定事件
    initEvent();
}

//初始化tab模块
function initPanel() {
    //获取tab title数据并渲染
    getTabData();

    //获取首屏list数据并渲染
    getListData({
        type : 'list',
        Url : 'https://www.easy-mock.com/mock/5a1e634e15c0e55e4197fd16/st/news/',
        param : {
            id: 3
        }
    });
}

function initEvent() {
    //tab切换绑定
    BindEvent('.st-tab-nav', function ( $target, $parent ) {
        //切换当前nav的active
        Global.changeTabClass($target, $parent , 'st-nav-item-active' );
        //获取当前nav下的tab
        let tabId = getId( $target );
        console.log( 'this Nav Id is:' + tabId );
        let data = Tabs[ tabId ];
        //渲染分类
        render({
            data: data,
            selector: '.st-tab-thumb',
            type:'tabThumb',
            method: 'replaceWith'
        });
        //渲染list
        getListData({
            type: 'list',
            Url : 'https://www.easy-mock.com/mock/5a1e634e15c0e55e4197fd16/st/news',
            param : {
                id: data[0].id
            }
        });
    });

    //分类切换绑定
    BindEvent('.st-tab-panel',function ( $target, $parent ) {
        //切换当前tab的active
        Global.changeTabClass($target, $parent.find('.st-tab-thumb'), 'st-thumb-item-active' );
        let tabId = getId( $target );
        //渲染list
        getListData({
            type: 'list',
            Url : 'https://www.easy-mock.com/mock/5a1e634e15c0e55e4197fd16/st/news'
        });

    });

    //list点击绑定
    BindEvent('.st-tab-content', function ( $target, $parent ) {
        if($('.st-tab-detail')[0].tagName === 'UL'){
            let articleId = getId( $target.parent('.st-article-item') );
            //渲染article
            getListData({
                type: 'article',
                Url : 'https://www.easy-mock.com/mock/5a1e634e15c0e55e4197fd16/st/news/10',
                param : {
                    id: articleId
                }
            });
        }
    })
}

//绑定事件
function BindEvent( selector, fn ) {
    let $selector = $( selector );
    $selector.on('click', function ( event ) {
        event.stopPropagation();
        event.preventDefault();
        let $target = $( event.target );
        fn( $target, $selector );
    })
}

function getId( $target ) {
    console.log($target);
    let id;
    let patt = /\d+/i;
    let idString = $target.attr("id");
    id = idString.match( patt )[0];
    return id;
}

/* 获取首屏数据
 * */
function getTabData() {
    let _self = this;
    $.ajax({
        type:'GET',
        url:'https://www.easy-mock.com/mock/5a1e634e15c0e55e4197fd16/st/cates',
        // data:{
        //     c : 'cate',
        //     m : 'index'
        // },
        success: function ( res ) {
            if( res.ret !== 0 ){
                Tabs = res.data.child;
                render({
                    data: res.data.parent,
                    selector: '.st-tab-nav',
                    type:'tabNav',
                    method: 'append'
                });
                render({
                    data: res.data.child[1],
                    selector: '.st-tab-thumb',
                    type:'tabThumb',
                    method: 'replaceWith'
                });
            }else{
                alert( res.msg );
            }
        }
    })
}

/* getListData 渲染DOM内容
 * @param {
 *      param: {} 需要传入的参数
 *      type: string 选择的模板类型
 *      method: string 渲染的方式
 * }
 * */
function getListData( { type = '', Url = '', param = {} } ) {
    let _self = this;
    let domData;
    $.ajax({
        type:'POST',
        url: Url,
        data: param,
        success: function ( res ) {
            if( res.ret !== 0 ){
                if(type === 'list'){
                    domData = res.data.new_list;
                }else{
                    domData = res.data;
                }

                render({
                    data: domData,
                    selector: '.st-tab-detail',
                    type: type,
                    method: 'replaceWith'
                });
            }else{
                alert( res.msg );
            }
        }
    })
}


/* render 渲染DOM内容
 * @param {
 *      data: [] || {} 传入的数据
 *      selector: string 选择器
 *      type: string 选择的模板类型
 *      method: string 渲染的方式
 * }
 * */
function render( {data = {}, selector = '', type = '', method = '' } ) {
    let mapData = handleData( data );
    let fragmentDocument = renderData( mapData, type );
    addDOM( selector, fragmentDocument, method );
}

/* handleData 处理需要转换的数据
 * @param data [] || {} 传入的数据
 * */
function handleData( data  = {} ) {
    let mapData = data;

    if( data instanceof Array ){
        mapData = data.map((item) => {
            if( item.add_time ){
                item.time = Global.getLocalTime( item.add_time );
            }
            return item;
        });
    }else if( data instanceof Object && data.add_time ){
        data.time = Global.getLocalTime( data.add_time );
        mapData = data;
    }

    return mapData;
}

/* renderData 将处理好的数据,渲染成dom节点字符串
 * @param data [] || {} 传入的数据
 * @param type string 选择的模板类型
 *  */
function renderData( data, type ) {
    let template = '';
    switch (type){
        case 'list':
            {
                template = `<ul class="st-article-list st-tab-detail">
                        ${ (() => {
                            var string = '';
                            data.forEach(( item ) => {
                                string += `<li class="st-article-item" id="${ 'article' + item.id }">
                                                <div class="st-article-title ellipse">${ item.title }</div>
                                                <span class="st-article-time">${ item.time }</span>
                                           </li>`;
                            });
                        return string;
                })() }</ul>`;
            }
            break;
        case 'article':
            {
                template = `<div class="st-article-detail st-tab-detail">
                                <div class="article-detail-title">
                                    <h1 class="ellipse">${ data.title }</h1>
                                    <span class="article-detail-time">${ data.time }</span>
                                </div>
                                <div class="article-detail-content">${ data.content }</div>
                            </div>`;
            }
            break;
        case 'tabNav':
            {
                data.forEach(( item ) => {
                    template += `<li class="st-nav-item" id=${'nav' + item.id}> ${ item.name } </li>`;
                });
            }
            break;
        case 'tabThumb':
        {
            template = `<ul class="st-tab-thumb">
                        ${ (() => {
                var string = '';
                    data.forEach(( item ) => {
                        string += `<li class="st-thumb-item" id="${ type + item.id }">${ item.name }</li>`;
                    });
                return string;
            })() }</ul>`;
        }

            break;

    }

    return template;
}

/* addDOM 将渲染好的dom节点插入到页面中
*  @param selector string【css选择器】 需要渲染的目标节点
*  @param fragmentDOM stringDOM  渲染好的dom节点字符串
*  @param type string 添加到目标节点的渲染方式 append/replaceWith etc.
 *  */
function addDOM( selector, fragmentDocument , type ) {
    $( selector )[type]( fragmentDocument );
}

main();