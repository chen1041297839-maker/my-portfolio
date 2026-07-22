const Arrow = () => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>

const FACTS = [
  ['PERIOD', '2026.6—2026.7'],
  ['ROLE', '独立负责主营 WebApp 体验升级'],
  ['SCOPE', '产品结构 · AI 交互 · 体验规则'],
]

const PROBLEMS = [
  ['01', '页面不统一', '不同模块分别生长，组件、间距、状态与信息层级缺少共同规则。'],
  ['02', 'AI 对话不完整', 'Thinking、工具调用和输出状态没有被清晰表达，用户难以理解过程。'],
  ['03', '功能持续增加', 'Onboarding、Usage、Team、Integrations 等模块陆续增加，旧结构难以承接。'],
  ['04', '缺少系统规则', '每次新增页面都要重新判断样式与交互，体验容易越做越散。'],
]

const STAGES = [
  ['01', '先修核心体验', '重构首页与对话入口，让用户先看懂产品入口和 AI 回答过程。'],
  ['02', '补齐基础流程', '整理 Onboarding、Usage、Integrations 与团队管理，让产品能够被完整使用。'],
  ['03', '承接新增能力', '为会话、任务、分享与 Plugins & Skills 建立可扩展的管理方式。'],
]

const CHAPTERS = [
  ['背景判断', 'hg-context'],
  ['AI 主流程', 'hg-ai-flow'],
  ['管理体系', 'hg-management'],
  ['对象模型', 'hg-objects'],
  ['体验规则', 'hg-system'],
  ['复盘', 'hg-reflection'],
]

const WEBAPP_ASSETS = {
  cover: '/projects/hologrow/webapp-cover.png',
  aiFlow: '/projects/hologrow/webapp-ai-flow.png',
  integrations: '/projects/hologrow/webapp-integrations.png',
  usage: '/projects/hologrow/webapp-usage.png',
  team: '/projects/hologrow/webapp-team.png',
  objects: '/projects/hologrow/webapp-objects.png',
  system: '/projects/hologrow/webapp-system.png',
}

function Evidence({ src, alt, position = '50% 50%', ratio = '16 / 10', fit = 'contain', scale = 1, origin = '50% 50%', zoom, className = '' }) {
  return <button className={`hg-evidence ${className}`} style={{ '--evidence-ratio': ratio, '--evidence-fit': fit, '--evidence-scale': scale, '--evidence-origin': origin }} onClick={() => zoom(src)} aria-label={`放大查看：${alt}`}>
    <img src={src} alt={alt} style={{ objectPosition: position }} loading="lazy" />
    <span>VIEW SOURCE <Arrow /></span>
  </button>
}

function DecisionHeader({ index, eyebrow, title, children }) {
  return <header className="hg-decision__header">
    <div><b>{index}</b><span>{eyebrow}</span></div>
    <h2>{title}</h2>
    <p>{children}</p>
  </header>
}

