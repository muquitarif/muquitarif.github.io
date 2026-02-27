async function initDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (!projectId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch('./data/projects.json');
        const projects = await response.json();
        const project = projects.find(p => p.id === projectId);

        if (!project) {
            document.getElementById('project-content').innerHTML = `
                <div class="text-center py-20">
                    <h1 class="font-header text-4xl mb-4">404: PROJECT_NOT_FOUND</h1>
                    <a href="index.html" class="text-[#00ff9c] font-mono underline">RETURN_TO_BASE</a>
                </div>`;
            return;
        }

        // Basic Info
        document.title = `${project.title} | Technical Documentation`;
        document.getElementById('nav-id').textContent = `ID_REF: ${project.id.toUpperCase()}`;
        document.getElementById('project-category').textContent = `// ${project.category.toUpperCase()}`;
        document.getElementById('project-title').textContent = project.title;
        document.getElementById('project-image').src = project.thumbnail;
        
        // Description
        const descContainer = document.getElementById('project-longDesc');
        descContainer.innerHTML = `
            <p class="text-xl text-white mb-6">${project.shortDesc}</p>
            <p>${project.fullDescription}</p>
        `;

        // Tech Tags
        const techContainer = document.getElementById('project-tech');
        techContainer.innerHTML = project.technologies.map(tech => 
            `<span class="font-mono text-[10px] border border-[#1f2933] px-3 py-1 text-[#00ff9c] bg-[#00ff9c]/5 uppercase">${tech}</span>`
        ).join('');

        // --- NEW GALLERY LOGIC ---
        const galleryContainer = document.getElementById('project-gallery');
if (project.gallery && project.gallery.length > 0) {
    galleryContainer.innerHTML = project.gallery.map(img => `
        <div class="group relative aspect-square overflow-hidden border border-[#1f2933] bg-black cursor-pointer hover:border-[#00ff9c]/50 transition-all shrink-0">
            <img src="${img}" 
                 onclick="swapMainImage('${img}')"
                 class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-300" 
                 alt="Thumbnail">
        </div>
    `).join('');
}

        // Image Swapper Helper
        window.swapMainImage = function(url) {
            const mainImg = document.getElementById('project-image');
            mainImg.classList.add('opacity-0');
            setTimeout(() => {
                mainImg.src = url;
                mainImg.classList.remove('opacity-0');
            }, 200);
        };
        // --- END GALLERY LOGIC ---

        // Link logic
        const linkBtn = document.getElementById('project-link');
        project.github === "#" ? linkBtn.classList.add('hidden') : (linkBtn.href = project.github);

        document.getElementById('project-content').classList.remove('opacity-0');
        lucide.createIcons();

    } catch (err) {
        console.error("FATAL_ERROR:", err);
    }
}
document.addEventListener('DOMContentLoaded', initDetails);