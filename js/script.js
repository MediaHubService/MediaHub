// GSAP Animations
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.animate-text')) {
        gsap.to('.animate-text', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.2
        });
    }

    if (document.querySelector('.animate-text-delay')) {
        gsap.to('.animate-text-delay', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            delay: 0.5,
            stagger: 0.2
        });
    }
});

// Mouse Follower
const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
document.body.appendChild(cursorGlow);

document.addEventListener('mousemove', (e) => {
    gsap.to(cursorGlow, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power2.out'
    });
});

// Three.js 3D Background/Element
const init3D = () => {
    const container = document.getElementById('hero-canvas');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create a 3D Shape (Torus Knot)
    const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16);
    const material = new THREE.MeshPhongMaterial({
        color: 0x00d2ff,
        shininess: 100,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x00d2ff,
        transparent: true,
        opacity: 0.5
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Add lighting
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const blueLight = new THREE.PointLight(0x00d2ff, 2);
    blueLight.position.set(-5, -5, 5);
    scene.add(blueLight);

    camera.position.z = 5;

    // Mouse Interaction for 3D
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);

        torusKnot.rotation.x += 0.01;
        torusKnot.rotation.y += 0.01;

        // Subtle mouse reactivity
        torusKnot.rotation.x += mouseY * 0.1;
        torusKnot.rotation.y += mouseX * 0.1;

        particlesMesh.rotation.y += 0.001;
        if (mouseX > 0) {
            particlesMesh.rotation.x += mouseY * 0.02;
            particlesMesh.rotation.y += mouseX * 0.02;
        }

        renderer.render(scene, camera);
    };

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    animate();
};

if (typeof THREE !== 'undefined') {
    init3D();
}

// 3D Tilt Effect for Cards
const initTilt = () => {
    const cards = document.querySelectorAll('.account-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
};

initTilt();

// Marketplace Filtering
const initMarketplace = () => {
    const tabs = document.querySelectorAll('.tab-btn');
    const cards = document.querySelectorAll('.account-card');
    const searchInput = document.getElementById('searchAccounts');

    if (!tabs.length || !cards.length) return;

    const filterCards = () => {
        const activeTab = document.querySelector('.tab-btn.active').dataset.filter;
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

        cards.forEach(card => {
            const category = card.dataset.category;
            const title = card.querySelector('h3').textContent.toLowerCase();

            const matchesTab = activeTab === 'all' || category === activeTab;
            const matchesSearch = title.includes(searchTerm);

            if (matchesTab && matchesSearch) {
                card.style.display = 'block';
                gsap.fromTo(card, {opacity: 0, scale: 0.9}, {opacity: 1, scale: 1, duration: 0.4});
            } else {
                card.style.display = 'none';
            }
        });
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            filterCards();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', filterCards);
    }

    // Handle Search from URL (for redirects from other pages)
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery && searchInput) {
        searchInput.value = searchQuery;
        filterCards();
    }
};

initMarketplace();

// Global Search Logic
const initGlobalSearch = () => {
    const globalSearch = document.getElementById('globalSearch');
    const heroSearch = document.getElementById('heroSearch');
    const secretCode = "ENNY5969@@";

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            const query = e.target.value.trim();

            if (query === secretCode) {
                sessionStorage.setItem('adminAuth', secretCode);
                // Flash effect
                const flash = document.createElement('div');
                flash.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:white; z-index:9999;';
                document.body.appendChild(flash);

                gsap.to(flash, {
                    opacity: 0,
                    duration: 0.8,
                    onComplete: () => {
                        window.location.href = 'admin.html';
                    }
                });
                return;
            }

            if (query) {
                window.location.href = `marketplace.html?search=${encodeURIComponent(query)}`;
            }
        }
    };

    if (globalSearch) {
        globalSearch.addEventListener('keypress', handleSearch);
    }
    if (heroSearch) {
        heroSearch.addEventListener('keypress', handleSearch);
    }
};

initGlobalSearch();

