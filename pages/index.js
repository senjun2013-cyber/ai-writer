import { useState, useRef, useEffect } from "react";
import Head from "next/head";

const MODES = [
  { id: "improve", label: "✦ Improve", desc: "Polish any text" },
  { id: "email", label: "✉ Email", desc: "Write emails fast" },
  { id: "blog", label: "✍ Blog", desc: "Blog sections" },
  { id: "social", label: "◈ Social", desc: "Captions & posts" },
  { id: "expand", label: "⊕ Expand", desc: "Develop ideas" },
  { id: "summarize", label: "⊟ Summarize", desc: "Condense text" },
  { id: "rewrite", label: "↻ Simplify", desc: "Plain language" },
  { id: "headline", label: "★ Headlines", desc: "5 headline ideas" },
  { id: "cta", label: "→ CTA", desc: "Call to actions" },
  { id: "seo", label: "◎ SEO", desc: "SEO optimize" },
];

const TONES = ["Professional", "Friendly", "Persuasive", "Witty", "Formal", "Casual", "Inspirational"];

const FREE_LIMIT = 5;

export default function App() {
  const [mode, setMode] = useState("improve");
  const [tone, setTone] = useState("Professional");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uses, setUses] = useState(0);
  const [plan, setPlan] = useState("free"); // "free" | "pro"
  const [copied, setCopied] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [history, setHistory] = useState([]);
  const outputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("aw_uses");
    if (saved) setUses(parseInt(saved));
    const savedPlan = localStorage.getItem("aw_plan");
    if (savedPlan) setPlan(savedPlan);
  }, []);

  async function generate() {
    if (!input.trim()) return;
    if (plan === "free" && uses >= FREE_LIMIT) {
      setShowUpgrade(true);
      return;
    }

    setLoading(true);
    setError("");
    setOutput("");

    try {
      const res = await fetch("/api/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, mode, tone: tone.toLowerCase(), plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setOutput(data.result);
      const newUses = uses + 1;
      setUses(newUses);
      localStorage.setItem("aw_uses", newUses);
      setHistory(h => [{ mode, tone, input: input.slice(0, 60), output: data.result, time: new Date().toLocaleTimeString() }, ...h].slice(0, 10));

      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function activatePro() {
    // In production: integrate Stripe/LemonSqueezy here
    setPlan("pro");
    localStorage.setItem("aw_plan", "pro");
    setShowUpgrade(false);
    alert("🎉 Pro activated! (In production, connect Stripe here)");
  }

  const remaining = FREE_LIMIT - uses;

  return (
    <>
      <Head>
        <title>WriteAI — AI Writing Assistant</title>
        <meta name="description" content="AI-powered writing assistant. Improve, rewrite, summarize and generate content instantly." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✦</text></svg>" />
      </Head>

      <div style={styles.page}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.logo}>
            <span style={styles.logoMark}>✦</span>
            <span style={styles.logoText}>WriteAI</span>
          </div>
          <div style={styles.headerRight}>
            {plan === "free" && (
              <span style={styles.usageBadge}>
                {remaining > 0 ? `${remaining} free uses left` : "Limit reached"}
              </span>
            )}
            {plan === "pro" && <span style={styles.proBadge}>PRO</span>}
            <button style={plan === "pro" ? styles.btnOutline : styles.btnGold} onClick={() => plan === "free" ? setShowUpgrade(true) : null}>
              {plan === "pro" ? "✦ Pro Active" : "Upgrade $1/mo"}
            </button>
          </div>
        </header>

        <main style={styles.main}>
          {/* Hero */}
          <div style={styles.hero}>
            <h1 style={styles.heroTitle}>Write anything.<br />In seconds.</h1>
            <p style={styles.heroSub}>10 AI writing modes. Any tone. Any language. Powered by Claude.</p>
          </div>

          <div style={styles.workspace}>
            {/* Left panel */}
            <div style={styles.leftPanel}>
              {/* Mode selector */}
              <div style={styles.section}>
                <label style={styles.sectionLabel}>Mode</label>
                <div style={styles.modeGrid}>
                  {MODES.map(m => (
                    <button
                      key={m.id}
                      style={{ ...styles.modeBtn, ...(mode === m.id ? styles.modeBtnActive : {}) }}
                      onClick={() => setMode(m.id)}
                      title={m.desc}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone selector */}
              <div style={styles.section}>
                <label style={styles.sectionLabel}>Tone</label>
                <div style={styles.toneRow}>
                  {TONES.map(t => (
                    <button
                      key={t}
                      style={{ ...styles.toneBtn, ...(tone === t ? styles.toneBtnActive : {}) }}
                      onClick={() => setTone(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div style={styles.section}>
                <label style={styles.sectionLabel}>Your text</label>
                <textarea
                  style={styles.textarea}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Paste your text, describe an idea, or give instructions..."
                  rows={7}
                  onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generate(); }}
                />
                <div style={styles.inputFooter}>
                  <span style={styles.charCount}>{input.length} chars · Ctrl+Enter to generate</span>
                  <button
                    style={{ ...styles.btnGenerate, ...(loading ? styles.btnLoading : {}) }}
                    onClick={generate}
                    disabled={loading || !input.trim()}
                  >
                    {loading ? (
                      <span style={styles.dots}>
                        <span style={styles.dot} />
                        <span style={{ ...styles.dot, animationDelay: "0.2s" }} />
                        <span style={{ ...styles.dot, animationDelay: "0.4s" }} />
                      </span>
                    ) : "Generate ✦"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div style={styles.rightPanel}>
              {/* Output */}
              <div style={styles.section} ref={outputRef}>
                <div style={styles.outputHeader}>
                  <label style={styles.sectionLabel}>Result</label>
                  {output && (
                    <div style={styles.outputActions}>
                      <button style={styles.actionBtn} onClick={copy}>{copied ? "✓ Copied!" : "Copy"}</button>
                      <button style={styles.actionBtn} onClick={() => setInput(output)}>Use as input</button>
                    </div>
                  )}
                </div>
                <div style={{ ...styles.outputBox, ...(output ? styles.outputBoxFilled : {}) }}>
                  {loading && (
                    <div style={styles.loadingState}>
                      <div style={styles.loadingBar}>
                        <div style={styles.loadingFill} />
                      </div>
                      <p style={styles.loadingText}>Writing with AI...</p>
                    </div>
                  )}
                  {!loading && output && <p style={styles.outputText}>{output}</p>}
                  {!loading && !output && !error && (
                    <div style={styles.emptyState}>
                      <span style={styles.emptyIcon}>✦</span>
                      <p style={styles.emptyText}>Your AI-generated content will appear here</p>
                    </div>
                  )}
                  {error && <p style={styles.errorText}>⚠ {error}</p>}
                </div>
              </div>

              {/* History */}
              {history.length > 0 && (
                <div style={styles.section}>
                  <label style={styles.sectionLabel}>Recent</label>
                  <div style={styles.historyList}>
                    {history.slice(0, 4).map((h, i) => (
                      <div key={i} style={styles.historyItem} onClick={() => { setOutput(h.output); setInput(h.input); }}>
                        <span style={styles.historyMode}>{h.mode}</span>
                        <span style={styles.historyInput}>{h.input}...</span>
                        <span style={styles.historyTime}>{h.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Upgrade Modal */}
        {showUpgrade && (
          <div style={styles.overlay} onClick={() => setShowUpgrade(false)}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
              <button style={styles.modalClose} onClick={() => setShowUpgrade(false)}>✕</button>
              <div style={styles.modalIcon}>✦</div>
              <h2 style={styles.modalTitle}>Upgrade to Pro</h2>
              <p style={styles.modalDesc}>You've used all {FREE_LIMIT} free generations. Go Pro for unlimited access.</p>
              <div style={styles.pricingCard}>
                <div style={styles.pricingTop}>
                  <span style={styles.price}>$1</span>
                  <span style={styles.period}>/month</span>
                </div>
                <ul style={styles.featureList}>
                  {["Unlimited generations", "All 10 writing modes", "Priority Claude AI", "Export history", "Early access to new features"].map(f => (
                    <li key={f} style={styles.featureItem}>✓ {f}</li>
                  ))}
                </ul>
                <button style={styles.btnUpgrade} onClick={activatePro}>
                  Start Pro — $1/month
                </button>
                <p style={styles.modalNote}>Cancel anytime. No commitment.</p>
              </div>
            </div>
          </div>
        )}

        <footer style={styles.footer}>
          <p>Built with Claude AI · <strong>$1/month</strong> for unlimited writing · Deploy your own copy</p>
        </footer>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes loadingSlide {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 95%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }
        @media (max-width: 768px) {
          .workspace { flex-direction: column !important; }
        }
      `}</style>
    </>
  );
}

const styles = {
  page: { minHeight: "100vh", display: "flex", flexDirection: "column" },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "1rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(15, 15, 15, 0.18)", backdropFilter: "blur(16px)",
    position: "sticky", top: 0, zIndex: 100,
  },
  logo: { display: "flex", alignItems: "center", gap: "10px" },
  logoMark: { fontSize: "24px", color: "#d4a843" },
  logoText: { fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 700, color: "#f8f0dc" },
  headerRight: { display: "flex", alignItems: "center", gap: "12px" },
  usageBadge: { fontSize: "13px", color: "#6b6b6b", background: "#f2f1ed", padding: "4px 10px", borderRadius: "20px" },
  proBadge: { fontSize: "12px", fontWeight: 700, color: "#d4a843", background: "#fef9ec", padding: "4px 10px", borderRadius: "20px", border: "1px solid #f0d98a" },
  btnGold: {
    background: "#d4a843", color: "white", border: "none", borderRadius: "8px",
    padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Syne, sans-serif",
  },
  btnOutline: {
    background: "transparent", color: "#d4a843", border: "1px solid #d4a843", borderRadius: "8px",
    padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "default", fontFamily: "Syne, sans-serif",
  },
  main: { flex: 1, maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem", width: "100%" },
  hero: { textAlign: "center", marginBottom: "2.5rem" },
  heroTitle: { fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.15, color: "#f7f0e8", marginBottom: "0.75rem" },
  heroSub: { fontSize: "16px", color: "#dccdab", maxWidth: "480px", margin: "0 auto" },
  workspace: { display: "flex", gap: "2rem", alignItems: "flex-start" },
  leftPanel: { flex: "1 1 50%", minWidth: 0 },
  rightPanel: { flex: "1 1 50%", minWidth: 0 },
  section: { marginBottom: "1.5rem" },
  sectionLabel: { display: "block", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b6b6b", marginBottom: "8px" },
  modeGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: "6px" },
  modeBtn: {
    padding: "8px 10px", borderRadius: "8px", fontSize: "13px", cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.14)", color: "#f3efdf",
    fontFamily: "DM Sans, sans-serif", transition: "all 0.15s", textAlign: "left",
  },
  modeBtnActive: { background: "rgba(255,255,255,0.18)", color: "#0f0f0f", border: "1px solid rgba(212,175,55,0.9)" },
  toneRow: { display: "flex", flexWrap: "wrap", gap: "6px" },
  toneBtn: {
    padding: "5px 12px", borderRadius: "20px", fontSize: "13px", cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.08)", color: "#f0e9d7", transition: "all 0.15s",
  },
  toneBtnActive: { background: "rgba(212,175,55,0.18)", color: "#121212", border: "1px solid rgba(212,175,55,0.9)" },
  textarea: {
    width: "100%", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.14)", fontSize: "15px", lineHeight: 1.6, color: "#f3eddb",
    resize: "vertical", outline: "none", fontFamily: "DM Sans, sans-serif",
    transition: "border-color 0.2s",
  },
  inputFooter: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" },
  charCount: { fontSize: "12px", color: "#6b6b6b" },
  btnGenerate: {
    background: "#0f0f0f", color: "white", border: "none", borderRadius: "8px",
    padding: "10px 24px", fontSize: "14px", fontWeight: 600, cursor: "pointer",
    fontFamily: "Syne, sans-serif", transition: "all 0.15s", minWidth: "130px",
  },
  btnLoading: { opacity: 0.7, cursor: "not-allowed" },
  dots: { display: "flex", gap: "5px", justifyContent: "center", alignItems: "center", height: "20px" },
  dot: { width: "6px", height: "6px", borderRadius: "50%", background: "white", display: "inline-block", animation: "bounce 1.2s infinite" },
  outputHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" },
  outputActions: { display: "flex", gap: "8px" },
  actionBtn: {
    padding: "4px 12px", fontSize: "12px", borderRadius: "6px", cursor: "pointer",
    border: "1px solid rgba(0,0,0,0.12)", background: "transparent", color: "#3a3a3a", transition: "background 0.15s",
  },
  outputBox: {
    minHeight: "200px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.16)", padding: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center",
  },
  outputBoxFilled: { background: "rgba(255,255,255,0.18)", alignItems: "flex-start", animation: "fadeIn 0.3s ease" },
  emptyState: { textAlign: "center" },
  emptyIcon: { fontSize: "32px", color: "#d4a843", display: "block", marginBottom: "8px" },
  emptyText: { fontSize: "14px", color: "#6b6b6b" },
  loadingState: { width: "100%", textAlign: "center" },
  loadingBar: { height: "3px", background: "rgba(0,0,0,0.08)", borderRadius: "2px", overflow: "hidden", marginBottom: "12px" },
  loadingFill: { height: "100%", background: "#d4a843", animation: "loadingSlide 2s ease-out forwards" },
  loadingText: { fontSize: "14px", color: "#6b6b6b" },
  outputText: { fontSize: "15px", lineHeight: 1.75, color: "#efe5d1", whiteSpace: "pre-wrap" },
  errorText: { fontSize: "14px", color: "#ffb3a7" },
  historyList: { display: "flex", flexDirection: "column", gap: "6px" },
  historyItem: {
    display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px",
    borderRadius: "8px", background: "rgba(255,255,255,0.12)", cursor: "pointer", transition: "background 0.15s",
  },
  historyMode: { fontSize: "11px", fontWeight: 600, color: "#d4a843", textTransform: "uppercase", minWidth: "60px" },
  historyInput: { fontSize: "13px", color: "#6b6b6b", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  historyTime: { fontSize: "11px", color: "#6b6b6b" },
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex",
    alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem",
  },
  modal: {
    background: "white", borderRadius: "16px", padding: "2rem", maxWidth: "420px", width: "100%",
    position: "relative", animation: "fadeIn 0.2s ease",
  },
  modalClose: {
    position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none",
    fontSize: "18px", cursor: "pointer", color: "#6b6b6b",
  },
  modalIcon: { fontSize: "40px", color: "#d4a843", textAlign: "center", marginBottom: "0.75rem" },
  modalTitle: { fontSize: "24px", fontWeight: 800, textAlign: "center", marginBottom: "0.5rem" },
  modalDesc: { fontSize: "14px", color: "#6b6b6b", textAlign: "center", marginBottom: "1.5rem" },
  pricingCard: { background: "rgba(255,255,255,0.16)", borderRadius: "12px", padding: "1.5rem", border: "1px solid rgba(255,255,255,0.14)" },
  pricingTop: { display: "flex", alignItems: "baseline", gap: "4px", justifyContent: "center", marginBottom: "1rem" },
  price: { fontSize: "48px", fontWeight: 800, fontFamily: "Syne, sans-serif", color: "#d4a843" },
  period: { fontSize: "16px", color: "#6b6b6b" },
  featureList: { listStyle: "none", marginBottom: "1.25rem" },
  featureItem: { fontSize: "14px", color: "#3a3a3a", padding: "5px 0", display: "flex", alignItems: "center", gap: "8px" },
  btnUpgrade: {
    width: "100%", padding: "14px", background: "#d4a843", color: "white", border: "none",
    borderRadius: "10px", fontSize: "16px", fontWeight: 700, cursor: "pointer",
    fontFamily: "Syne, sans-serif", marginBottom: "8px",
  },
  modalNote: { fontSize: "12px", color: "#6b6b6b", textAlign: "center" },
  footer: { borderTop: "1px solid rgba(0,0,0,0.07)", padding: "1.25rem 2rem", textAlign: "center", fontSize: "13px", color: "#6b6b6b" },
};
