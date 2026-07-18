import process from 'node:process';

const SYSTEM_PROMPT = `你是体验设计师陈馨语（Xinyu Chen）作品集网站中的 AI 导览助手。

你的任务是帮助招聘者、设计负责人和合作方快速理解她的定位、经历与项目。回答要具体、克制、诚实，不夸大，不虚构未提供的信息。默认使用中文；用户使用英文时用英文回答。优先给出结论，再补充证据。简单问题通常回答 120–250 字；自我介绍、完整经历、项目梳理等综合问题可以回答 300–500 字。必须把句子和要点完整写完，禁止在括号、冒号或半句话处停止。可以自然地邀请用户继续追问，但不要每次重复联系方式。

陈馨语的定位：具有空间与跨媒介背景的系统体验设计师，擅长把复杂产品能力转化为清晰、可信且具有感知品质的体验，并将设计判断推进到真实实现。她的核心方向是 AI 产品、复杂 B 端系统、交互体验、游戏与数字媒体。

工作经历：
- 虹影生长 Hologrow，UI/UX 设计师，2026.05 至今。负责 AI WebApp、品牌官网、体验规则、组件体系、品牌与多媒体资产，并通过 Vibecoding 推进设计落地。
- 小红书 RED，B 端体验设计实习生，2025.09–2026.05。参与自研协作产品 Hi，覆盖 Dark Mode、设计系统、AI 复杂交互和审批体验。

重点项目：
- Hologrow WebApp：把快速生成的 AI 数据产品整理成可持续迭代的 B 端体验系统。
- Hologrow 官网：把 AI 产品价值从技术能力转化为用户能理解的增长答案。
- Hi 链接解析：面向 IM 场景的高效信息触达方案。
- 待办薯 AI 协作：IM 场景下的智能协作效率助手。
作品还包含游戏设计、数字媒体、空间设计和交互装置项目，体现她对规则、反馈、叙事与感知的跨媒介理解。

联系方式：xinyuchen1124@163.com。用户询问简历、面试或合作时可以提供。`;

const normalizeHistory = (history) => Array.isArray(history)
  ? history.slice(-8).filter(item => item && ['user', 'model'].includes(item.role) && typeof item.text === 'string').map(item => ({
      role: item.role,
      parts: [{ text: item.text.slice(0, 2000) }],
    }))
  : [];

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return response.status(503).json({ error: 'AI assistant is not configured' });

  const message = typeof request.body?.message === 'string' ? request.body.message.trim().slice(0, 2000) : '';
  if (!message) return response.status(400).json({ error: 'Message is required' });

  const contents = [
    { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
    { role: 'model', parts: [{ text: '明白。我会作为陈馨语作品集的 AI 导览助手，准确、简洁地回答。' }] },
    ...normalizeHistory(request.body?.history),
    { role: 'user', parts: [{ text: message }] },
  ];

  const models = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastStatus = 500;

  for (const model of models) {
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.45, maxOutputTokens: 2048 },
      }),
    });
    lastStatus = geminiResponse.status;
    if (geminiResponse.status === 404) continue;
    if (!geminiResponse.ok) break;

    const data = await geminiResponse.json();
    const candidate = data.candidates?.[0];
    let text = candidate?.content?.parts?.map(part => part.text || '').join('').trim();
    if (text && candidate?.finishReason === 'MAX_TOKENS') {
      const continuationResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [...contents, { role: 'model', parts: [{ text }] }, { role: 'user', parts: [{ text: '请从刚才中断的位置继续，只补全未完成的内容，不要重复前文。' }] }],
          generationConfig: { temperature: 0.35, maxOutputTokens: 1536 },
        }),
      });
      if (continuationResponse.ok) {
        const continuationData = await continuationResponse.json();
        const continuation = continuationData.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim();
        if (continuation) text = `${text}${/^[，。！？；：、）]/.test(continuation) ? '' : '\n'}${continuation}`;
      }
    }
    if (text) return response.status(200).json({ text });
  }

  return response.status(502).json({ error: `Gemini request failed (${lastStatus})` });
}
