import React from "react";

const Categories = () => {
  const groups = [
    { image: "/category1.png", text: "All Categories" },
    { image: "/category2.png", text: "Music" },
    { image: "/category3.png", text: "Business" },
    { image: "/category4.png", text: "Culture" },
    { image: "/category5.png", text: "Education" },
    { image: "/category6.png", text: "Sports" },
    { image: "/category7.png", text: "Food & Drink" },
    { image: "/category8.png", text: "Religion" },
    { image: "/category9.png", text: "Art & Design" },
    { image: "/category10.png", text: "Family" },
  ];
  return (
    <section className="my-10">
      <div className="flex justify-between">
        {groups.map((group) => (
          <div
            className="flex flex-col justify-center items-center bg-[#FFFEFE] p-5 h-20 w-auto text-[12px] rounded-[15px] shadow-xl transition duration-300
  hover:bg-[#F1FCEE]
  hover:text-black
  hover:-translate-y-1
  cursor-pointer"
          >
            <img src={group.image} className="h-10 w-10" />{" "}
            <p className="text-[12px] [font-normal]">{group.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
