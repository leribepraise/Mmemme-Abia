import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import CatergoriesDisplay from "./components/CatergoriesDisplay";
import SearchLocation from "./components/SearchLocation";
// import Categories from "../componentProp/Categories";
import Patners from "./components/Patners";
import Events from "./components/Events";
import WhyChose from "./components/WhyChose";
import Footer from "./components/Footer";
import PeopleSay from "./components/PeopleSay";
import Updateed from "./components/Updateed";
import Categories from "./components/Categories";

const App = () => {
  return (
    <>
      <div className="min-h-screen bg-[#f5f7f3]">
        <div className="mx-5">
          <Header />
          <Hero />
          <SearchBar />
          <Categories />
          <Events />
          <WhyChose />
          <PeopleSay />
          <Updateed />  
          <Patners />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default App;
