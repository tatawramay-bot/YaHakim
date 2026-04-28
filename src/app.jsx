import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { doctors as INITIAL_DOCTORS } from "./data.js";
import { specialties } from "./specialties.js";

/* ─── Design tokens ───────────────────────────────────────────────────────── */
const C = {
  teal:      "#0f766e",
  tealLight: "#14b8a6",
  tealBg:    "#f0fdfa",
  tealDark:  "#0d5954",
  white:     "#ffffff",
  bgSoft:    "#f8fafc",
  bgPage:    "#f1f5f9",
  border:    "rgba(15,23,42,0.10)",
  borderMed: "rgba(15,23,42,0.18)",
  text:      "#0f172a",
  textMid:   "#475569",
  textSoft:  "#94a3b8",
  infoBg:    "#eff6ff",
  infoText:  "#1d4ed8",
  greenBg:   "#dcfce7",
  greenText: "#15803d",
  amberBg:   "#fef3c7",
  amberText: "#92400e",
  panelBg:   "#ffffff",
  overlay:   "rgba(15,23,42,0.45)",
  adminBg:   "#0f172a",
  adminAccent: "#6366f1",
};

/* ─── Placeholder articles ────────────────────────────────────────────────── */
const PLACEHOLDER_ARTICLES = [
  {
    id: "a1",
    title_en: "Understanding Your First Consultation",
    title_ku: "تێگەیشتن لە یەکەمین ئامادەبوون",
    summary_en: "What to expect when visiting a specialist for the first time — questions to ask, documents to bring, and how to make the most of your appointment.",
    summary_ku: "چی چاوەڕوان بکەیت کاتی سەردانی پسپۆڕێک بۆ یەکەمین جار — پرسیارەکانی داوا بکە، بەڵگەنامەکانی بیهێنە، و چۆن زیاترین سوود لە کاتی دیمانەت وەربگرە.",
    category_en: "Patient Guide", category_ku: "ڕێنمایی نەخۆش",
    readTime: 4, icon: "📋",
  },
  {
    id: "a2",
    title_en: "Preventive Health Checkups in Kurdistan",
    title_ku: "تەندروستی پێشگیریانە لە کوردستان",
    summary_en: "A guide to routine screenings and checkups recommended for adults living in the Kurdistan Region, including local resources and healthcare facilities.",
    summary_ku: "ڕێنمایی بۆ شەپۆلەکردنی ئاسایی و تاوتوێی پێشنیارکراو بۆ پیاوسالان لە ناوچەی کوردستان، وەک سەرچاوە و ناوەندەکانی تەندروستی.",
    category_en: "Wellness", category_ku: "چاکی",
    readTime: 6, icon: "🏥",
  },
  {
    id: "a3",
    title_en: "How KCS Scores Are Calculated",
    title_ku: "چۆن نمرەی KCS ژمارەکراوە",
    summary_en: "An explanation of the Knowledge and Community Score system used by Ya Hakeem to rank doctors based on availability, community engagement, and patient feedback.",
    summary_ku: "ڕوونکردنەوەی سیستەمی نمرەی زانیاری و کۆمەڵگە کە یا حەکیم بەکاردەهێنێت بۆ ڕیزبەندی پزیشکان.",
    category_en: "About Ya Hakeem", category_ku: "دەربارەی یا حەکیم",
    readTime: 3, icon: "⭐",
  },
];

/* ─── Initial magazine articles ───────────────────────────────────────────── */
const INITIAL_MAGAZINE = [
  { id:"m1", specialty_ku:"نەشتەرگەری گشتی", specialty_en:"General Surgery",
    title_en:"Advances in Minimally Invasive Surgery", title_ku:"پێشکەوتنەکانی نەشتەرگەری کەم دامەزراو",
    summary_en:"Laparoscopic and robotic techniques are transforming surgical outcomes with faster recovery and fewer complications.",
    summary_ku:"تەکنیکەکانی لاپاراسکۆپیک و ڕۆبۆتیک ئەنجامەکانی نەشتەرگەری دەگۆڕن بە چاکبوونەوەی خێراتر و کێشەکانی کەمتر.",
    category_en:"Surgery", category_ku:"نەشتەرگەری", readTime:7, icon:"🔪", date:"Apr 2025", doctorId: null },
  { id:"m2", specialty_ku:"دڵ و قەستەرە", specialty_en:"Cardiology and Catheterization",
    title_en:"Heart Health in the Modern Age", title_ku:"تەندروستی دڵ لە سەردەمی ئێستا",
    summary_en:"Lifestyle changes, medication advances, and catheterization innovations are saving more cardiac patients than ever.",
    summary_ku:"گۆڕانکارییەکانی شێوازی ژیان، پێشکەوتنەکانی دەرمان، و داهێنانەکانی قەستەرەکردن دڵەکانی نەخۆشانی زیاتر ئینقاز دەدەن.",
    category_en:"Cardiology", category_ku:"پزیشکی دڵ", readTime:5, icon:"❤️", date:"Mar 2025", doctorId: null },
  { id:"m3", specialty_ku:"پێست", specialty_en:"Dermatology",
    title_en:"Skin Conditions in Hot Climates", title_ku:"دۆخەکانی پێست لە ئاووهەوای گەرم",
    summary_en:"Understanding eczema, heat rash, and fungal infections common in the Kurdistan Region and how to prevent them.",
    summary_ku:"تێگەیشتن لە ئیکزیما، قوڕی گەرمی، و ئینفێکشنە فەنگییەکانی باو لە ناوچەی کوردستان.",
    category_en:"Dermatology", category_ku:"پزیشکی پێست", readTime:4, icon:"🧴", date:"Mar 2025", doctorId: null },
  { id:"m4", specialty_ku:"مناڵان و تازە لەدایکبووان", specialty_en:"Pediatrics and Neonatology",
    title_en:"Childhood Vaccination Schedule in Iraq", title_ku:"خشتەی تەڵقەکردنی مناڵان لە عێراق",
    summary_en:"A complete guide to recommended vaccines for children from birth through adolescence, including local availability.",
    summary_ku:"ڕێنمایی تەواو بۆ تەڵقەکانی پێشنیارکراو بۆ مناڵان لە لەدایکبوون بۆ نۆجوانی.",
    category_en:"Pediatrics", category_ku:"مناڵان", readTime:6, icon:"👶", date:"Feb 2025", doctorId: null },
  { id:"m5", specialty_ku:"دەروونی", specialty_en:"Psychiatry",
    title_en:"Mental Health Awareness in Kurdish Communities", title_ku:"هۆشیاری تەندروستی دەروونی لە کۆمەڵگە کوردییەکان",
    summary_en:"Breaking stigmas and building support systems for mental health treatment in the Kurdistan Region.",
    summary_ku:"شکاندنی گریمانەکان و بنیادنانی سیستەمەکانی پشتگیری بۆ چارەسەری تەندروستی دەروونی.",
    category_en:"Mental Health", category_ku:"تەندروستی دەروونی", readTime:8, icon:"🧩", date:"Jan 2025", doctorId: null },
  { id:"m6", specialty_ku:"ژنان و مناڵبوون", specialty_en:"Obstetrics and Gynecology",
    title_en:"Safe Pregnancy Practices for Modern Mothers", title_ku:"کارەکانی دووگیانی سەلامەت بۆ دایکانی سەردەمی ئێستا",
    summary_en:"Prenatal care, nutrition, and regular checkups that support healthy pregnancies and safe deliveries.",
    summary_ku:"چاودێریی پێش مناڵبوون، خواردن، و تاوتوێی بەردەوام کە پشتگیری دووگیانی تەندروست و مناڵبوونی سەلامەت دەکات.",
    category_en:"Women's Health", category_ku:"تەندروستی ژنان", readTime:5, icon:"🤱", date:"Dec 2024", doctorId: null },
];

/* ─── Featured clinics for home page ─────────────────────────────────────── */
const FEATURED_CLINICS = [
  { name:"نەخۆشخانەی چەمچەماڵی تایبەت", city:"چەمچەماڵ", icon:"🏥", color:"#0f766e" },
  { name:"کلینیکی ئەمریکی", city:"سلێمانی", icon:"🏨", color:"#1d4ed8" },
  { name:"نەخۆشخانەی شاناز", city:"سلێمانی", icon:"🏪", color:"#9d174d" },
  { name:"کلینیکی دکتۆر سامی", city:"هەولێر", icon:"🏦", color:"#166534" },
  { name:"ناوەندی پزیشکی ئازادی", city:"دهۆک", icon:"🏛", color:"#92400e" },
  { name:"کلینیکی رۆژهەڵات", city:"کەرکووک", icon:"⚕️", color:"#5b21b6" },
];

