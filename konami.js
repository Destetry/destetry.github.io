document.addEventListener('DOMContentLoaded', () => {
    const secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let secretCursor = 0;

    const konamiBar = document.getElementById('konami-bar');
    const easterEggDiv = document.getElementById('easter-egg');
    const visualBtns = document.querySelectorAll('.k-btn');

    if (!konamiBar) return;

    function checkInput(key) {
        const btnToAnimate = document.querySelector(`.k-btn[data-key="${key}"]`) || 
                             document.querySelector(`.k-btn[data-key="${key.toLowerCase()}"]`);

        if (btnToAnimate) {
            btnToAnimate.classList.add('pressed');
            setTimeout(() => btnToAnimate.classList.remove('pressed'), 200);
        }

        const expectedKey = secretCode[secretCursor];
        if (key.toLowerCase() === expectedKey.toLowerCase()) {
            secretCursor++;
            if (secretCursor === secretCode.length) {
                triggerVictory();
                secretCursor = 0;
            }
        } else {
            secretCursor = (key === 'ArrowUp') ? 1 : 0;
        }
    }

    function triggerVictory() {
        if (easterEggDiv) {
            easterEggDiv.style.display = 'flex';
            setTimeout(() => { easterEggDiv.style.display = 'none'; }, 4000);
        }
        konamiBar.classList.add('active');
        document.documentElement.style.setProperty('--accent-color', '#00FF00'); 
        document.documentElement.style.setProperty('--secondary-color', '#00FF00');
        document.documentElement.style.setProperty('--text-color', '#ccffcc');
        setTimeout(() => { konamiBar.classList.remove('active'); }, 5000);
    }

    document.addEventListener('keydown', (e) => { checkInput(e.key); });

    visualBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-key');
            checkInput(key);
            btn.blur();
        });
    });

    const stickyNote = document.querySelector('.sticky-note');
    if (stickyNote) {
        stickyNote.addEventListener('click', () => {
            konamiBar.classList.toggle('active');
        });
    }
});