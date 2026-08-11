import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "@/components/layout";
import EventDetails from "./pages/EventDetails";

const App = () => {
  const navList = [
    {
      path: "/",
      element: (
        <div className="mx-5">
          <Home />
        </div>
      ),
    },
    {
      path: "/event",
      element: (
        <div className="mx-5">
          <EventDetails />
        </div>
      ),
    },
  ];
  return (
    <>
      <div className="min-h-screen bg-[#f5f7f3]">
        <div className>
          <Routes>
            <Route path="/" element={<Layout />}>
              {navList.map((item, index) => (
                <Route key={index} path={item.path} element={item.element} />
              ))}
            </Route>
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;
