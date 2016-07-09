由于工作中团队合作开发的需要，svn用的比较多，同时又因为mac下没有小乌龟这么好用的管理工具，但是自带了svn命令行，用了一段时间也发现还是挺顺手方便的，所以把一些常用命令摘录过来，当作以后使用的备忘。

1、将文件checkout到本地目录
```bash
svn checkout path
```
path是服务器上的目录
例如：
```bash
svn checkout svn://192.168.1.1/pro/domain --username xxx --password xxx
```
简写：
```bash
svn co 
```

2、往版本库中添加新的文件
```bash
svn add file
```
例如：添加test.php
```bash
svn add test.php
```
添加当前目录下所有的php文件
```bash
svn add *.php
```

3、将改动的文件提交到版本库
```bash
svn commit -m "LogMessage" [-N] [--no-unlock] PATH
```
如果选择了保持锁，就使用–no-unlock开关
例如：
```bash
svn commit -m "add test file for my test" test.php
```
简写：
```bash
svn ci 
```

4、加锁/解锁
```bash
svn lock -m "LockMessage" [--force] PATH
```
例如：
```bash
svn lock -m "lock test file" test.php
svn unlock PATH 
```

5、更新到某个版本
```bash
svn update -r m path
```
例如：
```bash
svn update
```
如果后面没有目录，默认将当前目录以及子目录下的所有文件都更新到最新版本。
```bash
svn update -r 200 test.php
```
将版本库中的文件test.php还原到版本200
```bash
svn update test.php
```
更新，于版本库同步。如果在提交的时候提示过期的话，是因为冲突，需要先update，修改文件，然后清除svn resolved，最后再提交commit
简写：
```bash
svn up 
```

6、查看文件或者目录状态
```bash
svn status path
```
目录下的文件和子目录的状态，正常状态不显示【?：不在svn的控制中；M：内容被修改；C：发生冲突；A：预定加入到版本库；K：被锁定】
```bash
svn status -v path 
```
显示文件和子目录状态
第一列保持相同，第二列显示工作版本号，第三和第四列显示最后一次修改的版本号和修改人。
简写：
```bash
svn st
```
注：svn status、svn diff和 svn revert这三条命令在没有网络的情况下也可以执行的，原因是svn在本地的.svn中保留了本地版本的原始拷贝。

7、删除文件
```bash
svn delete path -m "delete test fle"
```
例如：
```bash
svn delete svn://192.168.1.1/pro/domain/test.php -m "delete test file"
```
或者直接
```bash
svn delete test.php
```
然后再
```bash
svn ci -m 'delete test file'
```
简写：
```bash
svn (del, remove, rm) 
```

8、查看日志
```bash
svn log path
```
例如：显示这个文件的所有修改记录，及其版本号的变化 
```bash
svn log test.php
```

9、查看文件详细信息
```bash
svn info path
```
例如：
```bash
svn info test.php 
```

10、比较差异
将修改的文件与基础版本比较
```bash
svn diff path
```
例如： 对版本m和版本n比较差异
```bash
svn diff test.php
svn diff -r m:n path
```
例如：
```bash
svn diff -r 200:201 test.php
```
简写：
```bash
svn di 
```

11、将两个版本之间的差异合并到当前文件
```bash
svn merge -r m:n path
```
例如：
```bash
svn merge -r 200:205 test.php
```
将版本200与205之间的差异合并到当前文件，但是一般都会产生冲突，需要处理一下

12、SVN 帮助 
```bash
svn help
svn help ci 
```

13、版本库下的文件和目录列表
```bash
svn list path
```
显示path目录下的所有属于版本库的文件和目录
简写：
```bash
svn ls 
```

14、创建纳入版本控制下的新目录
```bash
svn mkdir 创建纳入版本控制下的新目录。
```
用法:
```bash
mkdir PATH…
```
每一个以工作副本 PATH 指定的目录，都会创建在本地端，并且加入新增
调度，以待下一次的提交。
```bash
mkdir URL…
```
每个以URL指定的目录，都会透过立即提交于仓库中创建。
在这两个情况下，所有的中间目录都必须事先存在 

15、恢复本地修改
```bash
svn revert 
```
恢复原始未改变的工作副本文件 (恢复大部份的本地修改)。revert:
用法: 
```bash
revert PATH…
```
注意: 本子命令不会存取网络，并且会解除冲突的状况。但是它不会恢复
被删除的目录 

16、代码库URL变更
```bash
svn switch (sw)
```
更新工作副本至不同的URL。
用法: 
```bash
switch URL [PATH]
```
更新你的工作副本，映射到一个新的URL，其行为跟"svn update"很像，也会将
服务器上文件与本地文件合并。这是将工作副本对应到同一仓库中某个分支或者标记的
方法。
```bash
switch –relocate FROM TO [PATH...]
```
改写工作副本的URL元数据，以反映单纯的URL上的改变。当仓库的根URL变动
(比如方案名或是主机名称变动)，但是工作副本仍旧对映到同一仓库的同一目录时使用
这个命令更新工作副本与仓库的对应关系。 

17、解决冲突
```bash
svn resolved
```
移除工作副本的目录或文件的"冲突"状态。
用法: 
```bash
resolved PATH…
```
注意: 本子命令不会依语法来解决冲突或是移除冲突标记；它只是移除冲突的
相关文件，然后让 PATH 可以再次提交。 

18、取消svn add
```bash
svn revert --recursive example_folder
```

[LOFTER：不爱吃西红柿的鱼](http://anchengjian.lofter.com)   [http://anchengjian.lofter.com/post/3217ba_72ba4b0](http://anchengjian.lofter.com/post/3217ba_72ba4b0)