import { useEffect, useMemo, useRef, useState } from 'react'
import { PROJECT_DATA } from './App.jsx'

const FILTERS = ['All', 'UX/UI & Web', 'Game Design', 'Digital Media', 'Spatial Design']
const FEATURED_IDS = ['hologrow-webapp', 'hologrow-website', 'hi-link']
const cleanFigmaEmbedUrl = url => url?.replaceAll('%26show-proto-sidebar%3D1', '')
const CASE_THEMES = {
  cyan: { bg: '#090a0c', surface: '#0d171a', ink: '#f5f7f8', muted: '#9da9ad', accent: '#55d6e8' },
  purple: { bg: '#0a090d', surface: '#15111c', ink: '#f7f5f9', muted: '#aaa3b2', accent: '#a77cff' },
  blue: { bg: '#090a0d', surface: '#101622', ink: '#f5f7fa', muted: '#a0a8b8', accent: '#78a8ff' },
  orange: { bg: '#0c0908', surface: '#19110e', ink: '#faf7f5', muted: '#aea29d', accent: '#ff784f' },
  green: { bg: '#090b0a', surface: '#101914', ink: '#f5f9f7', muted: '#9faea6', accent: '#7bd7a9' },
  pink: { bg: '#0c090b', surface: '#191016', ink: '#faf5f7', muted: '#b0a0a7', accent: '#ff79ad' },
  yellow: { bg: '#0c0b08', surface: '#19170f', ink: '#faf9f4', muted: '#ada99a', accent: '#f2cf58' },
  emerald: { bg: '#080b0a', surface: '#0e1915', ink: '#f4f9f7', muted: '#9eaea7', accent: '#50d59b' },
  red: { bg: '#0c0909', surface: '#1a1011', ink: '#faf5f5', muted: '#b09fa1', accent: '#ff676f' },
}
const CAPABILITIES = [
  ['A', 'AI PRODUCTS', '把不确定的智能能力，组织成可理解、可协作的产品体验。'],
  ['B', 'COMPLEX SYSTEMS', '把业务、角色与状态，转译成清晰、可持续生长的系统。'],
  ['C', 'GAME EXPERIENCE', '用规则、反馈与叙事，塑造人在系统中的行动与情绪。'],
  ['D', 'INTERACTIVE MEDIA', '让空间、影像与实时媒介，成为可以被感知和参与的界面。'],
]

const Arrow = ({ down = false }) => <svg className={down ? 'arrow arrow--down' : 'arrow'} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>

function Membrane() {
  return <div className="membrane" aria-hidden="true">
    <svg viewBox="-180 -160 1260 1120" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="membrane-stroke" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#875cff" stopOpacity="0"/><stop offset=".2" stopColor="#875cff" stopOpacity=".16"/><stop offset=".52" stopColor="#9d7aff" stopOpacity=".38"/><stop offset=".82" stopColor="#875cff" stopOpacity=".12"/><stop offset="1" stopColor="#875cff" stopOpacity="0"/></linearGradient>
        <filter id="membrane-blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="22"/></filter>
        <filter id="soft-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>
      </defs>
      <path className="membrane__aura" d="M-220 18C110 18 127 226 404 310C689 396 646 639 1088 782" fill="none" stroke="url(#membrane-stroke)" strokeWidth="210" strokeLinecap="round" filter="url(#membrane-blur)"/>
      <path className="membrane__body" d="M-220 18C110 18 127 226 404 310C689 396 646 639 1088 782" fill="none" stroke="url(#membrane-stroke)" strokeWidth="128" strokeLinecap="round"/>
      <g className="membrane__threads" fill="none" stroke="#b7a5ff" strokeOpacity=".38" strokeLinecap="round">
        <path d="M-230-22C108-8 153 195 421 276C718 366 674 598 1098 727"/>
        <path d="M-232 5C93 12 131 218 405 300C696 387 653 628 1096 764"/>
        <path d="M-231 32C82 30 109 242 388 329C670 417 632 657 1084 804"/>
        <path d="M-225 61C72 48 91 265 369 359C645 452 612 687 1065 843"/>
      </g>
      <path className="membrane__edge" d="M-230-22C108-8 153 195 421 276C718 366 674 598 1098 727" fill="none" stroke="#d3c9ff" strokeOpacity=".62" strokeLinecap="round" filter="url(#soft-glow)"/>
    </svg>
  </div>
}

