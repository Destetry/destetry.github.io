document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SETUP LENIS (Smooth Scroll) ---
    const lenis = new Lenis();

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // --- 2. INTRO SEQUENCE ---
    const introOverlay = document.getElementById('intro-overlay');
    const counter = document.getElementById('counter');
    const wakeBtn = document.getElementById('wake-btn');
    const mainContent = document.getElementById('main-content');
    const loaderContent = document.querySelector('.loader-content');

    // Bloquer le scroll au début
    document.body.style.overflow = 'hidden';

    // Animation Compteur (Vanilla JS + GSAP)
    let countObj = { val: 0 };
    
    gsap.to(countObj, {
        val: 99,
        duration: 2.5,
        ease: "power1.inOut",
        onUpdate: () => {
            counter.innerText = Math.round(countObj.val);
        },
        onComplete: () => {
            // Afficher le bouton quand c'est fini
            gsap.to(loaderContent, { y: -20, duration: 0.5 });
            wakeBtn.style.display = 'block';
            gsap.from(wakeBtn, { opacity: 0, y: 10, duration: 0.5 });
        }
    });

    // Clic sur le bouton WAKE UP
    wakeBtn.addEventListener('click', () => {
        
        // Effet CRT (Ecrasement)
        gsap.to(introOverlay, {
            scaleY: 0.005,
            scaleX: 1,
            duration: 0.2,
            ease: "power2.in",
            onComplete: () => {
                // Ligne blanche
                introOverlay.style.background = '#FFFFFF';
                introOverlay.innerHTML = ''; // Vide le contenu
                
                gsap.to(introOverlay, {
                    scaleX: 0,
                    duration: 0.1,
                    delay: 0.1,
                    onComplete: () => {
                        introOverlay.style.display = 'none';
                        document.body.style.overflow = ''; // Réactiver scroll
                        
                        // Apparition du site
                        mainContent.style.opacity = 1;
                        gsap.from("h1", { y: 50, opacity: 0, duration: 1, delay: 0.2 });
                        
                        // Lancer le typewriter
                        startTypewriter();
                    }
                });
            }
        });
    });

    // --- 3. TYPEWRITER EFFECT ---
    function startTypewriter() {
        const text = "Je code, je filme et je crée.";
        const container = document.getElementById('typewriter');
        let i = 0;
        
        function type() {
            if (i < text.length) {
                container.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 50);
            }
        }
        type();
    }

    // --- 4. KONAMI CODE (EASTER EGG) ---
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let cursor = 0;
    const easterEggDiv = document.getElementById('easter-egg');

    document.addEventListener('keydown', (e) => {
        if (e.key === code[cursor]) {
            cursor++;
        } else {
            cursor = 0; // Reset si erreur
        }

        if (cursor === code.length) {
            triggerEasterEgg();
            cursor = 0;
        }
    });

    function triggerEasterEgg() {
        easterEggDiv.style.display = 'flex';
        // Cache le message après 3 secondes
        setTimeout(() => {
            easterEggDiv.style.display = 'none';
        }, 3000);
    }
    
    // --- 5. ANIMATIONS AU SCROLL (GSAP ScrollTrigger) ---
    // Enregistrer le plugin
    gsap.registerPlugin(ScrollTrigger);

    // Animer les sections quand elles entrent dans la vue
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%", // Démarre quand le haut de la section est à 80% du bas de l'écran
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });
    });

});