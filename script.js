// ===========================
// Google Analytics Helper
// ===========================
function trackEvent(eventName, params = {}) {
    if (typeof gtag === "function") {
        gtag("event", eventName, params);
    }
}



// --- Existing Routes Logic ---
const btn = document.getElementById("toggleRoutes");
const slider = document.getElementById("expeditionsSlider");

if (btn && slider) {
    btn.addEventListener("click", () => {
        slider.classList.toggle("expanded");

        if(slider.classList.contains("expanded")){
            btn.textContent = "SHOW LESS ←";
        } else {
            btn.textContent = "VIEW ALL ROUTES →";
            slider.scrollTo({
                left: 0,
                behavior: "smooth"
            });
        }
    });
}

// --- Page-by-Page Slider Logic ---
const reviewContainer = document.getElementById('reviewContainer');
const pageNumbers = document.querySelectorAll('.page-num');
const cards = document.querySelectorAll('.review-card');

// --- True Seamless Infinite Slider Logic ---
let isScrolling = false; // Prevents fast double-clicks from breaking the aesthetic loop

function scrollReviews(direction) {
    if (isScrolling) return; 
    
    const reviewContainer = document.getElementById('reviewContainer');
    const track = reviewContainer.querySelector('.reviews-track');
    const singleCard = track.querySelector('.review-card');
    
    
    if (!reviewContainer || !singleCard) return;

    // Calculate exact step size (Card Width + CSS Gap)
    const scrollStep = singleCard.clientWidth + 24; 

    if (direction === 1) { 
        // ➡️ NEXT BUTTON LOGIC
        isScrolling = true;
        
        // 1. Smoothly slide to the next card
        reviewContainer.scrollTo({ 
            left: reviewContainer.scrollLeft + scrollStep, 
            behavior: 'smooth' 
        });

        // 2. The Illusion: Once the scroll finishes, move the first card to the back
        setTimeout(() => {
            track.appendChild(track.firstElementChild); // Moves the actual HTML element
            
            // Instantly pull the scrollbar backwards. The user sees absolutely no movement!
            reviewContainer.scrollTo({ 
                left: reviewContainer.scrollLeft - scrollStep, 
                behavior: 'auto' // 'auto' means instant snap, no animation
            });
            
            isScrolling = false;
        }, 500); // 500ms allows the native smooth scroll to finish gracefully

    } else {
        // ⬅️ PREV BUTTON LOGIC
        isScrolling = true;
        
        // 1. The Illusion: Before we even scroll, move the last card to the very front
        track.prepend(track.lastElementChild);
        
        // Instantly push the scrollbar forward so the current screen doesn't jitter
        reviewContainer.scrollTo({ 
            left: reviewContainer.scrollLeft + scrollStep, 
            behavior: 'auto' 
        });

        // 2. Give the browser a microsecond to register the new DOM, then slide back smoothly
        requestAnimationFrame(() => {
            reviewContainer.scrollTo({ 
                left: reviewContainer.scrollLeft - scrollStep, 
                behavior: 'smooth' 
            });
            
            setTimeout(() => {
                isScrolling = false;
            }, 500);
        });
    }
}

function highlightCenterCard() {
    // Add this line inside the function so it always sees the new HTML order!
    const liveCards = document.querySelectorAll('.review-card'); 
    
    let minDistance = Infinity;
    let centerCard = null;

    const containerCenter = reviewContainer.getBoundingClientRect().left + (reviewContainer.clientWidth / 2);

    liveCards.forEach(card => {
        const cardCenter = card.getBoundingClientRect().left + (card.clientWidth / 2);
        const distance = Math.abs(containerCenter - cardCenter);

        if (distance < minDistance) {
            minDistance = distance;
            centerCard = card;
        }
    });

    liveCards.forEach(card => card.classList.remove('active-center'));
    if (centerCard) {
        centerCard.classList.add('active-center');
    }
}

// Trigger the function whenever the container scrolls (works for buttons & touch)
reviewContainer.addEventListener('scroll', highlightCenterCard);

// Run it once immediately so the initial middle card gets the styling on load
window.addEventListener('DOMContentLoaded', highlightCenterCard);



// Automatically monitors and highlights active pagination indicators
if (reviewContainer) {
    reviewContainer.addEventListener('scroll', () => {
        const pageWidth = reviewContainer.clientWidth + 24;
        let currentPage = Math.round(reviewContainer.scrollLeft / pageWidth);
        
        pageNumbers.forEach((num, i) => {
            num.classList.toggle('active', i === currentPage);
        });
    });
}

