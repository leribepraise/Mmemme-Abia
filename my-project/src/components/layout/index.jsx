import React, { Suspense } from "react";
import PageSkeleton from '../PageSkeleton';
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const index = () => {
  return (
    <>
      <div>
        <Header />
        <div>
          <Suspense fallback={<PageSkeleton/>}><Outlet /></Suspense>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default index;
