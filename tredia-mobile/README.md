# Tredia Mobile

This is the official Tredia mobile application, built with Expo and React Native.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd tredia-mobile
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Application

-   **Start the development server:**
    ```bash
    npx expo start
    ```
    This will open the Expo developer tools in your browser. You can then scan the QR code with the Expo Go app on your iOS or Android device to run the app.

### Building for Production

EAS Build is configured with three profiles: `development`, `preview`, and `production`.

-   **Create a development build:**
    ```bash
    eas build -p android --profile development
    # or
    eas build -p ios --profile development
    ```
-   **Create a preview build for internal distribution:**
    ```bash
    eas build -p android --profile preview
    # or
    eas build -p ios --profile preview
    ```
-   **Create a production build for the app stores:**
    ```bash
    eas build -p android --profile production
    # or
    eas build -p ios --profile production
    ```

### Submitting to App Stores

A `submit` profile is configured for streamlined submissions.

-   **Submit to the Apple App Store:**
    ```bash
    eas submit -p ios --profile production
    ```
-   **Submit to the Google Play Store:**
    ```bash
    eas submit -p android --profile production
    ```

## Project Structure

-   `src/`: Contains all the application source code.
    -   `components/`: Reusable UI components.
    -   `design/`: Design tokens and theme configuration.
    -   `lib/`: Mock data and API helpers.
    -   `navigation/`: Navigation setup (navigators, routes).
    -   `screens/`: Application screens.
-   `eas.json`: Configuration for Expo Application Services (EAS) builds.
-   `app.json`: Application configuration for Expo.
-   `tailwind.config.js`: Configuration for NativeWind/Tailwind CSS.
