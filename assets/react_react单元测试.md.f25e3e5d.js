import{_ as s,c as n,o as a,a as e}from"./app.b8d11a0b.js";const g=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[{"level":2,"title":"单元测试","slug":"单元测试","link":"#单元测试","children":[]}],"relativePath":"react/react单元测试.md"}'),t={name:"react/react单元测试.md"},l=e(`<h2 id="单元测试" tabindex="-1">单元测试 <a class="header-anchor" href="#单元测试" aria-hidden="true">#</a></h2><blockquote><p>原址：<a href="https://github.com/huwuji/blog/tree/master/notes/FE-thinking" target="_blank" rel="noreferrer">https://github.com/huwuji/blog/tree/master/notes/FE-thinking</a></p></blockquote><blockquote><p><strong>工程地址源码参见：</strong> <a href="https://github.com/huwuji/blog/tree/master/Demo/react-redux-generator" target="_blank" rel="noreferrer">https://github.com/huwuji/blog/tree/master/Demo/react-redux-generator</a></p></blockquote><ol><li>单元测试的框架选择---Jest+React Testing Library</li></ol><p>Jest: 相信大家都有所了解。</p><blockquote><p>Jest 是一款优雅、简洁的 JavaScript 测试框架。Jest 支持 Babel、TypeScript、Node、React、Angular、Vue 等诸多框架！</p><ul><li>无需测试；</li><li>并行隔离测试；</li><li>实时快照追踪；</li><li>文档齐全；</li></ul></blockquote><p>Enzyme：原本是想选择这个 React 测试库的，Enzyme 提供一种测试 React 组件内部的能力。但是考虑到当前项目是 React18，然后了解了一番后， 可以了解下这篇小文，<a href="https://dev.to/wojtekmaj/enzyme-is-dead-now-what-ekl" target="_blank" rel="noreferrer">Enzyme is dead. Now what?</a>, 决定使用<a href="https://testing-library.com/docs/react-testing-library/intro/" target="_blank" rel="noreferrer">React Testing Library</a>;</p><p><a href="https://testing-library.com/docs/react-testing-library/intro/" target="_blank" rel="noreferrer">React Testing Library</a></p><blockquote><p>React Testing Library builds on top of DOM Testing Library by adding APIs for working with React components. The React Testing Library is a very light-weight solution for testing React components. It provides light utility functions on top of react-dom and react-dom/test-utils, in a way that encourages better testing practices. Its primary guiding principle is: The more your tests resemble the way your software is used, the more confidence they can give you. React Testing Library 是一个 DOM 测试库，它不能直接处理 React 组件实例，而是站在应用的角度去测试，测试产物及 Dom；</p></blockquote><p>React Testing Library 具体给用户提供哪些能力及可调用的 API？ 具体参看：<a href="https://testing-library.com/docs/react-testing-library/api#renderhook-result" target="_blank" rel="noreferrer">https://testing-library.com/docs/react-testing-library/api#renderhook-result</a></p><p>同时我们也参考 React 提供的测试：<a href="https://reactjs.org/docs/testing-recipes.html" target="_blank" rel="noreferrer">https://reactjs.org/docs/testing-recipes.html</a></p><p>主要关注：</p><ul><li><p>render: 渲染组件，</p><ul><li>asFragment： 执行生成当前组件快照；</li></ul></li><li><p>renderHook： 渲染 hooks 函数 返回 - result：当前执行的结果。 - rerender：再次执行渲染</p></li><li><p>cleanup 卸载使用 render 挂载的 React 树。也是防止内存泄露</p></li><li><p>act 在编写 UI 测试时，可以将渲染、用户事件或数据获取等任务视为与用户界面交互的“单元”。react-dom/test-utils 提供了一个名为 act() 的 helper，它确保在进行任何断言之前，与这些“单元”相关的所有更新都已处理并应用于 DOM：</p></li></ul><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">act(() =&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;">  // 渲染组件</span></span>
<span class="line"><span style="color:#A6ACCD;">});</span></span>
<span class="line"><span style="color:#A6ACCD;">// 进行断言</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><ul><li><p>fireEvent 触发事件</p></li><li><p>waitForElement 等待异步操作</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">import {</span></span>
<span class="line"><span style="color:#A6ACCD;">render,</span></span>
<span class="line"><span style="color:#A6ACCD;">cleanup,</span></span>
<span class="line"><span style="color:#A6ACCD;">fireEvent,</span></span>
<span class="line"><span style="color:#A6ACCD;">waitForElement,</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">from &quot;@testing-library/react&quot;;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">// 每个测试单元后卸载Dom，清理内存。</span></span>
<span class="line"><span style="color:#A6ACCD;">afterEach(cleanup);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">it(&quot;waitForElement test&quot;, async () =&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;">const { getByTestId, getByText } = render(&lt;TestAsync /&gt;);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    fireEvent.click(getByTestId(&quot;button-add&quot;));</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    const counter = await waitForElement(() =&gt; getByText(&quot;1&quot;));</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    expect(counter).toHaveTextContent(&quot;1&quot;);</span></span>
<span class="line"><span style="color:#A6ACCD;">    });</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>测试用例 Demo 路径如下： <strong>[<strong>tests</strong>/test/home.test.js]</strong> 包含方法，React 组件和 hooks 的测试栗子：</p></li></ul><p>总结下，对于具体的测试方法，可以在编写测试用例的过程中，站在用户的行为角度，遍写边翻阅以上提到的文档，自然的就会不断熟悉。</p><ol start="2"><li><p>Jest 测试配置 这里参考 create-react-app，我们通过 create-react-app 创建项目后，直接 eject 出来，查看具体的配置，供我们参考。 create-react-app 的 jest 配置在 package.json 中的 jest 属性;</p><p>配置需要注意：</p><ul><li>对于 less 的解析 安装：jest-css-modules 配置<div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">moduleNameMapper: {</span></span>
<span class="line"><span style="color:#A6ACCD;">&quot;\\\\.(css|less|scss|sss|styl)$&quot;: &quot;&lt;rootDir&gt;/node_modules/jest-css-modules&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">},</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div></li><li>静态资源引用 配置别名<div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">moduleNameMapper: {</span></span>
<span class="line"><span style="color:#A6ACCD;">  &quot;^@(.*)$&quot;: &quot;&lt;rootDir&gt;/src/$1&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">rootDir: path.join(__dirname),</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div>同时也可以根据 testMatch 属性来更精确的筛选;</li></ul><p><strong>jest.config.js 的配置文件如下</strong></p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">const path = require(&quot;path&quot;);</span></span>
<span class="line"><span style="color:#A6ACCD;">module.exports = {</span></span>
<span class="line"><span style="color:#A6ACCD;"> collectCoverageFrom: [&quot;src/**/*.{js,jsx,ts,tsx}&quot;, &quot;!src/**/*.d.ts&quot;],</span></span>
<span class="line"><span style="color:#A6ACCD;"> moduleFileExtensions: [</span></span>
<span class="line"><span style="color:#A6ACCD;">     &quot;js&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">     &quot;mjs&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">     &quot;cjs&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">     &quot;jsx&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">     &quot;ts&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">     &quot;tsx&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">     &quot;json&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">     &quot;node&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;"> ],</span></span>
<span class="line"><span style="color:#A6ACCD;">moduleNameMapper: {</span></span>
<span class="line"><span style="color:#A6ACCD;">      &quot;\\\\.(css|less|scss|sss|styl)$&quot;: &quot;&lt;rootDir&gt;/node_modules/jest-css-modules&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;"> },</span></span>
<span class="line"><span style="color:#A6ACCD;"> rootDir: path.join(__dirname),</span></span>
<span class="line"><span style="color:#A6ACCD;"> roots: [&quot;&lt;rootDir&gt;&quot;],</span></span>
<span class="line"><span style="color:#A6ACCD;"> setupFilesAfterEnv: [&quot;&lt;rootDir&gt;/src/setupTests.js&quot;],</span></span>
<span class="line"><span style="color:#A6ACCD;"> testEnvironment: &quot;jsdom&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;"> testMatch: [&quot;**/__tests__/**/*.[jt]s?(x)&quot;, &quot;**/?(*.)+(spec|test).[tj]s?(x)&quot;],</span></span>
<span class="line"><span style="color:#A6ACCD;"> testPathIgnorePatterns: [&quot;/node_modules/&quot;],</span></span>
<span class="line"><span style="color:#A6ACCD;"> testRegex: [],</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div></li><li><p>测试问题汇总：</p></li></ol><ul><li><p>问题一：关于引用 Redux 的测试问题：</p><blockquote><p>问题：could not find react-redux context value; please ensure the component is wrapped in a [Provider[]</p></blockquote><blockquote><p>参考：<a href="https://redux.js.org/usage/writing-tests#components" target="_blank" rel="noreferrer">https://redux.js.org/usage/writing-tests#components</a></p></blockquote><p>这里就需要配置引入 react-redux</p></li><li><p>问题二： 关于引入 Router</p><blockquote><p>useHref() may be used only in the context of a [Router[] component.</p></blockquote></li></ul><p>对于问题一二应用后代码如下：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">  import React from &quot;react&quot;;</span></span>
<span class="line"><span style="color:#A6ACCD;">  import {  render } from &quot;@testing-library/react&quot;;</span></span>
<span class="line"><span style="color:#A6ACCD;">  import { Provider } from &quot;react-redux&quot;;</span></span>
<span class="line"><span style="color:#A6ACCD;">  import { BrowserRouter, Routes, Route } from &quot;react-router-dom&quot;;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  import getStore from &quot;../../src/store&quot;;</span></span>
<span class="line"><span style="color:#A6ACCD;">  import Layout from &quot;../../src/containers/layout&quot;;</span></span>
<span class="line"><span style="color:#A6ACCD;">  import Home from &quot;../../src/containers/home/index.js&quot;;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  it(&quot;测试初始快照&quot;, async () =&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;">      const { asFragment, getByText } = render(</span></span>
<span class="line"><span style="color:#A6ACCD;">        &lt;Provider store={getStore()}&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">          &lt;BrowserRouter&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">            &lt;Routes&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">              &lt;Route path=&quot;/&quot; element={&lt;Layout /&gt;}&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">                &lt;Route index element={&lt;Home /&gt;} /&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">              &lt;/Route&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">            &lt;/Routes&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">          &lt;/BrowserRouter&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">        &lt;/Provider&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">      );</span></span>
<span class="line"><span style="color:#A6ACCD;">      console.log(&quot;result==&quot;, asFragment());</span></span>
<span class="line"><span style="color:#A6ACCD;">      expect(getByText(&quot;my home page&quot;)).toBeInTheDocument;</span></span>
<span class="line"><span style="color:#A6ACCD;">  });</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div>`,20),o=[l];function p(r,c,i,u,C,A){return a(),n("div",null,o)}const d=s(t,[["render",p]]);export{g as __pageData,d as default};
