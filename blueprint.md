# ClinicPrep AI - Project Blueprint

## 1. Project Overview

ClinicPrep AI is a sophisticated web application designed to help patients prepare for their medical appointments. It provides a secure, user-friendly interface for patients to review their symptoms, understand potential conditions, and find relevant specialists. The application is built on the Next.js framework, leverages Firebase for authentication and data, and is designed for a seamless, responsive user experience.

---

## 2. Design and Styling

The application adheres to a modern, clean, and accessible design philosophy. The goal is to create a calming and intuitive user interface that is easy to navigate for all users, regardless of technical proficiency or physical ability.

*   **Framework**: Tailwind CSS
*   **Color Palette**:
    *   **Primary**: A vibrant blue (`#3B82F6`) used for interactive elements, links, and highlights.
    *   **Neutral**: A range of grays (`#F9FAFB` to `#4B5563`) for backgrounds, text, and borders.
    *   **Accent (Error)**: A clear red (`#EF4444`) for error messages and alerts.
*   **Typography**: The default sans-serif font stack is used for its high readability across devices. Font sizes and weights are used hierarchically to guide the user's attention.
*   **Layout**: The application uses a responsive, container-based layout that adapts gracefully to different screen sizes, ensuring a consistent experience on both desktop and mobile devices.
*   **Components**: Forms, buttons, and navigation elements are designed with large, clear click targets and visual feedback (hover, focus, disabled states) to enhance usability.

---

## 3. Implemented Features

This section documents the core features that have been implemented in the application.

### 3.1. Authentication

*   **Provider**: Firebase Authentication.
*   **Methods**: 
    *   Email & Password (Sign-in and Sign-up).
    *   Google Sign-In (OAuth with redirect).
*   **UI**: A unified sign-in/sign-up page (`/signin`) with a tabbed interface to switch between login and registration.
*   **Context**: A global `AuthContext` (`src/context/AuthContext.tsx`) provides the user's authentication state and loading status to all components in the application.

### 3.2. Protected Routes

*   **Implementation**: A robust authentication gate is implemented on protected routes (e.g., `/prepare`).
*   **Logic**: 
    1.  A `loading` state is displayed while Firebase `onAuthStateChanged` is verifying the user's session.
    2.  If the user is not authenticated, a clear message is shown, and the `AuthContext` redirects them to the `/signin` page.
    3.  Only when the user is confirmed as authenticated is the protected content rendered.
*   **Benefit**: This prevents content flashing and race conditions, ensuring a secure and smooth user experience.

### 3.3. Error Handling and Reporting

*   **Lighthouse Audit Fixes**:
    *   **Accessibility**: Form inputs on the sign-in page now have explicit labels (`htmlFor`) to improve screen reader compatibility.
    *   **Caching**: A custom `next.config.js` file has been added to set appropriate `Cache-Control` headers, enabling the back/forward cache for faster navigation.
*   **Not Found Page**: A user-friendly 404 page (`src/app/_not-found/page.tsx`) has been implemented to gracefully handle requests for non-existent routes.

---

## 4. Current Sprint: QA & Verification

This section logs the steps and results of the current Quality Assurance cycle.

*   **Objective**: Verify the fix for the "false-positive" on the `/prepare` protected route and perform a general regression test of core features.

*   **Plan**:
    1.  **DONE - Blueprint Update**: Create and populate the `blueprint.md` file to establish a baseline for the project's current state.
    2.  **PENDING - Linting**: Run `npm run lint` to perform static code analysis and check for quality and style issues.
    3.  **PENDING - Manual Verification**: 
        *   Test the Google Sign-In and Email/Password login flows.
        *   Confirm the `/prepare` route correctly displays the loading state, then the protected content after login.
        *   Confirm that attempting to access `/prepare` while logged out redirects to `/signin`.
        *   Verify that navigating to a non-existent URL displays the custom 404 page.
