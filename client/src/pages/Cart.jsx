import UserNav from "../components/UserNav";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import { api, toAbsoluteUrl } from "../lib/api.js";
import { useAuth } from "../context/useAuth.js";

function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyProductId, setBusyProductId] = useState("");
  const [error, setError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [lastOrderId, setLastOrderId] = useState("");

  useEffect(() => {
    if (!user) navigate("/login");
    if (user?.isAdmin) navigate("/");
  }, [navigate, user]);

  const fetchCart = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await api.get("/carts/my");
      const cart = response?.data?.data;
      const items = Array.isArray(cart?.cartItems) ? cart.cartItems : [];
      const products = await Promise.all(
        items.map((it) =>
          api
            .get(`/products/${it.productId}`)
            .then((r) => r?.data?.data || null)
            .catch(() => null)
        )
      );
      const productMap = new Map(
        products.filter(Boolean).map((p) => [String(p._id), p])
      );
      setCartItems(
        items
          .map((it) => {
            const product = productMap.get(String(it.productId));
            if (!product) return null;
            return {
              productId: String(it.productId),
              quantity: Number(it.quantity || 1),
              subtotal: Number(it.subtotal || 0),
              product,
            };
          })
          .filter(Boolean)
      );
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    if (user?.isAdmin) return;
    fetchCart();
  }, [user]);

  const updateQuantity = async (productId, change) => {
    const current = cartItems.find((i) => String(i.productId) === String(productId));
    if (!current) return;
    const nextQty = Math.max(1, Number(current.quantity || 1) + Number(change || 0));
    setBusyProductId(String(productId));
    setError("");
    try {
      const response = await api.patch(`/carts/items/${productId}`, { quantity: nextQty });
      const cart = response?.data?.data;
      const updatedItems = Array.isArray(cart?.cartItems) ? cart.cartItems : [];
      setCartItems((prev) =>
        prev
          .map((it) => {
            const serverItem = updatedItems.find(
              (x) => String(x.productId) === String(it.productId)
            );
            if (!serverItem) return null;
            return {
              ...it,
              quantity: Number(serverItem.quantity || 1),
              subtotal: Number(serverItem.subtotal || 0),
            };
          })
          .filter(Boolean)
      );
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to update quantity");
    } finally {
      setBusyProductId("");
    }
  };

  const removeItem = async (productId) => {
    setBusyProductId(String(productId));
    setError("");
    try {
      await api.delete(`/carts/items/${productId}`);
      setCartItems((prev) => prev.filter((it) => String(it.productId) !== String(productId)));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to remove item");
    } finally {
      setBusyProductId("");
    }
  };

  const { subtotal, shipping, tax, total, totalItems } = useMemo(() => {
    const subtotalValue = cartItems.reduce(
      (sum, item) => sum + Number(item.subtotal || 0),
      0,
    );
    const shippingValue = subtotalValue > 0 ? 10 : 0;
    const taxValue = subtotalValue * 0.08;

    return {
      subtotal: subtotalValue,
      shipping: shippingValue,
      tax: taxValue,
      total: subtotalValue + shippingValue + taxValue,
      totalItems: cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    };
  }, [cartItems]);

  const formatMoney = (value) => `Rs${value.toFixed(2)}`;

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }
    setError("");
    setCheckoutLoading(true);
    try {
      const productsOrdered = cartItems.map((it) => ({
        productId: it.productId,
        quantity: it.quantity,
        subtotal: it.subtotal,
      }));
      const response = await api.post("/orders", {
        productsOrdered,
        totalPrice: total,
      });
      const order = response?.data?.data;
      await api.delete("/carts/my");
      setCartItems([]);
      setLastOrderId(order?._id || "");
      setCheckoutOpen(true);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to checkout");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <>
      <UserNav />
      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="container mx-auto px-4 py-6 sm:px-6 md:px-8 lg:py-10">
          <p className="text-2xl sm:text-4xl font-semibold tracking-tight">
            Your Cart
          </p>
          <p className="mt-1 text-sm text-white/60">
            {totalItems} item{totalItems > 1 ? "s" : ""} in your bag
          </p>

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              {loading ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-10 text-center text-sm text-white/60">
                  Loading cart...
                </div>
              ) : cartItems.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-10 text-center text-sm text-white/60">
                  Your cart is empty
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <img
                        src={item.product?.image ? toAbsoluteUrl(item.product.image) : "/vite.svg"}
                        alt={item.product?.name || "product"}
                        className="h-80 w-full rounded-lg object-cover sm:h-28 sm:w-28"
                      />

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h2 className="text-base sm:text-lg font-semibold text-white">
                              {item.product?.name}
                            </h2>
                            <p className="mt-1 text-sm text-white/60">
                              {item.product?.description}
                            </p>
                          </div>
                          <p className="text-base sm:text-lg font-semibold text-white">
                            {formatMoney(item.subtotal)}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <p className="text-sm font-medium text-white/70">
                              {formatMoney(Number(item.product?.price || 0))} each
                            </p>
                            <button
                              type="button"
                              disabled={busyProductId === item.productId}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-200 hover:bg-red-500/10 hover:text-red-200 disabled:opacity-60"
                              onClick={() => removeItem(item.productId)}
                              aria-label="Remove item"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>

                          <div className="flex items-center rounded-md border border-white/15">
                            <button
                              type="button"
                              disabled={busyProductId === item.productId}
                              className="h-9 w-9 text-lg font-semibold text-white hover:bg-white/10 disabled:opacity-60"
                              onClick={() => updateQuantity(item.productId, -1)}
                            >
                              -
                            </button>
                            <span className="w-10 text-center text-sm font-medium text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              disabled={busyProductId === item.productId}
                              className="h-9 w-9 text-lg font-semibold text-white hover:bg-white/10 disabled:opacity-60"
                              onClick={() => updateQuantity(item.productId, 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="h-fit rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <p className="text-lg font-semibold text-white">Calculation</p>

              <div className="mt-4 space-y-3 text-sm sm:text-base">
                <div className="flex items-center justify-between text-white/70">
                  <span>Subtotal</span>
                  <span>{formatMoney(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span>Shipping</span>
                  <span>{formatMoney(shipping)}</span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span>Tax (8%)</span>
                  <span>{formatMoney(tax)}</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex items-center justify-between text-white font-semibold text-base sm:text-lg">
                  <span>Total</span>
                  <span>{formatMoney(total)}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={checkoutLoading || loading || cartItems.length === 0}
                onClick={handleCheckout}
                className="mt-5 w-full rounded-xl bg-neon px-4 py-3 text-sm sm:text-base font-semibold text-black hover:brightness-95 transition-colors"
              >
                {checkoutLoading ? "Placing order..." : "Checkout"}
              </button>
            </div>
          </div>
        </div>

        {checkoutOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-950 p-5 text-white shadow-xl">
              <p className="text-lg font-semibold">Order placed</p>
              <p className="mt-2 text-sm text-white/70">
                Please wait for admin confirmation. You can track your order status in Profile.
              </p>
              {lastOrderId ? (
                <p className="mt-3 text-xs text-white/60">
                  Order #{String(lastOrderId).slice(-8)}
                </p>
              ) : null}
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCheckoutOpen(false);
                    navigate("/profile");
                  }}
                  className="flex-1 rounded-xl bg-neon px-4 py-2 text-sm font-semibold text-black hover:brightness-95"
                >
                  Go to Profile
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutOpen(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="container mx-auto px-4 pb-8 sm:px-6 md:px-8 lg:pb-12">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <p className="text-lg sm:text-xl font-semibold text-white">Stay Updated</p>
                <p className="mt-2 text-sm sm:text-base text-white/60">
                  Subscribe to our newsletter to get the latest updates and special offers.
                </p>
              </div>

              <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="h-11 w-full sm:w-72 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
                />
                <button
                  type="button"
                  className="h-11 rounded-xl bg-white/10 px-5 text-sm font-semibold text-white hover:bg-white/15 transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;
