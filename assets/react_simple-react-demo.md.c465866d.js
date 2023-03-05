import{_ as s,c as n,o as a,a as l}from"./app.ee7dae8a.js";const u=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"react/simple-react-demo.md"}'),p={name:"react/simple-react-demo.md"},e=l(`<ul><li>个人学习源码笔记</li><li>学习魔术师卡颂的 react 视频。代码大多与原作者一致，个人做了一些注释</li></ul><blockquote><p>个人笔记地址：<a href="https://github.com/huwuji/blog/tree/master/notes/FE-thinking" target="_blank" rel="noreferrer">https://github.com/huwuji/blog/tree/master/notes/FE-thinking</a></p></blockquote><p>直接上代码和解析</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">let isMount = true;</span></span>
<span class="line"><span style="color:#A6ACCD;">let workInProgressHook = null;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">/**</span></span>
<span class="line"><span style="color:#A6ACCD;"> * fiber：作为存储单元，也是执行单元；源码文件参见: react-reconciler/src/ReactInternalTypes</span></span>
<span class="line"><span style="color:#A6ACCD;"> */</span></span>
<span class="line"><span style="color:#A6ACCD;">const fiber = {</span></span>
<span class="line"><span style="color:#A6ACCD;">  stateNode: app,</span></span>
<span class="line"><span style="color:#A6ACCD;">  memoizedState: null, // 存储当前的数据，如hook。单链表结构</span></span>
<span class="line"><span style="color:#A6ACCD;">  // key,</span></span>
<span class="line"><span style="color:#A6ACCD;">  // tag,//标识fiber类型的标签；标明函数组件或者是类组件，如FunctionComponent｜ClassComponent；源码文件参见: react-reconciler/src/ReactWorkTags.js</span></span>
<span class="line"><span style="color:#A6ACCD;">  // type,// 对于 FunctionComponent，指函数本身，对于 ClassComponent，指 class，对于 HostComponent，指 DOM 节点 tagName</span></span>
<span class="line"><span style="color:#A6ACCD;">  // return,//父节点</span></span>
<span class="line"><span style="color:#A6ACCD;">  // child,//孩子节点</span></span>
<span class="line"><span style="color:#A6ACCD;">  // sibling,//兄弟节点</span></span>
<span class="line"><span style="color:#A6ACCD;">  // alternate,//指向currenttree的指针</span></span>
<span class="line"><span style="color:#A6ACCD;">};</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">/**</span></span>
<span class="line"><span style="color:#A6ACCD;"> *</span></span>
<span class="line"><span style="color:#A6ACCD;"> * @param {any} action</span></span>
<span class="line"><span style="color:#A6ACCD;"> * @param {object} hook - 指明不同hook（useState）调用下，当前的关联的hook对象；</span></span>
<span class="line"><span style="color:#A6ACCD;"> */</span></span>
<span class="line"><span style="color:#A6ACCD;">function dispatchAction(hook, action) {</span></span>
<span class="line"><span style="color:#A6ACCD;">  //存储当前hook一次更新中的多次调用值，环状单向链表，原因是任务执行受优先级影响，可能会被跳过；所以判断还要根据标识判断，但这里不考虑任务优先级的情况；</span></span>
<span class="line"><span style="color:#A6ACCD;">  const pending = {</span></span>
<span class="line"><span style="color:#A6ACCD;">    action: action,</span></span>
<span class="line"><span style="color:#A6ACCD;">    next: null,</span></span>
<span class="line"><span style="color:#A6ACCD;">  };</span></span>
<span class="line"><span style="color:#A6ACCD;">  if (!hook.queue.pending) {</span></span>
<span class="line"><span style="color:#A6ACCD;">    hook.queue.pending = pending;</span></span>
<span class="line"><span style="color:#A6ACCD;">    pending.next = pending; // 环状链表</span></span>
<span class="line"><span style="color:#A6ACCD;">  } else {</span></span>
<span class="line"><span style="color:#A6ACCD;">    pending.next = hook.queue.pending.next; // pending的next指针指向第一个；hook.queue.pending.next这个时候是指向的第一个</span></span>
<span class="line"><span style="color:#A6ACCD;">    hook.queue.pending.next = pending; // 插入</span></span>
<span class="line"><span style="color:#A6ACCD;">  }</span></span>
<span class="line"><span style="color:#A6ACCD;">  schedual();</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">/**</span></span>
<span class="line"><span style="color:#A6ACCD;"> * useState的逻辑:</span></span>
<span class="line"><span style="color:#A6ACCD;"> * 添加自身到当前fiber的hook链表上,同时记录（通过数据结构queue.pending链表记录）事件参入的调用函数（dispatchAction的参数）以及数据值（memoizedState）;</span></span>
<span class="line"><span style="color:#A6ACCD;"> * 再不断的更新重复执行时，根据优先级和加载状态，把之前存储的记录消费掉（及执行完queue.pending链）；</span></span>
<span class="line"><span style="color:#A6ACCD;"> * ，，</span></span>
<span class="line"><span style="color:#A6ACCD;"> * @param {*} initial</span></span>
<span class="line"><span style="color:#A6ACCD;"> * @returns</span></span>
<span class="line"><span style="color:#A6ACCD;"> */</span></span>
<span class="line"><span style="color:#A6ACCD;">function useState(initial) {</span></span>
<span class="line"><span style="color:#A6ACCD;">  // 同步当前hook到memoizedState的链表中</span></span>
<span class="line"><span style="color:#A6ACCD;">  let hook;</span></span>
<span class="line"><span style="color:#A6ACCD;">  if (isMount) {</span></span>
<span class="line"><span style="color:#A6ACCD;">    hook = {</span></span>
<span class="line"><span style="color:#A6ACCD;">      memoizedState: initial,</span></span>
<span class="line"><span style="color:#A6ACCD;">      next: null,</span></span>
<span class="line"><span style="color:#A6ACCD;">      queue: {</span></span>
<span class="line"><span style="color:#A6ACCD;">        pending: null, //存储当前hook一次更新中的多次调用值，环状链表，原因是任务执行受优先级影响，可能会被跳过；所以判断还要根据标识判断，但这里不考虑任务优先级的情况；</span></span>
<span class="line"><span style="color:#A6ACCD;">      },</span></span>
<span class="line"><span style="color:#A6ACCD;">    };</span></span>
<span class="line"><span style="color:#A6ACCD;">    // 组件中第一个hook执行</span></span>
<span class="line"><span style="color:#A6ACCD;">    if (!fiber.memoizedState) {</span></span>
<span class="line"><span style="color:#A6ACCD;">      fiber.memoizedState = hook;</span></span>
<span class="line"><span style="color:#A6ACCD;">    } else {</span></span>
<span class="line"><span style="color:#A6ACCD;">      // fiber.memoizedState有值，则说明有执行过的hook---workInProgressHook存在</span></span>
<span class="line"><span style="color:#A6ACCD;">      workInProgressHook.next = hook;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">    // 重新设置当前的workInProgressHook</span></span>
<span class="line"><span style="color:#A6ACCD;">    workInProgressHook = hook;</span></span>
<span class="line"><span style="color:#A6ACCD;">  } else {</span></span>
<span class="line"><span style="color:#A6ACCD;">    hook = workInProgressHook;</span></span>
<span class="line"><span style="color:#A6ACCD;">    workInProgressHook = workInProgressHook.next;</span></span>
<span class="line"><span style="color:#A6ACCD;">  }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  // 执行更新</span></span>
<span class="line"><span style="color:#A6ACCD;">  let baseState = hook.memoizedState;</span></span>
<span class="line"><span style="color:#A6ACCD;">  // setState的调用action链表， 当前hook.queue.pending是第一个</span></span>
<span class="line"><span style="color:#A6ACCD;">  // 调用。执行setState的action</span></span>
<span class="line"><span style="color:#A6ACCD;">  if (hook.queue.pending) {</span></span>
<span class="line"><span style="color:#A6ACCD;">    // hook.queue.pending.next一定指向的是第一个。</span></span>
<span class="line"><span style="color:#A6ACCD;">    let firstUpdate = hook.queue.pending.next;</span></span>
<span class="line"><span style="color:#A6ACCD;">    do {</span></span>
<span class="line"><span style="color:#A6ACCD;">      const action = firstUpdate.action;</span></span>
<span class="line"><span style="color:#A6ACCD;">      baseState = typeof action === &quot;function&quot; ? action(baseState) : action;</span></span>
<span class="line"><span style="color:#A6ACCD;">      firstUpdate = firstUpdate.next;</span></span>
<span class="line"><span style="color:#A6ACCD;">    } while (firstUpdate !== hook.queue.pending.next); // 环状链表，需要判断是否执行回到第一个</span></span>
<span class="line"><span style="color:#A6ACCD;">    // 该hook的多次调用更新执行完成</span></span>
<span class="line"><span style="color:#A6ACCD;">    hook.queue.pending = null;</span></span>
<span class="line"><span style="color:#A6ACCD;">  }</span></span>
<span class="line"><span style="color:#A6ACCD;">  // 同步该hook最新的值</span></span>
<span class="line"><span style="color:#A6ACCD;">  hook.memoizedState = baseState;</span></span>
<span class="line"><span style="color:#A6ACCD;">  return [baseState, dispatchAction.bind(null, hook)];</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">function app() {</span></span>
<span class="line"><span style="color:#A6ACCD;">  const [num, setNum] = useState(1);</span></span>
<span class="line"><span style="color:#A6ACCD;">  const [num1, setNum1] = useState(10);</span></span>
<span class="line"><span style="color:#A6ACCD;">  console.log(&quot;isMount===&quot;, isMount);</span></span>
<span class="line"><span style="color:#A6ACCD;">  console.log(&quot;num===&quot;, num);</span></span>
<span class="line"><span style="color:#A6ACCD;">  console.log(&quot;num1===&quot;, num1);</span></span>
<span class="line"><span style="color:#A6ACCD;">  return {</span></span>
<span class="line"><span style="color:#A6ACCD;">    onNumEvent: () =&gt; setNum((num) =&gt; num + 1),</span></span>
<span class="line"><span style="color:#A6ACCD;">    onNum1Event: () =&gt; setNum1((num) =&gt; num + 1),</span></span>
<span class="line"><span style="color:#A6ACCD;">  };</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">/**</span></span>
<span class="line"><span style="color:#A6ACCD;"> * 调度</span></span>
<span class="line"><span style="color:#A6ACCD;"> * @returns</span></span>
<span class="line"><span style="color:#A6ACCD;"> */</span></span>
<span class="line"><span style="color:#A6ACCD;">function schedual() {</span></span>
<span class="line"><span style="color:#A6ACCD;">  workInProgressHook = fiber.memoizedState;</span></span>
<span class="line"><span style="color:#A6ACCD;">  const appInstance = fiber.stateNode();</span></span>
<span class="line"><span style="color:#A6ACCD;">  isMount = false;</span></span>
<span class="line"><span style="color:#A6ACCD;">  return appInstance;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">window.appInstance = schedual();</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div>`,4),o=[e];function t(c,i,C,A,r,y){return a(),n("div",null,o)}const d=s(p,[["render",t]]);export{u as __pageData,d as default};