/* ─── Translations ────────────────────────────────────────────────────────── */
const T = {
  en: {
    brand:"Ya Hakeem", tag:"Medical Directory",
    search:"Search doctors, specialties, clinics…",
    specialties:"Specialties", clinics:"Clinics",
    allSpec:"All Specialties", allClin:"All Clinics",
    doctor:"Doctor", specialty:"Specialty", city:"City", kcs:"KCS",
    phone:"Phone", fee:"Fee", qual:"Qualifications", na:"N/A",
    toggle:"کوردی", filter:"Filter", docs:"doctors", noResults:"No results found.",
    topDocs:"Top 10 Doctors by KCS", magazine:"Magazine",
    directory:"Directory", home:"Home",
    days:"Schedule", address:"Address", source:"Source",
    viewSource:"View Source", relatedArticles:"Related Articles",
    allArticles:"All Articles", categories:"Categories",
    readMore:"Read more", minRead:"min read",
    allCats:"All Categories",
    citySelect:"Select Your City",
    defaultViewHint:"Showing top 10 doctors by KCS score",
    detectCity:"Use My Location",
    latestArticles:"Latest Articles",
    featuredClinics:"Featured Clinics",
    viewAll:"View All",
    more:"More Articles →",
    admin:"Admin",
    adminTitle:"Admin Panel",
    uploadCSV:"Upload Doctor CSV",
    addArticle:"Add Article",
    dragDrop:"Drag & drop CSV file here, or click to browse",
    csvUploaded:"CSV uploaded & parsed successfully!",
    csvError:"Invalid CSV format. Please check columns.",
    articleTitle:"Article Title (EN)",
    articleTitleKu:"Article Title (KU)",
    articleSummary:"Summary (EN)",
    articleSummaryKu:"Summary (KU)",
    articleCat:"Category (EN)",
    articleCatKu:"Category (KU)",
    articleIcon:"Icon (emoji)",
    articleReadTime:"Read Time (min)",
    articleDate:"Date",
    articleDoctorId:"Linked Doctor ID (optional)",
    submit:"Add Article",
    doctorCount:"Total Doctors",
    articleCount:"Total Articles",
    csvGuide:"CSV columns: id, name, specialty_ku, specialty_en, clinic, city, phone, kcs, fee, days, address, qualifications, source",
    welcome:"Welcome back",
    manageDoctors:"Manage Doctors",
    manageContent:"Manage Content",
  },
  ku: {
    brand:"یا حەکیم", tag:"ڕێنمایی پزیشکی",
    search:"گەڕان بۆ پزیشک، پسپۆڕی، کلینیک…",
    specialties:"پسپۆڕییەکان", clinics:"کلینیکەکان",
    allSpec:"هەموو پسپۆڕییەکان", allClin:"هەموو کلینیکەکان",
    doctor:"پزیشک", specialty:"پسپۆڕی", city:"شار", kcs:"نمرەی بەشداری",
    phone:"تەلەفۆن", fee:"نرخ", qual:"بروانامە", na:"نەدیاری",
    toggle:"English", filter:"فلتەر", docs:"پزیشک", noResults:"هیچ ئەنجامێک نەدۆزرایەوە.",
    topDocs:"باشترین ١٠ پزیشک بەپێی KCS", magazine:"گۆڤار",
    directory:"ڕێنمای", home:"سەرەتا",
    days:"خشتەی کاری", address:"ناونیشان", source:"سەرچاوە",
    viewSource:"بینینی سەرچاوە", relatedArticles:"وتارە پەیوەندیدارەکان",
    allArticles:"هەموو وتارەکان", categories:"بەشەکان",
    readMore:"زیاتر بخوێنەوە", minRead:"خولەک خوێندنەوە",
    allCats:"هەموو بەشەکان",
    citySelect:"شارەکەت هەڵبژێرە",
    defaultViewHint:"نیشاندانی باشترین ١٠ پزیشک بەپێی نمرەی KCS",
    detectCity:"بینینی شارم",
    latestArticles:"دوایین وتارەکان",
    featuredClinics:"کلینیکە تایبەتەکان",
    viewAll:"هەموویان ببینە",
    more:"وتارەکانی زیاتر ←",
    admin:"بەڕێوەبەرایەتی",
    adminTitle:"پانێلی بەڕێوەبەرایەتی",
    uploadCSV:"بارکردنی فایلی CSV",
    addArticle:"زیادکردنی وتار",
    dragDrop:"فایلی CSV ئێرە بکێشەوە، یان کلیک بکە",
    csvUploaded:"فایلی CSV بە سەرکەوتوویی بارکرا!",
    csvError:"فۆرمێتی CSV هەڵەیە. تکایە ستوونەکان بپشکنە.",
    articleTitle:"سەردێڕی وتار (ئینگلیزی)",
    articleTitleKu:"سەردێڕی وتار (کوردی)",
    articleSummary:"کورتەی وتار (ئینگلیزی)",
    articleSummaryKu:"کورتەی وتار (کوردی)",
    articleCat:"بەش (ئینگلیزی)",
    articleCatKu:"بەش (کوردی)",
    articleIcon:"ئایکۆن (ئێموجی)",
    articleReadTime:"کاتی خوێندنەوە (خولەک)",
    articleDate:"بەروار",
    articleDoctorId:"ئایدی پزیشک (ئارەزوومەند)",
    submit:"زیادکردنی وتار",
    doctorCount:"کۆی پزیشکان",
    articleCount:"کۆی وتارەکان",
    csvGuide:"ستوونەکانی CSV: id، name، specialty_ku، specialty_en، clinic، city، phone، kcs، fee، days، address، qualifications، source",
    welcome:"بەخێربێیت",
    manageDoctors:"بەڕێوەبردنی پزیشکان",
    manageContent:"بەڕێوەبردنی ناوەرۆک",
  },
};

/* ─── Cities from data ────────────────────────────────────────────────────── */
const ALL_CITIES = [...new Set(INITIAL_DOCTORS.map(d => d.city).filter(Boolean))].sort();

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function getInitials(name) {
  return name.replace(/^(د\.|دکتۆر[ە]?\s*)/, "").trim()
    .split(" ").slice(0, 2).map(w => w[0] || "").join("");
}
const AVATAR_PALETTES = [
  ["#dbeafe","#1e40af"],["#fce7f3","#9d174d"],["#dcfce7","#166534"],
  ["#fef3c7","#92400e"],["#ede9fe","#5b21b6"],["#ffedd5","#9a3412"],
  ["#fef9c3","#713f12"],["#e0f2fe","#0369a1"],
];
const avatarPalette = id => AVATAR_PALETTES[id % AVATAR_PALETTES.length];

/* ─── KCS badge ───────────────────────────────────────────────────────────── */
function KcsBadge({ score }) {
  const [bg, fg] = score >= 80 ? [C.greenBg, C.greenText]
    : score >= 50 ? [C.infoBg, C.infoText]
    : ["#f1f5f9", C.textSoft];
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:2,
      fontSize:11, fontWeight:700, color:fg, background:bg,
      borderRadius:4, padding:"2px 6px", letterSpacing:"0.02em",
    }}>★ {score}</span>
  );
}

/* ─── Sidebar group — collapsed by default on mobile ─────────────────────── */
function SideGroup({ label, children, isMobile }) {
  const [open, setOpen] = useState(!isMobile);
  // Re-sync when isMobile changes
  useEffect(() => { setOpen(!isMobile); }, [isMobile]);
  return (
    <div style={{ marginBottom:2 }}>
      <button onClick={() => setOpen(p => !p)} style={{
        width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"6px 14px", background:"none", border:"none", cursor:"pointer",
        fontSize:10, fontWeight:700, letterSpacing:"0.08em",
        textTransform:"uppercase", color:C.textSoft,
      }}>
        {label}<span style={{ fontSize:9 }}>{open ? "▴" : "▾"}</span>
      </button>
      {open && children}
    </div>
  );
}

/* ─── Sidebar button ──────────────────────────────────────────────────────── */
function SBtn({ label, active, rtl, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} title={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display:"block", width:"100%", textAlign: rtl ? "right" : "left",
        padding:"5px 14px", fontSize:12.5,
        border:"none", borderRadius:5, cursor:"pointer",
        color: active ? C.infoText : C.text,
        background: active ? C.infoBg : hover ? C.bgSoft : "none",
        fontWeight: active ? 600 : 400,
        whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
        transition:"background 0.1s, color 0.1s",
      }}>
      {label}
    </button>
  );
}

/* ─── Lang button ─────────────────────────────────────────────────────────── */
function LangBtn({ label, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        padding:"5px 13px", fontSize:12, fontWeight:600,
        border:`1px solid ${C.teal}`, borderRadius:7,
        background: hover ? C.teal : "none",
        color: hover ? "#fff" : C.teal,
        cursor:"pointer", whiteSpace:"nowrap",
        transition:"background 0.15s, color 0.15s",
      }}>{label}</button>
  );
}

