import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-cuba-red flex items-center justify-center">
                <span className="text-white text-sm font-bold">RC</span>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-cuba-red to-cuba-blue bg-clip-text text-transparent">
                Ritmos Cubanos
              </h2>
            </div>
            <p className="text-gray-600 text-sm">
              Exploring the rich history of Cuban music through an interactive timeline.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-cuba-red text-sm">
                  Timeline
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-gray-600 hover:text-cuba-red text-sm">
                  Map
                </Link>
              </li>
              <li>
                <button className="text-gray-600 hover:text-cuba-red text-sm">Support Us</button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Disclaimer</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              This project aims to be as accurate as possible, referencing books and input from
              Cuban music historians. If you spot an inaccuracy, please contact us at{" "}
              <a href="mailto:ritmocubano@gmail.com" className="text-cuba-blue hover:underline">
                info@ritmocubano.example.com
              </a>{" "}
              with evidence of your correction. We value historical integrity. Any advertisements
              are used solely to maintain and upgrade servers, and to cover the operational costs of
              running this site.
            </p>
          </div>
        </div>

        <div className="border-t mt-8 pt-6">
          <p className="text-gray-500 text-xs text-center">
            © {new Date().getFullYear()} Ritmo Cubano. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
