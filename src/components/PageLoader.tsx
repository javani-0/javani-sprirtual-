import { useEffect, useState } from "react";

const PageLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 25);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-[#1A0A0A] flex flex-col items-center justify-center transition-opacity duration-300"
      style={{ opacity: progress === 100 ? 0 : 1, pointerEvents: progress === 100 ? 'none' : 'auto' }}
    >
      {/* Logo/Text */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="font-accent text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] text-gold-light tracking-wider uppercase mb-2 leading-tight">
          Javani
        </h1>
        <p className="font-body text-xs md:text-sm text-gold/80 tracking-[0.3em] uppercase">
          Spiritual Arts
        </p>
      </div>

      {/* Loading Bar */}
      <div className="w-64 md:w-80 h-1 bg-gold/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gold-light via-gold to-gold-light rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
            boxShadow: "0 0 20px rgba(201, 168, 76, 0.6)",
          }}
        />
      </div>

      {/* Loading Text */}
      <p className="mt-6 font-body text-xs text-gold/60 tracking-wider animate-pulse">
        {progress < 100 ? "LOADING..." : "READY"}
      </p>
    </div>
  );
};

export default PageLoader;
