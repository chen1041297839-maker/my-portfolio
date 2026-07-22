const Arrow = () => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>

const cleanFigmaEmbedUrl = url => url?.replaceAll('%26show-proto-sidebar%3D1', '')

const CASES = {
  'hologrow-website': {
    tone: 'website',
    accent: '#a9c58a',
    heroFit: 'contain',
    heroRatio: '16 / 9',
    title: <>让用户先理解，<br />再决定是否相信。</>,
    summary: '官网不是产品说明书。它需要控制用户每一屏新增的理解，并把 AI 产品的可信度变成一条看得见的路径。',
    facts: [['ROLE', '信息架构 · UI 视觉 · Vibecoding 落地'], ['FOCUS', '产品叙事 · 可信设计'], ['OUTPUT', '品牌官网 · 响应式网页']],
    heroPosition: '50% 50%',
    context: {
      title: '真正的问题不是信息不够，而是用户需要自己拼出产品价值。',
      body: '旧的信息组织更接近功能目录：技术能力很多，但产品身份、最终输出、可信依据和使用场景没有形成连续理解。我的目标不是增加解释，而是减少用户建立判断时需要跨越的距离。',
      problems: [['产品身份', '第一屏需要回答 Pulse 到底是什么。'], ['结果可信', 'AI 的来源、过程与输出不能继续像黑箱。'], ['业务相关', '不同角色需要快速找到与自己有关的场景。']],
    },
    strategy: {
      title: '按用户的理解顺序组织首页，而不是按内部功能目录排版。',
      body: '我把信息拆成六次递进：先建立产品身份，再展示输出；随后解释可信依据与工作方式，最后落到差异价值和角色场景。每一屏只负责推进一个判断。',
      path: ['这是什么', '会产出什么', '为什么可信', '如何工作', '有何不同', '与我何关'],
      image: { index: 1, position: '50% 50%', ratio: '7680 / 6324', fit: 'contain' },
    },
    decisions: [
      {
        label: '首页认知',
        title: '先给结果，再解释能力。',
        body: '用户进入官网时不会先研究技术架构。我先呈现产品身份与 analyst memo，让价值形成具体形状；数据来源和能力支柱随后出现，为前面的结论补充依据。',
        media: [{ index: 2, ratio: '7680 / 7640', position: '50% 50%', fit: 'contain' }],
        notes: ['产品身份先于功能枚举', '最终输出先于技术过程', '每一屏只新增一层理解'],
      },
      {
        label: '可信设计',
        title: '把“相信 AI”拆成可被检查的关系。',
        body: '可信感不靠一句智能承诺。我把 sources、处理中间层、confidence 和最终 memo 组织在同一条路径中，让用户知道信息从哪里来、经过什么处理、最后为何得到这个结论。',
        media: [{ index: 3, ratio: '7680 / 5416', position: '50% 50%', fit: 'contain' }],
        notes: ['来源可追溯', '过程可理解', '结论可带回工作'],
      },
      {
        label: '落地方法',
        title: '让 AI 加快实现，而不是代替设计判断。',
        body: '时间约束下，我没有把工作压缩成一次生成。先明确 VI、site map 和每个 section 的任务，再用结构化 brief 推进真实网页；所有删减、层级和移动端取舍都回到浏览器里验证。',
        media: [],
        notes: ['先定义视觉与内容边界', '用真实页面检查理解成本', '保留设计师对取舍的控制'],
      },
    ],
    reflection: {
      title: '从“展示技术”，到控制用户如何理解产品。',
      body: '这个项目让我把官网看成产品体验的第一段：它既要建立品牌气质，也要减少销售解释成本，并为进入真实产品做好认知准备。',
      points: ['表达产品身份', '组织理解顺序', '把可信度可视化', '在真实页面里迭代'],
    },
  },
  'hi-link': {
    tone: 'hi',
    accent: '#78a8ff',
    title: <>让一条链接，<br />在发送前<br />就变得确定。</>,
    summary: '链接解析并不只是一个配置页，而是一条从开发、预览到审批的跨角色链路。设计要让结果可预期、风险可判断、状态可追踪。',
    facts: [['STAGE', '小红书 B 端协作产品'], ['ROLE', '体验设计'], ['SCOPE', '配置预览 · 审批 · 多端']],
    heroPosition: '50% 50%',
    context: {
      title: '用户最担心的不是不会配置，而是发送出去以后才发现结果不对。',
      body: '开发者在后台编辑解析参数，业务方在 IM 中看到真实结果，审批者还需要判断风险。旧链路把这些角色分散在不同页面和状态中，配置过程像开盲盒，操作后的反馈也不够明确。',
      problems: [['配置黑箱', '参数变化与最终气泡之间缺少即时对应。'], ['风险模糊', '高危操作和普通操作的视觉权重接近。'], ['状态断裂', '提交、审批与驳回在桌面和移动端缺少连续表达。']],
    },
    strategy: {
      title: '先让用户看到结果，再让他们放心提交。',
      body: '我把体验主线从“填写表单”改成“建立确定性”：配置时实时预览，提交前暴露风险，审批时保留关键上下文，最终让每个角色都能回答现在是什么状态、下一步做什么。',
      path: ['配置参数', '实时预览', '风险检查', '提交审批', '跨端决策'],
      image: null,
    },
    decisions: [
      {
        label: '配置确定性',
        title: '把配置与验证放进一条向下推进的路径。',
        body: '这条链路最容易出错的地方，是后台参数与 IM 最终呈现相互脱节。我把两者组织成前后相接的检查过程：先界定规则作用范围，再用真实内容确认输出，减少发送之后才发现问题的风险。',
        media: [{ index: 2, prototype: true, ratio: '16 / 10', copy: '在画板中新增一条 URL 规则，试着设置匹配范围、解析样式与回调地址。' }, { index: 3, prototype: true, ratio: '16 / 10', copy: '完成规则后继续向下滚动，在沙箱中粘贴真实链接，检查它在 IM 中最终生成的气泡。' }],
        notes: ['新增规则路径可操作', '配置完成后进入沙箱', '同页完成配置与验证'],
      },
      {
        label: 'PC 端审批',
        title: '把申请信息、风险与状态放进同一条判断路径。',
        body: '桌面端利用宽屏把申请内容、风险提示、流转状态和决策操作放在同一视野。审核者先理解上下文，再完成审批，不必在多个页面之间反复确认。',
        media: [{ index: 4, prototype: true, ratio: '16 / 10', copy: 'PC 端审批在同一页面呈现申请信息、关键风险、状态时间线与决策入口，支持审核者沿着完整上下文完成判断。' }],
        notes: ['申请信息与风险并置', '审批状态连续可见', '决策入口保持稳定'],
      },
      {
        label: '移动审批',
        title: '把并行决策改成纵向按钮，让关键操作落进拇指热区。',
        body: '桌面端并排的审批按钮到了手机上会变窄，也更容易误触。我将决策动作改为上下排列，并集中在底部操作热区；主操作优先，次要操作顺序展开，让单手审批更稳定。',
        media: [{ index: 5, prototype: true, ratio: '4 / 3', copy: '移动端将并行审批按钮改为纵向排列，主次决策进入底部拇指热区，减少窄屏误触并提升单手操作稳定性。' }],
        notes: ['并行按钮改为纵向层级', '主操作落在拇指热区', '减少狭窄屏幕误触'],
      },
    ],
    reflection: {
      title: '真正被优化的不是一个页面，而是发送前后的确定性。',
      body: '这个项目让我更明确：复杂 B 端体验的价值，往往不是减少一个输入框，而是让不同角色在同一条链路上共享结果、风险和状态。',
      points: ['配置可预期', '风险可判断', '状态可追踪', '多端可连续'],
    },
  },
  'todo-ai': {
    tone: 'todo',
    accent: '#78a8ff',
    title: <>让 AI 进入协作，<br />而不是停在<br />对话框里。</>,
    summary: '企业里的 AI 助手不仅要回答问题，还要被配置、分发、等待和继续使用。设计重点是让这些环节连成一条可靠的工作路径。',
    facts: [['STAGE', '小红书 B 端协作产品'], ['ROLE', '体验设计'], ['SCOPE', 'AI 配置 · 对话反馈 · 上下文']],
    heroPosition: '50% 50%',
    context: {
      title: 'AI 能回答，不代表它已经能进入真实工作。',
      body: '业务人员需要在缺少模型知识的情况下完成角色配置；管理员需要控制分发范围；员工则需要在等待、阅读和多轮追问中理解系统状态。任何一个环节断开，AI 都只会成为一次性工具。',
      problems: [['配置门槛', '模型参数与 Prompt 对业务人员并不友好。'], ['等待黑箱', '生成过程缺少反馈，长响应容易被误判为失败。'], ['对话中断', '快捷操作、Markdown 与上下文没有形成连续体验。']],
    },
    strategy: {
      title: '先完成配置与发布，再进入 IM 使用。',
      body: '前半段先讲清 AI 角色如何被创建、分发并在发布前预览；只有当管理员确认谁能使用、发布后如何呈现，案例才进入员工侧 IM，继续讨论等待反馈、内容阅读和多轮协作。',
      path: ['角色配置', '范围与权限', '发布前预览', 'IM 状态反馈', '多轮协作'],
      image: { index: 0, position: '50% 50%' },
    },
    decisions: [
      {
        label: '配置与发布',
        title: '先把角色、范围和发布结果配置清楚。',
        body: '配置阶段先完成角色定义、发送范围与发布前预览。管理员不必理解模型术语，而是围绕业务任务判断谁能使用、看到什么，以及发布后在 IM 中如何呈现。',
        media: [{ index: 2, prototype: true, ratio: '16 / 10', copy: '发送范围与组织权限被放进同一条配置路径，管理员可以在发布前确认 AI 角色会被谁看见、由谁使用。' }, { index: 3, prototype: true, ratio: '16 / 10', copy: '配置项与右侧真实对话预览同步变化，业务人员可以在发布前确认角色、内容和交互结果。' }],
        notes: ['从业务任务而非模型参数开始', '范围与权限在发布前确认', '预览用于检查发布结果'],
      },
      {
        label: 'IM 反馈与阅读',
        title: '进入 IM 后，等待要有反馈，结果也要能被快速读懂。',
        body: '完成配置与发布后，使用阶段才进入 IM。Thinking 说明系统仍在工作；流式输出与 Markdown 规则负责把长文本、代码和表格整理成可阅读结构。',
        media: [{ index: 5, prototype: true, ratio: '16 / 10', copy: 'Thinking 状态解释系统仍在处理，避免长响应被误判为卡住或失败。' }, { index: 6, prototype: true, ratio: '16 / 10', copy: 'Markdown 规则用于区分标题、正文、列表、代码和表格，让长回答可以被扫读。' }],
        notes: ['等待过程有状态', '长内容有阅读层级', '输出能进入后续工作'],
      },
      {
        label: 'IM 连续协作',
        title: '让一次回答自然变成下一步协作。',
        body: '我用快捷指令降低重复输入，用输入锁定避免重发，再通过话题引导与上下文记忆保持多轮任务连续。用户不需要每一轮都重新解释自己。',
        media: [{ index: 4, prototype: true, ratio: '16 / 10', copy: '高频提示被整理为可直接触发的快捷指令，让用户无需反复输入相同任务。' }, { index: 7, prototype: true, ratio: '16 / 10', copy: '快捷指令、输入锁定与上下文记忆共同维持多轮任务，减少重复说明与误触重发。' }],
        notes: ['高频任务一键触发', '发送状态防止重复操作', '多轮任务保留上下文'],
      },
    ],
    reflection: {
      title: 'AI 体验的完整度，发生在回答之前，也发生在回答之后。',
      body: '这个项目把我的关注点从聊天界面推向完整协作链路：谁能配置、谁能使用、系统正在做什么、结果如何继续流转，都是 AI 产品体验的一部分。',
      points: ['配置可理解', '权限可控制', '过程可感知', '上下文可延续'],
    },
  },
  'bao-ai': {
    tone: 'bao',
    accent: '#a77cff',
    title: <>把“我也想做”，<br />变成一次<br />轻松的创作。</>,
    summary: '包的 AI 面向没有 Prompt 经验的年轻用户。它不要求用户先学会工具，而是从灵感、做同款、生成等待到分享，建立一条自然的创作路径。',
    facts: [['TYPE', 'C 端 AI 图像创作'], ['ROLE', 'UX/UI 设计'], ['SCOPE', '发现 · 生成 · 分享']],
    heroPosition: '50% 50%',
    heroFit: 'contain',
    heroRatio: '16 / 9',
    context: {
      title: '普通用户缺少的不是生成能力，而是从喜欢一张图到做出自己的那一步。',
      body: '许多生图工具从 Prompt 和参数开始，要求用户先理解技术语言。对于以表达和分享为目标的年轻用户，这会让灵感停在浏览阶段。项目需要把复杂生成过程收进更直觉的操作里。',
      problems: [['浏览噪声', '工具和文字抢走了作品本身的注意力。'], ['创作门槛', 'Prompt、风格和参数难以被普通用户直接理解。'], ['分享断点', '生成结果与社交表达、个人资产之间缺少连接。']],
    },
    strategy: {
      title: '从看到喜欢，到做出同款，再把结果分享出去。',
      body: '我把体验组织成一条由作品驱动的路径：大图先激发兴趣，详情页拆出可复用元素，“做同款”把复杂参数变成选择，生成完成后立即进入保存、分享和资产管理。',
      path: ['发现灵感', '拆解同款', '选择风格', '等待生成', '分享与收藏'],
      image: { index: 1, position: '50% 50%', ratio: '16 / 9', fit: 'contain' },
    },
    decisions: [
      {
        label: '发现与同款',
        title: '先让作品吸引人，再让创作入口出现在最想行动的时刻。',
        body: '首页弱化工具栏，让大画幅内容成为主角；详情页把作品元素与“做同款”放在同一视野，让用户从欣赏到开始创作不需要重新寻找入口。',
        media: [{ index: 2, ratio: '16 / 9', position: '50% 50%', fit: 'contain' }, { index: 3, ratio: '16 / 9', position: '50% 50%', fit: 'contain' }],
        notes: ['内容先于工具', '同款入口紧跟兴趣', '详情信息服务于下一步行动'],
      },
      {
        label: '可视化创作',
        title: '把 Prompt 调试改写成可以看、可以选的创作步骤。',
        body: '风格、元素和强度不再藏在一段技术文本里，而是变成标签、滑动与明确选项；生成等待也用可见进度和状态文案说明系统正在发生什么。',
        media: [{ index: 4, ratio: '16 / 9', position: '50% 50%', fit: 'contain' }, { index: 5, ratio: '16 / 9', position: '50% 50%', fit: 'contain' }],
        notes: ['参数被翻译为视觉选择', '操作始终能看到当前结果', '等待过程有明确反馈'],
      },
      {
        label: '分享与资产',
        title: '创作完成不是终点，而是分享和再次创作的起点。',
        body: '结果页把海报、二维码和社交分享放在生成完成的自然节点；个人页继续承接作品与收藏，让一次生成进入可回看、可展示、可复用的创作者资产。',
        media: [{ index: 6, ratio: '16 / 9', position: '50% 50%', fit: 'contain' }, { index: 7, ratio: '16 / 9', position: '50% 50%', fit: 'contain' }],
        notes: ['分享动作紧跟完成时刻', '作品与收藏进入个人资产', '结果能够带回下一次创作'],
      },
    ],
    reflection: {
      title: '降低门槛，不是删除能力，而是让能力在正确时刻出现。',
      body: '这个项目让我更清楚地看到，C 端 AI 产品不能把模型能力直接交给用户。设计需要控制每一步暴露多少复杂度，让灵感、操作和反馈保持同一节奏。',
      points: ['作品驱动发现', '同款降低启动成本', '等待保持反馈', '结果成为个人资产'],
    },
  },
}

