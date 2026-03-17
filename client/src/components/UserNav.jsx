import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "../context/useAuth.js";
import { api, toAbsoluteUrl } from "../lib/api.js";

function UserNav() {
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!user || user.isAdmin) {
        setCartCount(0);
        return;
      }
      try {
        const response = await api.get("/carts/my");
        const cart = response?.data?.data;
        const items = Array.isArray(cart?.cartItems) ? cart.cartItems : [];
        const count = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };

    fetchCartCount();
    const interval = setInterval(fetchCartCount, 5000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <nav className="px-9 relative  h-16 flex items-center justify-between px-4 overflow-hidden bg-black/90 backdrop-blur-md">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0" />
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tighter uppercase italic text-neon"
        >
          NOMAD.
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            {!user.isAdmin && (
              <Link to="/cart" className="relative p-2 text-white hover:text-neon transition-colors">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-neon px-1 text-[10px] font-bold text-black">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            )}
            <Link to="/profile" className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-semibold uppercase text-neon">
                  {user.firstName || user.email}
                </span>
                <span className="text-[0.6rem] text-gray-500 uppercase text-neon opacity-70 tracking-widest">
                  Active Now
                </span>
              </div>

              <div className="size-10 border rounded-full overflow-hidden p-0.5 bg-white">
                <img
                  src={user.image ? toAbsoluteUrl(user.image) : "/vite.svg"}
                  alt="profile"
                  className="size-full rounded-full object-cover"
                />
              </div>
            </Link>
          </>
        ) : (
          <Link
            to="/login"
            className="rounded-lg bg-white/10 text-white px-3 py-1.5 border border-white/20 hover:bg-white/15"
          >
            Get Started
          </Link>
        )}
      </div>
    </nav>
  );
}

export default UserNav;
