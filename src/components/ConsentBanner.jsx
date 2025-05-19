// components/ConsentBanner.jsx
import { useEffect, useState } from "react";

export default function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShowBanner(true);
    } else if (consent === "granted") {
      enableGoogleAnalytics();
    }
  }, []);

  const handleConsent = choice => {
    localStorage.setItem("cookie_consent", choice);
    setShowBanner(false);
    if (choice === "granted") {
      enableGoogleAnalytics();
    }
  };

  const enableGoogleAnalytics = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag("consent", "default", {
      ad_storage: "denied",
      analytics_storage: "denied",
    });
    gtag("consent", "update", {
      ad_storage: "granted",
      analytics_storage: "granted",
    });

    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      gtag("js", new Date());
      gtag("config", "G-1RQSJMWL8E");
    };
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 w-full bg-gray-800 text-white p-4 flex justify-between items-center z-50">
      <p className="text-sm">🎶 We use cookies to enhance your Cuban music journey. Is that ok?</p>
      <div className="space-x-2">
        <button
          className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded"
          onClick={() => handleConsent("granted")}
        >
          Accept
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
          onClick={() => handleConsent("denied")}
        >
          Reject
        </button>
      </div>
    </div>
  );
}
