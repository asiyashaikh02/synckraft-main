# Local Testing Guide: Synckraft CRM

Follow these steps to run and test the Synckraft CRM project on your local machine.

## Prerequisites
- **Node.js**: v18 or higher (Recommended: v20+)
- **npm**: v9 or higher
- **Git**: Installed and configured

## Setup Instructions

1. **Clone the Repository** (If testing from a fresh clone):
   ```bash
   git clone https://github.com/asiyashaikh02/synckraft-main.git
   cd synckraft-main
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Ensure you have a [.env](file:///h:/ALL%20PROJECTS/synckraft-crm-mvp%20%281%29/.env) file in the root directory with the following variables (provided by your Firebase project):
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=synckraft-crm-9d193
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   The application will be available at: `http://localhost:3000`

## Testing Scenarios

### 1. Master Admin Login
- **URL**: `http://localhost:3000/login`
- **Credentials**: 
  - **Email**: `asiya@synckraft.in`
  - **Password**: (Use your established administrative password)
- **What to verify**:
  - You should be redirected to `/admin-dashboard`.
  - You should see the "Master Dashboard" with summary cards and charts.
  - Sidebar links like "User Approvals" and "System Settings" should be visible.

### 2. New User Signup (Role & Status Test)
- **URL**: `http://localhost:3000/register`
- **Steps**:
  - Register with a new email (e.g., `test-user@example.com`).
  - Choose any role (e.g., Sales User).
- **What to verify**:
  - You should be redirected to the "Account Pending Approval" screen.
  - You should **NOT** be able to see the dashboard or any sidebar links.
  - In the Firebase Console (Firestore), the user's status should be `PENDING`.

### 3. Session Persistence & Logout
- **Steps**:
  - Log in as an admin.
  - Refresh the page.
  - **Verify**: You should remain logged in.
  - Click the profile icon -> "Sign Out".
  - **Verify**: You should be redirected to `/login` and unable to access `/admin-dashboard` via direct URL.

### 4. Responsive Design
- Open browser developer tools (F12) and toggle the device toolbar (Ctrl+Shift+M).
- **Verify**:
  - **Mobile (375px)**: The sidebar should hide automatically. A menu button appears in the top header to toggle it.
  - **Tablet (768px)**: The layout adjusts smoothly without horizontal scrolling.
