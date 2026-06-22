# MediaHub Admin Panel: Advanced Development Plan

This document outlines the architecture, security, and UI/UX design for the hidden MediaHub Admin Dashboard.

---

## 1. Security & Access Control
### Secret Entrance Mechanism
*   **The Code**: `ENNY5969@@`
*   **Implementation**: A global keyboard listener will track user input. When the exact sequence is typed, the `admin.html` portal will be revealed via a high-end GSAP "portal" animation.
*   **Session Lock**: Once entered, the admin state will be saved in `sessionStorage` to allow navigation between admin modules without re-typing.

## 2. Admin Features (The Command Center)

### A. User Management Module
*   **Real-time Table**: View all registered users (Name, Email, Join Date, Status).
*   **Action Suite**:
    *   `Block`: Completely revokes login access.
    *   `Restrict`: Limits the user to "View Only" (no purchases).
    *   `Reset`: Force password reset or clear suspicious activity.

### B. Advertising & Broadcast System
*   **Ad Creator**: A specialized form to post site-wide banners or featured listings.
*   **Placement**: Toggle ads on Hero section, Marketplace sidebar, or as a "Hot Deal" popup.
*   **Analytics**: Simple view count for each posted advert.

### C. Service Mode (The "Kill Switch")
*   **Global Toggle**: A prominent, glassmorphic toggle switch in the dashboard.
*   **On-State Effect**: 
    *   Sets a `service_mode` flag in `localStorage` (simulating a DB flag).
    *   Triggers a **Global Overlay** for all regular users.
    *   The overlay will feature a 3D spinning MediaHub logo and a message: *"We are currently upgrading our systems. Please check back shortly."*
    *   All navigation and purchase buttons are disabled for users.

---

## 3. UI/UX Design Strategy

### Visual Identity
*   **Theme**: "Elite Dark" - Darker than the main site (`#050505`) with **Electric Purple** and **Cyan** accents.
*   **Wave Light Effect**: The dashboard background will feature a continuous, slow-moving "Aurora" wave effect using Three.js or CSS canvas.
*   **Glassmorphism 2.0**: All control panels will have a `backdrop-filter: blur(40px)` with a very thin, glowing border.

### 3.D Animations (Three.js)
*   **Dashboard Centerpiece**: A floating, wireframe 3D sphere that reacts to mouse movement, symbolizing the global network.
*   **Service Mode Visual**: A heavy, red-pulsing 3D "Security Shield" appearing on the user-side when locked.

---

## 4. Implementation Steps

1.  **Phase 1**: Create `admin.html` with the hidden entrance logic.
2.  **Phase 2**: Build the Dashboard UI with User and Ad management.
3.  **Phase 3**: Implement the "Service Mode" global logic and UI overlay.
4.  **Phase 4**: Add the "Aurora" wave light effects and GSAP transitions.
