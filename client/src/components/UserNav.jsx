function UserNav() {
  return (
    <nav className="px-9 relative border-b h-16 flex items-center justify-between px-4 overflow-hidden bg-black/90 backdrop-blur-md">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0" />
      </div>

      <div className="flex items-center gap-4">
        <a
          href="/"
          className="text-2xl font-bold tracking-tighter uppercase italic text-neon"
        >
          NOMAD.
        </a>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs font-semibold uppercase text-neon">Dilan</span>
          <span className="text-[0.6rem] text-gray-500 uppercase text-neon opacity-70 tracking-widest">
            Active Now
          </span>
        </div>

        <div className="size-10 border rounded-full overflow-hidden p-0.5 bg-white">
          <img
            src="http://i.pinimg.com/736x/ca/8f/be/ca8fbe875330ac28429a3d69f0d489f7.jpg"
            alt="profile"
            className="size-full rounded-full object-cover"
          />
        </div>
      </div>
    </nav>
  );
}

export default UserNav;