function PrototypeEvidence({ item, alt, ratio, description }) {
  return <article className="narrative-prototype-card">
    <div className="narrative-prototype-card__copy">
      <small><i /> LIVE / 可交互画板</small>
      <h3>{item.title || alt}</h3>
      <p>{description || item.desc}</p>
      <span>画板保持实时状态，可以直接点击、切换并查看完整流程。</span>
    </div>
    <div className="narrative-prototype-stage">
      <div className="narrative-prototype" style={{ '--narrative-ratio': ratio }}>
        <div className="narrative-prototype__badge" aria-hidden="true"><i /> LIVE</div>
        <iframe src={cleanFigmaEmbedUrl(item.prototypeUrl)} title={`${alt} 可交互原型`} loading="lazy" allow="fullscreen" allowFullScreen />
      </div>
    </div>
  </article>
}

function Evidence({ item, alt, ratio = '16 / 10', position = '50% 50%', fit = 'cover', zoom, description }) {
  if (item?.prototypeUrl) return <PrototypeEvidence item={item} alt={alt} ratio={ratio} description={description} />
  const src = item?.image
  return <button type="button" className="narrative-evidence" style={{ '--narrative-ratio': ratio, '--narrative-fit': fit }} onClick={() => src && zoom(src)} aria-label={`放大查看：${alt}`}>
    <img src={src} alt={alt} style={{ objectPosition: position }} loading="lazy" />
    <span>VIEW SOURCE <Arrow /></span>
  </button>
}

