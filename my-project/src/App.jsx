import React from "react";
import { Route, Routes } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "@/components/layout";
import EventDetails from "./pages/EventDetails";
import CheckoutScreen from "./pages/CheckoutScreen";
import PaymentScreen from "./pages/PaymentScreen";
import PaymentSuccessfulScreen from "./pages/PaymentSuccessfulScreen";
import TicketScreen from "./pages/TicketScreen";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import Messages from "./pages/Messages";
import Tourism from "./pages/Tourism";
import HelpSupport from "./pages/HelpSupport";
import Events from "./pages/Event";
import Blog from "./pages/Blog"
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
    {
      path: "/checkout",
      element: (
        <div className="mx-5">
          <CheckoutScreen />
        </div>
      ),
    },
    {
      path: "/Payment",
      element: (
        <div className="mx-5">
          <PaymentScreen />
        </div>
      ),
    },
    {
      path: "/Paymentsuccess",
      element: (
        <div className="mx-5">
          <PaymentSuccessfulScreen />
        </div>
      ),
    },
    {
      path: "/ticket",
      element: (
        <div className="mx-5">
          <TicketScreen />
        </div>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <div className="mx-5 my-5">
          <AnalyticsDashboard />
        </div>
      ),
    },
    {
      path: "/message",
      element: (
        <div className="mx-5 my-5">
          <Messages />
        </div>
      ),
    },
    {
      path: "/tourism",
      element: (
        <div className="mx-5 my-5">
          <Tourism />
        </div>
      ),
    },
    {
      path: "/help",
      element: (
        <div className="mx-5 my-5">
          <HelpSupport />
        </div>
      ),
    },
    {
      path: "/events",
      element: (
        <div className="mx-5 my-5">
          <Events />
        </div>
      ),
    },
    {
      path: "/blog",
      element: (
        <div className="mx-5 my-5">
          <Blog />
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
