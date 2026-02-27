// Typing Animation Logic
const specialties = ["Hardware Engineer", "PCB Designer", "Tech Enthusiast"];
let count = 0;
let index = 0;
let currentText = "";
let letter = "";

(function type() {
    if (count === specialties.length) count = 0;
    currentText = specialties[count];
    letter = currentText.slice(0, ++index);

    document.querySelector("#typing-text").textContent = letter;
    if (letter.length === currentText.length) {
        count++;
        index = 0;
        setTimeout(type, 2000); // Pause at end
    } else {
        setTimeout(type, 100);
    }
}());

function initProjectSwiper() {
    new Swiper('.project-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        grabCursor: true,
        loop: true,
        
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },

        // Navigation Config
        navigation: {
            nextEl: '.swiper-next',
            prevEl: '.swiper-prev',
        },

        // Pagination Config
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true, // Optional: Makes dots scale down if there are too many
        },
        
        breakpoints: {
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        }
    });
}

// Portfolio Loader & Filter
let projectData = [];

async function loadProjects() {
    try {
        const response = await fetch('./data/projects.json');
        projectData = await response.json();
        renderProjects(projectData);
    } catch (err) {
        console.error("Error loading projects:", err);
    }
}
function renderProjects(projects) {
    const grid = document.querySelector("#project-grid");
    if (!grid) return;

    grid.innerHTML = projects.map(project => {
        const projectLink = `project.html?id=${project.id}`;
        
        return `
        <div class="swiper-slide h-auto">
            <div onclick="window.location.href='${projectLink}'" 
                 class="group relative bg-[#0d1117] border border-[#1f2933] hover:border-[#00ff9c]/50 rounded-sm overflow-hidden transition-all duration-300 flex flex-col h-full cursor-pointer">
                
                <div class="relative h-56 shrink-0 overflow-hidden">
                    <img src="${project.thumbnail}" alt="${project.title}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition duration-500">
                    <div class="absolute top-4 left-4 bg-[#00ff9c] text-black text-[10px] font-bold px-3 py-1 uppercase tracking-wider z-10">
                        ${project.category}
                    </div>
                </div>

                <div class="p-6 flex-1 flex flex-col">
                    <a href="${projectLink}" class="block">
                        <h4 class="font-header text-xl md:text-2xl font-bold mb-3 text-white group-hover:text-[#00ff9c] transition-colors tracking-tight">
                            ${project.title}
                        </h4>
                    </a>
                    
                    <p class="text-sm md:text-base text-[#9da7b3] leading-relaxed mb-auto pb-8 line-clamp-3">
                        ${project.shortDesc}
                    </p>
                    
                    <div class="flex flex-wrap items-center justify-between gap-y-4 pt-6 border-t border-[#1f2933]/50">
    <div class="flex flex-wrap gap-2">
        ${project.technologies.slice(0, 3).map(tech => `
            <span class="text-[10px] font-mono border border-[#1f2933] px-2 py-1 text-[#666] uppercase tracking-tighter shrink-0">${tech}</span>
        `).join('')}
    </div>
    <a href="project.html?id=${project.id}" class="w-full sm:w-auto text-center flex items-center justify-center gap-2 font-mono text-[10px] text-[#00ff9c] font-bold px-4 py-2 border border-[#00ff9c]/50 hover:border-[#00ff9c] hover:bg-[#00ff9c]/10 transition-all uppercase tracking-widest rounded-sm">
        DETAILS <i data-lucide="arrow-right" class="w-3 h-3"></i>
    </a>
</div>
                </div>
            </div>
        </div>
    `}).join('');

    lucide.createIcons();
    initProjectSwiper();
}


function initSignalFlow() {
    const canvas = document.getElementById('signal-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    const spacing = 40; // Space between tracks
    const signals = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Signal {
        constructor() {
            this.init();
        }

        init() {
            // Align to grid
            this.x = Math.floor(Math.random() * (width / spacing)) * spacing;
            this.y = Math.floor(Math.random() * (height / spacing)) * spacing;
            this.length = Math.random() * 100 + 50;
            this.speed = Math.random() * 4 + 2;
            this.opacity = 0;
            // 0: Right, 1: Down, 2: Left, 3: Up
            this.direction = Math.floor(Math.random() * 4);
        }

        draw() {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#00ff9c';
            
            // Fade-in/out logic
            ctx.globalAlpha = this.opacity;
            if (this.opacity < 1) this.opacity += 0.02;

            ctx.moveTo(this.x, this.y);
            
            // Draw signal "tail" based on direction
            if (this.direction === 0) ctx.lineTo(this.x - this.length, this.y);
            else if (this.direction === 1) ctx.lineTo(this.x, this.y - this.length);
            else if (this.direction === 2) ctx.lineTo(this.x + this.length, this.y);
            else if (this.direction === 3) ctx.lineTo(this.x, this.y + this.length);
            
            ctx.stroke();

            // Movement logic
            if (this.direction === 0) this.x += this.speed;
            else if (this.direction === 1) this.y += this.speed;
            else if (this.direction === 2) this.x -= this.speed;
            else if (this.direction === 3) this.y -= this.speed;

            // Reset if out of bounds
            if (this.x < -200 || this.x > width + 200 || this.y < -200 || this.y > height + 200) {
                this.init();
            }
        }
    }

    // Initialize 30 signals
    for (let i = 0; i < 30; i++) {
        signals.push(new Signal());
    }

    function animate() {
        // Clear with heavy trail for "glow" effect
        ctx.fillStyle = 'rgba(5, 5, 5, 0.2)';
        ctx.fillRect(0, 0, width, height);

        // Draw static faint grid (The PCB Tracks)
        ctx.beginPath();
        ctx.strokeStyle = '#1f2933';
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.3;
        
        for (let x = 0; x < width; x += spacing) {
            ctx.moveTo(x, 0); ctx.lineTo(x, height);
        }
        for (let y = 0; y < height; y += spacing) {
            ctx.moveTo(0, y); ctx.lineTo(width, y);
        }
        ctx.stroke();

        // Update and draw signals
        signals.forEach(s => s.draw());

        requestAnimationFrame(animate);
    }

    animate();
}

initSignalFlow();

// Mobile Menu Logic
const menuOpen = document.getElementById('menu-open');
const menuClose = document.getElementById('menu-close');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function toggleMenu(open) {
    if (open) {
        mobileMenu.classList.remove('translate-x-full');
        document.body.style.overflow = 'hidden'; 
        // Force icons to render in the menu
        lucide.createIcons(); 
    } else {
        mobileMenu.classList.add('translate-x-full');
        document.body.style.overflow = 'auto';
    }
}

menuOpen.addEventListener('click', () => toggleMenu(true));
menuClose.addEventListener('click', () => toggleMenu(false));

// Close menu when a link is clicked
mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
});

// Filter Logic
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Toggle UI classes
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('bg-[#00ff9c]', 'text-black'));
        btn.classList.add('bg-[#00ff9c]', 'text-black');

        const filter = e.target.getAttribute('data-filter');
        const filteredData = filter === 'all' ? projectData : projectData.filter(p => p.category === filter);
        renderProjects(filteredData);
    });
});



window.addEventListener('DOMContentLoaded', loadProjects);