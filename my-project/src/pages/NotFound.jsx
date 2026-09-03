import React from "react";
import NotFoundIllustration from "../components/notFound/NotFoundIllustration";
import NotFoundMessage from "../components/notFound/NotFoundMessage";
import NotFoundButtons from "../components/notFound/NotFoundButtons";
const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center">
        <NotFoundIllustration />
        <NotFoundMessage />
        <NotFoundButtons />
      </main>
    </div>
  );
};

export default NotFound;