// Admin Panel Secret Entrance & Service Mode
const initAdminSecurity = () => {
    let inputBuffer = "";
    const secretCode = "ENNY5969@@";

    document.addEventListener('keydown', (e) => {
        inputBuffer += e.key;
        if (inputBuffer.length > secretCode.length) {
            inputBuffer = inputBuffer.substring(inputBuffer.length - secretCode.length);
        }

        if (inputBuffer === secretCode) {
            sessionStorage.setItem('adminAuth', secretCode);
            // Flash effect before redirect
            const flash = document.createElement('div');
            flash.style.position = 'fixed';
            flash.style.top = '0';
            flash.style.left = '0';
            flash.style.width = '100%';
            flash.style.height = '100%';
            flash.style.background = 'white';
            flash.style.zIndex = '9999';
            document.body.appendChild(flash);

            gsap.to(flash, {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    window.location.href = 'admin.html';
                }
            });
        }
    });

    // Service Mode Check
    if (localStorage.getItem('serviceMode') === 'on' && window.location.pathname.indexOf('admin.html') === -1) {
        const overlay = document.createElement('div');
        overlay.id = 'service-mode-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #050507;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            color: white;
            font-family: 'Poppins', sans-serif;
            overflow: hidden;
        `;

        overlay.innerHTML = `
            <!-- 3D Light Effects -->
            <div style="position: absolute; top:0; left:0; width:100%; height:100%; overflow:hidden; z-index:0;">
                <div style="position:absolute; width:600px; height:600px; background:radial-gradient(circle, rgba(255, 71, 87, 0.1) 0%, transparent 70%); top:-200px; left:-200px; filter:blur(80px);"></div>
                <div style="position:absolute; width:800px; height:800px; background:radial-gradient(circle, rgba(0, 210, 255, 0.08) 0%, transparent 70%); bottom:-300px; right:-300px; filter:blur(100px);"></div>
            </div>

            <div style="position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center;">
                <div id="maintenance-3d" style="width: 250px; height: 250px; cursor: grab;"></div>

                <h1 style="font-size: 3.5rem; margin-top: 10px; font-weight: 700; letter-spacing: -2px; text-transform: uppercase;">
                    Upgrade <span style="color: #00d2ff; text-shadow: 0 0 30px rgba(0, 210, 255, 0.5);">Status</span>
                </h1>

                <p style="color: #a0a0a0; max-width: 600px; margin: 20px auto 40px; font-size: 1.1rem; line-height: 1.6; padding: 0 20px;">
                    We are currently recalibrating our systems to provide a more premium marketplace experience.
                    Interactive 3D visuals and security protocols are being enhanced.
                </p>

                <div class="search-container" style="width: 450px; max-width: 90%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 40px; padding: 8px 25px; display: flex; align-items: center; margin-bottom: 40px; backdrop-filter: blur(20px); transition: 0.3s;">
                    <i class="fas fa-search" style="color: #00d2ff; margin-right: 15px; font-size: 1.1rem;"></i>
                    <input type="text" id="maintenanceSearch" placeholder="Searching for something specific? (or bypass code)" style="background:transparent; border:none; color:white; padding: 12px 0; width: 100%; outline:none; font-family: inherit; font-size: 1rem;">
                </div>

                <div style="display: flex; align-items: center; gap: 15px; padding: 15px 35px; background: rgba(255, 71, 87, 0.05); border: 1px solid rgba(255, 71, 87, 0.2); border-radius: 50px; color: #ff4757; font-weight: 600; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 2px; backdrop-filter: blur(5px);">
                    <div style="width: 10px; height: 10px; background: #ff4757; border-radius: 50%; box-shadow: 0 0 15px #ff4757; animation: pulse 2s infinite;"></div>
                    Maintenance Mode Active
                </div>
            </div>

            <style>
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .search-container:focus-within {
                    border-color: #00d2ff !important;
                    background: rgba(0, 210, 255, 0.05) !important;
                    box-shadow: 0 0 30px rgba(0, 210, 255, 0.1);
                }
            </style>
        `;

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        // Add bypass functionality to maintenance search
        const mSearch = overlay.querySelector('#maintenanceSearch');
        if (mSearch) {
            mSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    if (e.target.value.trim() === secretCode) {
                        sessionStorage.setItem('adminAuth', secretCode);
                        window.location.href = 'admin.html';
                    } else {
                        // Shake effect for wrong code
                        gsap.to('.search-container', { x: 10, duration: 0.1, repeat: 3, yoyo: true });
                    }
                }
            });
        }
    }
};

// Admin Aurora Wave Effect
const initAdminWaves = () => {
    const container = document.getElementById('wave-canvas');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(20, 10, 50, 50);
    const material = new THREE.MeshPhongMaterial({
        color: 0x00d2ff,
        wireframe: true,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2.5;
    scene.add(plane);

    const light = new THREE.PointLight(0x00d2ff, 1);
    light.position.set(0, 5, 5);
    scene.add(light);

    camera.position.z = 5;

    const animate = () => {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.001;
        const positions = plane.geometry.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            positions[i + 2] = Math.sin(x + time) * 0.5 + Math.cos(y + time) * 0.5;
        }
        plane.geometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
    };

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
};

initAdminWaves();

// Maintenance 3D Animation
const initMaintenance3D = () => {
    const container = document.getElementById('maintenance-3d');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(250, 250);
    container.appendChild(renderer.domElement);

    // Group for complex animation
    const group = new THREE.Group();
    scene.add(group);

    // Outer Octahedron (Security Shield Style)
    const geometry = new THREE.OctahedronGeometry(1.5, 0);
    const material = new THREE.MeshPhongMaterial({
        color: 0xff4757,
        wireframe: true,
        emissive: 0xff4757,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.6
    });
    const outerMesh = new THREE.Mesh(geometry, material);
    group.add(outerMesh);

    // Inner Core (Data Node)
    const innerGeo = new THREE.IcosahedronGeometry(0.7, 0);
    const innerMat = new THREE.MeshPhongMaterial({
        color: 0x00d2ff,
        emissive: 0x00d2ff,
        emissiveIntensity: 0.8,
        shininess: 100
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    group.add(innerMesh);

    // Lighting
    const light1 = new THREE.PointLight(0xff4757, 5, 10);
    light1.position.set(2, 2, 2);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x00d2ff, 5, 10);
    light2.position.set(-2, -2, 2);
    scene.add(light2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    camera.position.z = 4;

    // Interaction Variables
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;

    container.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - previousMouseX;
            const deltaY = e.clientY - previousMouseY;
            group.rotation.y += deltaX * 0.01;
            group.rotation.x += deltaY * 0.01;
        }
        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
    });

    const animate = () => {
        requestAnimationFrame(animate);

        if (!isDragging) {
            outerMesh.rotation.x += 0.01;
            outerMesh.rotation.y += 0.01;
            innerMesh.rotation.x -= 0.02;
            innerMesh.rotation.y -= 0.02;

            // Floating effect
            group.position.y = Math.sin(Date.now() * 0.002) * 0.2;
        }

        renderer.render(scene, camera);
    };
    animate();
};

// Delay check for maintenance container
setTimeout(initMaintenance3D, 100);

// Helper for Ad colors
const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
};

// Ad Rendering System
const initAds = () => {
    const container = document.getElementById('ad-broadcast-container');
    if (!container) return;

    const ads = JSON.parse(localStorage.getItem('mediahub_ads') || '[]');
    if (ads.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.innerHTML = '';
    ads.forEach(ad => {
        const adEl = document.createElement('div');
        adEl.className = 'ad-banner animate-text';
        adEl.style.marginBottom = '25px';

        // Brand logic
        let brandColor = '#00d2ff';
        let brandIcon = 'fa-bullhorn';

        switch(ad.platform) {
            case 'instagram': brandColor = '#E1306C'; brandIcon = 'fa-brands fa-instagram'; break;
            case 'tiktok': brandColor = '#00f2ea'; brandIcon = 'fa-brands fa-tiktok'; break;
            case 'youtube': brandColor = '#FF0000'; brandIcon = 'fa-brands fa-youtube'; break;
            case 'twitter': brandColor = '#1DA1F2'; brandIcon = 'fa-brands fa-twitter'; break;
            default: brandColor = '#00d2ff'; brandIcon = 'fa-bullhorn';
        }

        adEl.style.background = `rgba(${hexToRgb(brandColor)}, 0.05)`;
        adEl.style.borderColor = `rgba(${hexToRgb(brandColor)}, 0.2)`;
        adEl.style.setProperty('--primary-color', brandColor);

        adEl.innerHTML = `
            <div style="display: flex; gap: 30px; align-items: stretch; position: relative;">
                <!-- Left Side: Profile Circle Style -->
                <div style="flex: 0 0 200px; text-align: center; border-right: 1px solid rgba(255,255,255,0.1); padding-right: 30px;">
                    <div style="width: 100px; height: 100px; margin: 0 auto 15px; border: 2px solid ${brandColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: ${brandColor}; box-shadow: 0 0 20px ${brandColor}44;">
                        <i class="${brandIcon}"></i>
                    </div>
                    <h3 style="margin: 0; font-size: 1.2rem; color: white;">${ad.title}</h3>
                    <p style="color: ${brandColor}; text-transform: uppercase; font-size: 0.8rem; font-weight: 700; margin: 5px 0;">${ad.platform}</p>
                    <h2 style="margin: 10px 0 0; font-size: 1.8rem;">${ad.price || '$0'}</h2>
                </div>

                <!-- Right Side: Account Insights Style -->
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 15px; color: white; font-size: 1.1rem;">Account Insights <span style="font-weight: 400; font-size: 0.8rem; color: var(--text-gray); display: block;">Featured Listing Details</span></h4>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                            <span style="display: block; color: var(--text-gray); font-size: 0.75rem;">Followers</span>
                            <strong style="color: ${brandColor}; font-size: 1.1rem;">${ad.followers || 'N/A'}</strong>
                        </div>
                        <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                            <span style="display: block; color: var(--text-gray); font-size: 0.75rem;">Verification</span>
                            <strong style="color: ${ad.verified ? '#00ff88' : '#fff'}; font-size: 1.1rem;">${ad.verified ? 'Verified' : 'Non-Verified'}</strong>
                        </div>
                        <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                            <span style="display: block; color: var(--text-gray); font-size: 0.75rem;">Engagement</span>
                            <strong style="color: ${brandColor}; font-size: 1.1rem;">${ad.engagement || '0%'}</strong>
                        </div>
                        <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                            <span style="display: block; color: var(--text-gray); font-size: 0.75rem;">Niche</span>
                            <strong style="color: ${brandColor}; font-size: 1.1rem;">${ad.niche || 'General'}</strong>
                        </div>
                    </div>

                    <div style="margin-top: 20px; display: flex; align-items: center; justify-content: space-between;">
                        <button class="btn-primary" style="padding: 10px 25px; border-radius: 30px; font-size: 0.9rem;">Secure Purchase Now</button>
                        <p style="font-size: 0.7rem; color: var(--text-gray); margin: 0;"><i class="fas fa-shield-alt"></i> MediaHub Protected</p>
                    </div>
                </div>
            </div>
            <span class="close-ad" style="position:absolute; top:15px; right:15px; cursor:pointer; opacity:0.3; font-size: 1.2rem;">&times;</span>
        `;

        adEl.querySelector('.close-ad').addEventListener('click', () => {
            gsap.to(adEl, {
                height: 0,
                opacity: 0,
                marginBottom: 0,
                paddingTop: 0,
                paddingBottom: 0,
                duration: 0.5,
                onComplete: () => adEl.remove()
            });
        });

        container.appendChild(adEl);
    });

    // Animate ads
    gsap.from('.ad-banner', {
        opacity: 0,
        y: 20,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
    });
};

initAds();

// Modal Logic
const initModal = () => {
    const modal = document.getElementById('accountModal');
    const openBtns = document.querySelectorAll('.open-modal');
    const closeBtns = document.querySelectorAll('.close-modal');
    const purchaseBtn = document.getElementById('purchaseBtn');
    const modalActionContainer = document.getElementById('modalActionContainer');
    const successState = document.getElementById('successState');

    if (!modal || !openBtns.length) return;

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';

        // Reset modal state after it's hidden to prevent glitching on re-open
        setTimeout(() => {
            if (modalActionContainer && successState) {
                modalActionContainer.style.display = 'block';
                modalActionContainer.style.opacity = '1';
                modalActionContainer.style.transform = 'translateY(0)';
                successState.style.display = 'none';
                if (purchaseBtn) {
                    purchaseBtn.disabled = false;
                    purchaseBtn.style.opacity = '1';
                    purchaseBtn.innerHTML = 'Secure Purchase Now';
                }
            }
        }, 400);
    };

    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.account-card');
            if (!card) return;

            // Extract data from card
            const titleElement = card.querySelector('h3');
            const priceElement = card.querySelector('.price');
            const category = card.dataset.category;
            const iconElement = card.querySelector('.account-header i');
            const statsSpans = card.querySelectorAll('.stats span');

            if (titleElement && priceElement && iconElement && statsSpans.length >= 2) {
                const title = titleElement.childNodes[0].textContent.trim();
                const price = priceElement.textContent;
                const iconClass = iconElement.className;
                const followers = statsSpans[0].textContent.replace(' Followers', '');
                const verified = statsSpans[1].textContent;

                // Populate Modal
                document.getElementById('modalTitle').textContent = title;
                document.getElementById('modalPrice').textContent = price;
                document.getElementById('modalCategory').textContent = category;
                document.getElementById('modalIcon').className = iconClass;
                document.getElementById('modalFollowers').textContent = followers;
                document.getElementById('modalVerified').textContent = verified;

                // Apply icon color based on category
                const icon = document.getElementById('modalIcon');
                if (category === 'instagram') icon.style.color = '#E1306C';
                else if (category === 'twitter') icon.style.color = '#1DA1F2';
                else if (category === 'youtube') icon.style.color = '#FF0000';
                else icon.style.color = '#fff';
            }

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Purchase Flow
    if (purchaseBtn) {
        purchaseBtn.addEventListener('click', () => {
            purchaseBtn.disabled = true;
            purchaseBtn.style.opacity = '0.7';
            purchaseBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Securing Transaction...';

            setTimeout(() => {
                gsap.to(modalActionContainer, {
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.4,
                    onComplete: () => {
                        modalActionContainer.style.display = 'none';
                        successState.style.display = 'block';

                        gsap.fromTo(successState,
                            { opacity: 0 },
                            { opacity: 1, duration: 0.4, ease: 'power2.out' }
                        );

                        // Success light effect
                        const orb = document.querySelector('.orb-1');
                        if (orb) {
                            gsap.to(orb, {
                                background: '#00ff88',
                                scale: 1.2,
                                duration: 0.8,
                                yoyo: true,
                                repeat: 1
                            });
                        }
                    }
                });
            }, 1500);
        });
    }
};

initModal();
initAdminSecurity();
