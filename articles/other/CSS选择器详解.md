选择器是CSS的核心，从最初的元素、class/id选择器，演进到伪元素、伪类，以及CSS3中提供的更丰富的选择器，定位页面上的任意元素开始变得愈发的简单。

**1、元素选择器**

这是最基本的[CSS选择器](http://m.weibo.cn/h2w?url=http%3A%2F%2Fwww.uisdc.com%2Ftag%2Fcss%25e9%2580%2589%25e6%258b%25a9%25e5%2599%25a8&amp;from=weibo)，HTML文档中的元素本身就是一个选择器：

p {line-height:1.5em; margin-bottom:1em;}

**2、关系选择器**

E F：后代选择器，该选择器定位元素E的后代中所有元素F：

ul li {margin-bottom:0.5em;}

E > F：子选择器，该选择器定位元素E的直接子元素中的所有元素F，它将忽略任何进一步的嵌套：

ul > li {list-style:none;} //仅限ul的直接子元素li，如果li里面还嵌套着另一个 ul 结构时，最里面的 li 将被忽略

E + F：相邻兄弟选择器，该选择器定位与元素E具有相同父元素且在标记中紧邻E的元素F：

li + li {border-top:1px solid #ddd;} //定位具有相同父元素ul里除第一个li之外的所有li

E ~ F：一般兄弟选择器，该选择器定位与元素E具有相同父元素且在标记中位于E之后的所有元素F：

h1 ~ p {color:#f00;} //定位具有相同父元素的，h1标签之后的所有p标签

**3、属性选择器**

E[attr]：该选择器定位具有属性attr的任何元素E：

input[required] {border:1px solid #f00;} //定位页面里所有具有必填属性"required"的input

E[attr=val]：该选择器定位具有属性attr且属性值为val的任何元素E：

input[type=password] {border:1px solid #aaa;} //定位页面里的密码输入框

E[attr|=avl]：该选择器定位具有属性attr且属性值为val或以val-开始的任何元素E：

p[class|=a] {color:#333;} //定位页面里所有的P段落里具有class属性且属性值为a或是a-开始的，比如class="a"以及class="a-b"

E[attr~=val]：该选择器定位具有属性attr且属性值为完整单词 val 的任何元素E：

div[title~=english] {color:#f88;} //定位页面里所有具有属性title且属性值里拥有完整单词english的div容器，比如title="english"以及title="a english"

E[attr^=val]：该选择器定位具有属性attr且属性值以val开头的任何元素E：

div[class^=a] {color:#666;} //定位页面里具有属性class且属性值以a开头的div容器，比如class="a"以及class="ab"

E[attr$=val]：该选择器与E[attr^=val]正好相反，定位具有属性attr且属性值以val结尾的任何元素E：

div[class$=a] {color:#f00;} //定位页面里具有属性class且属性值以a结尾的div窗口，比如class="nba"以及class="cba"

E[attr*=val]：该选择器与E[attr~=val]相似，但更进一步，定位具有属性attr且属性值任意位置包含val的元素E，val可以是一个完整的单词，也可以是一个单词中的一部分：

a[title*=link] {text-decoration:underline;} //定位所有title里具有link字符串的a链接

**4、伪类**

:link：未访问的链接；

:visited：已访问的链接，不建议使用；

:hover：鼠标移动到容器，不仅限于链接，可用于页面中的任何元素；

:active：被激活时的状态，不仅限于链接，可用于任何具有tabindex属性的元素；

:focus：获得焦点时状态，不仅限于链接，可用于任何具有tabindex属性的无线：

input:focus {border:1px solid #333;} //输入框获得焦点时的样式

:enabled：已启用的界面元素：

input:enabled {border:1px solid #899;}

:disabled：已禁用的界面元素：

input:disabled {background:#eee;}

:target：该选择器定位当前活动页面内定位点的目标元素：

#info:target {font-size:24px;} //当访问的URL网址为 123.html#info 时，id="info"将加载这个字体样式

:default：应用于一个或多个作为一组类似元素中的默认元素的UI元素；

:valid：应用于有效元素：

input:valid {border:1px solid #6a6;} //当输入框验证为有效时加载这个边框样式，基于type或pattern属性

:invalid：应用于空的必填元素，以及未能与type或pattern属性所定义的需求相匹配的元素：

input:invalid {border:1px solid #f00;} //当输入框为空且必填时，或已填写但验证无效时，加载此边框样式

:in-range：应用于具有范围限制的元素，其中该值位于限制内；比如具有min和max属性的number和range输入框；

ut-of-range：与:in-range选择相反，其中该值在限制范围外；

:required：应用于具有必填属性required的表单控件；

ptional：应用于没有必填属性required的所有表单控件

:read-only：应用于其内容无法供用户修改的元素；

:read-write：应用于其内容可供用户修改的元素，比如输入框；

:root：根元素，始终指html元素；

E F:nth-child(n)：该选择器定位元素E的第n个子元素的元素F：

div.class p:nth-child(3) {color:#f00;} //class="class"的div容器里的第3个元素p，如果第3个子元素不是p，此样式将失效

E F:nth-last-child(n)：该选择器定位元素E的倒数第n个子元素的元素F；

E:nth-of-type(n)：该选择器定位元素E的第n个指定类型子元素；

E:nth-lash-of-type(n)：该选择器定位元素E的导数第n个指定类型子元素：

.class p:nth-child(2) 与 .class p:nth-of-type(2) 的区别在于，如果.class里的第2个子元素不是P元素时，.class p:nth-child(2) 的样式将无效，而.class p:nth-of-type(2) 将定位在 .class 里的第2个p元素

nth-child(n)、nth-last-child(n)、nth-of-type(n)、nth-last-of-type(n)，这其中的 n 可以使用数字静态式，比如 .nth-child(2n+1) 将匹配第1、3、5...个元素

E:first-child：父元素的第一个子元素E，与:nth-child(1)相同；

E:last-child：父元素的倒数第一个子元素E；

E:first-of-type：与:nth-of-type(1)相同；

E:last-of-type：与:nth-last-of-type(1)相同；

E:only-child：父元素中唯一的子元素E；

E:only-of-type：父元素中唯一具有该类型的元素E；

E:empty：没有子元素的元素，没有子元素包括文本节点；

E:lang(en)：具有使用双字母缩写(en)表示的语言的元素；

E:not(exception)：该选择器将选择与括号内的选择器不匹配的元素：

p:not(.info) {font-size:12px;} //匹配所有class值不为info的p元素

**5、伪元素**

伪元素可用于定位文档中包含的文本，为与伪类进行区分，伪元素使用双冒号 :: 定义，但单冒号 : 也能被识别。

::first-line：匹配文本首行；

::first-letter：匹配文本首字母；

::before 与 ::after ：使用 contnet 属性生成额外的内容并插入在标记中：

a[href^=http]::after {content:"link"} //在页面的a链接的后面插入文字link

::selection：匹配突出显示的文本：

::selection {background:#444; color:#fff;} //定义选中的文本颜色与背景色

当然，如果要方便的使用这些强大的[CSS选择器](http://m.weibo.cn/h2w?url=http%3A%2F%2Fwww.uisdc.com%2Ftag%2Fcss%25e9%2580%2589%25e6%258b%25a9%25e5%2599%25a8&amp;from=weibo)的话，使用Chrome、Firefox之类的浏览器吧，最起码得抛弃IE9以下的IE版本浏览器吧。

Unique Post

**非特殊说明，本文版权归原作者所有，转载请注明出处** 
本文地址：[http://www.uisdc.com/css-selector](http://m.weibo.cn/h2w?url=http%3A%2F%2Fwww.uisdc.com%2Fcss-selector&amp;from=weibo)

[LOFTER：不爱吃西红柿的鱼](http://anchengjian.lofter.com)   [http://anchengjian.lofter.com/post/3217ba_26c28cd](http://anchengjian.lofter.com/post/3217ba_26c28cd)