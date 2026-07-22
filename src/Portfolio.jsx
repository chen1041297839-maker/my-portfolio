import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { PROJECT_DATA } from './App.jsx'
import AIChatWidget from './AIChatWidget.jsx'
import HologrowWebAppCase from './cases/HologrowWebAppCase.jsx'
import NarrativeCaseStudy from './cases/NarrativeCaseStudy.jsx'

const FILTERS = ['All', 'UX/UI & Web', 'Game Design', 'Digital Media', 'Spatial Design']
const FEATURED_IDS = ['hologrow-webapp', 'hologrow-website', 'hi-link']
const PRODUCT_IDS = ['bao-ai', 'todo-ai', 'top-fax-review']
const EXPERIMENT_IDS = ['e-dentity', 'echo-harmony']
const DEFAULT_VISIBLE_IDS = [...FEATURED_IDS, ...PRODUCT_IDS, ...EXPERIMENT_IDS]
const PROJECT_VALUE = {
  'hologrow-webapp': '把能跑起来的 AI 产品，整理成能被理解、被管理、也能继续生长的系统。',
  'hologrow-website': '把技术能力说清楚，也让品牌在第一屏就拥有可信的气质。',
  'hi-link': '让链接在即时沟通里少一次跳转，也少一次信息丢失。',
  'todo-ai': 'AI 不只给答案，也能进入配置、协作与交付的真实流程。',
  'bao-ai': '把提示词、风格与结果拆成可操作的创作步骤，让第一次生成也不需要教程。',
  'top-fax-review': '当产品越来越像，评测页面应该先帮助用户做决定，而不是继续堆参数。',
  'e-dentity': '把学生轨迹转化为实时生成的粒子校门，让数据成为空间身份的一部分。',
  'echo-harmony': '把植物生物电转译为声画反馈，让触摸成为人与生态重新建立联系的入口。',
}
const cleanFigmaEmbedUrl = url => url?.replaceAll('%26show-proto-sidebar%3D1', '')
const CASE_THEMES = {
  cyan: { bg: '#0b0a0e', surface: '#131218', line: '#29272f', ink: '#f6f5f8', muted: '#aaa7b0', accent: '#78a8ff' },
  purple: { bg: '#0b0a0e', surface: '#141119', line: '#2b2831', ink: '#f7f5f9', muted: '#aaa6b0', accent: '#a77cff' },
  blue: { bg: '#0a0a0e', surface: '#11141b', line: '#282b34', ink: '#f5f7fa', muted: '#a6aab4', accent: '#78a8ff' },
  orange: { bg: '#0b0a0e', surface: '#151218', line: '#2b292f', ink: '#f8f6f7', muted: '#aaa6aa', accent: '#e58a6e' },
  green: { bg: '#0a0b0d', surface: '#111512', line: '#292e2b', ink: '#f5f8f6', muted: '#a8ada9', accent: '#9fc39e' },
  pink: { bg: '#0b0a0e', surface: '#151218', line: '#2c2930', ink: '#f8f5f7', muted: '#aba6aa', accent: '#d989aa' },
  yellow: { bg: '#0b0a0e', surface: '#151419', line: '#2c2b31', ink: '#f8f7f4', muted: '#aaa9a3', accent: '#d1b96f' },
  emerald: { bg: '#0a0b0d', surface: '#111512', line: '#292e2b', ink: '#f5f8f6', muted: '#a8ada9', accent: '#73b69d' },
  red: { bg: '#0b0a0e', surface: '#151218', line: '#2c292f', ink: '#f8f5f6', muted: '#aba6a8', accent: '#d87980' },
}
const CAPABILITIES = [
  ['A', 'AI PRODUCTS', '让生成、等待与结果不再像黑箱。'],
  ['B', 'COMPLEX SYSTEMS', '让角色、状态和任务在同一套秩序里工作。'],
  ['C', 'GAME EXPERIENCE', '用规则与反馈，让人愿意继续行动。'],
  ['D', 'INTERACTIVE MEDIA', '把声音、空间与实时数据变成可以参与的材料。'],
]

