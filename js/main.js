// ── Intersection Observer for scroll-reveal animations ──
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .section-line').forEach(el => {
    revealObserver.observe(el);
});

//обработчик отправки формы
document.querySelector('form').addEventListener('submit', function(e){
    //блокирование рефреша страницы
    e.preventDefault();
    //обработчик телефона формы
    document.getElementById('phone-full').value = '+420' + document.getElementById('phone').value;
    //отправка данных в фоне
    fetch(this.action,{
        method: 'POST',
        body: new FormData(this)
    }).then(function(response) {
        //если сервер ответил ОК
        if (response.ok){
            e.target.classList.add('hidden');
            document.getElementById('form-success').classList.remove('hidden');
        }
    })
})

// ── Navbar scroll effect & active section tracking ──
const navbar = document.querySelector('.nav-bar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('#hero, #about, #contact');

window.addEventListener('scroll', () => {
    // Navbar background
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active nav link — pick the section whose top is closest above viewport center
    let current = '';
    const viewportMiddle = window.scrollY + window.innerHeight / 2;
    sections.forEach(section => {
        if (viewportMiddle >= section.offsetTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}, { passive: true });

// ── Smooth scroll for nav links ──
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (!targetId.startsWith('#')){
            return;
        }
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ── Video Slider ──
(() => {
    const slides = document.querySelectorAll('.video-slide');
    const dots = document.querySelectorAll('.video-dot');
    const btnLeft = document.querySelector('.video-arrow-left');
    const btnRight = document.querySelector('.video-arrow-right');
    const playBtn = document.querySelector('.video-play-overlay .play-btn');
    const counter = document.querySelector('.video-counter');
    if (!slides.length) return;

    let current = 0;

    function updateCounter() {
        if (counter) counter.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
    }

    function showPlayBtn() {
        if (playBtn) playBtn.style.display = '';
    }

    function hidePlayBtn() {
        if (playBtn) playBtn.style.display = 'none';
    }

    function goTo(index) {
        // Pause previous video & show its poster
        const prevVideo = slides[current].querySelector('video');
        const prevPoster = slides[current].querySelector('.video-poster');
        if (prevVideo) prevVideo.pause();
        if (prevPoster) prevPoster.style.display = '';

        slides[current].classList.add('opacity-0', 'pointer-events-none');
        slides[current].classList.remove('opacity-100');

        current = (index + slides.length) % slides.length;

        slides[current].classList.remove('opacity-0', 'pointer-events-none');
        slides[current].classList.add('opacity-100');

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('bg-[#b8872f]', i === current);
            dot.classList.toggle('bg-stone-600', i !== current);
        });

        updateCounter();
        showPlayBtn();
    }

    // Navigation — always works
    btnLeft.addEventListener('click', () => goTo(current - 1));
    btnRight.addEventListener('click', () => goTo(current + 1));
    dots.forEach(dot => {
        dot.addEventListener('click', () => goTo(Number(dot.dataset.dot)));
    });

    // Play / pause toggle
    playBtn.addEventListener('click', () => {
        const video = slides[current].querySelector('video');
        const poster = slides[current].querySelector('.video-poster');
        if (!video) return;

        if (video.paused) {
            if (poster) poster.style.display = 'none';
            video.play();
            hidePlayBtn();
        } else {
            video.pause();
            showPlayBtn();
        }
    });

    // When video ends — show poster & play button again
    slides.forEach(slide => {
        const video = slide.querySelector('video');
        if (!video) return;
        video.addEventListener('ended', () => {
            const poster = slide.querySelector('.video-poster');
            if (poster) poster.style.display = '';
            showPlayBtn();
        });
    });

    updateCounter();
})();

// ── Lightbox ──
(() => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (!lightbox || !lightboxImg) return;

    // Open on gallery image click
    document.querySelectorAll('.gallery-card img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.remove('hidden');
            lightbox.classList.add('flex');
        });
    });

    function close() {
        lightbox.classList.add('hidden');
        lightbox.classList.remove('flex');
    }

    // Close on background or X click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.closest('#lightbox-close')) close();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });
})();


