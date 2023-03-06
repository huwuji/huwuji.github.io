import{_ as s,c as n,o as a,a as l}from"./app.b8d11a0b.js";const d=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[{"level":2,"title":"记一次处理国际化 key 而做的 webpack-loader","slug":"记一次处理国际化-key-而做的-webpack-loader","link":"#记一次处理国际化-key-而做的-webpack-loader","children":[{"level":3,"title":"目的：","slug":"目的","link":"#目的","children":[]},{"level":3,"title":"思路：","slug":"思路","link":"#思路","children":[]},{"level":3,"title":"实现：","slug":"实现","link":"#实现","children":[]}]}],"relativePath":"engineering/记一次处理国际化key而做的webpack-loader.md"}'),e={name:"engineering/记一次处理国际化key而做的webpack-loader.md"},p=l(`<h2 id="记一次处理国际化-key-而做的-webpack-loader" tabindex="-1">记一次处理国际化 key 而做的 webpack-loader <a class="header-anchor" href="#记一次处理国际化-key-而做的-webpack-loader" aria-hidden="true">#</a></h2><blockquote><p>原址：<a href="https://github.com/huwuji/blog/tree/master/notes/FE-thinking" target="_blank" rel="noreferrer">https://github.com/huwuji/blog/tree/master/notes/FE-thinking</a></p></blockquote><h3 id="目的" tabindex="-1">目的： <a class="header-anchor" href="#目的" aria-hidden="true">#</a></h3><p>找出源码中关于国际化的 key，后面与国际化配置文件比较，查缺补录，同时去掉国际化文件中多余的 key，减小体积；</p><h3 id="思路" tabindex="-1">思路： <a class="header-anchor" href="#思路" aria-hidden="true">#</a></h3><ol><li><p>通过 webpack 的 loader 实现，在静态编译时查出 key，同时去除被注释的无用 key； 缺点：对于复杂的调用，处理起来比较麻烦，后面实现时会将到，本文也没有实现对各种复杂情况的处理；</p></li><li><p>通过字符串匹配---针对与处理国际化配置文件的多余 key(及 key 值为被源码使用) 如普通情况匹配<code>_t(&quot;aaa&quot;)</code> 通过我们的国际化 key 会比较多；直接这里有一个比较巧妙的方式: 先逐个文件处理普通模式<code>_t(&quot;aaa&quot;)</code>，收集后，用国际化配置文件<strong>减去</strong>收集的普通 key，剩下的需要确认的 key 就不多了。 如： 剩余=国际化配置文件(all)-收集的普通 key(大多数)； 对于这部分剩余的 key,可以再次遍历文件查找每个文件是否有匹配这些 key（字符串匹配）； 这中方式下面不具体实现；</p></li></ol><h3 id="实现" tabindex="-1">实现： <a class="header-anchor" href="#实现" aria-hidden="true">#</a></h3><p>loader.js 如下：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">/**</span></span>
<span class="line"><span style="color:#A6ACCD;"> * 处理_t(&#39;aaa&#39;)与_tHTML(&#39;bbb&#39;)</span></span>
<span class="line"><span style="color:#A6ACCD;"> * 中没有存在于多语配置文件中的key</span></span>
<span class="line"><span style="color:#A6ACCD;"> *</span></span>
<span class="line"><span style="color:#A6ACCD;"> * 思路：</span></span>
<span class="line"><span style="color:#A6ACCD;"> * 在线查看 ast生成的结构。https://astexplorer.net/</span></span>
<span class="line"><span style="color:#A6ACCD;"> * 1. 确定要针对处理的几种类型，主要针对第一个参数。</span></span>
<span class="line"><span style="color:#A6ACCD;"> *  - 字面量(一般类型)：_t(&#39;aaa&#39;); ---对应ast判断：arguments[0].type: &quot;Literal&quot;||&quot;StringLiteral&quot;;</span></span>
<span class="line"><span style="color:#A6ACCD;"> *  - 标识符：const a=&#39;aaa&#39;;_t(a);  ---对应ast判断：arguments[0].type: &quot;Identifier&quot;||&quot;ObjectExpression&quot;;</span></span>
<span class="line"><span style="color:#A6ACCD;"> *  - todo:表达式&amp;标识符：_t(true?a:&#39;bbb&#39;);---对应ast判断：arguments[0].type: &quot;ConditionalExpression&quot;;</span></span>
<span class="line"><span style="color:#A6ACCD;"> *</span></span>
<span class="line"><span style="color:#A6ACCD;"> * 2. 针对以上三种类型在[astexplorer](https://astexplorer.net/)中查看结构</span></span>
<span class="line"><span style="color:#A6ACCD;"> * 3. 针对结构做逻辑处理</span></span>
<span class="line"><span style="color:#A6ACCD;"> */</span></span>
<span class="line"><span style="color:#A6ACCD;">const babel = require(&quot;@babel/core&quot;);</span></span>
<span class="line"><span style="color:#A6ACCD;">const fs = require(&quot;fs&quot;);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">const keys = [];</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">function i18nLoader(source) {</span></span>
<span class="line"><span style="color:#A6ACCD;">  // 收集的变量</span></span>
<span class="line"><span style="color:#A6ACCD;">  let variableMap = new Map();</span></span>
<span class="line"><span style="color:#A6ACCD;">  // 特殊形式变量</span></span>
<span class="line"><span style="color:#A6ACCD;">  let identifierKeys = new Set();</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  const parsedAst = babel.parse(source, {</span></span>
<span class="line"><span style="color:#A6ACCD;">    sourceType: &quot;module&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">    presets: [&quot;@babel/preset-env&quot;, &quot;@babel/preset-react&quot;],</span></span>
<span class="line"><span style="color:#A6ACCD;">    plugins: [</span></span>
<span class="line"><span style="color:#A6ACCD;">      [&quot;@babel/plugin-proposal-class-properties&quot;],</span></span>
<span class="line"><span style="color:#A6ACCD;">      [&quot;@babel/plugin-proposal-decorators&quot;, { legacy: true }],</span></span>
<span class="line"><span style="color:#A6ACCD;">    ],</span></span>
<span class="line"><span style="color:#A6ACCD;">  });</span></span>
<span class="line"><span style="color:#A6ACCD;">  babel.traverse(parsedAst, {</span></span>
<span class="line"><span style="color:#A6ACCD;">    // VariableDeclarator是收集标识符</span></span>
<span class="line"><span style="color:#A6ACCD;">    VariableDeclarator: ({ node = {} }) =&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;">      const _id = node.id.name;</span></span>
<span class="line"><span style="color:#A6ACCD;">      console.log(</span></span>
<span class="line"><span style="color:#A6ACCD;">        &quot;VariableDeclarator---_id==&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">        _id,</span></span>
<span class="line"><span style="color:#A6ACCD;">        node.init.type,</span></span>
<span class="line"><span style="color:#A6ACCD;">        node.init.value</span></span>
<span class="line"><span style="color:#A6ACCD;">      );</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">      // todo 这里还有好多情况</span></span>
<span class="line"><span style="color:#A6ACCD;">      if (node.init &amp;&amp; node.init.type === &quot;StringLiteral&quot;) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        console.error(&quot;正常==&quot;, _id);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        variableMap.set(_id, node.init.value);</span></span>
<span class="line"><span style="color:#A6ACCD;">      } else {</span></span>
<span class="line"><span style="color:#A6ACCD;">        console.error(&quot;_id 异常==&quot;, _id);</span></span>
<span class="line"><span style="color:#A6ACCD;">      }</span></span>
<span class="line"><span style="color:#A6ACCD;">    },</span></span>
<span class="line"><span style="color:#A6ACCD;">    CallExpression: ({ node }) =&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;">      if (node.callee.name === &quot;_t&quot; || node.callee.name === &quot;_tHTML&quot;) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        // 这里要区分_t方法的第一个参数的类型</span></span>
<span class="line"><span style="color:#A6ACCD;">        const argType = node.arguments[0].type || &quot;&quot;;</span></span>
<span class="line"><span style="color:#A6ACCD;">        let consequent = node.arguments[0].consequent;</span></span>
<span class="line"><span style="color:#A6ACCD;">        let alternate = node.arguments[0].alternate;</span></span>
<span class="line"><span style="color:#A6ACCD;">        switch (argType) {</span></span>
<span class="line"><span style="color:#A6ACCD;">          case &quot;StringLiteral&quot;: //Literal</span></span>
<span class="line"><span style="color:#A6ACCD;">            if (node.arguments[0].value) keys.push(node.arguments[0].value);</span></span>
<span class="line"><span style="color:#A6ACCD;">            break;</span></span>
<span class="line"><span style="color:#A6ACCD;">          case &quot;Identifier&quot;:</span></span>
<span class="line"><span style="color:#A6ACCD;">            // todo</span></span>
<span class="line"><span style="color:#A6ACCD;">            // 收集标识符</span></span>
<span class="line"><span style="color:#A6ACCD;">            node.arguments[0].name &amp;&amp;</span></span>
<span class="line"><span style="color:#A6ACCD;">              identifierKeys.add(node.arguments[0].name);</span></span>
<span class="line"><span style="color:#A6ACCD;">            break;</span></span>
<span class="line"><span style="color:#A6ACCD;">          case &quot;ConditionalExpression&quot;:</span></span>
<span class="line"><span style="color:#A6ACCD;">            if (consequent.type === &quot;Literal&quot;) {</span></span>
<span class="line"><span style="color:#A6ACCD;">              keys.push(consequent.value);</span></span>
<span class="line"><span style="color:#A6ACCD;">            } else if (consequent.type === &quot;Identifier&quot;) {</span></span>
<span class="line"><span style="color:#A6ACCD;">              // todo</span></span>
<span class="line"><span style="color:#A6ACCD;">            }</span></span>
<span class="line"><span style="color:#A6ACCD;">            if (alternate.type === &quot;Literal&quot;) {</span></span>
<span class="line"><span style="color:#A6ACCD;">              keys.push(alternate.value);</span></span>
<span class="line"><span style="color:#A6ACCD;">            }</span></span>
<span class="line"><span style="color:#A6ACCD;">            break;</span></span>
<span class="line"><span style="color:#A6ACCD;">          default:</span></span>
<span class="line"><span style="color:#A6ACCD;">            console.error(&quot;参数类型属于特殊类型&quot;);</span></span>
<span class="line"><span style="color:#A6ACCD;">            return;</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;">      }</span></span>
<span class="line"><span style="color:#A6ACCD;">    },</span></span>
<span class="line"><span style="color:#A6ACCD;">  });</span></span>
<span class="line"><span style="color:#A6ACCD;">  // console.log(&quot;identifierKeys==&quot;, identifierKeys, variableMap);</span></span>
<span class="line"><span style="color:#A6ACCD;">  // 对收集的特殊类型的变量，找出其值</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  for (const _key of identifierKeys) {</span></span>
<span class="line"><span style="color:#A6ACCD;">    if (variableMap.has(_key)) {</span></span>
<span class="line"><span style="color:#A6ACCD;">      keys.push(variableMap.get(_key));</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">  }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  fs.writeFileSync(&quot;./i18n-keys.json&quot;, JSON.stringify(keys));</span></span>
<span class="line"><span style="color:#A6ACCD;">  return source;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">module.exports = i18nLoader;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>webpack-chain 配置本地 loader 如下：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">chainWebpack(config){</span></span>
<span class="line"><span style="color:#A6ACCD;">  config.module</span></span>
<span class="line"><span style="color:#A6ACCD;">  .rule(&#39;i18n&#39;)</span></span>
<span class="line"><span style="color:#A6ACCD;">  .test(/\\/src(.*)\\.js$/) //--匹配要处理的文件</span></span>
<span class="line"><span style="color:#A6ACCD;">  .include</span></span>
<span class="line"><span style="color:#A6ACCD;">  .add(path.resolve(__dirname,&#39;src&#39;))</span></span>
<span class="line"><span style="color:#A6ACCD;">  .end()</span></span>
<span class="line"><span style="color:#A6ACCD;">  .use(&#39;i18n-loader.js&#39;)</span></span>
<span class="line"><span style="color:#A6ACCD;">  .loader(&#39;./loader.js&#39;) //--具体loader文件地址</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>webpack config 配置本地 loader 如下</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;"> module: {</span></span>
<span class="line"><span style="color:#A6ACCD;">    rules: [</span></span>
<span class="line"><span style="color:#A6ACCD;">    {</span></span>
<span class="line"><span style="color:#A6ACCD;">      test:/\\/src(.*)\\.js$/,</span></span>
<span class="line"><span style="color:#A6ACCD;">      use: path.resolve(__dirname, &#39;loader.js&#39;),</span></span>
<span class="line"><span style="color:#A6ACCD;">      include: [path.resolve(__dirname,&#39;src&#39;)],</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">  ]</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div>`,13),o=[p];function t(c,r,i,C,A,y){return a(),n("div",null,o)}const D=s(e,[["render",t]]);export{d as __pageData,D as default};
