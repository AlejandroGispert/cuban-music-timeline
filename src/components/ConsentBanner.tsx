import { useEffect, useState } from "react";

// Define proper types for Google Analytics
type GtagConsent = {
  ad_storage: "granted" | "denied";
  analytics_storage: "granted" | "denied";
  functionality_storage: "granted" | "denied";
  security_storage: "granted" | "denied";
};

type GtagCommand = "consent" | "js" | "config";
type GtagAction = "default" | "update";

type GtagArgs = [command: GtagCommand, action: GtagAction | string, params?: GtagConsent | string];

declare global {
  interface Window {
    dataLayer: GtagArgs[];
    gtag: (...args: GtagArgs) => void;
  }
}

const ConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Initialize dataLayer and set default consent to denied
    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: GtagArgs) => {
      window.dataLayer.push(args);
    };

    // Set default consent to denied
    window.gtag("consent", "default", {
      ad_storage: "denied",
      analytics_storage: "denied",
      functionality_storage: "denied",
      security_storage: "denied",
    });

    const consent = localStorage.getItem("cookie_consent");
    console.log("Current consent value:", consent);

    if (!consent) {
      console.log("No consent found, showing banner");
      setShowBanner(true);
    } else if (consent === "granted") {
      console.log("Consent granted, enabling analytics");
      enableGoogleAnalytics();
    }
  }, []);

  const handleConsent = (choice: "granted" | "denied") => {
    localStorage.setItem("cookie_consent", choice);
    setShowBanner(false);

    if (choice === "granted") {
      enableGoogleAnalytics();
    } else {
      // Ensure analytics are disabled if consent is denied
      window.gtag("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "denied",
        functionality_storage: "denied",
        security_storage: "denied",
      });
    }
  };

  const enableGoogleAnalytics = () => {
    // Update consent state
    window.gtag("consent", "update", {
      ad_storage: "granted",
      analytics_storage: "granted",
      functionality_storage: "granted",
      security_storage: "granted",
    });

    // Only load GA script if it hasn't been loaded yet
    if (!document.querySelector('script[src*="googletagmanager.com"]')) {
      const script = document.createElement("script");
      script.src = "https://www.googletagmanager.com/gtag/js?id=G-1RQSJMWL8E";
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.gtag("js", new Date().toISOString());
        window.gtag("config", "G-1RQSJMWL8E");
      };
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-gray-800 text-white p-4 z-[9999] shadow-lg">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-center sm:text-left">
          🎶 We use cookies for statistics, to enhance your Cuban music journey. Is that ok?
        </p>
        <div className="flex gap-3 w-full sm:w-auto">
          {" "}
          <button
            className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition-colors text-sm font-medium"
            onClick={() => handleConsent("denied")}
          >
            Reject
          </button>
          <button
            className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition-colors text-sm font-medium"
            onClick={() => handleConsent("granted")}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