// --- Read More / Expand Handler ---
function toggleReview(button) {
    const card = button.closest('.review-card');
    card.classList.toggle('is-expanded');
    
    if (card.classList.contains('is-expanded')) {
        button.textContent = 'Read Less';
    } else {
        button.textContent = 'Read More';
    }
}

// --- CRITICAL BINDINGS: Expose functions globally to fix HTML inline scope bugs ---
window.scrollReviews = scrollReviews;
    // window.goToReview = goToReview;
window.toggleReview = toggleReview;

// --- Mobile Swipe Indicator Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const handleSwipeHint = (containerId, hintId) => {
        const container = document.getElementById(containerId);
        const hint = document.getElementById(hintId);
        
        if (container && hint) {
            // Dismiss hint on first scroll interaction (user discovered swipe)
            container.addEventListener('scroll', () => {
                hint.classList.add('hidden');
            }, { once: true });
            
            // Also dismiss if user explicitly clicks/taps the hint
            hint.addEventListener('click', () => {
                hint.classList.add('hidden');
            }, { once: true });
        }
    };

    handleSwipeHint('expeditionContainer', 'expeditionsSwipeHint');
    handleSwipeHint('reviewContainer', 'reviewsSwipeHint');
});

// upcoming
function scrollExpeditions(direction) {
    const container = document.getElementById('expeditionContainer');
    
    // Find the width of one full group (window)
    const group = container.querySelector('.expedition-group');
    const groupWidth = group.offsetWidth;
    const gap = 40; // Match this with the .expeditions-track gap
    
    // Scroll by 1 full group at a time
    const scrollAmount = (groupWidth + gap) * direction;

    container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

// navbar magic
document.addEventListener('DOMContentLoaded', () => {
    // Select all sections that have an ID, and all navigation links
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Configure the observer
    const observerOptions = {
        root: null,
        // This margin creates a specific "trigger zone" in the middle of your screen
        rootMargin: '-20% 0px -70% 0px', 
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove 'active' class from all links
                navLinks.forEach(link => link.classList.remove('active'));

                // Find the corresponding link and add 'active' class
                const activeId = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-links a[href="#${activeId}"]`);
                
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    // Tell the observer to watch all sections
    sections.forEach(section => {
        observer.observe(section);
    });

    // --- Hamburger Menu Toggle ---
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinksEl = document.getElementById('navLinks');

    if (hamburgerBtn && navLinksEl) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            navLinksEl.classList.toggle('open');
        });

        // Close menu when a nav link is clicked (for smooth scroll + close)
        navLinksEl.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                navLinksEl.classList.remove('open');
            });
        });
    }
});

// stars/glitter background
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('glitter-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // 1. Setup Scene, Camera, and Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // High performance

    // 2. Generate Noise Texture (Exactly like the React code)
    function generateNoiseTexture(size = 512) {
        const data = new Uint8Array(size * size * 4);
        for (let i = 0; i < size * size; i++) {
            const stride = i * 4;
            data[stride] = Math.random() * 255;     // r
            data[stride + 1] = Math.random() * 255; // g
            data[stride + 2] = Math.random() * 255; // b
            data[stride + 3] = 255;                 // a
        }
        const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.needsUpdate = true;
        return texture;
    }

    const noiseTexture = generateNoiseTexture(512);

    // 3. The Shaders
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float iTime;
      uniform vec2 iResolution;
      uniform sampler2D iChannel0;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;
        float result = 0.0;
        result += texture2D(iChannel0, uv * 1.1 + vec2(iTime * -0.005)).r;
        result *= texture2D(iChannel0, uv * 0.9 + vec2(iTime * 0.005)).g;
        result = pow(result, 12.0);
        gl_FragColor = vec4(vec3(5.0) * result, 1.0);
      }
    `;

    // 4. Create Material and Mesh
    const material = new THREE.ShaderMaterial({
        uniforms: {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            iChannel0: { value: noiseTexture }
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        side: THREE.DoubleSide
    });

    const geometry = new THREE.PlaneGeometry(10, 10);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // 5. Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
    });

    // 6. Animation Loop
    const clock = new THREE.Clock();
    const speed = 1.0; // Adjust speed here

    function animate() {
        requestAnimationFrame(animate);
        material.uniforms.iTime.value = clock.getElapsedTime() * speed;
        renderer.render(scene, camera);
    }

    animate();
});

// Preloader trigger
// Wait for the full page to load
window.addEventListener('load', () => {
    const loader = document.getElementById('minimal-loader');

    if (!loader) return;

    // Start fade-out immediately
    loader.classList.add('fade-out');

    // Remove loader after fade animation completes
    loader.addEventListener('transitionend', () => {
        loader.remove();
    }, { once: true });
});

// Custom cursor logic
// Only execute custom cursor logic if the user is on a desktop/device with a mouse
if (window.matchMedia("(pointer: fine)").matches) {
    const cursorDot = document.querySelector("[data-cursor-dot]");
    const cursorOutline = document.querySelector("[data-cursor-outline]");
    
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    window.addEventListener("mousemove", function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Update CSS variables instead of inline styles to prevent animation conflicts
        cursorDot.style.setProperty('--x', `${mouseX}px`);
        cursorDot.style.setProperty('--y', `${mouseY}px`);
    });

    function animateCursor() {
        // Smooth delay calculation
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        
        cursorOutline.style.setProperty('--x', `${outlineX}px`);
        cursorOutline.style.setProperty('--y', `${outlineY}px`);
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hide/Show cursor seamlessly when leaving/entering the window
    document.addEventListener("mouseleave", function () {
        cursorDot.style.opacity = "0";
        cursorOutline.style.opacity = "0";
    });

    document.addEventListener("mouseenter", function () {
        cursorDot.style.opacity = "1";
        cursorOutline.style.opacity = "1";
    });
}

// Your expedition scrolling logic remains perfect as is
function scrollExpeditions(direction) {
    const container = document.getElementById('expeditionContainer');
    if (!container) return;
    
    const isMobile = window.innerWidth <= 768;
    let scrollAmount = 0;

    if (isMobile) {
        const singleCard = container.querySelector('.featured-card');
        const gap = 12; 
        scrollAmount = (singleCard.offsetWidth + gap) * direction;
    } else {
        const group = container.querySelector('.expedition-group');
        const gap = 40; 
        scrollAmount = (group.offsetWidth + gap) * direction;
    }

    container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

// upcoming whatsapp mssg 

function openWhatsApp(trekName) {
        // Your target WhatsApp number
        const phoneNumber = "919561636900"; 
        
        // The dynamic message template
        const message = `Hi 2StepsBeyond, I want details regarding ${trekName} & upcoming batch for the same !`;
        
        // encodeURIComponent safely handles spaces, commas, and ampersands
        const encodedMessage = encodeURIComponent(message); 
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        // Opens the chat in a new browser tab
        window.open(whatsappUrl, '_blank');
    }

    function openWhatsApp1(trekName) {
        // Your target WhatsApp number
        const phoneNumber = "919561636900"; 
        
        // The dynamic message template
        const message = `Hi 2StepsBeyond, I want details regarding upcoming batches!`;
        
        // encodeURIComponent safely handles spaces, commas, and ampersands
        const encodedMessage = encodeURIComponent(message); 
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        // Opens the chat in a new browser tab
        window.open(whatsappUrl, '_blank');
    }

     function openWhatsAppBook(trekName) {
        // Your target WhatsApp number
        const phoneNumber = "919561636900"; 
        
        // The dynamic message template
        const message = `Hi 2StepsBeyond, I want to book a seat/seats for ${trekName}!`;
        
        // encodeURIComponent safely handles spaces, commas, and ampersands
        const encodedMessage = encodeURIComponent(message); 
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        // Opens the chat in a new browser tab
        window.open(whatsappUrl, '_blank');
    }

     function openWhatsAppDetails(trekName) {
        // Your target WhatsApp number
        const phoneNumber = "919561636900"; 
        
        // The dynamic message template
        const message = `Hi 2StepsBeyond, I want details regarding upcoming ${trekName}!`;
        
        // encodeURIComponent safely handles spaces, commas, and ampersands
        const encodedMessage = encodeURIComponent(message); 
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        // Opens the chat in a new browser tab
        window.open(whatsappUrl, '_blank');
    }

    // pop-up logic 
    document.addEventListener("DOMContentLoaded", () => {
    const popupOverlay = document.getElementById("trekPopupOverlay");

    // 1. Auto-show gracefully after 2 seconds
    setTimeout(() => {
        if (popupOverlay) {
            popupOverlay.classList.add("show-popup");
        }
    }, 2000);

    // 2. Centralized Click Delegation
    document.addEventListener("click", (e) => {
        
        // Check if ANY of our triggers (Desktop link OR Mobile icon) was clicked
        const showBtn = e.target.closest(".trek-popup-trigger");
        if (showBtn) {
            e.preventDefault();
            if (popupOverlay) popupOverlay.classList.add("show-popup");
            return;
        }

        // Close button logic
        const closeBtn = e.target.closest("#closePopup");
        if (closeBtn) {
            e.preventDefault();
            if (popupOverlay) popupOverlay.classList.remove("show-popup");
            return;
        }

        // Click outside to dismiss
        if (popupOverlay && e.target === popupOverlay) {
            popupOverlay.classList.remove("show-popup");
        }
    });
});

