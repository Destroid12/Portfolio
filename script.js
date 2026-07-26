document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. Auto-Generate Projects from projects.js
       ========================================= */
    const renderProjects = () => {
        // projectData is defined in projects.js
        if (typeof projectData === 'undefined') return;

        const generateCardHTML = (project, category) => {
            let mediaHTML = '';
            
            if (project.type === 'video') {
                const placeholderClass = category === 'scripting' ? 'placeholder-scripting' : 'placeholder-vfx';
                mediaHTML = `
                    <div class="video-container hover-target">
                        <video src="${project.url}" class="custom-video" preload="metadata"></video>
                        <div class="video-overlay ${placeholderClass}"><span>Loading...</span></div>
                        <div class="video-controls">
                            <button class="play-pause-btn"><i class="fa-solid fa-play"></i></button>
                            <div class="progress-container">
                                <div class="progress-bar"></div>
                            </div>
                            <div class="time-display">0:00 / 0:00</div>
                            <button class="mute-btn"><i class="fa-solid fa-volume-high"></i></button>
                            <button class="fullscreen-btn"><i class="fa-solid fa-expand"></i></button>
                        </div>
                    </div>
                `;
            } else {
                // Image
                mediaHTML = `<img src="${project.url}" alt="${project.title}" class="project-img">`;
            }

            return `
                <div class="project-card glass-card tilt-card">
                    ${mediaHTML}
                    <div class="project-info">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                    </div>
                </div>
            `;
        };

        const scriptingGrid = document.getElementById('grid-scripting');
        const vfxGrid = document.getElementById('grid-vfx');

        if (scriptingGrid && projectData.scripting) {
            scriptingGrid.innerHTML = projectData.scripting.map(p => generateCardHTML(p, 'scripting')).join('');
        }
        if (vfxGrid && projectData.vfx) {
            vfxGrid.innerHTML = projectData.vfx.map(p => generateCardHTML(p, 'vfx')).join('');
        }
        
        // Show empty states if no projects
        if (scriptingGrid && (!projectData.scripting || projectData.scripting.length === 0)) {
            scriptingGrid.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1;">Projects coming soon...</p>`;
        }
        if (vfxGrid && (!projectData.vfx || projectData.vfx.length === 0)) {
            vfxGrid.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1;">Projects coming soon...</p>`;
        }
    };

    // Run the generator
    renderProjects();


    /* =========================================
       2. Custom Glowing Cursor
       ========================================= */
    const cursorGlow = document.getElementById('cursor-glow');
    
    // Re-select hover targets in case they were just generated
    const setupCursor = () => {
        const hoverTargets = document.querySelectorAll('.hover-target, button, a');
        
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });

        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => cursorGlow.classList.add('hovering'));
            target.addEventListener('mouseleave', () => cursorGlow.classList.remove('hovering'));
        });
    };
    setupCursor();

    /* =========================================
       3. 3D Tilt Effect for Cards
       ========================================= */
    const setupTiltCards = () => {
        const tiltCards = document.querySelectorAll('.tilt-card');

        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const tiltX = ((y - centerY) / centerY) * -10;
                const tiltY = ((x - centerX) / centerX) * 10;
                
                card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });
    };
    setupTiltCards();


    /* =========================================
       4. Custom Video Player System
       ========================================= */
    const setupVideoPlayers = () => {
        const videoContainers = document.querySelectorAll('.video-container');

        videoContainers.forEach(container => {
            const video = container.querySelector('.custom-video');
            const playPauseBtn = container.querySelector('.play-pause-btn');
            const playPauseIcon = playPauseBtn.querySelector('i');
            const progressContainer = container.querySelector('.progress-container');
            const progressBar = container.querySelector('.progress-bar');
            const timeDisplay = container.querySelector('.time-display');
            const muteBtn = container.querySelector('.mute-btn');
            const muteIcon = muteBtn.querySelector('i');
            const fullscreenBtn = container.querySelector('.fullscreen-btn');
            const overlay = container.querySelector('.video-overlay');

            const formatTime = (timeInSeconds) => {
                if (isNaN(timeInSeconds)) return "0:00";
                const minutes = Math.floor(timeInSeconds / 60);
                const seconds = Math.floor(timeInSeconds % 60);
                return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            };

            // Overlay logic
            if (video.getAttribute('src')) {
                // If it successfully loads metadata, hide overlay
                video.addEventListener('loadeddata', () => {
                    overlay.style.display = 'none';
                });
                // Fallback timeout just in case
                setTimeout(() => {
                    if (video.readyState >= 2) overlay.style.display = 'none';
                }, 500);
            }

            const togglePlay = () => {
                if (video.paused) {
                    video.play();
                    playPauseIcon.classList.remove('fa-play');
                    playPauseIcon.classList.add('fa-pause');
                } else {
                    video.pause();
                    playPauseIcon.classList.remove('fa-pause');
                    playPauseIcon.classList.add('fa-play');
                }
            };

            playPauseBtn.addEventListener('click', togglePlay);
            video.addEventListener('click', togglePlay);

            video.addEventListener('timeupdate', () => {
                const progress = (video.currentTime / video.duration) * 100;
                progressBar.style.width = `${progress}%`;
                timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
            });

            video.addEventListener('loadedmetadata', () => {
                timeDisplay.textContent = `0:00 / ${formatTime(video.duration)}`;
            });

            progressContainer.addEventListener('click', (e) => {
                const rect = progressContainer.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                video.currentTime = pos * video.duration;
            });

            muteBtn.addEventListener('click', () => {
                video.muted = !video.muted;
                if (video.muted) {
                    muteIcon.classList.remove('fa-volume-high');
                    muteIcon.classList.add('fa-volume-xmark');
                } else {
                    muteIcon.classList.remove('fa-volume-xmark');
                    muteIcon.classList.add('fa-volume-high');
                }
            });

            video.addEventListener('dblclick', () => {
                if (!document.fullscreenElement) {
                    if (container.requestFullscreen) container.requestFullscreen();
                    else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
                } else {
                    if (document.exitFullscreen) document.exitFullscreen();
                    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                }
            });

            fullscreenBtn.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    if (container.requestFullscreen) {
                        container.requestFullscreen();
                    } else if (container.webkitRequestFullscreen) {
                        container.webkitRequestFullscreen();
                    }
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                }
            });
        });
    };
    setupVideoPlayers();


    /* =========================================
       5. Tabs & Scroll Animations
       ========================================= */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Pause all videos on tab switch
            document.querySelectorAll('video').forEach(vid => {
                vid.pause();
                const container = vid.closest('.video-container');
                if (container) {
                    const icon = container.querySelector('.play-pause-btn i');
                    if (icon) {
                        icon.classList.remove('fa-pause');
                        icon.classList.add('fa-play');
                    }
                }
            });

            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
});

function copyDiscord() {
    const discordUsername = "nayonbien";
    navigator.clipboard.writeText(discordUsername).then(() => {
        const span = document.getElementById('discord-text');
        const originalText = span.innerText;
        span.innerText = "Copied to Clipboard!";
        setTimeout(() => span.innerText = originalText, 2000);
    }).catch(err => console.error('Failed to copy text: ', err));
}
