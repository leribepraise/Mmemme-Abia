import { Fragment } from "react";
import OrganizerSidebar from "./OrganizerSidebar";
import OrganizerTopbar from "./OrganizerTopbar";

export default function OrganizerShell({ breadcrumb = [], title, subtitle, greeting, actions, children }) {
  return (
    <div className="min-h-screen bg-[#F7F8F6] flex font-sans text-gray-800">
      <OrganizerSidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {greeting ? (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-lg font-extrabold text-black flex items-center gap-2">
                  Welcome back, {greeting} <span aria-hidden>👋</span>
                </h1>
                {subtitle && <p className="text-sm text-gray-500 font-medium mt-1">{subtitle}</p>}
              </div>
              <div className="flex items-center gap-3">
                {actions}
                <OrganizerTopbar />
              </div>
            </div>
          ) : (
            (breadcrumb.length > 0 || title) && (
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
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
                <div className="flex items-center gap-3 flex-wrap">
                  {actions}
                  <OrganizerTopbar />
                </div>
              </div>
            )
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