function ChapterNav({ project, chapters, jump }) {
  return <nav className="narrative-chapter-nav" aria-label={`${project.title} 案例章节`}><div className="shell">{chapters.map(([label, id], index) => <button type="button" key={id} onClick={() => jump(id)}><b>0{index + 1}</b><span>{label}</span></button>)}</div></nav>
}

export default function NarrativeCaseStudy({ project, close, zoom, isScrolled, onScroll }) {
  const config = CASES[project.id]
  const prefix = `narrative-${project.id}`
  const chapterLabels = ['背景判断', '设计路径', ...config.decisions.map(item => item.label), '复盘']
  const chapterIds = [`${prefix}-context`, `${prefix}-strategy`, ...config.decisions.map((_, index) => `${prefix}-decision-${index + 1}`), `${prefix}-reflection`]
  const chapters = chapterLabels.map((label, index) => [label, chapterIds[index]])
  const jumpToChapter = id => {
    const target = document.getElementById(id)
    const scroller = target?.closest('.narrative-case')
    if (!target || !scroller) return
    const contentTarget = target.querySelector('.narrative-context__lead, .narrative-strategy__copy, header, .narrative-reflection__copy') || target
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const stickyOffset = window.innerWidth <= 640 ? 108 : 126
    const top = contentTarget.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - stickyOffset - 20
    scroller.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' })
  }
  const heroItem = { image: project.detailHeroImage }

  return <div className={`case-page narrative-case narrative-case--${config.tone} ${isScrolled ? 'is-scrolled' : ''}`} style={{ '--narrative-accent': config.accent }} onScroll={onScroll} role="dialog" aria-modal="true" aria-label={`${project.title} 项目详情`}>
    <nav className="case-top"><button type="button" onClick={close}>← 返回作品展</button><span>{project.category} / CASE STUDY</span></nav>
    <ChapterNav project={project} chapters={chapters} jump={jumpToChapter} />

    <header className="narrative-hero">
      <div className="narrative-hero__copy shell">
        <p>{project.title} / {project.category}</p>
        <h1>{config.title}</h1>
        <div className="narrative-hero__bottom"><p>{config.summary}</p><div>{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
        <div className="narrative-facts">{config.facts.map(([label, value]) => <div key={label}><small>{label}</small><span>{value}</span></div>)}</div>
        {project.liveSiteUrl && <a className="narrative-hero-live" href={project.liveSiteUrl} target="_blank" rel="noreferrer"><span><small>LIVE SITE</small><strong>访问正在运行的 Hologrow 官网</strong></span><Arrow /></a>}
      </div>
      <div className="narrative-hero__visual shell"><Evidence item={heroItem} alt={`${project.title} 项目封面`} ratio={config.heroRatio || '16 / 9'} position={config.heroPosition} fit={config.heroFit || 'cover'} zoom={zoom} /></div>
    </header>

    <main>
      <section className="narrative-context shell" id={`${prefix}-context`}>
        <div className="narrative-context__lead"><p>这个项目真正要解决的是</p><h2>{config.context.title}</h2></div>
        <p className="narrative-context__body">{config.context.body}</p>
        <div className="narrative-problem-list">{config.context.problems.map(([title, body], index) => <article key={title}><b>0{index + 1}</b><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>

      <section className="narrative-strategy" id={`${prefix}-strategy`}>
        <div className="shell">
          <div className="narrative-strategy__copy"><h2>{config.strategy.title}</h2><p>{config.strategy.body}</p></div>
          <div className="narrative-path">{config.strategy.path.map((item, index) => <span key={item}><b>0{index + 1}</b>{item}</span>)}</div>
          {config.strategy.image && <Evidence item={project.gallery[config.strategy.image.index]} alt={`${project.title} 设计路径`} ratio={config.strategy.image.ratio || '16 / 9'} position={config.strategy.image.position} fit={config.strategy.image.fit || 'cover'} zoom={zoom} />}
        </div>
      </section>

      {config.decisions.map((decision, index) => <section className={`narrative-decision ${index % 2 ? 'narrative-decision--offset' : ''}`} id={`${prefix}-decision-${index + 1}`} key={decision.label}>
        <div className="shell">
          <header><div><b>0{index + 1}</b><span>{decision.label}</span></div><h2>{decision.title}</h2><p>{decision.body}</p></header>
          {decision.media.length > 0 && <div className={`narrative-media narrative-media--${decision.media.length}`}>{decision.media.map((media, mediaIndex) => {
            const item = project.gallery[media.index]
            const evidenceItem = media.prototype ? item : { image: item?.image }
            return <Evidence key={`${decision.label}-${mediaIndex}`} item={evidenceItem} alt={`${decision.label}：${item?.title || project.title}`} ratio={media.ratio} position={media.position} fit={media.fit} zoom={zoom} description={media.copy} />
          })}</div>}
          <div className="narrative-notes">{decision.notes.map((note, noteIndex) => <span key={note}><b>0{noteIndex + 1}</b>{note}</span>)}</div>
        </div>
      </section>)}

      <section className="narrative-reflection" id={`${prefix}-reflection`}>
        <div className="shell"><div className="narrative-reflection__copy"><h2>{config.reflection.title}</h2><p>{config.reflection.body}</p></div><div className="narrative-reflection__points">{config.reflection.points.map((point, index) => <span key={point}><b>0{index + 1}</b>{point}</span>)}</div><button onClick={close}>返回作品展 <Arrow /></button></div>
      </section>
    </main>
  </div>
}
