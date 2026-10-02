import React, { useMemo } from 'react';

export const PetalBackground: React.FC = () => {
  // Generate deterministic petals so there are no hydration mismatches
  const petals = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${(i * 5.8 + 2) % 96}%`,
      delay: `${(i * 0.7) % 7}s`,
      duration: `${10 + (i % 6) * 1.5}s`,
      size: 14 + (i % 12),
      opacity: 0.35 + (i % 5) * 0.1,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Soft atmospheric gradient mesh */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-900/15 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-10 right-1/4 w-[30rem] h-[30rem] bg-pink-950/15 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-amber-900/10 rounded-full blur-3xl" />

      {/* Floating petals */}
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute -top-10 animate-float-petal"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: p.opacity,
          }}
        >
          <svg
            width={p.size}
            height={p.size * 1.3}
            viewBox="0 0 24 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-rose-400/70 drop-shadow-[0_2px_8px_rgba(244,63,94,0.3)] transform rotate-12"
          >
            <path
              d="M12 0C17.5 7 24 14 22 23C20 30 12 32 12 32C12 32 4 30 2 23C0 14 6.5 7 12 0Z"
              fill="currentColor"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};