function ManifestoHero() {
  const ref = useRef(null)
  const move = (event) => {
    if (!ref.current || event.pointerType === 'touch') return
    const rect = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--pointer-x', ((event.clientX - rect.left) / rect.width - .5).toFixed(3))
    ref.current.style.setProperty('--pointer-y', ((event.clientY - rect.top) / rect.height - .5).toFixed(3))
  }
  return <section className="manifesto-hero" ref={ref} onPointerMove={move} aria-labelledby="hero-title">
    <div className="hero-structure" aria-hidden="true"><span/><span/><span/><span/></div>
    <Membrane />
    <div className="hero-content shell">
      <div className="identity-lockup">
        <p className="identity-name">陈馨语 <span>/ XINYU CHEN</span></p>
        <p>空间与跨媒介背景的系统体验设计师</p>
        <small>EXPERIENCE DESIGNER — AI PRODUCTS · COMPLEX SYSTEMS · INTERACTIVE MEDIA</small>
      </div>
      <h1 id="hero-title">我设计复杂系统，<br/>也设计人在其中的感受。</h1>
      <div className="capability-map" aria-label="设计能力领域">
        {CAPABILITIES.map(([id, name, desc]) => <a href="#exhibition" key={id}><b>{id}</b><span>{name}</span><small>{desc}</small></a>)}
      </div>
      <a className="enter-exhibition" href="#exhibition"><Arrow down/><span>向下进入作品</span><small>ENTER THE EXHIBITION</small></a>
    </div>
  </section>
}

