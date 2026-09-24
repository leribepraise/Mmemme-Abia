import Seo from "@/components/seo/Seo";
import React from "react";
import Hero from "@/components/home/Hero";
import SearchBar from "@/components/home/SearchBar";
import Categories from "@/components/home/Categories";
import Events from "@/components/home/Events";
import WhyChose from "@/components/home/WhyChose";
import PeopleSay from "@/components/home/PeopleSay";
import Updateed from "@/components/home/Updateed";
import Patners from "@/components/home/Patners";
import DisplayImage from "../components/home/DisplayImage";

const Home = () => {
  return (
    <div>
      <Seo title="Home" description="Mmemme Abia is your guide to Abia State — book events, order food, arrange transport and discover hotels and tourism across Umuahia, Aba and beyond." path="/" />
      <Hero />
      <SearchBar />
      <Categories />
      <Events />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <DisplayImage
          src="/home-image.png"
          alt="Take Mmemme Abia Anywhere You Go"
        />
      </div>
      <WhyChose />
      <PeopleSay />
      <Updateed />
      <Patners />
    </div>
  );
};

export default Home;
