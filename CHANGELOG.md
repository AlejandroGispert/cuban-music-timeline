# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Consent banner backdrop + scroll lock to block interaction until a choice is made.
- `public/ads.txt` placeholder for AdSense (Authorized Digital Sellers).

### Changed
- Consent banner copy and button labels (“Only essential” / “Allow analytics”).
- Google Analytics now initializes in consent-mode by default; storage-based analytics activates only after explicit consent.
- Switched from AdMob-focused transparency placeholders to AdSense (`ads.txt`) and removed the local `sellers.json` placeholder.
- Configured `public/ads.txt` with the site’s real AdSense publisher ID.

### Removed
- Removed AI History mode (UI entry point + `/ai-history` route) and its OpenAI API integration.
