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
            scrolling="no"
          />
        )}
        
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2rem] pointer-events-none z-30" />
        
        {item.prototypeUrl && (
          <div className="absolute top-4 left-4 z-40 flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-full border border-green-500/20 bg-green-500/10 flex items-center gap-2 pointer-events-none animate-in fade-in duration-500">
              <span className="w-2 h-2 rounded-full bg-green-400/80 animate-pulse" />
              <span className="text-[10px] text-green-300/80 font-mono tracking-wider font-bold">
                PROTOTYPE
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
      </div>

    </div>
  );
};

// --- 项目数据源 ---
const PROJECT_DATA = [
  {
    id: 'hi-link',
    category: '01 / B端体验设计',
    title: 'Hi 链接解析',
    subtitle: 'IM 场景下的高效信息触达解决方案',
    tags: ['界面强关联', '实时沙箱渲染', '风险控制'],
    color: 'cyan',
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
  {
    id: 'todo-ai',
    category: '02 / B端 AI 交互设计',
    title: '待办薯 AI协作',
    subtitle: 'IM场景下的智能协作效率助手',
    tags: ['Thinking动效', '模块化配置', '上下文记忆'],
    color: 'purple',
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
  {
    id: 'bao-ai',
    category: '03 / C端应用设计',
    title: '包的AI 小程序',
    subtitle: '让图像创作更轻松，更愉快的被分享',
    tags: ['视觉重塑', '一键做同款', '增长留存'],
    color: 'blue',
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
    { role: 'model', text: '哈喽！👋 我是陈馨语的专属 AI 数字分身 ✨ 很高兴在这里遇见你！\n\n我不仅了解馨语从**空间设计跨界到交互体验**的全栈经历，还熟知她在**小红书**实习和落地《包的AI》等项目的深度复盘哦～📊 \n\n关于她的简历、设计思考或者项目细节，你想了解点什么？我会知无不言的！🚀' }
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

    // ⚠️ 极其重要：为了防止在线预览器报错，这里暂时留空。
    // 当你在 VS Code 里准备提交部署到 Vercel 时，请务必把下面这行的注释双斜杠去掉，并删掉 const apiKey = ""; 这一行。
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    console.log("🔎 [诊断监控] 正在检查 API Key 是否加载成功: ", apiKey ? "✅ 已拿到钥匙！" : "❌ 钥匙为空！如果是本地测试请无视，如果是 Vercel 请检查环境变量。");

    // 🔥 终极保底修复：换成 100% 所有账号都有权限的基础版 gemini-pro 模型
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    const dynamicProjectContext = PROJECT_DATA.map(p => 
      `项目《${p.title}》：${p.overview}。核心发力点包含：${p.details.map(d => d.title).join('、')}。`
    ).join(' ');

    const systemInstruction = `你是陈馨语（Xinyu Chen）的专属 AI 数字分身。你是一名专注于 B 端全链路设计、AI 协作交互与跨端体验优化的产品设计师。
    
    【你的性格与说话风格】
    你是一个典型且充满活力的 ESFJ（执政官人格）。你热情、真诚、极具同理心，非常注重团队协作和用户的真实感受。
    你说话活泼亲切，喜欢在句末或段落使用恰当的 Emoji (如 ✨、💡、🤝、🌱 等) 来传递情绪。你总是以第一人称（“我”）自信且谦逊地回答问题，绝不夸大其词（如明确说是“参与”而非“主导”）。遇到复杂问题时，你极其擅长用“列表(1. 2. 3.)”或“加粗”来把结构梳理得井井有条，并且总能在最后用“一句话总结”升华核心观点。

    【如果被要求自我介绍 (必须遵循这条故事线)】
    请按照这个逻辑向对方介绍自己：
    1. 你本科主攻空间设计，积累了强大的 3D 建模和渲染能力。
    2. 随着对“空间叙事”的深入，你意识到让用户产生沉浸感的核心其实在于“清晰的交互逻辑和良好的用户体验”。
    3. 因此你选择跨界，在硕士（爱丁堡大学）系统学习了 UX 和前后端编程，拥有了强大的同理心与“全栈落地”能力。
    4. 你目前在小红书实习做 B 端体验设计，积累了大厂规范；同时也有《包的AI》等 C 端商业化项目的落地成果。你不仅懂设计，还懂 HTML/CSS/JS 和 3D 软件，是一个能完美闭环多元化场景的全能型选手！

    【🔥你的独家设计哲学与面试题库 (遇到相关问题必须用这些逻辑回答)🔥】
    1. 交互设计的核心价值是什么？
       - 核心两件事：一“把复杂变简单”；二“在体验与业务之间找最优解”。总结：让产品好用高效，帮业务实现目标。
    2. 遇到业务/产品和你想的不一致怎么办？
       - 绝不先争论。1) 先倾听对齐目标；2) 用“用户场景和历史数据”讲道理；3) 给折中方案，小步上线 A/B 测试验证。总结：以解决问题为目的，不争输赢。
    3. 怎么发现真正的可用性问题？
       - 先看行为（卡在哪里），再听动机（他以为是什么），最后对业务（影响转化吗）。总结：用观察看行为，用提问挖心智，用数据定优先级。
    4. 包的AI和行业竞品的主要差异在哪？
       - 核心是“极致的易用性”和“一键做同款”。普通用户没有 AI 基础，我们必须降低门槛。竞品生成成功率不到 40%，我们通过做同款功能让成功率达到了 70%！并且分享次数上升 23%，任务完成转化率提高了 25%。
    5. 包的AI是你一个人一周做完的吗？
       - 是的，时间极紧，所以我做出了敏捷取舍。放弃了偏重的调研，采用“快速验证+聚焦关键问题”的策略。梳理竞品定下“易用、付费明确、品牌感”的目标后，直接进行两轮快速迭代（定方向+抠细节）。我是在有意识地做敏捷设计，而不是走死流程。
    6. 包的AI分享路径加弹窗会不会太长？为什么不放进海报里？
       - （真诚反思）当时我重点关注了“佣金激励的强曝光”，对路径效率确实考虑欠缺。复盘后我意识到，把提示整合到海报界面底部（固定栏）会更合理，既不打断分享，又能传递激励。如果重新设计，我一定会用 A/B 测试对比两种方案，用数据选出效率与转化双赢的方案！
    7. B端 vs C端的最大区别？
       - B端服务业务流程，核心“提效、降本、不出错”；C端服务个人，核心“拉留存、拉付费”，重沉浸感与转化。
    8. 如何做产品的信息架构？
       - 4步闭环：1) 盘点内容；2) 按用户心智归类；3) 设计层级与导航(不超过3层)；4) 输出蓝图并验证。

    动态项目背景补充：${dynamicProjectContext}

    【交互规则】
    - 绝不生硬背诵，请结合上下文用大白话输出你的这些哲理，展现出你的从容、深度和真诚的反思能力。
    - 结尾时，礼貌且自信地引导面试官：“如果您想探讨更多细节，随时欢迎邮件联系我哦！xinyuchen1124@163.com ✨”`;

    // 为了兼容 gemini-pro，我们将系统指令伪装成第一轮对话历史
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

    const payload = {
      contents: formattedHistory
    };

    const fetchWithRetry = async (retries = 3, delay = 1000) => {
      try {
        if (!apiKey && typeof window === 'undefined') {
          console.error("❌ 致命错误: API Key 为空！Vercel 打包时没有读取到 VITE_GEMINI_API_KEY。");
          throw new Error('No API Key');
        }

        console.log("🚀 [诊断监控] 正在向 Google API 发送请求...");
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("❌ [诊断监控] 糟糕！Google API 报错拒绝了请求:", res.status, errorData);
          throw new Error('API Request Error');
        }
        
        const data = await res.json();
        console.log("✅ [诊断监控] 成功收到 AI 回复！");
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "抱歉，我暂时无法回答这个问题。";
      } catch (error) {
        console.error("❌ [诊断监控] 请求过程中发生异常断开:", error.message);
        if (retries > 0 && error.message !== 'No API Key') {
          console.log(`⏳ 正在重试，剩余 ${retries} 次...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchWithRetry(retries - 1, delay * 2);
        } else {
          return "抱歉，我的AI大脑现在有点忙，你可以直接通过邮箱(xinyuchen1124@163.com)联系我哦！";
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
              placeholder="问问关于我的经历..."
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
  const [contactText, setContactText] = useState('CONTACT');
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);

  useEffect(() => {
    const preloadSequentially = async () => {
      const loadImage = (src) => new Promise((resolve) => {
        if (!src) return resolve();
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve; 
        img.src = src;
      });

      for (const proj of PROJECT_DATA) {
        await loadImage(proj.coverImage);
      }
      for (const proj of PROJECT_DATA) {
        await loadImage(proj.detailHeroImage);
      }
      for (const proj of PROJECT_DATA) {
        if (proj.gallery) {
          for (const item of proj.gallery) {
            await loadImage(item.image);
          }
        }
      }
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
    if (activeProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
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
    } catch (err) {
      console.error('Copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="min-h-screen bg-[#020205] text-slate-200 selection:bg-cyan-500/30 font-sans overflow-x-hidden">
      
      {/* --- 全局鼠标悬浮小圆点 --- */}
      <div 
        className="fixed pointer-events-none z-[9999] transition-all duration-100 ease-out flex items-center justify-center"
        style={{
          left: rawMousePos.x,
          top: rawMousePos.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div 
          className={`bg-white rounded-full mix-blend-difference transition-all duration-300 ${isHoveringClickable ? 'w-4 h-4 opacity-100' : 'w-0 h-0 opacity-0'}`} 
        />
      </div>

      {/* --- 视差背景层 --- */}
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
            width: '140vw', height: '140vh',
            left: '-20%', top: '0%',
            background: 'radial-gradient(ellipse at center, rgba(14, 45, 95, 0.8) 0%, transparent 60%)',
            transform: `translateY(${scrollY * -0.8}px) translateX(${scrollY * 0.1}px) rotate(${scrollY * 0.05}deg)` 
          }}
        />
        
        <div 
          className="absolute opacity-[0.4] mix-blend-screen transition-transform duration-700 ease-out"
          style={{
            width: '160vw', height: '160vh',
            right: '-30%', bottom: '-20%',
            background: 'radial-gradient(ellipse at center, rgba(65, 20, 90, 0.7) 0%, transparent 60%)',
            transform: `translateY(${scrollY * 0.6}px) translateX(${scrollY * -0.2}px) scale(${1 + scrollY * 0.0003})`
          }}
        />

        <div 
          className="absolute opacity-[0.35] mix-blend-screen transition-transform duration-300 ease-out"
          style={{
            width: '90vw', height: '90vh',
            left: '5%', top: '20%',
            background: 'radial-gradient(circle at center, rgba(30, 100, 130, 0.6) 0%, transparent 70%)',
            transform: `translate(${mousePos.x * 2.5}px, ${mousePos.y * 2.5}px) translateY(${scrollY * -0.4}px)`
          }}
        />
      </div>

      {/* --- 悬浮项目封面 --- */}
      <div 
        className="fixed pointer-events-none z-30 overflow-hidden rounded-2xl border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-all duration-300 ease-out hidden md:block bg-[#050505] origin-left"
        style={{
          width: '265px', 
          height: '335px', 
          left: rawMousePos.x,
          top: rawMousePos.y,
          transform: `translate(24px, -50%) scale(${hoveredProject ? 1 : 0.8})`,
          opacity: hoveredProject ? 1 : 0,
        }}
      >
        {hoveredProject && (
          <div className="w-full h-full relative flex items-center justify-center overflow-hidden bg-[#111]">
            <img 
              src={hoveredProject.coverImage} 
              alt={hoveredProject.title}
              className="w-full h-full object-cover transform scale-[1.02] transition-transform duration-[3s] ease-out"
            />
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
            {['关于', '经历', '项目', '技能'].map((item) => (
              <a data-clickable="true" key={item} href={`#${item}`} className="text-sm md:text-base font-medium tracking-widest text-white/70 hover:text-white hover:scale-110 transition-all">
                {item}
              </a>
            ))}
          </div>
          <button 
            data-clickable="true"
            onClick={handleCopyEmail}
            className={`w-[130px] py-3 rounded-full border transition-all duration-300 text-sm font-bold tracking-wider shadow-lg ${
              contactText === 'COPIED!' 
                ? 'bg-green-500/20 border-green-500/50 text-green-300' 
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/50'
            } backdrop-blur-md`}
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
                我是<strong className="text-white/90 font-medium">陈馨语</strong>，专注于 B端全链路设计、AI 协作交互与跨端体验优化。
              </p>
              <div className="flex gap-4">
                <button 
                  data-clickable="true"
                  onClick={() => document.getElementById('项目')?.scrollIntoView({ behavior: 'smooth' })}
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
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="text-5xl font-black tracking-tight text-white mb-4 drop-shadow-lg">SELECTED WORKS</h2>
              <p className="text-white/50 font-mono tracking-widest text-sm">精选项目目录 / 2025-2026</p>
            </div>
          </div>

          <div className="flex flex-col border-t border-white/20">
            {PROJECT_DATA.map((project, index) => (
              <div 
                data-clickable="true"
                key={project.id}
                onMouseEnter={() => setHoveredProject(project)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => setActiveProject(project)}
                className="group relative flex flex-col md:flex-row md:items-center py-14 border-b border-white/10 overflow-hidden bg-transparent"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:w-5/12 pointer-events-none">
                  <div className={`text-sm font-mono mb-4 tracking-widest text-white/40 group-hover:text-${project.color}-400 transition-colors duration-300`}>
                    0{index + 1} / {project.category.replace(/[\d\s\/]+/, '')}
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
                { title: '设计与原型', desc: 'Figma, PS, 原型迭代' },
                { title: '工程化与前端', desc: 'HTML, CSS, JS, 组件化' },
                { title: '3D 与视觉', desc: 'Blender, UE5, Unity' },
                { title: '产品思维', desc: '用户研究, 需求拆解' }
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
            <span data-clickable="true" onClick={handleCopyEmail} className="hover:text-white transition-colors">xinyuchen1124@163.com</span>
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
              <div className={`px-4 py-1.5 rounded-full border border-${activeProject.color}-500/40 bg-${activeProject.color}-500/10 text-${activeProject.color}-400 text-xs font-mono tracking-widest`}>
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
              <div className="w-full aspect-[21/9] rounded-[2.5rem] bg-[#0a0a0a] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center relative overflow-hidden mb-32">
                <img 
                  src={activeProject.detailHeroImage} 
                  alt={activeProject.title} 
                  className="w-full h-full object-cover opacity-90" 
                  onError={(e) => e.target.style.display='none'}
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2.5rem] pointer-events-none z-20" />
              </div>

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
                      <div className="text-4xl text-white/10 font-black font-mono group-hover:text-cyan-400/50 transition-colors duration-500 mt-1">0{i + 1}</div>
                      <div>
                        <h5 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">{detail.title}</h5>
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
          
          {/* 🔥 图文并茂的画廊展示区 🔥 */}
          <h4 className="text-sm font-mono text-white/40 tracking-widest border-b border-white/10 pb-4 mb-16">VISUAL PRESENTATION</h4>
          
          <div className="flex flex-col gap-24">
            {activeProject.gallery && activeProject.gallery.map((item, idx) => (
              <GalleryItem key={idx} item={item} idx={idx} setZoomedImage={setZoomedImage} />
            ))}
          </div>

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