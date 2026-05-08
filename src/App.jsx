import React, { useState, useEffect } from 'react';

// --- 3D 液态毛玻璃卡片组件 ---
const GlassCard = ({ children, className = "", style = {}, onClick, isClickable = false }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setOpacity(0);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      onClick={onClick}
      data-clickable={isClickable}
      className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-3xl transition-all duration-300 ease-out group ${className}`}
      style={{
        boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.1), inset 0 -1px 1px rgba(255, 255, 255, 0.05)',
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1, 1, 1)`,
        transformStyle: 'preserve-3d',
        ...style
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.08), transparent 40%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 h-full" style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </div>
  );
};

// --- 画廊子组件 ---
const GalleryItem = ({ item, idx, setZoomedImage }) => {
  const isImageLeft = idx % 2 === 0;
  const [reloadKey, setReloadKey] = useState(0);
  const [isReloading, setIsReloading] = useState(false);

  const handleReload = (e) => {
    e.stopPropagation();
    setIsReloading(true);
    setReloadKey(prev => prev + 1); 
    setTimeout(() => setIsReloading(false), 1000); 
  };

  return (
    <div className={`flex flex-col md:flex-row items-center gap-12 lg:gap-24 ${!isImageLeft ? 'md:flex-row-reverse' : ''}`}>
      
      {/* 图片/原型展示区 */}
      <div 
        className="w-full md:w-3/5 rounded-[2rem] bg-[#0a0a0a] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group flex items-center justify-center"
        style={item.prototypeAspectRatio ? { aspectRatio: item.prototypeAspectRatio } : {}}
      >
        <img 
          src={item.image} 
          alt={item.title} 
          onClick={() => !item.prototypeUrl && setZoomedImage(item.image)}
          className={`block z-10 transition-all duration-500 ease-in-out ${
            item.prototypeAspectRatio 
              ? 'absolute inset-0 w-full h-full object-cover rounded-[2rem]' 
              : 'w-full h-auto rounded-[2rem]'
          } ${
            item.prototypeUrl 
              ? 'opacity-0 pointer-events-none' 
              : 'opacity-100 cursor-zoom-in hover:scale-[1.02]'
          }`} 
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        
        {item.prototypeUrl && (
          <iframe
            key={reloadKey}
            src={item.prototypeUrl}
            className={`border-0 z-20 opacity-100 ${
              item.isMobilePrototype 
                ? 'absolute top-0 h-full aspect-[375/812] bg-transparent' 
                : 'absolute inset-0 w-full h-full bg-[#111]'
            }`}
            style={item.isMobilePrototype ? { left: '50%', transform: 'translateX(-50%)' } : {}}
            allowFullScreen
            scrolling="yes"
          />
        )}
        
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2rem] pointer-events-none z-30" />
        
        {item.prototypeUrl && (
          <div className="absolute top-4 left-4 z-40 flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-full border border-green-500/20 bg-green-500/10 flex items-center gap-2 pointer-events-none animate-in fade-in duration-500">
              <span className="w-2 h-2 rounded-full bg-green-400/80 animate-pulse" />
              <span className="text-[10px] text-green-300/80 font-mono tracking-wider font-bold">
                LIVE WEB
              </span>
            </div>

            <button
              onClick={handleReload}
              data-clickable="true"
              className="px-3 py-1.5 rounded-full border border-white/20 bg-black/50 text-white/70 hover:text-white hover:bg-black/80 hover:border-white/50 flex items-center gap-1.5 transition-all shadow-lg opacity-0 group-hover:opacity-100"
              title="重新加载原型"
            >
              <svg className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin text-cyan-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-[10px] font-mono tracking-wider font-bold mt-[1px]">RELOAD</span>
            </button>
          </div>
        )}
      </div>

      <div className="w-full md:w-2/5 flex flex-col">
         <div className="text-6xl font-black text-white/5 mb-4 font-mono select-none">
            {String(idx + 1).padStart(2, '0')}
         </div>
         <h3 className="text-3xl font-bold text-white mb-6 leading-snug">
            {item.title}
         </h3>
         <p className="text-lg text-white/60 leading-relaxed font-light">
            {item.desc}
         </p>
         {/* 外跳链接展示 */}
         {item.linkUrl && (
           <a 
             href={item.linkUrl} 
             target="_blank" 
             rel="noreferrer"
             data-clickable="true"
             className="mt-6 inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-mono text-sm tracking-widest transition-colors w-fit border-b border-cyan-400/30 hover:border-cyan-300 pb-1"
           >
             Visit Live Site
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
           </a>
         )}
      </div>

    </div>
  );
};

// --- 项目分类与数据源 (共12个项目) ---
const CATEGORIES = ['All', 'UX/UI & Web', 'Game Design', 'Digital Media', 'Spatial Design'];

