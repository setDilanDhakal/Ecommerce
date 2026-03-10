function Card() {
  const products = [
    {
      id: 1,
      name: "Minimal Wool Jacket",
      price: "$120",
      image:
        "https://i.pinimg.com/736x/3e/33/da/3e33da949495493281f1fac1f994496b.jpg",
    },
    {
      id: 2,
      name: "Classic Hoodie",
      price: "$80",
      image:
        "https://i.pinimg.com/736x/57/bc/3f/57bc3f8a2fa6bdef8cc606e8a025cc63.jpg",
    },
    {
      id: 3,
      name: "Raw Knit Sweater",
      price: "$95",
      image:
        "https://i.pinimg.com/736x/66/b1/e7/66b1e7ff205ff3e314a2fb1db689883b.jpg",
    },
    {
      id: 4,
      name: "Nomad Overshirt",
      price: "$110",
      image:
        "https://i.pinimg.com/736x/66/5b/d7/665bd70c8e14d390bf033b79dd107fb1.jpg",
    },
    {
      id: 5,
      name: "Nomad Overshirt",
      price: "$110",
      image:
        "https://i.pinimg.com/1200x/50/e8/01/50e80111ee5c110622db5e46e1fd20de.jpg",
    },
  ];

  return (
    <div className="px-4 sm:px-6 md:px-8 py-5 mt-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Latest Collection</h1>
      <p className="text-sm text-neutral-500 mb-6 sm:mb-8">
        Discover our latest collection of trendy and stylish jackets.
      </p>

      <div className="w-full flex flex-wrap justify-center xl:justify-between gap-4 md:gap-6 xl:gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="group w-full max-w-[19rem] sm:w-60 xl:w-56 2xl:w-60 bg-white rounded-sm shadow-md overflow-hidden transition-transform duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 sm:h-64 object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />

            <div className="p-4 flex flex-col gap-2 text-center sm:text-left">
              <h2 className="text-base sm:text-lg font-semibold transition-colors duration-300">{product.name}</h2>

              <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-800">{product.price}</p>

              <button className="mt-2 w-full sm:w-auto bg-black/90 text-white py-2 rounded-lg transition-all duration-300 ease-out group-hover:bg-neon group-hover:text-black group-hover:shadow-md active:scale-[0.98]">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Card;
