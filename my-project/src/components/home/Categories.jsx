import React from "react";
import {Link} from "react-router-dom";

const Categories = () => {
  const groups = [
    { image: "/category1.png", text: "All Categories" },
    { image: "/category2.png", text: "Entertainment" },
    { image: "/category2.png", text: "Concerts" },
    { image: "/category4.png", text: "Festivals" },
    { image: "/category3.png", text: "Business" },
    { image: "/category4.png", text: "Culture" },
    { image: "/category5.png", text: "Leadership" },
    { image: "/category5.png", text: "Education" },
    { image: "/category6.png", text: "Sports" },
    { image: "/category7.png", text: "Food" },
    { image: "/category8.png", text: "Faith" },
    { image: "/category5.png", text: "Technology" },
    { image: "/category9.png", text: "Art & Design" },
    { image: "/category10.png", text: "Family" },
  ];

  return (
    <section className="my-10 overflow-x-auto scrollbar-hide py-10 px-5 lg:overflow-x-visible">
      <div className="flex justify-between gap-3 lg:flex-wrap lg:justify-center">
        {groups.map((group) => (
          <Link to={`/search?category=Events&q=${encodeURIComponent(group.text === "All Categories" ? "" : group.text)}`}
            key={group.text}
            className="flex flex-col justify-center items-center gap-1 bg-[#FFFEFE] p-3 min-h-24 min-w-[104px] text-[12px] rounded-[15px] shadow-xl transition duration-300
              hover:bg-[#F1FCEE]
              hover:text-black
              hover:-translate-y-1
              cursor-pointer shrink-0"
          >
            <span className="rounded-xl bg-[#e7f6e8] p-1.5"><img
              src={group.image}
              alt=""
              loading="lazy"
              className="h-10 w-10 rounded-lg"
            /></span>

            <p className="text-[12px] [font-normal]">{group.text}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
