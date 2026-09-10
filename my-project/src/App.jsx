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
import Community from "./pages/Community";
import Food from "./pages/Food";
import AboutAbia from "./pages/DiscoverAbia";
import DiscoverAbia from "./pages/DiscoverAbia";
import Transport from "./pages/Transport";
import NotFound from "./pages/NotFound";
import RestaurantDetails from "./pages/RestaurantDetails";
import Onboarding from "./components/onboarding/Onboarding";
import Profile from "./pages/Profile";
import OrganizerLogin from "./pages/OrganizerLogin";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import OrganizerEvents from "./pages/OrganizerEvents";
import OrganizerEventForm from "./pages/OrganizerEventForm";
import OrganizerEventPreview from "./pages/OrganizerEventPreview";
import OrganizerAnalytics from "./pages/OrganizerAnalytics";
import OrganizerMessages from "./pages/OrganizerMessages";
import OrganizerTicketSales from "./pages/OrganizerTicketSales";
import OrganizerAttendees from "./pages/OrganizerAttendees";
import OrganizerPayouts from "./pages/OrganizerPayouts";
import OrganizerSettings from "./pages/OrganizerSettings";
import OrganizerNotFound from "./pages/OrganizerNotFound";
import { useParams, Navigate } from "react-router-dom";

// /organizer/events/:id/edit needs the :id param handed to OrganizerEventForm
// as the `editId` prop.
const OrganizerEventEditRoute = () => {
  const { id } = useParams();
  return <OrganizerEventForm editId={id} />;
};

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
      path: "*",
      element: (
        <div className="mx-5">
          <NotFound />
        </div>
      ),
    },
    {
      path: "/events/:id",
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
    {
      path: "/food",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <Food />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/fooddetail",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <RestaurantDetails />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/blog",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <Blog />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/about",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <DiscoverAbia />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/transport",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <Transport />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/profile",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <Profile />
          </GuestGuard>
        </div>
      ),
    },
  ];

  const authRouter = [
    { path: "/login", element: <Login /> },
    { path: "/Signup", element: <SignUp /> },
    { path: "/Signup/onboarding", element: <Onboarding /> },
  ];

  const organizerRouter = [
    { path: "/organizer", element: <Navigate to="/organizer/login" replace /> },
    { path: "/organizer/login", element: <OrganizerLogin /> },
    { path: "/organizer/dashboard", element: <OrganizerDashboard /> },
    { path: "/organizer/events", element: <OrganizerEvents /> },
    { path: "/organizer/events/new", element: <OrganizerEventForm /> },
    {
      path: "/organizer/events/:id/edit",
      element: <OrganizerEventEditRoute />,
    },
    {
      path: "/organizer/events/:id/preview",
      element: <OrganizerEventPreview />,
    },
    { path: "/organizer/analytics", element: <OrganizerAnalytics /> },
    { path: "/organizer/messages", element: <OrganizerMessages /> },
    { path: "/organizer/ticket-sales", element: <OrganizerTicketSales /> },
    { path: "/organizer/attendees", element: <OrganizerAttendees /> },
    { path: "/organizer/payouts", element: <OrganizerPayouts /> },
    { path: "/organizer/settings", element: <OrganizerSettings /> },
    { path: "/organizer/*", element: <OrganizerNotFound /> },
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
            {organizerRouter.map((item, index) => (
              <Route
                key={`organizer-${index}`}
                path={item.path}
                element={item.element}
              />
            ))}
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;