function FeaturedExhibition({ projects, onOpen }) {
  const ref = useRef(null)
  const dragStart = useRef(null)
  const dragged = useRef(false)
  const hoverZone = useRef(null)
  const [focus, setFocus] = useState(0)
  const select = (index) => setFocus((index + projects.length) % projects.length)
  const move = (event) => {
    if (!ref.current || event.pointerType === 'touch') return
    const rect = ref.current.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - .5
    const y = (event.clientY - rect.top) / rect.height - .5
    ref.current.style.setProperty('--gallery-x', x.toFixed(3))
    ref.current.style.setProperty('--gallery-y', y.toFixed(3))
    ref.current.style.setProperty('--gallery-rotate-x', `${(-y * 3.2).toFixed(2)}deg`)
    ref.current.style.setProperty('--gallery-rotate-y', `${(x * 4.2).toFixed(2)}deg`)
  }
  const leave = () => {
    if (!ref.current) return
    ref.current.style.setProperty('--gallery-x', 0)
    ref.current.style.setProperty('--gallery-y', 0)
    ref.current.style.setProperty('--gallery-rotate-x', '0deg')
    ref.current.style.setProperty('--gallery-rotate-y', '0deg')
  }
  const pointerDown = event => { dragStart.current = event.clientX; dragged.current = false }
  const pointerUp = event => {
    if (dragStart.current == null) return
    const delta = event.clientX - dragStart.current
    dragStart.current = null
    if (Math.abs(delta) > 45) { dragged.current = true; select(focus + (delta < 0 ? 1 : -1)); requestAnimationFrame(() => { dragged.current = false }) }
  }
  const keyDown = event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); select(focus + 1) }
    if (event.key === 'ArrowLeft') { event.preventDefault(); select(focus - 1) }
  }
  const previewFromHover = (direction) => {
    if (hoverZone.current === direction) return
    hoverZone.current = direction
    select(focus + direction)
  }
  const active = projects[focus]
  return <section className="exhibition" id="exhibition" ref={ref} onPointerMove={move} onPointerLeave={leave}>
    <div className="exhibition-heading shell">
      <div><p>系统、产品与人的连接</p><h2>定位之后，<br/>用真实项目证明。</h2></div>
      <p>从 AI 产品到复杂协作，再延伸至游戏与交互媒介。每个项目都不是孤立结果，而是一次对系统和感受的共同设计。</p>
    </div>
    <div className="featured-carousel" tabIndex="0" onKeyDown={keyDown} aria-label={`精选项目，当前为 ${active.title}`}>
      <div className="featured-carousel__stage" onPointerDown={pointerDown} onPointerUp={pointerUp}>
        {projects.map((project, index) => {
          let slot = index - focus
          if (slot > 1) slot -= projects.length
          if (slot < -1) slot += projects.length
          return <button className={`featured-slide ${slot === 0 ? 'is-active' : ''}`} style={{ '--slide-x': `${slot * 78}%`, '--hover-x': `${slot * 70}%`, '--slide-scale': slot === 0 ? 1 : .72, '--slide-rotate': `${slot * 3.5}deg`, '--hover-rotate': `${slot * 2.4}deg`, '--slide-opacity': slot === 0 ? 1 : .38, '--slide-z': slot === 0 ? 3 : 1 }} key={project.id} onClick={() => { if (!dragged.current) slot === 0 ? onOpen(project) : select(index) }} aria-label={slot === 0 ? `进入项目：${project.title}` : `查看项目：${project.title}`}>
            <span className="featured-slide__media"><img src={project.coverImage} alt={`${project.title} 项目封面`} loading={index ? 'lazy' : 'eager'}/></span>
          </button>
        })}
        <button className="featured-carousel__hover-zone featured-carousel__hover-zone--prev" onPointerMove={() => previewFromHover(-1)} onPointerLeave={() => { hoverZone.current = null }} onFocus={() => previewFromHover(-1)} aria-label="预览上一个项目" />
        <button className="featured-carousel__hover-zone featured-carousel__hover-zone--next" onPointerMove={() => previewFromHover(1)} onPointerLeave={() => { hoverZone.current = null }} onFocus={() => previewFromHover(1)} aria-label="预览下一个项目" />
      </div>
      <div className="featured-carousel__caption shell">
        <button className="carousel-arrow carousel-arrow--prev" onClick={() => select(focus - 1)} aria-label="上一个项目"><Arrow/></button>
        <div className="featured-carousel__meta">
          <span>P—0{focus + 1} / {active.category}</span>
          <h3>{active.title}</h3>
          <p>{active.subtitle}</p>
          <button onClick={() => onOpen(active)}>查看案例 <Arrow/></button>
        </div>
        <div className="featured-carousel__pagination" aria-label="选择精选项目">
          {projects.map((project, index) => <button key={project.id} className={focus === index ? 'active' : ''} onClick={() => select(index)} aria-label={`查看 ${project.title}`}>0{index + 1}</button>)}
        </div>
        <button className="carousel-arrow carousel-arrow--next" onClick={() => select(focus + 1)} aria-label="下一个项目"><Arrow/></button>
      </div>
    </div>
  </section>
}

