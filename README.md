## koa

##### 1.install

`pnpm add koa -S`

##### 2.hello koa

![image-20220221124120591](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220221124120591.png)

##### 3. middle ware

app.use 是一个使用中间件的过程，接受一个函数作为参数

##### 4. router 路由

这里说的是后端路由，也就是不同URL，可以返回不同的内容。

`ctx.url ===ctx.request.url`   // 获取url信息

`ctx.method ===ctx.request.method` // 获取请求类型

`ctx.status===ctx.response.status` //设置返回的状态码

##### 5.koa-router 实现路由

 `pnpm add koa-router -S`

 使用：

- 导入koa-router
- 创建router实例
- 注册

![image-20220221164001127](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220221164001127.png)

通过Router初始化

![image-20220221164407781](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220221164407781.png)

权限校验

自定义权限校验中间件

![image-20220221165337315](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220221165337315.png) 

##### 6. options 的作用

- 检测服务器所支持的请求方法
- cors中的预检请求 

**allowedMethods**

作用：响应options方法

![image-20220221170103933](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220221170103933.png)

支持但方法不允许--405

不能识别该类型的方法--501 

##### 7. restful API 最佳实现

注意删除用户返回204即可8.

##### 8.控制器

拿到路由分配的任务，并执行

在koa中控制器就是一个中间件

**为什么需要控制器**

- 获取http请求参数
- 处理业务逻辑
- 发送http响应

路由参数是必传的。而query是可选的

url长度有限制

##### 9. koa-bodyparser

解析请求体中的内容，如果没有这个中间件，请求就拿不到 ctx.request.body中的内容

`pnpm add koa-bodyparser -S`

```js
const bodyParser = require('koa-bodyparser')
app.use(bodyParser())
```

##### 10.发送http响应 

设置响应头： ctx.set('content-Type','aplication/json')

##### 11.分模块组织代码

![image-20220221205137467](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220221205137467.png)

路由中的每一个js文件代表了一个路由模块。通过自动化脚本实现对路由的注册

![image-20220221205309064](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220221205309064.png)

这个自动化脚本接受一个app实例作为参数。

![image-20220221205435234](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220221205435234.png)

constrollers 数据处理层

![image-20220221211932244](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220221211932244.png)

##### 12.异常处理

 运行时错误，返回500

 逻辑错误，如找不到( 404)、先决条件失败（ 412 )、无法处理的实体（参数格式不对，422 )等

412 例如寻找的用户id不存在

![image-20220221212443269](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220221212443269.png)

##### 13.koa-json-error 进行错误处理

 `pnpm add koa-json-error`

use

![image-20220221214652571](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220221214652571.png)

根据当前环境切换 返回内容

`pnpm add cross-env -D`

 配置error中的postFromat对象的返回参数

![image-20220221215413713](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220221215413713.png)

配置package.json 文件

![image-20220221215451452](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220221215451452.png)

##### 14. 使用koa-parameter 校验参数（parameter）

`pnpm add koa-parameter -S`

![image-20220221221034818](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220221221034818.png)

通过verifyParams来限制请求体中的参数，如果不满足返回422

![image-20220221221126429](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220221221126429.png)

##### 15.noSQL

  noSql

- 列存储
- 文档存储mongoDB---按照json来存储
- key-value存储 redis

**why no sql**

- 简单 （没有原子性、一致性、隔离性等复杂规范）
- 便于横向扩展
- 适合超大规模的存储
- 灵活存储复杂的数据 Schema Free

#####  16 mongoDB

中文含义为 “庞大的”  `面向文档`的开源数据库

- 性能好（内存计算）
- 大规模的数据存储（可扩展性）
- 可靠安全（本地复制，自动故障转移）
- 方便存储复杂的数据结构

**下载**   直接本地下载

**云mongoDB** ->更加安全，不需要自己去维护服务器

##### 17 云数据库--mongoDB Atlas

mongodb+srv://vujson:<password>@zhhu.zbgci.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

mongoose 操作mongoDB

安装： ` pnpm add mongoose -S`

![image-20220221234703651](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220221234703651.png)

##### 18 设计用户模块的schema

