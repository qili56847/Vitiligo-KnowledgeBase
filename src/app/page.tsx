"use client";

import { useEffect, useMemo, useState } from "react";

type Filter = "all" | "basics" | "diagnosis" | "treatment" | "care" | "life";

type QaItem = {
  id: string;
  category: Exclude<Filter, "all">;
  keywords: string;
  question: string;
  paragraphs: string[];
  bullets?: string[];
  tags: string[];
};

type PatientMessage = {
  id: string;
  name: string;
  meta: string;
  message: string;
};

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "basics", label: "基础认知" },
  { id: "diagnosis", label: "诊断检查" },
  { id: "treatment", label: "治疗管理" },
  { id: "care", label: "日常护理" },
  { id: "life", label: "生活心理" },
];

const qaItems: QaItem[] = [
  {
    id: "what-is-vitiligo",
    category: "basics",
    keywords: "白癜风 是什么 黑色素 免疫",
    question: "白癜风到底是什么？",
    paragraphs: [
      "白癜风是一种获得性色素脱失性皮肤病，皮肤中的黑色素细胞功能受损或减少后，会出现比周围皮肤更浅或白色的斑片。它可影响任何肤色人群，在深色皮肤上通常更明显。",
    ],
    tags: ["基础认知", "黑色素细胞"],
  },
  {
    id: "infectious-hereditary",
    category: "basics",
    keywords: "传染 遗传 生命危险 感染",
    question: "白癜风会传染吗？会遗传吗？",
    paragraphs: [
      "白癜风不传染，不会因为接触、共用餐具或共同生活传播。它可能与遗传易感性和免疫因素有关，但并不是简单的“父母有，孩子一定有”。有家族史的人风险可能更高，仍需要结合个人情况判断。",
    ],
    tags: ["不传染", "遗传易感"],
  },
  {
    id: "symptoms",
    category: "basics",
    keywords: "症状 白斑 毛发 口腔 对称",
    question: "常见症状有哪些？",
    paragraphs: [
      "典型表现是局部皮肤颜色变浅或变白，常见于手、面部、关节周围、身体开口附近等部位。部分人可出现头发、眉毛、睫毛或胡须提前变白，也可能累及口腔、鼻腔等黏膜区域。",
    ],
    tags: ["症状识别", "白斑"],
  },
  {
    id: "diagnosis",
    category: "diagnosis",
    keywords: "诊断 伍德灯 Wood lamp 皮肤镜 血液检查",
    question: "医生通常如何诊断白癜风？",
    paragraphs: [
      "皮肤科医生通常会询问病史、家族史和白斑变化，并检查皮肤。伍德灯可以帮助观察色素脱失区域，有时还会根据情况安排血液检查、眼科检查或皮肤活检，以排除其他疾病或评估伴随问题。",
    ],
    tags: ["伍德灯", "皮肤科"],
  },
  {
    id: "differential",
    category: "diagnosis",
    keywords: "花斑癣 贫血痣 炎症后色素减退 鉴别",
    question: "皮肤变白就一定是白癜风吗？",
    paragraphs: [
      "不一定。花斑癣、炎症后色素减退、贫血痣、无色素痣等也可能出现浅色斑。单靠照片或肉眼自查容易误判，建议由皮肤科医生结合检查确认。",
    ],
    tags: ["鉴别诊断", "误判风险"],
  },
  {
    id: "treatment-options",
    category: "treatment",
    keywords: "治疗 外用药 光疗 激素 钙调神经磷酸酶 JAK",
    question: "白癜风有哪些治疗方式？",
    paragraphs: [
      "常见管理方式包括外用药物、光疗、局部遮盖产品、部分稳定期病例的手术治疗等。医生会根据年龄、部位、范围、进展速度、合并疾病和个人需求制定方案。治疗可能需要数月观察效果，不建议频繁自行更换方案。",
    ],
    bullets: [
      "外用药物：需按医生指导使用，关注适用部位和副作用。",
      "光疗：适合部分患者，需要规律治疗和防护。",
      "遮盖或自晒产品：可改善外观差异，但不等同于治疗病因。",
    ],
    tags: ["个体化治疗", "光疗"],
  },
  {
    id: "curable",
    category: "treatment",
    keywords: "能治好吗 复色 复发 慢性",
    question: "白癜风能完全治好吗？",
    paragraphs: [
      "白癜风目前没有对所有人都稳定有效的“根治法”。一些患者能获得明显复色或进展控制，也有人复色有限或之后复发。合理目标通常是减少扩散、促进复色、降低日晒损伤并改善生活质量。",
    ],
    tags: ["治疗预期", "长期管理"],
  },
  {
    id: "sun-protection",
    category: "care",
    keywords: "防晒 紫外线 SPF 晒伤 衣物",
    question: "日常防晒为什么重要？",
    paragraphs: [
      "色素脱失区域更容易晒伤。防晒还能减少周围正常皮肤晒黑后造成的色差加重。可使用广谱、防水、SPF 30 或以上的防晒产品，并配合遮阳、衣物和避开强日晒时段。",
    ],
    tags: ["防晒", "晒伤预防"],
  },
  {
    id: "diet",
    category: "care",
    keywords: "饮食 忌口 维生素 偏方",
    question: "饮食上需要严格忌口吗？",
    paragraphs: [
      "没有可靠证据支持所有白癜风患者都必须长期严格忌口。更重要的是均衡饮食、避免因偏方或过度忌口造成营养问题。若存在明确过敏、胃肠疾病或特殊用药限制，应按医生建议调整。",
    ],
    tags: ["饮食", "避免偏方"],
  },
  {
    id: "mental-health",
    category: "life",
    keywords: "心理 压力 自卑 儿童 社交",
    question: "白癜风带来的心理压力怎么处理？",
    paragraphs: [
      "外观变化可能带来自卑、焦虑或社交压力，这些感受值得被认真对待。可以与医生讨论遮盖、治疗预期和心理支持；儿童患者还需要家长和学校共同减少误解、嘲笑和过度关注。",
    ],
    tags: ["心理支持", "儿童关怀"],
  },
  {
    id: "when-to-see-doctor",
    category: "life",
    keywords: "什么时候就医 快速扩大 眼睛 甲状腺",
    question: "哪些情况建议尽快就医？",
    paragraphs: [
      "新出现不明白斑、白斑快速扩大、儿童或青少年发病、毛发变白、伴眼部不适，或已有甲状腺等自身免疫病史时，建议尽快看皮肤科。越早明确诊断，越容易制定合适的管理计划。",
    ],
    tags: ["就医信号", "早诊断"],
  },
];

