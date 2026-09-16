import React from "react";

function Categories({ icon, text, className }) {
  return (
    <section className="flex justify-between items-center flex-nowrap overflow-x-auto scrollbar-none px-10 mt-5">
      <div className="shrink-0 text-5xl border-[0.5px] border-gray-200 rounded-2xl flex justify-center items-center flex-col p-3 px-5">
        {icon}
        <p className="text-xs font-bold text-center">{text}</p>
      </div>
    </section>
  );
}

export default Categories;

//on the nav we will have home(with icon),products,cart,aboutus,setting,lightmode
