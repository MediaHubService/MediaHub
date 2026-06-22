# MediaHub: Integrated Advertising System Plan

This plan bridges the gap between the Admin Dashboard and the Marketplace, allowing real-time "broadcasts" of featured deals and announcements.

---

## 1. Admin Interface (The Source)
*   **Ad Input Fields**:
    *   `Title`: Catchy headline (e.g., "Flash Sale!").
    *   `Content`: Brief description or call to action.
    *   `Type`: Select between "Banner" (Top of marketplace) or "Card" (Mixed with accounts).
*   **Active Ad Management**: Ability to see current ads and delete them.
*   **Storage**: Use `localStorage` to persist the ad data across the site session.

## 2. Marketplace Integration (The Display)
*   **The Global Banner**: A glowing, glassmorphic bar that appears above the product grid.
*   **Dynamic Injection**: A script will check for ads on page load and render them using a template.
*   **Dismissible**: Users can close the ad, but it will reappear if the admin posts a "Priority" update.

## 3. UI/UX & Animations
*   **Entrance**: GSAP `from` animation with `scale` and `blur` to make the ad "pop" into existence.
*   **Wave Glow**: A continuous CSS linear-gradient animation that "sweeps" across the banner like a scan line.
*   **3D Icon**: A floating 3D megaphone or star icon next to the ad title.

---

## 4. Implementation Steps

### Step 1: Update Admin Logic
Modify the "Broadcast" button in `admin.html` to save an object to `localStorage`:
```json
{
  "title": "...",
  "content": "...",
  "active": true,
  "timestamp": 123456789
}
```

### Step 2: Prepare Marketplace HTML
Add a placeholder container `<div id="ad-broadcast-container"></div>` just above the marketplace grid.

### Step 3: Develop Display Logic in `script.js`
Create `renderAds()` which:
1.  Reads from `localStorage`.
2.  Builds the HTML string with modern styles.
3.  Applies the "Aurora sweep" light effect.
4.  Animates the entrance using GSAP.

### Step 4: Admin "Delete" functionality
Allow the admin to clear all active ads, which instantly removes them for all users (on next refresh/navigation).
