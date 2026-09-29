const Plans = lazy(() => import('./pages/Plans'));
const LiveCommunity = lazy(() => import('./pages/LiveCommunity'));
const CreateLivePost = lazy(() => import('./pages/LiveCommunity').then(module => ({default: module.CreateLivePost})));
const LiveGroups = lazy(() => import('./pages/LiveCommunity').then(module => ({default: module.LiveGroups})));
const LivePeople = lazy(() => import('./pages/LiveCommunity').then(module => ({default: module.LivePeople})));
const ResourceManagement = lazy(() => import('./components/Admin/ResourceManagement'));
const AdminSettings = lazy(() => import('./components/Admin/AdminSettings'));
import Inbox from './components/notification/Inbox';
import ChatPanel from './components/ChatPanel';
const ShuttlePage = lazy(() => import('./pages/ShuttlePage'));
const AccountAction = lazy(() => import('./pages/AccountAction'));
import OrganizerGuard from "./components/OrganizerGuard";
import React, { lazy, Suspense } from "react";
import PageSkeleton from './components/PageSkeleton';
import { Route, Routes } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Home from "./pages/Home";
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const InstallAppPage = lazy(() => import('./pages/InstallAppPage'));
import AnchorNavigation from './components/AnchorNavigation';
import Layout from "@/components/layout";
const EventDetails = lazy(() => import('./pages/EventDetails'));
const CheckoutScreen = lazy(() => import('./pages/CheckoutScreen'));
const PaymentScreen = lazy(() => import('./pages/PaymentScreen'));
const PaymentSuccessfulScreen = lazy(() => import('./pages/PaymentSuccessfulScreen'));
const TicketScreen = lazy(() => import('./pages/TicketScreen'));
const AnalyticsDashboard = lazy(() => import('./pages/AnalyticsDashboard'));
const Messages = lazy(() => import('./pages/Messages'));
const Tourism = lazy(() => import('./pages/Tourism'));
const HelpSupport = lazy(() => import('./pages/HelpSupport'));
const Events = lazy(() => import('./pages/Event'));
const Blog = lazy(() => import('./pages/Blog'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const Hotel = lazy(() => import('./pages/Hotel'));
const VenueDetails = lazy(() => import('./pages/VenueDetails'));
const BookingComfirmationPage = lazy(() => import('./pages/BookingComfirmationPage'));
import GuestGuard from "./components/GuestGuard";
const ExploreAbiaPage = lazy(() => import('./pages/ExploreAbiaPage'));
const Community = lazy(() => import('./pages/Community'));
const Food = lazy(() => import('./pages/Food'));
const DiscoverAbia = lazy(() => import('./pages/DiscoverAbia'));
const Transport = lazy(() => import('./pages/Transport'));
const NotFound = lazy(() => import('./pages/NotFound'));
const RestaurantDetails = lazy(() => import('./pages/RestaurantDetails'));
import Onboarding from "./components/onboarding/Onboarding";
const Profile = lazy(() => import('./pages/Profile'));
const Terms = lazy(() => import('./pages/Terms'));
const OrganizerApplication = lazy(() => import('./pages/OrganizerApplication'));
const OrganizerSignup = lazy(() => import('./pages/OrganizerApplication').then(module => ({default: module.OrganizerSignup})));
const OrganizerLogin = lazy(() => import('./pages/OrganizerLogin'));
const OrganizerDashboard = lazy(() => import('./pages/OrganizerDashboard'));
const OrganizerEvents = lazy(() => import('./pages/OrganizerEvents'));
const OrganizerEventForm = lazy(() => import('./pages/OrganizerEventForm'));
const OrganizerEventPreview = lazy(() => import('./pages/OrganizerEventPreview'));
const OrganizerAnalytics = lazy(() => import('./pages/OrganizerAnalytics'));
const OrganizerMessages = lazy(() => import('./pages/OrganizerMessages'));
const OrganizerTicketSales = lazy(() => import('./pages/OrganizerTicketSales'));
const OrganizerAttendees = lazy(() => import('./pages/OrganizerAttendees'));
const OrganizerPayouts = lazy(() => import('./pages/OrganizerPayouts'));
const OrganizerSettings = lazy(() => import('./pages/OrganizerSettings'));
const OrganizerNotFound = lazy(() => import('./pages/OrganizerNotFound'));
import { useParams, Navigate } from "react-router-dom";

import { UserProvider } from "./components/context/UserContext";
import { Toaster } from "@/components/ui/toaster";
const ContactPage = lazy(() => import('./pages/ContactPage'));
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));
const HistoricalSitesPage = lazy(() => import('./pages/HistoricalSitesPage'));
const CavesAndHillsPage = lazy(() => import('./pages/CavesAndHillsPage'));
const ReligiousSitesPage = lazy(() => import('./pages/ReligiousSitesPage'));
const AdventurePage = lazy(() => import('./pages/AdventurePage'));
const TourDestinationDetails = lazy(() => import('./pages/TourDestinationDetails'));
import SecuritySettingsPage from "./components/profile/SecuritySettingsPage";
import AllGroupsPage from "./components/community/screenFour/AllGroupsPage";
import PeoplePage from "./components/community/screenFive.jsx/PeoplePage";
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const GroupDetailPage = lazy(() => import('./pages/GroupDetailPage'));
const CreatePostPage = lazy(() => import('./pages/CreatePostPage'));
const PersonProfilePage = lazy(() => import('./pages/PersonProfilePage'));
const AdminLogin = lazy(() => import('../src/components/Admin/login/AdminLogin'));
const AdminForgotPassword = lazy(() => import('./components/Admin/login/AdminForgotPassword'));
const AdminVerifyOtp = lazy(() => import('./components/Admin/login/AdminVerifyOtp'));
import AdminLayout from "./components/Admin/layout/AdminLayout";
import AboutAbia from "./pages/AboutAbia";
import ScrollToTop from "./components/common/ScrollToTop";
const AdminDashboard = lazy(() => import('./components/Admin/dashboard/AdminDashboard'));
const AdminUsers = lazy(() => import('./components/Admin/users/AdminUsers'));
const AdminUserDetails = lazy(() => import('./components/Admin/users/AdminUserDetails'));
const AdminOrganizers = lazy(() => import('./components/Admin/organizers/AdminOrganizers'));
const AdminOrganizerDetails = lazy(() => import('./components/Admin/organizers/details/AdminOrganizerDetails'));
const AdminEvents = lazy(() => import('./components/Admin/events/AdminEvents'));
const AdminEventDetails = lazy(() => import('./components/Admin/events/details/AdminEventDetails'));
const AdminEventReview = lazy(() => import('./components/Admin/events/details/eventReviewPage/AdminEventReview'));
const AdminTourism = lazy(() => import('./components/Admin/tourism/AdminTourism'));
const DestinationDetail = lazy(() => import('./components/Admin/tourism/details/DestinationDetail'));
const AdminProperties = lazy(() => import('./components/Admin/hotels/properties/AdminProperties'));
const PropertyDetail = lazy(() => import('./components/Admin/hotels/properties/details/PropertyDetail'));
const AdminFood = lazy(() => import('./components/Admin/food/AdminFood'));
const FoodVendorDetail = lazy(() => import('./components/Admin/food/details/FoodVendorDetail'));
const AdminTransportDashboard = lazy(() => import('./components/Admin/transport/AdminTransportDashboard'));