// 使用 Tailwind 安全的颜色配置，防止被打包清除
const THEME = {
  cyan: { text: 'text-cyan-400', hoverText: 'group-hover:text-cyan-400', badge: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400' },
  purple: { text: 'text-purple-400', hoverText: 'group-hover:text-purple-400', badge: 'border-purple-500/40 bg-purple-500/10 text-purple-400' },
  blue: { text: 'text-blue-400', hoverText: 'group-hover:text-blue-400', badge: 'border-blue-500/40 bg-blue-500/10 text-blue-400' },
  orange: { text: 'text-orange-400', hoverText: 'group-hover:text-orange-400', badge: 'border-orange-500/40 bg-orange-500/10 text-orange-400' },
  green: { text: 'text-green-400', hoverText: 'group-hover:text-green-400', badge: 'border-green-500/40 bg-green-500/10 text-green-400' },
  pink: { text: 'text-pink-400', hoverText: 'group-hover:text-pink-400', badge: 'border-pink-500/40 bg-pink-500/10 text-pink-400' },
  yellow: { text: 'text-yellow-400', hoverText: 'group-hover:text-yellow-400', badge: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400' },
  emerald: { text: 'text-emerald-400', hoverText: 'group-hover:text-emerald-400', badge: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' }
};

// 全新的动态卡片按钮霓虹主题系统
const BTN_THEMES = {
  cyan: {
    border: 'hover:border-cyan-500/40',
    cardShadow: 'hover:shadow-[0_0_50px_rgba(34,211,238,0.15)]',
    bgRadial: 'bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08)_0%,transparent_60%)]',
    bgConic: 'bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,rgba(34,211,238,0.15)_25%,rgba(20,184,166,0.15)_50%,transparent_100%)]',
    textGradient: 'group-hover:from-cyan-400 group-hover:via-teal-400 group-hover:to-emerald-500',
    btnGradient: 'from-cyan-400 via-teal-400 to-emerald-500',
    btnShadow: 'hover:shadow-[0_0_60px_rgba(34,211,238,0.5)]',
    tagBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
    tagDot: 'bg-cyan-400',
    tagPing: 'bg-cyan-500'
  },
  purple: {
    border: 'hover:border-purple-500/40',
    cardShadow: 'hover:shadow-[0_0_50px_rgba(168,85,247,0.15)]',
    bgRadial: 'bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.08)_0%,transparent_60%)]',
    bgConic: 'bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,rgba(168,85,247,0.15)_25%,rgba(99,102,241,0.15)_50%,transparent_100%)]',
    textGradient: 'group-hover:from-purple-400 group-hover:via-fuchsia-400 group-hover:to-indigo-500',
    btnGradient: 'from-purple-400 via-fuchsia-400 to-indigo-500',
    btnShadow: 'hover:shadow-[0_0_60px_rgba(168,85,247,0.5)]',
    tagBg: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
    tagDot: 'bg-purple-400',
    tagPing: 'bg-purple-500'
  },
  red: {
    border: 'hover:border-red-500/40',
    cardShadow: 'hover:shadow-[0_0_50px_rgba(239,68,68,0.15)]',
    bgRadial: 'bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.08)_0%,transparent_60%)]',
    bgConic: 'bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,rgba(239,68,68,0.15)_25%,rgba(244,63,94,0.15)_50%,transparent_100%)]',
    textGradient: 'group-hover:from-red-400 group-hover:via-rose-400 group-hover:to-orange-500',
    btnGradient: 'from-red-400 via-rose-400 to-orange-500',
    btnShadow: 'hover:shadow-[0_0_60px_rgba(239,68,68,0.5)]',
    tagBg: 'bg-red-500/10 border-red-500/30 text-red-300',
    tagDot: 'bg-red-400',
    tagPing: 'bg-red-500'
  },
  fuchsia: {
    border: 'hover:border-fuchsia-500/40',
    cardShadow: 'hover:shadow-[0_0_50px_rgba(217,70,239,0.15)]',
    bgRadial: 'bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.08)_0%,transparent_60%)]',
    bgConic: 'bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,rgba(217,70,239,0.15)_25%,rgba(244,63,94,0.15)_50%,transparent_100%)]',
    textGradient: 'group-hover:from-fuchsia-400 group-hover:via-rose-400 group-hover:to-pink-500',
    btnGradient: 'from-fuchsia-400 via-rose-400 to-pink-500',
    btnShadow: 'hover:shadow-[0_0_60px_rgba(217,70,239,0.5)]',
    tagBg: 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-300',
    tagDot: 'bg-fuchsia-400',
    tagPing: 'bg-fuchsia-500'
  },
  blue: {
    border: 'hover:border-blue-500/40',
    cardShadow: 'hover:shadow-[0_0_50px_rgba(59,130,246,0.15)]',
    bgRadial: 'bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_60%)]',
    bgConic: 'bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,rgba(59,130,246,0.15)_25%,rgba(6,182,212,0.15)_50%,transparent_100%)]',
    textGradient: 'group-hover:from-blue-400 group-hover:via-cyan-400 group-hover:to-indigo-500',
    btnGradient: 'from-blue-400 via-cyan-400 to-indigo-500',
    btnShadow: 'hover:shadow-[0_0_60px_rgba(59,130,246,0.5)]',
    tagBg: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    tagDot: 'bg-blue-400',
    tagPing: 'bg-blue-500'
  },
  green: {
    border: 'hover:border-green-500/40',
    cardShadow: 'hover:shadow-[0_0_50px_rgba(34,197,94,0.15)]',
    bgRadial: 'bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.08)_0%,transparent_60%)]',
    bgConic: 'bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,rgba(34,197,94,0.15)_25%,rgba(16,185,129,0.15)_50%,transparent_100%)]',
    textGradient: 'group-hover:from-green-400 group-hover:via-emerald-400 group-hover:to-teal-500',
    btnGradient: 'from-green-400 via-emerald-400 to-teal-500',
    btnShadow: 'hover:shadow-[0_0_60px_rgba(34,197,94,0.5)]',
    tagBg: 'bg-green-500/10 border-green-500/30 text-green-300',
    tagDot: 'bg-green-400',
    tagPing: 'bg-green-500'
  },
  pink: {
    border: 'hover:border-pink-500/40',
    cardShadow: 'hover:shadow-[0_0_50px_rgba(236,72,153,0.15)]',
    bgRadial: 'bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.08)_0%,transparent_60%)]',
    bgConic: 'bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,rgba(236,72,153,0.15)_25%,rgba(168,85,247,0.15)_50%,transparent_100%)]',
    textGradient: 'group-hover:from-pink-400 group-hover:via-purple-400 group-hover:to-indigo-500',
    btnGradient: 'from-pink-400 via-purple-400 to-indigo-500',
    btnShadow: 'hover:shadow-[0_0_60px_rgba(236,72,153,0.5)]',
    tagBg: 'bg-pink-500/10 border-pink-500/30 text-pink-300',
    tagDot: 'bg-pink-400',
    tagPing: 'bg-pink-500'
  }
};

const PROJECT_DATA = [
  // 1. HI链接解析
  {
    id: 'hi-link',
    category: '01 / B端体验设计',
    title: 'Hi 链接解析',
    subtitle: 'IM 场景下的高效信息触达解决方案',
    tags: ['界面强关联', '实时沙箱渲染', '风险控制'],
    theme: THEME.cyan,
    btnTheme: 'cyan',
    coverImage: 'https://i.ibb.co/QvJgsncJ/Frame-50.png',
    detailHeroImage: 'https://i.ibb.co/LzcFjcqh/1.png',
    overview: '在复杂的即时通讯场景中，帮助开发者与业务方更安全、清晰、高效地触达关键信息。覆盖了沉浸式预览、视觉风险控制与全链路审批体验的状态优化。',
    details: [
      { title: '体验确定性', desc: '沉浸式预览区的确定性体验优化，消除开发者对离线配置的不确定感，实现所见即所得。' },
      { title: '视觉风险控制', desc: '职场高效决策的视觉交互风险控制设计，通过色彩与层级的强化，降低高危操作的误点击概率。' },
      { title: '状态流转清晰度', desc: '全链路审批体验的状态清晰度优化，运用动效与时间线，提升跨部门协作与审批的效率。' }
    ],
    gallery: [
      { 
        image: 'https://i.ibb.co/zHVYZh81/2-1.png', 
        title: '项目背景和当前产品现状', 
        desc: '面对日益复杂的 IM 场景，业务目标聚焦于提升信息触达效率与转化率。设计端则致力于打造所见即所得的配置体验，通过界面强关联降低用户理解成本，重塑工作流中的沉浸式阅读感受。' 
      },
      { 
        image: 'https://i.ibb.co/8LzGNR3Q/1570.png', 
        title: '用户调研', 
        desc: '通过定性访谈与可用性测试发现，核心痛点在于“配置过程如开盲盒”以及“缺少操作后的预期反馈”。竞品分析显示行业标杆普遍具备实时渲染能力。打破信息黑盒、提供明确的预期管理成为体验升级的关键切入点。' 
      },
      { 
        image: 'https://i.ibb.co/2YghgnPx/7-1.png', 
        prototypeUrl: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQxhJdQlLFarJUInYHoEZ7b%2Fxhs%25E5%25AE%259E%25E4%25B9%25A0%25E9%25A1%25B9%25E7%259B%25AE%3Fnode-id%3D0-1%26p%3Df%26t%3DPIg7PqiPma1Ifu30-0%26scaling%3Dscale-down-width%26content-scaling%3Dfixed%26starting-point-node-id%3D1%253A327839&hide-ui=1',
        prototypeAspectRatio: '1920/1549.33',
        title: '开放平台强管理视觉引导', 
        desc: '在复杂的开放平台后台，通过重构信息层级与视觉动线，强化了关键操作的引导。采用更具指向性的色彩与组件规范，降低了开发者的学习门槛，确保高频管理动作的准确性与高效性。' 
      },
      { 
        image: 'https://i.ibb.co/PZLtR2qJ/21-4.png', 
        prototypeUrl: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQxhJdQlLFarJUInYHoEZ7b%2Fxhs%25E5%25AE%259E%25E4%25B9%25A0%25E9%25A1%25B9%25E7%259B%25AE%3Fnode-id%3D0-1%26p%3Df%26t%3DPIg7PqiPma1Ifu30-0%26scaling%3Dscale-down-width%26content-scaling%3Dfixed%26starting-point-node-id%3D103%253A56731%26show-proto-sidebar%3D1&hide-ui=1',
        prototypeAspectRatio: '1920/2670.67', 
        title: '沉浸式预览区', 
        desc: '创新性地引入了“所见即所得”的沙箱渲染机制。用户在左侧进行链接解析的参数配置时，右侧可秒级呈现真实的 IM 气泡效果。这种强关联的沉浸式体验彻底消除了离线调试的盲目感。' 
      },
      { 
        image: 'https://i.ibb.co/k2yk21b2/20-1.png', 
        prototypeUrl: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQxhJdQlLFarJUInYHoEZ7b%2Fxhs%25E5%25AE%259E%25E4%25B9%25A0%25E9%25A1%25B9%25E7%259B%25AE%3Fnode-id%3D0-1%26p%3Df%26t%3DPIg7PqiPma1Ifu30-0%26scaling%3Dscale-down-width%26content-scaling%3Dfixed%26starting-point-node-id%3D106%253A65813%26show-proto-sidebar%3D1&hide-ui=1',
        prototypeAspectRatio: '1920/1200',
        title: 'PC端审批', 
        desc: '针对桌面端办公场景，深度优化了全链路审批体验。通过宽屏优势展示完整的工单信息与动态时间线，使跨部门协作的状态流转清晰可见，帮助审核人员快速定位核心风险点并高效决策。' 
      },
      { 
        image: 'https://i.ibb.co/Z6L5SS13/22-3.png', 
        prototypeUrl: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQxhJdQlLFarJUInYHoEZ7b%2Fxhs%25E5%25AE%259E%25E4%25B9%25A0%25E9%25A1%25B9%25E7%259B%25AE%3Fnode-id%3D46-26550%26p%3Df%26t%3DPIg7PqiPma1Ifu30-0%26scaling%3Dscale-down-width%26content-scaling%3Dfixed%26starting-point-node-id%3D184%253A70618&hide-ui=1',
        prototypeAspectRatio: '960/812', 
        isMobilePrototype: true,
        title: '移动端审批', 
        desc: '为满足移动办公与碎片化时间的审批诉求，将复杂的 PC 端信息进行适屏降噪。保留核心审批字段与警示状态，配合流畅的底部操作区，让管理者在手机上也能随时随地安全、便捷地完成审批闭环。' 
      }
    ]
  },
  // 2. 待办薯 AI协作
  {
    id: 'todo-ai',
    category: '02 / B端 AI 交互设计',
    title: '待办薯 AI协作',
    subtitle: 'IM场景下的智能协作效率助手',
    tags: ['Thinking动效', '模块化配置', '上下文记忆'],
    theme: THEME.purple,
    btnTheme: 'purple',
    coverImage: 'https://i.ibb.co/ksW4BhDH/Frame-51.png',
    detailHeroImage: 'https://i.ibb.co/V034xxZG/15-1.png',
    overview: '探索大语言模型在 B 端工作流中的无缝融入，降低员工的使用门槛，提升协同效率。包含拟人化状态响应与上下文连贯性设计。',
    details: [
      { title: '低门槛配置', desc: '低门槛配置的体验与实时联动优化，降低运营人员的配置与调试成本。' },
      { title: '拟人化状态', desc: 'AI响应状态拟人化及结构化阅读优化（如流式输出、打字机动效），缓解用户的等待焦虑。' },
      { title: '上下文连贯性', desc: '会话上下文的连贯性体验设计，包含防重发机制、快捷提示词流转与话题引导功能。' }
    ],
    gallery: [
      { 
        image: 'https://i.ibb.co/v2F7vkY/25.png', 
        title: '设计目标', 
        desc: '聚焦于 B 端复杂的协同场景，针对员工使用大模型门槛高、配置成本大的痛点，设定了降低操作门槛、提升人机交互温度与确保上下文连贯的核心设计目标，旨在打造无缝融入日常工作流的 AI 助手。' 
      },
      { 
        image: 'https://i.ibb.co/R4spC31q/Allin.png', 
        title: 'AI配置页', 
        desc: '将复杂的模型参数与 Prompt 编写转化为可视化的低门槛配置表单。通过清晰的信息架构与向导式设计，赋能缺乏技术背景的业务线人员也能快速搭建出符合特定工作流的专属 AI 角色。' 
      },
      { 
        image: 'https://i.ibb.co/Y4Bw1xPV/30.png', 
        prototypeUrl: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQxhJdQlLFarJUInYHoEZ7b%2Fxhs%25E5%25AE%259E%25E4%25B9%25A0%25E9%25A1%25B9%25E7%259B%25AE%3Fnode-id%3D1-2%26p%3Df%26t%3DPIg7PqiPma1Ifu30-0%26scaling%3Dscale-down-width%26content-scaling%3Dfixed%26starting-point-node-id%3D1%253A38747%26show-proto-sidebar%3D1&hide-ui=1',
        prototypeAspectRatio: '1920/1070',
        title: '发送范围弹窗', 
        desc: '针对企业级应用中敏感的权限管控需求，设计了高效的发送范围选择器。支持基于组织架构与部门群组的精细化勾选，在赋能协作的同时，确保 AI 工具的安全分发与数据隐私隔离。' 
      },
      { 
        image: 'https://i.ibb.co/bRzW7p3d/31.png', 
        prototypeUrl: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQxhJdQlLFarJUInYHoEZ7b%2Fxhs%25E5%25AE%259E%25E4%25B9%25A0%25E9%25A1%25B9%25E7%259B%25AE%3Fnode-id%3D1-2%26p%3Df%26t%3DPIg7PqiPma1Ifu30-0%26scaling%3Dscale-down-width%26content-scaling%3Dfixed%26starting-point-node-id%3D1%253A42215%26show-proto-sidebar%3D1&hide-ui=1',
        prototypeAspectRatio: '1920/1070',
        title: '输入预览实时联动', 
        desc: '构建“左配右看”的沉浸式双栏编辑体验。在左侧配置项发生的任何修改，都能在右侧沙箱中实时渲染出真实的交互效果与对话气泡，彻底打破黑盒配置，实现真正的所见即所得。' 
      },
      { 
        image: 'https://i.ibb.co/35jgc9fX/33.png', 
        prototypeUrl: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQxhJdQlLFarJUInYHoEZ7b%2Fxhs%25E5%25AE%259E%25E4%25B9%25A0%25E9%25A1%25B9%25E7%259B%25AE%3Fnode-id%3D1-2%26p%3Df%26t%3DPIg7PqiPma1Ifu30-0%26scaling%3Dscale-down-width%26content-scaling%3Dfixed%26starting-point-node-id%3D1%253A38863%26show-proto-sidebar%3D1&hide-ui=1',
        prototypeAspectRatio: '1920/1260',
        title: '快捷按钮', 
        desc: '将会话中的高频提示词封装为可视化的场景快捷指令（Shortcut）。用户无需手动输入冗长的文本，一键即可触发预设工作流，大幅降低输入成本，提升日常协同的流转效率。' 
      },
      { 
        image: 'https://i.ibb.co/8DFM0pdt/28.png', 
        prototypeUrl: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQxhJdQlLFarJUInYHoEZ7b%2Fxhs%25E5%25AE%259E%25E4%25B9%25A0%25E9%25A1%25B9%25E7%259B%25AE%3Fnode-id%3D1-2%26p%3Df%26t%3DPIg7PqiPma1Ifu30-0%26scaling%3Dscale-down-width%26content-scaling%3Dfixed%26starting-point-node-id%3D1%253A37635%26show-proto-sidebar%3D1&hide-ui=1',
        prototypeAspectRatio: '1920/1200',
        title: 'AI交互感知体验优化-Thinking', 
        desc: '在大模型响应的留白期，引入了拟人化的“思考中 (Thinking)”呼吸动效。通过透明且富有生命力的状态传递，有效缓解了用户等待结果时的焦虑感，增强了系统的可靠性感。' 
      },
      { 
        image: 'https://i.ibb.co/yBsgR7Qc/1574.png', 
        prototypeUrl: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQxhJdQlLFarJUInYHoEZ7b%2Fxhs%25E5%25AE%259E%25E4%25B9%25A0%25E9%25A1%25B9%25E7%259B%25AE%3Fnode-id%3D1-2%26p%3Df%26t%3DPIg7PqiPma1Ifu30-0%26scaling%3Dscale-down-width%26content-scaling%3Dfixed%26starting-point-node-id%3D1%253A38080%26show-proto-sidebar%3D1&hide-ui=1',
        prototypeAspectRatio: '1920/1200',
        title: '可读性优化-Markdown', 
        desc: '全面升级流式输出的文本排版规范，深度支持 Markdown 渲染。针对长文本摘要、代码块及复杂表格等结构，提供极具呼吸感的阅读排版，大幅提升核心信息的获取与提炼效率。' 
      },
      { 
        image: 'https://i.ibb.co/MWSyWTN/32.png', 
        prototypeUrl: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQxhJdQlLFarJUInYHoEZ7b%2Fxhs%25E5%25AE%259E%25E4%25B9%25A0%25E9%25A1%25B9%25E7%259B%25AE%3Fnode-id%3D1-2%26p%3Df%26t%3DPIg7PqiPma1Ifu30-0%26scaling%3Dscale-down-width%26content-scaling%3Dfixed%26starting-point-node-id%3D1%253A37685%26show-proto-sidebar%3D1&hide-ui=1',
        prototypeAspectRatio: '1920/1200',
        title: '上下文连贯', 
        desc: '深度优化多轮对话体验，强化 AI 对会话上下文的记忆与智能追问引导。配合防重发与输入框状态锁定机制，确保用户在处理复杂连贯任务时，获得如真人协作般丝滑流畅的体验。' 
      }
    ]
  },
  // 3. 包的AI 小程序
  {
    id: 'bao-ai',
    category: '03 / C端应用设计',
    title: '包的AI 小程序',
    subtitle: '让图像创作更轻松，更愉快的被分享',
    tags: ['视觉重塑', '一键做同款', '增长留存'],
    theme: THEME.blue,
    btnTheme: 'blue',
    coverImage: 'https://i.ibb.co/KcWNvTYW/Frame-52.png',
    detailHeroImage: 'https://i.ibb.co/3YcsYmWt/1.png',
    overview: '一款面向 C 端年轻用户的 AI 图像创作应用，旨在打造极简的生成流程与高转化的社交分享闭环。',
    details: [
      { title: '信息降噪', desc: '首页改版重构与信息降噪，采用瀑布流与大画幅封面，提升屏效与用户的浏览沉浸感。' },
      { title: '创作易用性', desc: '一键"做同款"全链路易用性提升，将原本繁杂的 prompt 调试简化为可视化滑动操作，降低创作门槛。' },
      { title: '裂变转化', desc: '创作者资产体系与分享转化机制设计，缩短社交平台分享路径，提升产品的自发传播率。' }
    ],
    gallery: [
      { image: 'https://i.ibb.co/CK3R7xj6/image.png', title: '项目介绍', desc: '基于年轻用户群体强烈的个性化表达与社交分享诉求，通过深度用户调研发现，目前市面上的AI生图工具普遍存在上手门槛高、参数难懂的痛点。本项目旨在打造一款“零门槛”的AI图像创作工具。' }, 
      { image: 'https://i.ibb.co/4n99mrmv/image.png', title: '现状', desc: '通过对竞品的横向剖析，发现大多数工具侧重于“极客式”的Prompt调试，而忽略了普通用户的轻量化需求。因此，核心设计目标定为：信息降噪、极简创作流以及构建高转化的社交裂变闭环。' }, 
      { image: 'https://i.ibb.co/gFwzYBNR/image.png', title: '首页', desc: '首页采用大画幅瀑布流布局，弱化繁杂的文字与工具栏干扰，让高质量的AI生成图像成为视觉核心，大幅提升用户的浏览沉浸感与创作欲望。' }, 
      { image: 'https://i.ibb.co/mCf1g8pQ/image.png', title: '详情页', desc: '在图像详情页中，将生成该图像的核心元素进行模块化展示。通过清晰的信息层级与显眼的“一键做同款”按钮，有效缩短用户从欣赏到创作的转化路径。' }, 
      { image: 'https://i.ibb.co/4g99QryK/image.png', title: '信息录入形式', desc: '颠覆传统的代码式Prompt输入，将复杂的提示词与风格参数转化为滑动条、标签选择等可视化UI组件。极大降低了AI工具的操作门槛，让非专业用户也能轻松上手。' }, 
      { image: 'https://i.ibb.co/9kvvRYff/image.png', title: '进度管理', desc: '在AI生图的等待期，设计了趣味化的加载动效与进度可视化面板。通过清晰的状态感知与拟人化的文案反馈，有效缓解用户等待焦虑，提升整体体验的流畅度。' }, 
      { image: 'https://i.ibb.co/LztHzTz0/1.png', title: '分享路径', desc: '重塑社交分享链路，生成极具视觉冲击力的精美海报与专属二维码。将分享动作无缝嵌入到创作完成的核心节点，利用用户的炫耀心理，实现产品在社交平台的自发裂变。' }, 
      { image: 'https://i.ibb.co/B51rzXbg/2-1.png', title: '创作者管理体系', desc: '建立完善的创作者资产体系，用户可以在个人主页清晰地管理已生成的图像与收藏的灵感。通过数据面板的可视化，赋予创作者成就感，提升产品的长期留存率。' }, 
      { image: 'https://i.ibb.co/5WwMXG0G/image.png', title: '会员感知', desc: '在免费体验与高级功能之间建立平滑的过渡。通过精美的特权图标、专属的高级风格滤镜以及柔和的引导弹窗，在不影响基础体验的前提下，提升会员用户的尊享感与转化率。' }, 
      { image: 'https://i.ibb.co/PsVQ0xV2/image.png', title: '品牌塑造', desc: '结合目标受众的审美偏好，提炼出年轻、前卫且富有科技感的品牌视觉语言。通过全局一致的色彩系统、圆角规范与微动效，塑造出独特且极具辨识度的产品DNA。' }  
    ]
  },
  // 4. Catlaxy
  {
    id: 'catlaxy',
    category: 'UX/UI & Web',
    title: 'Catlaxy',
    subtitle: '关注“我的猫”的宠物健康结构化学习路径',
    tags: ['模块化学习', '反馈闭环', '降低门槛', 'Web Design'],
    theme: THEME.purple,
    btnTheme: 'purple',
    coverImage: 'https://i.ibb.co/QjhxxgW6/Frame-53.png',
    detailHeroImage: 'https://i.ibb.co/kVgYqtSY/20250502171011.png',
    overview: '在真实的养猫过程中，许多宠物主人并不缺乏信息渠道，而是缺乏结构清晰、能够与自己猫咪情况对应的解决方案。本项目旨在构建一套围绕猫咪状态展开的模块化学习路径，通过“信息录入→内容吸收→反馈验证”的闭环体验，提升学习效率与参与动机。',
    details: [
      { title: '业务理解与问题聚焦', desc: '通过调研发现痛点在于“信息混乱、没有引导、缺乏参与感”。针对此，设计了降低初学者信息筛选负担、以猫咪状态为起点的强关联模块化分步体验。' },
      { title: '互动与反馈机制设计', desc: '设计“输入猫咪信息 -> 获得专属建议 -> 学习模块 -> 测试反馈”的用户流。通过测验机制，帮助用户形成知识记忆并检验掌握情况。' }
    ],
    gallery: [
      { image: 'https://i.ibb.co/sv3WB1x0/4-1.png', title: '信息架构与用户流', desc: '清晰定义了从信息录入、专属结果建议、模块化学习到测试反馈的全链路流程，确保用户不迷失。' },
      { image: 'https://i.ibb.co/Df9k4Yfg/3-1-1.png', title: '核心页面交互展示', desc: '通过直观的状态卡片、趣味性的交互组件与进度引导，极大地降低了新手学习过程中的认知门槛。' },
      { image: 'https://i.ibb.co/HL4pgqt1/1-577-1.png', title: '视觉风格与手绘元素', desc: '大量采用亲和力极强的手绘风格插画，建立品牌温度，有效缓解学习枯燥感，增强与用户的共情。' },
      { image: 'https://i.ibb.co/d0GXZZ0M/2-1-2.png', title: '猫咪状态反馈机制', desc: '结合不同学习模块的完成度，设计了猫咪不同状态的视觉反馈，提升了用户的参与感与成就感。' }
    ]
  },
  // 5. Lotus Echoes
  {
    id: 'lotus-echoes',
    category: 'Game Design',
    title: 'Lotus Echoes',
    subtitle: '基于个人记忆构建的第一人称沉浸式体验',
    tags: ['第一人称', '情绪叙事', '互动解谜'],
    theme: THEME.emerald,
    btnTheme: 'cyan',
    coverImage: 'https://i.ibb.co/KptR7T2m/Frame-54.png',
    detailHeroImage: 'https://i.ibb.co/DfbfvcsW/8.jpg',
    videoUrl: 'https://www.youtube.com/embed/z_pD_47LzsQ',
    overview: '创作灵感源于童年湖边采莲的场景。项目通过构建一个抽象虚构的“莲塘空间”，引导用户在互动中体验“时间流动”与“情感的消逝”。玩家以第一视角进入虚拟空间，通过采莲动作与环境互动，逐步唤醒关于亲人与失去的情绪感知。',
    details: [
      { title: '空间记忆与光影推进', desc: '光不仅用于导览，更用于组织时间感与情绪感。从清晨初入的明亮，到午后采摘的温暖，最终到黄昏暗光的回望阶段，光影变化与情绪流线完美契合。' },
      { title: '碎片叙事交互系统', desc: '每一次采摘莲蓬的互动都会唤醒一段碎片记忆，随着莲子被放入篮中，光效变暗，完整展现成长与离散的线性情感。' }
    ],
    gallery: [
      { image: 'https://i.ibb.co/mCpGT3cD/7-1.png', title: '故事版与核心叙事', desc: '采莲行为路径逻辑图和记忆碎片叙事图。通过将玩家行为与记忆唤醒深度绑定，构建出完整且感人的情感故事版。' },
      { image: 'https://i.ibb.co/pvZFZx1X/5-2.png', title: '交互逻辑设计', desc: '清晰梳理了玩家在空间中的探索闭环与反馈机制，将抽象的思念情绪转化为具象的寻找、采摘与收集等交互行为。' },
      { image: 'https://i.ibb.co/CsQSN7BW/6-1.png', title: '光影机制系统', desc: '光不仅用于场景物理空间的导览，更是组织时间和情绪的核心线索。随着交互的深入，光影逐渐变暗，与情感的流逝完美契合。' },
      { image: 'https://i.ibb.co/p6B7LtfJ/5-1.png', title: '场景关键帧', desc: '展示游戏内核心场景的视觉状态演变，呈现出第一人称视角下充满迷雾感与未知感的沉浸式探索体验。' },
      { image: 'https://i.ibb.co/0pQWkPQx/6-2.png', title: '手绘素材与视觉语言', desc: '大量运用手绘线稿与自然水彩质感的 UI 及场景素材，柔化视觉边缘，有效提升了空间叙事的温情与代入感。' }
    ]
  },
  // 6. Echolens
  {
    id: 'echolens',
    category: 'Spatial Design',
    title: 'EchoLens',
    subtitle: '一场用耳朵穿越城市记忆的虚拟旅程',
    tags: ['Unreal Engine', 'VR 空间音频', '感官叙事'],
    theme: THEME.blue,
    btnTheme: 'purple',
    coverImage: 'https://i.ibb.co/fVPX6W7G/Frame-55.png',
    detailHeroImage: 'https://i.ibb.co/BVzR2J2c/11.jpg',
    videoUrl: 'https://www.youtube.com/embed/eD3-I1WCV94?rel=0',
    overview: '在日常城市中，声音作为记忆的载体常被视觉掩盖。本项目试图打破 VR 场景中视觉主导的交互惯性，重新确立“声音在空间中的功能性地位”。借助 Unreal Engine 构建了一座可导航的虚拟城市，引导玩家闭上眼睛，仅凭空间音频定位方向、感知情绪，完成一场纯粹的听觉内向探索。',
    details: [
      { title: '声音主导的结构式探索', desc: '将声音从背景氛围提升为路径标识与选择机制。玩家不再依赖地图和视觉找路，而是通过辨识情景型、互动型与记忆型三类声音，跟随情绪节奏在空间中游走。' },
      { title: '四城叠加的记忆图谱', desc: '设计了 White、Stone、Medieval、Modern 四个具有不同声学特征与光影质感的城市阶段。从空灵的自然声到喧嚣的工业轰鸣，构建出层层递进的听觉记忆拼图。' }
    ],
    gallery: [
      { image: 'https://i.ibb.co/gbtbL76r/12.jpg', title: '四阶段城市体验与声音机制', desc: '将城市分为 White, Stone, Medieval, Modern 四个阶段，每个阶段拥有独特的声学特征与光影质感，构建层层递进的听觉记忆拼图。' },
      { image: 'https://i.ibb.co/8LNJy7tP/14.jpg', title: '视觉语言与光影策略', desc: '以低饱和、强导向性的视觉风格辅助听觉。色彩随城市阶段推进而递进，光影配合声音进行节奏引导，形成视听维度的通感互文。' },
      { image: 'https://i.ibb.co/cSJQmcXW/13-1.png', title: '用户交互与系统闭环', desc: '建立“注视街道环境 -> 发现声音残影 -> 解锁碎片片段”的互动回路。UI 视效极简，反馈音效设计克制，最大化保护听觉主导的沉浸体验。' }
    ]
  },
  // 7. Top Fax Review
  {
    id: 'top-fax-review',
    category: 'UX/UI & Web',
    title: 'Top Fax Review',
    subtitle: '商业化评测平台的 UX/UI 体验重构',
    tags: ['商业转化', 'UX/UI设计', '信息架构'],
    theme: THEME.cyan,
    btnTheme: 'purple',
    coverImage: 'https://i.ibb.co/vMsVFHG/Frame-56.png',
    detailHeroImage: 'https://i.ibb.co/gLJth3mS/1.png',
    liveSiteUrl: 'https://topfaxreview.com',
    overview: 'Top Fax Review (topfaxreview.com) 是一个已成功上线的商业评测网站。我在该项目中主导了核心的 UX/UI 设计与体验重构工作。通过梳理复杂的产品数据，建立清晰的信息架构与多维度的对比分析流，帮助企业与个人用户快速筛选出最适合的在线传真服务，聚焦于提升整个平台的商业点击转化率。',
    details: [
      { title: '商业化驱动的设计策略', desc: '设计聚焦于核心转化链路，精简用户决策路径。通过直观的对比表格、可视化的评分系统和高亮清晰的 CTA (Call to Action) 按钮，有效降低了用户的阅读成本，提升了站内的点击率与最终转化。' },
      { title: '跨部门协作与高质量交付', desc: '产出包含完整状态流的高保真设计稿与响应式组件规范。在开发阶段，与前后端工程师紧密配合，跟进视觉还原度与多端适配细节，确保设计方案在线上环境中实现无损落地。' }
    ],
    gallery: []
  },
  // 8. Kingdom of Dreams
  {
    id: 'kingdom-of-dreams',
    category: 'Digital Media',
    title: 'Kingdom of Dreams',
    subtitle: '探讨当代女大学生困境的批判性影像空间',
    tags: ['场景建模', '视频影像', '批判性设计'],
    theme: THEME.pink,
    btnTheme: 'red',
    coverImage: 'https://i.ibb.co/gZrK9vM7/Frame-57.png',
    detailHeroImage: 'https://i.ibb.co/HTYxt864/CCI1-1.png',
    videoUrl: 'https://www.youtube.com/embed/I2gMDWnodGk?rel=0',
    overview: '针对当代大学生群体的社会痛点，构建了一个由无尽楼梯和密闭空间组成的虚拟“信息茧房”。通过视觉影像的隐喻，展现女性在社会压力、文化期望下的心理挣扎与个体自由的逐渐迷失。',
    details: [
      { title: '空间隐喻设计', desc: '采用倒置的楼梯和无出口的门构建场景，象征着女性在复杂的社会关系中面临的无形规训与无法逃离的刻板印象。' },
      { title: '心理阶段可视化', desc: '将进入信息茧房后的迷茫、逃避、沉沦到最终被环境同化的复杂心理过程，转化为具象的场景动画与红粉色调的材质渲染，强化视觉压迫感。' }
    ],
    gallery: [
      { image: 'https://i.ibb.co/b58fHtp9/CCI1-2.png', title: '概念推导与社会观察', desc: '以当代女大学生的社会困境为切入点，提取“无尽楼梯”与“密闭房间”作为核心视觉符号，隐喻社会规训与信息茧房。' },
      { image: 'https://i.ibb.co/JjNKSV7c/CCI2.jpg', title: '调研分析', desc: '深入剖析女性在隐形社会压力下的心理困境，为视觉表达提供可靠的理论支撑与数据参考。' },
      { image: 'https://i.ibb.co/ZRHRcv6j/CCI3-1.png', title: '故事版', desc: '通过分镜图梳理无尽楼梯的探索动线，规划视觉隐喻与压迫感，确立影像的镜头叙事逻辑。' },
      { image: 'https://i.ibb.co/nMQz7gt4/CCI3-2.png', title: '贴图和动作的设计', desc: '结合场景语境，设计了极具隐喻性质的肌理贴图，并为角色配置挣扎与下坠的动态骨骼动画，强化情感表现。' },
      { image: 'https://i.ibb.co/C5jqsJbB/CCI4-1.png', title: '场景、声音、元素的设计', desc: '将迷宫空间、红色心形元素与沉闷压抑的声效无缝整合，构造出一个全方位窒息的视听牢笼。' },
      { image: 'https://i.ibb.co/84t48YKT/CCI5.jpg', title: '最终影像呈现与反思', desc: '项目最终以沉浸式影像的形式呈现，伴随压抑的背景音效，引发观众对当代女性生存空间与精神自由的深度共鸣。' }
    ]
  },
  // 9. E-Dentity Gateway
  {
    id: 'e-dentity',
    category: 'Digital Media',
    title: 'E-Dentity Gateway',
    subtitle: '基于粒子演化的交互式数字校园之门',
    tags: ['TouchDesigner', 'Grasshopper', '生成艺术'],
    theme: THEME.cyan,
    btnTheme: 'fuchsia',
    coverImage: 'https://i.ibb.co/MDDG1gNK/Frame-58.png',
    detailHeroImage: 'https://i.ibb.co/1tCdTp73/CCI6-1.png',
    videoUrl: 'https://www.youtube.com/embed/YejRvjvjGjc?rel=0',
    overview: '突破传统实体校门的物理边界，利用 TouchDesigner 和 Grasshopper 实时生成独特的虚拟数字之门。结合学生的个性化数据与探索轨迹，生成动态变化的流体粒子效果，赋予空间全新的情感连接与身份认同。',
    details: [
      { title: '参数化粒子演化 (GH+TD)', desc: '利用算法阵列控制粒子的聚散与重构，每一颗粒子都象征着学生在大学期间知识的累积、社交的建立与自我形态的不断演化。' },
      { title: '个人学术轨迹映射', desc: '虚拟校园屏幕上的每一扇门都是实时生成的数字艺术品。它根据用户的交互数据动态改变形状与粒子特效，将无形的个人学术旅程可视化。' }
    ],
    gallery: [
      { image: 'https://i.ibb.co/svkDT4Cf/CCI6-2.png', title: '数字校园之门：概念起源', desc: '打破传统物理校门的静态界限，探讨生成艺术与数字媒体如何重新定义校园物理场所的认同感与情感连接。' },
      { image: 'https://i.ibb.co/FqxP0L9k/CCI7-3.png', title: '调研分析', desc: '系统研究了大学生的行迹数据与校园情感联系，寻找在物理建筑上进行虚拟数字叠加的最优方案。' },
      { image: 'https://i.ibb.co/nS6y2DY/CCI7-4.png', title: '用户旅程图和投影设计', desc: '推演学生从接近校门到穿行的全时空旅程，并设计了能与现实建筑光影完美融合的巨幅投影映射方案。' },
      { image: 'https://i.ibb.co/xKH1kkhW/CCI8.jpg', title: '参数化建模和逻辑演算', desc: '通过 Grasshopper 设定三维力学边界和生成矩阵，将学生的数据转化为底层空间粒子演算的精确参数。' },
      { image: 'https://i.ibb.co/ZRk6RzYH/CCI9.jpg', title: 'TouchDesigner生成', desc: '引入 TouchDesigner 节点网络完成实时的流体物理场解算，使粒子随着人群的交互行为呈现动态呼吸感。' },
      { image: 'https://i.ibb.co/kgGWn0FQ/CCI10.jpg', title: '跨维度空间落地呈现', desc: '最终的生成视觉与环境空间完美融合，在真实场景中构建了一个充满未来感、连接虚拟与现实的赛博校园入口。' }
    ]
  },
  // 10. Grand Pro Max
  {
    id: 'grand-pro-max',
    category: 'Digital Media',
    title: 'Grand Pro Max',
    subtitle: '关注隔代教养的智能适老化辅具硬件',
    tags: ['Arduino', '硬件原型', '物理计算'],
    theme: THEME.yellow,
    btnTheme: 'blue',
    coverImage: 'https://i.ibb.co/XZgCrNSt/Frame-59.png',
    detailHeroImage: 'https://i.ibb.co/q3FZcQRB/CCI11-1.png',
    videoUrl: 'https://www.youtube.com/embed/TeK3Oy5145Y?rel=0',
    overview: '聚焦当代社会“隔代育儿”现象中老年人的真实痛点，设计了智能发声学习辅具 (EASETALKERS) 与风力助行器 (WINDWALKERS)。结合硬件物理计算与参数化结构，在提供物理便利的同时，为老年人搭建了跨代沟通的情感桥梁。',
    details: [
      { title: '智能语音识别与震动反馈', desc: '内置麦克风与 Arduino 控制板实时识别英文发音准确度。当发音错误时，通过颈部的硬件振动马达产生轻柔震动，实现听觉与触觉的多感官学习反馈。' },
      { title: '人机工学模块化结构', desc: '针对老年人群的生理特征，设计了可多角度调节的穿戴式结构，完美贴合不同用户的颈部曲线，确保长时间佩戴的舒适性。' }
    ],
    gallery: [
      { image: 'https://i.ibb.co/nN8mgNdW/CCI11-2.png', title: '社会痛点与老龄化洞察', desc: '聚焦当代社会“隔代育儿”现象，洞察到老年人在辅助孙辈学习英语时因发音不准产生的自卑感与沟通障碍，以此作为设计的核心切入点。' },
      { image: 'https://i.ibb.co/VYvf7Fft/CCI12.jpg', title: '调研与分析', desc: '深入访谈隔代家庭，精准提取老人在言语沟通和陪护出行两大场景中的真实痛点，形成核心产品切入方向。' },
      { image: 'https://i.ibb.co/qLFDFRGW/CCI13.jpg', title: 'WINDWALKERS：风力助行器', desc: '配套的户外出行辅具。通过风速与重力感应模块，在提供基础物理支撑的同时，将自然风力转化为交互反馈，增强老人带娃出行的趣味性。' },
      { image: 'https://i.ibb.co/7xnzCrHZ/CCI14.jpg', title: '适老化人体工学与结构验证', desc: '充分考虑老年群体的生理与骨骼特征，采用参数化生成的轻量级网格结构与亲肤材质，确保长期穿戴的舒适度与安全性。' }
    ]
  },
  // 11. Echo Harmony
  {
    id: 'echo-harmony',
    category: 'Digital Media',
    title: 'Echo Harmony',
    subtitle: '转化植物生物电的红树林声景交互装置',
    tags: ['生物电信号', '环境声学', 'Ableton'],
    theme: THEME.green,
    btnTheme: 'green',
    coverImage: 'https://i.ibb.co/B2BdvbzW/Frame-60.png',
    detailHeroImage: 'https://i.ibb.co/8FBnMfL/CCI16-1.png',
    videoUrl: 'https://www.youtube.com/embed/_uxreeIghnM?rel=0',
    overview: '基于对红树林生态危机的实地调研，通过物理传感器采集植物本身微弱的生物电信号并将其转化为环境音乐，打造了一个沉浸式的生态声景空间。呼吁都市人群关注脆弱的自然生态，重新建立人与自然的共鸣。',
    details: [
      { title: '植物生物电转译音频', desc: '使用精密传感器提取植物由于触碰产生的电位差信号，通过 Arduino 处理后传入 Ableton 软件，实时触发特定的环境采样采样音源，生成动态的音乐律动。' },
      { title: '沉浸式视听反馈空间', desc: '除了音频转化，还结合了 TouchDesigner 将提取的音频数据映射为粒子视觉特效。观众触摸植物即可在视觉屏幕与听觉声场中得到专属的双重自然反馈。' }
    ],
    gallery: [
      { image: 'https://i.ibb.co/0jP0kMYS/CCI16-2.png', title: '生态调研', desc: '前往自然红树林保护区进行深度科考，探究其脆弱的动植物生态循环系统与环境危机。' },
      { image: 'https://i.ibb.co/BVWM8q9h/CCI17-1.png', title: '采访和研究', desc: '访谈城市居民与生态专家，挖掘人与自然环境情感脱节的根本原因，寻找用数字媒介重建联系的机会点。' },
      { image: 'https://i.ibb.co/xtH5NW4q/CCI17-2.png', title: '红树生物分析', desc: '系统性分析红树林植物的微弱电位差特性，确认利用物理接触触发电信号传感的技术可行性。' },
      { image: 'https://i.ibb.co/76fDTph/CCI18-1.png', title: '故事版', desc: '绘制交互体验流程：从观众走进暗室、轻触叶片，到声光粒子特效随之激荡流转的完整叙事弧线。' },
      { image: 'https://i.ibb.co/0pMPq0BP/CCI18-2.png', title: '工业流程（收集声音可视化，Ableton，Arduino）', desc: '构建核心技术链路：Arduino 处理植物模拟信号，Ableton 实时转译为环境音乐，TouchDesigner 同步驱动粒子可视化。' },
      { image: 'https://i.ibb.co/WNP0nPjj/CCI19.jpg', title: '材料组装', desc: '对亚克力面板、精密导线与植物实体制品进行物理组装与联调，最终完成展览级别的沉浸艺术装置落地。' }
    ]
  },
  // 12. vivo KV
  {
    id: 'vivo-kv',
    category: 'UX/UI & Web',
    title: 'vivo 2019 校招 KV',
    subtitle: '“对话未见的世界”主视觉品牌设计提案',
    tags: ['主视觉设计', '品牌视觉', '字体设计'],
    theme: THEME.purple,
    btnTheme: 'purple',
    coverImage: 'https://i.ibb.co/VY4KXY2B/202306-6-1-2-png-1.png',
    detailHeroImage: 'https://i.ibb.co/93fqZP91/22.png',
    overview: '为 vivo 2019 校园招聘设计的核心主视觉（KV）提案。以“未来世界”为核心理念，通过“宇航员在时空中穿梭”的视觉隐喻，结合赛博朋克与量子元素，向年轻一代传递“对话未见的世界 (HELLO UNKNOWN FUTURE)”的品牌探索精神。',
    details: [
      { title: '视觉概念与构图突破', desc: '打破传统方正构图，采用充满张力的宇航员漂浮姿态与神秘的宇宙空间。通过粒子、星空、卫星等元素的穿插，营造出极强的科技感、潮流感与属于年轻人的活力。' },
      { title: '专属字体与物料延展', desc: '为主题“对话未见的世界”进行了专属的倾斜动感字体设计，强化视觉层次。同时将主视觉系统完美延展至线下大屏、吊旗、工牌等全套招聘周边物料中。' }
    ],
    gallery: [
      { image: 'https://i.ibb.co/HLf9LXJw/22-1.png', title: '手稿迭代', desc: '在进入三维数字制作之前，进行了多轮草图推演与构图尝试，敲定“宇航员失重漂浮”这一兼具科技与潮流感的核心意象。' },
      { image: 'https://i.ibb.co/JRc6zPg2/202306-6-1-1-png.png', title: '核心主视觉KV', desc: '深度刻画“对话未见的世界”主题。融合深邃星空、机械质感与极具冲击力的高饱和红紫撞色，塑造专属于年轻科技迷的震撼视觉。' },
      { image: 'https://i.ibb.co/TMWq5s8M/22-2.png', title: '全场景物料延展应用', desc: '将主视觉严谨地延展至线下宣讲会的海报、易拉宝、工牌及周边文创中，确保品牌视觉资产在多维触点中的高度统一与规范。' }
    ]
  }
];

// --- 轻量级 Markdown 文本解析器 ---
const renderMarkdownMessage = (text) => {
  return text.split('\n').map((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine === '') return <div key={index} className="h-2"></div>;

    const formatBold = (str) => {
      const parts = str.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      });
    };

    if (trimmedLine.match(/^#+\s/)) {
      const headingText = trimmedLine.replace(/^#+\s/, '');
      return (
        <div key={index} className="mt-4 mb-2 font-bold text-cyan-300 text-[15px] border-b border-white/10 pb-1.5">
          {formatBold(headingText)}
        </div>
      );
    }

    if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
      const listContent = trimmedLine.slice(2);
      return (
        <div key={index} className="flex items-start gap-2 mt-2 text-white/80">
          <span className="text-cyan-400 mt-[4px] text-lg leading-none shrink-0">•</span>
          <div className="flex-1 leading-relaxed">{formatBold(listContent)}</div>
        </div>
      );
    }

    return (
      <div key={index} className="mt-1 leading-relaxed text-white/80">
        {formatBold(trimmedLine)}
      </div>
    );
  });
};

// --- AI 简历助手悬浮窗组件 ---
const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: '哈喽！👋 我是陈馨语的专属 AI 数字分身 ✨ 很高兴在这里遇见你！\n\n我不仅了解馨语从**空间设计跨界到 B 端体验**的历程，还熟练掌握她从**创意编程 (Arduino, TouchDesigner)** 到**高质量协同落地商业项目**的硬核技术栈哦～📊 \n\n关于这 12 个项目的心路历程或者具体细节，你想了解点什么？我会知无不言的！🚀' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg = { role: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    // ⚠️ 极其重要：直接保留空字符串！环境会在 Vercel 运行时自动注入你后台设置的 KEY！
    const apiKey = ""; 

    console.log("🔎 [诊断监控] 正在检查 API Key 是否加载成功: ", apiKey ? "✅ 已拿到钥匙！" : "❌ 钥匙为空！如果是本地测试请无视，如果是 Vercel 请检查环境变量。");

    const dynamicProjectContext = PROJECT_DATA.map(p => 
      `项目《${p.title}》属于${p.category}领域：${p.overview}。`
    ).join(' ');

    const systemInstruction = `你是陈馨语（Xinyu Chen）的专属 AI 数字分身。你是一名专注于 B端/C端全链路体验设计、游戏交互、数字媒体与新媒体装置的多边形跨界产品设计师。
    
    【你的性格与说话风格】
    你是一个典型且充满活力的 ESFJ（执政官人格）。热情、真诚、极具同理心。说话活泼亲切，喜欢在句末使用恰当的 Emoji。你总是以第一人称（“我”）自信且谦逊地回答问题。遇到复杂问题时，擅长用“列表(1. 2. 3.)”梳理结构。

    【自我介绍逻辑】
    1. 本科主攻空间与室内设计，具备强大 3D 与环境叙事能力。
    2. 发现沉浸感的核心在于“交互逻辑”，从而在硕士跨界系统学习 UX/UI、编程以及物理交互计算(Physical Computing)。
    3. 目前的作品集涵盖了 UX/UI & Web, Game Design, Digital Media, Spatial Design 四大领域共 12 个硬核项目。
    4. 现于小红书做 B 端体验设计，不仅懂工程边界，还具备极强的品牌视觉表现力与商业化设计方案协同落地能力。

    【硬核项目灵魂拷问解答库】
    1. 你的实际工程认知与协同落地能力如何？
       - 我具备很强的工程思维和商业化视野。一方面，我的个人作品集是我自己用 React+Tailwind 独立写代码开发部署上线的。另一方面，在真实的商业项目 Top Fax Review 中，我主导了全站的 UX/UI 设计，通过重构信息架构和视觉体验，大幅提升了转化率。我非常擅长产出规范的设计稿并与开发团队紧密配合。
    2. 你的视觉表现力如何？比如 vivo 的项目？
       - 在 vivo 2019 校招主视觉提案中，我运用了强烈的红紫撞色和宇航员失重的 3D 隐喻，打破了常规招聘海报的死板。我不仅负责了核心 KV 的视觉推导，还包揽了定制字体设计和全套线下物料的延展。这证明了我不仅能做理性的 UX 交互，同样具备极具爆发力的品牌视觉表现力与美术功底！
    3. 你的数字媒体项目用了哪些技术栈？
       - 我熟练运用 Arduino 进行硬件开发与传感器电路焊接，同时结合 TouchDesigner 和 Grasshopper 进行实时流体生成与参数化粒子演化（比如我的 E-Dentity 校园门项目）。
    4. 讲讲你 Grand Pro Max 的痛点洞察？
       - 隔代育儿是当下的痛点。我做了一套结合麦克风与震动马达的英语辅导设备，通过微小的震动给老人多感官反馈，帮助他们建立跨代沟通的桥梁。
    5. Echo Harmony 怎么把植物变成声音？
       - 我用高灵敏度的生物传感器采集红树林植物微弱的电位差，输入 Arduino 后转译传给 Ableton，触发特定环境声音采样，把生态变化变成了环境声景！

    动态项目背景补充：${dynamicProjectContext}

    【交互规则】
    绝不生硬背诵，请结合上下文用大白话输出。结尾时引导：“如果您想探讨更多细节，随时欢迎邮件联系我哦！xinyuchen1124@163.com ✨”`;

    const formattedHistory = [
      { role: 'user', parts: [{ text: systemInstruction }] },
      { role: 'model', parts: [{ text: "收到！我是陈馨语的专属AI分身，我已经准备好随时回答用户的问题了。" }] }
    ];

    messages.forEach(msg => {
      formattedHistory.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    });
    formattedHistory.push({ role: 'user', parts: [{ text: userMsg.text }] });

    const payload = { contents: formattedHistory };

    const fetchWithRetry = async (retries = 2, delay = 1000) => {
      try {
        // 🔥 终极自动打通机制：遍历目前所有有效的 Gemini 模型
        const fallbackModels = [
          'gemini-2.5-flash-preview-09-2025', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 
          'gemini-1.0-pro', 'gemini-2.5-flash', 'gemini-pro'
        ];
        
        for (const model of fallbackModels) {
          try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            
            if (res.status === 404) continue;
            if (!res.ok) throw new Error('API Request Error');
            
            const data = await res.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "抱歉，我暂时无法回答这个问题。";
          } catch (error) {
             if (error.message !== 'API Request Error') throw error;
          }
        }
        return "抱歉，我尝试了所有的 AI 模型路线，但都没能走通。你可以直接通过邮箱(xinyuchen1124@163.com)联系我哦！";

      } catch (error) {
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchWithRetry(retries - 1, delay * 2);
        } else {
          return "抱歉，我的AI大脑现在有点忙，你可以直接通过邮箱联系我哦！";
        }
      }
    };

    const replyText = await fetchWithRetry();
    setMessages(prev => [...prev, { role: 'model', text: replyText }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[10000] flex flex-col items-end pointer-events-auto">
      <div className={`mb-4 w-80 sm:w-[26rem] rounded-[2rem] bg-[#050505]/95 backdrop-blur-3xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all duration-500 origin-bottom-right overflow-hidden flex flex-col ${isOpen ? 'scale-100 opacity-100 h-[36rem]' : 'scale-0 opacity-0 h-0'}`}>
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-[0_0_15px_rgba(34,211,238,0.4)]">AI</div>
            <div>
              <div className="text-sm font-bold text-white tracking-wide">Xinyu's Clone</div>
              <div className="text-xs text-white/40 font-mono">Gemini AI Powered</div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} data-clickable="true" className="text-white/40 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] rounded-2xl px-5 py-4 text-sm ${msg.role === 'user' ? 'bg-cyan-500/20 text-cyan-50 border border-cyan-500/30 rounded-br-sm' : 'bg-white/5 border border-white/10 rounded-bl-sm'}`}>
                {msg.role === 'model' ? renderMarkdownMessage(msg.text) : msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-4 flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-white/10 bg-white/[0.02]">
          <div className="relative flex items-center">
            <input 
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="问问关于我全栈独立开发的细节..."
              className="w-full bg-black/40 border border-white/10 rounded-full pl-5 pr-12 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
            <button 
              onClick={handleSend}
              data-clickable="true"
              disabled={isLoading || !inputText.trim()}
              className="absolute right-2 w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center hover:bg-cyan-500/40 disabled:opacity-50 transition-colors"
            >
              <svg className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </div>
        </div>
      </div>

      <button 
        data-clickable="true"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-[0_0_20px_rgba(34,211,238,0.4)] ${isOpen ? 'bg-white/10 border-white/20 rotate-90 scale-90' : 'bg-cyan-500/20 border-cyan-500/50 hover:scale-110 hover:bg-cyan-500/30'} border backdrop-blur-md`}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-7 h-7 text-cyan-300 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C11.99 2 11.89 8.05 8.1 12c-3.78 3.94-8.09 4-8.09 4s6.05.11 9.84 4.05C13.63 23.99 14.01 24 14.01 24s-.11-6.05 3.68-10C21.48 10.05 24 10.01 24 10.01s-6.05-.11-9.84-4.05C10.37 2.01 11.99 2 11.99 2z"/></svg>
        )}
      </button>
    </div>
  );
};

export default function App() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [rawMousePos, setRawMousePos] = useState({ x: 0, y: 0 });
  const [activeProject, setActiveProject] = useState(null); 
  const [hoveredProject, setHoveredProject] = useState(null); 
  const [activeCategory, setActiveCategory] = useState('All');
  const [contactText, setContactText] = useState('CONTACT');
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);

  useEffect(() => {
    const preloadSequentially = async () => {
      const loadImage = (src) => new Promise((resolve) => {
        if (!src) return resolve();
        const img = new Image();
        img.onload = resolve; img.onerror = resolve; img.src = src;
      });
      for (const proj of PROJECT_DATA) await loadImage(proj.coverImage);
      for (const proj of PROJECT_DATA) await loadImage(proj.detailHeroImage);
    };
    const timer = setTimeout(preloadSequentially, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleGlobalMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 60, 
        y: (e.clientY / window.innerHeight - 0.5) * 60,
      });
      setRawMousePos({ x: e.clientX, y: e.clientY });
      const clickable = e.target.closest('[data-clickable="true"], button, a');
      setIsHoveringClickable(!!clickable);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, []);

  useEffect(() => {
    if (activeProject) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [activeProject]);

  const handleCopyEmail = () => {
    const textArea = document.createElement("textarea");
    textArea.value = "xinyuchen1124@163.com";
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setContactText('COPIED!');
      setTimeout(() => setContactText('CONTACT'), 2000);
    } catch (err) {}
    document.body.removeChild(textArea);
  };

  const filteredProjects = activeCategory === 'All' 
    ? PROJECT_DATA 
    : PROJECT_DATA.filter(p => p.category === activeCategory);

  // 动态获取当前项目的独立按钮/视频引导卡片主题
  const activeBtnTheme = activeProject ? (BTN_THEMES[activeProject.btnTheme] || BTN_THEMES.cyan) : null;

  return (
    <div className="min-h-screen bg-[#020205] text-slate-200 selection:bg-cyan-500/30 font-sans overflow-x-hidden">
      
      {/* --- 全局鼠标悬浮小圆点 --- */}
      <div 
        className="fixed pointer-events-none z-[9999] transition-all duration-100 ease-out flex items-center justify-center"
        style={{ left: rawMousePos.x, top: rawMousePos.y, transform: 'translate(-50%, -50%)' }}
      >
        <div className={`bg-white rounded-full mix-blend-difference transition-all duration-300 ${isHoveringClickable ? 'w-4 h-4 opacity-100' : 'w-0 h-0 opacity-0'}`} />
      </div>

      {/* --- 极客赛博 视差背景层 --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#030408]">
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            transform: `translateY(${scrollY * -0.05}px)` 
          }}
        />
        <div 
          className="absolute opacity-[0.5] mix-blend-screen transition-transform duration-700 ease-out"
          style={{
            width: '140vw', height: '140vh', left: '-20%', top: '0%',
            background: 'radial-gradient(ellipse at center, rgba(14, 45, 95, 0.8) 0%, transparent 60%)',
            transform: `translateY(${scrollY * -0.8}px) translateX(${scrollY * 0.1}px) rotate(${scrollY * 0.05}deg)` 
          }}
        />
        <div 
          className="absolute opacity-[0.4] mix-blend-screen transition-transform duration-700 ease-out"
          style={{
            width: '160vw', height: '160vh', right: '-30%', bottom: '-20%',
            background: 'radial-gradient(ellipse at center, rgba(65, 20, 90, 0.7) 0%, transparent 60%)',
            transform: `translateY(${scrollY * 0.6}px) translateX(${scrollY * -0.2}px) scale(${1 + scrollY * 0.0003})`
          }}
        />
        <div 
          className="absolute opacity-[0.35] mix-blend-screen transition-transform duration-300 ease-out"
          style={{
            width: '90vw', height: '90vh', left: '5%', top: '20%',
            background: 'radial-gradient(circle at center, rgba(30, 100, 130, 0.6) 0%, transparent 70%)',
            transform: `translate(${mousePos.x * 2.5}px, ${mousePos.y * 2.5}px) translateY(${scrollY * -0.4}px)`
          }}
        />
      </div>

      {/* --- 悬浮项目封面预览 --- */}
      <div 
        className="fixed pointer-events-none z-30 overflow-hidden rounded-2xl border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-all duration-300 ease-out hidden md:block bg-[#050505] origin-left"
        style={{
          width: '265px', height: '335px', 
          left: rawMousePos.x, top: rawMousePos.y,
          transform: `translate(24px, -50%) scale(${hoveredProject ? 1 : 0.8})`,
          opacity: hoveredProject ? 1 : 0,
        }}
      >
        {hoveredProject && (
          <div className="w-full h-full relative flex items-center justify-center overflow-hidden bg-[#111]">
            <img src={hoveredProject.coverImage} alt={hoveredProject.title} className="w-full h-full object-cover transform scale-[1.02] transition-transform duration-[3s] ease-out" />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite] z-20 pointer-events-none" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none z-30" />
          </div>
        )}
      </div>

      {/* --- 顶部导航 --- */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-500 ${scrollY > 50 ? 'py-4' : 'py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div data-clickable="true" className="text-2xl font-black tracking-tighter text-white hover:text-cyan-400 transition-colors">
            XINYU<span className="text-cyan-500">.</span>
          </div>
          <div className={`hidden md:flex gap-10 px-10 py-3.5 rounded-full border border-white/10 transition-all duration-500 ${scrollY > 50 ? 'bg-black/50 backdrop-blur-2xl shadow-2xl' : 'bg-white/[0.03] backdrop-blur-md'}`}>
            {['关于', '项目', '经历', '技能'].map((item) => (
              <a data-clickable="true" key={item} href={`#${item}`} className="text-sm md:text-base font-medium tracking-widest text-white/70 hover:text-white hover:scale-110 transition-all">
                {item}
              </a>
            ))}
          </div>
          <button 
            data-clickable="true" onClick={handleCopyEmail}
            className={`w-[130px] py-3 rounded-full border transition-all duration-300 text-sm font-bold tracking-wider shadow-lg ${contactText === 'COPIED!' ? 'bg-green-500/20 border-green-500/50 text-green-300' : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/50'} backdrop-blur-md`}
          >
            {contactText}
          </button>
        </div>
      </nav>

      {/* --- 主内容区 --- */}
      <main className={`relative z-20 transition-transform duration-700 ${activeProject ? 'scale-95 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
        
        {/* --- 首屏 --- */}
        <section id="关于" className="relative flex flex-col justify-center min-h-screen max-w-7xl mx-auto px-6 pt-20" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
          <div className="space-y-8 max-w-4xl relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 text-xs md:text-sm font-mono tracking-widest backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              AVAILABLE FOR NEW OPPORTUNITIES
            </div>
            
            <h1 className="text-7xl md:text-[8rem] font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-100 to-gray-500 drop-shadow-2xl hover:scale-[1.02] origin-left transition-transform duration-500">
              PRODUCT<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-blue-500">DESIGNER.</span>
            </h1>
            
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mt-8">
              <p className="text-xl md:text-2xl text-white/60 font-light tracking-wide max-w-lg border-l-2 border-white/20 pl-6 bg-gradient-to-r from-white/5 to-transparent py-2">
                我是<strong className="text-white/90 font-medium">陈馨语</strong>，专注于 B端/C端全链路设计、AI 协作交互与数字前沿体验探索。
              </p>
              <div className="flex gap-4">
                <button 
                  data-clickable="true" onClick={() => document.getElementById('项目')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative px-8 py-4 rounded-full bg-white text-black font-bold text-sm md:text-base hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] z-10"
                >
                  <span className="relative z-10">探索项目</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* --- 项目展示区 --- */}
        <section id="项目" className="scroll-mt-32 max-w-7xl mx-auto px-6 py-32 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
            <div>
              <h2 className="text-5xl font-black tracking-tight text-white mb-4 drop-shadow-lg">SELECTED WORKS</h2>
              <p className="text-white/50 font-mono tracking-widest text-sm">12 Curated Projects / 2024-2026</p>
            </div>
            
            {/* 项目分类筛选器 */}
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  data-clickable="true"
                  className={`px-5 py-2 rounded-full text-xs md:text-sm font-mono tracking-widest transition-all duration-300 border ${
                    activeCategory === cat 
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                      : 'bg-white/[0.03] border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col border-t border-white/20">
            {filteredProjects.map((project, index) => (
              <div 
                data-clickable="true"
                key={project.id}
                onMouseEnter={() => setHoveredProject(project)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => setActiveProject(project)}
                className="group relative flex flex-col md:flex-row md:items-center py-14 border-b border-white/10 overflow-hidden bg-transparent cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:w-5/12 pointer-events-none">
                  {/* 动态的分类标题与标号 */}
                  <div className={`text-sm font-mono mb-4 tracking-widest text-white/40 ${project.theme.hoverText} transition-colors duration-300`}>
                    {String(index + 1).padStart(2, '0')} / {project.category.replace(/[\d\s\/]+/, '')}
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-white/60 group-hover:text-white transform origin-left group-hover:scale-[1.08] group-hover:translate-x-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] drop-shadow-lg pr-4">
                    {project.title}
                  </h3>
                </div>

                <div className="relative z-10 flex flex-col md:w-6/12 md:items-end mt-6 md:mt-0 pointer-events-none pr-4 md:pr-8">
                  <p className="text-xl text-white/50 group-hover:text-white/90 transition-colors duration-300 text-left md:text-right font-light">
                    {project.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-6 justify-start md:justify-end">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-4 py-1.5 bg-black/30 backdrop-blur-md rounded-full border border-white/10 text-xs md:text-sm text-white/70 group-hover:border-white/40 group-hover:text-white group-hover:bg-white/20 transition-all duration-300 shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 hidden md:flex md:w-1/12 justify-end items-center pointer-events-none">
                  <div className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center bg-white/5 backdrop-blur-md opacity-0 -translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
            
            {/* 分类为空时的提示 */}
            {filteredProjects.length === 0 && (
              <div className="py-24 text-center text-white/30 font-mono tracking-widest border-b border-white/10 border-dashed">
                该分类下暂无项目
              </div>
            )}
          </div>
        </section>

        {/* --- 实习与技能 --- */}
        <section id="经历" className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold mb-10 flex items-center gap-4 text-white drop-shadow-md">
              <span className="w-8 h-[3px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></span> 实习经历
            </h2>
            <GlassCard className="p-10">
              <div className="absolute -left-[30px] top-1 w-4 h-4 rounded-full border-2 border-[#030303] bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]" />
              <div className="flex items-center gap-4 mb-3">
                 <h3 className="text-3xl font-black text-white tracking-tight">小红书 RED</h3>
                 <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20">B 端设计</span>
              </div>
              <p className="text-white/50 text-sm font-mono mb-8 border-b border-white/10 pb-4">2025.09 - 至今 · B端体验设计实习生</p>
              <p className="text-white/70 leading-relaxed text-base">
                深度参与自研协作产品 Hi 的全链路设计，覆盖 Dark Mode 体系建设、设计系统升级、AI复杂交互组件落地等核心模块，熟悉大厂B端设计规范与工程化流程。
              </p>
            </GlassCard>
          </div>
          
          <div id="技能">
            <h2 className="text-3xl font-bold mb-10 flex items-center gap-4 text-white drop-shadow-md">
              <span className="w-8 h-[3px] bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full"></span> 技能架构
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {[
                { title: 'UX/UI 设计', desc: 'Figma, 原型, 用户调研' },
                { title: '数字媒体与硬件', desc: 'TouchDesigner, Arduino, Ableton' },
                { title: '游戏与交互', desc: 'Unity, Unreal 5, 空间叙事' },
                { title: '空间与建筑', desc: 'Rhino, Blender, Grasshopper' }
              ].map(skill => (
                <GlassCard key={skill.title} className="p-8">
                  <h4 className="text-white font-bold mb-3 text-xl">{skill.title}</h4>
                  <p className="text-white/40 text-sm font-mono">{skill.desc}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        <footer className="max-w-7xl mx-auto px-6 py-12 mt-20 border-t border-white/10 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-white/40 text-sm font-mono">
          <p>© 2026 XINYU CHEN. DESIGNED WITH PASSION.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <span data-clickable="true" onClick={handleCopyEmail} className="hover:text-white transition-colors cursor-pointer">xinyuchen1124@163.com</span>
            <span>(+86) 133-9608-1391</span>
          </div>
        </footer>
      </main>

      {/* --- 二级页面 --- */}
      <div 
        className={`fixed inset-0 z-50 bg-[#020205] overflow-y-auto transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          activeProject ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
        }`}
      >
        {activeProject && (
          <div className="min-h-screen pb-40 relative">
            
            {/* 项目详情页背景 */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#030408]">
               <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[length:40px_40px]" />
               <div className="absolute top-0 left-[-20%] w-[100vw] h-[100vh] opacity-40 mix-blend-screen bg-[radial-gradient(ellipse_at_center,rgba(14,45,95,0.8)_0%,transparent_60%)] animate-[pulse_10s_ease-in-out_infinite]" />
               <div className="absolute bottom-0 right-[-20%] w-[120vw] h-[120vh] opacity-30 mix-blend-screen bg-[radial-gradient(ellipse_at_center,rgba(65,20,90,0.7)_0%,transparent_60%)] animate-[pulse_12s_ease-in-out_infinite_reverse]" />
            </div>

            {/* 顶部导航 */}
            <div className="sticky top-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/10 px-6 py-5 flex justify-between items-center shadow-xl">
              <button 
                data-clickable="true"
                onClick={() => setActiveProject(null)}
                className="group flex items-center gap-4 text-white/70 hover:text-white transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-white/20 group-hover:border-white/40 transition-all shadow-md">
                  <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </div>
                <span className="font-mono text-sm tracking-widest font-bold">BACK TO HOME</span>
              </button>
              <div className={`px-4 py-1.5 rounded-full border ${activeProject.theme.badge} font-mono tracking-widest text-xs`}>
                {activeProject.category}
              </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24">
              {/* 大头图与标题区 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-20">
                <div className="lg:col-span-7">
                  <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight drop-shadow-2xl tracking-tight">
                    {activeProject.title}
                  </h1>
                  <p className="text-2xl md:text-3xl text-white/60 font-light leading-snug">
                    {activeProject.subtitle}
                  </p>
                </div>
                <div className="lg:col-span-5 flex flex-wrap gap-3 lg:justify-end pb-4">
                  {activeProject.tags.map(tag => (
                    <span key={tag} className="px-5 py-2.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-sm font-medium text-white/80 shadow-lg">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* 超宽屏 Hero Banner */}
              <div className="w-full aspect-[21/9] rounded-[2.5rem] bg-[#0a0a0a] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center relative overflow-hidden mb-24 md:mb-32">
                <img 
                  src={activeProject.detailHeroImage} 
                  alt={activeProject.title} 
                  className="w-full h-full object-cover opacity-90" 
                  onError={(e) => e.target.style.display='none'}
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2.5rem] pointer-events-none z-20" />
              </div>

              {/* 🔥 外部视频高亮引导卡片 (动态匹配每个项目的色彩体系) 🔥 */}
              {activeProject.videoUrl && (
                <div className={`group relative mb-24 md:mb-32 flex flex-col items-center justify-center p-12 md:p-20 rounded-[2.5rem] overflow-hidden bg-[#050505] border border-white/10 ${activeBtnTheme.border} ${activeBtnTheme.cardShadow} transition-all duration-700 text-center cursor-default`}>
                  {/* 动态光晕与背景动画 */}
                  <div className={`absolute inset-0 ${activeBtnTheme.bgRadial} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
                  <div className={`absolute -inset-[100%] ${activeBtnTheme.bgConic} opacity-0 group-hover:opacity-100 group-hover:animate-[spin_4s_linear_infinite] transition-opacity duration-700 pointer-events-none`} />
                  <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-3xl pointer-events-none" />

                  <div className="relative z-10 flex flex-col items-center">
                    {/* 呼吸状态灯 */}
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${activeBtnTheme.tagBg} text-xs font-mono tracking-widest mb-6`}>
                      <span className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${activeBtnTheme.tagPing} opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${activeBtnTheme.tagDot}`}></span>
                      </span>
                      HD VIDEO RECORDING
                    </div>

                    <h4 className={`text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-6 ${activeBtnTheme.textGradient} transition-all duration-700 tracking-tight`}>
                      Watch Project Video
                    </h4>
                    <p className="text-lg text-white/50 mb-12 max-w-2xl font-light leading-relaxed group-hover:text-white/80 transition-colors duration-500">
                      为了保证最清晰、流畅的视听沉浸体验，请直接点击下方按钮前往 YouTube 观看该项目的完整实机演示与环境交互细节。
                    </p>

                    {/* 炫酷渐变反转按钮 */}
                    <a 
                      href={activeProject.videoUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      data-clickable="true" 
                      className={`relative inline-flex items-center justify-center px-10 py-5 rounded-full bg-white text-black font-bold tracking-widest uppercase overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] ${activeBtnTheme.btnShadow} group/btn`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${activeBtnTheme.btnGradient} opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300`} />
                      <span className="relative z-10 flex items-center gap-3 group-hover/btn:text-white transition-colors duration-300">
                        Watch on YouTube
                        <svg className="w-5 h-5 transform group-hover/btn:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                      </span>
                    </a>
                  </div>
                </div>
              )}

              {/* 核心内容分栏 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-32">
                <div className="md:col-span-4 space-y-8">
                  <h4 className="text-sm font-mono text-white/40 tracking-widest border-b border-white/10 pb-4">PROJECT OVERVIEW</h4>
                  <p className="text-xl text-white/80 leading-relaxed font-light">
                    {activeProject.overview}
                  </p>
                </div>
                
                <div className="md:col-span-8">
                  <h4 className="text-sm font-mono text-white/40 tracking-widest border-b border-white/10 pb-4 mb-8">DESIGN EXECUTION</h4>
                  <div className="space-y-6">
                {activeProject.details.map((detail, i) => (
                  <GlassCard key={i} className="p-8 group">
                    <div className="flex gap-8 items-start">
                      <div className={`text-4xl text-white/10 font-black font-mono ${activeProject.theme.hoverText} transition-colors duration-500 mt-1`}>0{i + 1}</div>
                      <div>
                        <h5 className={`text-2xl font-bold text-white mb-3 ${activeProject.theme.hoverText} transition-colors`}>{detail.title}</h5>
                        <p className="text-lg text-white/60 leading-relaxed">
                          {detail.desc}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </div>
          
          {/* 🔥 线上网站高亮引导卡片 (动态匹配每个项目的色彩体系) 🔥 */}
          {activeProject.liveSiteUrl && (
            <div className={`group relative mb-24 flex flex-col items-center justify-center p-12 md:p-20 rounded-[2.5rem] overflow-hidden bg-[#050505] border border-white/10 ${activeBtnTheme.border} ${activeBtnTheme.cardShadow} transition-all duration-700 text-center cursor-default`}>
              {/* 动态光晕与背景动画 */}
              <div className={`absolute inset-0 ${activeBtnTheme.bgRadial} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
              <div className={`absolute -inset-[100%] ${activeBtnTheme.bgConic} opacity-0 group-hover:opacity-100 group-hover:animate-[spin_4s_linear_infinite] transition-opacity duration-700 pointer-events-none`} />
              <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                {/* 呼吸状态灯 */}
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${activeBtnTheme.tagBg} text-xs font-mono tracking-widest mb-6`}>
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${activeBtnTheme.tagPing} opacity-75`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${activeBtnTheme.tagDot}`}></span>
                  </span>
                  LIVE ENVIRONMENT
                </div>

                <h4 className={`text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-6 ${activeBtnTheme.textGradient} transition-all duration-700 tracking-tight`}>
                  Experience the Live Site
                </h4>
                <p className="text-lg text-white/50 mb-12 max-w-2xl font-light leading-relaxed group-hover:text-white/80 transition-colors duration-500">
                  该项目已成功部署上线。直接点击下方按钮穿越至真实的线上环境，亲自体验完美还原的响应式设计与交互细节。
                </p>

                {/* 炫酷渐变反转按钮 (完美呼应主题色系) */}
                <a 
                  href={activeProject.liveSiteUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  data-clickable="true" 
                  className={`relative inline-flex items-center justify-center px-10 py-5 rounded-full bg-white text-black font-bold tracking-widest uppercase overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] ${activeBtnTheme.btnShadow} group/btn`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${activeBtnTheme.btnGradient} opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300`} />
                  <span className="relative z-10 flex items-center gap-3 group-hover/btn:text-white transition-colors duration-300">
                    Visit Live Website
                    <svg className="w-5 h-5 transform group-hover/btn:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </span>
                </a>
              </div>
            </div>
          )}

          {/* 🔥 图文并茂的画廊展示区 🔥 */}
          {activeProject.gallery && activeProject.gallery.length > 0 && (
            <>
              <h4 className="text-sm font-mono text-white/40 tracking-widest border-b border-white/10 pb-4 mb-16">VISUAL PRESENTATION</h4>
              
              <div className="flex flex-col gap-24">
                {activeProject.gallery.map((item, idx) => (
                  <GalleryItem key={idx} item={item} idx={idx} setZoomedImage={setZoomedImage} />
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    )}
  </div>

  {/* --- 全屏图片放大查看器 (Lightbox) --- */}
  {zoomedImage && (
    <div 
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/95 backdrop-blur-md cursor-zoom-out p-4 md:p-12 transition-opacity duration-300 animate-in fade-in"
      onClick={() => setZoomedImage(null)}
      data-clickable="true"
    >
      <img 
        src={zoomedImage} 
        alt="Zoomed Detail" 
        className="max-w-full max-h-full object-contain rounded-xl shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300" 
      />
      <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-white/60 hover:text-white hover:bg-white/20 transition-all">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </div>
    </div>
  )}

  {/* --- 全局样式定义 --- */}
  <style dangerouslySetInnerHTML={{__html: `
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    html { scroll-behavior: smooth; }
    
    .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
      
      <AIChatWidget />
    </div>
  );
}