const quickNotes = [
  "白斑第一次出现的时间、是否扩大、是否对称。",
  "近期晒伤、皮肤外伤、精神压力或接触刺激物情况。",
  "家族中是否有人有白癜风或甲状腺等自身免疫疾病。",
  "已经用过的药物、偏方、光疗或遮盖产品。",
];

const pathway = [
  ["Step 01", "确认变化", "拍照记录位置、大小、颜色变化和诱因，避免只凭记忆描述。"],
  ["Step 02", "皮肤科评估", "医生可能使用伍德灯，并根据情况安排血液检查或其他检查。"],
  ["Step 03", "制定目标", "明确是控制进展、促进复色、减少色差，还是优先改善心理压力。"],
  ["Step 04", "定期复盘", "按周期评估疗效和副作用，不自行叠加偏方或长期滥用药物。"],
];

const initialMessages: PatientMessage[] = [
  {
    id: "message-1",
    name: "李女士",
    meta: "就诊准备 · 复诊记录",
    message: "第一次去皮肤科前，我把白斑出现的时间、最近有没有晒伤和每周照片都按日期整理好。医生能很快看出变化速度，也更容易判断是否需要伍德灯和进一步检查。",
  },
  {
    id: "message-2",
    name: "患者家属",
    meta: "儿童护理 · 家校沟通",
    message: "孩子治疗期间，除了按时涂药和复诊，我们发现稳定作息、减少抓挠和向老师说明情况都很重要。同学理解之后，孩子在学校里被反复追问的压力小了很多。",
  },
  {
    id: "message-3",
    name: "匿名留言",
    meta: "日常防晒 · 夏季经验",
    message: "坚持防晒后，白斑和周围皮肤的色差没有夏天那么明显。现在出门会提前涂广谱防晒，长时间户外再加遮阳帽和薄外套，心里也踏实一些。",
  },
  {
    id: "message-4",
    name: "周先生",
    meta: "治疗复盘 · 光疗坚持",
    message: "刚开始治疗时总想很快看到变化，后来医生提醒要按周期复盘。我把用药、光疗日期和皮肤反应记在手机里，复诊时能更准确地讨论效果和副作用。",
  },
  {
    id: "message-5",
    name: "匿名患者",
    meta: "心理支持 · 社交压力",
    message: "脸上白斑明显时，我一度不太想参加聚会。后来和医生讨论遮盖产品，也和家人说清自己的焦虑，慢慢能把注意力放回工作和生活本身。",
  },
  {
    id: "message-6",
    name: "王女士",
    meta: "饮食生活 · 避免偏方",
    message: "我以前听过很多忌口和偏方，越查越焦虑。现在主要做均衡饮食、规律睡眠和按医嘱治疗，不再随便叠加刺激性产品，皮肤状态反而更稳定。",
  },
];

