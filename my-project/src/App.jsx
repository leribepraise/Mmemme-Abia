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
import Blog from "./pages/Blog";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import HelpCenter from "./pages/HelpCenter";
import Hotel from "./pages/Hotel";
import VenueDetails from "./pages/VenueDetails";
import BookingComfirmationPage from "./pages/BookingComfirmationPage";
import GuestGuard from "./components/GuestGuard";
import ExploreAbiaPage from "./pages/ExploreAbiaPage";
import Community from "./pages/Blog";
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
          <GuestGuard>
            <EventDetails />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/checkout",
      element: (
        <div className="mx-5">
          <GuestGuard>
            <CheckoutScreen />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/Payment",
      element: (
        <div className="mx-5">
          <GuestGuard>
            <PaymentScreen />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/Paymentsuccess",
      element: (
        <div className="mx-5">
          <GuestGuard>
            <PaymentSuccessfulScreen />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/ticket",
      element: (
        <div className="mx-5">
          <GuestGuard>
            <TicketScreen />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <AnalyticsDashboard />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/message",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <Messages />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/tourism",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <ExploreAbiaPage />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/contact",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <HelpSupport />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/events",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <Events />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/community",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <Community />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/help",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <HelpCenter />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/hotel",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <Hotel />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/panyu",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <VenueDetails />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/book-comfire",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <BookingComfirmationPage />
          </GuestGuard>
        </div>
      ),
    },
  ];

  const authRouter = [
    { path: "/login", element: <Login /> },
    { path: "/SignUp", element: <SignUp /> },
    // { path: "*", element: <NotFound /> },
  ];

  return (
    <>
      <div className="min-h-screen bg-[#f5f7f3]">
        <div>
          <Routes>
            <Route path="/" element={<Layout />}>
              {navList.map((item, index) => (
                <Route key={index} path={item.path} element={item.element} />
              ))}
            </Route>
            {authRouter.map((item, index) => (
              <Route key={index} path={item.path} element={item.element} />
            ))}
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;
