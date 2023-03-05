import{_ as l,c as i,o,a as t}from"./app.ee7dae8a.js";const g=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[{"level":2,"title":"对 V8 的学习","slug":"对-v8-的学习","link":"#对-v8-的学习","children":[]}],"relativePath":"guide/v8.md"}'),e={name:"guide/v8.md"},p=t('<h2 id="对-v8-的学习" tabindex="-1">对 V8 的学习 <a class="header-anchor" href="#对-v8-的学习" aria-hidden="true">#</a></h2><blockquote><p>参考-极客时间《图解 Google V8》</p></blockquote><ol><li>V8 的基础--JS</li><li>V8 编译流水线 <ul><li>V8 的编译流程</li><li>V8 的执行</li></ul></li><li>垃圾回收</li></ol><h4 id="js-语言特性-v8-基础" tabindex="-1">JS 语言特性--V8 基础 <a class="header-anchor" href="#js-语言特性-v8-基础" aria-hidden="true">#</a></h4><ul><li><p>函数第一公民，</p></li><li><p>V8 在解析成 AST 的过程中，会同步分析作用域及变量；函数声明在这个过程中，也会反升变量提升；而函数表达式不存在变量提示；</p></li><li><p>变量提升： 我们把这种在编译阶段，将所有的变量提升到作用域的过程称为变量提升。</p></li><li><p>声明，函数表达式 表达式，语句</p></li><li><p>函数立即表达式：IIFE（Immediately Invoked Function Expression） 函数立即表达式也是一个表达式，所以 V8 在编译阶段，并不会为该表达式创建函数对象。这样的一个好处就是不会污染环境，函数和函数内部的变量都不会被其他部分的代码访问到。</p><blockquote><p>小括号之间存放的必须是表达式</p></blockquote></li><li><p>原型，原型链 ，原型继承</p></li><li><p>作用域： 函数作用域 和全局作用域；+ 块级作用域； 作用域是在运行时代码中的某些特定部分中变量，函数和对象的可访问性。换句话说，作用域决定了代码区块中变量和其他资源的可见性； 作用域是用来存放变量和函数的地方，全局作用域中存放了全局环境中声明的变量和函数，函数作用域中存放了函数中声明的变量和函数；</p><blockquote><p>作用域在静态编译的时候就确定了；作用域链也是在这个时候确定,作用域链由<strong>词法作用域</strong>而不是调用栈决定的；但这个时候作用域只有变量声明，没有值，函数会有值；</p></blockquote><blockquote><p><strong>词法作用域又被称作静态作用域</strong>，因为词法作用域是根据函数在代码中的位置来确定的，作用域是在<strong>声明函数</strong>时就确定好的了，所以我们也将词法作用域称为静态作用域。因此函数作用域在声明时就已经确定了。</p></blockquote><blockquote><p>动态作用域并不关心函数和作用域是如何声明以及在何处声明的，只关心它们从何处调用。换句话说，作用域链是基于调用栈的，而不是基于函数定义的位置的</p></blockquote><blockquote><p>全局作用域：全局作用域中包含了很多全局变量，比如全局的 this 值，如果是浏览器，全局作用域中还有 window、document、opener 等非常多的方法和对象，如果是 node 环境，那么会有 Global、File 等内容。</p></blockquote></li><li><p>执行上下文： this</p><blockquote><p>执行上下文中包含变量环境，词法环境，外部环境（outer）指向以及 this 执行上下文主要分为三种——全局执行上下文、函数执行上下文和 eval 执行上下文，所以对应的 this 也只有这三种——全局执行上下文中的 this、函数中的 this 和 eval 中的 this。</p></blockquote></li><li><p>ES6 箭头函数： ES6 中的箭头函数并不会创建其自身的执行上下文，所以箭头函数中的 this 取决于它的外部函数。</p></li><li><p>类型系统</p><blockquote><p>V8 会严格根据 ECMAScript 规范来执行操作。ECMAScript 是一个语言标准，JavaScript 就是 ECMAScript 的一个实现： 规则之一：如果 Type(lprim) 和 Type(rprim) 中有一个是 String，则：a. 把 ToString(lprim) 的结果赋给左字符串 (lstr)；b. 把 ToString(rprim) 的结果赋给右字符串 (rstr)；c. 返回左字符串 (lstr) 和右字符串 (rstr) 拼接的字符串。</p></blockquote><blockquote><p>1+&quot;2&quot;的计算转换流程如下: V8 会提供了一个 ToPrimitive 方法，其作用是将 a 和 b 转换为原生数据类型，其转换流程如下：先检测该对象中是否存在 valueOf 方法，如果有并返回了原始类型，那么就使用该值进行强制类型转换；如果 valueOf 没有返回原始类型，那么就使用 toString 方法的返回值；如果 vauleOf 和 toString 两个方法都不返回基本类型值，便会触发一个 TypeError 的错误。</p></blockquote></li></ul><h4 id="v8-编译流水线" tabindex="-1">V8 编译流水线 <a class="header-anchor" href="#v8-编译流水线" aria-hidden="true">#</a></h4><p>流程： 【运行时环境】--》解析---》【AST】---》生成---》【字节码】---》【解释执行】---》优化编译---》【可执行的二进制】---》CPU 直接执行</p><p>基础概念：</p><ul><li>JIT</li><li>对象内属性</li><li>快属性和慢属性</li><li><strong>隐藏类：为了提升对象的属性访问速度而引入了隐藏类；</strong></li><li><strong>内联缓存：为了加速运算而引入了内联缓存；</strong></li><li>惰性解析：所谓惰性解析是指解析器在解析的过程中，如果遇到函数声明，那么会跳过函数内部的代码，并不会为其生成 AST 和字节码，而仅仅生成顶层代码的 AST 和字节码。</li></ul><ol><li>运行时环境：</li></ol><ul><li>执行 JavaScript 代码之前，V8 就已经准备好了代码的运行时环境，这个环境包括了<strong>堆空间和栈空间、全局执行上下文、全局作用域、内置的内建函数、宿主环境提供的扩展函数和对象，还有消息循环系统</strong>。准备好运行时环境之后，V8 才可以执行 JavaScript 代码，这包括解析源码、生成字节码、解释执行或者编译执行这一系列操作</li><li>浏览器为 V8 提供基础的消息循环系统、全局变量、Web API，而 V8 的核心是实现了 ECMAScript 标准 V8 只提供了 ECMAScript 定义的一些对象和一些核心的函数，这包括了 Object、Function、String。除此之外，V8 还提供了垃圾回收器、协程等基础内容，不过这些功能依然需要宿主环境的配合才能完整执行。</li></ul><blockquote><p><strong>V8 提供的是 JS 的核心功能和[垃圾回收]</strong>； 宿主提供：Winder DOM/Global，Web API， 事件循环，消息队列，堆栈</p></blockquote><ul><li><p>栈空间： 栈空间主要是用来管理 JavaScript 函数调用的，栈是<strong>内存中连续的一块空间</strong>，同时栈结构是“先进后出”的策略。在函数调用过程中，涉及到上下文相关的内容都会存放在栈上，比如原生类型、引用到的对象的地址、函数的执行状态、this 值等都会存在在栈上。当一个函数执行结束，那么该函数的执行上下文便会被销毁掉。 有限的；</p></li><li><p>堆空间： 堆空间是一种树形的存储结构，用来存储对象类型的离散的数据，在前面的课程中我们也讲过，JavaScript 中除了原生类型的数据，其他的都是对象类型，诸如函数、数组，在浏览器中还有 window 对象、document 对象等，这些都是存在堆空间的。</p></li><li><p>全局执行上下文： 当 V8 开始执行一段可执行代码时，会生成一个执行上下文。V8 用执行上下文来维护执行当前代码所需要的变量声明、this 指向等。</p><p>执行上下文中主要包含三部分，<strong>变量环境、词法环境和 this 关键字</strong>。</p></li><li><p>全局作用域</p></li><li><p>构建事件循环系统</p><blockquote><p>V8 是寄生在宿主环境中的，它并没有自己的主线程，而是使用宿主所提供的主线程，V8 所执行的代码都是在宿主的主线程上执行的。在浏览器的页面中，V8 会和页面共用主线程，共用消息队列，所以如果 V8 执行一个函数过久，会影响到浏览器页面的交互性能。</p></blockquote></li></ul><ol start="2"><li><p>堆和栈---内存分配</p><ul><li><p>栈：</p></li><li><p>为什么使用栈结构来管理函数调用？ 更好管理函数在调用时的调用权的切换，以及函数在执行时的内存管理（包括变量的生成和查找等），以及执行后的内存释放，等等；函数资源分配和回收；</p></li><li><p>函数尾调用</p></li><li><p>栈顶指针：指向栈顶；也就是告诉我们接下来存放数据的位置和方向；它通常存放在 esp 寄存器中；</p></li><li><p>栈帧指针：记录一个函数的起始位置；它通常保存在 ebp 寄存器；</p></li><li><p>栈结构的容量是固定的；</p></li><li><p>在栈上分配资源和销毁资源的速度非常快，这主要归结于栈空间是连续的，分配空间和销毁空间只需要移动下指针就可以了。</p></li><li><p>调用栈：管理函数调用过程的栈结构称之为调用栈。现代语言都是基于函数的，每个函数在执行过程中，都有自己的生命周期和作用域，当函数执行结束时，其作用域也会被销毁</p></li><li><p>堆：</p></li><li><p>堆空间中的数据是不要求连续存放的，从堆上分配内存块没有固定模式的，你可以在任何时候分配和释放它，</p></li></ul></li><li><p>延迟解析：</p><ul><li><p>惰性解析/惰性编译： 性解析是指解析器在解析的过程中，如果遇到函数声明，那么会跳过函数内部的代码，并不会为其生成 AST 和字节码，而仅仅生成顶层代码的 AST 和字节码。</p></li><li><p><strong>预解析器</strong>： V8 引入预解析器，比如当解析顶层代码的时候，遇到了一个函数，那么预解析器并不会直接跳过该函数，而是对该函数做一次快速的预解析，其主要目的有两个：</p><ul><li>1）<strong>判断当前函数是不是存在一些语法上的错误</strong>；</li><li>2）<strong>检查函数内部是否引用了外部变量，如果引用了外部的变量，预解析器会将栈中的变量复制到堆中</strong>，在下次执行到该函数的时候，直接使用堆中的引用，这样就解决了闭包所带来的问题；</li></ul></li></ul></li><li><p>字节码：</p><p>4.1 字节码优点：</p><ul><li>生成更快，执行效率慢于机器代码；--解决启动问题：生成字节码的时间很短；</li><li>体积更小，相比于机器代码缓存时所占内存更少；--解决空间问题：字节码占用内存不多，缓存字节码会大大降低内存的使用；</li></ul><blockquote><p>生成机器代码比生成字节码需要花费更久的时间，但是直接执行机器代码却比解释执行字节码要更高效，所以在快速启动 JavaScript 代码与花费更多时间获得最优运行性能的代码之间，我们需要找到一个平衡点。 解释器可以快速生成字节码，但字节码通常效率不高。 相比之下，优化编译器虽然需要更长的时间进行处理，但最终会产生更高效的机器码，这正是 V8 在使用的模型。它的解释器叫 Ignition，（就原始字节码执行速度而言）是所有引擎中最快的解释器。V8 的优化编译器名为 TurboFan，最终由它生成高度优化的机器码。</p></blockquote><ul><li>代码架构清晰：采用字节码，可以简化程序的复杂度，使得 V8 移植到不同的 CPU 架构平台更加容易。 如：加入字节码，相当于在编译的过程中加入了一层“优化代码”（相比于直接从源码编译成二机制机器码），降低了后续编译成机器码的复杂度；（分步/层思想，函数式编程也有，每层做更单一的事）</li></ul><blockquote><p>字节码出现以前，Chrome 做了两件事来提升 JavaScript 代码的执行速度：（空间换时间的策略） 第一，将运行时将二进制机器代码缓存在内存中； 第二，当浏览器退出时，缓存编译之后二进制代码到磁盘上。</p></blockquote><p>4.2 字节码解释执行 步骤：</p><ul><li>解析源码生成 AST 和作用域</li><li>根据 AST 和作用域，利用 Ignition 解释器，V8 就可以生成以函数为单位的字节码； <blockquote><p>AST 之后会被作为输入传到字节码生成器 (BytecodeGenerator)，这是 Ignition 解释器中的一部分，用于生成以函数为单位的字节码</p></blockquote></li><li>字节码的解释执行也类似于 CPU 解析机器码；字节码代码拆分为很多单一功能的指令集，有实现运算的，有实现跳转的，有实现返回的，有实现内存读取的，再组合这些指令集来实现一个代码段的功能；</li></ul></li><li><p>解释器：</p><ul><li><p>分类：通常有两种类型的解释器，<strong>基于栈 (Stack-based)和基于寄存器 (Register-based)</strong>，基于栈的解释器使用栈来保存函数参数、中间运算结果、变量等，基于寄存器的虚拟机则支持寄存器的指令操作，使用寄存器来保存参数、中间计算结果。</p><blockquote><p>早期的 V8 虚拟机是基于堆栈的虚拟机，它在处理函数调用、解决递归问题和切换上下文时简单明快。 而现在的 V8 虚拟机则采用了基于寄存器的设计，它将一些中间数据保存到寄存器中，了解这点对于我们分析字节码的执行过程非常重要。</p></blockquote></li><li><p>?????执行-- 基于寄存器的解释器执行 解释器执行时主要有四个模块，内存中的字节码、寄存器、栈、堆；</p><blockquote><p>反馈向量槽：feedback vector slot，中文我们可以称为反馈向量槽，它是一个数组，解释器将解释执行过程中的一些数据类型的分析信息都保存在这个反馈向量槽中了，目的是为了给 TurboFan 优化编译器提供优化信息，很多字节码都会为反馈向量槽提供运行时信息</p></blockquote></li></ul></li><li><p>隐藏类：</p><p>根据静态语言执行更快的本质，也就是在编译执行时确定类型，从而确定属性较对于对象的内存地址偏移量，从而加快查询及执行；V8 也尝试进行这方面的优化：</p><p>具体方式： V8 会为每个对象创建一个隐藏类，对象的隐藏类中记录了该对象一些基础的布局信息，包括以下两点：</p><ul><li>对象中所包含的所有的属性；</li><li>每个属性相对于对象的偏移量。</li></ul><p><strong>隐藏类中属性的偏移量的生成条件：</strong></p></li></ol><blockquote><p>在 V8 中，把隐藏类又称为 map，每个对象都有一个 map 属性，其值指向内存中的隐藏类。 通常 V8 获取 对象 object 的属性 x 的流程是这样的：查找对象 object 的隐藏类，再通过隐藏类查找 x 属性偏移量，然后根据偏移量获取属性值，</p></blockquote><ol start="7"><li><p>内联缓存--inline cache<br> 作用：提升对象的查找效率; 解释：V8 在执行函数的过程中，会观察函数中一些调用点 (CallSite) 上的关键的中间数据，然后将这些数据缓存起来，当下次再次执行该函数的时候，V8 就可以直接利用这些中间数据，节省了再次获取这些数据的过程，从而有效提升一些重复代码的执行效率;</p><ul><li><p>内联缓存作用方式和流程？ V8 的 内联缓存 会监听每个函数的执行过程，并在一些关键的地方埋下监听点，这些包括了加载对象属性 (Load)、给对象属性赋值 (Store)、还有函数调用 (Call)，V8 会将监听到的数据写入一个称为反馈向量 (FeedBack Vector) 的结构中，同时 V8 会为每个执行的函数维护一个反馈向量。有了反馈向量缓存的临时数据，V8 就可以缩短对象属性的查找路径，从而提升执行效率。</p></li><li><p><strong>反馈向量</strong> 其实就是一个表结构，它由很多项组成的，每一项称为一个插槽 (Slot)，记录了函数在执行过程中的一些关键的中间数据，包括 操作方式 type（LOAD,STORE,CALL）,所属隐藏类地址 map，偏移量 offset，状态等；并且一个反馈向量的一个插槽中可以包含多个隐藏类的信息；</p><ul><li><p>根据一个反馈向量的一个插槽中所包含多个隐藏类的个数，我们对这个情况下的反馈向量槽进行分类： <strong>分为单态，多态，超态，分类的原因也是涉及到 V8 对不同状态下所含的隐藏类的物理存储进行区分，单态，多态可以使用线性结构来存储，多态可能是 hash 存储；</strong></p><ul><li>如果一个插槽中只包含 1 个隐藏类，那么我们称这种状态为单态 (monomorphic)；</li><li>如果一个插槽中包含了 2 ～ 4 个隐藏类，那我们称这种状态为多态 (polymorphic)；</li><li>如果一个插槽中超过 4 个隐藏类，那我们称这种状态为超态 (magamorphic)。</li></ul></li><li><p>单态的执行效率最高</p></li></ul></li><li><p>反馈到我们的日常开发中： 我们要保证内联缓存的最优执行效率，我们应该保证反馈向量槽更多的是单态；如何保证单态？ 一则我们应该保证一个对象生成最少的隐藏类，及保证尽量不变更对象的长度和类型； 二则我们在函数调用传参时尽量使用&#39;一个形状&#39;的参数对象；（ps：一个形状，也就是第一条所说）</p></li></ul></li></ol><blockquote><p>相比于隐藏类作用于对象，内联缓存更像是作用于函数，起到关联函数和隐藏类中属性的偏移量，把这个映射关系直接存储在函数执行的内存中；</p></blockquote><h4 id="事件循环-倾向浏览器端" tabindex="-1">事件循环 -- 倾向浏览器端 <a class="header-anchor" href="#事件循环-倾向浏览器端" aria-hidden="true">#</a></h4><ol><li><p>消息队列： V8 实现执行回调函数的方式是通过消息队列；</p><ul><li><p>什么是回调函数？</p><ul><li>定义：首先回调函数也是函数；当某个函数被作为参数，传递给另外一个函数，或者传递给宿主环境，然后该函数在函数内部或者在宿主环境中被调用，我们才称为回调函数。</li><li>分类： 回调函数有两种不同的形式，<strong>同步回调和异步回调</strong>。通常，我们需要将回调函数传入给另外一个执行函数，<strong>那么同步回调和异步回调的最大区别在于同步回调函数是在执行函数内部被执行的，而异步回调函数是在执行函数外部被执行的</strong>。</li></ul></li><li><p>什么是消息队列呢？ 严格来所，消息队列是一种通信机制；在进程内（IPC）中，一种方式就是通过消息队列实现，消息队列由消息的链表，存放在内核中并由消息队列标识符标识。消息队列克服了信号传递信息少、管道只能承载无格式字节流以及缓冲区大小受限等缺点； 放到 V8 实现循环中，通过消息队列实现线程间信息传递（这里传递的包括文件/网络 IO 的回调，setTimeout 这些定时器的回调），做到事件循环；</p></li></ul></li><li><p>任务： 我们把 UI 线程或者 Node 主线程每次从消息队列中取出事件，执行事件的过程称为一个任务。</p></li><li><p>通用的 UI 线程架构 直接看图：</p></li><li><p>宏任务：就是指消息队列中的等待被主线程执行的事件； 比如：setTimeout，setInterval，使用 MessageChannel 生产宏任务， scrip(JS 整体代码)、I/O、UI 交互， requestAnimationFrame， setImmediate（NODE）</p><blockquote><p>setImmediate 是宏任务，与 process.nextTick 不同的是，setImmediate 在 Node 下的事件循环中，每次循环只执行一个由 setImmediate 产生的任务；所以几乎不会阻塞线程；</p></blockquote></li></ol><blockquote><p>setImmediate MDN： <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setImmediate" target="_blank" rel="noreferrer">https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setImmediate</a></p></blockquote><ol start="5"><li>微任务： 任务的颗粒度更细，在对精度和实时性要求较高的场景下，可以更快的异步执行；微任务可以在实时性和效率之间做一个有效的权衡；微任务解决了宏任务执行时机不可控的问题;<br> 可以把微任务看成是一个需要异步执行的函数，执行时机是在主函数执行结束之后、当前宏任务结束之前。 比如： Promise、async/await，协程，MutationOberver； process.nextTick，</li></ol><blockquote><p>ps：async/await 生产为任务要关注 async/await 的实现方式；基于 generator 的语法糖，在 await 的时候传入 promise；执行方式是，在先执行生成一次迭代器对象；然后执行第一次 next,及执行第一个 await，后续的 await 才会被包装成 promise 对象中，通过 then 的方式添加和执行；</p></blockquote><blockquote><p>严格来说宏任务是在下次事件循环中执行，不会阻塞本次页面更新。而微任务是在本次页面更新前执行，与同步执行无异，不会让出主线程。</p></blockquote><ol start="6"><li>栈溢出 <blockquote><p>栈溢出指调用栈溢出，通常是函数嵌套同步调用，使栈分配的内存被用尽，造成栈溢出； 通常我们可以使用 setTimeoute 这样用异步来代替同步的方式避免嵌套调用的栈溢出；</p></blockquote></li></ol><p>使用 setTimeoute 这样用异步的目的是让任务进入到消息队列中，在队列中等待事件循环调用，不用担心当前执行的调用栈溢出，也不用担心执行时间太长，阻塞后续的 IO 或者渲染等；</p><blockquote><p>当前的微任务队列中的所有微任务都执行完成之后，当前的宏任务也就执行结束了，此时，才会清空调用栈；如果当前执行的宏任务是 js 任务，才会退出当前执行上下文；</p></blockquote><ol start="7"><li><p>协程： 协程是一种比线程更加轻量级的存在； 协程看成是跑在线程上的任务，一个线程上可以存在多个协程，但是在线程上同时只能执行一个协程。通常，如果从 A 协程启动 B 协程，我们就把 A 协程称为 B 协程的父协程。<br><strong>协程是 V8 实现生成器函数的暂停执行和恢复执行的方式</strong><br> 协程不是被操作系统内核所管理，而完全是由程序所控制（也就是在用户态执行）。这样带来的好处就是性能得到了很大的提升，不会像线程切换那样消耗资源；</p><p>生成器就是协程的一种实现方式；</p></li><li><p>垃圾回收：</p></li></ol><p>我们先看一下一般垃圾回收的一个主要流程：</p><ul><li><p>第一步：通过 GC Root 标记空间中活动对象和非活动对象。 1）那 V8 怎么判断一个内存空间中的活动对象和非活动对象？</p><blockquote><p>目前 V8 采用的<strong>可访问性（reachability）算法</strong>来判断堆中的对象是否是活动对象。具体地讲，这个算法是将一些 GC Root 作为初始存活的对象的集合，从 GC Roots 对象出发，遍历 GC Root 中的所有对象：通过 GC Root 遍历到的对象，我们就认为该对象是可访问的（reachable）及活动对象；反之就是非活动对象；</p></blockquote><p>2）GC Root 是什么？</p><blockquote><p>在浏览器环境中，GC Root 有很多，通常包括了以下几种 (但是不止于这几种)：</p></blockquote><ul><li>全局的 window 对象（位于每个 iframe 中）；</li><li>文档 DOM 树，由可以通过遍历文档到达的所有原生 DOM 节点组成；</li><li>存放栈上变量。</li></ul></li><li><p>第二步，回收非活动对象所占据的内存。就是在所有的标记完成之后，统一清理内存中所有被标记为可回收的对象。</p></li><li><p>第三步，做内存整理。--垃圾回收后，会出现内存碎片--也就是内存出现大量不连续的占用，这样给连续分配内存空间造成影响；所有内存整理，也就是清理内存碎片，局部整理出更大的连续内存空间；</p></li></ul><p>下面我们看下 V8 关于垃圾回收的实现； 目前 V8 采用了两个垃圾回收器，</p><ul><li><strong>主垃圾回收器 -Major GC</strong>：主要负责老生代的垃圾回收；</li><li><strong>副垃圾回收器 -Minor GC (Scavenger)</strong>：主要负责新 s 生代的垃圾回收；</li></ul><p>那么什么是新生代，老生代呢？</p><ul><li><p>8.1 垃圾回收之代际假说： 代际假说是垃圾回收领域的一个说法，对‘垃圾’进行一个归纳的假说，它的特点如下：</p><ul><li>第一个是大部分对象在内存中存活的时间很短，比如函数内部声明的变量，或者块级作用域中的变量，当函数或者代码块执行结束时，作用域中定义的变量就会被销毁。因此这一类对象一经分配内存，很快就变得不可访问；</li><li>第二个是不死的对象，会活得更久，比如全局的 window、DOM、Web API 等对象</li></ul></li></ul><p>根据代际假说，以及权衡各种场景，我们看 V8 的垃圾回收的具体实现方式？</p><p>首先，在 V8 中，会把堆分为新生代和老生代两个区域，新生代中存放的是生存时间短的对象，老生代中存放生存时间久的对象。新生代通常只支持 1 ～ 8M 的容量，而老生代支持的容量就大很多了。对于这两块区域，V8 分别使用两个不同的垃圾回收器，以便更高效地实施垃圾回收。</p><ul><li>8.2 新生代的垃圾回收： 主要用副垃圾回收器 -Minor GC (Scavenger)负责，使用 Scavenge 算法； 首先我们明确在新生代通常只支持 1 ～ 8M 的容量；我们再看下这样的设计的目的； 新生代中，内存空间分为两个部分，一个是对象块（FROM 块），一个是空闲块（TO 块）； 工作方式是： <ul><li>新的数据会先被存储到对象块，当对象块满后，会进行一轮算法分析，找到活跃对象</li><li>复制活跃对象到空闲块中</li><li>将交互对象块和空闲块进行翻转；这样方式可以快速又方便的清理回收垃圾，同时也保证无限的复用；</li><li>当重复两次垃圾回收还保留的对象，会通过对象晋升策略进入到老生代</li></ul></li></ul><p>那回过头来，我们看下为什么新生代通常只支持 1 ～ 8M 的容量？ 因为新生代的作用像一个过滤器，筛选器，会频繁的操作，对象查处分析，垃圾回收处理等；小的合适空间，会触发更合理的频率，大多的空间，每次清理的时间就会过久，会影响每次执行效率；</p><ul><li>8.3 老生代的垃圾回收 主要用主垃圾回收器 -Major GC 负责，使用 标记-清除，和标记-整理算法； 老生代中的对象有两个特点： <ul><li>一个是对象占用空间大；</li><li>另一个是对象存活时间长。</li></ul></li></ul><blockquote><p>由于老生代的对象比较大，若要在老生代中使用 Scavenge 算法进行垃圾回收，复制这些大的对象将会花费比较多的时间，从而导致回收执行效率不高，同时还会浪费一半的空间。所以，主垃圾回收器是采用标记 - 清除（Mark-Sweep）的算法进行垃圾回收的。</p></blockquote><p>工作步骤：</p><ul><li>首先是标记过程阶段。标记阶段就是从一组根元素开始，递归遍历这组根元素，在这个遍历过程中，能到达的元素称为活动对象，没有到达的元素就可以判断为垃圾数据。</li><li>接下来就是垃圾的清除过程。它和副垃圾回收器的垃圾清除过程完全不同，主垃圾回收器会直接将标记为垃圾的数据清理掉。</li><li>标记-整理：不过对一块内存多次执行标记 - 清除算法后，会产生大量不连续的内存碎片。而碎片过多会导致大对象无法分配到足够的连续内存，于是又引入了另外一种算法——标记 - 整理（Mark-Compact）。及处理内存碎片，使内存分配连续化；</li></ul><h4 id="拓展" tabindex="-1">拓展 <a class="header-anchor" href="#拓展" aria-hidden="true">#</a></h4><blockquote><p>我们把取出指令、分析指令、执行指令这三个过程称为一个 CPU 时钟周期</p></blockquote><blockquote><p>PC 寄存器： 通用寄存器：通用寄存器通常用来存放数据或者内存中某块数据的地址，我们把这个地址又称为指针，通常情况下寄存器对存放的数据是没有特别的限制的，比如某个通用寄存器既可以存储数据，也可以存储指针。 esp 寄存器： ebp 寄存器：用来保存当前函数的起始位置，我们把一个函数的起始位置也称为栈帧指针，ebp 寄存器中保存的就是当前函数的栈帧指针</p></blockquote><blockquote><p>CPU 最小执行单元是指令，所以看似无序的二进制，其实是被分割成无数的指令，再被 CPU 加载执行； CPU 指令的种类也有很多：比如加载指令，存储指令，更新指令，跳转指令</p></blockquote><blockquote><p>动态语言类型可以在运行时动态更改，在执行时，内存查找地址时，因为不能确定类型，也就不能确定地址长度，也就不能在静态分析时给定该属性相对于该对象地址的偏移值，所以查询时，不能简单的直接查询，而需要一步步查询（在内存中就需要不断的在堆或栈中跳跃查询）； 静态语言中，可以直接通过偏移量查询来查询对象的属性值，这也就是静态语言的执行效率高的一个原因。 C++ 代码在执行之前需要先被编译，编译的时候，每个对象的形状都是固定的，也就是说，在代码的执行过程中，Point 的形状是无法被改变的。那么在 C++ 中访问一个对象的属性时，自然就知道该属性相对于该对象地址的偏移值了，比如在 C++ 中使用 start.x 的时候，编译器会直接将 x 相对于 start 的地址写进汇编指令中，那么当使用了对象 start 中的 x 属性时，CPU 就可以直接去内存地址中取出该内容即可，没有任何中间的查找环节。</p></blockquote><blockquote><p><a href="https://www.dynatrace.com/news/blog/understanding-garbage-collection-and-hunting-memory-leaks-in-node-js/" target="_blank" rel="noreferrer">Understanding Garbage Collection and hunting Memory Leaks in Node.js</a></p></blockquote><blockquote><p><a href="https://github.com/yjhjstz/deep-into-node" target="_blank" rel="noreferrer">深入理解 Node.js：核心思想与源码分析》</a></p></blockquote>',48),r=[p];function a(n,s,u,c,b,d){return o(),i("div",null,r)}const h=l(e,[["render",a]]);export{g as __pageData,h as default};