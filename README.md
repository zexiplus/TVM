# TVVM

![build](https://img.shields.io/badge/build-passing-green.svg) ![no-dependency](https://img.shields.io/badge/no-dependency-yellow.svg)

轻量级 TV 端 WEB 应用开发框架

TVVM 是一个专门为 TV WEB APP 开发的 MVVM 模式框架， 它帮助开发者快速开发应用而无需关心焦点控制，键盘绑定，数据绑定等通用逻辑。它没有依赖，体型小巧（20 kb, 官方文档请参考 [offcial web](https://zexiplus.github.io/TVVM)



## 使用

**通过 npm 下载**

你的系统上需要安装有 nodejs

```shell
$ npm install -S tvvm
```

```js
import * as TVVM from 'tvvm'

var tv = new TVVM({
    ...options
})
```

**手动下载**

你也可以通过手动下载的方式， 然后通过`<script>`标签进行引用， [下载链接](https://unpkg.com/tvvm/dist/tvvm.min.js)

```html
<script src="https://unpkg.com/tvvm/dist/tvvm.min.js"></script>
<script>
    var tv = new TVVM({
        ...options
    })
</script>
```



## 特色

### 焦点自动控制

TV 应用的特点是使用遥控器控制焦点移动， 而并非鼠标点击/手势触摸事件来触发控件，从而进行下一步操作。

这需要我们通过编程的方式控制焦点的移动和跳转。TVVM 致力于减少焦点移动的代码逻辑， 通过配置 t-index 索引， 而非编程的方式解决焦点的移动。

TVVM把应用分成横轴空间和纵轴空间， 例如 声明 `t-index="0-1"` 代表应用是第1行 (row=0) 第2列 (col=1)为当前焦点 , 当你点击遥控器的向下移动按钮时 row 增加，col 不变， 此时焦点从 `t-index="0-1"`移动至 `t-index="1-1"`的元素上 。这些在TVVM内部已经做好了， 开发者只需要在焦点块元素上声明 t-index 索引即可。

除此之外, TVVM 还提供了丰富的选项，例如默认焦点，焦点元素样式，边界穿越，按键值配置等。

**focus选项**

```js
new TVVM({
    ...,
    focus: {
    	defaultFocusIndex: '0-1', // 默认焦点
    	circle: {
    		horizontal: true, // 当焦点移动到边界时在水平方向可穿越
    		vertical: true // 当焦点移动到边界时在垂直方向可穿越
		},
        ...options
	}
})
```

**html模板**

```html
<style>
    *:focus {
        outline: none;
        border: 2px solid #fff;
    }
</style>
<div class="tv">
    <div>
        <div>
            <div t-index="0-1">0-1</div>
            <div t-index="0-2">0-2</div>
            <div t-index="0-3">0-3</div>
        </div>
    </div>
    <div>
        <div t-index="1-0, 2-0" real-focus="true">
            <span>1-0,</span> <span>2-0</span>
        </div>
        <div>
            <div t-index="1-1, 1-2, 1-3">
                <span>1-1,</span> <span>1-2,</span> <span>1-3</span>
            </div>
            <div>
                <div t-index="2-1">2-1</div>
                <div t-index="2-2">2-2</div>
                <div t-index="2-3">2-3</div>
            </div>
        </div>
    </div>
</div>
```

**显示结果**

![t-index-demo](./website/imgs/index.bmp)

### 按键去抖优化

某些物理遥控器在按下按钮时， 有可能高速触发按键事件， 这对应用会产生不良后果， TVVM 在绑定事件的同时在内部会优化操作逻辑， 利用函数去抖控制按键触发频率， 防止因为物理设备差异导致应用逻辑混乱。



### 数据驱动

TVVM 与大多数 mvvm 思想的前端框架一样， 采用数据驱动的开发模式， 简单来讲，数据驱动使开发者只用关系数据的修改， 而无需手动将数据同步至视图。以下是 t-value 指令来实现双向数据绑定的例子， span 标签内的内容会随着 input 输入框的值的改变而改变



```js
data: function () {
    return {
        demoInputValue: 'demo'
    }
}
```

```html
<input t-value="data.demoInputValue" />
<span>{{data.demoInputValue}}</span>
```



## API

### new TVVM(options)

new TVVM 返回一个tv实例, 作为该页面的全局单例入口

```js
var tv = new TVVM({
	el: '#tv',
    data () {
        return {
			dialogVisible: true
        }
    },
    focus: {

    },
    methods: {
        testFn: function (a, b) {

        }
    }
})
```



### 选项

new TVVM接收一个选项对象作为唯一参数

#### el

new TVVM() 实例挂载的dom元素, 可以是一个元素查找符或者dom节点对象

```js
new TVVM({
    el: '#tv',
})
```

#### data

tm单例的数据对象, 可以是一个函数或者对象, 当该参数为函数时, 取值为该函数的返回值

```js
new TVVM({
    data: function () {
        return {
            title: 'tvvm demo page',
            index: '0'
        }
    }
})
```

#### methods

该参数是一个对象, 存放所有的方法函数

```js
methods: {
    methods1: function () {
        console.log('methods1')
    }
}
```

#### focus

focus选项用于设置焦点移动， 键值绑定， 默认焦点等逻辑

```js
	new TVVM({
        focus: {
            defaultFocusIndex: '1-0',
            activeClass: 'high-light',
            keysMap: {
              'up': {
                codes: [38, 103],
                handler: function (event, node, index, prevNode) {

                }
              },
              'g': {
                codes: [71],
                handler: function (event, node, index, prevNode) {
                  console.log('you press g')
                }
              },

            },
            keysMapMergeCoverage: false,
            circle: {
              horizontal: true,
              vertical: true,
            },
          }
    })
```

- **defaultFocusIndex (可选)**

  进入应用默认聚焦的元素的索引, 该参数为空时， 默认聚焦到页面首个焦点元素上

  ```js
  focus: {
      defaultIndex: '0-1'
  }
  ```

- **activeClass**

  焦点元素的样式名

  ```js
  focus: {
      activeClass: 'high-light'
  }
  ```

- **circle (可选)**

  - **horizontal (可选)** 焦点元素在水平方向是否可以循环移动, 默认false
  - **vertival (可选)** 焦点元素在水平方向上是否可以循环移动, 默认false

  ```js
  focus: {
      circle: {
          horizontal: true,
          vertical: true
      }
  }
  ```

- **keysMap （可选）**

  遥控器键盘键值码映射表,  该参数为空时使用默认键值码映射表

  \- 'alias' 对应键值的别名

   \- codes 对应键值数组

  - handler 对应按键值绑定的事件处理函数 参数分别是event(事件), node(当前焦点dom节点索引), index (当前焦点dom节点的t-index值), prevNode(上一个焦点dom节点索引)

  - up 方向上键
  - down 方向下键
  - left 方向左键
  - right 方向右键
  - enter 确定键
  - space 空格键
  - home 主页键
  - menu 菜单键
  - return 返回键
  - addVolume 增加音量键
  - subVolume 减少音量键

  ```js
  focus: {
      keysMap: {
      'up': {
        codes: [38, 104],
        handler: function (event, node, index, prevNode) {
  
        }
      },
      'down': {
        codes: [40, 98],
        handler
      },
      'left': {
        codes: [37, 100],
        handler
      },
      'right': {
        codes: [39, 102],
        handler
      },
      'enter': {
        codes: [13, 32],
        handler
      }
    },
  }
  ```

- **keysMapMergeCoverage (可选)**

  键值映射表合并策略 true 为覆盖, false 为合并

  ```js
  focus: {
      keysMapMergeCoverage: false,
  }
  ```

#### hooks

生命周期钩子函数集合

- beforeCreate

  在实例化之前调用， 此时不可访问 data

- created

  在实例化后调用，此时 data 已经设置响应式， 并可访问

- beforeMount

  在实例被挂在到真实 dom 前调用

- mounted

  在实例被挂在到 dom 上时调用

- beforeUpdate

  响应式 data 变动从而导致视图更新前调用

- updated

  响应式 data 变动从而导致视图更新后调用

- beforeDestory

  在实例被销毁前调用

```js
hooks: {
    beforeCreate: function () {
        // this 指向tv实例
    },
    mounted: function () {
    	        
    },
    ...
}
```



### 指令

TVVM 内置指令系统, 包含了一些常用的指令, 用于处理简单的模版逻辑.TVVM 内置指令通常以 `t-`开头作为标识

```html
<html>
    <head></head>
    <body>
        <div id="tv">
            <div t-if="data.dialogVisible" class="dialog">{{data.dialog.title}}</div>
            <nav>
                <a t-for="item in data.linkList">{{item.label}}</a>
            </nav>
            <form>
            	<input t-model="data.dialog.title" />
            </form>
            <button @click="methods.testFn"></button>
        </div>
    </body>
</html>
```

#### t-index

用于指定焦点区块元素的二维空间索引，以便用户点击遥控器方向按键时移动焦点，`t-index="x-y"`, 例如`t-index="0-0"`代表第一排第一列的元素

```html
<div class="tv">
    <div t-index="0-0">0-0</div> <!-- 第1排第1个元素 -->
    <div t-index="0-1">0-1</div>
    <div t-index="0-2">0-2</div>
    <!-- 第2排第1个元素， 纵向占据2个空间 -->
    <div t-index="1-0, 2-0">1-0， 2-0</div> 
    <div>
        <!-- 第2排第2个元素， 横向占据3个空间 -->
        <div t-index="1-1, 1-2, 1-3">1-1， 1-2， 1-3</div> 
        <div>
            <div t-index="2-1">2-1</div> <!-- 第3排第2个元素 -->
            <div t-index="2-2">2-2</div> <!-- 第3排第3个元素 -->
            <div t-index="2-3">2-3</div> <!-- 第3排第4个元素 -->
        </div>
    </div>
</div>
```

![效果如图](./website/imgs/index.bmp)

#### t-if

用于显示/隐藏 dom 节点, 该指令接收一个在 data 参数上存在的布尔值

```html
<div t-if="data.dialogVisible"></div>
```

#### t-for

用于循环指定的 dom 节点, 该指令接收一个表达式,如下 item 代表数组的每一项, `data.array`是 data 上定义的一个数组

```js
data: function () {
    return {
        array: [
            {label: 'first', value: 0},
            {label: 'second', value: 1},
            {label: 'third', value: 2}
        ]
    }
}
```

```html
<ul>
    <li t-for="item in data.array">{{item.label}}</li>
</ul>
<!-- 渲染为 -->
<ul>
    <li>first</li>
    <li>second</li>
    <li>third</li>
</ul>
```

#### {{value}}

数据插值, 双花括号内接收一个 data 的属性.用于页面内数据插值

```js
data: function () {
    return { name: 'float' }
}
```

```html
<span>{{data.name}}</span>
<!-- 渲染为 -->
<span>float</span>
```

#### t-class

样式表绑定， t-class 接收一个 data 上已经定义的样式名数组或对象

```js
data: function () {
    return {
        classList1: ['container', 'container-row'],
        classList2: {
            'container': true,
            'container-row': false,
            'container-col': true
        }
    }
}
```

```html
<div t-class="data.classList2"></div>
<!-- 渲染为 -->
<div class="container container-col"></div>
```

#### t-bind

属性绑定,`t-bind:name="data.name"` 简写形式为 `:name="data.name"`

```js
data: function () {
    return {
        id: 'billboard',
        height: '365',
        classname: 'spin'
    }
}
```

```html
<div :id="data.id" :height="data.height" :class="data.classname"></div>
<!-- 渲染为 -->
<div id="billboard" height="365" class="spin"></div>
```

#### t-value

用于 input 输入数据与 data 上数据的绑定，input 的 value 会实时同步至t-model 绑定的数据

```js
data: function () {
    return {
        demoInputValue: 'demo'
    }
}
```

```html
<input t-value="data.demoInputValue" />
<span>{{data.demoInputValue}}</span>
```



#### event bind

事件绑定

```js
methods: {
    clickHandler: function () {
        // do something
    },
    clickHandler2: function (param1, param2) {
    	     
    }
}
```

```html
<div @click="methods.clickHandler"></div>
<div @click="methods.clickHandler2(data.inputValue)"></div>
```






## 协议

TVVM 采用MIT协议，详情查看[LICENSE](./LICENSE)



## 链接

* [官方文档](https://github.com/zexiplus/TVVM)

