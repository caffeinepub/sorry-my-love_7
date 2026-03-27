import { useState } from "react";

const HEART_EMOJIS = [
  "❤️",
  "🩷",
  "💕",
  "💖",
  "💗",
  "💓",
  "💞",
  "💝",
  "❤️",
  "💖",
  "🩷",
  "💕",
  "💗",
  "💞",
  "❤️‍🔥",
];

function generateHearts(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: HEART_EMOJIS[i % HEART_EMOJIS.length],
    left: `${(i * 1.7 + 1) % 98}%`,
    size: `${1.2 + (i % 5) * 0.5}rem`,
    duration: `${3 + (i % 5)}s`,
    delay: `${(i * 0.07) % 4}s`,
    opacity: 0.6 + (i % 4) * 0.1,
  }));
}

interface Props {
  onReset: () => void;
}

export default function AcceptanceScreen({ onReset }: Props) {
  const [hearts] = useState(() => generateHearts(60));

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #FF1744 0%, #FF4081 40%, #FF6B9D 70%, #FF1744 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <style>{`
        @keyframes heartRain {
          0% { transform: translateY(110vh) rotate(0deg) scale(0.8); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-15vh) rotate(20deg) scale(1.1); opacity: 0; }
        }
        @keyframes bounceJoy {
          0%, 100% { transform: scale(1) translateY(0); }
          25% { transform: scale(1.12) translateY(-20px); }
          50% { transform: scale(1) translateY(0); }
          75% { transform: scale(1.08) translateY(-12px); }
        }
        @keyframes loveTextPulse {
          0%, 100% { transform: scale(1); text-shadow: 0 0 30px rgba(255,255,255,0.6), 0 0 60px rgba(255,100,150,0.5); }
          50% { transform: scale(1.05); text-shadow: 0 0 60px rgba(255,255,255,0.9), 0 0 100px rgba(255,100,150,0.8); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
        .bunny-bounce { animation: bounceJoy 0.8s ease-in-out infinite; }
        .bunny-bounce-delayed { animation: bounceJoy 0.8s ease-in-out 0.4s infinite; }
        .love-text { animation: loveTextPulse 1.5s ease-in-out infinite; }
        .sparkle-star { animation: sparkle 1s ease-in-out infinite; }
      `}</style>

      {hearts.map((h) => (
        <div
          key={h.id}
          style={{
            position: "fixed",
            left: h.left,
            bottom: 0,
            fontSize: h.size,
            opacity: h.opacity,
            animation: `heartRain ${h.duration} ${h.delay} linear infinite`,
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          {h.emoji}
        </div>
      ))}

      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          padding: "2rem",
          maxWidth: "700px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <img
            src="/assets/generated/bunny-happy-transparent.dim_400x400.png"
            alt="Happy bunny"
            className="bunny-bounce"
            style={{
              width: "clamp(120px, 18vw, 200px)",
              filter: "drop-shadow(0 0 30px rgba(255,255,255,0.6))",
            }}
          />
          <img
            src="/assets/generated/bunny-happy-transparent.dim_400x400.png"
            alt="Happy bunny"
            className="bunny-bounce-delayed"
            style={{
              width: "clamp(120px, 18vw, 200px)",
              transform: "scaleX(-1)",
              filter: "drop-shadow(0 0 30px rgba(255,255,255,0.6))",
            }}
          />
        </div>

        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          <span className="sparkle-star" style={{ animationDelay: "0s" }}>
            ✨
          </span>
          <span className="sparkle-star" style={{ animationDelay: "0.3s" }}>
            ⭐
          </span>
          <span className="sparkle-star" style={{ animationDelay: "0.6s" }}>
            ✨
          </span>
          <span className="sparkle-star" style={{ animationDelay: "0.9s" }}>
            ⭐
          </span>
          <span className="sparkle-star" style={{ animationDelay: "1.2s" }}>
            ✨
          </span>
        </div>

        <h1
          className="love-text"
          data-ocid="acceptance.panel"
          style={{
            color: "white",
            fontWeight: 900,
            fontSize: "clamp(2rem, 7vw, 4.5rem)",
            lineHeight: 1.15,
            marginBottom: "1rem",
            textShadow: "0 0 30px rgba(255,255,255,0.6)",
          }}
        >
          I LOVE YOU SO MUCH!!! 💖
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.92)",
            fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
            fontWeight: 600,
            lineHeight: 1.7,
            marginBottom: "0.8rem",
            textShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          Thank you for forgiving me, you mean everything to me! 🌟
        </p>

        <p
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
            marginBottom: "2.5rem",
          }}
        >
          You are my whole universe and I promise to never make you sad again
          🐰💕
        </p>

        <button
          type="button"
          onClick={onReset}
          data-ocid="acceptance.secondary_button"
          style={{
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)",
            border: "2px solid rgba(255,255,255,0.5)",
            borderRadius: "999px",
            color: "white",
            fontWeight: 700,
            fontSize: "0.85rem",
            padding: "0.6rem 1.6rem",
            cursor: "pointer",
            letterSpacing: "0.05em",
            transition: "background 0.2s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.35)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.2)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Start Over 🔄
        </button>

        <p
          style={{
            marginTop: "2rem",
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.72rem",
          }}
        >
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            style={{
              color: "rgba(255,255,255,0.6)",
              textDecoration: "underline",
            }}
            target="_blank"
            rel="noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
