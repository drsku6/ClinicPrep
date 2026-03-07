
# Health App Blueprint

## Overview

This is a health application that allows users to check their symptoms, find specialists, and get health information. The application is built with Next.js and Firebase.

## Features

- **Authentication:** Users can sign in with their email and password.
- **Terms of Use:** Users must agree to the terms of use before using the application.
- **Symptom Checker:** Users can enter their symptoms and get a possible diagnosis.
- **Specialist Finder:** Users can find specialists based on their location and specialty.

## Design

- **Styling:** The application uses Tailwind CSS for styling.
- **Colors:** The application uses a dark theme with a color palette of gray, blue, and white.
- **Fonts:** The application uses the Geist font.

## Project Structure

```
/
|-- src/
|   |-- app/
|   |   |-- (home)/
|   |   |   |-- dashboard.tsx
|   |   |   |-- page.tsx
|   |   |-- components/
|   |   |   |-- Navbar.tsx
|   |   |-- dashboard/
|   |   |   |-- page.tsx
|   |   |-- signin/
|   |   |   |-- page.tsx
|   |   |-- specialist-finder/
|   |   |   |-- page.tsx
|   |   |-- symptom-checker/
|   |   |   |-- page.tsx
|   |   |-- globals.css
|   |   |-- layout.tsx
|   |-- context/
|   |   |-- AuthContext.tsx
|   |-- lib/
|   |   |-- firebase.ts
|-- .firebaserc
|-- .gitignore
|-- firebase.json
|-- next-env.d.ts
|-- next.config.mjs
|-- package.json
|-- postcss.config.js
|-- tailwind.config.ts
|-- tsconfig.json
f
```
