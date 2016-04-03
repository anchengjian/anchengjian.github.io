;(function (win,doc){
  'use strict';

  // rem响应式兼容设备
  var docEl = doc.documentElement,
      style = require('./style.less'),
      resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
      recalc = function () {
        var clientWidth = docEl.clientWidth,
            clientHeight = docEl.clientHeight;
        if (!clientWidth) return;
        if (clientWidth>clientHeight){
          clientWidth=clientHeight;
          docEl.classList.remove('vertical');
          docEl.classList.add('horizontal');
        }else{
          docEl.classList.remove('horizontal');
          docEl.classList.add('vertical');
        }
        if (clientWidth > 512) clientWidth=512;
        docEl.style.fontSize = Math.floor(10 * (clientWidth / 320)) + 'px';
      };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);

  function Libs(opt){
    this.opt=opt;
  };

    // 递归
  function buildParams( prefix, obj, add ){
    var name;
    if(Object.prototype.toString.call(obj)==='[object Array]'){
      // Serialize array item.
      Array.prototype.map.call(obj, function(v,i){
        // Item is non-scalar (array or object), encode its numeric index.
        buildParams(
          prefix + "[" + ( typeof v === "object" && v !== null ? i : "" ) + "]",
          v,
          add
        );
      });
    }else if(Object.prototype.toString.call( obj ) === '[object Object]'){
      // Serialize object item.
      for ( name in obj ) {
        buildParams( prefix + "[" + name + "]", obj[ name ], add );
      }
    } else {
      // Serialize scalar item.
      add( prefix, obj );
    }
  }

  // serialization序列化参数
  // $.serialization({name:'admin', tags:['root','geek']})  ==> &name=admin&tags[]=root&tags[]=geek
  Libs.prototype.serialization=function(a) {
    var prefix,
        s = [],
        add = function(key,value){
          // If value is a function, invoke it and return its value
          value = Object.prototype.toString.call(value)==='[object Function]' ? value() : ( value === null ? "" : value );
          s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
        };

    // If an array was passed in, assume that it is an array of form elements.
    if (Object.prototype.toString.call(a)==='[object Array]'){
      // Serialize the form elements
      Array.prototype.map.call(a, function(e,i){
        add( i, e );
        return e;
      });
    }else{
      for(prefix in a){
        buildParams( prefix, a[ prefix ], add );
      }
    }

    // Return the resulting serialization
    return s.join( "&" );
  };

  // ajax 封装模块
  // 仿jq格式调用，若还需要其他姿势（如JS跨域常用到的jsonp等）请自行扩展
  // $.ajax({
  //   url: "http://xxx.com/api/test",
  //   type: "get",
  //   data: {
  //     page: 1
  //   },
  //   headers:{
  //    'Content-Type':'application/x-www-form-urlencoded',
  //    'Accept':'application/json'
  //   },
  //   success:function(data){
  //     console.log(data)
  //   },
  //   error:function(data){
  //     console.error(data)
  //   }
  // })
  Libs.prototype.ajax=function(a){
    if(!a.hasOwnProperty('url')) return false;
    var xmlhttp=new XMLHttpRequest(),
        i=null,
        s={
          type:'get',
          headers:{
            'Content-Type':'application/x-www-form-urlencoded',
            'Accept':'application/json'
          },
          data:null
        };

    // 默认赋值
    for(i in a){
      if(Object.prototype.toString.call(a[i])==='[object object]'){
        for(var j in a[i]){
          s[i][j]=a[i][j];
        }
      }else{
        s[i]=a[i];
      }
    }

    // 序列化发送的数据
    s.data=s.data && this.serialization(s.data);

    // 状态交互
    xmlhttp.addEventListener('load',function(event){
      var status=xmlhttp.status,
          isSuccess=status >= 200 && status < 300 || status === 304,
          res=null;
      // 一刀切，我就是这样的霸气 - -、
      try{
        res=JSON.parse(xmlhttp.responseText);
      }catch(err){
        res=xmlhttp.responseText;
      }

      if (isSuccess && s.hasOwnProperty('success')){
        s.success(res);
      }else if(s.hasOwnProperty('error')){
        s.error(res);
      }
    });

    // 发送数据
    if(s.type.toLowerCase()==='post'){
      xmlhttp.open(s.type,s.url,true);
      for(i in s.headers) xmlhttp.setRequestHeader(i,s.headers[i]);
      xmlhttp.send(s.data);
    }else{
      var tmpUrl=s.url+(s.data ? '?'+s.data : '');
      xmlhttp.open(s.type,tmpUrl,true);
      for(i in s.headers) xmlhttp.setRequestHeader(i,s.headers[i]);
      xmlhttp.send(null);
    }
  };

  // 获取查询参数解析器，例如：传 "?page=12&list=20" 返回对象 {page:'12',list:'20'}
  Libs.prototype.getQueryParams=function(url){
    url = url || window.location.href;
    var search = url.substring(url.lastIndexOf("?") + 1),
        res = {};
    search.replace(/([^?&=]+)=([^?&=]*)/g, function (rs, $1, $2){
        res[decodeURIComponent($1)] = String(decodeURIComponent($2));
        return rs;
    });
    return res;
  };

  module.exports = new Libs();

})(window, document);