/* ─── Sliding Detail Panel ────────────────────────────────────────────────── */
function DetailPanel({ item, type, lang, s, rtl, onClose, onGoToMagazine }) {
  const panelRef = useRef(null);
  const isDoc = type === "doctor";
  const isArticle = type === "article";

  useEffect(() => {
    const t = setTimeout(() => {
      if (panelRef.current) panelRef.current.style.transform = "translateX(0)";
    }, 10);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    if (panelRef.current) {
      panelRef.current.style.transform = rtl ? "translateX(-100%)" : "translateX(100%)";
    }
    setTimeout(onClose, 280);
  };

  const specLabel = isDoc ? (lang === "ku" ? item.specialty_ku : (item.specialty_en || item.specialty_ku)) : null;
  const [avatarBg, avatarFg] = isDoc ? avatarPalette(item.id) : ["#e0f2fe","#0369a1"];

  return (
    <>
      <div onClick={handleClose} style={{
        position:"fixed", inset:0, background:C.overlay, zIndex:100,
        animation:"fadeIn 0.2s ease",
      }} />
      <div ref={panelRef} style={{
        position:"fixed", top:0, [rtl?"left":"right"]:0,
        width: Math.min(window.innerWidth, 480),
        height:"100vh", background:C.panelBg,
        zIndex:101, overflowY:"auto",
        boxShadow: rtl ? "4px 0 32px rgba(0,0,0,0.18)" : "-4px 0 32px rgba(0,0,0,0.18)",
        transform: rtl ? "translateX(-100%)" : "translateX(100%)",
        transition:"transform 0.28s cubic-bezier(0.22,1,0.36,1)",
        display:"flex", flexDirection:"column",
      }}>
        {/* Panel header */}
        <div style={{
          padding:"16px 20px 14px", borderBottom:`1px solid ${C.border}`,
          display:"flex", alignItems:"center", gap:12, flexShrink:0,
          background:C.teal, position:"sticky", top:0, zIndex:2,
        }}>
          {isDoc && (
            <div style={{
              width:44, height:44, borderRadius:"50%",
              background:avatarBg, display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:15, fontWeight:700,
              color:avatarFg, flexShrink:0,
            }}>{getInitials(item.name)}</div>
          )}
          {isArticle && (
            <div style={{
              width:44, height:44, borderRadius:10,
              background:"rgba(255,255,255,0.15)", display:"flex",
              alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0,
            }}>{item.icon}</div>
          )}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:15, fontWeight:700, color:"#fff", lineHeight:1.3 }}>
              {isDoc ? item.name : (lang==="ku" ? item.title_ku : item.title_en)}
            </div>
            {isDoc && (
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.75)", marginTop:2 }}>
                {specLabel}
              </div>
            )}
            {isArticle && (
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.75)", marginTop:2 }}>
                {lang==="ku" ? item.category_ku : item.category_en} · {item.readTime} {s.minRead}
              </div>
            )}
          </div>
          <button onClick={handleClose} style={{
            width:32, height:32, borderRadius:8, border:"none",
            background:"rgba(255,255,255,0.15)", color:"#fff",
            cursor:"pointer", fontSize:18, display:"flex",
            alignItems:"center", justifyContent:"center", flexShrink:0,
          }}>×</button>
        </div>

        <div style={{ padding:"20px", flex:1 }}>
          {/* Doctor info */}
          {isDoc && (
            <>
              <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
                <KcsBadge score={item.kcs} />
                <span style={{
                  fontSize:11, background:C.bgSoft, borderRadius:4,
                  padding:"2px 8px", color:C.textMid, border:`1px solid ${C.border}`,
                }}>{item.city}</span>
                {item.fee && (
                  <span style={{
                    fontSize:11, background:C.amberBg, borderRadius:4,
                    padding:"2px 8px", color:C.amberText,
                  }}>{item.fee}</span>
                )}
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <InfoRow label={s.phone} rtl={rtl}>
                  {item.phone
                    ? <a href={`tel:${item.phone}`} style={{ color:C.infoText, textDecoration:"none", fontWeight:600 }}>{item.phone}</a>
                    : <span style={{ color:C.textSoft }}>{s.na}</span>}
                </InfoRow>
                <InfoRow label={s.specialty} rtl={rtl}>
                  <span>{specLabel || s.na}</span>
                </InfoRow>
                <InfoRow label="Clinic" rtl={rtl}>
                  <span>{item.clinic || s.na}</span>
                </InfoRow>
                {item.days && (
                  <InfoRow label={s.days} rtl={rtl}>
                    <span>{item.days}</span>
                  </InfoRow>
                )}
                {item.address && (
                  <InfoRow label={s.address} rtl={rtl}>
                    <span>{item.address}</span>
                  </InfoRow>
                )}
                {item.qualifications && (
                  <InfoRow label={s.qual} rtl={rtl}>
                    <span>{item.qualifications}</span>
                  </InfoRow>
                )}
                {item.source && (
                  <InfoRow label={s.source} rtl={rtl}>
                    <a href={item.source} target="_blank" rel="noopener noreferrer"
                      style={{ color:C.infoText, textDecoration:"none", fontSize:12 }}>
                      {s.viewSource} ↗
                    </a>
                  </InfoRow>
                )}
              </div>

              <div style={{ height:1, background:C.border, margin:"24px 0" }} />

              {/* Related articles */}
              <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase",
                letterSpacing:"0.07em", color:C.textSoft, marginBottom:12 }}>
                {s.relatedArticles}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {PLACEHOLDER_ARTICLES.map(a => (
                  <MiniArticleCard key={a.id} article={a} lang={lang} s={s} />
                ))}
              </div>

              {/* ── Smart Link: More Articles → Magazine pre-filtered by doctor ── */}
              {onGoToMagazine && (
                <button
                  onClick={() => { onGoToMagazine(item.id); handleClose(); }}
                  style={{
                    marginTop:18, width:"100%", padding:"10px 16px",
                    background:C.tealBg, border:`1px solid ${C.tealLight}`,
                    borderRadius:10, cursor:"pointer",
                    color:C.teal, fontWeight:700, fontSize:13,
                    display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                    transition:"background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#ccfbf1"}
                  onMouseLeave={e => e.currentTarget.style.background = C.tealBg}
                >
                  📖 {s.more}
                </button>
              )}
            </>
          )}

          {/* Article full view */}
          {isArticle && (
            <>
              <p style={{
                fontSize:14.5, lineHeight:1.75, color:C.textMid,
                marginBottom:24, background:C.bgSoft,
                borderRadius:10, padding:"14px 16px",
                borderLeft:`3px solid ${C.teal}`,
              }}>
                {lang==="ku" ? item.summary_ku : item.summary_en}
              </p>
              <div style={{
                padding:"16px", background:"#fffbeb",
                borderRadius:10, border:`1px solid #fde68a`,
                fontSize:13, color:"#92400e", lineHeight:1.6,
                marginBottom:24,
              }}>
                📌 {lang==="ku"
                  ? "ئەم وتارە نموونەیەکی پری ناوەرۆکی گۆڤاری یا حەکیمە. ناوەرۆکی تەواو زووبەزوو دەگات."
                  : "This article is a content preview for the Ya Hakeem Magazine. Full content coming soon."}
              </div>
              {item.specialty_ku && (
                <>
                  <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase",
                    letterSpacing:"0.07em", color:C.textSoft, marginBottom:12 }}>
                    {s.relatedArticles}
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {PLACEHOLDER_ARTICLES.map(a => (
                      <MiniArticleCard key={a.id} article={a} lang={lang} s={s} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
    </>
  );
}

function InfoRow({ label, children, rtl }) {
  return (
    <div style={{
      display:"flex", gap:10, fontSize:13.5,
      flexDirection: rtl ? "row-reverse" : "row",
    }}>
      <span style={{
        color:C.textSoft, fontSize:12, whiteSpace:"nowrap",
        minWidth:90, paddingTop:1,
        textAlign: rtl ? "right" : "left",
      }}>{label}</span>
      <span style={{ color:C.text, lineHeight:1.5, flex:1,
        textAlign: rtl ? "right" : "left" }}>
        {children}
      </span>
    </div>
  );
}

function MiniArticleCard({ article, lang, s }) {
  return (
    <div style={{
      display:"flex", gap:10, padding:"10px 12px",
      background:C.bgSoft, borderRadius:8,
      border:`1px solid ${C.border}`, cursor:"default",
      alignItems:"flex-start",
    }}>
      <span style={{ fontSize:18, flexShrink:0 }}>{article.icon}</span>
      <div>
        <div style={{ fontSize:13, fontWeight:600, color:C.text, lineHeight:1.3, marginBottom:3 }}>
          {lang==="ku" ? article.title_ku : article.title_en}
        </div>
        <div style={{ fontSize:11, color:C.textSoft }}>
          {lang==="ku" ? article.category_ku : article.category_en} · {article.readTime} {s.minRead}
        </div>
      </div>
    </div>
  );
}

/* ─── Doctor Card ─────────────────────────────────────────────────────────── */
function DoctorCard({ doc, lang, s, rtl, onClick }) {
  const [hover, setHover] = useState(false);
  const specLabel = lang === "ku" ? doc.specialty_ku : (doc.specialty_en || doc.specialty_ku);
  const [avatarBg, avatarFg] = avatarPalette(doc.id);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? C.tealBg : C.white,
        border:`1px solid ${hover ? C.tealLight : C.border}`,
        borderRadius:12, padding:"14px 16px", cursor:"pointer",
        transition:"all 0.18s ease",
        transform: hover ? "translateY(-2px)" : "none",
        boxShadow: hover ? "0 8px 24px rgba(15,118,110,0.12)" : "0 1px 4px rgba(0,0,0,0.05)",
        display:"flex", flexDirection:"column", gap:10,
      }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{
          width:40, height:40, borderRadius:"50%", background:avatarBg,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:13, fontWeight:700, color:avatarFg, flexShrink:0,
        }}>{getInitials(doc.name)}</div>
        <KcsBadge score={doc.kcs} />
      </div>
      <div>
        <div style={{ fontSize:14, fontWeight:700, color:C.text, lineHeight:1.3, marginBottom:4, direction:"rtl", textAlign:"right" }}>{doc.name}</div>
        <div style={{ fontSize:11.5, color:C.textSoft, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", direction:"rtl", textAlign:"right" }}>{specLabel}</div>
      </div>
      <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:10, display:"flex", flexDirection:"column", gap:5 }}>
        <div style={{ fontSize:12, color:C.textMid, display:"flex", alignItems:"flex-start", gap:5, direction:"rtl" }}>
          <span>🏥</span>
          <span style={{ flex:1, overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{doc.clinic}</span>
        </div>
        {doc.phone && (
          <div style={{ fontSize:12, color:C.infoText, display:"flex", alignItems:"center", gap:5, direction:"ltr" }}>
            <span>📞</span><span>{doc.phone}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Doctor Row ──────────────────────────────────────────────────────────── */
function DocRow({ doc, lang, s, rtl, onClick }) {
  const [hover, setHover] = useState(false);
  const specLabel = lang === "ku" ? doc.specialty_ku : (doc.specialty_en || doc.specialty_ku);
  const [avatarBg, avatarFg] = avatarPalette(doc.id);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ borderBottom:`1px solid ${C.border}`, cursor:"pointer", background: hover ? "#fafcff" : C.white, transition:"background 0.12s" }}>
      <div style={{
        display:"grid",
        gridTemplateColumns: rtl ? "56px 100px 160px 1fr 36px" : "36px 1fr 160px 100px 56px",
        gap:12, padding:"10px 16px", alignItems:"center",
      }}>
        {rtl ? (
          <>
            <KcsBadge score={doc.kcs} />
            <div style={{ fontSize:12.5, color:C.textMid, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{doc.city}</div>
            <div style={{ fontSize:12.5, color:C.textMid, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{specLabel}</div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:13.5, fontWeight:600, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{doc.name}</div>
              <div style={{ fontSize:11.5, color:C.textSoft, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginTop:1 }}>{doc.clinic}</div>
            </div>
            <div style={{ width:32, height:32, borderRadius:"50%", background:avatarBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:avatarFg, flexShrink:0 }}>{getInitials(doc.name)}</div>
          </>
        ) : (
          <>
            <div style={{ width:32, height:32, borderRadius:"50%", background:avatarBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:avatarFg, flexShrink:0 }}>{getInitials(doc.name)}</div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:13.5, fontWeight:600, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{doc.name}</div>
              <div style={{ fontSize:11.5, color:C.textSoft, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginTop:1 }}>{doc.clinic}</div>
            </div>
            <div style={{ fontSize:12.5, color:C.textMid, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{specLabel}</div>
            <div style={{ fontSize:12.5, color:C.textMid, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{doc.city}</div>
            <KcsBadge score={doc.kcs} />
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Article Card ────────────────────────────────────────────────────────── */
function ArticleCard({ article, lang, s, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? C.tealBg : C.white,
        border:`1px solid ${hover ? C.tealLight : C.border}`,
        borderRadius:12, padding:"16px", cursor:"pointer",
        transition:"all 0.18s ease",
        transform: hover ? "translateY(-2px)" : "none",
        boxShadow: hover ? "0 8px 24px rgba(15,118,110,0.12)" : "0 1px 4px rgba(0,0,0,0.05)",
      }}>
      <div style={{ fontSize:28, marginBottom:10 }}>{article.icon}</div>
      <div style={{ fontSize:11, fontWeight:600, color:C.teal, letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:6 }}>
        {lang==="ku" ? article.category_ku : article.category_en}
      </div>
      <div style={{ fontSize:14.5, fontWeight:700, color:C.text, lineHeight:1.4, marginBottom:8 }}>
        {lang==="ku" ? article.title_ku : article.title_en}
      </div>
      <p style={{ fontSize:12.5, color:C.textMid, lineHeight:1.6, margin:0, display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
        {lang==="ku" ? article.summary_ku : article.summary_en}
      </p>
      <div style={{ marginTop:12, display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:11.5, color:C.textSoft }}>
        <span>{article.date}</span>
        <span>{article.readTime} {s.minRead}</span>
      </div>
    </div>
  );
}

/* ─── Horizontal Scroll Rail ──────────────────────────────────────────────── */
function HScrollRail({ title, children, rtl, onViewAll, viewAllLabel }) {
  const railRef = useRef(null);
  return (
    <div style={{ marginBottom:28 }}>
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 20px", marginBottom:12,
        flexDirection: rtl ? "row-reverse" : "row",
      }}>
        <div style={{ fontSize:15, fontWeight:800, color:C.text, letterSpacing:"-0.01em" }}>{title}</div>
        {onViewAll && (
          <button onClick={onViewAll} style={{
            fontSize:12, color:C.teal, background:"none", border:"none",
            cursor:"pointer", fontWeight:600, padding:"2px 6px",
          }}>{viewAllLabel}</button>
        )}
      </div>
      <div ref={railRef} style={{
        display:"flex", gap:12, overflowX:"auto", padding:"4px 20px 12px",
        scrollbarWidth:"none",
        flexDirection: rtl ? "row-reverse" : "row",
      }}>
        <style>{`.hscroll::-webkit-scrollbar{display:none}`}</style>
        {children}
      </div>
    </div>
  );
}

/* ─── Home Page ───────────────────────────────────────────────────────────── */
function HomePage({ lang, s, rtl, doctors, magazineArticles, onDoctorClick, onArticleClick, onGoDirectory, onGoMagazine }) {
  const top10 = useMemo(() =>
    [...doctors].sort((a,b) => b.kcs - a.kcs).slice(0, 10),
  [doctors]);

  const latest6 = useMemo(() =>
    [...magazineArticles].slice(0, 6),
  [magazineArticles]);

  return (
    <div style={{ height:"100%", overflowY:"auto" }}>
      {/* Hero */}
      <div style={{
        background:`linear-gradient(135deg, ${C.teal} 0%, ${C.tealDark} 100%)`,
        padding:"32px 24px 28px", color:"#fff",
        position:"relative", overflow:"hidden",
      }}>
        <div style={{
          position:"absolute", top:-40, right:-40, width:160, height:160,
          borderRadius:"50%", background:"rgba(255,255,255,0.06)",
        }} />
        <div style={{
          position:"absolute", bottom:-20, left:60, width:80, height:80,
          borderRadius:"50%", background:"rgba(255,255,255,0.05)",
        }} />
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", opacity:0.7, marginBottom:8 }}>
          {s.tag}
        </div>
        <div style={{ fontSize:28, fontWeight:900, letterSpacing:"-0.03em", marginBottom:6 }}>
          {s.brand}
        </div>
        <div style={{ fontSize:14, opacity:0.75, lineHeight:1.6, maxWidth:360 }}>
          {lang==="ku" ? "باشترین پزیشکانی کوردستان لە یەک شوێن" : "Discover the best doctors in Kurdistan, all in one place."}
        </div>
        <div style={{ marginTop:18, display:"flex", gap:10, flexWrap:"wrap" }}>
          <button onClick={onGoDirectory} style={{
            padding:"8px 20px", background:"#fff", color:C.teal,
            border:"none", borderRadius:8, fontWeight:700, fontSize:13, cursor:"pointer",
          }}>
            {lang==="ku" ? "ڕێنمایی پزیشکان" : "Browse Directory"}
          </button>
          <button onClick={onGoMagazine} style={{
            padding:"8px 20px", background:"rgba(255,255,255,0.15)", color:"#fff",
            border:"1px solid rgba(255,255,255,0.3)", borderRadius:8, fontWeight:600, fontSize:13, cursor:"pointer",
          }}>
            {s.magazine}
          </button>
        </div>
      </div>

      <div style={{ paddingTop:24 }}>
        {/* Top 10 doctors */}
        <HScrollRail title={s.topDocs} rtl={rtl} viewAllLabel={s.viewAll} onViewAll={onGoDirectory}>
          {top10.map(doc => {
            const [avatarBg, avatarFg] = avatarPalette(doc.id);
            return (
              <div key={doc.id} onClick={() => onDoctorClick(doc)}
                style={{
                  flexShrink:0, width:160, background:C.white,
                  borderRadius:12, padding:"14px", cursor:"pointer",
                  border:`1px solid ${C.border}`,
                  boxShadow:"0 2px 8px rgba(0,0,0,0.06)",
                  transition:"transform 0.18s, box-shadow 0.18s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 8px 20px rgba(15,118,110,0.14)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.06)"; }}
              >
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                  <div style={{
                    width:38, height:38, borderRadius:"50%", background:avatarBg,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:13, fontWeight:700, color:avatarFg,
                  }}>{getInitials(doc.name)}</div>
                  <KcsBadge score={doc.kcs} />
                </div>
                <div style={{ fontSize:12.5, fontWeight:700, color:C.text, lineHeight:1.3, direction:"rtl", marginBottom:4 }}>{doc.name}</div>
                <div style={{ fontSize:11, color:C.textSoft, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", direction:"rtl" }}>
                  {lang==="ku" ? doc.specialty_ku : (doc.specialty_en || doc.specialty_ku)}
                </div>
                <div style={{ fontSize:11, color:C.textMid, marginTop:6 }}>📍 {doc.city}</div>
              </div>
            );
          })}
        </HScrollRail>

        {/* Latest Articles */}
        <HScrollRail title={s.latestArticles} rtl={rtl} viewAllLabel={s.viewAll} onViewAll={onGoMagazine}>
          {latest6.map(article => (
            <div key={article.id} onClick={() => onArticleClick(article)}
              style={{
                flexShrink:0, width:220, background:C.white,
                borderRadius:12, padding:"14px 16px", cursor:"pointer",
                border:`1px solid ${C.border}`,
                boxShadow:"0 2px 8px rgba(0,0,0,0.06)",
                transition:"transform 0.18s, box-shadow 0.18s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 8px 20px rgba(15,118,110,0.14)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.06)"; }}
            >
              <div style={{ fontSize:26, marginBottom:8 }}>{article.icon}</div>
              <div style={{ fontSize:10, fontWeight:700, color:C.teal, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:5 }}>
                {lang==="ku" ? article.category_ku : article.category_en}
              </div>
              <div style={{ fontSize:13, fontWeight:700, color:C.text, lineHeight:1.4, marginBottom:8 }}>
                {lang==="ku" ? article.title_ku : article.title_en}
              </div>
              <div style={{ fontSize:11, color:C.textSoft }}>{article.date} · {article.readTime} {s.minRead}</div>
            </div>
          ))}
        </HScrollRail>

        {/* Featured Clinics */}
        <HScrollRail title={s.featuredClinics} rtl={rtl} viewAllLabel={s.viewAll} onViewAll={onGoDirectory}>
          {FEATURED_CLINICS.map((cl, i) => (
            <div key={i} onClick={onGoDirectory}
              style={{
                flexShrink:0, width:170, background:C.white,
                borderRadius:12, padding:"16px 14px", cursor:"pointer",
                border:`1px solid ${C.border}`,
                boxShadow:"0 2px 8px rgba(0,0,0,0.06)",
                transition:"transform 0.18s, box-shadow 0.18s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 8px 20px rgba(0,0,0,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.06)"; }}
            >
              <div style={{
                width:40, height:40, borderRadius:10, marginBottom:10,
                background:`${cl.color}18`, display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:20,
              }}>{cl.icon}</div>
              <div style={{ fontSize:12.5, fontWeight:700, color:C.text, lineHeight:1.35, direction:"rtl", marginBottom:5 }}>{cl.name}</div>
              <div style={{ fontSize:11, color:C.textSoft }}>📍 {cl.city}</div>
            </div>
          ))}
        </HScrollRail>
      </div>
    </div>
  );
}

/* ─── Specialty Template ──────────────────────────────────────────────────── */
function SpecialtyTemplate({ specialty, doctors: allDocs, lang, s, rtl, onDoctorClick }) {
  const spDocs = allDocs.filter(d => d.specialty_ku === specialty.ku);
  return (
    <div style={{ padding:"0 20px 24px" }}>
      <div style={{
        background:`linear-gradient(135deg, ${C.teal}, ${C.tealDark})`,
        borderRadius:14, padding:"22px 24px", marginBottom:24, color:"#fff", marginTop:16,
      }}>
        <div style={{ fontSize:32, marginBottom:10 }}>{specialty.icon}</div>
        <div style={{ fontSize:20, fontWeight:700, marginBottom:8 }}>{lang==="ku" ? specialty.ku : specialty.en}</div>
        <p style={{ fontSize:13.5, lineHeight:1.7, opacity:0.88, margin:0 }}>
          {lang==="ku" ? specialty.description_ku : specialty.description_en}
        </p>
      </div>
      <div style={{ fontSize:12, fontWeight:700, color:C.textSoft, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:14 }}>
        {spDocs.length} {s.docs}
      </div>
      {spDocs.length === 0 ? (
        <div style={{ color:C.textSoft, textAlign:"center", padding:40, fontSize:14 }}>{s.noResults}</div>
      ) : (
        <div>{spDocs.map(doc => (
          <DocRow key={doc.id} doc={doc} lang={lang} s={s} rtl={rtl} onClick={() => onDoctorClick(doc)} />
        ))}</div>
      )}
    </div>
  );
}

/* ─── Clinic Template ─────────────────────────────────────────────────────── */
function ClinicTemplate({ clinicName, doctors: allDocs, lang, s, rtl, onDoctorClick }) {
  const clinicDocs = allDocs.filter(d => d.clinic === clinicName);
  const city = clinicDocs[0]?.city || "";
  return (
    <div style={{ padding:"0 20px 24px" }}>
      <div style={{
        background:`linear-gradient(135deg, #1e3a5f, #0f172a)`,
        borderRadius:14, padding:"22px 24px", marginBottom:24, color:"#fff", marginTop:16,
      }}>
        <div style={{ fontSize:28, marginBottom:8 }}>🏥</div>
        <div style={{ fontSize:19, fontWeight:700, marginBottom:6, direction:"rtl" }}>{clinicName}</div>
        {city && <div style={{ fontSize:13, opacity:0.7 }}>{city}</div>}
        <div style={{ marginTop:10, fontSize:13, opacity:0.8 }}>{clinicDocs.length} {s.docs}</div>
      </div>
      {clinicDocs.map(doc => (
        <DocRow key={doc.id} doc={doc} lang={lang} s={s} rtl={rtl} onClick={() => onDoctorClick(doc)} />
      ))}
    </div>
  );
}

/* ─── Magazine Page ───────────────────────────────────────────────────────── */
function MagazinePage({ lang, s, rtl, activeSp, magazineArticles, preFilterDoctorId, onClearDocFilter }) {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activeCat, setActiveCat] = useState(null);

  const filtered = useMemo(() => {
    return magazineArticles.filter(a => {
      const matchSp = !activeSp || a.specialty_ku === activeSp;
      const matchCat = !activeCat || (lang==="ku" ? a.category_ku : a.category_en) === activeCat;
      const matchDoc = !preFilterDoctorId || a.doctorId === preFilterDoctorId;
      return matchSp && matchCat && (preFilterDoctorId ? matchDoc : true);
    });
  }, [activeSp, activeCat, lang, magazineArticles, preFilterDoctorId]);

  const cats = useMemo(() => {
    const all = magazineArticles.map(a => lang==="ku" ? a.category_ku : a.category_en);
    return [...new Set(all)];
  }, [lang, magazineArticles]);

  return (
    <div style={{ height:"100%", overflowY:"auto" }}>
      <div style={{
        background:`linear-gradient(135deg, ${C.teal} 0%, ${C.tealDark} 100%)`,
        padding:"28px 24px 22px", color:"#fff",
      }}>
        <div style={{ fontSize:24, fontWeight:800, letterSpacing:"-0.02em" }}>{s.magazine}</div>
        <div style={{ fontSize:13, opacity:0.75, marginTop:4 }}>
          {lang==="ku" ? "دەرمان و تەندروستی لە کوردستان" : "Health & Medicine in Kurdistan"}
        </div>
      </div>

      {/* Doctor pre-filter banner */}
      {preFilterDoctorId && (
        <div style={{
          padding:"8px 20px", background:"#fffbeb",
          borderBottom:`1px solid #fde68a`,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          fontSize:12, color:"#92400e",
        }}>
          <span>🔗 {lang==="ku" ? "فلتەرکراوە بۆ پزیشکی دیاریکراو" : `Filtered for Doctor ID: ${preFilterDoctorId}`}</span>
          <button onClick={onClearDocFilter} style={{
            background:"#92400e", color:"#fff", border:"none",
            borderRadius:5, padding:"2px 10px", fontSize:11, cursor:"pointer", fontWeight:600,
          }}>✕ {lang==="ku" ? "لابردن" : "Clear"}</button>
        </div>
      )}

      <div style={{ display:"flex", gap:8, padding:"14px 20px", overflowX:"auto", borderBottom:`1px solid ${C.border}`, background:C.white, position:"sticky", top:0, zIndex:5 }}>
        <Pill label={s.allCats} active={!activeCat} onClick={() => setActiveCat(null)} />
        {cats.map(cat => (
          <Pill key={cat} label={cat} active={activeCat===cat} onClick={() => setActiveCat(activeCat===cat?null:cat)} />
        ))}
      </div>

      <div style={{ padding:"20px", display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:16 }}>
        {filtered.length === 0 ? (
          <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"60px 0", color:C.textSoft, fontSize:14 }}>{s.noResults}</div>
        ) : (
          filtered.map(a => (
            <ArticleCard key={a.id} article={a} lang={lang} s={s} onClick={() => setSelectedArticle(a)} />
          ))
        )}
      </div>

      {selectedArticle && (
        <DetailPanel item={selectedArticle} type="article" lang={lang} s={s} rtl={rtl}
          onClose={() => setSelectedArticle(null)} />
      )}
    </div>
  );
}

function Pill({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding:"5px 14px", fontSize:12, fontWeight: active ? 700 : 500,
      borderRadius:20, border:"none", cursor:"pointer", whiteSpace:"nowrap",
      background: active ? C.teal : C.bgSoft,
      color: active ? "#fff" : C.textMid,
      transition:"all 0.15s",
    }}>{label}</button>
  );
}

/* ─── Admin Panel ─────────────────────────────────────────────────────────── */
function AdminPanel({ lang, s, rtl, doctors, magazineArticles, onDoctorsUpdate, onArticleAdd }) {
  const [activeTab, setActiveTab] = useState("doctors");
  const [csvStatus, setCsvStatus] = useState(null); // null | "success" | "error"
  const [csvMsg, setCsvMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  // Article form state
  const [form, setForm] = useState({
    title_en:"", title_ku:"", summary_en:"", summary_ku:"",
    category_en:"", category_ku:"", icon:"📄", readTime:"5",
    date: new Date().toLocaleDateString("en-US", { month:"short", year:"numeric" }),
    doctorId:"",
  });
  const [formMsg, setFormMsg] = useState(null);

  const parseCSV = (text) => {
    try {
      const lines = text.trim().split("\n");
      const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
      const required = ["name", "specialty_ku", "clinic", "city", "kcs"];
      if (!required.every(r => headers.includes(r))) throw new Error("Missing required columns");
      const rows = lines.slice(1).map((line, idx) => {
        const vals = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
        const obj = {};
        headers.forEach((h, i) => { obj[h] = vals[i] || ""; });
        return { ...obj, id: obj.id ? Number(obj.id) : Date.now() + idx, kcs: Number(obj.kcs) || 0 };
      }).filter(r => r.name);
      return rows;
    } catch(e) { return null; }
  };

  const handleFile = (file) => {
    if (!file || !file.name.endsWith(".csv")) { setCsvStatus("error"); setCsvMsg(s.csvError); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      const parsed = parseCSV(e.target.result);
      if (!parsed) { setCsvStatus("error"); setCsvMsg(s.csvError); return; }
      onDoctorsUpdate(parsed);
      setCsvStatus("success");
      setCsvMsg(`${s.csvUploaded} (${parsed.length} doctors)`);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); };

  const handleFormSubmit = () => {
    if (!form.title_en || !form.title_ku || !form.summary_en || !form.category_en) {
      setFormMsg({ type:"error", msg: lang==="ku" ? "تکایە خانەکانی پێویستی پڕبکەوە" : "Please fill required fields" });
      return;
    }
    const newArt = {
      id: `m${Date.now()}`,
      specialty_ku: "", specialty_en: "",
      ...form,
      readTime: Number(form.readTime) || 5,
      doctorId: form.doctorId ? Number(form.doctorId) : null,
    };
    onArticleAdd(newArt);
    setForm({ title_en:"", title_ku:"", summary_en:"", summary_ku:"", category_en:"", category_ku:"", icon:"📄", readTime:"5", date: new Date().toLocaleDateString("en-US", { month:"short", year:"numeric" }), doctorId:"" });
    setFormMsg({ type:"success", msg: lang==="ku" ? "وتارەکە بە سەرکەوتوویی زیادکرا!" : "Article added successfully!" });
    setTimeout(() => setFormMsg(null), 3000);
  };

  const inputStyle = {
    width:"100%", padding:"8px 12px", fontSize:13,
    border:`1px solid rgba(255,255,255,0.1)`,
    borderRadius:7, background:"rgba(255,255,255,0.06)",
    color:"#e2e8f0", outline:"none",
    marginTop:4,
  };
  const labelStyle = { fontSize:12, color:"#94a3b8", display:"block", marginTop:14 };

  return (
    <div style={{ height:"100%", overflowY:"auto", background:C.adminBg, color:"#e2e8f0" }}>
      {/* Admin header */}
      <div style={{
        padding:"24px 24px 20px",
        borderBottom:"1px solid rgba(255,255,255,0.08)",
        background:"rgba(99,102,241,0.08)",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
          <div style={{
            width:32, height:32, borderRadius:8,
            background:C.adminAccent, display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:16,
          }}>⚙️</div>
          <div style={{ fontSize:20, fontWeight:800, letterSpacing:"-0.02em" }}>{s.adminTitle}</div>
        </div>
        <div style={{ fontSize:13, color:"#64748b", marginTop:2 }}>
          {s.welcome} · Ya Hakeem
        </div>

        {/* Stats row */}
        <div style={{ display:"flex", gap:12, marginTop:16 }}>
          {[
            { label: s.doctorCount, val: doctors.length, icon:"👨‍⚕️", color:"#22d3ee" },
            { label: s.articleCount, val: magazineArticles.length, icon:"📖", color:"#a78bfa" },
          ].map(stat => (
            <div key={stat.label} style={{
              background:"rgba(255,255,255,0.05)", borderRadius:10,
              padding:"12px 16px", border:"1px solid rgba(255,255,255,0.08)",
              flex:1,
            }}>
              <div style={{ fontSize:22, fontWeight:800, color:stat.color }}>{stat.val}</div>
              <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"0 24px" }}>
        {[
          { id:"doctors", label: s.manageDoctors },
          { id:"content", label: s.manageContent },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding:"12px 16px", fontSize:13, fontWeight: activeTab===tab.id ? 700 : 500,
            border:"none", background:"none", cursor:"pointer",
            color: activeTab===tab.id ? "#fff" : "#64748b",
            borderBottom: activeTab===tab.id ? `2px solid ${C.adminAccent}` : "2px solid transparent",
          }}>{tab.label}</button>
        ))}
      </div>

      <div style={{ padding:"24px" }}>
        {activeTab === "doctors" && (
          <div>
            <div style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>📂 {s.uploadCSV}</div>

            {/* CSV guide */}
            <div style={{
              background:"rgba(99,102,241,0.1)", borderRadius:8,
              padding:"10px 14px", fontSize:11.5, color:"#a5b4fc",
              border:"1px solid rgba(99,102,241,0.2)", marginBottom:16, lineHeight:1.7,
            }}>
              💡 {s.csvGuide}
            </div>

            {/* Drop zone */}
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                border:`2px dashed ${dragOver ? C.adminAccent : "rgba(255,255,255,0.15)"}`,
                borderRadius:12, padding:"36px 24px",
                textAlign:"center", cursor:"pointer",
                background: dragOver ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.03)",
                transition:"all 0.2s",
              }}>
              <div style={{ fontSize:36, marginBottom:12 }}>📁</div>
              <div style={{ fontSize:14, color:"#94a3b8" }}>{s.dragDrop}</div>
              <div style={{ fontSize:12, color:"#475569", marginTop:6 }}>.csv</div>
            </div>
            <input ref={fileRef} type="file" accept=".csv" style={{ display:"none" }}
              onChange={e => handleFile(e.target.files[0])} />

            {csvStatus && (
              <div style={{
                marginTop:14, padding:"10px 16px", borderRadius:8, fontSize:13,
                background: csvStatus==="success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                border: csvStatus==="success" ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(239,68,68,0.2)",
                color: csvStatus==="success" ? "#86efac" : "#fca5a5",
              }}>
                {csvStatus==="success" ? "✅" : "❌"} {csvMsg}
              </div>
            )}
          </div>
        )}

        {activeTab === "content" && (
          <div>
            <div style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>✍️ {s.addArticle}</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
              {[
                { key:"title_en", label:s.articleTitle },
                { key:"title_ku", label:s.articleTitleKu },
              ].map(f => (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label} *</label>
                  <input value={form[f.key]} onChange={e => setForm(p => ({...p, [f.key]:e.target.value}))} style={inputStyle} />
                </div>
              ))}
              {[
                { key:"summary_en", label:s.articleSummary },
                { key:"summary_ku", label:s.articleSummaryKu },
              ].map(f => (
                <div key={f.key} style={{ gridColumn:"span 1" }}>
                  <label style={labelStyle}>{f.label} *</label>
                  <textarea value={form[f.key]} onChange={e => setForm(p => ({...p, [f.key]:e.target.value}))}
                    rows={3} style={{ ...inputStyle, resize:"vertical" }} />
                </div>
              ))}
              {[
                { key:"category_en", label:s.articleCat },
                { key:"category_ku", label:s.articleCatKu },
                { key:"icon", label:s.articleIcon },
                { key:"readTime", label:s.articleReadTime, type:"number" },
                { key:"date", label:s.articleDate },
                { key:"doctorId", label:s.articleDoctorId },
              ].map(f => (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  <input type={f.type||"text"} value={form[f.key]} onChange={e => setForm(p => ({...p, [f.key]:e.target.value}))} style={inputStyle} />
                </div>
              ))}
            </div>

            <button onClick={handleFormSubmit} style={{
              marginTop:20, padding:"10px 24px", fontSize:13, fontWeight:700,
              background:C.adminAccent, color:"#fff", border:"none",
              borderRadius:8, cursor:"pointer", width:"100%",
            }}>
              ✚ {s.submit}
            </button>

            {formMsg && (
              <div style={{
                marginTop:12, padding:"10px 16px", borderRadius:8, fontSize:13,
                background: formMsg.type==="success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                border: formMsg.type==="success" ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(239,68,68,0.2)",
                color: formMsg.type==="success" ? "#86efac" : "#fca5a5",
              }}>
                {formMsg.type==="success" ? "✅" : "❌"} {formMsg.msg}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── City Selector Modal ─────────────────────────────────────────────────── */
function CityModal({ lang, s, rtl, onSelect, onClose }) {
  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:C.overlay, zIndex:200 }} />
      <div style={{
        position:"fixed", top:"50%", left:"50%",
        transform:"translate(-50%,-50%)",
        width:280, background:C.white, borderRadius:14, zIndex:201,
        boxShadow:"0 20px 60px rgba(0,0,0,0.25)", overflow:"hidden",
      }}>
        <div style={{ padding:"14px 18px", fontWeight:700, fontSize:14, color:C.teal, borderBottom:`1px solid ${C.border}` }}>
          {s.citySelect}
        </div>
        <div style={{ maxHeight:320, overflowY:"auto", padding:"6px 0" }}>
          {ALL_CITIES.map(city => (
            <button key={city} onClick={() => { onSelect(city); onClose(); }}
              style={{
                display:"block", width:"100%", textAlign: rtl?"right":"left",
                padding:"9px 14px", border:"none", borderRadius:8,
                background:"none", cursor:"pointer", fontSize:13.5,
                color:C.text, direction:"rtl",
              }}
              onMouseEnter={e => e.currentTarget.style.background = C.bgSoft}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
            >{city}</button>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── Nav Tab ─────────────────────────────────────────────────────────────── */
function NavTab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding:"5px 13px", fontSize:12.5, fontWeight: active ? 700 : 500,
      border:"none", borderRadius:7, cursor:"pointer",
      background: active ? C.tealBg : "none",
      color: active ? C.teal : C.textMid,
      transition:"all 0.15s",
    }}>{label}</button>
  );
}

/* ─── Main App ────────────────────────────────────────────────────────────── */
export default function YaHakeem() {
  const [lang, setLang]         = useState("en");
  const [search, setSearch]     = useState("");
  const [activeSp, setActiveSp] = useState(null);
  const [activeClin, setActiveClin] = useState(null);
  const [sideOpen, setSideOpen] = useState(true);
  const [page, setPage]         = useState("home"); // "home" | "directory" | "magazine" | "admin"
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [userCity, setUserCity] = useState(null);
  const [showCityModal, setShowCityModal] = useState(false);
  const [viewMode, setViewMode] = useState("card");
  const [doctors, setDoctors]   = useState(INITIAL_DOCTORS);
  const [magazineArticles, setMagazineArticles] = useState(INITIAL_MAGAZINE);
  // Smart link: pre-filter magazine by doctor ID
  const [magazineDocFilter, setMagazineDocFilter] = useState(null);

  const s   = T[lang];
  const rtl = lang === "ku";

  // Detect mobile for sidebar collapse
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const clinics = useMemo(() =>
    [...new Set(doctors.map(d => d.clinic).filter(Boolean))], [doctors]);

  const isDefaultView = !search && !activeSp && !activeClin;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = doctors.filter(d => {
      const mq = !q || d.name.includes(q)
        || d.specialty_ku.includes(q)
        || (d.specialty_en && d.specialty_en.toLowerCase().includes(q))
        || d.clinic.includes(q) || d.city.includes(q);
      const msp = !activeSp   || d.specialty_ku === activeSp;
      const mc  = !activeClin || d.clinic === activeClin;
      return mq && msp && mc;
    });
    if (isDefaultView) {
      if (userCity) result = result.filter(d => d.city === userCity);
      result = [...result].sort((a,b) => b.kcs - a.kcs).slice(0, 10);
    }
    return result;
  }, [search, activeSp, activeClin, isDefaultView, userCity, doctors]);

  const activeSpecialty = useMemo(() =>
    activeSp ? specialties.find(sp => sp.ku === activeSp) : null,
  [activeSp]);

  const handleSidebarSp = useCallback((spKu) => {
    setActiveSp(spKu === activeSp ? null : spKu);
    setActiveClin(null); setSearch("");
  }, [activeSp]);

  const handleSidebarClin = useCallback((clin) => {
    setActiveClin(clin === activeClin ? null : clin);
    setActiveSp(null); setSearch("");
  }, [activeClin]);

  const handleNavHome = () => { setActiveSp(null); setActiveClin(null); setSearch(""); };

  // Smart link handler: go to magazine pre-filtered by doctor id
  const handleGoToMagazine = useCallback((docId) => {
    setMagazineDocFilter(docId);
    setPage("magazine");
  }, []);

  // Show sidebar only on directory pages
  const showSidebar = page === "directory";

  return (
    <div dir={rtl ? "rtl" : "ltr"} style={{
      display:"flex", flexDirection:"column", height:"100vh",
      fontFamily:"'Segoe UI', Tahoma, system-ui, sans-serif",
      background:C.bgPage, color:C.text,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body,#root{height:100vh;overflow:hidden}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:10px}
        [dir="rtl"]{font-family:'Noto Sans Arabic','Segoe UI',sans-serif}
      `}</style>

      {/* Navbar */}
      <header style={{
        display:"flex", alignItems:"center", gap:10,
        padding:"0 16px", height:52, flexShrink:0,
        background:C.white, borderBottom:`1px solid ${C.border}`,
        boxShadow:"0 1px 4px rgba(0,0,0,0.07)", zIndex:30,
        flexDirection: rtl ? "row-reverse" : "row",
      }}>
        {/* Hamburger — only when sidebar is visible */}
        {showSidebar && (
          <button onClick={() => setSideOpen(p => !p)} style={{
            display:"flex", flexDirection:"column", gap:4,
            background:"none", border:"none", cursor:"pointer", padding:5,
          }}>
            {[0,1,2].map(i => (
              <span key={i} style={{ display:"block", width:18, height:1.5, background:C.textMid, borderRadius:2 }} />
            ))}
          </button>
        )}

        {/* Brand */}
        <button onClick={() => { setPage("home"); handleNavHome(); }} style={{
          display:"flex", alignItems:"center", gap:8, flexShrink:0,
          background:"none", border:"none", cursor:"pointer", padding:0,
        }}>
          <div style={{
            width:28, height:28, borderRadius:7, background:C.teal,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:13, color:"#fff", fontWeight:700,
          }}>✦</div>
          <span style={{ fontSize:17, fontWeight:700, color:C.teal, letterSpacing:"-0.02em" }}>{s.brand}</span>
          <span style={{ fontSize:10, color:C.textSoft, letterSpacing:"0.06em", textTransform:"uppercase" }}>{s.tag}</span>
        </button>

        {/* Nav tabs */}
        <div style={{ display:"flex", gap:4, marginInlineStart:8 }}>
          <NavTab label={s.home}      active={page==="home"}      onClick={() => { setPage("home"); handleNavHome(); }} />
          <NavTab label={s.directory} active={page==="directory"} onClick={() => setPage("directory")} />
          <NavTab label={s.magazine}  active={page==="magazine"}  onClick={() => { setPage("magazine"); setMagazineDocFilter(null); }} />
          <NavTab label={s.admin}     active={page==="admin"}     onClick={() => setPage("admin")} />
        </div>

        {/* Search (only in directory) */}
        {page === "directory" && (
          <div style={{ flex:1, maxWidth:380, margin:"0 8px" }}>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setActiveSp(null); setActiveClin(null); }}
              placeholder={s.search}
              dir={rtl ? "rtl" : "ltr"}
              style={{
                width:"100%", height:33, padding: rtl ? "0 12px 0 10px" : "0 10px 0 12px",
                fontSize:13, border:`1px solid ${C.border}`,
                borderRadius:8, background:C.bgSoft, color:C.text, outline:"none",
              }}
              onFocus={e => { e.target.style.borderColor=C.teal; e.target.style.boxShadow=`0 0 0 3px ${C.tealBg}`; }}
              onBlur={e =>  { e.target.style.borderColor=C.border; e.target.style.boxShadow="none"; }}
            />
          </div>
        )}

        {/* City button */}
        {page === "directory" && isDefaultView && (
          <button onClick={() => setShowCityModal(true)} style={{
            padding:"4px 11px", fontSize:12, fontWeight:600,
            border:`1px solid ${C.border}`, borderRadius:7,
            background:C.bgSoft, color:C.textMid, cursor:"pointer",
            whiteSpace:"nowrap", maxWidth:120, overflow:"hidden", textOverflow:"ellipsis",
          }}>
            {userCity || s.citySelect}
          </button>
        )}

        {/* Count */}
        {page === "directory" && (
          <span style={{
            fontSize:12, color:C.textSoft, whiteSpace:"nowrap",
            background:C.bgSoft, border:`1px solid ${C.border}`,
            borderRadius:6, padding:"3px 9px",
          }}>
            {filtered.length} {s.docs}
          </span>
        )}

        {/* View toggle */}
        {page === "directory" && !activeSp && !activeClin && (
          <div style={{ display:"flex", border:`1px solid ${C.border}`, borderRadius:6, overflow:"hidden" }}>
            {["card","list"].map(m => (
              <button key={m} onClick={() => setViewMode(m)} style={{
                padding:"4px 9px", fontSize:11, border:"none", cursor:"pointer",
                background: viewMode===m ? C.teal : "none",
                color: viewMode===m ? "#fff" : C.textMid,
                transition:"all 0.12s",
              }}>{m==="card" ? "⊞" : "☰"}</button>
            ))}
          </div>
        )}

        <LangBtn label={s.toggle} onClick={() => setLang(l => l==="en"?"ku":"en")} />
      </header>

      {/* Body */}
      <div style={{ display:"flex", flex:1, overflow:"hidden", flexDirection: rtl ? "row-reverse" : "row" }}>

        {/* Sidebar — only on directory page */}
        {showSidebar && (
          <aside style={{
            width: sideOpen ? 220 : 0, flexShrink:0, overflow:"hidden",
            background:C.white,
            borderRight: rtl ? "none" : `1px solid ${C.border}`,
            borderLeft:  rtl ? `1px solid ${C.border}` : "none",
            display:"flex", flexDirection:"column",
            transition:"width 0.22s ease",
          }}>
            <div style={{ width:220, display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
              <div style={{
                padding:"10px 14px 8px", fontSize:10, fontWeight:700,
                letterSpacing:"0.08em", textTransform:"uppercase",
                color:C.textSoft, borderBottom:`1px solid ${C.border}`, flexShrink:0,
              }}>{s.filter}</div>

              <div style={{ overflowY:"auto", flex:1, paddingBottom:16, paddingTop:6 }}>
                <SideGroup label={s.specialties} isMobile={isMobile}>
                  <SBtn label={s.allSpec} active={!activeSp} rtl={rtl} onClick={() => { setActiveSp(null); setSearch(""); }} />
                  {specialties.map(sp => (
                    <SBtn key={sp.id}
                      label={lang==="ku" ? sp.ku : sp.en}
                      active={activeSp === sp.ku} rtl={rtl}
                      onClick={() => handleSidebarSp(sp.ku)}
                    />
                  ))}
                </SideGroup>

                <div style={{ height:1, background:C.border, margin:"6px 14px" }} />

                <SideGroup label={s.clinics} isMobile={isMobile}>
                  <SBtn label={s.allClin} active={!activeClin} rtl={rtl} onClick={() => { setActiveClin(null); setSearch(""); }} />
                  {clinics.map(c => (
                    <SBtn key={c} label={c} active={activeClin===c} rtl={rtl}
                      onClick={() => handleSidebarClin(c)} />
                  ))}
                </SideGroup>
              </div>
            </div>
          </aside>
        )}

        {/* Main content area */}
        <main style={{ flex:1, overflow:"hidden", background:C.white, display:"flex", flexDirection:"column" }}>

          {page === "home" && (
            <HomePage
              lang={lang} s={s} rtl={rtl}
              doctors={doctors}
              magazineArticles={magazineArticles}
              onDoctorClick={setSelectedDoc}
              onArticleClick={setSelectedArticle}
              onGoDirectory={() => setPage("directory")}
              onGoMagazine={() => { setPage("magazine"); setMagazineDocFilter(null); }}
            />
          )}

          {page === "magazine" && (
            <MagazinePage
              lang={lang} s={s} rtl={rtl}
              activeSp={activeSp}
              magazineArticles={magazineArticles}
              preFilterDoctorId={magazineDocFilter}
              onClearDocFilter={() => setMagazineDocFilter(null)}
            />
          )}

          {page === "admin" && (
            <AdminPanel
              lang={lang} s={s} rtl={rtl}
              doctors={doctors}
              magazineArticles={magazineArticles}
              onDoctorsUpdate={setDoctors}
              onArticleAdd={a => setMagazineArticles(prev => [a, ...prev])}
            />
          )}

          {page === "directory" && (
            <>
              {activeSp && activeSpecialty && !search ? (
                <div style={{ flex:1, overflowY:"auto" }}>
                  <SpecialtyTemplate
                    specialty={activeSpecialty}
                    doctors={doctors}
                    lang={lang} s={s} rtl={rtl}
                    onDoctorClick={setSelectedDoc}
                  />
                </div>
              ) : activeClin && !search ? (
                <div style={{ flex:1, overflowY:"auto" }}>
                  <ClinicTemplate
                    clinicName={activeClin}
                    doctors={doctors}
                    lang={lang} s={s} rtl={rtl}
                    onDoctorClick={setSelectedDoc}
                  />
                </div>
              ) : (
                <>
                  {isDefaultView && (
                    <div style={{
                      padding:"8px 16px", background:C.tealBg,
                      borderBottom:`1px solid rgba(15,118,110,0.15)`,
                      display:"flex", alignItems:"center", justifyContent:"space-between",
                      fontSize:12, color:C.teal, flexShrink:0,
                    }}>
                      <span>⭐ {s.defaultViewHint}{userCity ? ` · ${userCity}` : ""}</span>
                      {!userCity && (
                        <button onClick={() => setShowCityModal(true)} style={{
                          background:C.teal, color:"#fff", border:"none",
                          borderRadius:5, padding:"3px 10px", fontSize:11,
                          cursor:"pointer", fontWeight:600,
                        }}>{s.detectCity}</button>
                      )}
                    </div>
                  )}

                  {(!isDefaultView || viewMode==="list") && viewMode==="list" && (
                    <div style={{
                      display:"grid",
                      gridTemplateColumns: rtl ? "56px 100px 160px 1fr 36px" : "36px 1fr 160px 100px 56px",
                      gap:12, padding:"8px 16px",
                      fontSize:10, fontWeight:700, color:C.textSoft,
                      textTransform:"uppercase", letterSpacing:"0.07em",
                      borderBottom:`1px solid ${C.border}`,
                      background:C.bgSoft, flexShrink:0, zIndex:5,
                    }}>
                      {rtl
                        ? <><div>{s.kcs}</div><div>{s.city}</div><div>{s.specialty}</div><div>{s.doctor}</div><div /></>
                        : <><div /><div>{s.doctor}</div><div>{s.specialty}</div><div>{s.city}</div><div>{s.kcs}</div></>
                      }
                    </div>
                  )}

                  <div style={{ flex:1, overflowY:"auto" }}>
                    {filtered.length === 0 ? (
                      <div style={{ padding:"60px 24px", textAlign:"center", color:C.textSoft, fontSize:14 }}>
                        {s.noResults}
                      </div>
                    ) : viewMode==="card" ? (
                      <div style={{ padding:"16px", display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))", gap:14 }}>
                        {filtered.map(d => (
                          <DoctorCard key={d.id} doc={d} lang={lang} s={s} rtl={rtl} onClick={() => setSelectedDoc(d)} />
                        ))}
                      </div>
                    ) : (
                      filtered.map(d => (
                        <DocRow key={d.id} doc={d} lang={lang} s={s} rtl={rtl} onClick={() => setSelectedDoc(d)} />
                      ))
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>

      {/* Doctor detail panel */}
      {selectedDoc && (
        <DetailPanel
          item={selectedDoc} type="doctor"
          lang={lang} s={s} rtl={rtl}
          onClose={() => setSelectedDoc(null)}
          onGoToMagazine={handleGoToMagazine}
        />
      )}

      {/* Article detail panel (from home page) */}
      {selectedArticle && (
        <DetailPanel
          item={selectedArticle} type="article"
          lang={lang} s={s} rtl={rtl}
          onClose={() => setSelectedArticle(null)}
        />
      )}

      {/* City modal */}
      {showCityModal && (
        <CityModal
          lang={lang} s={s} rtl={rtl}
          onSelect={setUserCity}
          onClose={() => setShowCityModal(false)}
        />
      )}
    </div>
  );
}