// /organizer/events/:id/edit needs the :id param handed to OrganizerEventForm
// as the `editId` prop.
const OrganizerEventEditRoute = () => {
  const { id } = useParams();
  return <OrganizerEventForm editId={id} />;
};

const App = () => {
  const navList = [
    {
      path: "/plans",
      element: (
        <GuestGuard>
          <Plans />
        </GuestGuard>
      ),
    },
    {
      path: "/plans/return",
      element: (
        <GuestGuard>
          <Plans />
        </GuestGuard>
      ),
    },
    { path: "/blog/:id", element: <LiveCommunity blog detail /> },
    {
      path: "/community/posts/:id",
      element: (
        <GuestGuard>
          <LiveCommunity detail />
        </GuestGuard>
      ),
    },
    {
      path: "/transport/shuttle",
      element: (
        <GuestGuard>
          <ShuttlePage />
        </GuestGuard>
      ),
    },
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
            <Profile />
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
            <LiveCommunity />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/community/groups",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <LiveGroups />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/community/people",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <LivePeople />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/community/groups/:id",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <LiveCommunity groupView />
          </GuestGuard>
        </div>
      ),
    },

    {
      path: "/community/create-post",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <CreateLivePost />
          </GuestGuard>
        </div>
      ),
    },
    {
      path: "/community/people/:id",
      element: (
        <div className="mx-5 my-5">
          <GuestGuard>
            <LivePeople />
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
          <LiveCommunity blog />
        </div>
      ),
    },
    {
      path: "/about",
      element: (
        <div className="mx-5 my-5">
          {/* <GuestGuard> */}
          <DiscoverAbia />
          {/* </GuestGuard> */}
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
    {
      path: "/about-abia",
      element: (
        <div className="mx-5 my-5">
          <AboutAbia />
        </div>
      ),
    },
  ];
  const authRouter = [
    { path: "/install", element: <InstallAppPage /> },
    {
      path: "/notifications",
      element: (
        <GuestGuard>
          <NotificationsPage />
        </GuestGuard>
      ),
    },
    { path: "/terms", element: <Terms /> },
    { path: "/verify-email", element: <AccountAction /> },
    { path: "/reset-password", element: <AccountAction /> },
    {
      path: "/payment/return",
      element: (
        <GuestGuard>
          <PaymentSuccessfulScreen />
        </GuestGuard>
      ),
    },
    { path: "/login", element: <Login /> },
    { path: "/Signup", element: <SignUp /> },
    { path: "/Signup/onboarding", element: <Onboarding /> },
    { path: "/admin/login", element: <AdminLogin /> },
    {
      path: "/admin/forgot-password",
      element: <Navigate to="/reset-password" replace />,
    },
    {
      path: "/admin/verify-otp",
      element: <Navigate to="/reset-password" replace />,
    },
  ];

  // Pages shown inside the admin layout (sidebar + header + footer).
  // Paths are relative to /admin, so "users" becomes /admin/users.
  const adminRouter = [
    ...[
      "community",
      "content",
      "bookings",
      "payments",
      "subscriptions",
      "reports",
    ].map((section) => ({
      path: section,
      element: <ResourceManagement key={section} section={section} />,
    })),
    {
      path: "hotels/rooms",
      element: <ResourceManagement key="rooms" section="rooms" />,
    },
    {
      path: "hotels/bookings",
      element: (
        <ResourceManagement
          key="hotel-bookings"
          section="bookings"
          fixedFilters="&kind=HOTEL"
        />
      ),
    },
    { path: "hotels/hosts", element: <AdminUsers hotelHosts /> },
    {
      path: "hotels/reviews",
      element: (
        <ResourceManagement
          key="reviews"
          section="hotel-reviews"
          fixedFilters="&kind=HOTEL"
        />
      ),
    },
    { path: "analytics", element: <AdminDashboard /> },
    { path: "support", element: <ChatPanel /> },
    { path: "notifications", element: <Inbox /> },
    { path: "settings", element: <AdminSettings /> },
    { index: true, element: <AdminDashboard /> },
    { path: "users", element: <AdminUsers /> },
    { path: "users/:id", element: <AdminUserDetails /> },
    { path: "organizers", element: <AdminOrganizers /> },
    { path: "organizers/:id", element: <AdminOrganizerDetails /> },
    { path: "events", element: <AdminEvents /> },
    { path: "events/:id", element: <AdminEventDetails /> },
    { path: "events/:id/review", element: <AdminEventReview /> },
    {
      path: "tourism",
      element: <ResourceManagement key="tourism" section="tourism" />,
    },
    {
      path: "tourism/:id",
      element: <ResourceManagement key="tourism" section="tourism" />,
    },
    {
      path: "hotels/properties",
      element: <ResourceManagement key="hotels" section="hotels" />,
    },
    {
      path: "hotels/properties/:id",
      element: <ResourceManagement key="hotels" section="hotels" />,
    },
    { path: "food", element: <ResourceManagement key="food" section="food" /> },
    {
      path: "food/:id",
      element: <ResourceManagement key="food" section="food" />,
    },
    {
      path: "transport",
      element: <ResourceManagement key="transport" section="transport" />,
    },
    // add each new admin page here as we build it, for example:
    // { path: "events", element: <AdminEvents /> },
    {
      path: "*",
      element: (
        <div className="p-6 text-sm text-slate-500">
          Page not found.{" "}
          <a href="/admin" className="text-green-800 underline">
            Return to the dashboard
          </a>
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
            <ScrollToTop />
            <AnchorNavigation/>
            <Suspense fallback={<PageSkeleton/>}><Routes>
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
                  element={
                    [
                      "/organizer/login",
                      "/organizer",
                      "/organizer/signup",
                      "/organizer/apply",
                    ].includes(item.path) ? (
                      item.element
                    ) : (
                      <OrganizerGuard>{item.element}</OrganizerGuard>
                    )
                  }
                />
              ))}
            </Routes></Suspense>
          </UserProvider>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default App;