function normalizeText(value: string) {
  return value.toLowerCase().trim();
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;

  const lower = text.toLowerCase();
  const index = lower.indexOf(query);
  if (index === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, index)}
      <mark className="highlight">{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
}

function Header() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand" aria-label="白癜风问答知识库">
          <div className="brand-mark" aria-hidden="true" />
          <div>
            <strong>白癜风问答知识库</strong>
            <span>Vitiligo Q&A Library</span>
          </div>
        </div>
        <nav className="nav" aria-label="页面导航">
          <a href="#faq">常见问题</a>
          <a href="#messages">患者留言</a>
          <a href="#pathway">就诊流程</a>
          <a href="#sources">参考来源</a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">面向患者与家属的科普页面</span>
        <h1>用问答方式快速理解白癜风</h1>
        <p className="lead">
          围绕症状识别、诊断检查、治疗选择、日常护理和心理支持整理关键问题。内容基于公开医学资料，帮助你更高效地准备皮肤科就诊沟通。
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#faq">
            浏览问答
          </a>
          <a className="button button-secondary" href="#pathway">
            查看就诊准备
          </a>
        </div>
      </div>

      <aside className="hero-panel" aria-label="白癜风核心事实">
        <div className="skin-map" aria-hidden="true">
          <span className="map-dot dot-a" />
          <span className="map-dot dot-b" />
        </div>
        <div className="panel-body">
          <h2>先记住这三点</h2>
          <ul className="fact-list">
            <li>
              <b>1</b>
              <span>白癜风通常表现为边界较清楚的浅色或白色斑片，可发生在皮肤、毛发或黏膜区域。</span>
            </li>
            <li>
              <b>2</b>
              <span>它不具有传染性，也不直接危及生命，但可能影响外观、日晒风险和心理状态。</span>
            </li>
            <li>
              <b>3</b>
              <span>治疗目标多为控制进展、促进复色和改善生活质量，方案需要医生个体化评估。</span>
            </li>
          </ul>
        </div>
      </aside>
    </section>
  );
}

function DiagnosisSvg() {
  return (
    <svg viewBox="0 0 520 320" role="img" aria-label="白癜风诊断流程">
      <rect width="520" height="320" fill="#f5faf8" />
      <rect x="24" y="22" width="472" height="276" rx="18" fill="#ffffff" stroke="#d9e3df" />
      <text x="46" y="56" fill="#16302b" fontSize="22" fontWeight="800">白癜风诊断流程</text>
      <text x="46" y="82" fill="#64736f" fontSize="13">从病史到辅助检查，重点是确认与鉴别</text>
      <rect x="44" y="112" width="120" height="64" rx="12" fill="#eef6f3" stroke="#b8cbc5" />
      <text x="64" y="139" fill="#075f55" fontSize="15" fontWeight="800">病史记录</text>
      <text x="64" y="162" fill="#405853" fontSize="12">时间 / 扩大 / 诱因</text>
      <path d="M174 144h34" stroke="#087f6f" strokeWidth="4" strokeLinecap="round" />
      <path d="M202 136l10 8-10 8" fill="none" stroke="#087f6f" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="222" y="112" width="120" height="64" rx="12" fill="#fff7ef" stroke="#f0d6bc" />
      <text x="242" y="139" fill="#a35420" fontSize="15" fontWeight="800">面诊查体</text>
      <text x="242" y="162" fill="#405853" fontSize="12">形态 / 边界 / 部位</text>
      <path d="M352 144h34" stroke="#087f6f" strokeWidth="4" strokeLinecap="round" />
      <path d="M380 136l10 8-10 8" fill="none" stroke="#087f6f" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="400" y="112" width="72" height="64" rx="12" fill="#16302b" />
      <circle cx="436" cy="144" r="20" fill="#ffffff" opacity="0.9" />
      <circle cx="436" cy="144" r="11" fill="#5ad4c5" opacity="0.58" />
      <text x="408" y="199" fill="#075f55" fontSize="13" fontWeight="800">伍德灯观察</text>
      <InfoBox x={55} label="鉴别诊断" note="花斑癣等" number="1" />
      <InfoBox x={199} label="伴随评估" note="甲状腺 / 眼部" number="2" />
      <InfoBox x={343} label="分期分型" note="稳定期 / 进展期" number="3" />
    </svg>
  );
}

