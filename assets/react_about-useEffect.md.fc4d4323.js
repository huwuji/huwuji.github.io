import{_ as s,c as e,o as n,a}from"./app.ee7dae8a.js";const A=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[{"level":2,"title":"关于 useEffect","slug":"关于-useeffect","link":"#关于-useeffect","children":[{"level":3,"title":"实践出真知","slug":"实践出真知","link":"#实践出真知","children":[]},{"level":3,"title":"从原理到源码","slug":"从原理到源码","link":"#从原理到源码","children":[]},{"level":3,"title":"useEffect 执行后，同步的状态数据怎么在 React 的工作流中发挥作用？","slug":"useeffect-执行后-同步的状态数据怎么在-react-的工作流中发挥作用","link":"#useeffect-执行后-同步的状态数据怎么在-react-的工作流中发挥作用","children":[]},{"level":3,"title":"总结：","slug":"总结","link":"#总结","children":[]}]}],"relativePath":"react/about-useEffect.md"}'),t={name:"react/about-useEffect.md"},l=a(`<h2 id="关于-useeffect" tabindex="-1">关于 useEffect <a class="header-anchor" href="#关于-useeffect" aria-hidden="true">#</a></h2><blockquote><p>原址：<a href="https://github.com/huwuji/blog/tree/master/notes/FE-thinking" target="_blank" rel="noreferrer">https://github.com/huwuji/blog/tree/master/notes/FE-thinking</a></p></blockquote><blockquote><p>先上场景： demo-1:</p></blockquote><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">useEffect(()=&gt;{</span></span>
<span class="line"><span style="color:#A6ACCD;">    //根据state处理</span></span>
<span class="line"><span style="color:#A6ACCD;">    console.log(&#39;a&#39;,state)</span></span>
<span class="line"><span style="color:#A6ACCD;">    return ()=&gt;{</span></span>
<span class="line"><span style="color:#A6ACCD;">        // 通过redux的dispatch，清除一些额外的model数据（与state无关）</span></span>
<span class="line"><span style="color:#A6ACCD;">        console.log(&#39;b&#39;)</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">},[state]);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>问：每次 state 变更，&#39;b&#39;会打印吗？ 但凡有实践精神的，实践一下就知道。 然后，可能还有一些写了一年以上的 React Hooks 的开发还停留在网文上所看到的片面内容，如 useEffect 的 return 的函数执行时机可以类比于类组件的 componentWillUnmount 生命周期阶段； 这个理解是有条件的，也是一个对于从 Class 方式到 Hooks 方式的一个过渡理解； 如上的代码，我们应该如下代码来编辑，这个时候，我们可以理解，这里的&#39;b&#39;是在组件卸载的时候； demo-2:</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">useEffect(()=&gt;{</span></span>
<span class="line"><span style="color:#A6ACCD;">    //根据state处理</span></span>
<span class="line"><span style="color:#A6ACCD;">    console.log(&#39;a&#39;,state)</span></span>
<span class="line"><span style="color:#A6ACCD;">},[state]);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">useEffect(()=&gt;{</span></span>
<span class="line"><span style="color:#A6ACCD;">    return ()=&gt;{</span></span>
<span class="line"><span style="color:#A6ACCD;">        // 通过redux的dispatch，清除一些额外的model数据（与state无关）</span></span>
<span class="line"><span style="color:#A6ACCD;">        console.log(&#39;b&#39;)</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">},[]);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h3 id="实践出真知" tabindex="-1">实践出真知 <a class="header-anchor" href="#实践出真知" aria-hidden="true">#</a></h3><p>如上我们实践可以知道,demo-1 中，第一次渲染时-及 mount 时，&#39;b&#39;不会打印；而当后续 state 每次改变时，&#39;b&#39;都会打印。</p><p>疑问：为什么会执行呢？ 要解释这个问题，我们可以重新构造一些 demo-1， 如 demo-3</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">useEffect(()=&gt;{</span></span>
<span class="line"><span style="color:#A6ACCD;">    //根据state处理</span></span>
<span class="line"><span style="color:#A6ACCD;">    console.log(&#39;a&#39;,state)</span></span>
<span class="line"><span style="color:#A6ACCD;">    return ()=&gt;{</span></span>
<span class="line"><span style="color:#A6ACCD;">        // 通过redux的dispatch，清除一些额外的model数据（与state无关）</span></span>
<span class="line"><span style="color:#A6ACCD;">        console.log(&#39;b&#39;,state)</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">},[state]);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>我们会发现，打印&#39;b&#39;时对应的值是上一次 state 的值；</p><p>结论： 当 useEffect 有依赖时，每次依赖改变，useEffect 的第一个参数(create 函数)执行前会先执行上一次 create 函数执行后的返回函数(destroy);</p><h3 id="从原理到源码" tabindex="-1">从原理到源码 <a class="header-anchor" href="#从原理到源码" aria-hidden="true">#</a></h3><p>基于 React v18</p><ol><li><p>Hooks 有两个阶段：</p><ul><li>mount</li><li>update useEffect 对应</li><li>mountEffect</li><li>updateEffect</li></ul><p>?React Hooks 怎么区分两个阶段？ --react-reconciler：ReactFiberHooks.new.js 文件</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">ReactCurrentDispatcher.current =</span></span>
<span class="line"><span style="color:#A6ACCD;">  current === null || current.memoizedState === null</span></span>
<span class="line"><span style="color:#A6ACCD;">    ? HooksDispatcherOnMount</span></span>
<span class="line"><span style="color:#A6ACCD;">    : HooksDispatcherOnUpdate;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>从这个片段代码我们可以理解到；</p><p>我们再从 useEffect 的函数的定义处下手追踪： 源码对应 React 库的 ReactHooks.js 文件。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">export function useEffect(</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    create: () =&gt; (() =&gt; void) | void,</span></span>
<span class="line"><span style="color:#A6ACCD;">    deps: Array&lt;mixed&gt; | void | null,</span></span>
<span class="line"><span style="color:#A6ACCD;">    ): void {</span></span>
<span class="line"><span style="color:#A6ACCD;">    const dispatcher = resolveDispatcher();</span></span>
<span class="line"><span style="color:#A6ACCD;">    return dispatcher.useEffect(create, deps);</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>然后 react-reconciler 的 ReactFiberHooks.new.js 文件： 我们看到 useEffect 分两个阶段：</p><ul><li>mountEffect</li><li>updateEffect</li></ul><p>我们先看 mountEffect： 这里列出这一阶段过程的关键流程： --&gt;mountEffect</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">return mountEffectImpl(</span></span>
<span class="line"><span style="color:#A6ACCD;">  PassiveEffect | PassiveStaticEffect,</span></span>
<span class="line"><span style="color:#A6ACCD;">  HookPassive,</span></span>
<span class="line"><span style="color:#A6ACCD;">  create,</span></span>
<span class="line"><span style="color:#A6ACCD;">  deps,</span></span>
<span class="line"><span style="color:#A6ACCD;">);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>这里要注意 tag 赋值的是 PassiveEffect, 对应源码 ReactFiberFlags.js</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">export const Passive = /*                      */ 0b00000000000000010000000000;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>接着走 --&gt;mountEffectImpl ---&gt;pushEffect( 处理属性，挂钩到 currentlyRenderingFiber 上,而 currentlyRenderingFiber = workInProgress;) (ps:workInProgress 是 fiber 架构流程的‘工作树’，所以要理解 fiber 流程)</p><p>在看 updateEffect 流程： updateEffect --&gt;updateEffectImpl 看如下代码片段</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">  if (areHookInputsEqual(nextDeps, prevDeps)) {</span></span>
<span class="line"><span style="color:#A6ACCD;">    hook.memoizedState = pushEffect(hookFlags, create, destroy, nextDeps);</span></span>
<span class="line"><span style="color:#A6ACCD;">    return;</span></span>
<span class="line"><span style="color:#A6ACCD;">  }</span></span>
<span class="line"><span style="color:#A6ACCD;">  ...</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">   currentlyRenderingFiber.flags |= fiberFlags;</span></span>
<span class="line"><span style="color:#A6ACCD;">    hook.memoizedState = pushEffect(</span></span>
<span class="line"><span style="color:#A6ACCD;">    HookHasEffect | hookFlags,</span></span>
<span class="line"><span style="color:#A6ACCD;">    create,</span></span>
<span class="line"><span style="color:#A6ACCD;">    destroy,</span></span>
<span class="line"><span style="color:#A6ACCD;">    nextDeps,</span></span>
<span class="line"><span style="color:#A6ACCD;">);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>理解：当 updateEffect 执行时，会判断依赖是否改变（areHookInputsEqual），改变和不改变的区别是同步到 hook.memoizedState 的状态 tag 值不一样。</p></li></ol><blockquote><p>关于 fiber 架构的流程：</p></blockquote><pre><code>1）一个主流程--及workLoop，简单理解它是通过监听浏览器的requestIdleCallback而不断执行的函数。其中通过performUnitOfWork不断的执行workInProgress；

2）三棵树：currentTree,workInProgressTree,effectListTree

3) workInProgressTree:主要围绕构建这棵树(通过alternat对应到currentTree对应fiber节点),包括构建虚拟dom对应的真实Dom，reconciler，标记增删改节点，并记录其effect到effectListTree，同时设置下一个执行单元及nextUnitOfWork;（通过调度不断的执行，也就是render阶段）；当nextUnitOfWork不存在时，及深度遍历结束后。一次性提交及commit阶段，执行effectList更新dom到浏览器上（包括增删改节点），用workInProgressTree替代currentTree；
（这里一直说tree，指的是逻辑结构，物理阶段其实被转换成链表，及child子节点，同父节点的多个子节点转为相邻节点，通过属性sibling指向）；

---todo更多补充--
</code></pre><h3 id="useeffect-执行后-同步的状态数据怎么在-react-的工作流中发挥作用" tabindex="-1">useEffect 执行后，同步的状态数据怎么在 React 的工作流中发挥作用？ <a class="header-anchor" href="#useeffect-执行后-同步的状态数据怎么在-react-的工作流中发挥作用" aria-hidden="true">#</a></h3><pre><code>有fiber架构，我们知道要关注到fiber的工作流程;
及从ReactFiberWorkLoop.new.js 文件，我们梳理出流程中涉及到useEffect执行的,如下是
--&gt; performConcurrentWorkOnRoot
--&gt;finishConcurrentRender
--&gt;commitRoot
---&gt;commitRootImpl
--&gt;flushPassiveEffects
--&gt;flushPassiveEffectsImpl
\`\`\`
// flushPassiveEffectsImpl的方法中我们可以看到如下方法调用
commitPassiveUnmountEffects(root.current);
commitPassiveMountEffects(root, root.current, lanes, transitions);
\`\`\`
先调用了commitPassiveUnmountEffects，我们先沿着commitPassiveUnmountEffects来追踪：
如下：
--&gt;commitPassiveUnmountEffects
--&gt;commitPassiveUnmountOnFiber
    \`\`\`
    // 对应之前useEffect执行时赋值给workInProgress当前fiber节点的
    const destroy = effect.destroy;
    effect.destroy = undefined;
    if (destroy !== undefined) {
        ...
        if (finishedWork.flags &amp; Passive) {
        commitHookPassiveUnmountEffects(
        finishedWork,
        finishedWork.return,
        HookPassive | HookHasEffect,
        );
    }
    }
    \`\`\`
--&gt;commitHookPassiveUnmountEffects
--&gt;commitHookEffectListUnmount(这里就是答案)
\`\`\`
const destroy = effect.destroy;
   ...
     safelyCallDestroy(finishedWork, nearestMountedAncestor, destroy);
\`\`\`
--&gt;safelyCallDestroy
\`\`\`
destroy();
\`\`\`
及在这里执行;

关于effect.destroy怎么来的，我们看commitPassiveMountEffects的流程：
commitPassiveMountEffects
--&gt;commitPassiveMountOnFiber
--&gt;commitHookPassiveMountEffects
--&gt;commitHookEffectListMount
\`\`\`
 // Mount
    const create = effect.create;
    if (__DEV__) {
      if ((flags &amp; HookInsertion) !== NoHookEffect) {
        setIsRunningInsertionEffect(true);
      }
    }
    effect.destroy = create();
\`\`\`
</code></pre><p>一些流程调试图：<br> reconcile: <img src="https://raw.githubusercontent.com/huwuji/blog/master/static/react/reconcile-01.png" alt=""><img src="https://raw.githubusercontent.com/huwuji/blog/master/static/react/reconcile-02.png" alt=""></p><p>commit <img src="https://raw.githubusercontent.com/huwuji/blog/master/static/react/commit.png" alt=""></p><p>debug 查看一个 update 的流程以及整棵树的 fiber 结构结构和当前状态的数据。 <img src="https://raw.githubusercontent.com/huwuji/blog/master/static/react/debug.png" alt=""></p><p><a href="https://github.com/huwuji/blog/tree/master/Demo/react-debug-test" target="_blank" rel="noreferrer">测试代码库地址</a></p><h3 id="总结" tabindex="-1">总结： <a class="header-anchor" href="#总结" aria-hidden="true">#</a></h3><pre><code>我们可以怎么理解：
React fiber工作流程为主流程，而Hooks的执行是分枝流程，通过同步标签状态，存储参数，执行函数参数及记录其执行结果回调等信息到主流程的工作单元上，主流程按部就班的执行约定流程，并通过状态的做判断。
在这里理解就是fiber工作流程每次commit时，会先判断标签是否执行hooks的上一次传入函数执行后的回调函数，然后再执行当前的传入函数。

这里就回到上述3个demo；
及每次useEffect执行会先判断上一次依赖是否改变，改变就先执行上一次函数返回值console.log(&#39;b&#39;)，否则不执行；再执行这次的console.log(&#39;a&#39;);
</code></pre>`,25),o=[l];function p(c,r,i,f,u,d){return n(),e("div",null,o)}const m=s(t,[["render",p]]);export{A as __pageData,m as default};
