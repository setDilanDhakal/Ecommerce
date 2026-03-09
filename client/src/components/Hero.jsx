function Hero() {
  return (
    <>
      <div classname="h-screen bg-[url('https://images.unsplash.com/photo-1478803431644-b832801eefa7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center bg-no-repeat ">
        <div className="flex flex-col justify-center items-center h-[80vh] ">
          <p className="text-white" style={{ letterSpacing: "0.5rem" }}>
            WINTER ARCHIEVE 2026
          </p>
          <p className="text-white text-9xl italic">RAW</p>
          <p
            className="text-9xl italic"
            style={{
              WebkitTextStroke: "2px white",
              letterSpacing: "1rem",
              color: "transparent",
            }}
          >
            ESSENCE
          </p>
        </div>
        <div></div>


      </div>
    </>
  );
}

export default Hero;
