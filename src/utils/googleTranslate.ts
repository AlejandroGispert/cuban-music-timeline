// src/utils/googleTranslate.ts

// Declare Google Translate types
interface GoogleTranslateElementInit {
  pageLanguage: string;
  includedLanguages: string;
  layout: number;
  autoDisplay: boolean;
}

interface GoogleTranslateElement {
  new (options: GoogleTranslateElementInit, elementId: string): void;
  InlineLayout: {
    SIMPLE: number;
  };
}

interface GoogleTranslate {
  translate: {
    TranslateElement: GoogleTranslateElement;
  };
}

declare global {
  interface Window {
    google: GoogleTranslate;
    googleTranslateElementInit: () => void;
  }
}

export const initGoogleTranslate = () => {
  const element = document.getElementById("google_translate_element");
  if (!element) return;

  if (typeof window.google !== "undefined" && window.google.translate) {
    try {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "es,en",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    } catch (error) {
      console.error("Error initializing Google Translate:", error);
    }
  }
};
