import Header from "@/components/Header";
import Map from "@/components/Map";
import Footer from "@/components/Footer";

const MapView = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        {/* Top Leaderboard Ad */}
        <div className="container mx-auto px-0 md:px-4 mb-8">
          <div className="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <p className="font-medium">Advertisement</p>
              <p className="text-xs">728x90 banner ad space</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-0 md:px-4">
          <h1 className="text-3xl font-bold mb-2 text-center px-4 md:px-0">Cuban Music Map</h1>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto px-4 md:px-0">
            Explore the geographical origins of different Cuban music styles and how they spread
            throughout the island.
          </p>
          <Map />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MapView;
