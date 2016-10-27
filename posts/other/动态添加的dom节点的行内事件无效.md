# 动态添加的dom节点的行内事件无效

动态添加的dom节点的行内事件无效，比如onclick事件等。我的解决办法是在创建新的节点后，同时在添加监听点击事件，而不是写行内事件。谨记！

同时看到了jq的解决方案是live()函数，原理是将事件绑定到父节点,由于事件冒泡，所有事件最终会冒泡到document节点，当有事件触发时，则判断事件类型和触发事件的元素是否一致，如果相同则执行函数。

[LOFTER：不爱吃西红柿的鱼](http://anchengjian.lofter.com)&nbsp;&nbsp;&nbsp;[http://anchengjian.lofter.com/post/3217ba_78c886a](http://anchengjian.lofter.com/post/3217ba_78c886a)