function InfoBox({ x, label, note, number }: { x: number; label: string; note: string; number: string }) {
  return (
    <>
      <rect x={x} y="216" width="126" height="48" rx="10" fill="#ffffff" stroke="#d9e3df" />
      <circle cx={x + 23} cy="240" r="12" fill="#087f6f" />
      <text x={x + 19} y="245" fill="#ffffff" fontSize="12" fontWeight="800">{number}</text>
      <text x={x + 43} y="236" fill="#16302b" fontSize="13" fontWeight="800">{label}</text>
      <text x={x + 43} y="256" fill="#64736f" fontSize="11">{note}</text>
    </>
  );
}

function TreatmentSvg() {
  return (
    <svg viewBox="0 0 520 320" role="img" aria-label="治疗方案怎么选">
      <rect width="520" height="320" fill="#f5faf8" />
      <rect x="24" y="22" width="472" height="276" rx="18" fill="#ffffff" stroke="#d9e3df" />
      <text x="46" y="56" fill="#16302b" fontSize="22" fontWeight="800">治疗方案怎么选</text>
      <text x="46" y="82" fill="#64736f" fontSize="13">按阶段、部位、面积和个人情况组合管理</text>
      <TreatmentCard x={46} title="控制进展" desc="进展期优先" color="#087f6f" bg="#eef6f3" stroke="#b8cbc5" />
      <TreatmentCard x={194} title="促进复色" desc="外用药 / 光疗" color="#d9863d" bg="#fff7ef" stroke="#f0d6bc" />
      <TreatmentCard x={342} title="改善外观" desc="遮盖 / 稳定期手术" color="#087f6f" bg="#eef6f3" stroke="#b8cbc5" />
      <rect x="48" y="220" width="424" height="42" rx="12" fill="#fbfdfc" stroke="#d9e3df" />
      <text x="70" y="246" fill="#16302b" fontSize="14" fontWeight="800">复盘周期</text>
      <circle cx="178" cy="241" r="8" fill="#087f6f" />
      <path d="M186 241h70" stroke="#b8cbc5" strokeWidth="4" strokeLinecap="round" />
      <circle cx="266" cy="241" r="8" fill="#087f6f" />
      <path d="M274 241h70" stroke="#b8cbc5" strokeWidth="4" strokeLinecap="round" />
      <circle cx="354" cy="241" r="8" fill="#087f6f" />
      <text x="160" y="279" fill="#64736f" fontSize="12">开始</text>
      <text x="238" y="279" fill="#64736f" fontSize="12">4-8 周</text>
      <text x="327" y="279" fill="#64736f" fontSize="12">数月评估</text>
    </svg>
  );
}

function TreatmentCard({ x, title, desc, color, bg, stroke }: { x: number; title: string; desc: string; color: string; bg: string; stroke: string }) {
  return (
    <>
      <rect x={x} y="112" width="132" height="76" rx="13" fill={bg} stroke={stroke} />
      <text x={x + 22} y="141" fill={color} fontSize="16" fontWeight="800">{title}</text>
      <text x={x + 22} y="164" fill="#405853" fontSize="12">{desc}</text>
      <rect x={x + 22} y="174" width="76" height="5" rx="2.5" fill={color} opacity="0.72" />
    </>
  );
}

