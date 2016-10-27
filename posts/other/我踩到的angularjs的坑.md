# 我踩到的angularjs的坑

最近的一个项目，突发奇想用mvc的框架进行开发，前端的mvc像一颗结了霜的葡萄，很是诱人。然而前端领域大家重复造轮子又非常热情。选哪个好呢？思来想去，再后端的支持下（很奇怪，为什么是后端支持。。。）毅然决然的选择呢angular。

在使用的过程中首先是一个学习的过程。

相信这个不用多讲。对于新手的建议，特别是没有后端开发经验的同学的建议是，先看demo，先看看用angular究竟能干多么酷的事情，然后开始看文档，由于angularjs.org国内打不开（最近好想又可以打开了），觉得梯子难搭的同学可以看[http://ngnice.com/](http://ngnice.com/)，直接看里面的文档[http://docs.ngnice.com/api](http://docs.ngnice.com/api) ，可以看1.2.18这个版本（我用的是1.4.3的版本。。。。最近2又要出来了，Github上面看了下，还是等它的正式版出来后再用它比较好）

直接上手的话，可以看[http://www.angularjs.cn/tag/AngularJS](http://www.angularjs.cn/tag/AngularJS) 一步一步的直接就上手了。

总体而言，学习曲线比较陡峭，上手了再看文档就能一步一步的深化了。之前碰到的很多大家基本都碰到过，随便百度谷歌一下都有答案。下面纪录几个，不太容易找到解决方案的坑：

0、angular的$http.post发送的数据在php服务器端无法通过$_REQUEST/$_POST���收的问题。

粗看一下，angular和jQuery的post用法差不多，但是为什么就是接收不了呢？哈哈，这是因为两者的post对header的处理有所不同，jQuery会把作为JSON对象的postData序列化，例如：

```JavaScript
var postData={
    "name":"admin",
    "pwd:"123123"
}
// jQuery在post数据之前会把postData转换成字符串："name=admin&pwd=123123"
```

那么解决方法是什么呢？别着急，我把我弄的最简单的方法给出来吧 － －

针对服务器端（PHP）
通过 `$params = json_decode(file_get_contents('php://input'),true);` 来获取数据 

针对前端，又细分了两种方法。
```JavaScript
//全局的更改post数据序列化
var app = angular.module("app", ["ngRoute", "$httpProvider",
function($httpProvider) {
    // 头部配置
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';
    $httpProvider.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';

    // 重写angular的param方法，使angular使用jquery一样的数据序列化方式  The workhorse; converts an object to x-www-form-urlencoded serialization.
    // @param {Object} obj
    // @return {String}
    var param = function(obj) {
        var query = '',
        name, value, fullSubName, subName, subValue, innerObj, i;
        for (name in obj) {
            value = obj[name];
            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&'
                }
            } else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&'
                }
            } else if (value !== undefined && value !== null) {
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&'
            }
        }
        return query.length ? query.substr(0, query.length - 1) : query
    };
    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data
    }]
}]);
```

或者局部的引用

```JavaScript
//首先创建两个函数
// angular post json to form

function param(obj) {
    var query = '',
    name, value, fullSubName, subName, subValue, innerObj, i;
    for (name in obj) {
        value = obj[name];
        if (value instanceof Array) {
            for (i = 0; i < value.length; ++i) {
                subValue = value[i];
                fullSubName = name + '[' + i + ']';
                innerObj = {};
                innerObj[fullSubName] = subValue;
                query += param(innerObj) + '&'
            }
        } else if (value instanceof Object) {
            for (subName in value) {
                subValue = value[subName];
                fullSubName = name + '[' + subName + ']';
                innerObj = {};
                innerObj[fullSubName] = subValue;
                query += param(innerObj) + '&'
            }
        } else if (value !== undefined && value !== null) {
            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&'
        }
    }
    return query.length ? query.substr(0, query.length - 1) : query
};
function transform(data) {
    return param(data)
}

//然后在想用postData序列化的地方调用
$scope.login = function() {
    $routeParams.post('/postAction/', {  //之所以用$routeParams，不用$http是因为我用了ngRoute，在每个具体的controller中$routeParams取代了$http，算个小坑，不值提
        "name": "admin",
        "pwd": "123123"
    },
    {
        headers: { //此处修改的config是关键，先修改header，再序列化数据
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        transformRequest: transform
    }).success(function(data) {
        console.log(data)
    })
}
```

2、使用了ng-bind-html绑定了html代码到文档，同时里面又使用了ng-click的方法。

首先在使用了ng-bind-html的时候就会碰到一点坑（针对新手），因为默认的angular默认不开这个功能，需要你自己做一个过滤，才给你用innerHTML的方式展现出来。需要用的方法是$sce。文档在此，说的比我清楚 [http://docs.ngnice.com/api/ng/service/$sce](http://docs.ngnice.com/api/ng/service/$sce)

如果这个你搞定了，好了，可以通过ng-bind-html输出内容了，但是你却发现ng-click不能用了。好了，第二个坑。

一般而言，我们页面是由angular自己$compile完成后展现出来的。而你新插入的文档dom又没有经过$compile，直接展现的，所以。会出现那些事件不能用，那么该怎么办呢？哈哈，当然还是文档啦：[http://docs.ngnice.com/api/ng/service/$compile](http://docs.ngnice.com/api/ng/service/$compile) 。。。

下面给个最简单的解决办法，直接用就行了：
```JavaScript
// 默认的model是app啊，创建一个directive
app.directive('dir',
function($compile, $parse) {
    return {
        restrict: 'E',
        link: function(scope, element, attr) {
            scope.$watch(attr.content,
            function() {
                element.html($parse(attr.content)(scope));
                $compile(element.contents())(scope)
            },
            true)
        }
    }
})})
//需要用的地方直接调用
$scope.msgOperation="<span>点此 <a href='javascript:;' ng-click='getUserInfo()'>重新获取</a>用户信息</span>";
//静态partials模版文件中展现
// <dir content="msgOperation"></dir>
```

3、用
```JavaScript
$routeProvider.when('/user/:id', {
    templateUrl: 'partials/user.html',
    controller: 'userCtrl'
})
```
的方式传了id后，在controller用$routeParams.id的方式不能获取参数的坑。具体的还是要看文档：[http://docs.ngnice.com/api/ngRoute/service/$routeParams](http://docs.ngnice.com/api/ngRoute/service/$routeParams) 大意是当时还为解析完成就进行了获取。最简单的解决方法，文档里面已经说了，但是我还是要说一下。
```JavaScript
//$route.current.params会解析url地址中的参数，如上获取id值的方法
$route.current.params.id 
```

暂时写这么多，以后碰到了再继续写。

同时欢迎大家一起讨论学习

[LOFTER：不爱吃西红柿的鱼](http://anchengjian.lofter.com)   [http://anchengjian.lofter.com/post/3217ba_80a5f72](http://anchengjian.lofter.com/post/3217ba_80a5f72)