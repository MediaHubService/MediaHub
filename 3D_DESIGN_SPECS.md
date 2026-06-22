# MediaHub 3D & UI/UX Design Specifications

## 1. Interactive 3D Elements (Three.js)
*   **Hero Object**: A high-poly Torus Knot with wireframe overlay and Phong material for realistic light reflection.
*   **Particle System**: 500+ floating dynamic particles creating a "digital ether" background effect.
*   **Mouse Reactivity**: 3D objects rotate and tilt based on real-time cursor coordinates, creating an immersive parallax effect.

## 2. Dynamic Light Effects
*   **Cursor Glow**: A 400px radial gradient that follows the user's mouse, illuminating the "glass" cards as they move.
*   **Background Orbs**: Three large, animated blurred orbs with varying primary/secondary colors that move in a non-linear floating pattern.
*   **Glassmorphism**: High-blur (20px) backdrops on navigation and cards to simulate frosted glass.

## 3. Marketplace Interface (Advance UI)
*   **3D Tilt Cards**: Every account listing uses `transform-style: preserve-3d` to tilt toward the mouse.
*   **Layered Depth**: Content inside the cards (icons, price, buttons) are pushed forward on the Z-axis (`translateZ`) to create real physical depth.
*   **Smooth Filtering**: GSAP-powered transitions for filtering categories, ensuring no "stutter" when browsing.

## 4. Animation Engine
*   **GSAP (GreenSock)**: Handles all heavy-lifting for smooth interface animations.
*   **CSS Keyframes**: Handles ambient, low-CPU background movements for the light orbs.
*   **RequestAnimationFrame**: Optimizes the Three.js render loop for 60FPS performance.
