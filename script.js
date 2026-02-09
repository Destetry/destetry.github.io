
window.onload = function() {
    
    console.log("✅ Page et Scripts chargés.");

    try {
        if (typeof Lenis !== 'undefined') {
            const lenis = new Lenis();
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
            console.log("✅ Scroll Fluide activé.");
        } else {
            console.warn("⚠️ Lenis n'a pas chargé (problème CDN), mais le site continue.");
        }
    } catch (error) {
        console.error("Erreur Lenis ignorée pour ne pas bloquer l'intro:", error);
    }

    const introOverlay = document.getElementById('intro-overlay');
    const counter = document.getElementById('counter');
    const wakeBtn = document.getElementById('wake-btn');
    const mainContent = document.getElementById('main-content');
    const loaderContent = document.querySelector('.loader-content');

    if (!introOverlay || !counter) {
        console.error("❌ ERREUR HTML : Il manque des ID (intro-overlay ou counter).");
        return; 
    }

    document.body.style.overflow = 'hidden';

    let countObj = { val: 0 };
    
    if (typeof gsap === 'undefined') {
        alert("GSAP ne charge pas. Vérifie ta connexion internet.");
        introOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        mainContent.style.opacity = 1;
        return;
    }

    gsap.to(countObj, {
        val: 100,
        duration: 2.5,
        ease: "power2.inOut",
        onUpdate: () => {
            counter.innerText = Math.round(countObj.val);
        },
        onComplete: () => {
            gsap.to(loaderContent, { y: -20, duration: 0.5 });
            if(wakeBtn) {
                wakeBtn.style.display = 'block';
                gsap.from(wakeBtn, { opacity: 0, y: 10, duration: 0.5 });
            }
        }
    });

    if (wakeBtn) {
        wakeBtn.addEventListener('click', () => {
            const tl = gsap.timeline();

            tl.to(introOverlay, {
                scaleY: 0.005,
                scaleX: 1,
                duration: 0.2,
                ease: "power2.in"
            })
            .to(introOverlay, {
                width: "100%",
                height: "2px",
                background: "#FFFFFF",
                duration: 0.1,
                onStart: () => { introOverlay.innerHTML = ''; }
            })
            .to(introOverlay, {
                scaleX: 0,
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                    introOverlay.style.display = 'none';
                    document.body.style.overflow = ''; 
                    mainContent.style.opacity = 1;
                    
                    gsap.from("h1", { y: 50, opacity: 0, duration: 1 });
                    startTypewriter();
                }
            });
        });
    }

// Cherche la fonction startTypewriter et remplace par :
function startTypewriter() {
    // On met en avant ton profil Créatif / Vidéo / Drone / Com
    const text = "Vidéaste, Pilote Drone & Communicant."; 
    const container = document.getElementById('typewriter');
    if(!container) return;
    
    let i = 0;
    function type() {
        if (i < text.length) {
            container.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 80);
        }
    }
    type();
}
    
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            });
        });
    }

// --- 5. SYSTÈME DE FILTRES PROJETS ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 1. Gérer la classe active sur les boutons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 2. Récupérer le filtre
            const filterValue = btn.getAttribute('data-filter');

            // 3. Animer les cartes
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || filterValue === category) {
                    // Afficher
                    gsap.to(card, {
                        display: 'block',
                        opacity: 1,
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                } else {
                    // Masquer
                    gsap.to(card, {
                        opacity: 0,
                        scale: 0.9,
                        duration: 0.3,
                        ease: "power2.in",
                        onComplete: () => {
                            card.style.display = 'none';
                        }
                    });
                }
            });
            
            // Petit effet de "layout refresh" pour que la grille se remette bien en place
            // (Nécessaire parfois avec GSAP + Grid)
            ScrollTrigger.refresh();
        });
    });

// Fin de window.onload
};