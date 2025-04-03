document.addEventListener('DOMContentLoaded', () => {
    // Initialize timestamp with horror format
    updateTimestamp();
    setInterval(updateTimestamp, 1000);
    
    // Get the jumpscare audio element
    const jumpscareAudio = document.getElementById('jumpscareAudio');
    let jumpscareTriggered = false;
    let audioEnabled = false;

    // Disable scrolling initially and add overlay class
    document.body.style.overflow = 'hidden';
    document.body.classList.add('overlay-active');

    // Handle enter overlay
    const enterOverlay = document.getElementById('enter-overlay');
    enterOverlay.addEventListener('click', () => {
        // Try to play and immediately pause to enable audio
        jumpscareAudio.play().then(() => {
            jumpscareAudio.pause();
            jumpscareAudio.currentTime = 0;
            audioEnabled = true;
        }).catch(error => {
            console.log('Audio permission denied');
        });

        // Remove overlay with fade effect
        enterOverlay.style.transition = 'opacity 0.5s';
        enterOverlay.style.opacity = '0';
        
        // Re-enable scrolling and remove overlay class after fade
        setTimeout(() => {
            enterOverlay.remove();
            document.body.style.overflow = '';
            document.body.classList.remove('overlay-active');
        }, 500);
    });

    // Add scroll jumpscare
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
        
        if (scrollPercent > 0.95 && !jumpscareTriggered) {
            jumpscareTriggered = true;
            
            // Scroll to top instantly
            window.scrollTo({ top: 0, behavior: 'instant' });
            
            // Disable scrolling
            document.body.style.overflow = 'hidden';
            
            // Create and show jumpscare image
            const jumpscare = document.createElement('div');
            jumpscare.className = 'jumpscare';
            document.body.appendChild(jumpscare);
            
            // Play sound if enabled
            if (audioEnabled) {
                jumpscareAudio.currentTime = 0;
                jumpscareAudio.play();
            }
            
            // Reset after 2 seconds
            setTimeout(() => {
                jumpscare.remove();
                document.body.style.overflow = '';
                jumpscareTriggered = false;
            }, 2000);
        }
    });

    // Add subtle breathing effect to background
    document.body.style.animation = 'breathe 15s infinite';
    
    // Add whispers and creepy sounds
    const whispers = [
        'behind you',
        'don\'t look',
        'help me',
        'join us',
        'forever',
        'your soul'
    ];
    
    // Create audio context for organic horror sounds
    let audioContext;
    
    function createWhisper() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Random frequency for whisper-like sound
        oscillator.frequency.value = Math.random() * 200 + 100;
        gainNode.gain.value = 0;
        
        oscillator.start();
        
        // Fade in
        gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.1);
        // Fade out
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
        
        setTimeout(() => oscillator.stop(), 500);
    }
    
    // Terminal typing effect with horror theme
    const terminalContent = document.querySelector('.terminal-content');
    let terminalIndex = 0;
    const terminalMessages = Array.from(terminalContent.children);
    terminalContent.innerHTML = '';
    
    function typeTerminal() {
        if (terminalIndex < terminalMessages.length) {
            const message = terminalMessages[terminalIndex];
            message.style.opacity = '0';
            message.style.transform = 'translateY(10px)';
            terminalContent.appendChild(message);
            
            requestAnimationFrame(() => {
                message.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                message.style.opacity = '1';
                message.style.transform = 'translateY(0)';
                
                if (Math.random() < 0.3) {
                    createWhisper();
                }
            });
            
            terminalIndex++;
            setTimeout(typeTerminal, 1000 + Math.random() * 500);
        }
    }
    
    typeTerminal();

    // Horror effects for entries
    const entries = document.querySelectorAll('.entry');
    let lastMouseX = 0;
    let lastMouseY = 0;
    
    entries.forEach(entry => {
        const subject = entry.dataset.subject;
        if (archiveData[subject]) {
            const corruptionLevel = archiveData[subject].corruptionLevel;
            applyHorrorEffects(entry, corruptionLevel);
            
            // Add organic hover effect
            entry.addEventListener('mousemove', (e) => {
                const rect = entry.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                
                const deltaX = e.clientX - lastMouseX;
                const deltaY = e.clientY - lastMouseY;
                const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
                
                entry.style.transform = `
                    translateY(-2px)
                    scale(${1 + speed * 0.001})
                    rotate(${(x - 0.5) * 2}deg)
                `;
                
                entry.style.boxShadow = `
                    ${(x - 0.5) * 20}px ${(y - 0.5) * 20}px 20px rgba(139, 0, 0, 0.3),
                    0 0 0 1px var(--blood-red)
                `;
                
                if (speed > 10 && Math.random() < 0.1) {
                    createWhisper();
                }
                
                const nearbyEntries = document.querySelectorAll('.entry');
                nearbyEntries.forEach(nearby => {
                    if (nearby !== entry) {
                        const nRect = nearby.getBoundingClientRect();
                        const distance = Math.sqrt(
                            Math.pow(e.clientX - (nRect.left + nRect.width/2), 2) +
                            Math.pow(e.clientY - (nRect.top + nRect.height/2), 2)
                        );
                        const darkness = Math.max(0, 1 - distance/500);
                        nearby.style.filter = `brightness(${1 - darkness * 0.5})`;
                        nearby.style.transform = `scale(${1 - darkness * 0.05})`;
                    }
                });
            });
            
            entry.addEventListener('mouseleave', () => {
                entry.style.transform = '';
                entry.style.boxShadow = '';
                
                const nearbyEntries = document.querySelectorAll('.entry');
                nearbyEntries.forEach(nearby => {
                    if (nearby !== entry) {
                        nearby.style.filter = '';
                        nearby.style.transform = '';
                    }
                });
            });
            
            // Add click event for details
            entry.addEventListener('click', () => showSubjectDetails(subject));
        }
    });

    // Create haunting TOP presence with organic movement
    function createHauntingPresence() {
        const floatingTop = document.createElement('div');
        floatingTop.className = 'floating-top';
        
        // Random starting position
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        
        floatingTop.style.left = `${startX}px`;
        floatingTop.style.top = `${startY}px`;
        
        document.body.appendChild(floatingTop);
        
        let lastTime = performance.now();
        let opacity = 0;
        let scale = 1;
        let rotation = 0;
        
        function animate(currentTime) {
            const deltaTime = (currentTime - lastTime) / 1000;
            lastTime = currentTime;
            
            opacity = Math.min(0.3, opacity + deltaTime * 0.5);
            scale = 1 + Math.sin(currentTime * 0.001) * 0.1;
            rotation += deltaTime * 30;
            
            floatingTop.style.opacity = opacity;
            floatingTop.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
            
            if (Math.random() < 0.01) {
                opacity = 0;
                createWhisper();
            }
            
            if (document.body.contains(floatingTop)) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
        
        setTimeout(() => {
            let fadeOut = 1;
            function fadeAway(currentTime) {
                fadeOut = Math.max(0, fadeOut - 0.02);
                floatingTop.style.opacity = fadeOut * 0.3;
                
                if (fadeOut > 0 && document.body.contains(floatingTop)) {
                    requestAnimationFrame(fadeAway);
                } else {
                    floatingTop.remove();
                }
            }
            requestAnimationFrame(fadeAway);
        }, 19000);
    }
    
    createHauntingPresence();
    setInterval(createHauntingPresence, 30000);

    // Horror-themed messages with psychological impact
    const horrorMessages = [
        '> They\'re watching through the screens...',
        '> Do you hear them whispering?',
        '> Look behind you... just once...',
        '> Your reflection... it moved...',
        '> The shadows are getting closer...',
        '> Don\'t blink... they move when you blink...',
        '> Can you feel them breathing?',
        '> The archive knows your fears...',
        '> Your memories are no longer yours...',
        '> The darkness is alive...'
    ];

    // Add horror messages to terminal with organic timing
    let messageTimeout;
    
    function addMessage() {
        const terminalContent = document.querySelector('.terminal-content');
        const messages = [
            ...horrorMessages,
            '> Something is watching...',
            '> [MUFFLED SCREAMS]',
            '> The walls are bleeding...',
            '> They\'re inside your head...',
            '> You can\'t escape yourself...',
            '> [DISTORTED PRAYERS]'
        ];
        
        const newMessage = document.createElement('p');
        const isHorrorMessage = Math.random() < 0.7;
        
        if (isHorrorMessage) {
            newMessage.className = 'horror-message';
            newMessage.textContent = horrorMessages[Math.floor(Math.random() * horrorMessages.length)];
            createWhisper();
        } else {
            newMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
        }
        
        newMessage.style.opacity = '0';
        newMessage.style.transform = 'translateY(10px)';
        terminalContent.appendChild(newMessage);
        
        requestAnimationFrame(() => {
            newMessage.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            newMessage.style.opacity = '1';
            newMessage.style.transform = 'translateY(0)';
        });
        
        if (terminalContent.children.length > 6) {
            const firstChild = terminalContent.firstChild;
            firstChild.style.opacity = '0';
            firstChild.style.transform = 'translateY(-10px)';
            setTimeout(() => firstChild.remove(), 500);
        }
        
        // Organic timing for next message
        clearTimeout(messageTimeout);
        messageTimeout = setTimeout(addMessage, 6000 + Math.random() * 4000);
    }
    
    addMessage();
});

