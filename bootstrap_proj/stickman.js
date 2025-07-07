document.addEventListener('DOMContentLoaded', function() {
    const stickman = document.getElementById('stickman');
    const skills_cont = document.getElementById('skillsContainer');
    const experience_cont = document.getElementById('experienceContainer');
    const projects_cont = document.getElementById('projectsContainer');
    const contact_cont = document.getElementById('contactContainer');
    const nav_links = document.querySelectorAll('.nav-link');
    const proj_cards = document.querySelectorAll('.project-card');
    const contact_card= document.querySelectorAll('contact-card');
    let pos = 10; 
    let curr_active_idx = 1; 
    
    
    nav_links.forEach((link, index) => {
        if (link.classList.contains('active')) {
            curr_active_idx = index;
        }
    });

    proj_cards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('a')) {
                this.classList.toggle('flipped');
            }
        });
    });
    contact_card.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('a')) {
                this.classList.toggle('flipped');
            }
        });
    });

    let exper_cards = [];
    let curr_card_idx = 0;
    
    if (experience_cont) {
        exper_cards = document.querySelectorAll('.experience-card');
        if (exper_cards.length > 0) {
            exper_cards.forEach((card, index) => {
                card.classList.toggle('active', index === 0);
                const offset = (index - curr_card_idx) * 120;
                card.style.transform = `translateX(${offset}%)`;
            });
            update_exp_card_pos();

            exper_cards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    if (card.classList.contains('active')) {
                        card.style.transform = card.style.transform.replace('translateX', 'rotateY(180deg) translateX');
                    }
                });
                
                card.addEventListener('mouseleave', () => {
                    if (card.classList.contains('active')) {
                        const index = Array.from(exper_cards).indexOf(card);
                        const offset = (index - curr_card_idx) * 120;
                        card.style.transform = `translateX(${offset}%)`;
                    }
                });
            });
        }
    }

    document.addEventListener('keydown', function(e) {
        if(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            e.preventDefault();
        }

        if (e.key === 'ArrowLeft') {
            pos = Math.max(0, pos - 2);
            stickman.style.left = pos + '%';
            stickman.style.transform = 'scaleX(-1)';
            
            if (experience_cont && exper_cards.length > 0) {
                navigateExperienceCard(-1);
            } else {
                stickman_scroll();
            }
        } 
        else if (e.key === 'ArrowRight') {
            pos = Math.min(90, pos + 2);
            stickman.style.left = pos + '%';
            stickman.style.transform = 'scaleX(1)';
            
            if (experience_cont && exper_cards.length > 0) {
                navigateExperienceCard(1);
            } else {
                stickman_scroll();
            }
        }
        // Jump - to next page
        else if (e.key === 'ArrowUp') {
            jump();
            setTimeout(() => {
                const nextIndex = Math.min(nav_links.length - 1, curr_active_idx + 1);
                nav_links[nextIndex].click();
            }, 400);
        }
        // Crouch - to previous page
        else if (e.key === 'ArrowDown') {
            crouch();
            setTimeout(() => {
                const prevIndex = Math.max(0, curr_active_idx - 1);
                nav_links[prevIndex].click();
            }, 400);
        }
    });

    function stickman_scroll() {
       
        if (skills_cont) {
            const skills_scroll_width = skills_cont.scrollWidth - skills_cont.clientWidth;
            skills_cont.scrollLeft = (pos / 90) * skills_scroll_width;
        }
        
        if (projects_cont) {
            const proj_scroll_width = projects_cont.scrollWidth - projects_cont.clientWidth;
            projects_cont.scrollLeft = (pos / 90) * proj_scroll_width;
        }

        if (contact_cont) {
            const contact_scroll_width = contact_cont.scrollWidth - contact_cont.clientWidth;
            contact_cont.scrollLeft = (pos / 90) * contact_scroll_width;
        }

        stickman.style.left = pos + '%';
    }

    function navigateExperienceCard(direction) {
        const newIndex = curr_card_idx + direction;
        if (newIndex >= 0 && newIndex < exper_cards.length) {
            const currentCard = exper_cards[curr_card_idx];
            currentCard.style.transform = `translateX(${(curr_card_idx - newIndex) * 120}%)`;
            
            curr_card_idx = newIndex;
            update_exp_card_pos();
            
            const percentage = (curr_card_idx / (exper_cards.length - 1)) * 80 + 10;
            pos = percentage;
            stickman.style.left = pos + '%';
        }
    }

    function update_exp_card_pos() {
        exper_cards.forEach((card, index) => {
            const wasActive = card.classList.contains('active');
            card.classList.toggle('active', index === curr_card_idx);
            
            const offset = (index - curr_card_idx) * 120;
            
            if (index === curr_card_idx && !wasActive) {
                card.style.transform = `translateX(${offset}%) rotateY(0deg)`;
            } else {
                card.style.transform = `translateX(${offset}%)`;
            }
        });
    }

    function jump() {
        if (stickman.classList.contains('jumping')) return;
        
        stickman.classList.add('jumping');
        stickman.style.transition = 'transform 0.4s ease';
        stickman.style.transform += ' translateY(-100px)';
        
        setTimeout(() => {
            stickman.style.transform = stickman.style.transform.replace(' translateY(-100px)', '');
            setTimeout(() => {
                stickman.classList.remove('jumping');
            }, 400);
        }, 400);
    }

    function crouch() {
        if (stickman.classList.contains('crouching')) return;
        
        stickman.classList.add('crouching');
        stickman.style.transition = 'transform 0.2s ease';
        stickman.style.transform += ' translateY(20px) scaleY(0.6)';
        
        setTimeout(() => {
            stickman.style.transform = stickman.style.transform
                .replace(' translateY(20px)', '')
                .replace(' scaleY(0.6)', '');
            stickman.classList.remove('crouching');
        }, 200);
    }
});

