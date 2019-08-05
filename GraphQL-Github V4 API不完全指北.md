# GraphQL

传统的REST API...

GraphQL把所有服务端的数据抽象成了一个综合的数据库，前端发送的请求就是查询数据库

好处就是前端可以根据自己的需要来定制返回的数据，即“精准查询”

另一个好处就是一次请求即可获取到所有数据，极大地减少了请求次数

## Github V4 API 概念

* Schema

定义了GraphQL API的类型系统，它描述了客户端可以访问的完整可能数据集（对象，字段，关系，所有内容），来自客户端的调用将根据模式进行验证和执行。

* Field

是可以从对象检索的数据单位，GraphQL查询语言基本上是关于选择对象上的字段，Field就代表了那些字段。

* Connection

即关联查询

* Edge

代表节点的连接线，查询时，通过它由当前节点到下一个节点

* Node

即对象，是获取数据的节点


## 使用

请求url只有一个`https://api.github.com/graphql`

GitHub目前支持的操作`query`，`mutation`

`query`：即查询操作，类似`GET`

`mutation`：类似`POST`/`PATCH`/`DELETE`操作

* 使用变量

1. 在`variables`中声明
2. 通过`$`作为参数传递
3. 在具体操作中通过`$`使用

```js
query($number_of_repos:Int!) { // 2.传递
  viewer {
    name
     repositories(last: $number_of_repos) { // 3.使用
       nodes {
         name
       }
     }
   }
}
variables { // 1.定义
   "number_of_repos": 3
}
```

