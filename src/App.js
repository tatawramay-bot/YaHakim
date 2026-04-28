import React, { useState, useMemo } from "react";
import { doctors } from "./data.js";
import { specialties } from "./specialties.js";

/* ─── Design tokens ───────────────────────────────────────────────────────── */
const C = {
  teal:      "#0f766e",
  tealBg:    "#f0fdfa",
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
};

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
  },
  ku: {
    brand:"یا حەکیم", tag:"ڕێنمایی پزیشکی",
    search:"گەڕان بۆ پزیشک، پسپۆڕی، کلینیک…",
    specialties:"پسپۆڕییەکان", clinics:"کلینیکەکان",
    allSpec:"هەموو پسپۆڕییەکان", allClin:"هەموو کلینیکەکان",
    doctor:"پزیشک", specialty:"پسپۆڕی", city:"شار", kcs:"نمرەی بەشداری",
    phone:"تەلەفۆن", fee:"نرخ", qual:"بروانامە", na:"نەدیاری",
    toggle:"English", filter:"فلتەر", docs:"پزیشک", noResults:"هیچ ئەنجامێک نەدۆزرایەوە.",
  },
};

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function getInitials(name) {
  return name.replace(/^(د\.|دکتۆر[ە]?\s*)/, "").trim()
    .split(" ").slice(0, 2).map(w => w[0] || "").join("");
}
const AVATAR_PALETTES = [
  ["#dbeafe","#1e40af"],["#fce7f3","#9d174d"],["#dcfce7","#166534"],
  ["#fef3c7","#92400e"],["#ede9fe","#5b21b6"],["#ffedd5","#9a3412"],
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

/* ─── Sidebar group ───────────────────────────────────────────────────────── */
function SideGroup({ label, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom:2 }}>
      <button onClick={() => setOpen(p => !p)} style={{
        width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"6px 14px", background:"none", border:"none", cursor:"pointer",
        fontSize:10, fontWeight:700, letterSpacing:"0.08em",
        textTransform:"uppercase", color:C.textSoft,
      }}>
        {label}
        <span style={{ fontSize:9 }}>{open ? "▴" : "▾"}</span>
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

/* ─── Doctor row ──────────────────────────────────────────────────────────── */
function DocRow({ doc, lang, s, rtl }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const specLabel = lang === "ku" ? doc.specialty_ku : (doc.specialty_en || doc.specialty_ku);
  const [avatarBg, avatarFg] = avatarPalette(doc.id);

  return (
    <div
      onClick={() => setOpen(p => !p)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderBottom:`1px solid ${C.border}`, cursor:"pointer",
        background: open ? C.bgSoft : hover ? "#fafcff" : C.white,
        transition:"background 0.12s",
      }}
    >
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
            <div style={{ width:32, height:32, borderRadius:"50%", background:avatarBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:avatarFg, flexShrink:0 }}>
              {getInitials(doc.name)}
            </div>
          </>
        ) : (
          <>
            <div style={{ width:32, height:32, borderRadius:"50%", background:avatarBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:avatarFg, flexShrink:0 }}>
              {getInitials(doc.name)}
            </div>
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

      {open && (
        <div style={{
          padding:"4px 16px 14px",
          display:"grid", gridTemplateColumns:"1fr 1fr 1fr",
          gap:"4px 24px", fontSize:12.5,
          borderTop:`1px solid ${C.border}`,
        }}>
          <div style={{ paddingTop:8 }}>
            <span style={{ color:C.textSoft, marginInlineEnd:4 }}>{s.phone}:</span>
            <a href={`tel:${doc.phone}`} onClick={e => e.stopPropagation()}
              style={{ color:C.infoText, textDecoration:"none" }}>
              {doc.phone || s.na}
            </a>
          </div>
          <div style={{ paddingTop:8 }}>
            <span style={{ color:C.textSoft, marginInlineEnd:4 }}>{s.fee}:</span>
            <span style={{ color:C.text }}>{doc.fee || s.na}</span>
          </div>
          <div style={{ paddingTop:8 }}>
            <span style={{ color:C.textSoft, marginInlineEnd:4 }}>{s.qual}:</span>
            <span style={{ color:C.text }}>{doc.qualifications || s.na}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── App ─────────────────────────────────────────────────────────────────── */
export default function YaHakeem() {
  const [lang, setLang]         = useState("en");
  const [search, setSearch]     = useState("");
  const [activeSp, setActiveSp] = useState(null);
  const [activeClin, setActiveClin] = useState(null);
  const [sideOpen, setSideOpen] = useState(true);

  const s   = T[lang];
  const rtl = lang === "ku";

  const clinics = useMemo(() =>
    [...new Set(doctors.map(d => d.clinic).filter(Boolean))], []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return doctors.filter(d => {
      const mq = !q || d.name.includes(q)
        || d.specialty_ku.includes(q)
        || (d.specialty_en && d.specialty_en.toLowerCase().includes(q))
        || d.clinic.includes(q) || d.city.includes(q);
      const msp = !activeSp   || d.specialty_ku === activeSp;
      const mc  = !activeClin || d.clinic === activeClin;
      return mq && msp && mc;
    });
  }, [search, activeSp, activeClin]);

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
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:10px}
        [dir="rtl"]{font-family:'Noto Sans Arabic','Segoe UI',sans-serif}
      `}</style>

      {/* Navbar */}
      <header style={{
        display:"flex", alignItems:"center", gap:10,
        padding:"0 16px", height:52, flexShrink:0,
        background:C.white, borderBottom:`1px solid ${C.border}`,
        boxShadow:"0 1px 4px rgba(0,0,0,0.07)", zIndex:30,
      }}>
        {/* Hamburger */}
        <button onClick={() => setSideOpen(p => !p)} style={{
          display:"flex", flexDirection:"column", gap:4,
          background:"none", border:"none", cursor:"pointer", padding:5,
        }}>
          {[0,1,2].map(i => (
            <span key={i} style={{ display:"block", width:18, height:1.5, background:C.textMid, borderRadius:2 }} />
          ))}
        </button>

        {/* Brand */}
        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          <div style={{
            width:28, height:28, borderRadius:7, background:C.teal,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:13, color:"#fff", fontWeight:700,
          }}>✦</div>
          <span style={{ fontSize:17, fontWeight:700, color:C.teal, letterSpacing:"-0.02em" }}>
            {s.brand}
          </span>
          <span style={{ fontSize:10, color:C.textSoft, letterSpacing:"0.06em", textTransform:"uppercase" }}>
            {s.tag}
          </span>
        </div>

        {/* Search */}
        <div style={{ flex:1, maxWidth:440, margin:"0 10px" }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={s.search}
            dir={rtl ? "rtl" : "ltr"}
            style={{
              width:"100%", height:33,
              padding: rtl ? "0 12px 0 10px" : "0 10px 0 12px",
              fontSize:13, border:`1px solid ${C.border}`,
              borderRadius:8, background:C.bgSoft,
              color:C.text, outline:"none",
            }}
            onFocus={e => { e.target.style.borderColor = C.teal; e.target.style.boxShadow = `0 0 0 3px ${C.tealBg}`; }}
            onBlur={e =>  { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
          />
        </div>

        {/* Count */}
        <span style={{
          fontSize:12, color:C.textSoft, whiteSpace:"nowrap",
          background:C.bgSoft, border:`1px solid ${C.border}`,
          borderRadius:6, padding:"3px 9px",
        }}>
          {filtered.length} {s.docs}
        </span>

        {/* Lang toggle */}
        <LangBtn label={s.toggle} onClick={() => setLang(l => l === "en" ? "ku" : "en")} />
      </header>

      {/* Body */}
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {/* Sidebar */}
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
              <SideGroup label={s.specialties}>
                <SBtn label={s.allSpec} active={!activeSp} rtl={rtl} onClick={() => setActiveSp(null)} />
                {specialties.map(sp => (
                  <SBtn key={sp.id}
                    label={lang === "ku" ? sp.ku : sp.en}
                    active={activeSp === sp.ku} rtl={rtl}
                    onClick={() => setActiveSp(activeSp === sp.ku ? null : sp.ku)}
                  />
                ))}
              </SideGroup>

              <div style={{ height:1, background:C.border, margin:"6px 14px" }} />

              <SideGroup label={s.clinics}>
                <SBtn label={s.allClin} active={!activeClin} rtl={rtl} onClick={() => setActiveClin(null)} />
                {clinics.map(c => (
                  <SBtn key={c} label={c} active={activeClin === c} rtl={rtl}
                    onClick={() => setActiveClin(activeClin === c ? null : c)} />
                ))}
              </SideGroup>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex:1, overflowY:"auto", background:C.white }}>
          {/* Table header */}
          <div style={{
            display:"grid",
            gridTemplateColumns: rtl ? "56px 100px 160px 1fr 36px" : "36px 1fr 160px 100px 56px",
            gap:12, padding:"8px 16px",
            fontSize:10, fontWeight:700, color:C.textSoft,
            textTransform:"uppercase", letterSpacing:"0.07em",
            borderBottom:`1px solid ${C.border}`,
            background:C.bgSoft, position:"sticky", top:0, zIndex:5,
          }}>
            {rtl ? (
              <><div>{s.kcs}</div><div>{s.city}</div><div>{s.specialty}</div><div>{s.doctor}</div><div /></>
            ) : (
              <><div /><div>{s.doctor}</div><div>{s.specialty}</div><div>{s.city}</div><div>{s.kcs}</div></>
            )}
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding:"60px 24px", textAlign:"center", color:C.textSoft, fontSize:14 }}>
              {s.noResults}
            </div>
          ) : (
            filtered.map(d => (
              <DocRow key={d.id} doc={d} lang={lang} s={s} rtl={rtl} />
            ))
          )}
        </main>
      </div>
    </div>
  );
}

/* ─── Lang button (extracted to avoid inline hover issues) ────────────────── */
function LangBtn({ label, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding:"5px 13px", fontSize:12, fontWeight:600,
        border:`1px solid ${C.teal}`, borderRadius:7,
        background: hover ? C.teal : "none",
        color: hover ? "#fff" : C.teal,
        cursor:"pointer", whiteSpace:"nowrap",
        transition:"background 0.15s, color 0.15s",
      }}>
      {label}
    </button>
  );
}
