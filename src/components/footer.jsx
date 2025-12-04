import Logo from "./logo";

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <Logo size="sm" />
        <div className="flex gap-6 text-sm text-slate-500">
          <a href="#" className="hover:text-blue-600">
            Privacy
          </a>
          <a href="#" className="hover:text-blue-600">
            Terms
          </a>
          <a href="#" className="hover:text-blue-600">
            Contact
          </a>
        </div>
        <div className="text-sm text-slate-400">© 2023 CloudZoon Inc.</div>
      </div>
    </footer>
  );
}

export default Footer;
