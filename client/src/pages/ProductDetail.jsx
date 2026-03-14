
import { useState } from "react";
import { Link } from "react-router-dom";
import UserNav from '../components/UserNav.jsx'
import {
  Camera,
  Heart,
  Info,
  Ruler,
  Send,
  Share2,
  ShoppingCart,
  Star,
  Tag,
  Users,
} from "lucide-react";

const product = {
  name: "Lightweight Brown Bomber Jacket",
  price: 70,
  shippingCost: 5.6,
  currency: "€",
  images: [
    "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4mss4157-02_3.jpg?v=1756928497&quality=80?q=80&w=2000&auto=format&fit=crop",
    "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4mss4157-02_1.jpg?v=1756928497&quality=80?q=80&w=2000&auto=format&fit=crop",
    "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4mss4157-02_6.jpg?v=1756920149&quality=80?q=80&w=2000&auto=format&fit=crop",
  ],
  description:
    "A stylish light bomber jacket, perfect for the transitional seasons. Made from breathable, water-resistant material with a zip-up front, side pockets, and a sleeve zip pocket for small essentials. Ideal for layering in spring or fall.",
  tags: [
    { label: "Brown", icon: Tag },
    { label: "L Size", icon: Ruler },
    { label: "Women", icon: Users },
    { label: "New", icon: Info },
  ],
};

const seller = {
  name: "Maria Johansson",
  avatarUrl: "https://i.pravatar.cc/150?u=maria",
  rating: 4.9,
};

const breadcrumbs = [
  { label: "Market", href: "/" },
  { label: "Clothing", href: "/product" },
  { label: "Lightweight Brown Bomber Jacket", href: "/product/detail" },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-neutral-300"
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-medium text-neutral-500">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function ProductDetail() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="bg-neutral-50">
        <UserNav />
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <div className="rounded-2xl bg-white p-4 shadow-sm md:p-8">
          <nav className="mb-4 flex items-center text-sm text-neutral-500">
            {breadcrumbs.map((item, index) => (
              <div key={item.label} className="flex items-center">
                <Link to={item.href} className="hover:text-black transition-colors">
                  {item.label}
                </Link>
                {index < breadcrumbs.length - 1 && (
                  <span className="mx-2 text-neutral-300">/</span>
                )}
              </div>
            ))}
          </nav>

          <div className="mb-6 flex items-center justify-end gap-2">
            <button
              type="button"
              className="rounded-full p-2 hover:bg-neutral-100 transition-colors"
            >
              <Heart className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="rounded-full p-2 hover:bg-neutral-100 transition-colors"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          <main className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col gap-4">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-xl border">
                <img
                  src={product.images[currentImageIndex]}
                  alt={`${product.name} ${currentImageIndex + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        currentImageIndex === index
                          ? "bg-black"
                          : "bg-neutral-300 hover:bg-neutral-400"
                      }`}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-neutral-50 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  Find Similar
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                {product.name}
              </h1>
              <div className="mt-2">
                <span className="text-4xl font-bold">
                  {product.currency}
                  {product.price}
                </span>
                <span className="ml-2 text-sm text-neutral-500">
                  + {product.currency}
                  {product.shippingCost.toFixed(2)} Shipping
                </span>
              </div>

              <div className="my-6 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-black px-4 py-3 text-white hover:bg-black/90 transition-colors"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Buy Now
                </button>
                <button
                  type="button"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border px-4 py-3 hover:bg-neutral-50 transition-colors"
                >
                  <Send className="h-5 w-5" />
                  Contact Seller
                </button>
              </div>

              <div className="mb-6 flex flex-wrap gap-2">
                {product.tags.map((item) => {
                  const Icon = item.icon;
                  return (
                    <span
                      key={item.label}
                      className="inline-flex items-center gap-2 rounded-md bg-neutral-100 px-3 py-1 text-sm text-neutral-700"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </span>
                  );
                })}
              </div>

              <p className="leading-relaxed text-neutral-600">
                {product.description}
              </p>

              <div className="mt-8 border-t pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={seller.avatarUrl}
                      alt={seller.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{seller.name}</p>
                      <StarRating rating={seller.rating} />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-sm font-medium text-black hover:underline"
                  >
                    All listings →
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
