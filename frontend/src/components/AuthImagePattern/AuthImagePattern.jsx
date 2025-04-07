const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-gradient-to-r from-white via-blue-50 to-white p-12 rounded-3xl mt-20 shadow-xl ml-8 mr-8">
      <div className="max-w-md text-center space-y-8">
        {/* Pattern Grid */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[...Array(9)].map((_, i) => {
            // Choose gradient direction based on index for variety.
            const gradientDirection = i % 2 === 0 ? "bg-gradient-to-r" : "bg-gradient-to-br";

            // Apply different animations based on the index.
            let animationClass = "";
            if (i % 2 === 0) {
              animationClass = "animate-pulse";
            }

            // Define a hover effect that scales up and rotates slightly.
            const hoverEffect = "transform hover:scale-110 hover:rotate-3";

            return (
              <div
                key={i}
                className={`aspect-square rounded-xl ${gradientDirection} from-primary/60 to-secondary/60 shadow-lg transition-all duration-300 ${hoverEffect} ${animationClass}`}
              />
            );
          })}
        </div>

        {/* Title */}
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">{title}</h2>

        {/* Subtitle */}
        <p className="text-lg text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
