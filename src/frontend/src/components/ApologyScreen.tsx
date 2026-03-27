import { useEffect, useState } from "react";

const APOLOGIES = [
  "I'm Sorry... 🥺",
  "Please... I'm Really Sorry 😢",
  "I'm SO SO Sorry Baby!! 😭",
  "PLEASE FORGIVE ME!! I'm Crying Inside 💔",
  "I CANNOT LIVE WITHOUT YOUR FORGIVENESS 😭💔",
  "OK I'M BEGGING YOU ON MY KNEES!! PLEASE!! 🙏😭",
  "MY HEART IS SHATTERED INTO A MILLION PIECES!! 💔💔💔",
  "I WOULD CRY A THOUSAND RIVERS FOR YOU!! 😭😭😭",
  "PLEASE BABY PLEASE PLEASE PLEASE!!! 🙏🙏🙏😭😭",
  "THIS IS MY 10th ATTEMPT AND I'M NOT GIVING UP!! 💔😭🙏",
  "I LOVE YOU MORE THAN ALL THE STARS IN THE UNIVERSE!! FORGIVE ME!!! ✨💔😭",
  "OK FINE I'LL BE SORRY FOREVER AND EVER AND EVER... JUST PLEASE ACCEPT IT 😭💔🐰",
];

const SUB_MESSAGES = [
  "You mean the whole world to me and I never want to hurt you...",
  "Every second without your forgiveness feels like an eternity 💔",
  "I'd do anything to make it right, anything at all!! 😭",
  "My heart breaks more with every passing second you're upset...",
  "I am completely, utterly, totally LOST without you!! 💔💔",
  "I'm on my knees right now, figuratively AND literally!! 🙏😭",
  "The pieces of my broken heart are crying tiny heart tears!! 💔😭",
  "I've cried an entire OCEAN for you and I'll cry another!! 😭🌊",
  "PLEASE PLEASE PLEASE I'M BEGGING WITH EVERY FIBER OF MY BEING!!! 🙏😭💔",
  "Ten rejections later, my love for you is STILL stronger than ever!!! 💪💔😭",
  "You are my sun, my moon, my everything — PLEASE forgive this fool!! 🌟😭💔",
  "I'll carry this sorry in my heart for ALL OF ETERNITY just for you... 🐰💔😭",
];

const FLOATING_ITEMS = [
  { id: "f0", e: "💔" },
  { id: "f1", e: "😭" },
  { id: "f2", e: "🥺" },
  { id: "f3", e: "💔" },
  { id: "f4", e: "😢" },
  { id: "f5", e: "💔" },
  { id: "f6", e: "😭" },
  { id: "f7", e: "🥺" },
  { id: "f8", e: "💔" },
  { id: "f9", e: "😢" },
  { id: "f10", e: "💔" },
  { id: "f11", e: "😭" },
  { id: "f12", e: "🥺" },
  { id: "f13", e: "💔" },
  { id: "f14", e: "💔" },
  { id: "f15", e: "😭" },
  { id: "f16", e: "🥺" },
  { id: "f17", e: "😢" },
];

interface Props {
  rejectionCount: number;
  onAccept: () => void;
  onReject: () => void;
}

