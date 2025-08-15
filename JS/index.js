// ===== VARIABLES GLOBALES =====
let isScrolling = false;
let currentSection = 'inicio';

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    setupNavigationEffects();
    setupMobileMenu();
    setupScrollAnimations();
    setupSmoothScrolling();
    setupStatsCounter();
    setupServiceCardEffects();
    setupContactFormEffects();
    setupPerformanceOptimizations();
}

// ===== EFECTOS DE NAVEGACIÓN =====
function setupNavigationEffects() {
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    // Efecto de scroll en el header
    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 10));
    
    // Actualizar enlace activo en la navegación
    window.addEventListener('scroll', throttle(() => {
        updateActiveNavLink();
    }, 100));
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPos >= top && scrollPos <= bottom) {
            // Remover clase activa de todos los enlaces
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
            });
            
            // Agregar clase activa al enlace correspondiente
            const activeLink = document.querySelector(`.nav-menu a[href="#${id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
            
            currentSection = id;
        }
    });
}

// ===== MENÚ MÓVIL =====
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    if (!mobileMenuBtn || !navMenu) return;
    
    // Toggle del menú móvil
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevenir scroll del body cuando el menú está abierto
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== SCROLL SUAVE =====
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== ANIMACIONES DE SCROLL =====
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                
                // Animar elementos específicos
                if (entry.target.classList.contains('stat-item')) {
                    animateStatNumber(entry.target);
                }
                
                // Agregar delay escalonado para grids
                if (entry.target.parentElement.classList.contains('services-grid') ||
                    entry.target.parentElement.classList.contains('reviews-grid')) {
                    addStaggeredAnimation(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observar todos los elementos con animación
    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });
}

function addStaggeredAnimation(element) {
    const siblings = Array.from(element.parentElement.children);
    const index = siblings.indexOf(element);
    const delay = index * 100; // 100ms de delay por elemento
    
    setTimeout(() => {
        element.style.transitionDelay = '0s';
    }, delay);
}

// ===== CONTADOR DE ESTADÍSTICAS =====
function setupStatsCounter() {
    let statsAnimated = false;
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                animateAllStats();
                statsAnimated = true;
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
}

function animateAllStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach((statNumber, index) => {
        setTimeout(() => {
            animateStatNumber(statNumber.parentElement);
        }, index * 200);
    });
}

function animateStatNumber(statItem) {
    const statNumber = statItem.querySelector('.stat-number');
    if (!statNumber || statNumber.dataset.animated) return;
    
    const finalText = statNumber.textContent;
    const numericValue = parseInt(finalText.replace(/[^0-9]/g, ''));
    const suffix = finalText.replace(/[0-9]/g, '');
    
    if (isNaN(numericValue)) return;
    
    statNumber.dataset.animated = 'true';
    
    const duration = 2000; // 2 segundos
    const increment = numericValue / (duration / 16); // 60fps
    let current = 0;
    
    const counter = setInterval(() => {
        current += increment;
        
        if (current >= numericValue) {
            statNumber.textContent = finalText;
            clearInterval(counter);
        } else {
            statNumber.textContent = Math.floor(current) + suffix;
        }
    }, 16);
    
    // Efecto de escala
    statItem.classList.add('pulse');
    setTimeout(() => {
        statItem.classList.remove('pulse');
    }, 2000);
}

// ===== EFECTOS DE TARJETAS DE SERVICIOS =====
function setupServiceCardEffects() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        // Efecto de hover con delay
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
            
            // Efecto especial para tarjetas destacadas
            if (this.classList.contains('featured')) {
                this.style.transform = 'translateY(-15px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.3s ease';
            this.style.transform = '';
        });
        
        // Efecto de clic
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// ===== EFECTOS DE BOTONES DE CONTACTO =====
function setupContactFormEffects() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        // Efecto ripple
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Efecto de loading para enlaces de contacto
        if (button.href && (button.href.includes('mailto:') || button.href.includes('tel:'))) {
            button.addEventListener('click', function() {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 1000);
            });
        }
    });
}

// ===== OPTIMIZACIONES DE RENDIMIENTO =====
function setupPerformanceOptimizations() {
    // Lazy loading para imágenes (si las hay)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Preload de fuentes críticas
    const fontLinks = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
    ];
    
    fontLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });
}

// ===== UTILIDADES =====
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// ===== EFECTOS ESPECIALES =====
function setupSpecialEffects() {
    // Efecto parallax para el hero
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero && scrolled < hero.offsetHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    }, 10));
    
    // Efecto de typing para el título del hero
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid #60a5fa';
        
        let index = 0;
        const typeWriter = () => {
            if (index < text.length) {
                heroTitle.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    heroTitle.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
}

// ===== MANEJO DE ERRORES =====
window.addEventListener('error', function(e) {
    console.error('Error detectado:', e.error);
    // Aquí podrías enviar el error a un servicio de logging
});

// ===== ANALYTICS Y TRACKING =====
function trackUserInteraction(action, element) {
    // Implementar tracking de Google Analytics o similar
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': 'engagement',
            'event_label': element
        });
    }
    
    console.log(`Acción: ${action}, Elemento: ${element}`);
}

// ===== EVENTOS DE TRACKING =====
document.addEventListener('click', function(e) {
    const target = e.target;
    
    if (target.classList.contains('cta-button')) {
        trackUserInteraction('click', 'cta-button');
    }
    
    if (target.classList.contains('service-card')) {
        trackUserInteraction('click', 'service-card');
    }
    
    if (target.closest('.nav-menu')) {
        trackUserInteraction('click', 'navigation');
    }
});

// ===== MODO OSCURO/CLARO (FUTURO) =====
function setupThemeToggle() {
    // Preparado para implementar toggle de tema si es necesario
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    prefersDark.addEventListener('change', (e) => {
        // Lógica para cambio automático de tema
        if (e.matches) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    });
}

// ===== ACCESIBILIDAD =====
function setupAccessibility() {
    // Manejo de navegación por teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Saltar al contenido principal';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        z-index: 9999;
        padding: 8px;
        background: var(--primary-color);
        color: white;
        text-decoration: none;
        border-radius: 4px;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// ===== INICIALIZACIÓN FINAL =====
document.addEventListener('DOMContentLoaded', function() {
    setupSpecialEffects();
    setupThemeToggle();
    setupAccessibility();
});

// ===== ESTILOS CSS DINÁMICOS =====
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .skip-link:focus {
            top: 6px;
        }
        
        .keyboard-navigation *:focus {
            outline: 2px solid var(--accent-color);
            outline-offset: 2px;
        }
        
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Agregar estilos dinámicos
addDynamicStyles();