/**
 * Created by 小黑 on 2017/11/24.
 */
//判断登录的客户端（打包之后生效）
//设置全局font-size 做响应式
//引入公共模块

import 'assets/css/base.css'
import 'assets/css/common.less'

export function changeTabClass( $target = {}, $parent = {}, className = '' ) {
    let $prevActive = $parent.find( '.' + className );
    if($prevActive){
        $prevActive.removeClass( className );
    }
    $target.addClass( className );
}

export function tgetData() {
    console.log('test Global');
}

/* getLocalTime 将时间戳转换为年-月-日的显示形式 */
export function getLocalTime (nS) {
    Date.prototype.toLocaleString = function() {
        return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate();
    };
    //return new Date(parseInt(nS) * 1000).toLocaleString().replace(/\//g,'-');
    return new Date(parseInt(nS) * 1000).toLocaleString();
}
