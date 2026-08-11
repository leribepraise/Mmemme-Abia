import React from "react";
import Hero from "@/components/home/Hero";
import SearchBar from "@/components/home/SearchBar";
import Categories from "@/components/home/Categories";
import Events from "@/components/home/Events";
import WhyChose from "@/components/home/WhyChose";
import PeopleSay from "@/components/home/PeopleSay";
import Updateed from "@/components/home/Updateed";
import Patners from "@/components/home/Patners";

const Home = () => {
  return (
    <div>
      <Hero />
      <SearchBar />
      <Categories />
      <Events />
      <WhyChose />
      <PeopleSay />
      <Updateed />
      <Patners />
    </div>
  );
};

export default Home;