function updateTimestamp() {
    const timestamp = document.querySelector('.timestamp');
    const now = new Date();
    
    // Randomly distort time for psychological effect
    const distortedHours = now.getHours() + (Math.random() < 0.1 ? Math.floor(Math.random() * 3) : 0);
    const distortedMinutes = now.getMinutes() + (Math.random() < 0.1 ? Math.floor(Math.random() * 5) : 0);
    
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(distortedHours).padStart(2, '0')}:${String(distortedMinutes).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    timestamp.textContent = `LAST KNOWN DATE: ${formattedDate}`;
    timestamp.style.color = Math.random() < 0.05 ? '#ff0000' : '#8b0000';
}

function applyHorrorEffects(element, level) {
    element.style.setProperty('--horror-level', `${level * 100}%`);
    
    if (level > 0.7) {
        let lastTime = performance.now();
        
        function animate(currentTime) {
            const deltaTime = (currentTime - lastTime) / 1000;
            lastTime = currentTime;
            
            const intensity = (Math.sin(currentTime * 0.001) + 1) * 0.5;
            const shake = Math.random() * 2 - 1;
            
            element.style.transform = `
                translate(${shake}px, ${shake}px)
                scale(${1 + intensity * 0.02})
            `;
            
            if (Math.random() < 0.001) {
                element.style.filter = 'invert(1)';
                setTimeout(() => element.style.filter = '', 50);
            }
            
            requestAnimationFrame(animate);
        }
        
        requestAnimationFrame(animate);
    }
    
    if (level > 0.5) {
        const text = element.querySelector('.status');
        if (text) {
            text.style.color = '#8b0000';
            text.style.fontStyle = 'italic';
            
            // Add subtle text distortion
            setInterval(() => {
                if (Math.random() < 0.1) {
                    text.style.letterSpacing = `${Math.random() * 2}px`;
                    setTimeout(() => text.style.letterSpacing = '', 100);
                }
            }, 2000);
        }
    }
}

