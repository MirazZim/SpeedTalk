const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-gradient-to-r from-white via-blue-50 to-white p-12 rounded-3xl shadow-xl">
      <div className="max-w-md text-center space-y-8">
        {/* Pattern Grid */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-xl bg-primary/20 shadow-lg ${i % 2 === 0 ? "animate-pulse" : ""} transition duration-300`}
            />
          ))}
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
