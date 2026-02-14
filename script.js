document.addEventListener('DOMContentLoaded', () => {
    const revealBtn = document.getElementById('reveal-btn');
    
    if (revealBtn) {
        revealBtn.addEventListener('click', revealSurprise);
    }

    // Setup Audio Player Controls
    const playBtn = document.getElementById('play-btn');
    if (playBtn) {
        playBtn.addEventListener('click', toggleAudio);
    }

    // Setup Previous/Next Buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    if (prevBtn) {
        prevBtn.addEventListener('click', restartSong);
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', skipForward);
    }

    // Setup Audio Events (Progress Bar & Time Update)
    setupAudioEvents();
});

function revealSurprise() {
    const intro = document.getElementById('intro-screen');
    const message = document.getElementById('message-screen');

    // 1. Hide the intro screen
    intro.style.display = 'none';

    // 2. Show the message screen with animation
    message.classList.remove('hide');
    message.classList.add('show');

    // 3. Trigger the confetti
    createConfetti();
    
    // Optional: Auto-play the song on reveal (browsers might block this without interaction, but since she clicked the heart, it might work)
    // toggleAudio(); 
}

function toggleAudio() {
    const audio = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    
    if (audio.paused) {
        audio.play();
        playBtn.innerText = '⏸️'; // Pause icon
    } else {
        audio.pause();
        playBtn.innerText = '▶️'; // Play icon
    }
}

function setupAudioEvents() {
    const audio = document.getElementById('audio-player');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const playBtn = document.getElementById('play-btn');

    if (!audio || !progressBar) return;

    // When user drags the slider
    progressBar.addEventListener('input', () => {
        const seekTime = (progressBar.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    });

    // Update slider as song plays
    audio.addEventListener('timeupdate', () => {
        // Only update slider if user is NOT currently dragging it (optional check, but simple update is usually fine)
        if (document.activeElement !== progressBar) {
            const percent = (audio.currentTime / audio.duration) * 100;
            progressBar.value = percent || 0;
        }

        // Update Time Text
        const currentMinutes = Math.floor(audio.currentTime / 60);
        const currentSeconds = Math.floor(audio.currentTime % 60);
        currentTimeEl.innerText = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
        
        if (!isNaN(audio.duration)) {
            const totalMinutes = Math.floor(audio.duration / 60);
            const totalSeconds = Math.floor(audio.duration % 60);
            durationEl.innerText = `${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;
        }
    });
    
    // Reset when song ends
    audio.addEventListener('ended', () => {
        playBtn.innerText = '▶️';
        progressBar.value = 0;
    });
}

function restartSong() {
    const audio = document.getElementById('audio-player');
    audio.currentTime = 0;
    if (audio.paused) audio.play();
}

function skipForward() {
    const audio = document.getElementById('audio-player');
    audio.currentTime += 10; // Skip 10 seconds
}

function createConfetti() {
    const colors = ['❤️', '💖', '💕', '🌹', '🥰', '😍'];
    const container = document.body;
    const confettiCount = 60;

    for (let i = 0; i < confettiCount; i++) {
        const heart = document.createElement('div');
        heart.classList.add('confetti');
        heart.innerText = colors[Math.floor(Math.random() * colors.length)];
        
        // Random horizontal position (0 to 100vw)
        heart.style.left = Math.random() * 100 + 'vw';
        
        // Random animation speed (between 2s and 5s)
        const duration = Math.random() * 3 + 2;
        heart.style.animationDuration = duration + 's'; 
        
        // Random size variation
        const size = Math.random() * 1.5 + 1; // 1rem to 2.5rem
        heart.style.fontSize = size + 'rem';
        
        // Random delay so they don't all fall at exactly the same time
        heart.style.animationDelay = Math.random() * 0.5 + 's';

        container.appendChild(heart);

        // Remove the element from DOM after animation completes to prevent memory leaks
        setTimeout(() => {
            heart.remove();
        }, duration * 1000 + 1000); // Add 1s buffer
    }
}
