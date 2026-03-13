import UserNav from "../components/UserNav";
import { useMemo, useState } from "react";
import { FiTrash2 } from "react-icons/fi";

function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Nomad Overshirt",
      description: "Relaxed fit cotton overshirt with soft inner lining.",
      image:
        "https://i.pinimg.com/736x/66/5b/d7/665bd70c8e14d390bf033b79dd107fb1.jpg",
      price: 110,
      quantity: 1,
    },
    {
      id: 2,
      name: "Minimal Wool Jacket",
      description: "Premium wool blend jacket for everyday layering.",
      image:
        "https://i.pinimg.com/736x/3e/33/da/3e33da949495493281f1fac1f994496b.jpg",
      price: 120,
      quantity: 2,
    },
    {
      id: 3,
      name: "Minimal Wool Jacket",
      description: "Premium wool blend jacket for everyday layering.",
      image:
        "https://i.pinimg.com/474x/19/94/aa/1994aa2c4ef73d2e1e9295eb36090c44.jpg",
      price: 120,
      quantity: 2,
    },
  ]);

  const updateQuantity = (id, change) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + change),
            }
          : item,
      ),
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const { subtotal, shipping, tax, total, totalItems } = useMemo(() => {
    const subtotalValue = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const shippingValue = subtotalValue > 0 ? 10 : 0;
    const taxValue = subtotalValue * 0.08;

    return {
      subtotal: subtotalValue,
      shipping: shippingValue,
      tax: taxValue,
      total: subtotalValue + shippingValue + taxValue,
      totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    };
  }, [cartItems]);

  const formatMoney = (value) => `Rs${value.toFixed(2)}`;

  return (
    <>
      <UserNav />
      <div className="min-h-screen bg-neutral-100">
        <div className="container mx-auto px-4 py-6 sm:px-6 md:px-8 lg:py-10">
          <p className="text-2xl sm:text-4xl text-black font-semibold tracking-tight">
            Your Cart
          </p>
          <p className="mt-1 text-sm text-black/60">
            {totalItems} item{totalItems > 1 ? "s" : ""} in your bag
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-black/10 bg-white p-3 sm:p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-80 w-full rounded-lg object-cover sm:h-28 sm:w-28"
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-base sm:text-lg font-semibold text-black">
                            {item.name}
                          </h2>
                          <p className="mt-1 text-sm text-black/60">
                            {item.description}
                          </p>
                        </div>
                        <p className="text-base sm:text-lg font-semibold text-black">
                          {formatMoney(item.price * item.quantity)}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-medium text-black/70">
                            {formatMoney(item.price)} each
                          </p>
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => removeItem(item.id)}
                            aria-label="Remove item"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>

                        <div className="flex items-center rounded-md border border-black/15">
                          <button
                            type="button"
                            className="h-9 w-9 text-lg font-semibold text-black hover:bg-black/5"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            -
                          </button>
                          <span className="w-10 text-center text-sm font-medium text-black">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="h-9 w-9 text-lg font-semibold text-black hover:bg-black/5"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-xl border border-black/10 bg-white p-4 sm:p-5">
              <p className="text-lg font-semibold text-black">Calculation</p>

              <div className="mt-4 space-y-3 text-sm sm:text-base">
                <div className="flex items-center justify-between text-black/70">
                  <span>Subtotal</span>
                  <span>{formatMoney(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-black/70">
                  <span>Shipping</span>
                  <span>{formatMoney(shipping)}</span>
                </div>
                <div className="flex items-center justify-between text-black/70">
                  <span>Tax (8%)</span>
                  <span>{formatMoney(tax)}</span>
                </div>
                <div className="border-t border-black/10 pt-3 flex items-center justify-between text-black font-semibold text-base sm:text-lg">
                  <span>Total</span>
                  <span>{formatMoney(total)}</span>
                </div>
              </div>

              <button
                type="button"
                className="mt-5 w-full rounded-md bg-black px-4 py-3 text-sm sm:text-base font-semibold text-white hover:bg-black/90 transition-colors"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-8 sm:px-6 md:px-8 lg:pb-12">
          <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <p className="text-lg sm:text-xl font-semibold text-black">Stay Updated</p>
                <p className="mt-2 text-sm sm:text-base text-black/60">
                  Subscribe to our newsletter to get the latest updates and special offers.
                </p>
              </div>

              <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="h-11 w-full sm:w-72 rounded-md border border-black/15 px-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/20"
                />
                <button
                  type="button"
                  className="h-11 rounded-md bg-black px-5 text-sm font-semibold text-white hover:bg-black/90 transition-colors"
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
