import { useEffect, useRef } from "react";

const ADSENSE_CLIENT = "ca-pub-5806299023049544";
const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;

type AdSenseUnitProps = {
  slot: string;
  className?: string;
  /**
   * AdSense recommended default is "auto" for responsive units.
   * See: https://support.google.com/adsense/answer/9183660
   */
  format?: string;
  fullWidthResponsive?: boolean;
};

function ensureAdSenseScriptLoaded() {
  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${ADSENSE_SCRIPT_SRC}"]`
  );
  if (existing) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = ADSENSE_SCRIPT_SRC;
  script.crossOrigin = "anonymous";
  document.head.appendChild(script);
}

export default function AdSenseUnit({
  slot,
  className,
  format = "auto",
  fullWidthResponsive = true,
}: AdSenseUnitProps) {
  const didRequestAd = useRef(false);

  useEffect(() => {
    if (didRequestAd.current) return;
    didRequestAd.current = true;

    ensureAdSenseScriptLoaded();

    // Allow the <ins> to mount before pushing the request.
    const id = window.setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        // Ad blockers or script loading races can cause this; don't crash the app.
        console.warn("AdSense push failed:", err);
      }
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className ?? ""}`.trim()}
      style={{ display: "block" }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
    />
  );
}
