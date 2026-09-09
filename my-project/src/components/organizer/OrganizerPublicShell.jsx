import { Fragment } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function OrganizerPublicShell({ breadcrumb = [], title, subtitle, actions, children, contentClassName = "" }) {
  return (
    <div className="min-h-screen bg-[#F7F8F6] flex flex-col font-sans text-gray-800">
      <Header />
      <main className="flex-1">
        <div className={`max-w-6xl mx-auto px-5 py-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 ${contentClassName}`}>
          {(breadcrumb.length > 0 || title) && (
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                {breadcrumb.length > 0 && (
                  <div className="text-xs text-gray-400 mb-2 flex flex-wrap gap-2">
                    {breadcrumb.map((crumb, i) => (
                      <Fragment key={crumb}>
                        {i > 0 && <span>&gt;</span>}
                        <span className={i === breadcrumb.length - 1 ? "text-gray-800 font-semibold" : ""}>
                          {crumb}
                        </span>
                      </Fragment>
                    ))}
                  </div>
                )}
                {title && <h1 className="text-2xl font-extrabold text-black">{title}</h1>}
                {subtitle && <p className="text-sm text-gray-500 font-medium mt-1">{subtitle}</p>}
              </div>
              {actions && <div className="flex items-center gap-3 flex-wrap">{actions}</div>}
            </div>
          )}
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
