import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import SearchLocation from "./components/SearchLocation";
import CatergoriesDisplay from "./components/CatergoriesDisplay";


const App = () => {
  return (
    <>
      <div className="min-h-screen bg-[#f5f7f3]">
        <div className="mx-5">
          <Header />
          <Hero />
          <SearchLocation />
          <CatergoriesDisplay/>
        </div>
      </div>
    </>
  );
};

export default App;
