import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"


function GlassButton({ children, to }) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [pos, setPos] = useState({ x: 50, y: 50 })

  function onMouseMove(e) {
    const r = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 100
    const y = ((e.clientY - r.top) / r.height) * 100
    setPos({ x, y })
  }

  const Comp = to ? Link : "button"

  return (
    <Comp
      to={to}
      type={to ? undefined : "button"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        setPressed(false)
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseMove={onMouseMove}
      className={`relative inline-flex items-center justify-center rounded-lg px-4 py-2 font-semibold text-white bg-white/10 border border-white/20 backdrop-blur transition-all ${
        pressed ? "scale-[0.97]" : ""
      }`}
      style={{
        boxShadow: hovered
          ? "0 12px 40px rgba(255,255,255,0.18)"
          : "0 8px 30px rgba(255,255,255,0.12)",
      }}
    >
      <span className="absolute inset-0 rounded-lg bg-gradient-to-t from-white/10 to-transparent" />

      <span
        className="absolute inset-0 rounded-lg"
        style={{
          background: `radial-gradient(120px circle at ${pos.x}% ${pos.y}%, rgba(255,255,255,0.35), transparent 60%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 200ms ease",
        }}
      />

      <span className="relative">{children}</span>
    </Comp>
  )
}



export default function Navigation() {
  const [open, setOpen] = useState(false)

  const menuItems = [
    { name: "Products", href: "/product" },
    { name: "Story", href: "/story" },
    { name: "Cart", href: "/cart" },
    { name: "About", href: "/about" },
  ]


  // Lock body scroll and flag menu-open for global styles
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    if (open) {
      body.style.overflow = "hidden"
      html.classList.add("menu-open")
      body.classList.add("menu-open")
    } else {
      body.style.overflow = ""
      html.classList.remove("menu-open")
      body.classList.remove("menu-open")
    }
    return () => {
      body.style.overflow = ""
      html.classList.remove("menu-open")
      body.classList.remove("menu-open")
    }
  }, [open])


  // Close menu on ESC key
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") {
        setOpen(false)
      }
    }

    window.addEventListener("keydown", handleEsc)

    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [])



  return (
    <div className="px-4 sm:px-6 md:px-8 py-3">


      <div className="flex items-center justify-between">

        <Link
          to="/"
          className="text-white text-xl sm:text-2xl italic font-bold tracking-wide"
        >
          NOMAD.
        </Link>


        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6 text-white/90 text-sm">

          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="relative inline-block pb-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.name.toUpperCase()}
            </Link>
          ))}

          <GlassButton to="/login">Get Started</GlassButton>

        </div>


        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white"
          onClick={() => setOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>

      </div>



      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 z-50 ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >

        {/* Blur Background */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />


        {/* Drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-3/4 max-w-sm bg-white text-black p-6 flex flex-col transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          } shadow-xl`}
        >

          <div className="flex items-center justify-between">

            <span className="font-bold text-lg">Menu</span>

            <button onClick={() => setOpen(false)}>
              <X className="w-6 h-6" />
            </button>

          </div>



          {/* Menu Links */}
          <nav className="mt-6 flex flex-col gap-5">

            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setOpen(false)}
                className="relative inline-block pb-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.name.toUpperCase()}
              </Link>
            ))}


            <div className="pt-4">
              <GlassButton to="/login">Get Started</GlassButton>
            </div>

          </nav>

        </div>

      </div>

    </div>
  )
}
