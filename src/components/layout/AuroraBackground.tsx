export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        className="absolute w-[200vw] h-[200vh] top-1/2 left-1/2"
        style={{
          transform: "translate(-50%, -50%)",
          background: "conic-gradient(from 0deg at 50% 50%, #161d30 0deg, #0e1322 60deg, #1e293b 130deg, #0f172a 180deg, #1e1b4b 240deg, #161d30 360deg)",
          filter: "blur(100px)",
          animation: "aurora-rotate 30s linear infinite",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, transparent 40%, #080b14 100%)",
        }}
      />
    </div>
  );
}
