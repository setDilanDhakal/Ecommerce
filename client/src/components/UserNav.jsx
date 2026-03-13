function UserNav() {
  return (
    <nav className="relative border-b h-16 flex items-center justify-between px-4 overflow-hidden bg-background/50 backdrop-blur-md">
      <div className="min-h-full -z-10 w-full bg-transparent absolute top-0 left-0">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--muted) 1px, transparent 1px), linear-gradient(to bottom, var(--muted) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
            maskImage:
              "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
          }}
        />
      </div>

      <div className="z-10 flex items-center gap-4">
        <a href="/" className="text-xl font-bold tracking-tighter uppercase italic">
          NOMAD.
        </a>
      </div>

      <div className="z-10 flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs text-foreground font-semibold uppercase">
            Dilan
          </span>
          <span className="text-[0.6rem] text-muted-foreground uppercase opacity-70 tracking-widest">
            Active Now
          </span>
        </div>
        <div className="size-10 border rounded-full overflow-hidden p-0.5 bg-background">
          <img
            src={
              "https://m.media-amazon.com/images/I/31sDQI7yfDL._AC_UF894,1000_QL80_.jpg"
            }
            alt="profile"
            className="size-full rounded-full object-cover"
          />
        </div>
      </div>
    </nav>
  );
}

export default UserNav;
