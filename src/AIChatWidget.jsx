import { useEffect, useRef, useState } from 'react'

const WELCOME = '你好，我是馨语作品集的 AI 导览。你可以问我她的经历、重点项目、设计方法，或为什么她适合复杂产品与 AI 体验设计。'
const SUGGESTIONS = ['她是什么类型的设计师？', '最值得先看哪个项目？', '她有哪些 AI 产品经验？']

function InlineMarkdown({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^)]+\))/g)
  return <>{parts.map((part, index) => {
    const bold = part.match(/^\*\*(.+)\*\*$/)
    if (bold) return <strong key={index}>{bold[1]}</strong>
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/)
    if (link) return <a href={link[2]} target="_blank" rel="noreferrer" key={index}>{link[1]}</a>
    return part
  })}</>
}

function MessageText({ text }) {
  const blocks = []
  let list = null
  const flushList = () => { if (list) { blocks.push(list); list = null } }

  text.split('\n').forEach((rawLine, index) => {
    const line = rawLine.trim()
    const ordered = line.match(/^(\d+)[.)、]\s*(.+)$/)
    const unordered = line.match(/^[-•]\s+(.+)$/)
    if (ordered || unordered) {
      const type = ordered ? 'ol' : 'ul'
      if (!list || list.type !== type) { flushList(); list = { type, items: [] } }
      list.items.push(ordered ? ordered[2] : unordered[1])
      return
    }
    flushList()
    if (line) blocks.push({ type: 'p', text: line, key: index })
  })
  flushList()

  return <div className="ai-markdown">{blocks.map((block, index) => {
    if (block.type === 'ol') return <ol key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}><InlineMarkdown text={item}/></li>)}</ol>
    if (block.type === 'ul') return <ul key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}><InlineMarkdown text={item}/></li>)}</ul>
    return <p key={block.key ?? index}><InlineMarkdown text={block.text}/></p>
  })}</div>
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: 'model', text: WELCOME }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 260) }, [open])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [messages, loading])
  useEffect(() => {
    const close = event => event.key === 'Escape' && setOpen(false)
    addEventListener('keydown', close)
    return () => removeEventListener('keydown', close)
  }, [])

  const send = async (value = input) => {
    const message = value.trim()
    if (!message || loading) return
    const history = messages.slice(1)
    setMessages(current => [...current, { role: 'user', text: message }])
    setInput('')
    setError('')
    setLoading(true)
    try {
      const result = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
      })
      const data = await result.json()
      if (!result.ok) throw new Error(data.error || '请求失败')
      setMessages(current => [...current, { role: 'model', text: data.text }])
    } catch {
      setError('AI 导览暂时没有连接成功。你也可以直接邮件联系馨语。')
    } finally {
      setLoading(false)
    }
  }

  return <aside className={`ai-guide ${open ? 'is-open' : ''}`} aria-label="作品集 AI 导览">
    <section className="ai-guide__panel" aria-hidden={!open}>
      <header className="ai-guide__header">
        <div><span className="ai-guide__signal"><i/>AI GUIDE</span><strong>问问馨语的数字分身</strong></div>
        <button onClick={() => setOpen(false)} aria-label="关闭 AI 导览">×</button>
      </header>
      <div className="ai-guide__messages" aria-live="polite">
        {messages.map((message, index) => <div className={`ai-message ai-message--${message.role}`} key={`${message.role}-${index}`}><MessageText text={message.text}/></div>)}
        {messages.length === 1 && <div className="ai-suggestions">{SUGGESTIONS.map(text => <button key={text} onClick={() => send(text)}>{text}<span>↗</span></button>)}</div>}
        {loading && <div className="ai-thinking"><i/><i/><i/><span>正在整理答案</span></div>}
        {error && <p className="ai-guide__error">{error} <a href="mailto:xinyuchen1124@163.com">发送邮件</a></p>}
        <div ref={endRef}/>
      </div>
      <form className="ai-guide__composer" onSubmit={event => { event.preventDefault(); send() }}>
        <label htmlFor="ai-question">输入你的问题</label>
        <textarea id="ai-question" ref={inputRef} value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send() } }} placeholder="问经历、项目或设计方法…" rows="2" maxLength="2000" spellCheck="false" data-gramm="false" data-gramm_editor="false" data-enable-grammarly="false"/>
        <button type="submit" disabled={!input.trim() || loading} aria-label="发送问题">↑</button>
      </form>
      <footer>Powered by Gemini · 回答仅基于作品集信息</footer>
    </section>
    <button className="ai-guide__trigger" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-label={open ? '关闭 AI 导览' : '打开 AI 导览'}>
      <span className="ai-guide__trigger-mark"><i/><b>AI</b></span>
      <span><strong>问问我的数字分身</strong><small>PROJECTS · EXPERIENCE · METHODS</small></span>
      <em>{open ? '×' : '↗'}</em>
    </button>
  </aside>
}