function CareSvg() {
  return (
    <svg viewBox="0 0 520 320" role="img" aria-label="日常护理清单">
      <rect width="520" height="320" fill="#f5faf8" />
      <rect x="24" y="22" width="472" height="276" rx="18" fill="#ffffff" stroke="#d9e3df" />
      <text x="46" y="56" fill="#16302b" fontSize="22" fontWeight="800">日常护理清单</text>
      <text x="46" y="82" fill="#64736f" fontSize="13">防晒、防刺激、均衡生活和心理支持一起做</text>
      <rect x="48" y="112" width="126" height="136" rx="14" fill="#fff7ef" stroke="#f0d6bc" />
      <circle cx="111" cy="154" r="24" fill="#ffd89a" />
      <path d="M111 120v14M111 174v14M77 154h14M131 154h14" stroke="#d9863d" strokeWidth="4" strokeLinecap="round" />
      <text x="78" y="211" fill="#a35420" fontSize="15" fontWeight="800">防晒</text>
      <text x="68" y="232" fill="#405853" fontSize="12">SPF 30+ / 遮挡</text>
      <rect x="198" y="112" width="126" height="136" rx="14" fill="#eef6f3" stroke="#b8cbc5" />
      <path d="M236 156c18-24 58-18 64 10 7 34-36 53-62 31-15-13-15-27-2-41Z" fill="#f0dfd5" stroke="#d8c5bb" />
      <path d="M251 168c12-11 31-6 33 10 3 16-18 26-31 15-8-7-8-17-2-25Z" fill="#ffffff" />
      <path d="M222 132l78 78" stroke="#d9863d" strokeWidth="6" strokeLinecap="round" />
      <text x="228" y="211" fill="#075f55" fontSize="15" fontWeight="800">少刺激</text>
      <text x="218" y="232" fill="#405853" fontSize="12">摩擦 / 晒伤 / 抓挠</text>
      <rect x="348" y="112" width="126" height="136" rx="14" fill="#eef6f3" stroke="#b8cbc5" />
      <circle cx="411" cy="148" r="26" fill="#087f6f" opacity="0.16" />
      <path d="M392 150c8 17 30 20 42 3" fill="none" stroke="#087f6f" strokeWidth="5" strokeLinecap="round" />
      <circle cx="399" cy="142" r="4" fill="#075f55" />
      <circle cx="423" cy="142" r="4" fill="#075f55" />
      <rect x="376" y="184" width="70" height="12" rx="6" fill="#d9863d" opacity="0.72" />
      <text x="381" y="211" fill="#075f55" fontSize="15" fontWeight="800">心理支持</text>
      <text x="370" y="232" fill="#405853" fontSize="12">沟通 / 睡眠 / 社交</text>
      <rect x="70" y="266" width="380" height="14" rx="7" fill="#d9e3df" />
      <rect x="70" y="266" width="248" height="14" rx="7" fill="#087f6f" />
      <text x="70" y="292" fill="#64736f" fontSize="12">护理目标：减少伤害，支持长期治疗</text>
    </svg>
  );
}

function MisconceptionSvg() {
  return (
    <svg viewBox="0 0 520 320" role="img" aria-label="白癜风患者常见误区">
      <rect width="520" height="320" fill="#f5faf8" />
      <rect x="24" y="22" width="472" height="276" rx="18" fill="#ffffff" stroke="#d9e3df" />
      <text x="46" y="56" fill="#16302b" fontSize="22" fontWeight="800">患者常见误区</text>
      <text x="46" y="82" fill="#64736f" fontSize="13">把传言和事实分开，减少无效焦虑与错误处理</text>

      <rect x="48" y="112" width="128" height="126" rx="14" fill="#fff7ef" stroke="#f0d6bc" />
      <circle cx="112" cy="150" r="28" fill="#ffd89a" opacity="0.9" />
      <path d="M93 133l38 38M131 133l-38 38" stroke="#d9863d" strokeWidth="7" strokeLinecap="round" />
      <text x="74" y="202" fill="#a35420" fontSize="15" fontWeight="800">会传染？</text>
      <text x="66" y="224" fill="#405853" fontSize="12">接触不会传播</text>

      <rect x="196" y="112" width="128" height="126" rx="14" fill="#eef6f3" stroke="#b8cbc5" />
      <path d="M233 154c0-22 18-40 40-40s40 18 40 40-18 40-40 40-40-18-40-40Z" fill="#087f6f" opacity="0.14" />
      <path d="M252 155l14 14 30-36" fill="none" stroke="#087f6f" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <text x="220" y="202" fill="#075f55" fontSize="15" fontWeight="800">只能忌口？</text>
      <text x="214" y="224" fill="#405853" fontSize="12">均衡饮食更重要</text>

      <rect x="344" y="112" width="128" height="126" rx="14" fill="#f8fbfa" stroke="#d9e3df" />
      <path d="M388 134h40c10 0 18 8 18 18v18c0 10-8 18-18 18h-40c-10 0-18-8-18-18v-18c0-10 8-18 18-18Z" fill="#ffffff" stroke="#b8cbc5" strokeWidth="3" />
      <path d="M383 162h50" stroke="#d9863d" strokeWidth="6" strokeLinecap="round" />
      <path d="M408 137v50" stroke="#087f6f" strokeWidth="6" strokeLinecap="round" />
      <text x="372" y="202" fill="#075f55" fontSize="15" fontWeight="800">偏方根治？</text>
      <text x="364" y="224" fill="#405853" fontSize="12">先问诊再决定</text>

      <rect x="70" y="262" width="380" height="16" rx="8" fill="#d9e3df" />
      <rect x="70" y="262" width="284" height="16" rx="8" fill="#087f6f" />
      <text x="70" y="292" fill="#64736f" fontSize="12">遇到快速扩大、疼痒或用药不适，应及时复诊</text>
    </svg>
  );
}

