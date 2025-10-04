# Cosmic Scholar - Space Biology Search Engine

Welcome to Cosmic Scholar, a Next.js web application that serves as a search engine for space biology research papers. This application is built with Next.js, TypeScript, Tailwind CSS, and uses Firebase Firestore for its database.

## Features

-   **Real-time Search**: Instantly search through research papers by title, author, keywords, or year.
-   **Advanced Filtering**: Refine your search with filters for year range and specific keywords.
-   **Responsive Design**: A clean, modern, and fully responsive UI that looks great on all devices.
-   **Keyword Highlighting**: Matching search terms are automatically highlighted in the results.
-   **Dark Mode**: A beautiful, space-themed dark interface.
-   **Firebase Integration**: Built to work seamlessly with Firebase Firestore and Firebase Hosting.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v18 or later)
-   npm, yarn, or pnpm
-   A Firebase account

### 1. Firebase Project Setup

Before running the application, you need to create a Firebase project and set up Firestore.

1.  **Create a Firebase Project**:
    -   Go to the [Firebase Console](https://console.firebase.google.com/).
    -   Click on "Add project" and follow the on-screen instructions to create a new project.

2.  **Set up Firestore**:
    -   In your new project's dashboard, go to the "Build" section in the left-hand menu and click on "Firestore Database".
    -   Click "Create database".
    -   Start in **test mode**. This allows open access for development. For production, you should configure [security rules](https://firebase.google.com/docs/firestore/security/get-started).
    -   Choose a location for your database.

3.  **Import Data into Firestore**:
    -   Navigate to the "Firestore Database" section.
    -   Click on "Start collection".
    -   Enter `papers` as the Collection ID.
    -   Now, you need to add documents. The data is in `src/lib/papers.json`. You can either add them manually or use a script.
    -   **To add manually**: For each object in the `papers.json` array, click "Add document", let Firebase generate a document ID, and then copy-paste the fields (title, link, authors, year, keywords) into the new document.

4.  **Get Firebase Configuration**:
    -   Go to your Project Settings (click the gear icon next to "Project Overview").
    -   Under the "Your apps" tab, click the web icon (`</>`) to create a new web app.
    -   Give your app a nickname and click "Register app".
    -   Firebase will provide you with a `firebaseConfig` object. Copy these keys.

5.  **Set up Environment Variables**:
    -   In the root of your project, create a new file named `.env.local`.
    -   Add the Firebase configuration keys you copied to this file, prefixed with `NEXT_PUBLIC_`:

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
    NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
    ```

    *Note: The application is configured to work with local JSON data out-of-the-box. To switch to Firestore, you will need to modify the data fetching logic in the components.*

### 2. Local Installation & Development

1.  **Clone the repository**:
    ```bash
    git clone &lt;repository-url&gt;
    cd &lt;repository-directory&gt;
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

### 3. Deployment to Firebase Hosting

1.  **Install Firebase CLI**:
    If you don't have it, install it globally:
    ```bash
    npm install -g firebase-tools
    ```

2.  **Login to Firebase**:
    ```bash
    firebase login
    ```

3.  **Initialize Firebase in your project**:
    This step is only needed once.
    ```bash
    firebase init hosting
    ```
    -   When prompted, select "Use an existing project" and choose the Firebase project you created.
    -   What do you want to use as your public directory? Enter `out`. (Next.js static export).
    -   Configure as a single-page app (rewrite all urls to /index.html)? **No**.
    -   Set up automatic builds and deploys with GitHub? **No** (for now).

4.  **Build the application for production**:
    ```bash
    npm run build
    ```

5.  **Deploy to Firebase Hosting**:
    ```bash
    firebase deploy --only hosting
    ```

After deployment, Firebase will give you a URL where your application is live.
