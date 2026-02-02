# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- `public/ads.txt` for AdSense (Authorized Digital Sellers).
- AdSense “map-banner-top” ad unit on the Map page.
- AdSense ad slot in the “Support Us” dialog (defaults to slot `8815092031`, optional override via `VITE_ADSENSE_SUPPORT_SLOT`).

### Changed
- Google consent is now handled by Google CMP (Funding Choices) instead of the custom in-app banner.
- Google Analytics now runs under Google Consent Mode values provided by the CMP.
- Switched from AdMob-focused transparency placeholders to AdSense (`ads.txt`) and removed the local `sellers.json` placeholder.
- Configured `public/ads.txt` with the site’s real AdSense publisher ID.
- Updated the “Support Us” button styling to be more prominent.

### Removed
- Removed AI History mode (UI entry point + `/ai-history` route) and its OpenAI API integration.
- Removed the custom `ConsentBanner` component and local consent storage (`cookie_consent`).