schema 相当于对json（表的定义）的数据约束

model定义文档，文档是模型的实例

- 编写用户模块schema ->  使用schema生成用户的modal

```js
const mongoose = require('mongoose')
const { Schema, model } = mongoose

const userSchema = new Schema({
  name: { type: "string", required: true }
})


module.exports = model('User', userSchema)
```

##### 19 通过创建的model文档来实现 增删改查

`查询所有用户` find

![image-20220222144033566](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222144033566.png)

`寻找某个id的用户` findById

![](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222144033566.png)

`创建某个用户`   new model().save()

![image-20220222144717297](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222144717297.png)

`删除某个id的用户` model.findByIdAndRemove()

![image-20220222144803631](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222144803631.png)

`更具id更新某个用户`  model.findByIdAndUpdate()

![image-20220222144857195](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222144857195.png)

#####  20.session 工作原理

![image-20220222145325408](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222145325408.png)

**优势**

- 服务器可以主动清除sessionId。
- session存储在服务器，更加安全。
- 结合cookie使用，兼容性好。 
- 只需要传输sessionId开销小。

**劣势**

- cookie+session在跨域的场景中表现不好 *
- 分布式部署的话，多机共享session。
- 基于cookie容易被csrf --
- 查询session有个数据库查询过程

##### 21 JWT

定义了一种紧凑且独立的方式，跨域将各方之间的信息作为JSON对象进行存储。

该信息可以被验证和信任，因为是经过数字签名的。

**缺点：** 无法手动处理jwt，如果做一些权限的服务，必须等到token过期才会重新生效，修改完

 **jwt构成**

- header
- 有效载荷（payload）
- 签名 signature

![image-20220222151804447](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222151804447.png)

######  header编码前后

![image-20220222151941550](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222151941550.png)

###### payload

需要传递的信息： 用户ID、用户名等

包含过期时间、发布人等，payload可以进行加密

![image-20220222152140540](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222152140540.png)

###### **签名 signature**

 保证Token

**hash256**算法对已经进行base64处理后的header和payload进行加密

![image-20220222152301145](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222152301145.png)

###### jwt 工作流程

![image-20220222152442060](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222152442060.png)

##### 21.nodeJs中使用jwt

安装jsonwebtoken

`pnpm add jsonwebtoken`

 ![image-20220222154818510](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222154818510.png)

jwt.decode(token)  对token进行解码，但是无法确保token是否被篡改

jwt.verify(token,'密钥')

![image-20220222155114855](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222155114855.png)

##### 22.登录获取token

secret ： 设置密钥

jwt.sign() 签证： 第三个参数 expireIn：设置过期时长

![image-20220222164521963](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222164521963.png)

##### 23.自定义koa中间件-实现用户认证授权

  ![image-20220222170248142](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222170248142.png)

添加到需要进行认证的路由上

![image-20220222170407685](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222170407685.png)

对用户身份进行校验，token有效之后，需要确认token中的id和当前params中的id是否一致

![image-20220222190528460](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222190528460.png)

##### 23.koa-jwt 实现用户认证和授权

`pnpm add koa-jwt -S`

![image-20220222191531544](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222191531544.png)

#####  24.上传图片功能

- 基础：上传图片。生成图片链接
- 附加：限制大小和类型，生成高中低三种分辨率的链接，生成CDN

`pnpm add koa-body`  替换 koa-bodyparser   后者不支持文件格式

- 设置图片上传目录

v1

![image-20220222194732234](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222194732234.png)

上传图片之后，服务器可以获取的参数列表

![image-20220222194853025](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222194853025.png)

##### 25.koa-static生成图片链接

生成一个静态服务，指定一个文件夹，文件夹下的文件都可以通过http来进行访问

`pnpm add koa-static -S` 

![image-20220222195537759](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222195537759.png)

通过ctx.origin 设置服务源： 不能直接写死，dev / pro 地址不同

![image-20220222200602781](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222200602781.png)

前端表单 限制图片格式类型上传文件

```html
<form action="/upload" enctype="multipart/form-data" method="post">
  <input type="file" name="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
  <button type="submit">提交</button>
</form>
```

##### 26.定义 用户schema

