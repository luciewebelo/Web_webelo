// Lazy loading pro animace
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            revealObserver.unobserve(entry.target);
        }
    });
}, { rootMargin: "-100px 0px" });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// Mobilní menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'rgba(26,39,68,0.95)';
            navLinks.style.padding = '1rem 0';
            navLinks.style.alignItems = 'center';
            navLinks.style.gap = '1rem';
        }
    });
}

// AJAX odeslání formuláře (Formspree)
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('form-status');
const formHeader = document.querySelector('.contact-form-wrapper .contact-header');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        // Změna tlačítka na "Odesílám..."
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Odesílám...';

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: contactForm.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Skrytí formuláře a záhlaví, zobrazení děkovné zprávy
                contactForm.style.display = 'none';
                if (formHeader) formHeader.style.display = 'none';
                formStatus.style.display = 'block';
                formStatus.classList.add('fade-in-up');
            } else {
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    alert(data["errors"].map(error => error["message"]).join(", "));
                } else {
                    alert('Něco se nepovedlo. Zkuste to prosím znovu za chvíli.');
                }
            }
        } catch (error) {
            alert('Chyba při odesílání. Zkontrolujte prosím své připojení k internetu.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}
