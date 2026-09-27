import ShuttlePage from "./pages/ShuttlePage";
import AccountAction from "./pages/AccountAction";
import OrganizerGuard from "./components/OrganizerGuard";
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
import OrganizerApplication, {OrganizerSignup} from './pages/OrganizerApplication';
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

import { UserProvider } from "./components/context/UserContext";
import { Toaster } from "@/components/ui/toaster";
import ContactPage from "./pages/ContactPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import HistoricalSitesPage from "./pages/HistoricalSitesPage";
import CavesAndHillsPage from "./pages/CavesAndHillsPage";
import ReligiousSitesPage from "./pages/ReligiousSitesPage";
import AdventurePage from "./pages/AdventurePage";
import TourDestinationDetails from "./pages/TourDestinationDetails";
import SecuritySettingsPage from "./components/profile/SecuritySettingsPage";
import AllGroupsPage from "./components/community/screenFour/AllGroupsPage";
import PeoplePage from "./components/community/screenFive.jsx/PeoplePage";
import CommunityPage from "./pages/CommunityPage";
import GroupDetailPage from "./pages/GroupDetailPage";
import CreatePostPage from "./pages/CreatePostPage";
import PersonProfilePage from "./pages/PersonProfilePage";
import AdminLogin from "../src/components/Admin/login/AdminLogin";
import AdminForgotPassword from "./components/Admin/login/AdminForgotPassword";
import AdminVerifyOtp from "./components/Admin/login/AdminVerifyOtp";
import AdminLayout from "./components/Admin/layout/AdminLayout";
import AdminDashboard from "./components/Admin/dashboard/AdminDashboard";
import AdminUsers from "./components/Admin/users/AdminUsers";
import AdminUserDetails from "./components/Admin/users/AdminUserDetails";
import AdminOrganizers from "./components/Admin/organizers/AdminOrganizers";
import AdminOrganizerDetails from "./components/Admin/organizers/details/AdminOrganizerDetails";
import AdminEvents from "./components/Admin/events/AdminEvents";
import AdminEventDetails from "./components/Admin/events/details/AdminEventDetails";
import AdminEventReview from "./components/Admin/events/details/eventReviewPage/AdminEventReview";
import AdminTourism from "./components/Admin/tourism/AdminTourism";
import DestinationDetail from "./components/Admin/tourism/details/DestinationDetail";
import AdminProperties from "./components/Admin/hotels/properties/AdminProperties";
import PropertyDetail from "./components/Admin/hotels/properties/details/PropertyDetail";
import AdminFood from "./components/Admin/food/AdminFood";
import FoodVendorDetail from "./components/Admin/food/details/FoodVendorDetail";
import AdminTransportDashboard from "./components/Admin/transport/AdminTransportDashboard";

// /organizer/events/:id/edit needs the :id param handed to OrganizerEventForm
// as the `editId` prop.
const OrganizerEventEditRoute = () => {
  const { id } = useParams();
  return <OrganizerEventForm editId={id} />;
};

