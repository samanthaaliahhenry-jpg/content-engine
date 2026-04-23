import { useState } from "react";

const AUNTIE_BEMI = `The Rise of Auntie Bemi and the Cultural Reorientation of Influence

I'm Samantha Henry, a London-based strategist and culture writer exploring how Black British identity, community, and womanhood are shifting in real time. As a Black British woman raised by a constellation of aunties — biological and chosen — I've always known the power of their presence.

They were the women who showed up. They taught me what it meant to take up space; to walk into a room like you'd already been invited. They were rarely the ones on TV. Not really seen. Not fully.

That started to change when Auntie Bemi went to meet King Charles.

The viral moment — a Black British woman of a certain age, unfiltered, warm, and completely herself — wasn't just a feel-good clip. It was a signal. The public's embrace of her wasn't about novelty. It was recognition. A hunger for figures who are joyful, real, and multidimensional — not performing smallness to make other people comfortable.

For strategists, advertisers, and cultural thinkers, this isn't just a feel-good story. It's a signal about aspiration, influence, and emotional currency.

The "auntie" is an archetype of influence — not a consumer, but a tastemaker, a mentor, a cultural anchor. And she has been almost entirely overlooked by brands. Joy is a strategic asset. In a world of burnout and crisis, it cuts through. Cultural specificity is power. Authenticity reaches further than assimilation.

Auntie Bemi's moment is more than a meme. It's a mirror. It reflects a culture where the margins are becoming the centre — where joy, age, and identity are being reimagined in real time.

The question isn't just what's trending. It's whose joy we've been overlooking, and what happens when we finally pay attention.`;

const PLATFORMS = [
  { id: "linkedin", label: "LinkedIn Post", icon: "💼" },
  { id: "substack_note", label: "Substack Note", icon: "📝" },
  { id: "carousel", label: "Carousel Copy", icon: "🎠" },
  { id: "twitter", label: "Short Post (X/Threads)", icon: "💬" },
];

const ESSAYS = [
  { id: "bemi", label: "Auntie Bemi", content: AUNTIE_BEMI },
  { id: "custom", label: "Paste your essay", content: "" },
];

