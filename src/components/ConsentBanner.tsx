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

const GA_MEASUREMENT_ID = "G-1RQSJMWL8E";

const ConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Initialize dataLayer and set default consent to denied
    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: GtagArgs) => {
      window.dataLayer.push(args);
    };

    // Default consent: denied (cookieless until user allows analytics)
    window.gtag("consent", "default", {
      ad_storage: "denied",
      analytics_storage: "denied",
      functionality_storage: "denied",
      security_storage: "denied",
    });

    // Always initialize GA in consent mode so basic measurement can occur
    // (full storage-based analytics only happens after explicit consent).
    window.gtag("js", new Date().toISOString());
    window.gtag("config", GA_MEASUREMENT_ID);

    // Load GA script if it hasn't been loaded yet
    if (
      !document.querySelector(
        `script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`
      )
    ) {
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      script.async = true;
      document.head.appendChild(script);
    }

    const consent = localStorage.getItem("cookie_consent");

    if (!consent) {
      setShowBanner(true);
    } else if (consent === "granted") {
      enableGoogleAnalytics();
    } else {
      // Treat any other stored value as "essential only"
      window.gtag("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "denied",
        functionality_storage: "denied",
        security_storage: "denied",
      });
    }
  }, []);

  useEffect(() => {
    if (!showBanner) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showBanner]);

  const handleConsent = (choice: "granted" | "essential") => {
    localStorage.setItem("cookie_consent", choice);
    setShowBanner(false);

    if (choice === "granted") {
      enableGoogleAnalytics();
    } else {
      // Essential only: keep analytics storage denied
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

    // Ensure GA config has been queued (script is loaded globally above)
    window.gtag("config", GA_MEASUREMENT_ID);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Backdrop that blocks interaction until accepted/denied */}
      <div className="fixed inset-0 bg-black/50 z-[9998]" aria-hidden="true" />

      <div
        className="fixed bottom-0 left-0 right-0 w-full bg-gray-800 text-white p-4 z-[9999] shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-label="Cookie consent"
      >
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-center sm:text-left">
            We use analytics cookies to understand site usage and improve your experience. Please choose your preference.
          </p>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              className="flex-1 sm:flex-none bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded transition-colors text-sm font-medium"
              onClick={() => handleConsent("essential")}
            >
              Only essential
            </button>
            <button
              className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition-colors text-sm font-medium"
              onClick={() => handleConsent("granted")}
            >
              Allow analytics
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsentBanner;
