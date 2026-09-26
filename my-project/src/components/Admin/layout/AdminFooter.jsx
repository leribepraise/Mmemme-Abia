const AdminFooter = () => {
  return (
    <footer className="flex flex-col items-center justify-between gap-1 border-t border-slate-200 px-4 py-4 text-xs text-slate-400 sm:flex-row sm:px-6">
      <p>© {new Date().getFullYear()} Mmemme Abia. All rights reserved.</p>
      <p>Version 1.0.0</p>
    </footer>
  );
};

export default AdminFooter;