function showSubjectDetails(subject) {
    const data = archiveData[subject];
    if (!data) return;

    const modal = document.createElement('div');
    modal.className = 'subject-modal';
    modal.style.opacity = '0';
    
    modal.innerHTML = `
        <div class="modal-content">
            <h2>${data.name}</h2>
            <p class="status">Status: ${data.status}</p>
            <p class="last-seen">Last Seen: ${data.lastSeen}</p>
            <div class="notes">
                <h3>CASE NOTES:</h3>
                ${data.notes.map(note => `<p class="note">${note}</p>`).join('')}
            </div>
            <button class="close-modal">SEAL FILE</button>
        </div>
    `;

    document.body.appendChild(modal);
    
    requestAnimationFrame(() => {
        modal.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        modal.style.opacity = '1';
        
        if (Math.random() < 0.3) {
            createWhisper();
        }
    });

    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 500);
    });

    if (data.corruptionLevel > 0.6) {
        const modalContent = modal.querySelector('.modal-content');
        let lastTime = performance.now();
        
        function animate(currentTime) {
            const deltaTime = (currentTime - lastTime) / 1000;
            lastTime = currentTime;
            
            const intensity = (Math.sin(currentTime * 0.002) + 1) * 0.5;
            
            modalContent.style.transform = `
                scale(${1 + intensity * 0.01})
                rotate(${(Math.random() - 0.5) * intensity}deg)
            `;
            
            if (Math.random() < 0.01) {
                modalContent.style.filter = 'invert(1)';
                setTimeout(() => modalContent.style.filter = '', 50);
                createWhisper();
            }
            
            if (document.body.contains(modal)) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    }
} 