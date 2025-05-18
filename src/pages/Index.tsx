import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Timeline from "@/components/Timeline";
import Footer from "@/components/Footer";

const Index = () => {
  const [searchParams] = useSearchParams();
  const province = searchParams.get("province");
  const city = searchParams.get("city");

  useEffect(() => {
    // This could be used to set initial filters based on URL parameters
    if (province || city) {
      console.log("Filter parameters received:", { province, city });
      // You can implement automatic filtering here based on URL params
    }
  }, [province, city]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-cuba-red to-cuba-blue bg-clip-text text-transparent">
            Cuban Music Timeline
          </h1>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Explore the rich history of Cuban music through this interactive timeline, showcasing
            key events, musical styles, and cultural influences across time.
          </p>

          <Timeline />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
