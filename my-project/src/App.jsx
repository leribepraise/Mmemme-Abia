import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";

const App = () => {
  return (
    <>
      <div className="min-h-screen bg-[#f5f7f3]">
        <div className="mx-5 overflow-hidden">
          <Header />
          <Hero />
          <SearchBar />
        </div>
      </div>
    </>
  );
};

export default App;
