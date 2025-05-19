import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AdDialog } from "@/components/AdDialog";

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdDialogOpen, setIsAdDialogOpen] = useState(false);

  const handleSupportClick = () => {
    setIsAdDialogOpen(true);
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-cuba-red flex items-center justify-center">
            <span className="text-white text-xl font-bold">RC</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cuba-red to-cuba-blue bg-clip-text text-transparent">
            Ritmos Cubanos
          </h1>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <div id="google_translate_element" className="ml-auto" />
          <Link
            to="/"
            className={`font-medium ${location.pathname === "/" ? "text-cuba-red" : "text-gray-600 hover:text-cuba-red"}`}
          >
            Timeline
          </Link>
          <Link
            to="/map"
            className={`font-medium ${location.pathname === "/map" ? "text-cuba-red" : "text-gray-600 hover:text-cuba-red"}`}
          >
            Map
          </Link>
          <Button
            variant="outline"
            className="border-cuba-gold text-cuba-gold hover:bg-cuba-gold/10 hover:text-cuba-gold"
            onClick={handleSupportClick}
          >
            Support Us
          </Button>
        </nav>

        <button
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b pb-4 px-4 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/"
              className={`font-medium p-2 rounded ${location.pathname === "/" ? "bg-cuba-red/10 text-cuba-red" : "text-gray-600"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Timeline
            </Link>
            <Link
              to="/map"
              className={`font-medium p-2 rounded ${location.pathname === "/map" ? "bg-cuba-red/10 text-cuba-red" : "text-gray-600"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Map
            </Link>
            <Button
              variant="outline"
              className="border-cuba-gold text-cuba-gold hover:bg-cuba-gold/10"
              onClick={handleSupportClick}
            >
              Support Us
            </Button>
          </nav>
        </div>
      )}

      <AdDialog open={isAdDialogOpen} onOpenChange={setIsAdDialogOpen} />
    </header>
  );
};

export default Header;
