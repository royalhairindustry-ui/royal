export default function ShopCategoriesSection() {
  const categories = [
    {
      id: 1,
      name: "Braids",
      count: "10 products",
      image: "/images/categories/braids.png",
      bg: "from-[#ff0090] to-[#e4007f]",
    },
    {
      id: 2,
      name: "Crochet",
      count: "16 products",
      image: "/images/categories/crochet.png",
      bg: "from-[#ff0090] to-[#e4007f]",
    },
    {
      id: 3,
      name: "Closure",
      count: "4 products",
      image: "/images/categories/closure.png",
      bg: "from-[#ff0090] to-[#e4007f]",
    },
    {
      id: 4,
      name: "Weaves",
      count: "14 products",
      image: "/images/categories/weaves.png",
      bg: "from-[#ff0090] to-[#e4007f]",
    },
  ];

  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 lg:px-16 xl:px-24 2xl:px-32">
      <div className="mx-auto max-w-[1500px]">
        {/* Heading row */}
        <div className="mb-12 flex items-center gap-4 md:mb-16">
          <h2 className="shrink-0 text-[34px] font-bold tracking-[-0.03em] text-black md:text-[48px] lg:text-[56px]">
            Shop Categories
          </h2>

          <div className="hidden w-full items-center md:flex">
            <span className="h-2 w-2 rounded-full bg-[#c9c3c8]" />
            <div className="h-px flex-1 bg-[#cfc9ce]" />
            <span className="h-2 w-2 rounded-full bg-[#c9c3c8]" />
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-4 xl:gap-8 2xl:gap-10">
          {categories.map((category) => (
            <a
              key={category.id}
              href="#"
              className="group flex flex-col items-center text-center"
            >
              <div
                className={`relative flex aspect-[1/1.25] w-full max-w-[340px] items-end justify-center overflow-hidden rounded-[999px] bg-gradient-to-b ${category.bg} shadow-[0_18px_50px_rgba(236,11,140,0.12)] transition duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_24px_70px_rgba(236,11,140,0.18)] md:max-w-[380px] xl:max-w-[360px] 2xl:max-w-[390px]`}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>

              <h3 className="mt-5 text-[28px] font-semibold tracking-[-0.02em] text-[#3f4a56] md:text-[34px]">
                {category.name}
              </h3>

              <p className="mt-2 text-[22px] text-[#7d828a] md:text-[28px]">
                {category.count}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
