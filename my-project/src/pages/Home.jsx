import React from "react";
import SEO from "../components/SEO/SEO";
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
      <SEO
        title="Mmemme Abia | Discover Events, Hotels & Experiences in Abia"
        description="Discover events, hotels, food, tourism, transportation and exciting experiences across Abia State with Mmemme."
      />
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
