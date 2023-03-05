import{_ as s,c as n,o as a,a as l}from"./app.ee7dae8a.js";const D=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"fe-more/Lighthouse第三方库审计--从现象到源码追踪.md"}'),e={name:"fe-more/Lighthouse第三方库审计--从现象到源码追踪.md"},p=l(`<h4 id="lighthouse-第三方库审计-从现象到源码追踪" tabindex="-1">Lighthouse 第三方库审计--从现象到源码追踪 <a class="header-anchor" href="#lighthouse-第三方库审计-从现象到源码追踪" aria-hidden="true">#</a></h4><blockquote><p>原文地址：<a href="https://github.com/huwuji/zn-weekly/blob/master/src/blog/lighthouse%E5%AE%A1%E8%AE%A1.md" target="_blank" rel="noreferrer">https://github.com/huwuji/zn-weekly/blob/master/src/blog/lighthouse审计.md</a></p></blockquote><blockquote><p>本文不着重讲 Lighthouse 的使用，只是根据一个例子，衍生出对于 Lighthouse 审计的思考和调研实践；</p></blockquote><ol><li><p>背景： 在做站点优化的时候，利用 Lighthouse 跟进性能和最佳实践，发现有两个库存在安全漏洞； 如图： <img src="https://raw.githubusercontent.com/huwuji/zn-weekly/master/src/Images/lighthouse-1.png" alt=""> 对于以上问题，我们处理这个漏洞的方式也简单； 我们可以直接点击漏洞文件，会进入 snyk 的网站,<br> 如：<a href="https://security.snyk.io/package/npm/jquery" target="_blank" rel="noreferrer">https://security.snyk.io/package/npm/jquery</a><a href="https://security.snyk.io/package/npm/lodash" target="_blank" rel="noreferrer">https://security.snyk.io/package/npm/lodash</a> 从中找到没有漏洞的版本，再升级版本。 或者移除当前的库。</p><p>如果我们查看 Lighthouse 生成的报告的 Json 文件，我们可以看到在审计 audits 下会有这样的额报告；</p></li></ol><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">   &quot;no-vulnerable-libraries&quot;: {</span></span>
<span class="line"><span style="color:#A6ACCD;">   &quot;id&quot;: &quot;no-vulnerable-libraries&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">   &quot;title&quot;: &quot;Includes front-end JavaScript libraries with known security vulnerabilities&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">   &quot;description&quot;: &quot;Some third-party scripts may contain known security vulnerabilities that are easily identified and exploited by attackers. [Learn more](https://web.dev/no-vulnerable-libraries/).&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">   &quot;score&quot;: 0,</span></span>
<span class="line"><span style="color:#A6ACCD;">   &quot;scoreDisplayMode&quot;: &quot;binary&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">   &quot;displayValue&quot;: &quot;4 vulnerabilities detected&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">   &quot;details&quot;: {</span></span>
<span class="line"><span style="color:#A6ACCD;">     &quot;type&quot;: &quot;table&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">     &quot;headings&quot;: [</span></span>
<span class="line"><span style="color:#A6ACCD;">       {</span></span>
<span class="line"><span style="color:#A6ACCD;">         &quot;key&quot;: &quot;detectedLib&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">         &quot;itemType&quot;: &quot;link&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">         &quot;text&quot;: &quot;Library Version&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">       },</span></span>
<span class="line"><span style="color:#A6ACCD;">       {</span></span>
<span class="line"><span style="color:#A6ACCD;">         &quot;key&quot;: &quot;vulnCount&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">         &quot;itemType&quot;: &quot;text&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">         &quot;text&quot;: &quot;Vulnerability Count&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">       },</span></span>
<span class="line"><span style="color:#A6ACCD;">       {</span></span>
<span class="line"><span style="color:#A6ACCD;">         &quot;key&quot;: &quot;highestSeverity&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">         &quot;itemType&quot;: &quot;text&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">         &quot;text&quot;: &quot;Highest Severity&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">       }</span></span>
<span class="line"><span style="color:#A6ACCD;">     ],</span></span>
<span class="line"><span style="color:#A6ACCD;">     &quot;items&quot;: [</span></span>
<span class="line"><span style="color:#A6ACCD;">       {</span></span>
<span class="line"><span style="color:#A6ACCD;">         &quot;highestSeverity&quot;: &quot;High&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">         &quot;vulnCount&quot;: 4,</span></span>
<span class="line"><span style="color:#A6ACCD;">         &quot;detectedLib&quot;: {</span></span>
<span class="line"><span style="color:#A6ACCD;">           &quot;text&quot;: &quot;Lo-Dash@4.17.20&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">           &quot;url&quot;: &quot;https://snyk.io/vuln/npm:lodash?lh=4.17.20&amp;utm_source=lighthouse&amp;utm_medium=ref&amp;utm_campaign=audit&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">           &quot;type&quot;: &quot;link&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">         }</span></span>
<span class="line"><span style="color:#A6ACCD;">       }</span></span>
<span class="line"><span style="color:#A6ACCD;">     ],</span></span>
<span class="line"><span style="color:#A6ACCD;">     &quot;summary&quot;: {}</span></span>
<span class="line"><span style="color:#A6ACCD;">   }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"> },</span></span>
<span class="line"><span style="color:#A6ACCD;">  ...</span></span>
<span class="line"><span style="color:#A6ACCD;"> &quot;js-libraries&quot;: {</span></span>
<span class="line"><span style="color:#A6ACCD;">   &quot;id&quot;: &quot;js-libraries&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">   &quot;title&quot;: &quot;Detected JavaScript libraries&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">   &quot;description&quot;: &quot;All front-end JavaScript libraries detected on the page. [Learn more](https://web.dev/js-libraries/).&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">   &quot;score&quot;: null,</span></span>
<span class="line"><span style="color:#A6ACCD;">   &quot;scoreDisplayMode&quot;: &quot;informative&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">   &quot;details&quot;: {</span></span>
<span class="line"><span style="color:#A6ACCD;">     &quot;type&quot;: &quot;table&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">     &quot;headings&quot;: [</span></span>
<span class="line"><span style="color:#A6ACCD;">       {</span></span>
<span class="line"><span style="color:#A6ACCD;">         &quot;key&quot;: &quot;name&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">         &quot;itemType&quot;: &quot;text&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">         &quot;text&quot;: &quot;Name&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">       },</span></span>
<span class="line"><span style="color:#A6ACCD;">       {</span></span>
<span class="line"><span style="color:#A6ACCD;">         &quot;key&quot;: &quot;version&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">         &quot;itemType&quot;: &quot;text&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">         &quot;text&quot;: &quot;Version&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">       }</span></span>
<span class="line"><span style="color:#A6ACCD;">     ],</span></span>
<span class="line"><span style="color:#A6ACCD;">     &quot;items&quot;: [</span></span>
<span class="line"><span style="color:#A6ACCD;">       {</span></span>
<span class="line"><span style="color:#A6ACCD;">         &quot;name&quot;: &quot;Lo-Dash&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">         &quot;version&quot;: &quot;4.17.20&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">         &quot;npm&quot;: &quot;lodash&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">       }]</span></span>
<span class="line"><span style="color:#A6ACCD;">       }</span></span>
<span class="line"><span style="color:#A6ACCD;">     }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>往下我们继续思考</p><ol start="2"><li><p>Lighthouse<br> Lighthouse 是怎么分析出这些有漏洞的库呢？ 查看<a href="https://web.dev/no-vulnerable-libraries" target="_blank" rel="noreferrer">官网</a>我们知道：</p><blockquote><p>为了检测易受攻击的库，Lighthouse 会执行以下操作：</p><ul><li>运行适用于 Chrome 的库检测器。</li><li>根据 snyk 的漏洞数据库检查检测到的库列表。</li></ul></blockquote><p>请继续思考： 这里我们假定我们对 Lighthouse 的工作原理有一定的了解：</p><p>lighthouse 的组成：</p><ul><li>Driver（驱动）—— 通过 Chrome Debugging Protocol (Chrome 远程调试协议) 和 Chrome 进行交互。</li><li>Gatherer（采集器）—— 决定在页面加载过程中采集哪些信息，将采集的信息输出为 Artifact。可自定义。</li><li>Audit（审查器）—— 将 Gatherer 采集的 Artifact 作为输入，审查器会对其测试，然后得出相应的测评结果。可自定义</li><li>Reporte（报告）—— 将审查的结果通过指定的方式报告出来。</li></ul><p>lighthouse 的工作流程 指定浏览器页面打开 url-利用 chrome 远程调试协议连接对应 chrome 页面端口-搜集数据-审查数据-生成报告；</p><p>以上是 Lighthouse 的相关工作原理； 那我们是不是也可以自定义搜集器和审计器来检查出漏洞库呢？</p></li><li><p>自定义搜集器和审计器 首先我们先以一个自定义检验 Script 资源加载的总时长的搜集器和审计器入手； 代码如下：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">&lt;!-- 搜集器 --&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;"> const Gatherer = require(&quot;lighthouse&quot;).Gatherer; // 引入 lighthouse 的标准采集器</span></span>
<span class="line"><span style="color:#A6ACCD;"> class ResourceGatherer extends Gatherer {</span></span>
<span class="line"><span style="color:#A6ACCD;"> afterPass(options) {</span></span>
<span class="line"><span style="color:#A6ACCD;">     const driver = options.driver;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">     return driver</span></span>
<span class="line"><span style="color:#A6ACCD;">     .evaluateAsync(&quot;JSON.stringify(window.performance.getEntries())&quot;)</span></span>
<span class="line"><span style="color:#A6ACCD;">     .then((loadMetrics) =&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;">         if (!loadMetrics) {</span></span>
<span class="line"><span style="color:#A6ACCD;">         throw new Error(&quot;无法获取资源&quot;);</span></span>
<span class="line"><span style="color:#A6ACCD;">         }</span></span>
<span class="line"><span style="color:#A6ACCD;">         return loadMetrics;</span></span>
<span class="line"><span style="color:#A6ACCD;">     });</span></span>
<span class="line"><span style="color:#A6ACCD;"> }</span></span>
<span class="line"><span style="color:#A6ACCD;"> }</span></span>
<span class="line"><span style="color:#A6ACCD;"> &lt;!-- 审计器 --&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;"> const Audit = require(&quot;lighthouse&quot;).Audit; // 引入 lighthouse 的标准审查器</span></span>
<span class="line"><span style="color:#A6ACCD;"> class ResourceAudit extends Audit {</span></span>
<span class="line"><span style="color:#A6ACCD;"> static get meta() {</span></span>
<span class="line"><span style="color:#A6ACCD;"> return {</span></span>
<span class="line"><span style="color:#A6ACCD;"> id: &quot;resource-audit&quot;, // 与 audits 数组对应</span></span>
<span class="line"><span style="color:#A6ACCD;"> title: &quot;资源信息&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;"> failureTitle: &quot;资源加载失败&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;"> description: &quot;显示所有资源&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;"> requiredArtifacts: [&quot;ResourceGatherer&quot;], // 所对应的采集器</span></span>
<span class="line"><span style="color:#A6ACCD;"> };</span></span>
<span class="line"><span style="color:#A6ACCD;"> }</span></span>
<span class="line"><span style="color:#A6ACCD;"> static audit(artifacts) {</span></span>
<span class="line"><span style="color:#A6ACCD;"> const sources = JSON.parse(artifacts.ResourceGatherer); // 获取采集内容</span></span>
<span class="line"><span style="color:#A6ACCD;">     if (!sources.length) {</span></span>
<span class="line"><span style="color:#A6ACCD;">         return {</span></span>
<span class="line"><span style="color:#A6ACCD;">             numericValue: 0,</span></span>
<span class="line"><span style="color:#A6ACCD;">             score: 1,</span></span>
<span class="line"><span style="color:#A6ACCD;">             displayValue: &quot;No list found&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">         };</span></span>
<span class="line"><span style="color:#A6ACCD;">     }</span></span>
<span class="line"><span style="color:#A6ACCD;">     const durations = sources.map((d) =&gt; d.duration);</span></span>
<span class="line"><span style="color:#A6ACCD;">     const duration = durations.reduce((prev, next) =&gt; prev + next, 0);</span></span>
<span class="line"><span style="color:#A6ACCD;">     // 10s,5s</span></span>
<span class="line"><span style="color:#A6ACCD;">     const score = duration &gt; 5 ? 100 - 10*(duration - 5) : 100;length; // 计算总分</span></span>
<span class="line"><span style="color:#A6ACCD;">     return {</span></span>
<span class="line"><span style="color:#A6ACCD;">     numericValue: duration, // 检测值</span></span>
<span class="line"><span style="color:#A6ACCD;">     score, // 得分</span></span>
<span class="line"><span style="color:#A6ACCD;">     details: {</span></span>
<span class="line"><span style="color:#A6ACCD;">         items: loadMetrics, // 详情</span></span>
<span class="line"><span style="color:#A6ACCD;">     },</span></span>
<span class="line"><span style="color:#A6ACCD;">     displayValue: \`Query render avarage timing is \${parseInt(</span></span>
<span class="line"><span style="color:#A6ACCD;">         duration,</span></span>
<span class="line"><span style="color:#A6ACCD;">         10</span></span>
<span class="line"><span style="color:#A6ACCD;">     )}ms\`,</span></span>
<span class="line"><span style="color:#A6ACCD;">     };</span></span>
<span class="line"><span style="color:#A6ACCD;"> }</span></span>
<span class="line"><span style="color:#A6ACCD;"> }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div></li></ol><p>大体思考是：利用 Performance API 的能力，通过 window.performance.getEntries()获取当前页面的各种类型资源，再通过自定义的审计器来对数据分析给出结果；</p><ol start="4"><li>第三库漏洞的搜集和审计的流程分析？ 这里直接给出思路：</li></ol><ul><li>先搜集页面加载了的第三方库，获取这些库的名称和版本号；</li><li>再去 snyk 中查看该库的版本是否有漏洞，以及漏洞程度；</li></ul><p>以上两步骤，第二步比较脚本，这里我们来追踪一下 Lighthouse 是怎么获取第三方库的；</p><p>下面我们关注下 Lighthouse 源码是怎么实现的</p><ol start="5"><li>关于 Lighthouse 搜集和审计第三方库的--<a href="https://web.dev/js-libraries/" target="_blank" rel="noreferrer">Detected JavaScript libraries</a></li></ol><p>首先我们找到 js-libaries 的审计器;(检测出页面所加载的第三方库) 我们从 Lighthouse 的 report 中可以看到如上述代码展示： <strong>[report 中的 audius 的 js-libraries 属性]</strong></p><p>搜<a href="https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/dobetterweb/js-libraries.js" target="_blank" rel="noreferrer">审计器源码</a>如下，比较简单，及把 Stacks 搜集器的数据处理输出；</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">class JsLibrariesAudit extends Audit {</span></span>
<span class="line"><span style="color:#A6ACCD;">  /**</span></span>
<span class="line"><span style="color:#A6ACCD;">   * @return {LH.Audit.Meta}</span></span>
<span class="line"><span style="color:#A6ACCD;">   */</span></span>
<span class="line"><span style="color:#A6ACCD;">  static get meta() {</span></span>
<span class="line"><span style="color:#A6ACCD;">    return {</span></span>
<span class="line"><span style="color:#A6ACCD;">      id: &quot;js-libraries&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">      title: &quot;Detected JavaScript libraries&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">      description: &quot;All front-end JavaScript libraries detected on the page.&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">      requiredArtifacts: [&quot;Stacks&quot;],</span></span>
<span class="line"><span style="color:#A6ACCD;">    };</span></span>
<span class="line"><span style="color:#A6ACCD;">  }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  /**</span></span>
<span class="line"><span style="color:#A6ACCD;">   * @param {LH.Artifacts} artifacts</span></span>
<span class="line"><span style="color:#A6ACCD;">   * @return {LH.Audit.Product}</span></span>
<span class="line"><span style="color:#A6ACCD;">   */</span></span>
<span class="line"><span style="color:#A6ACCD;">  static audit(artifacts) {</span></span>
<span class="line"><span style="color:#A6ACCD;">    const libDetails = artifacts.Stacks.filter(</span></span>
<span class="line"><span style="color:#A6ACCD;">      (stack) =&gt; stack.detector === &quot;js&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">    ).map((stack) =&gt; ({</span></span>
<span class="line"><span style="color:#A6ACCD;">      name: stack.name,</span></span>
<span class="line"><span style="color:#A6ACCD;">      version: stack.version,</span></span>
<span class="line"><span style="color:#A6ACCD;">      npm: stack.npm,</span></span>
<span class="line"><span style="color:#A6ACCD;">    }));</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    /** @type {LH.Audit.Details.Table[&#39;headings&#39;]} */</span></span>
<span class="line"><span style="color:#A6ACCD;">    const headings = [</span></span>
<span class="line"><span style="color:#A6ACCD;">      { key: &quot;name&quot;, itemType: &quot;text&quot;, text: &quot;Name&quot; },</span></span>
<span class="line"><span style="color:#A6ACCD;">      { key: &quot;version&quot;, itemType: &quot;text&quot;, text: &quot;Version&quot; },</span></span>
<span class="line"><span style="color:#A6ACCD;">    ];</span></span>
<span class="line"><span style="color:#A6ACCD;">    const details = Audit.makeTableDetails(headings, libDetails, {});</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    return {</span></span>
<span class="line"><span style="color:#A6ACCD;">      score: 1, // Always pass for now.</span></span>
<span class="line"><span style="color:#A6ACCD;">      details,</span></span>
<span class="line"><span style="color:#A6ACCD;">    };</span></span>
<span class="line"><span style="color:#A6ACCD;">  }</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>这里我们主要关注 &#39;Stacks&#39;--这个是我们对应要查找的搜集器； <a href="https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/lib/stack-collector.js" target="_blank" rel="noreferrer">Stacks 搜集器源码</a> 我们看重要的部分，部分源码如下：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">const libDetectorSource = fs.readFileSync(</span></span>
<span class="line"><span style="color:#A6ACCD;">  require.resolve(&#39;js-library-detector/library/libraries.js&#39;), &#39;utf8&#39;);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">async function detectLibraries() {</span></span>
<span class="line"><span style="color:#A6ACCD;">  /** @type {JSLibrary[]} */</span></span>
<span class="line"><span style="color:#A6ACCD;">  const libraries = [];</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  // d41d8cd98f00b204e9800998ecf8427e_ is a consistent prefix used by the detect libraries</span></span>
<span class="line"><span style="color:#A6ACCD;">  // see https://github.com/HTTPArchive/httparchive/issues/77#issuecomment-291320900</span></span>
<span class="line"><span style="color:#A6ACCD;">  /** @type {Record&lt;string, JSLibraryDetectorTest&gt;} */</span></span>
<span class="line"><span style="color:#A6ACCD;">  // @ts-ignore - injected libDetectorSource var</span></span>
<span class="line"><span style="color:#A6ACCD;">  const libraryDetectorTests = d41d8cd98f00b204e9800998ecf8427e_LibraryDetectorTests; // eslint-disable-line</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  for (const [name, lib] of Object.entries(libraryDetectorTests)) {</span></span>
<span class="line"><span style="color:#A6ACCD;">    try {</span></span>
<span class="line"><span style="color:#A6ACCD;">      const result = await lib.test(window);</span></span>
<span class="line"><span style="color:#A6ACCD;">      if (result) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        libraries.push({</span></span>
<span class="line"><span style="color:#A6ACCD;">          name: name,</span></span>
<span class="line"><span style="color:#A6ACCD;">          icon: lib.icon,</span></span>
<span class="line"><span style="color:#A6ACCD;">          version: result.version,</span></span>
<span class="line"><span style="color:#A6ACCD;">          npm: lib.npm,</span></span>
<span class="line"><span style="color:#A6ACCD;">        });</span></span>
<span class="line"><span style="color:#A6ACCD;">      }</span></span>
<span class="line"><span style="color:#A6ACCD;">    } catch (e) {}</span></span>
<span class="line"><span style="color:#A6ACCD;">  }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  return libraries;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>从上面逻辑我们可以看出： 核心是 libraryDetectorTests 对象， 之后核心代码 const result = await lib.test(window); 那 libraryDetectorTests 对象怎么找到呢？ 上文有</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">const libDetectorSource = fs.readFileSync(</span></span>
<span class="line"><span style="color:#A6ACCD;">  require.resolve(&#39;js-library-detector/library/libraries.js&#39;), &#39;utf8&#39;);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>我们从<a href="https://github.com/johnmichel/Library-Detector-for-Chrome" target="_blank" rel="noreferrer">js-library-detector 库</a>的源码中查找到该文件<a href="https://github.com/johnmichel/Library-Detector-for-Chrome/blob/master/library/libraries.js" target="_blank" rel="noreferrer">js-library-detector/library/libraries.js</a>; 这么我们展示部分源码来分析： 源码如下：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">var d41d8cd98f00b204e9800998ecf8427e_LibraryDetectorTests = {</span></span>
<span class="line"><span style="color:#A6ACCD;">  &quot;Lo-Dash&quot;: {</span></span>
<span class="line"><span style="color:#A6ACCD;">    id: &quot;lodash&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">    icon: &quot;lodash&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">    url: &quot;https://lodash.com/&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">    npm: &quot;lodash&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">    test: function (win) {</span></span>
<span class="line"><span style="color:#A6ACCD;">      var _ = typeof (_ = win._) == &quot;function&quot; &amp;&amp; _,</span></span>
<span class="line"><span style="color:#A6ACCD;">        chain = typeof (chain = _ &amp;&amp; _.chain) == &quot;function&quot; &amp;&amp; chain,</span></span>
<span class="line"><span style="color:#A6ACCD;">        wrapper = (</span></span>
<span class="line"><span style="color:#A6ACCD;">          chain ||</span></span>
<span class="line"><span style="color:#A6ACCD;">          _ ||</span></span>
<span class="line"><span style="color:#A6ACCD;">          function () {</span></span>
<span class="line"><span style="color:#A6ACCD;">            return {};</span></span>
<span class="line"><span style="color:#A6ACCD;">          }</span></span>
<span class="line"><span style="color:#A6ACCD;">        )(1);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">      if (_ &amp;&amp; wrapper.__wrapped__) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        return { version: _.VERSION || UNKNOWN_VERSION };</span></span>
<span class="line"><span style="color:#A6ACCD;">      }</span></span>
<span class="line"><span style="color:#A6ACCD;">      return false;</span></span>
<span class="line"><span style="color:#A6ACCD;">    },</span></span>
<span class="line"><span style="color:#A6ACCD;">  },</span></span>
<span class="line"><span style="color:#A6ACCD;">   jQuery: {</span></span>
<span class="line"><span style="color:#A6ACCD;">    id: &quot;jquery&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">    icon: &quot;jquery&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">    url: &quot;http://jquery.com&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">    npm: &quot;jquery&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">    test: function (win) {</span></span>
<span class="line"><span style="color:#A6ACCD;">      var jq = win.jQuery || win.$;</span></span>
<span class="line"><span style="color:#A6ACCD;">      if (jq &amp;&amp; jq.fn &amp;&amp; jq.fn.jquery) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        return {</span></span>
<span class="line"><span style="color:#A6ACCD;">          version: jq.fn.jquery.replace(/[^\\d+\\.+]/g, &quot;&quot;) || UNKNOWN_VERSION,</span></span>
<span class="line"><span style="color:#A6ACCD;">        };</span></span>
<span class="line"><span style="color:#A6ACCD;">      }</span></span>
<span class="line"><span style="color:#A6ACCD;">      return false;</span></span>
<span class="line"><span style="color:#A6ACCD;">    },</span></span>
<span class="line"><span style="color:#A6ACCD;">  },</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>再结合搜集器的代码逻辑</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">const result = await lib.test(window);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>So,怎么实现获取 url 的第三方库明了了；再浏览器上试试这个 test； 如图： <img src="https://raw.githubusercontent.com/huwuji/zn-weekly/master/src/Images/lighthouse-2.png" alt="test"> 果然如此：</p><p>这部分总结： 及通过 libraries 定义的检查数组一个个再页面上执行检测方法；</p><p>继续思考： 如果打包压缩方式改变了，这么的检测函数也是需要对应修改的；</p><blockquote><p><a href="https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/dobetterweb/js-libraries.js" target="_blank" rel="noreferrer">Lighthouse JSlibraries Audits 源码</a></p></blockquote><blockquote><p><a href="https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/lib/stack-collector.js" target="_blank" rel="noreferrer">Lighthouse JSstack Gatherer stack-collector.js 源码</a></p></blockquote><blockquote><p><a href="https://github.com/johnmichel/Library-Detector-for-Chrome/blob/master/library/libraries.js" target="_blank" rel="noreferrer">Lighthouse DetectorLibraries 列表</a> 来自 js-library-detector npm 包</p></blockquote><blockquote><p><a href="https://web.dev/lighthouse-best-practices/" target="_blank" rel="noreferrer">https://web.dev/lighthouse-best-practices/</a></p></blockquote><blockquote><p><a href="https://web.dev/no-vulnerable-libraries/" target="_blank" rel="noreferrer">https://web.dev/no-vulnerable-libraries/</a></p></blockquote>`,32),t=[p];function o(r,c,i,A,C,u){return a(),n("div",null,t)}const q=s(e,[["render",o]]);export{D as __pageData,q as default};