export default function ApologyScreen({
  rejectionCount,
  onAccept,
  onReject,
}: Props) {
  const [shakeKey, setShakeKey] = useState(0);
  const idx = Math.min(rejectionCount, APOLOGIES.length - 1);
  const titleSize = Math.min(1 + rejectionCount * 0.08, 1.8);

  useEffect(() => {
    if (rejectionCount > 0) {
      setShakeKey((k) => k + 1);
    }
  }, [rejectionCount]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0B1220 0%, #121B2B 50%, #0D1525 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: "3rem",
      }}
    >
      <style>{`
        @keyframes floatDrift {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-30px) rotate(10deg); opacity: 1; }
          100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          10% { transform: translateX(-15px) rotate(-5deg); }
          20% { transform: translateX(15px) rotate(5deg); }
          30% { transform: translateX(-20px) rotate(-8deg); }
          40% { transform: translateX(20px) rotate(8deg); }
          50% { transform: translateX(-15px) rotate(-5deg); }
          60% { transform: translateX(15px) rotate(5deg); }
          70% { transform: translateX(-10px) rotate(-3deg); }
          80% { transform: translateX(10px) rotate(3deg); }
          90% { transform: translateX(-5px) rotate(-1deg); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          15% { transform: rotate(-12deg) scale(1.05); }
          30% { transform: rotate(12deg) scale(1.05); }
          45% { transform: rotate(-8deg) scale(1.02); }
          60% { transform: rotate(8deg) scale(1.02); }
          75% { transform: rotate(-4deg) scale(1.01); }
        }
        @keyframes pulse-glow-blue {
          0%, 100% { box-shadow: 0 0 20px rgba(30,91,255,0.5), 0 0 40px rgba(30,91,255,0.3); }
          50% { box-shadow: 0 0 40px rgba(30,91,255,0.8), 0 0 80px rgba(30,91,255,0.5); }
        }
        @keyframes pulse-glow-red {
          0%, 100% { box-shadow: 0 0 20px rgba(255,59,59,0.5), 0 0 40px rgba(255,59,59,0.3); }
          50% { box-shadow: 0 0 40px rgba(255,59,59,0.8), 0 0 80px rgba(255,59,59,0.5); }
        }
        @keyframes titlePulse {
          0%, 100% { text-shadow: 0 0 10px rgba(242,245,250,0.3); }
          50% { text-shadow: 0 0 30px rgba(242,245,250,0.7), 0 0 60px rgba(200,180,255,0.4); }
        }
        .bunny-anim { animation: wiggle 0.6s ease-in-out; }
        .content-shake { animation: shake 0.7s ease-in-out; }
        .btn-accept {
          background: linear-gradient(135deg, #1E5BFF, #1B3FAE);
          animation: pulse-glow-blue 2s ease-in-out infinite;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-accept:hover {
          transform: scale(1.07);
          box-shadow: 0 0 60px rgba(30,91,255,0.9), 0 0 100px rgba(30,91,255,0.6) !important;
        }
        .btn-reject {
          background: linear-gradient(135deg, #FF3B3B, #C21D1D);
          animation: pulse-glow-red 2s ease-in-out infinite;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-reject:hover {
          transform: scale(1.07);
          box-shadow: 0 0 60px rgba(255,59,59,0.9), 0 0 100px rgba(255,59,59,0.6) !important;
        }
        .apology-title { animation: titlePulse 2s ease-in-out infinite; }
      `}</style>

      {/* Floating broken hearts */}
      {FLOATING_ITEMS.map((item, i) => (
        <div
          key={item.id}
          style={{
            position: "absolute",
            left: `${(i * 5.5 + 3) % 95}%`,
            top: `${(i * 7 + 5) % 90}%`,
            fontSize: `${1.2 + (i % 4) * 0.5}rem`,
            opacity: 0.35,
            animation: `floatDrift ${3 + (i % 4)}s ease-in-out ${(i * 0.4) % 3}s infinite`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {item.e}
        </div>
      ))}

      {/* Navbar */}
      <div
        style={{
          marginTop: "1.5rem",
          background: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "999px",
          padding: "0.6rem 2rem",
          color: "#C5CFDD",
          fontSize: "0.85rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          zIndex: 10,
        }}
      >
        💌 A Message From My Heart
      </div>

      {/* Main layout */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "1100px",
          marginTop: "2rem",
          gap: "1rem",
          padding: "0 1rem",
          zIndex: 10,
          position: "relative",
        }}
      >
        {/* Left bunny */}
        <div
          key={`bunny-left-${shakeKey}`}
          className={shakeKey > 0 ? "bunny-anim" : ""}
          style={{ flexShrink: 0, display: "flex", alignItems: "center" }}
        >
          <img
            src="/assets/generated/bunny-crying-transparent.dim_400x400.png"
            alt="Crying bunny"
            style={{
              width: "clamp(100px, 15vw, 220px)",
              filter: "drop-shadow(0 0 20px rgba(255,100,100,0.4))",
            }}
          />
        </div>

        {/* Center card */}
        <div
          key={`card-${shakeKey}`}
          className={shakeKey > 0 ? "content-shake" : ""}
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "24px",
            padding: "clamp(1.5rem, 4vw, 3rem)",
            textAlign: "center",
            maxWidth: "600px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #FF3B3B, #C21D1D)",
              color: "white",
              borderRadius: "999px",
              padding: "0.3rem 1.2rem",
              fontSize: "0.75rem",
              fontWeight: 800,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
              boxShadow: "0 0 20px rgba(255,59,59,0.5)",
            }}
          >
            💔 STILL SORRY 💔
          </div>

          <h1
            className="apology-title"
            style={{
              color: "#F2F5FA",
              fontWeight: 900,
              fontSize: `clamp(1.4rem, ${titleSize * 2.5}vw + 0.5rem, ${titleSize * 2.2}rem)`,
              lineHeight: 1.2,
              marginBottom: "1rem",
              textShadow: "0 0 20px rgba(255,150,150,0.3)",
            }}
          >
            {APOLOGIES[idx]}
          </h1>

          <p
            style={{
              color: "#C5CFDD",
              fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)",
              lineHeight: 1.7,
              marginBottom: "1.5rem",
              fontStyle: "italic",
            }}
          >
            {SUB_MESSAGES[idx]}
          </p>

          {rejectionCount > 0 && (
            <div
              data-ocid="apology.error_state"
              style={{
                color: "#FF4B6E",
                fontSize: "0.9rem",
                fontWeight: 700,
                marginBottom: "1.5rem",
                padding: "0.5rem 1rem",
                background: "rgba(255,75,110,0.1)",
                borderRadius: "12px",
                border: "1px solid rgba(255,75,110,0.25)",
              }}
            >
              She has broken my heart {rejectionCount} time
              {rejectionCount !== 1 ? "s" : ""} 💔
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              className="btn-accept"
              onClick={onAccept}
              data-ocid="apology.primary_button"
              style={{
                color: "white",
                fontWeight: 800,
                fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
                padding: "0.85rem 1.8rem",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.02em",
              }}
            >
              Yes, I Forgive You 💞
            </button>
            <button
              type="button"
              className="btn-reject"
              onClick={onReject}
              data-ocid="apology.delete_button"
              style={{
                color: "white",
                fontWeight: 800,
                fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
                padding: "0.85rem 1.8rem",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.02em",
              }}
            >
              NO! Not Forgiven Yet! 🐰
            </button>
          </div>
        </div>

        {/* Right bunny */}
        <div
          key={`bunny-right-${shakeKey}`}
          className={shakeKey > 0 ? "bunny-anim" : ""}
          style={{ flexShrink: 0, display: "flex", alignItems: "center" }}
        >
          <img
            src="/assets/generated/bunny-crying-transparent.dim_400x400.png"
            alt="Crying bunny"
            style={{
              width: "clamp(100px, 15vw, 220px)",
              transform: "scaleX(-1)",
              filter: "drop-shadow(0 0 20px rgba(255,100,100,0.4))",
            }}
          />
        </div>
      </div>

      <footer
        style={{
          marginTop: "auto",
          paddingTop: "2rem",
          color: "rgba(197,207,221,0.4)",
          fontSize: "0.75rem",
          zIndex: 10,
        }}
      >
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          style={{
            color: "rgba(197,207,221,0.6)",
            textDecoration: "underline",
          }}
          target="_blank"
          rel="noreferrer"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