export default function ContentEngine() {
  const [selectedEssay, setSelectedEssay] = useState("bemi");
  const [customEssay, setCustomEssay] = useState("");
  const [activeTab, setActiveTab] = useState("linkedin");
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [copied, setCopied] = useState(null);
  const [error, setError] = useState(null);

  const getEssayContent = () =>
    selectedEssay === "custom" ? customEssay : AUNTIE_BEMI;

  const generate = async (platformId) => {
    const essay = getEssayContent();
    if (!essay.trim()) {
      setError("Please paste your essay first.");
      return;
    }
    setError(null);
    setLoading((l) => ({ ...l, [platformId]: true }));

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ essay, platform: platformId }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults((r) => ({ ...r, [platformId]: data.result }));
    } catch (err) {
      setResults((r) => ({ ...r, [platformId]: "Error generating. Try again." }));
    }

    setLoading((l) => ({ ...l, [platformId]: false }));
  };

  const generateAll = async () => {
    for (const p of PLATFORMS) {
      await generate(p.id);
    }
  };

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const anyLoading = Object.values(loading).some(Boolean);

  return (
    <div style={{
      fontFamily: "'Lato', sans-serif",
      background: "#F5ECD7",
      minHeight: "100vh",
      color: "#2A1F14",
    }}>
      {/* Header */}
      <div style={{
        background: "#C1623F",
        padding: "28px 28px 22px",
        borderBottom: "3px solid #C9A84C",
      }}>
        <p style={{ margin: "0 0 4px", fontSize: "10px", letterSpacing: "3px", color: "#C9A84C", textTransform: "uppercase" }}>
          Sam Henry · Cultural & Brand Strategist
        </p>
        <h1 style={{
          margin: "0 0 6px",
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(20px, 4vw, 30px)",
          color: "#F5ECD7",
          fontWeight: 700,
          lineHeight: 1.2,
        }}>
          Content Engine
        </h1>
        <p style={{ margin: 0, fontSize: "13px", color: "#F5ECD7", opacity: 0.85 }}>
          One essay. Four platforms. Your voice, extracted.
        </p>
      </div>

      <div style={{ padding: "20px", maxWidth: "780px", margin: "0 auto" }}>

        {/* Essay selector */}
        <div style={{ background: "white", borderRadius: "10px", border: "1px solid #e0d4c0", padding: "18px", marginBottom: "16px" }}>
          <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: "13px" }}>Select essay</p>
          <div style={{ display: "flex", gap: "8px", marginBottom: selectedEssay === "custom" ? "12px" : 0 }}>
            {ESSAYS.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelectedEssay(e.id)}
                style={{
                  background: selectedEssay === e.id ? "#C1623F" : "#F5ECD7",
                  color: selectedEssay === e.id ? "#F5ECD7" : "#C1623F",
                  border: "1.5px solid #C1623F",
                  borderRadius: "20px",
                  padding: "6px 16px",
                  fontSize: "12px",
                  cursor: "pointer",
                  fontWeight: selectedEssay === e.id ? 700 : 400,
                }}
              >
                {e.label}
              </button>
            ))}
          </div>
          {selectedEssay === "custom" && (
            <textarea
              value={customEssay}
              onChange={(e) => setCustomEssay(e.target.value)}
              placeholder="Paste your essay here…"
              style={{
                width: "100%",
                minHeight: "140px",
                border: "1.5px solid #C1623F",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "13px",
                fontFamily: "inherit",
                resize: "vertical",
                background: "#fffdf9",
                boxSizing: "border-box",
                lineHeight: 1.6,
                marginTop: "4px",
              }}
            />
          )}
          {selectedEssay === "bemi" && (
            <p style={{ margin: "10px 0 0", fontSize: "12px", color: "#9a7d62", fontStyle: "italic" }}>
              "The Rise of Auntie Bemi and the Cultural Reorientation of Influence" — loaded.
            </p>
          )}
        </div>

        {error && (
          <p style={{ color: "#C1623F", fontSize: "13px", margin: "0 0 12px" }}>{error}</p>
        )}

        {/* Generate all */}
        <button
          onClick={generateAll}
          disabled={anyLoading}
          style={{
            width: "100%",
            background: anyLoading ? "#d4b89a" : "#C9A84C",
            color: "#2A1F14",
            border: "none",
            borderRadius: "8px",
            padding: "13px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: anyLoading ? "not-allowed" : "pointer",
            marginBottom: "20px",
            letterSpacing: "0.3px",
          }}
        >
          {anyLoading ? "Generating…" : "✦ Generate All Platforms"}
        </button>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveTab(p.id)}
              style={{
                background: activeTab === p.id ? "#C1623F" : "white",
                color: activeTab === p.id ? "#F5ECD7" : "#C1623F",
                border: "1.5px solid #C1623F",
                borderRadius: "20px",
                padding: "6px 14px",
                fontSize: "12px",
                cursor: "pointer",
                fontWeight: activeTab === p.id ? 700 : 400,
              }}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>

        {/* Active panel */}
        {PLATFORMS.filter((p) => p.id === activeTab).map((p) => (
          <div key={p.id} style={{ background: "white", border: "1px solid #e0d4c0", borderRadius: "10px", overflow: "hidden" }}>
            <div style={{
              padding: "12px 18px",
              background: "#faf5ee",
              borderBottom: "1px solid #e0d4c0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <span style={{ fontWeight: 700, fontSize: "13px" }}>{p.icon} {p.label}</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => generate(p.id)}
                  disabled={loading[p.id]}
                  style={{
                    background: "#C1623F",
                    color: "#F5ECD7",
                    border: "none",
                    borderRadius: "6px",
                    padding: "5px 13px",
                    fontSize: "12px",
                    cursor: loading[p.id] ? "not-allowed" : "pointer",
                    fontWeight: 600,
                    opacity: loading[p.id] ? 0.6 : 1,
                  }}
                >
                  {loading[p.id] ? "Writing…" : "Generate"}
                </button>
                {results[p.id] && (
                  <button
                    onClick={() => copy(results[p.id], p.id)}
                    style={{
                      background: copied === p.id ? "#C9A84C" : "white",
                      color: copied === p.id ? "#2A1F14" : "#C1623F",
                      border: "1.5px solid #C9A84C",
                      borderRadius: "6px",
                      padding: "5px 13px",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    {copied === p.id ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>
            </div>
            <div style={{ padding: "18px", minHeight: "100px" }}>
              {loading[p.id] && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#C1623F" }}>
                  <div style={{
                    width: "14px", height: "14px",
                    border: "2px solid #C1623F",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }} />
                  <span style={{ fontSize: "13px", fontStyle: "italic" }}>Writing in your voice…</span>
                </div>
              )}
              {!loading[p.id] && results[p.id] && (
                <pre style={{
                  margin: 0, fontSize: "14px", lineHeight: 1.7,
                  whiteSpace: "pre-wrap", fontFamily: "inherit",
                }}>
                  {results[p.id]}
                </pre>
              )}
              {!loading[p.id] && !results[p.id] && (
                <p style={{ margin: 0, color: "#b0967a", fontSize: "13px", fontStyle: "italic" }}>
                  Hit Generate to extract content for this platform.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@400;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
