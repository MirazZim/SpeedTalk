const AuthImagePattern = ({ title, subtitle }) => {
    return (
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-r from-primary/10 via-base-100 to-primary/10 p-12 rounded-lg shadow-xl">
        <div className="max-w-md text-center space-y-8">
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-xl bg-primary/20 shadow-md ${i % 2 === 0 ? "animate-pulse" : ""}`}
              />
            ))}
          </div>
          <h2 className="text-3xl font-extrabold text-primary mb-6">{title}</h2>
          <p className="text-lg text-base-content/70">{subtitle}</p>
        </div>
      </div>
    );
  };
  
  export default AuthImagePattern;
  