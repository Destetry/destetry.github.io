window.onload = function() {
    console.log("✅ Système initialisé.");

    try {
        if (typeof Lenis !== 'undefined') {
            const lenis = new Lenis();
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }
    } catch (error) {
        console.error("Erreur Lenis ignorée:", error);
    }

    const introOverlay = document.getElementById('intro-overlay');
    const counter = document.getElementById('counter');
    const wakeBtn = document.getElementById('wake-btn');
    const mainContent = document.getElementById('main-content');
    const loaderContent = document.querySelector('.loader-content');

    if (!introOverlay || !counter) return; 

    document.body.style.overflow = 'hidden';
    let countObj = { val: 0 };
    
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
            tl.to(introOverlay, { scaleY: 0.005, scaleX: 1, duration: 0.2, ease: "power2.in" })
            .to(introOverlay, {
                width: "100%", height: "2px", background: "#FFFFFF", duration: 0.1,
                onStart: () => { introOverlay.innerHTML = ''; }
            })
            .to(introOverlay, {
                scaleX: 0, opacity: 0, duration: 0.2,
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

    const recDot = document.querySelector('.blink-rec');
    if (recDot) {
        setInterval(() => {
            recDot.style.opacity = (recDot.style.opacity === '0') ? '1' : '0';
        }, 1000);
    }

    const logoSvg = document.querySelector('#hud-logo svg');
    if (logoSvg) {
        function flickerLogo() {
            const targetOpacity = Math.random() * 0.5 + 0.5;
            gsap.to(logoSvg, {
                opacity: targetOpacity,
                duration: Math.random() * 2 + 1,
                ease: "sine.inOut",
                onComplete: flickerLogo
            });
        }
        flickerLogo();
    }

    const glitchElements = document.querySelectorAll('.glitch-effect');
    glitchElements.forEach(el => {
        let glitchTimeline;
        el.addEventListener('mouseenter', () => {
            if (glitchTimeline) glitchTimeline.kill();
            glitchTimeline = gsap.timeline({ repeat: -1 });
            glitchTimeline.to(el, { duration: 0.05, x: "random(-4, 4)", y: "random(-2, 2)", textShadow: "3px 0 #ff0000, -3px 0 #00ffff", opacity: 0.8, ease: "steps(1)" })
            .to(el, { duration: 0.02, x: 0, y: 0, textShadow: "none", opacity: 1, ease: "steps(1)" })
            .to(el, { duration: 0.08, x: "random(-10, 10)", color: "#00ffff", ease: "steps(1)" })
            .to(el, { duration: "random(0.1, 0.5)", x: 0, y: 0, color: "white", textShadow: "0 0 20px rgba(255, 159, 67, 0.4)", ease: "steps(1)" });
        });
        el.addEventListener('mouseleave', () => {
            if (glitchTimeline) {
                glitchTimeline.kill();
                gsap.set(el, { x: 0, y: 0, skewX: 0, color: "white", textShadow: "0 0 20px rgba(255, 159, 67, 0.4)", opacity: 1 });
            }
        });
    });

    initPCBSystem();

    function initPCBSystem() {
        const container = document.getElementById('pcb-bg');
        if (!container) return;
        container.innerHTML = '';
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "100%"); svg.setAttribute("height", "100%"); svg.setAttribute("preserveAspectRatio", "none"); 
        container.appendChild(svg);

        const tracks = [
            "M 10,0 L 10,20 L 30,40 L 80,40", "M 90,0 L 90,15 L 70,35 L 70,80", 
            "M 0,50 L 15,50 L 35,70 L 35,90", "M 100,60 L 85,60 L 65,80 L 40,80", 
            "M 20,100 L 20,80 L 40,60", "M 50,0 L 50,10 L 60,20 L 60,50 L 80,70",
            "M 0,20 L 20,20 L 30,10", "M 100,30 L 80,30 L 70,40"
        ];

        const w = container.offsetWidth;
        const h = container.offsetHeight;

        tracks.forEach((pathData) => {
            const convertedPath = pathData.replace(/([0-9]+),([0-9]+)/g, (match, x, y) => `${(parseFloat(x) / 100) * w},${(parseFloat(y) / 100) * h}`);
            const path = document.createElementNS(svgNS, "path");
            path.setAttribute("d", convertedPath);
            path.setAttribute("class", "pcb-path");
            svg.appendChild(path);
            const electron = document.createElementNS(svgNS, "circle");
            electron.setAttribute("class", "electron");
            svg.appendChild(electron);
            animateElectronOnPath(electron, path);
        });
    }

    function animateElectronOnPath(electron, pathElement) {
        const length = pathElement.getTotalLength();
        let progress = { value: 0 };
        gsap.to(progress, {
            value: 1, duration: 2 + Math.random() * 3, ease: "none", repeat: -1, repeatDelay: Math.random(), 
            onUpdate: () => {
                const point = pathElement.getPointAtLength(progress.value * length);
                electron.setAttribute("cx", point.x); electron.setAttribute("cy", point.y);
                let opacity = 1;
                if(progress.value < 0.1) opacity = progress.value * 10;
                if(progress.value > 0.9) opacity = (1 - progress.value) * 10;
                electron.style.opacity = opacity;
            }
        });
    }

    function startTypewriter() {
        const text = "Vidéaste, Pilote Drone & Communicant."; 
        const container = document.getElementById('typewriter');
        if(!container) return;
        let i = 0;
        function type() {
            if (i < text.length) { container.innerHTML += text.charAt(i); i++; setTimeout(type, 80); }
        }
        type();
    }
    
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        document.querySelectorAll('.section').forEach(section => {
            gsap.from(section, {
                scrollTrigger: { trigger: section, start: "top 85%" },
                y: 50, opacity: 0, duration: 1, ease: "power2.out"
            });
        });
    }

    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === category) {
                    gsap.to(card, { display: 'block', opacity: 1, scale: 1, duration: 0.3 });
                } else {
                    gsap.to(card, { opacity: 0, scale: 0.9, duration: 0.3, onComplete: () => card.style.display = 'none' });
                }
            });
            ScrollTrigger.refresh();
        });
    });
	
	// --- SYSTÈME MODAL VIDÉO (CORRIGÉ) ---
	const modal = document.getElementById('video-modal');
	const modalIframe = document.getElementById('modal-iframe');
	const closeBtn = document.querySelector('.modal-close-btn');
	const modalOverlay = document.querySelector('.modal-overlay');

	function extractVideoID(url) {
		const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
		const match = url.match(regExp);
		return (match && match[7].length == 11) ? match[7] : url;
	}

	document.querySelectorAll('.project-card[data-video-id]').forEach(card => {
		card.addEventListener('click', () => {
			const rawId = card.getAttribute('data-video-id');
			const videoId = extractVideoID(rawId);
			
			if (videoId) {
				// Ajout de origin pour éviter les erreurs de domaine et mute pour l'autoplay
				const currentOrigin = window.location.origin;
				modalIframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`;
				
				modal.style.display = 'flex';
				document.body.style.overflow = 'hidden';
				
				gsap.fromTo(modal.querySelector('.modal-content'), 
					{ scale: 0.8, opacity: 0 }, 
					{ scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
				);
			}
		});
	});

	function closeModal() {
		modal.style.display = 'none';
		modalIframe.src = "";
		document.body.style.overflow = '';
	}

	closeBtn.addEventListener('click', closeModal);
	modalOverlay.addEventListener('click', closeModal);
};