function ProjectDetail({ project, close, zoom }) {
  const caseTheme = CASE_THEMES[project.btnTheme] || CASE_THEMES.purple
  const [isScrolled, setIsScrolled] = useState(false)
  useEffect(() => { document.body.classList.add('locked'); const key = e => e.key === 'Escape' && close(); addEventListener('keydown', key); return () => { document.body.classList.remove('locked'); removeEventListener('keydown', key) } }, [close])
  return <div className={`case-page ${isScrolled ? 'is-scrolled' : ''}`} onScroll={event => setIsScrolled(event.currentTarget.scrollTop > 24)} style={{ '--bg': caseTheme.bg, '--surface': caseTheme.surface, '--lifted': caseTheme.surface, '--ink': caseTheme.ink, '--muted': caseTheme.muted, '--violet': caseTheme.accent, '--case-accent': caseTheme.accent }} role="dialog" aria-modal="true" aria-label={`${project.title} 项目详情`}>
    <nav className="case-top"><button onClick={close}>← 返回作品展</button><span>{project.category} / CASE STUDY</span></nav>
    <header className="case-title shell"><div><p>{project.category}</p><h1>{project.title}</h1><h2>{project.subtitle}</h2></div><div className="case-chips">{project.tags.map(x => <span key={x}>{x}</span>)}</div></header>
    <button className="case-main-image shell" onClick={() => zoom(project.detailHeroImage)}><img src={project.detailHeroImage} alt={`${project.title} 项目展示`}/></button>
    <section className="case-logic shell"><div className="case-overview"><span>PROJECT CONTEXT</span><p>{project.overview}</p></div><div className="case-decisions">{project.details.map((d, i) => <article key={d.title}><b>{String(i + 1).padStart(2, '0')}</b><h3>{d.title}</h3><p>{d.desc}</p></article>)}</div></section>
    {(project.liveSiteUrl || project.videoUrl) && <section className="case-links shell"><div className="case-links__intro"><span>LIVE OUTPUT</span><h2>进入真实体验</h2><p>离开静态展示，查看已经上线或可播放的项目成果。</p></div><div className="case-links__actions">{project.liveSiteUrl && <a className="case-link case-link--live" href={project.liveSiteUrl} target="_blank" rel="noreferrer"><span><small>LIVE SITE</small><strong>访问线上网站</strong></span><Arrow/></a>}{project.videoUrl && <a className="case-link" href={project.videoUrl} target="_blank" rel="noreferrer"><span><small>PROJECT FILM</small><strong>观看项目影片</strong></span><Arrow/></a>}</div></section>}
    {project.gallery?.length > 0 && <section className="case-gallery shell"><header><span>PROCESS / OUTPUT</span><h2>设计不是结果，<br/>而是一连串判断。</h2></header>{project.gallery.map((x, i) => <article key={`${x.title}-${i}`}>{x.prototypeUrl ? <div className="figma-prototype-block"><div className="figma-prototype__status"><i aria-hidden="true"/><b>LIVE PROTOTYPE</b><span>可直接交互</span></div><div className="figma-prototype" style={{ aspectRatio: x.prototypeAspectRatio || '16 / 9' }}><iframe src={cleanFigmaEmbedUrl(x.prototypeUrl)} title={`${x.title} 可交互原型`} loading="lazy" allow="fullscreen" allowFullScreen/></div></div> : <button onClick={() => zoom(x.image)}><img src={x.image} alt={x.title} loading="lazy"/></button>}<div className="case-gallery__copy"><b>{String(i + 1).padStart(2, '0')}</b><h3>{x.title}</h3><p>{x.desc}</p>{x.linkUrl && <a href={x.linkUrl} target="_blank" rel="noreferrer">访问项目 ↗</a>}</div></article>)}</section>}
  </div>
}

function ProjectRow({ project, index, onOpen }) {
  return <button className="project-row" onClick={() => onOpen(project)}>
    <span className="project-row__id">{String(index + 1).padStart(2, '0')}</span>
    <span className="project-row__title"><strong>{project.title}</strong><small>{project.subtitle}</small></span>
    <span className="project-row__category">{project.category}</span>
    <span className="project-row__preview"><img src={project.coverImage} alt="" loading="lazy"/></span>
    <Arrow/>
  </button>
}