const slides = [
  {
    label: "诊断检查",
    title: "先确认白斑性质，再进入治疗决策",
    desc: "诊断不是只看“皮肤变白”。医生会把白斑形态、发展速度、诱因、家族史和辅助检查放在一起判断，同时排除花斑癣、贫血痣、炎症后色素减退等相似疾病。",
    points: [
      "就诊前记录白斑首次出现时间、是否扩大、是否对称，以及晒伤、外伤、压力等诱因。",
      "常用检查包括皮肤科查体、伍德灯、皮肤镜；必要时评估甲状腺等自身免疫相关问题。",
      "若白斑快速扩大、儿童发病、毛发变白或部位特殊，建议尽快面诊确认。",
    ],
    visual: <DiagnosisSvg />,
  },
  {
    label: "治疗管理",
    title: "治疗重点是分期、分区和长期复盘",
    desc: "白癜风治疗没有一个方案适合所有人。外用药、光疗、遮盖产品和稳定期手术各有适用条件，医生通常会根据进展期或稳定期、面积大小、面颈/手足等部位差异制定计划。",
    points: [
      "进展期通常更重视控制扩散；稳定期可进一步讨论促进复色和外观改善。",
      "外用药和光疗需要规律执行，通常以数月为周期评估，不宜短期频繁换方案。",
      "面部、黏膜、儿童、孕期或合并其他疾病时，用药选择和监测需要更谨慎。",
    ],
    visual: <TreatmentSvg />,
  },
  {
    label: "日常护理",
    title: "护理要同时照顾皮肤、生活和情绪",
    desc: "护理不是“忌口越多越好”，而是减少晒伤和刺激、保持均衡生活，并把外观变化带来的压力纳入管理。儿童和青少年尤其需要家庭与学校的理解支持。",
    points: [
      "防晒建议选择广谱 SPF 30 或以上，并结合遮阳帽、长袖衣物和避开强日晒时段。",
      "避免白斑区域反复摩擦、抓挠、烫伤或过度刺激，外用产品先小范围观察。",
      "饮食以均衡为主，不盲目偏方；焦虑、回避社交或睡眠变差时应主动寻求支持。",
    ],
    visual: <CareSvg />,
  },
  {
    label: "患者误区",
    title: "别让传言打乱判断和治疗节奏",
    desc: "白癜风相关信息很多，但“会传染”“必须极端忌口”“偏方能根治”等说法容易让患者错过规范评估。更稳妥的做法是把症状变化、用药反应和生活诱因记录下来，和医生一起复盘。",
    points: [
      "白癜风不通过接触传播，不需要因为共餐、握手或共同生活而隔离患者。",
      "不建议盲目长期忌口或依赖偏方，饮食、补剂和外用产品最好结合个人情况确认。",
      "看到白斑扩大、颜色变化或治疗后刺激反应时，及时复诊比自行频繁换方案更可靠。",
    ],
    visual: <MisconceptionSvg />,
  },
];

function KnowledgeCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setCurrentSlide((slide) => (slide + 1) % slides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [currentSlide, isPaused]);

  const goToSlide = (index: number) => {
    setCurrentSlide((index + slides.length) % slides.length);
  };

  return (
    <section
      className="qa-carousel"
      aria-label="白癜风诊断、治疗和护理轮播图"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="carousel-viewport">
        <div className="carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {slides.map((slide) => (
            <article className="carousel-slide" aria-label={slide.label} key={slide.label}>
              <div className="carousel-copy">
                <span className="carousel-kicker">{slide.label}</span>
                <h2>{slide.title}</h2>
                <p>{slide.desc}</p>
                <ul className="carousel-points">
                  {slide.points.map((point, index) => (
                    <li key={point}>
                      <b>{index + 1}</b>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="carousel-visual" aria-hidden="true">
                {slide.visual}
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="carousel-controls">
        <button className="carousel-button" type="button" aria-label="上一张" onClick={() => goToSlide(currentSlide - 1)}>
          ‹
        </button>
        <div className="carousel-dots" aria-label="轮播图分页">
          {slides.map((slide, index) => (
            <button
              className={`carousel-dot${index === currentSlide ? " active" : ""}`}
              type="button"
              aria-label={`查看第 ${index + 1} 张轮播图`}
              aria-current={index === currentSlide ? "true" : "false"}
              onClick={() => goToSlide(index)}
              key={slide.label}
            />
          ))}
        </div>
        <button className="carousel-button" type="button" aria-label="下一张" onClick={() => goToSlide(currentSlide + 1)}>
          ›
        </button>
      </div>
    </section>
  );
}

function QaSection() {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(() => new Set(["what-is-vitiligo"]));
  const normalizedQuery = normalizeText(query);

  const visibleItems = useMemo(() => {
    return qaItems.filter((item) => {
      const categoryMatch = activeFilter === "all" || item.category === activeFilter;
      const haystack = normalizeText(`${item.question} ${item.paragraphs.join(" ")} ${item.bullets?.join(" ") ?? ""} ${item.keywords}`);
      return categoryMatch && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [activeFilter, normalizedQuery]);

  const toggleItem = (id: string) => {
    setOpenItems((items) => {
      const next = new Set(items);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section id="faq" aria-labelledby="faq-title">
      <div className="section-head">
        <div>
          <h2 id="faq-title">常见问题</h2>
          <p>可按主题筛选，也可搜索关键词，例如“传染”“伍德灯”“光疗”“防晒”。</p>
        </div>
      </div>

      <div className="tools">
        <label className="search-wrap" htmlFor="searchInput">
          <input id="searchInput" type="search" placeholder="搜索问题或答案" autoComplete="off" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <div className="chips" aria-label="问题分类">
          {filters.map((filter) => (
            <button
              className={`chip${activeFilter === filter.id ? " active" : ""}`}
              data-filter={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              key={filter.id}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="content-grid">
        <div>
          <div className="qa-list" id="qaList">
            {visibleItems.map((item) => {
              const isOpen = openItems.has(item.id);
              return (
                <article className={`qa-item${isOpen ? " open" : ""}`} data-category={item.category} data-keywords={item.keywords} key={item.id}>
                  <button className="qa-question" type="button" aria-expanded={isOpen} onClick={() => toggleItem(item.id)}>
                    <span><HighlightedText text={item.question} query={normalizedQuery} /></span>
                    <i className="qa-toggle" aria-hidden="true" />
                  </button>
                  <div className="qa-answer">
                    {item.paragraphs.map((paragraph) => (
                      <p key={paragraph}><HighlightedText text={paragraph} query={normalizedQuery} /></p>
                    ))}
                    {item.bullets && (
                      <ul>
                        {item.bullets.map((bullet) => (
                          <li key={bullet}><HighlightedText text={bullet} query={normalizedQuery} /></li>
                        ))}
                      </ul>
                    )}
                    <div className="tag-row">
                      {item.tags.map((tag) => (
                        <span className="tag" key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          {visibleItems.length === 0 && <div className="empty-state" id="emptyState">没有找到匹配内容。可以换一个关键词，例如“光疗”“传染”“防晒”。</div>}
        </div>

        <aside className="side-stack" aria-label="辅助信息">
          <div className="side-card">
            <h3>就诊前可记录</h3>
            <ul className="quick-list">
              {quickNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>

          <div className="source-card" id="sources">
            <h3>参考来源</h3>
            <a href="https://www.aad.org/public/diseases/a-z/vitiligo-treatment" target="_blank" rel="noreferrer">American Academy of Dermatology：诊断与治疗</a>
            <a href="https://www.mayoclinic.org/diseases-conditions/vitiligo/symptoms-causes/syc-20355912" target="_blank" rel="noreferrer">Mayo Clinic：症状与原因</a>
            <a href="https://www.mayoclinic.org/diseases-conditions/vitiligo/diagnosis-treatment/drc-20355916" target="_blank" rel="noreferrer">Mayo Clinic：自我护理</a>
            <a href="https://www.niams.nih.gov/health-topics/vitiligo/diagnosis-treatment-and-steps-to-take" target="_blank" rel="noreferrer">NIAMS：诊断、治疗与行动建议</a>
          </div>
        </aside>
      </div>
    </section>
  );
}

function PatientMessages() {
  const [messages, setMessages] = useState<PatientMessage[]>(initialMessages);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (isPaused || messages.length <= 1) return;
    const timer = window.setInterval(() => {
      setCurrentMessage((index) => (index + 1) % messages.length);
    }, 4800);
    return () => window.clearInterval(timer);
  }, [isPaused, messages.length]);

  const goToMessage = (index: number) => {
    setCurrentMessage((index + messages.length) % messages.length);
  };

  const activeMessage = messages[currentMessage] ?? messages[0];

  const submitMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    setMessages((currentMessages) => [
      {
        id: `message-${Date.now()}`,
        name: name.trim() || "匿名留言",
        meta: "刚刚提交",
        message: trimmedMessage,
      },
      ...currentMessages,
    ]);
    setCurrentMessage(0);
    setName("");
    setMessage("");
  };

  return (
    <section id="messages" aria-labelledby="messages-title">
      <div className="section-head">
        <div>
          <h2 id="messages-title">患者留言</h2>
          <p>分享就诊准备、护理经验或想问医生的问题。请勿填写身份证号、电话、住址等隐私信息。</p>
        </div>
      </div>

      <div className="messages-panel">
        <div
          className="message-carousel"
          aria-label="患者留言轮播"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <div className="message-carousel-viewport">
            <article className="message-card" aria-live="polite" aria-label={`第 ${currentMessage + 1} 条患者留言`} key={activeMessage.id}>
              <div className="message-card-head">
                <div className="message-avatar" aria-hidden="true">
                  {activeMessage.name.slice(0, 1)}
                </div>
                <div className="message-meta">
                  <strong>{activeMessage.name}</strong>
                  <span>{activeMessage.meta}</span>
                </div>
              </div>
              <p>{activeMessage.message}</p>
            </article>
          </div>

          <div className="message-carousel-controls">
            <button className="carousel-button" type="button" aria-label="上一条留言" onClick={() => goToMessage(currentMessage - 1)}>
              ‹
            </button>
            <div className="carousel-dots" aria-label="留言分页">
              {messages.map((item, index) => (
                <button
                  className={`carousel-dot${index === currentMessage ? " active" : ""}`}
                  type="button"
                  aria-label={`查看第 ${index + 1} 条留言`}
                  aria-current={index === currentMessage ? "true" : "false"}
                  onClick={() => goToMessage(index)}
                  key={item.id}
                />
              ))}
            </div>
            <button className="carousel-button" type="button" aria-label="下一条留言" onClick={() => goToMessage(currentMessage + 1)}>
              ›
            </button>
          </div>

          <div className="message-preview-list" aria-label="留言预览">
            {messages.map((item, index) => (
              <button
                className={`message-preview${index === currentMessage ? " active" : ""}`}
                type="button"
                onClick={() => goToMessage(index)}
                key={item.id}
              >
                <div className="message-avatar" aria-hidden="true">
                  {item.name.slice(0, 1)}
                </div>
                <div className="message-meta">
                  <strong>{item.name}</strong>
                  <span>{item.meta}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <form className="message-form" onSubmit={submitMessage}>
          <h3>写一条留言</h3>
          <div className="message-fields">
            <label>
              <span>昵称</span>
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="可留空，默认匿名" maxLength={16} />
            </label>
            <label className="message-textarea-field">
              <span>留言内容</span>
              <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="例如：就诊前我应该准备哪些照片和记录？" maxLength={160} rows={4} />
            </label>
          </div>
          <div className="message-form-footer">
            <small>{message.length}/160</small>
            <button className="button button-primary" type="submit">提交留言</button>
          </div>
        </form>
      </div>
    </section>
  );
}

function PathwaySection() {
  return (
    <section id="pathway" aria-labelledby="pathway-title">
      <div className="section-head">
        <div>
          <h2 id="pathway-title">从发现白斑到管理方案</h2>
          <p>这不是诊疗处方，而是帮助你和医生沟通的思路。</p>
        </div>
      </div>
      <div className="pathway">
        {pathway.map(([step, title, desc]) => (
          <div className="step" key={step}>
            <div className="step-node" aria-hidden="true">{step}</div>
            <div className="step-content">
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <span>白癜风问答知识库</span>
        <span>资料更新：2026-04-30 · 内容需由专业医生结合个人情况判断</span>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <main>
        <div className="notice" role="note">
          <div className="notice-icon" aria-hidden="true">i</div>
          <div>
            <strong>重要提示：</strong>
            本页仅用于健康科普和就诊准备，不能替代皮肤科医生的面诊、检查和治疗建议。若白斑快速扩大、儿童出现白斑、伴有眼部不适或心理压力明显，请尽快就医。
          </div>
        </div>
        <KnowledgeCarousel />
        <QaSection />
        <PathwaySection />
        <PatientMessages />
      </main>
      <Footer />
    </>
  );
}
