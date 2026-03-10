import Navigation from "./Navigation";

function Hero() {
  return (
    <>
      <div className="relative bg-[url('https://images.unsplash.com/photo-1608748010899-18f300247112?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center bg-no-repeat">

        <div className="absolute inset-x-0 top-0 h-24 md:h-40 bg-gradient-to-b from-black/90 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 md:h-40 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />

        <div className="relative z-10">
          <Navigation />
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center min-h-[60vh] md:min-h-[80vh] px-4 md:px-8 pt-20 md:pt-28 pb-12 md:pb-16 text-center gap-3 md:gap-4">
          <p
            className="text-white text-xs sm:text-sm md:text-base tracking-[0.1em]"
            style={{ letterSpacing: "clamp(0.1rem, 1.5vw, 0.5rem)" }}
          >
            WINTER ARCHIEVE 2026
          </p>
          <p className="text-white italic text-5xl sm:text-7xl md:text-8xl lg:text-9xl">RAW</p>
          <p
            className="italic text-5xl sm:text-7xl md:text-8xl lg:text-9xl "
            style={{
              WebkitTextStroke: "clamp(0.3px, 0.15vw, 1.5px) white",
              letterSpacing: "clamp(1rem, 4vw, 3rem)",
              color: "transparent",
            }}
          >
            ESSENCE
          </p>
          <div className="text-sm space-x-2 mt-6 md:mt-8">
            <button>
              <a
                href=""
                className="inline-block bg-white text-black py-2 md:py-3 px-6 md:px-8  transition-transform duration-300 ease-out hover:scale-105 hover:bg-neon "
              >
                Shop Collection
              </a>
            </button>
            <button>
              <a
                href=""
                className="inline-block border border-white text-white py-2 md:py-3 px-6 md:px-8  transition-transform duration-300 ease-out hover:scale-105  hover:border-neon"
              >
                LookBook
              </a>
            </button>
          </div>
        </div>

      </div>
    </>
  );
}

export default Hero;