export default function Portfolio() {
  const [filter, setFilter] = useState('All')
  const [active, setActive] = useState(null)
  const [zoom, setZoom] = useState(null)
  const [copied, setCopied] = useState(false)
  const projects = useMemo(() => filter === 'All' ? PROJECT_DATA : PROJECT_DATA.filter(x => x.category === filter), [filter])
  const featured = FEATURED_IDS.map(id => PROJECT_DATA.find(x => x.id === id)).filter(Boolean)
  const copy = async () => { try { await navigator.clipboard.writeText('xinyuchen1124@163.com'); setCopied(true); setTimeout(() => setCopied(false), 1600) } catch { window.location.href = 'mailto:xinyuchen1124@163.com' } }

  if (active) return <><ProjectDetail project={active} close={() => setActive(null)} zoom={setZoom}/>{zoom && <div className="lightbox" onClick={() => setZoom(null)}><button aria-label="关闭大图">×</button><img src={zoom} alt="项目大图"/></div>}</>

  return <div className="portfolio">
    <nav className="nav shell" aria-label="主导航">
      <a className="wordmark" href="#top">陈馨语 <span>/ XINYU CHEN</span></a>
      <div className="nav-links"><a href="#exhibition">作品</a><a href="#experience">经历</a><a href="#about">关于</a><a href="/陈馨语-体验设计师-简历.pdf" target="_blank">简历 / RESUME</a></div>
      <button onClick={copy}>{copied ? '邮箱已复制' : '联系'}</button>
    </nav>
    <main id="top">
      <ManifestoHero/>
      <FeaturedExhibition projects={featured} onOpen={setActive}/>
      <section className="work-index shell" id="projects">
        <header><div><p>完整项目索引</p><h2>不同媒介，<br/>同一条体验逻辑。</h2></div><p>商业产品首先证明系统能力；游戏、影像、装置与空间实验，则呈现我如何理解反馈、叙事与感知。</p></header>
        <div className="filters" role="group" aria-label="项目分类">{FILTERS.map(x => <button className={filter === x ? 'active' : ''} aria-pressed={filter === x} key={x} onClick={() => setFilter(x)}>{x === 'All' ? '全部项目' : x}</button>)}</div>
        <div className="project-index-list">{projects.map((x, i) => <ProjectRow key={x.id} project={x} index={i} onOpen={setActive}/>)}</div>
      </section>
      <section className="about shell" id="about">
        <div className="about-statement"><p>我的设计轨迹</p><h2>不是不断更换专业，<br/>而是持续接近同一个问题：</h2><blockquote>人如何理解一个系统，<br/>在其中行动，并产生感受？</blockquote></div>
        <div className="practice-path"><article><b>空间与叙事</b><p>从场景、动线与氛围出发，理解人在三维环境中的感知。</p></article><article><b>交互与系统</b><p>进入 UX/UI 与 B 端产品，把复杂业务转译成清晰的任务路径。</p></article><article><b>实时与跨媒介</b><p>用游戏引擎、传感器和创意编程探索反馈、沉浸与情绪。</p></article></div>
      </section>
      <section className="experience shell" id="experience">
        <header><p>工作经历</p><h2>把设计判断带进<br/>真实产品与团队。</h2></header>
        <div className="experience-list"><article><time>2026.05 — NOW</time><div><h3>虹影生长 Hologrow</h3><p>UI/UX 设计师</p></div><p>负责主营 WebApp 与品牌官网的全链路 UI/UX，建立面向 AI 产品的体验规则与组件体系；以 Vibecoding 推进设计到前端落地，并延展品牌 VI 与多媒体资产。</p></article><article><time>2025.09 — 2026.05</time><div><h3>小红书 RED</h3><p>B 端体验设计实习生</p></div><p>参与自研协作产品 Hi 的全链路设计，覆盖 Dark Mode、设计系统、AI 复杂交互与审批体验；在业务判断、体验策略和研发落地之间建立连接。</p></article></div>
      </section>
      <section className="contact shell" id="contact"><p>下一段体验，<br/>也许可以一起设计。</p><button onClick={copy}>{copied ? '邮箱已复制' : '和我聊聊'}<Arrow/></button><footer><b>xinyuchen1124@163.com</b><span>© 2026 XINYU CHEN</span></footer></section>
    </main>
  </div>
}