const App = () => {
  const navList = [
    { path: "/transport/shuttle", element: <GuestGuard><ShuttlePage /></GuestGuard> },
    {
      path: "/",
      element: (
        <div className="mx-5">
          <Home />
        </div>
      ),
    },
    {
      path: "/contact",
      element: (
        <div className="mx-5">
          <ContactPage />
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
      path: "/destinations/:id",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <TourDestinationDetails />
          </GuestGuard>
        </div>
      ),
    },
    // {
    //   path: "/contact",
    //   element: (
    //     <div className="mx-5 my-5">
    //       <GuestGuard>
    //         <HelpSupport />
    //       </GuestGuard>
    //     </div>
    //   ),
    // },
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
            <CommunityPage />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/community/groups",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <AllGroupsPage />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/community/people",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <PeoplePage />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/community/groups/:id",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <GroupDetailPage />
          </GuestGuard>
        </div>
      ),
    },

    {
      path: "/community/create-post",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <CreatePostPage />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/community/people/:id",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <PersonProfilePage />
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
      path: "/hotels/:id",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <VenueDetails />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/book-comfire/:id",
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
      path: "/fooddetail/:id",
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
    {
      path: "/search",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <SearchResultsPage />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/historical-sites",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <HistoricalSitesPage />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/caves-and-hills",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <CavesAndHillsPage />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/religious-sites",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <ReligiousSitesPage />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/adventure",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <AdventurePage />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/settings/security",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <SecuritySettingsPage />
          </GuestGuard>
        </div>
      ),
    },
  ];
  const authRouter = [
    { path: "/verify-email", element: <AccountAction /> },
    { path: "/reset-password", element: <AccountAction /> },
    { path: "/payment/return", element: <GuestGuard><PaymentSuccessfulScreen /></GuestGuard> },
    { path: "/login", element: <Login /> },
    { path: "/Signup", element: <SignUp /> },
    { path: "/Signup/onboarding", element: <Onboarding /> },
    { path: "/admin/login", element: <AdminLogin /> },
    { path: "/admin/forgot-password", element: <Navigate to="/reset-password" replace /> },
    { path: "/admin/verify-otp", element: <Navigate to="/reset-password" replace /> },
  ];

  // Pages shown inside the admin layout (sidebar + header + footer).
  // Paths are relative to /admin, so "users" becomes /admin/users.
  const adminRouter = [
    { index: true, element: <AdminDashboard /> },
    { path: "users", element: <AdminUsers /> },
    { path: "users/:id", element: <AdminUserDetails /> },
    { path: "organizers", element: <AdminOrganizers /> },
    { path: "organizers/:id", element: <AdminOrganizerDetails /> },
    { path: "events", element: <AdminEvents /> },
    { path: "events/:id", element: <AdminEventDetails /> },
    { path: "events/:id/review", element: <AdminEventReview /> },
    { path: "tourism", element: <AdminTourism /> },
    { path: "tourism/:id", element: <DestinationDetail /> },
    { path: "hotels/properties", element: <AdminProperties /> },
    { path: "hotels/properties/:id", element: <PropertyDetail /> },
    { path: "food", element: <AdminFood /> },
    { path: "food/:id", element: <FoodVendorDetail /> },
    { path: "transport", element: <AdminTransportDashboard /> },
    // add each new admin page here as we build it, for example:
    // { path: "events", element: <AdminEvents /> },
    {
      path: "*",
      element: (
        <div className="p-6 text-sm text-slate-500">
          This page isn't built yet.
        </div>
      ),
    },
  ];

  const organizerRouter = [
    { path: "/organizer", element: <Navigate to="/organizer/login" replace /> },
    { path: "/organizer/login", element: <OrganizerLogin /> },
    { path: "/organizer/signup", element: <OrganizerSignup /> },
    { path: "/organizer/apply", element: <OrganizerApplication /> },
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
          <UserProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                {navList.map((item, index) => (
                  <Route key={index} path={item.path} element={item.element} />
                ))}
              </Route>

              {authRouter.map((item, index) => (
                <Route
                  key={`auth-${index}`}
                  path={item.path}
                  element={item.element}
                />
              ))}

              <Route path="/admin" element={<AdminLayout />}>
                {adminRouter.map((item, index) => (
                  <Route
                    key={`admin-${index}`}
                    index={item.index}
                    path={item.path}
                    element={item.element}
                  />
                ))}
              </Route>

              {organizerRouter.map((item, index) => (
                <Route
                  key={`organizer-${index}`}
                  path={item.path}
                  element={["/organizer/login", "/organizer", "/organizer/signup", "/organizer/apply"].includes(item.path) ? item.element : <OrganizerGuard>{item.element}</OrganizerGuard>}
                />
              ))}
            </Routes>
          </UserProvider>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default App;
