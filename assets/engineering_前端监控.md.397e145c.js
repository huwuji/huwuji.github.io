import{_ as s,c as n,o as a,a as e}from"./app.b8d11a0b.js";const g=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[{"level":2,"title":"前端监控","slug":"前端监控","link":"#前端监控","children":[{"level":3,"title":"1. 为什么需要前端监控？监控的目的是什么？","slug":"_1-为什么需要前端监控-监控的目的是什么","link":"#_1-为什么需要前端监控-监控的目的是什么","children":[]},{"level":3,"title":"2. 前端监控的方面？","slug":"_2-前端监控的方面","link":"#_2-前端监控的方面","children":[]},{"level":3,"title":"3. 怎么做好业务监控？","slug":"_3-怎么做好业务监控","link":"#_3-怎么做好业务监控","children":[]},{"level":3,"title":"4. 异常监控","slug":"_4-异常监控","link":"#_4-异常监控","children":[]},{"level":3,"title":"5. 页面性能监控","slug":"_5-页面性能监控","link":"#_5-页面性能监控","children":[]},{"level":3,"title":"6. 数据上报","slug":"_6-数据上报","link":"#_6-数据上报","children":[]},{"level":3,"title":"总结","slug":"总结","link":"#总结","children":[]}]}],"relativePath":"engineering/前端监控.md"}'),l={name:"engineering/前端监控.md"},p=e(`<h2 id="前端监控" tabindex="-1">前端监控 <a class="header-anchor" href="#前端监控" aria-hidden="true">#</a></h2><blockquote><p>原址：<a href="https://github.com/huwuji/blog/tree/master/notes/FE-thinking" target="_blank" rel="noreferrer">https://github.com/huwuji/blog/tree/master/notes/FE-thinking</a></p></blockquote><h3 id="_1-为什么需要前端监控-监控的目的是什么" tabindex="-1">1. 为什么需要前端监控？监控的目的是什么？ <a class="header-anchor" href="#_1-为什么需要前端监控-监控的目的是什么" aria-hidden="true">#</a></h3><pre><code>监控的目的基础上（底层上）的来说是收集数据，从最终目的（上层）说，也就是数据收集，加工，处理，分析的目的，及是**可监控，可报警，可预测**；
</code></pre><h3 id="_2-前端监控的方面" tabindex="-1">2. 前端监控的方面？ <a class="header-anchor" href="#_2-前端监控的方面" aria-hidden="true">#</a></h3><pre><code>- 业务监控----可以理解为用户行为监控
- 异常/错误监控---也就是一些 js 执行，资源加载，接口调用异常和报错
- 页面性能监控--- 比如 TTFB, FCP,LCP,FID,TTI,CLS 等（部分可以通过 web-vitals 收集页面性能指标）
</code></pre><h3 id="_3-怎么做好业务监控" tabindex="-1">3. 怎么做好业务监控？ <a class="header-anchor" href="#_3-怎么做好业务监控" aria-hidden="true">#</a></h3><pre><code>首先推荐**神策**
[--神策是什么](https://manual.sensorsdata.cn/sa/latest/%E7%A5%9E%E7%AD%96%E5%88%86%E6%9E%90%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F-22249853.html)

主要采取**全埋点（无埋点）**和**手动埋点**的方式；
触发方式可以分**自动式触发埋点**和**互动式触发埋点**的方式；

业务监控主要是为了获取哪些信息？

- PV ----用户浏览页面次数，Page View
  **自动式触发埋点**，实现方式浅析：通过监听页面加载完成事件自动触发；

- UV ----页面浏览用户数，Unique visitor
  **自动式触发埋点**，实现方式浅析：通过监听页面加载完成事件自动触发，并携带上**用户表示符**

- Click ---用户点击行为和次数，这种方式属于**互动式触发**
  实现方式浅析：1）可以通过对事件冒泡，对某一种类型进行监控的全埋点（无埋点）方式；2）手动在业务代码触发；

- 其他业务信息等...
  自定义数据收集，更多维度的数据信息收集，就有更多维度的数据分析，供预测做决策等；
</code></pre><h3 id="_4-异常监控" tabindex="-1">4. 异常监控 <a class="header-anchor" href="#_4-异常监控" aria-hidden="true">#</a></h3><ol><li>全局错误，即未被捕获的错误</li></ol><ul><li><p>window.onerror 可以设置全局的 js 运行时异常和语法错误，但是不能捕获资源加载异常；</p></li><li><p>window.addEventListener(&#39;error&#39;,handle) 全局设置;</p><p>监听 js 运行时错误事件，会比 window.onerror 先触发，与 onerror 的功能大体类似，不过事件回调函数传参只有一个保存所有错误信息的参数，不能阻止默认事件处理函数的执行，但可以全局捕获资源加载异常的错误；</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">  window.addEventListener(&#39;error&#39;, function (event) {</span></span>
<span class="line"><span style="color:#A6ACCD;">      const { message, source, lineno, colno, error,target } = event;</span></span>
<span class="line"><span style="color:#A6ACCD;">      // 通过targer来区分</span></span>
<span class="line"><span style="color:#A6ACCD;">      if(target &amp;&amp; (target.src||target.href)){</span></span>
<span class="line"><span style="color:#A6ACCD;">        // 资源加载异常 resourceError</span></span>
<span class="line"><span style="color:#A6ACCD;">        if(target.tagName===&#39;script&#39;){</span></span>
<span class="line"><span style="color:#A6ACCD;">          // script脚本资源加载异常</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;">         if(target.tagName===&#39;img&#39;){</span></span>
<span class="line"><span style="color:#A6ACCD;">          // img资源加载异常</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;">         // todo 上报异常</span></span>
<span class="line"><span style="color:#A6ACCD;">      }else{</span></span>
<span class="line"><span style="color:#A6ACCD;">        // js异常 jsError</span></span>
<span class="line"><span style="color:#A6ACCD;">        // 可以查看error信息查看具体原因</span></span>
<span class="line"><span style="color:#A6ACCD;">        // todo 上报异常</span></span>
<span class="line"><span style="color:#A6ACCD;">      }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    }, true);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>但它不能监控未被捕获的 promise 类型错误</p><blockquote><p>补充： 当资源（如 img 或 script）加载失败，加载资源的元素会触发一个 Event 接口的 error 事件，并执行该元素上的 onerror()处理函数。这些 error 事件不会向上冒泡到 window，但可以在捕获阶段被捕获因此如果要全局监听资源加载错误，需要在捕获阶段捕获事件;</p></blockquote><blockquote><p>补充：<a href="https://github.com/huwuji/blog/blob/master/notes/2022-09/js-error-types.md" target="_blank" rel="noreferrer">JS 的 Error 类型</a></p></blockquote><ul><li><p>未被捕获的 Promise 类型错误，可以通过 unhandledrejection API 捕获</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">// 全局统一处理Promise异常</span></span>
<span class="line"><span style="color:#A6ACCD;">window.addEventListener(&quot;unhandledrejection&quot;, function(e){</span></span>
<span class="line"><span style="color:#A6ACCD;">console.log(&#39;捕获到异常：&#39;, e);</span></span>
<span class="line"><span style="color:#A6ACCD;">});</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><blockquote><p>补充关于捕获跨域脚本异常 当引入跨域的脚本（比如用了 apis.google.com 上的库文件）时，如果这个脚本有错误，因为浏览器的限制（根本原因是协议的规定），是拿不到错误信息的。当本地尝试使用 window.onerror 去记录脚本的错误时，跨域脚本的错误只会返回 Script error。 而 HTML5 新的规定，是可以允许本地获取到跨域脚本的错误信息的，但有两个条件：一是跨域脚本的服务器必须通过 Access-Control-Allow-Origin 头信息允许当前域名可以获取错误信息，二是网页里的 script 标签也必须指明 src 属性指定的地址是支持跨域的地址，也就是 crossorigin 属性。有了这两个条件，就可以获取跨域脚本的错误信息。</p></blockquote></li></ul></li></ul><ol start="2"><li><p>局部错误 即通过 try...catch、promise.then、promise.catch 等捕获的错误</p></li><li><p>接口请求错误 劫持 fetch 和 xhr</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">// fetch劫持--</span></span>
<span class="line"><span style="color:#A6ACCD;">const originFetch = window.fetch;</span></span>
<span class="line"><span style="color:#A6ACCD;">window.fetch = function (url, args) {</span></span>
<span class="line"><span style="color:#A6ACCD;">    //todo</span></span>
<span class="line"><span style="color:#A6ACCD;"> return originFetch(url).then((response) =&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;">   return response.json()</span></span>
<span class="line"><span style="color:#A6ACCD;"> })</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">// const originFetch = fetch;</span></span>
<span class="line"><span style="color:#A6ACCD;">// Object.defineProperty(window, &quot;fetch&quot;, {</span></span>
<span class="line"><span style="color:#A6ACCD;">//   configurable: true,</span></span>
<span class="line"><span style="color:#A6ACCD;">//   enumerable: true,</span></span>
<span class="line"><span style="color:#A6ACCD;">//   // writable: true,</span></span>
<span class="line"><span style="color:#A6ACCD;">//   get() {</span></span>
<span class="line"><span style="color:#A6ACCD;">//     return (url, options) =&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;">//       console.log(&#39;fetch====&#39;, fetch, url, options);</span></span>
<span class="line"><span style="color:#A6ACCD;">//       return originFetch(url, {</span></span>
<span class="line"><span style="color:#A6ACCD;">//         ...options</span></span>
<span class="line"><span style="color:#A6ACCD;">//       }).then(response =&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;">//         console.log(&#39;fetch=response===&#39;, response);</span></span>
<span class="line"><span style="color:#A6ACCD;">//         return response.json()</span></span>
<span class="line"><span style="color:#A6ACCD;">//       })</span></span>
<span class="line"><span style="color:#A6ACCD;">//     }</span></span>
<span class="line"><span style="color:#A6ACCD;">//   }</span></span>
<span class="line"><span style="color:#A6ACCD;">// })</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">// xhr对象劫持</span></span>
<span class="line"><span style="color:#A6ACCD;">    // 重写 open send</span></span>
<span class="line"><span style="color:#A6ACCD;">    // 监听load,error,abort事件</span></span>
<span class="line"><span style="color:#A6ACCD;">    function injectXhr() {</span></span>
<span class="line"><span style="color:#A6ACCD;">    const originXhrOpen = window.XMLHttpRequest.prototype.open;</span></span>
<span class="line"><span style="color:#A6ACCD;">    window.XMLHttpRequest.prototype.open = function (...args) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        // console.log(&#39;open==&#39;, ...args)</span></span>
<span class="line"><span style="color:#A6ACCD;">        return originXhrOpen.apply(this, args);</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    const originXhrSend = window.XMLHttpRequest.prototype.send;</span></span>
<span class="line"><span style="color:#A6ACCD;">    window.XMLHttpRequest.prototype.send = function (body) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        console.log(&#39;send==&#39;, body, arguments)</span></span>
<span class="line"><span style="color:#A6ACCD;">        const handle = (type) =&gt; (event) =&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;">        console.log(&#39;事件:&#39; + type + &#39;触发&#39;);</span></span>
<span class="line"><span style="color:#A6ACCD;">        console.log(&#39;event:&#39;, event);</span></span>
<span class="line"><span style="color:#A6ACCD;">        // todo上报异常</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.addEventListener(&#39;load&#39;, handle(&#39;load&#39;), true);</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.addEventListener(&#39;error&#39;, handle(&#39;error&#39;), true)</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.addEventListener(&#39;abort&#39;, handle(&#39;abort&#39;), true)</span></span>
<span class="line"><span style="color:#A6ACCD;">        originXhrSend.apply(this, arguments);</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div></li><li><p>组件级错误，即使用 React 组件时发生的错误<br> React 中的 <strong>ErrorBoundary</strong>错误边界相关的 getDerivedStateFromError 和 componentDidCatch 钩子,以及组件[ErrorBoundary]</p></li></ol><h3 id="_5-页面性能监控" tabindex="-1">5. 页面性能监控 <a class="header-anchor" href="#_5-页面性能监控" aria-hidden="true">#</a></h3><ul><li>通过 web-vitals 获取</li></ul><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">       import(&#39;web-vitals&#39;).then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) =&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;">       getCLS(onPerfEntry) // 布局偏移量</span></span>
<span class="line"><span style="color:#A6ACCD;">       getFID(onPerfEntry) // 首次输入延迟时间</span></span>
<span class="line"><span style="color:#A6ACCD;">       getFCP(onPerfEntry) // 首次内容渲染时间</span></span>
<span class="line"><span style="color:#A6ACCD;">       getLCP(onPerfEntry) // 首次最大内容渲染时间</span></span>
<span class="line"><span style="color:#A6ACCD;">       getTTFB(onPerfEntry) // 首个字节到达时间</span></span>
<span class="line"><span style="color:#A6ACCD;">       })</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><ul><li>利用 performance 来获取数据进行分析获取： <a href="https://developer.mozilla.org/en-US/docs/Web/API/Performance" target="_blank" rel="noreferrer">参考 MDN:</a> 读取<a href="https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming" target="_blank" rel="noreferrer">window.performance.timing</a> 属性分析</li></ul><h3 id="_6-数据上报" tabindex="-1">6. 数据上报 <a class="header-anchor" href="#_6-数据上报" aria-hidden="true">#</a></h3><p>可以有如下方式：</p><ul><li>XMLHttpRequest</li><li>fetch</li><li>form 表单的 action</li><li>基于元素 src 属性的请求</li><li>img/gif 标签的 src</li><li>script 标签的 src</li><li>Navigator.sendBeacon()</li></ul><h3 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-hidden="true">#</a></h3><p>以上，说明了关于前端监控的 why，what，how；这也是前端监控的基础版本，监控的维度，方式还可以再这样的基础上不断丰富，如利用 e2e 测试方式来创建前端的巡检监控，OOM 监控等等；</p><blockquote><p>Navigator.sendBeacon: <a href="https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon" target="_blank" rel="noreferrer">https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon</a></p></blockquote><blockquote><p>sentry: <a href="https://mp.weixin.qq.com/s?__biz=MzAwODcwODYwMw==&amp;mid=2247484827&amp;idx=1&amp;sn=caf7d831382588c393caa5abc67b6fe3" target="_blank" rel="noreferrer">https://mp.weixin.qq.com/s?__biz=MzAwODcwODYwMw==&amp;mid=2247484827&amp;idx=1&amp;sn=caf7d831382588c393caa5abc67b6fe3</a></p></blockquote>`,23),o=[p];function t(r,c,i,C,A,d){return a(),n("div",null,o)}const y=s(l,[["render",t]]);export{g as __pageData,y as default};