const Arrow = ({ down = false }) => <svg className={down ? 'arrow arrow--down' : 'arrow'} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>

const LIGHTBOX_MAX_SCALE = 8

function ImageLightbox({ src, onClose }) {
  const [scale, setScale] = useState(1)
  const [naturalSize, setNaturalSize] = useState(null)
  const getViewportSize = () => ({ width: window.visualViewport?.width || window.innerWidth, height: window.visualViewport?.height || window.innerHeight })
  const [viewportSize, setViewportSize] = useState(getViewportSize)
  const dialogRef = useRef(null)
  const viewportRef = useRef(null)
  const previousScaleRef = useRef(1)
  const dragRef = useRef({ active: false, x: 0, y: 0, left: 0, top: 0 })
  const clampScale = value => Math.min(LIGHTBOX_MAX_SCALE, Math.max(1, Number(value.toFixed(2))))

  useEffect(() => {
    const resize = () => setViewportSize(getViewportSize())
    const key = event => {
      if (event.key === 'Escape') onClose()
      if (event.key === '+' || event.key === '=') setScale(value => clampScale(value + .5))
      if (event.key === '-') setScale(value => clampScale(value - .5))
      if (event.key === '0') setScale(1)
    }
    addEventListener('resize', resize)
    window.visualViewport?.addEventListener('resize', resize)
    addEventListener('keydown', key)
    dialogRef.current?.focus()
    return () => {
      removeEventListener('resize', resize)
      window.visualViewport?.removeEventListener('resize', resize)
      removeEventListener('keydown', key)
    }
  }, [onClose])

  const fit = naturalSize ? Math.min((viewportSize.width - 40) / naturalSize.width, (viewportSize.height - 98) / naturalSize.height, 1) : 1
  const displayWidth = naturalSize ? Math.round(naturalSize.width * fit * scale) : undefined
  const displayHeight = naturalSize ? Math.round(naturalSize.height * fit * scale) : undefined

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    const previousScale = previousScaleRef.current
    if (!viewport || previousScale === scale) return
    const ratio = scale / previousScale
    const centerX = viewport.scrollLeft + viewport.clientWidth / 2
    const centerY = viewport.scrollTop + viewport.clientHeight / 2
    viewport.scrollLeft = centerX * ratio - viewport.clientWidth / 2
    viewport.scrollTop = centerY * ratio - viewport.clientHeight / 2
    previousScaleRef.current = scale
  }, [scale, displayWidth, displayHeight])

  const handleWheel = event => {
    if (!event.ctrlKey && !event.metaKey) return
    event.preventDefault()
    setScale(value => clampScale(value + (event.deltaY < 0 ? .5 : -.5)))
  }

  const startDrag = event => {
    if (scale <= 1 || event.button !== 0) return
    const viewport = viewportRef.current
    dragRef.current = { active: true, x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop }
    viewport.classList.add('is-dragging')
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const moveDrag = event => {
    if (!dragRef.current.active) return
    const viewport = viewportRef.current
    viewport.scrollLeft = dragRef.current.left - (event.clientX - dragRef.current.x)
    viewport.scrollTop = dragRef.current.top - (event.clientY - dragRef.current.y)
  }

  const endDrag = event => {
    if (!dragRef.current.active) return
    dragRef.current.active = false
    viewportRef.current?.classList.remove('is-dragging')
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }

  return <div className="lightbox" role="dialog" aria-modal="true" aria-label="项目大图预览" ref={dialogRef} tabIndex="-1">
    <div className="lightbox__toolbar" aria-label="图片缩放控制">
      <button type="button" onClick={() => setScale(value => clampScale(value - .5))} disabled={scale === 1} aria-label="缩小图片">−</button>
      <button type="button" className="lightbox__scale" onClick={() => setScale(1)} aria-label="恢复适应屏幕比例">{Math.round(scale * 100)}%</button>
      <button type="button" onClick={() => setScale(value => clampScale(value + .5))} disabled={scale >= LIGHTBOX_MAX_SCALE} aria-label="放大图片">＋</button>
      <span className="lightbox__hint">拖拽移动 · Ctrl/⌘ + 滚轮缩放</span>
      <button type="button" className="lightbox__close" onClick={onClose} aria-label="关闭大图">×</button>
    </div>
    <div className="lightbox__viewport" ref={viewportRef} data-zoomed={scale > 1 ? 'true' : 'false'} onWheel={handleWheel} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}>
      <div className="lightbox__canvas" style={{ width: displayWidth ? `${displayWidth + 40}px` : '100%', height: displayHeight ? `${displayHeight + 40}px` : '100%' }}>
        <img src={src} alt="项目大图" draggable="false" width={displayWidth} height={displayHeight} onLoad={event => setNaturalSize({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })} />
      </div>
    </div>
  </div>
}

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

