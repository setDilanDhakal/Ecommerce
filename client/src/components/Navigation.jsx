import { useState } from "react"
import { Link } from "react-router-dom"
import { BookOpen, Info, LogOut, Menu, ShoppingBag, ShoppingCart, X } from "lucide-react"
import { useAuth } from "../context/useAuth.js"
import { toAbsoluteUrl } from "../lib/api.js"

function GlassButton({ children, to, onClick }) {
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
      onClick={onClick}
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
  const { user, logout } = useAuth()

  const menuItems = [
    { name: "Products", href: "/product" },
    { name: "Story", href: "/story" },
    { name: "Cart", href: "/cart" },
    { name: "About", href: "/about" },
  ].filter((item) => item.name !== "Cart" || Boolean(user))

  const menuIcons = {
    Products: ShoppingBag,
    Story: BookOpen,
    Cart: ShoppingCart,
    About: Info,
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 py-3">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="text-white text-xl sm:text-2xl italic font-bold tracking-wide"
        >
          NOMAD.
        </Link>

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

          {user ? (
            <>
              <div className="flex items-center gap-3 rounded-full bg-white/10 border border-white/20 px-3 py-1.5 backdrop-blur">
                <img
                  src={user.image ? toAbsoluteUrl(user.image) : "/vite.svg"}
                  alt="profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="text-sm font-semibold text-white">
                  {user.firstName || user.email}
                </span>
              </div>
              <GlassButton
                onClick={() => {
                  logout()
                }}
              >
                <span className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Log Out
                </span>
              </GlassButton>
            </>
          ) : (
            <GlassButton to="/login">Get Started</GlassButton>
          )}
        </div>

        <button className="lg:hidden text-white" onClick={() => setOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div
        className={`lg:hidden fixed inset-0 z-50 ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />

        <div
          className={`absolute right-0 top-0 z-[60] h-full w-4/5 max-w-sm bg-black/90 text-white p-6 flex flex-col transition-transform duration-300 backdrop-blur-xl ${
            open ? "translate-x-0" : "translate-x-full"
          } shadow-xl`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent" />
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-neon/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="relative flex items-center justify-between">
            <span className="font-bold text-lg tracking-wide">Menu</span>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative mt-6 flex flex-1 flex-col">
            {user ? (
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                <img
                  src={user.image ? toAbsoluteUrl(user.image) : "/vite.svg"}
                  alt="profile"
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">
                    {user.firstName || "User"}
                  </span>
                  <span className="text-xs text-white/60">{user.email}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <GlassButton to="/login" onClick={() => setOpen(false)}>
                  Log In
                </GlassButton>
                <GlassButton to="/register" onClick={() => setOpen(false)}>
                  Sign Up
                </GlassButton>
              </div>
            )}

            <div className="my-6 h-px bg-white/10" />

            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => {
                const Icon = menuIcons[item.name] || Info
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-white/90 hover:bg-white/10 transition-colors"
                  >
                    <Icon className="h-5 w-5 text-white/80" />
                    <span className="text-sm font-semibold tracking-wide">
                      {item.name.toUpperCase()}
                    </span>
                  </Link>
                )
              })}
            </nav>

            <div className="mt-auto pt-6">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    setOpen(false)
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              ) : (
                <GlassButton to="/login" onClick={() => setOpen(false)}>
                  Get Started
                </GlassButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



