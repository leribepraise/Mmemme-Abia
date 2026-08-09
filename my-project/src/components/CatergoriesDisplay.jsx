import React from "react";
import Categories from "../../componentProp/Categories";
//icon
import { PiSquaresFourLight } from "react-icons/pi";

function CatergoriesDisplay() {
  return (
    <div>
      <Categories icon={<PiSquaresFourLight />} className="text-[#3f783d] bg-[#F1FCEE]" />
    </div>
  );
}

export default CatergoriesDisplay;
