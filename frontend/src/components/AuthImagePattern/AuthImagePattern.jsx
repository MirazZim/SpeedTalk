import { useEffect } from 'react';

const AuthImagePattern = ({ title, subtitle }) => {
  useEffect(() => {
    // Inject custom animation once (for simplicity)
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes softPulse {
        0%, 100% {
          transform: scale(1);
          filter: brightness(1);
        }
        50% {
          transform: scale(1.03);
          filter: brightness(1.1);
        }
      }
      .animate-softPulse {
        animation: softPulse 3s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200 to-base-100 p-12 rounded-3xl mt-20 shadow-2xl ml-8 mr-8 backdrop-blur-sm">
      <div className="max-w-md text-center space-y-10">
        {/* Pattern Grid */}
        <div className="grid grid-cols-3 gap-5 mb-6">
          {[...Array(9)].map((_, i) => {
            const gradientDirection = i % 2 === 0 ? "bg-gradient-to-br" : "bg-gradient-to-tl";
            const delay = `delay-${i * 75}`;
            return (
              <div
                key={i}
                className={`aspect-square rounded-2xl ${gradientDirection} from-primary/70 to-secondary/70 shadow-md transition-all duration-500 ease-in-out animate-softPulse ${delay}`}
              />
            );
          })}
        </div>

        {/* Title */}
        <h2 className="text-4xl font-bold text-base-content tracking-tight leading-snug">
          {title}
        </h2>

        {/* Subtitle */}
        <p className="text-base-content/70 text-lg leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
