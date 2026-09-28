import Seo from "@/components/seo/Seo";
import React from "react";
import { Link } from 'react-router-dom';
import SEO from "../components/SEO/SEO";
import Hero from "@/components/home/Hero";
import SearchBar from "@/components/home/SearchBar";
import Categories from "@/components/home/Categories";
import Events from "@/components/home/Events";
import WhyChose from "@/components/home/WhyChose";
import Updateed from "@/components/home/Updateed";
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
        <Link to="/install" aria-label="Install the Mmemme Abia app"><DisplayImage
          src="/home-image.png"
          alt="Take Mmemme Abia Anywhere You Go"
        /></Link>
      </div>
      <WhyChose />
      <Updateed />
    </div>
  );
};

export default Home;