function ManifestoHero({ onNavigate }) {
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
        <p>AI 产品、复杂系统与实时媒介的体验设计师</p>
        <small>EXPERIENCE DESIGNER — AI PRODUCTS · COMPLEX SYSTEMS · INTERACTIVE MEDIA</small>
      </div>
      <h1 id="hero-title"><span>我整理复杂产品，</span><span>也制造不止发生在<span className="hero-title__mobile-break"><br/></span>屏幕里的体验。</span></h1>
      <div className="capability-map" aria-label="设计能力领域">
        {CAPABILITIES.map(([id, name, desc]) => <a href="#exhibition" onClick={event => onNavigate(event, 'exhibition')} key={id}><b>{id}</b><span>{name}</span><small>{desc}</small></a>)}
      </div>
      <a className="enter-exhibition" href="#exhibition" onClick={event => onNavigate(event, 'exhibition')}><Arrow down/><span>向下进入作品</span><small>ENTER THE EXHIBITION</small></a>
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
      <div><p>先看三次关键判断</p><h2>项目不是结果，<br/>判断才是。</h2></div>
      <p>一个 AI 产品如何被使用，一个品牌如何被理解，一条协作链路如何少走弯路。</p>
    </div>
    <div className="featured-carousel" tabIndex="0" onKeyDown={keyDown} aria-label={`精选项目，当前为 ${active.title}`}>
      <div className="featured-carousel__stage" onPointerDown={pointerDown} onPointerUp={pointerUp}>
        {projects.map((project, index) => {
          let slot = index - focus
          if (slot > 1) slot -= projects.length
          if (slot < -1) slot += projects.length
          return <button type="button" className={`featured-slide ${slot === 0 ? 'is-active' : ''}`} style={{ '--slide-x': `${slot * 78}%`, '--hover-x': `${slot * 70}%`, '--slide-scale': slot === 0 ? 1 : .72, '--slide-rotate': `${slot * 3.5}deg`, '--hover-rotate': `${slot * 2.4}deg`, '--slide-opacity': slot === 0 ? 1 : .38, '--slide-z': slot === 0 ? 3 : 1 }} key={project.id} onClick={() => { if (!dragged.current) slot === 0 ? onOpen(project) : select(index) }} aria-label={slot === 0 ? `进入项目：${project.title}` : `查看项目：${project.title}`}>
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
          <p>{PROJECT_VALUE[active.id] || active.subtitle}</p>
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
  useEffect(() => { document.body.classList.add('locked'); const key = e => e.key === 'Escape' && !document.querySelector('.lightbox') && close(); addEventListener('keydown', key); return () => { document.body.classList.remove('locked'); removeEventListener('keydown', key) } }, [close])
  if (project.id === 'hologrow-webapp') return <HologrowWebAppCase project={project} close={close} zoom={zoom} isScrolled={isScrolled} onScroll={event => setIsScrolled(event.currentTarget.scrollTop > 24)} />
  if (['hologrow-website', 'hi-link', 'todo-ai', 'bao-ai'].includes(project.id)) return <NarrativeCaseStudy project={project} close={close} zoom={zoom} isScrolled={isScrolled} onScroll={event => setIsScrolled(event.currentTarget.scrollTop > 24)} />
  const chapters = [['概览', 'case-overview'], ['关键判断', 'case-decisions']]
  if (project.gallery?.length) chapters.push(['过程与产出', 'case-gallery'])
  if (project.liveSiteUrl || project.videoUrl) chapters.push(['真实体验', 'case-links'])
  const jumpToCaseChapter = id => {
    const target = document.getElementById(id)
    const scroller = target?.closest('.case-page')
    if (!target || !scroller) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const stickyOffset = window.innerWidth <= 640 ? 108 : 126
    const top = target.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - stickyOffset
    scroller.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' })
  }
  return <div className={`case-page case-page--edited ${isScrolled ? 'is-scrolled' : ''}`} onScroll={event => setIsScrolled(event.currentTarget.scrollTop > 24)} style={{ '--bg': caseTheme.bg, '--surface': caseTheme.surface, '--lifted': caseTheme.surface, '--line': caseTheme.line, '--ink': caseTheme.ink, '--muted': caseTheme.muted, '--violet': caseTheme.accent, '--case-accent': caseTheme.accent }} role="dialog" aria-modal="true" aria-label={`${project.title} 项目详情`}>
    <nav className="case-top"><button onClick={close}>← 返回作品展</button><span>{project.category} / CASE STUDY</span></nav>
    <nav className="case-chapter-nav" aria-label={`${project.title} 案例章节`}><div className="shell">{chapters.map(([label, id], index) => <button type="button" key={id} onClick={() => jumpToCaseChapter(id)}><b>0{index + 1}</b><span>{label}</span></button>)}</div></nav>
    <header className="case-title shell"><div><p>{project.category}</p><h1>{project.title}</h1><h2>{project.subtitle}</h2></div><div className="case-chips">{project.tags.map(x => <span key={x}>{x}</span>)}</div></header>
    <button className={`case-main-image shell ${project.id === 'hologrow-website' ? 'case-main-image--contain-mobile' : ''}`} onClick={() => zoom(project.detailHeroImage)}><img src={project.detailHeroImage} alt={`${project.title} 项目展示`}/></button>
    <section className="case-logic shell"><div className="case-overview" id="case-overview"><span>PROJECT CONTEXT</span><p>{project.overview}</p></div><div className="case-decisions" id="case-decisions">{project.details.map((d, i) => <article key={d.title}><b>{String(i + 1).padStart(2, '0')}</b><h3>{d.title}</h3><p>{d.desc}</p></article>)}</div></section>
    {(project.liveSiteUrl || project.videoUrl) && <section className="case-links shell" id="case-links"><div className="case-links__intro"><span>LIVE OUTPUT</span><h2>进入真实体验</h2><p>离开静态展示，查看已经上线或可播放的项目成果。</p></div><div className="case-links__actions">{project.liveSiteUrl && <a className="case-link case-link--live" href={project.liveSiteUrl} target="_blank" rel="noreferrer"><span><small>LIVE SITE</small><strong>访问线上网站</strong></span><Arrow/></a>}{project.videoUrl && <a className="case-link" href={project.videoUrl} target="_blank" rel="noreferrer"><span><small>PROJECT FILM</small><strong>观看项目影片</strong></span><Arrow/></a>}</div></section>}
    {project.gallery?.length > 0 && <section className="case-gallery shell" id="case-gallery"><header><span>PROCESS / OUTPUT</span><h2>设计不是结果，<br/>而是一连串判断。</h2></header>{project.gallery.map((x, i) => <article key={`${x.title}-${i}`}>{x.prototypeUrl ? <div className="figma-prototype-block"><div className="figma-prototype__status"><i aria-hidden="true"/><b>LIVE PROTOTYPE</b><span>可直接交互</span></div><div className="figma-prototype" style={{ aspectRatio: x.prototypeAspectRatio || '16 / 9' }}><iframe src={cleanFigmaEmbedUrl(x.prototypeUrl)} title={`${x.title} 可交互原型`} loading="lazy" allow="fullscreen" allowFullScreen/></div></div> : <button onClick={() => zoom(x.image)}><img src={x.image} alt={x.title} loading="lazy"/></button>}<div className="case-gallery__copy"><b>{String(i + 1).padStart(2, '0')}</b><h3>{x.title}</h3><p>{x.desc}</p>{x.linkUrl && <a href={x.linkUrl} target="_blank" rel="noreferrer">访问项目 ↗</a>}</div></article>)}</section>}
  </div>
}

function ProjectRow({ project, index, onOpen }) {
  return <button type="button" className="project-row" onClick={() => onOpen(project)} aria-label={`进入项目：${project.title}`}>
    <span className="project-row__id">{String(index + 1).padStart(2, '0')}</span>
    <span className="project-row__title"><strong>{project.title}</strong><small>{project.subtitle}</small></span>
    <span className="project-row__category">{project.category}</span>
    <span className="project-row__preview"><img src={project.coverImage} alt="" loading="lazy"/></span>
    <Arrow/>
  </button>
}

function ProjectFeature({ project, onOpen, variant = 'product' }) {
  return <button type="button" className={`project-feature project-feature--${variant}`} onClick={() => onOpen(project)} aria-label={`进入项目：${project.title}`}>
    <span className="project-feature__media"><img src={project.coverImage} alt={`${project.title} 项目封面`} loading="lazy"/></span>
    <span className="project-feature__copy">
      <small>{project.category}</small>
      <strong>{project.title}</strong>
      <span>{PROJECT_VALUE[project.id] || project.overview}</span>
      <b>查看项目 <Arrow/></b>
    </span>
  </button>
}

const getUrlState = () => {
  const params = new URLSearchParams(window.location.search)
  return {
    projectId: params.get('project'),
    archiveOpen: params.get('archive') === '1',
    present: params.get('present') === '1',
  }
}

export default function Portfolio() {
  const [filter, setFilter] = useState('All')
  const [initialUrlState] = useState(() => getUrlState())
  const [active, setActive] = useState(() => PROJECT_DATA.find(project => project.id === initialUrlState.projectId) || null)
  const [archiveOpen, setArchiveOpen] = useState(initialUrlState.archiveOpen)
  const [present, setPresent] = useState(initialUrlState.present)
  const [zoom, setZoom] = useState(null)
  const [copied, setCopied] = useState(false)
  const featured = FEATURED_IDS.map(id => PROJECT_DATA.find(x => x.id === id)).filter(Boolean)
  const productWork = PRODUCT_IDS.map(id => PROJECT_DATA.find(x => x.id === id)).filter(Boolean)
  const experiments = EXPERIMENT_IDS.map(id => PROJECT_DATA.find(x => x.id === id)).filter(Boolean)
  const archive = useMemo(() => PROJECT_DATA.filter(project => !DEFAULT_VISIBLE_IDS.includes(project.id)), [])
  const archiveProjects = useMemo(() => filter === 'All' ? archive : archive.filter(project => project.category === filter), [archive, filter])
  const restoreY = useRef(Number(window.history.state?.portfolioScrollY) || 0)
  const projectOpenRef = useRef(Boolean(initialUrlState.projectId))
  const copy = async () => { try { await navigator.clipboard.writeText('xinyuchen1124@163.com'); setCopied(true); setTimeout(() => setCopied(false), 1600) } catch { window.location.href = 'mailto:xinyuchen1124@163.com' } }

  const scrollToAnchor = (targetId, behavior = 'smooth') => {
    const target = document.getElementById(targetId)
    if (!target) return false
    target.scrollIntoView({ behavior, block: 'start' })
    return true
  }

  const navigateToAnchor = (event, targetId) => {
    event?.preventDefault()
    const url = new URL(window.location.href)
    url.hash = targetId
    window.history.pushState({ ...window.history.state, portfolioAnchor: targetId }, '', `${url.pathname}${url.search}${url.hash}`)
    scrollToAnchor(targetId, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth')
  }

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    const syncFromUrl = () => {
      const next = getUrlState()
      const nextProject = PROJECT_DATA.find(project => project.id === next.projectId) || null
      const wasProjectOpen = projectOpenRef.current
      projectOpenRef.current = Boolean(nextProject)
      setActive(nextProject)
      setArchiveOpen(next.archiveOpen)
      setPresent(next.present)
      setZoom(null)
      if (!nextProject) requestAnimationFrame(() => {
        if (wasProjectOpen) {
          window.scrollTo({ top: restoreY.current, behavior: 'auto' })
          return
        }
        const targetId = window.location.hash.slice(1)
        if (!targetId || !scrollToAnchor(targetId, 'auto')) window.scrollTo({ top: Number(window.history.state?.portfolioScrollY) || restoreY.current, behavior: 'auto' })
      })
    }
    addEventListener('popstate', syncFromUrl)
    return () => {
      window.history.scrollRestoration = previousScrollRestoration
      removeEventListener('popstate', syncFromUrl)
    }
  }, [])

  useEffect(() => {
    if (active || !window.location.hash) return
    const targetId = window.location.hash.slice(1)
    let timeoutId
    const syncAnchor = () => requestAnimationFrame(() => requestAnimationFrame(() => scrollToAnchor(targetId, 'auto')))
    syncAnchor()
    timeoutId = window.setTimeout(syncAnchor, 320)
    document.fonts?.ready.then(syncAnchor)
    addEventListener('load', syncAnchor, { once: true })
    return () => {
      window.clearTimeout(timeoutId)
      removeEventListener('load', syncAnchor)
    }
  }, [active])

  const writeUrlState = ({ projectId, nextArchiveOpen = archiveOpen, replace = false }) => {
    const url = new URL(window.location.href)
    if (projectId) url.searchParams.set('project', projectId)
    else url.searchParams.delete('project')
    if (nextArchiveOpen) url.searchParams.set('archive', '1')
    else url.searchParams.delete('archive')
    const state = { ...window.history.state, portfolioScrollY: restoreY.current, portfolioProject: projectId || null, portfolioArchive: nextArchiveOpen }
    window.history[replace ? 'replaceState' : 'pushState'](state, '', `${url.pathname}${url.search}${url.hash}`)
  }

  const openProject = project => {
    restoreY.current = window.scrollY
    projectOpenRef.current = true
    writeUrlState({ projectId: project.id })
    setActive(project)
    setZoom(null)
  }

  const closeProject = () => {
    if (window.history.state?.portfolioProject) {
      window.history.back()
      return
    }
    writeUrlState({ projectId: null, replace: true })
    projectOpenRef.current = false
    setActive(null)
    setZoom(null)
    requestAnimationFrame(() => window.scrollTo({ top: restoreY.current, behavior: 'auto' }))
  }

  const toggleArchive = () => {
    const next = !archiveOpen
    restoreY.current = window.scrollY
    writeUrlState({ projectId: null, nextArchiveOpen: next })
    setArchiveOpen(next)
  }

  if (active) return <><ProjectDetail project={active} close={closeProject} zoom={setZoom}/>{zoom && <ImageLightbox src={zoom} onClose={() => setZoom(null)} />}</>

  return <div className={`portfolio ${present ? 'portfolio--present' : ''}`} data-presentation-mode={present || undefined}>
    <nav className="nav shell" aria-label="主导航">
      <a className="wordmark" href="#top" onClick={event => navigateToAnchor(event, 'top')}>陈馨语 <span>/ XINYU CHEN</span></a>
      <div className="nav-links"><a href="#exhibition" onClick={event => navigateToAnchor(event, 'exhibition')}>作品</a><a href="#experience" onClick={event => navigateToAnchor(event, 'experience')}>经历</a><a href="#about" onClick={event => navigateToAnchor(event, 'about')}>关于</a><a href="/陈馨语-体验设计师-简历.pdf" target="_blank">简历 / RESUME</a></div>
      <button onClick={copy}>{copied ? '邮箱已复制' : '联系'}</button>
    </nav>
    <main id="top">
      <ManifestoHero onNavigate={navigateToAnchor}/>
      <FeaturedExhibition projects={featured} onOpen={openProject}/>
      <section className="work-index shell" id="projects">
        <header><div><p>换一个场景，继续做判断</p><h2><span>配置、生成、比较——</span><span>让下一步始终清楚。</span></h2></div><p>从企业协作到消费创作与商业评测，我处理的不是页面类型，而是用户在哪一步停住、犹豫或失去方向。</p></header>
        <div className="product-work-grid">{productWork.map(project => <ProjectFeature key={project.id} project={project} onOpen={openProject}/>)}</div>
        <section className="experiments" aria-labelledby="experiments-title"><header><div><p>屏幕之外</p><h2 id="experiments-title">让数据、声音与空间<br/>真正发生关系。</h2></div><p>一个把学生轨迹变成粒子校门，一个把植物生物电变成实时声画。交互不只属于界面。</p></header><div className="experiment-grid">{experiments.map(project => <ProjectFeature key={project.id} project={project} onOpen={openProject} variant="experiment"/>)}</div></section>
        <section className={`archive ${archiveOpen ? 'is-open' : ''}`} aria-labelledby="archive-title">
          <button className="archive-toggle" onClick={toggleArchive} aria-expanded={archiveOpen} aria-controls="archive-projects"><span><small>PROJECT ARCHIVE</small><strong id="archive-title">更多项目档案</strong></span><span>{archive.length} 个未展示项目</span><b>{archiveOpen ? '收起' : '展开'} <Arrow/></b></button>
          {archiveOpen && <div id="archive-projects" className="archive-content"><div className="filters" role="group" aria-label="项目档案分类">{FILTERS.map(x => <button className={filter === x ? 'active' : ''} aria-pressed={filter === x} key={x} onClick={() => setFilter(x)}>{x === 'All' ? '全部档案' : x}</button>)}</div>{archiveProjects.length ? <div className="project-index-list">{archiveProjects.map((project, index) => <ProjectRow key={project.id} project={project} index={index} onOpen={openProject}/>)}</div> : <p className="archive-empty">该分类暂无未展示项目。</p>}</div>}
        </section>
      </section>
      <section className="experience shell" id="experience">
        <header><p>这些判断在哪里变成真实产品</p><h2>设计要在约束里成立，<br/>也要在交付后继续成立。</h2></header>
        <div className="experience-list"><article><time>2026.05 — NOW</time><div><h3>虹影生长 Hologrow</h3><p>UI/UX 设计师</p></div><p>负责主营 WebApp 与品牌官网的全链路 UI/UX，建立面向 AI 产品的体验规则与组件体系；以 Vibecoding 推进设计到前端落地，并延展品牌 VI 与多媒体资产。</p></article><article><time>2025.09 — 2026.05</time><div><h3>小红书 RED</h3><p>B 端体验设计实习生</p></div><p>参与自研协作产品 Hi 的全链路设计，覆盖 Dark Mode、设计系统、AI 复杂交互与审批体验；在业务判断、体验策略和研发落地之间建立连接。</p></article></div>
      </section>
      <section className="about shell" id="about">
        <div className="about-statement"><p>为什么这些项目会同时出现</p><h2>我换过媒介，<br/>没换过问题。</h2><blockquote>人怎样读懂一个系统，<br/>又怎样被它触动？</blockquote></div>
        <div className="practice-path"><article><b>空间与叙事</b><p>最早我从声音、动线和场景开始理解体验——屏幕之外，人仍然在读信息。</p></article><article><b>交互与系统</b><p>后来进入 B 端与 AI 产品：面对角色、状态和例外，设计必须让下一步清楚。</p></article><article><b>实时与跨媒介</b><p>游戏引擎、传感器和创意编程，让反馈不只被看见，也能被听见和触发。</p></article></div>
      </section>
      <section className="contact shell" id="contact"><p>如果你也在整理一个复杂问题，<br/>我们可以从具体处聊起。</p><button onClick={copy}>{copied ? '邮箱已复制' : '聊一个具体问题'}<Arrow/></button><footer><b>xinyuchen1124@163.com</b><span>© 2026 XINYU CHEN</span></footer></section>
    </main>
    {!present && <AIChatWidget/>}
  </div>
}