![image-20220222210459617](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222210459617.png)

koa-parameter    verifyParams 参数

![image-20220222214831371](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222214831371.png)

##### 27.字段过滤

- 设计schema默认隐藏部分字段

- 根据用户查询信息时，可以通过query指定需要而外的字段

  ![image-20220222220949084](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222220949084.png) 

##### 28 关注与粉丝功能

 定义用户 following schema   ref可以指定shema让其(id)相关联,后续可以通过populate指定

![image-20220222221914458](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222221914458.png)

获取关注人列表  

![image-20220222224222580](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220222224222580.png)

关注某个用户 ： 携带token -> 关注者id

 ![image-20220223142807276](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220223142807276.png)

 取消关注某个用户：

![image-20220223142831052](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220223142831052.png)

获取某个人的粉丝列表

![image-20220223143620533](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220223143620533.png)

##### 29 编写 校验用户是否存与否的中间件

- 1.校验 id格式是否正确 不满足ObjectId格式的抛出异常
- 2.校验用户的id是否存在，不存在的抛出404

![image-20220223145436833](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220223145436833.png)

 topicsSchema设计

![image-20220223153121983](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220223153121983.png)

​	查找所有话题和 基于id查询某个特定的话题

![image-20220223160942264](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220223160942264.png)

自定义中间件判断id是否存在

![image-20220223161015228](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220223161015228.png)

创建话题和修改话题

- auth校验
- verifyParams 校验body参数

![image-20220223161204951](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220223161204951.png)

##### 30. 分页和模糊搜索模块

分页处理

![image-20220223163742063](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220223163742063.png)

模糊搜索  通过mongoose自带的 limit 限制 name 利用正则匹配query中的q字段

![image-20220223165017836](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220223165017836.png)

#####  31.  用户属性的话题引用  ---需要更改userSchema

作用： 方便对数据的归类，例如可以收集所有相同职业的话题，还有公司话题等等

 采用Schema.types.ObjectId 类型配合ref引用之后

![image-20220223170248540](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220223170248540.png)

进行用户查询的时候采用populate高级检索

![image-20220223170811626](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220223170811626.png)

更具query中的 fields来指定生成的字段 这里需要动态生成populater否则会全部返回

![image-20220223181117944](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220223181117944.png)

##### 32 话题关注话题

 schema设计 ---在用户的schema中添加followTopic 

![image-20220223182402653](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220223182402653.png)

users constroller 定义 关注和取消关注控制器

![image-20220223182717096](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220223182717096.png)

users constoller  关注话题列表

![image-20220223184741871](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220223184741871.png)

##### 33.问题模块

一个问题包含多个话题，图片信息，描述、关注问题。用户的问题列表

用户和问题的关系是一对多的关系，话题和问题是多对多的关系

 questionSchema 设计

![image-20220224145454211](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220224145454211.png)

##### 34.答案模块

url： /questions/:questionsId/answers

answerSchema设计

![image-20220224150840973](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220224150840973.png)

   后续curd基本一致这里不再记录

##### 35. 互斥关系 赞/ 踩

![image-20220224171704308](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220224171704308.png)

 ![image-20220224171643668](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220224171643668.png)

![image-20220224184644026](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220224184644026.png)

每次点赞的时候取消踩，点踩的时候取消赞

![image-20220224190129552](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220224190129552.png)

##### 36. 收藏答案

 userSchema添加 collectionAnswers字段

![image-20220224190446357](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220224190446357.png)

UserCtl

![image-20220224191031193](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220224191031193.png)

user router

![image-20220224191426295](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220224191426295.png)

##### 37.评论模块

- 评论curd
- 问题-> 评论     用户->评论   一对多关系
- 一级评论和子级评论

三级嵌套接口设计

`/questions/:qustionId/answers/:answerId/comments/:commentsId` 

 CommentSchema设计  

![image-20220224192637942](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220224192637942.png)

一级评论和二级评论

添加rootCommentID   跟评论的id    replaceId   回复给哪个用户

**添加日期功能**  

![image-20220224195525660](https://gitee.com/spencer1228/blog-img-address/raw/master/img/image-20220224195525660.png)