export default function HologrowWebAppCase({ project, close, zoom, isScrolled, onScroll }) {
  const jumpToChapter = id => {
    const target = document.getElementById(id)
    if (!target) return
    const scroller = target.closest('.hg-case')
    if (!scroller) return
    const contentTarget = target.querySelector('.hg-section-label, .hg-decision__header, .hg-manage-intro, .hg-object-intro, .hg-reflection__copy') || target
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const stickyOffset = window.innerWidth <= 640 ? 108 : 126
    const top = contentTarget.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - stickyOffset - 20
    scroller.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return <div className={`case-page hg-case ${isScrolled ? 'is-scrolled' : ''}`} onScroll={onScroll} role="dialog" aria-modal="true" aria-label={`${project.title} 项目详情`}>
    <nav className="case-top"><button onClick={close}>← 返回作品展</button><span>{project.category} / CASE STUDY</span></nav>

    <nav className="hg-chapter-nav" aria-label="Hologrow WebApp 案例章节">
      <div className="shell">{CHAPTERS.map(([label, id], index) => <button type="button" key={id} onClick={() => jumpToChapter(id)}><b>0{index + 1}</b><span>{label}</span></button>)}</div>
    </nav>

    <header className="hg-hero">
      <div className="hg-hero__copy shell">
        <p className="hg-kicker"><i /> HOLOGROW / AI DATA PRODUCT</p>
        <h1>把能跑起来的产品，<br />整理成可持续生长的<br /><em>体验系统。</em></h1>
        <p className="hg-hero__summary">{project.subtitle}</p>
        <div className="hg-hero__facts">{FACTS.map(([label, value]) => <div key={label}><small>{label}</small><span>{value}</span></div>)}</div>
      </div>
      <div className="hg-hero__visual shell">
        <Evidence src={WEBAPP_ASSETS.cover} alt="Hologrow WebApp 全面升级迭代封面" ratio="16 / 9" zoom={zoom} className="hg-evidence--hero" />
        <span className="hg-hero__signal">THINKING → TOOL CALLING → STRUCTURED OUTPUT</span>
      </div>
    </header>

    <main className="hg-case__body">
      <section className="hg-context shell" id="hg-context">
        <div className="hg-section-label"><span>01</span><b>PROJECT CONTEXT</b></div>
        <div className="hg-context__lead">
          <p>这不是一次“美化页面”。</p>
          <h2>快速生成的能力已经能跑，真正缺少的是一套让用户稳定使用、团队继续迭代的体验规则。</h2>
        </div>
        <p className="hg-context__body">{project.overview}</p>
        <div className="hg-problem-grid">{PROBLEMS.map(([id, title, desc]) => <article key={id}><b>{id}</b><h3>{title}</h3><p>{desc}</p></article>)}</div>
      </section>

      <section className="hg-strategy shell">
        <div className="hg-section-label"><span>02</span><b>PRIORITY, NOT A BIG BANG</b></div>
        <div className="hg-strategy__intro"><h2>不一次性推倒重来，<br />先建立体验秩序。</h2><p>我按照对真实使用的影响，把改版拆为三次推进。先判断哪一层最影响使用，再让新能力进入已经建立的结构。</p></div>
        <div className="hg-stage-list">{STAGES.map(([id, title, desc]) => <article key={id}><b>{id}</b><div><h3>{title}</h3><p>{desc}</p></div></article>)}</div>
      </section>

      <section className="hg-decision hg-decision--ai" id="hg-ai-flow">
        <div className="shell">
          <DecisionHeader index="03" eyebrow="KEY DECISION 01" title={<>让 AI 的过程<br />成为体验的一部分。</>}>对话思考时间长时，用户不应该猜测系统是否卡住。过程越清楚，结果越容易被理解、信任和继续使用。</DecisionHeader>
          <div className="hg-decision__canvas">
            <Evidence src={WEBAPP_ASSETS.aiFlow} alt="AI 回答过程可视化完整方案" ratio="5760 / 3603" zoom={zoom} />
            <ol>
              <li><b>过程可见</b><span>补全 Thinking 状态，让等待有反馈。</span></li>
              <li><b>调用有反馈</b><span>把工具调用、数据读取和任务执行过程显性化。</span></li>
              <li><b>结果可阅读</b><span>将正文、来源与建议操作组织成清晰层级。</span></li>
              <li><b>内容可复用</b><span>保留追问、分享与保存入口，让答案进入后续工作。</span></li>
            </ol>
          </div>
        </div>
      </section>

      <section className="hg-decision hg-decision--manage shell" id="hg-management">
        <header className="hg-manage-intro">
          <div><b>04</b><span>KEY DECISION 02</span></div>
          <h2>管理页不只回答<br />“有什么”，还要回答<br /><em>“接下来做什么”。</em></h2>
          <p>我把三个分散生长的后台模块整理成三条判断路径：先定位连接状态，再理解用量变化，最后处理成员与邀请。</p>
        </header>
        <article className="hg-manage-primary">
          <div className="hg-manage-primary__copy">
            <small>01 / PRIMARY PATH</small>
            <h3>Integrations</h3>
            <p>连接管理是这组页面的重点。信息从“平台总览”进入“分类筛选”，再落到平台卡片与具体连接；正常、失效、待重新授权不再混在同一层。</p>
            <ol>
              <li><b>平台总览</b><span>先看支持哪些平台，以及每个平台已有多少连接。</span></li>
              <li><b>状态定位</b><span>连接状态与异常原因紧邻出现，不必进入详情才发现问题。</span></li>
              <li><b>动作闭环</b><span>Manage、Connect 与重新授权回到同一条操作路径。</span></li>
            </ol>
          </div>
          <Evidence src={WEBAPP_ASSETS.integrations} alt="Integrations 连接管理重构" ratio="7680 / 5780" zoom={zoom} />
        </article>
        <div className="hg-manage-secondary">
          <article>
            <Evidence src={WEBAPP_ASSETS.usage} alt="Usage 用量数据重构" ratio="7680 / 5696" zoom={zoom} />
            <div><small>02 / USAGE</small><h3>从总量进入趋势，再定位到成员。</h3><p>概览指标、用量变化与成员明细沿同一阅读方向展开，管理员不只看到数字，也能判断变化发生在哪里。</p></div>
          </article>
          <article>
            <Evidence src={WEBAPP_ASSETS.team} alt="Team Management 团队与邀请管理" ratio="7680 / 5588" zoom={zoom} />
            <div><small>03 / TEAM MANAGEMENT</small><h3>把成员、邀请与状态收进同一套规则。</h3><p>Members 与 Invitations 共享搜索、筛选和状态表达；邀请是否生效、成员是否可用，不再依赖多处确认。</p></div>
          </article>
        </div>
      </section>

      <section className="hg-decision hg-decision--objects" id="hg-objects">
        <div className="shell">
          <header className="hg-object-intro">
            <div><b>05</b><span>KEY DECISION 03</span></div>
            <h2>能力增加时，<br />不再增加一排入口。</h2>
            <p>我把新增功能归入四类可被再次找到和管理的对象。这样每一次扩展都能沿用已有关系，而不是重新发明一套页面。</p>
          </header>
          <div className="hg-object-layout">
            <div className="hg-object-visuals">
              <Evidence src={WEBAPP_ASSETS.objects} alt="结果、会话、任务与 Plugins Skills 能力管理设计" ratio="7680 / 6544" zoom={zoom} />
            </div>
            <ol className="hg-object-logic">
              <li><b>RESULT</b><div><h3>结果可以进入协作</h3><p>分享时保留选中内容、来源上下文与访问入口，让分析输出离开当前会话后仍然可理解。</p></div></li>
              <li><b>SESSION</b><div><h3>重要会话能够再次找到</h3><p>分组、置顶与搜索共同管理历史分析，用户可以回到关键判断，而不是重新发起同一问题。</p></div></li>
              <li><b>TASK</b><div><h3>定时任务拥有明确归属</h3><p>任务绑定固定项目，执行结果持续沉淀在同一位置，避免自动化产出散落在不同入口。</p></div></li>
              <li><b>CAPABILITY</b><div><h3>插件与技能可以被理解</h3><p>以分类、状态和能力说明组织 Plugins &amp; Skills，用户先知道它解决什么，再决定是否使用。</p></div></li>
            </ol>
          </div>
        </div>
      </section>

      <section className="hg-system shell" id="hg-system">
        <div className="hg-section-label"><span>06</span><b>EXPERIENCE RULES</b></div>
        <div className="hg-system__intro"><h2>设计系统不是<br />项目结束后的整理，<br />而是复杂产品<br />继续迭代的基础。</h2><p>我把重复出现的界面元素收敛为三类规则：信息容器、操作反馈与状态表达。新页面不再从零判断，研发也能使用同一套结构继续扩展。</p></div>
        <div className="hg-system__board"><Evidence src={WEBAPP_ASSETS.system} alt="Hologrow 体验组件与状态规范" ratio="7680 / 8676" zoom={zoom} /></div>
      </section>

      <section className="hg-reflection" id="hg-reflection">
        <div className="shell">
          <div className="hg-section-label"><span>07</span><b>REFLECTION</b></div>
          <div className="hg-reflection__copy"><h2>从完成页面，<br />到判断产品如何继续生长。</h2><p>这次升级让我从“把页面做完整”，转向思考一个复杂产品如何持续生长：信息能被看懂，状态能被判断，能力能被管理，后续迭代也有规则可依。</p></div>
          <div className="hg-reflection__grid">
            <span><b>01</b>从页面优化到产品结构</span>
            <span><b>02</b>从视觉统一到体验规则统一</span>
            <span><b>03</b>从完成需求到判断优先级</span>
            <span><b>04</b>从设计交付到协作落地</span>
          </div>
          <button className="hg-back" onClick={close}>返回作品展 <Arrow /></button>
        </div>
      </section>
    </main>
  </div>
}
