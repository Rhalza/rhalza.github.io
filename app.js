document.addEventListener('DOMContentLoaded', () => {
    
    const canvas = document.getElementById('animated-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let particlesArray;

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size; this.color = color;
            }
            draw() {
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); ctx.fillStyle = this.color; ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
                this.x += this.directionX; this.y += this.directionY; this.draw();
            }
        }

        function init() {
            particlesArray = [];
            const numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                const size = (Math.random() * 4) + 1;
                const x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                const y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                const directionX = (Math.random() * 0.4) - 0.2;
                const directionY = (Math.random() * 0.4) - 0.2;
                particlesArray.push(new Particle(x, y, directionX, directionY, size, 'rgba(255, 255, 255, 0.3)'));
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            particlesArray.forEach(p => p.update());
        }

        init(); animate();
        window.addEventListener('resize', () => { canvas.width = innerWidth; canvas.height = innerHeight; init(); });
    }

    class MusicPlayer {
        constructor() {
            this.audio = new Audio();
            this.audio.crossOrigin = "anonymous";
            this.currentSongIndex = -1;
            this.songs = [];
            this.isPlaying = false;
            this.audioContext = null;
            this.analyser = null;
            this.source = null;
            this.animationFrameId = null;

            this.dom = {
                playPauseBtn: document.getElementById('play-pause-btn'),
                prevBtn: document.getElementById('prev-btn'),
                nextBtn: document.getElementById('next-btn'),
                volumeSlider: document.getElementById('volume-slider'),
                muteBtn: document.getElementById('mute-btn'),
                playerCover: document.getElementById('player-cover'),
                songTitle: document.getElementById('song-title'),
                songArtist: document.getElementById('song-artist'),
                currentTime: document.getElementById('current-time'),
                duration: document.getElementById('duration'),
                songList: document.getElementById('song-list'),
                progressContainer: document.getElementById('progress-container'),
                spectrumCanvas: document.getElementById('spectrum-canvas'),
                progressBarPlayed: document.getElementById('progress-bar-played')
            };
            
            this.spectrumCtx = this.dom.spectrumCanvas.getContext('2d');

            this.fetchSongs().then(() => { 
                this.loadState();
                this.attachEvents(); 
            });
        }

        saveState() {
            const state = {
                currentSongIndex: this.currentSongIndex,
                currentTime: this.audio.currentTime,
                isPlaying: this.isPlaying,
                volume: this.audio.volume,
                muted: this.audio.muted
            };
            localStorage.setItem('rhalzaVibesState', JSON.stringify(state));
        }

        loadState() {
            const stateJSON = localStorage.getItem('rhalzaVibesState');
            if (stateJSON) {
                const state = JSON.parse(stateJSON);

                this.currentSongIndex = state.currentSongIndex;
                this.audio.volume = state.volume;
                this.dom.volumeSlider.value = state.volume;
                this.audio.muted = state.muted;
                this.updateMuteIcon();

                if (this.currentSongIndex !== -1) {
                    const song = this.songs[this.currentSongIndex];
                    this.audio.src = song.url;
                    this.updatePlayerUI(song);
                    
                    this.audio.addEventListener('canplay', () => {
                        this.audio.currentTime = state.currentTime;
                        if (state.isPlaying) {
                            this.play();
                        }
                    }, { once: true });
                }
            }
        }

        syncState(state) {
            if (this.currentSongIndex !== state.currentSongIndex) {
                this.loadSong(state.currentSongIndex, false);
            }
            this.audio.currentTime = state.currentTime;
            state.isPlaying ? this.play() : this.pause();
        }

        setupAudioContext() {
            if (this.audioContext) return;
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.source = this.audioContext.createMediaElementSource(this.audio);
            this.source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
        }

        async fetchSongs() {
            try {
                const response = await fetch('config.json');
                const data = await response.json();
                this.songs = data.songs;
                if (this.dom.songList) this.populateSongList();
            } catch (error) { console.error("Could not fetch songs config:", error); }
        }

        populateSongList() {
            this.dom.songList.innerHTML = '';
            this.songs.forEach((song, index) => {
                const listItem = document.createElement('li');
                listItem.classList.add('song-item');
                listItem.setAttribute('data-index', index);
                listItem.innerHTML = `<img src="${song.cover || 'rhalza.png'}" alt="${song.title}" class="song-item-cover"><div class="song-item-info"><h3>${song.title}</h3><p>${song.artist}</p></div>`;
                listItem.addEventListener('click', () => this.loadSong(index));
                this.dom.songList.appendChild(listItem);
            });
        }

        attachEvents() {
            this.dom.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
            this.dom.prevBtn.addEventListener('click', () => this.playPrevious());
            this.dom.nextBtn.addEventListener('click', () => this.playNext());
            this.dom.volumeSlider.addEventListener('input', () => this.setVolume());
            this.dom.muteBtn.addEventListener('click', () => this.toggleMute());
            this.dom.progressContainer.addEventListener('click', (e) => this.seek(e));
            
            this.audio.addEventListener('timeupdate', () => {
                this.updateProgress();
                this.saveState();
            });
            this.audio.addEventListener('loadedmetadata', () => this.updateProgress());
            this.audio.addEventListener('ended', () => this.playNext());

            window.addEventListener('storage', (e) => { if (e.key === 'rhalzaVibesState') this.syncState(JSON.parse(e.newValue)); });
        }

        loadSong(index, shouldPlay = true) {
            if (index < 0 || index >= this.songs.length) return;
            this.currentSongIndex = index;
            const song = this.songs[this.currentSongIndex];
            this.audio.src = song.url;
            this.updatePlayerUI(song);
            if (shouldPlay) this.play(); else this.saveState();
        }

        play() {
            this.setupAudioContext();
            if (this.currentSongIndex === -1 && this.songs.length > 0) { this.loadSong(0); return; }
            this.isPlaying = true;
            this.audio.play();
            this.dom.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            this.visualize();
            this.saveState();
        }

        pause() {
            this.isPlaying = false;
            this.audio.pause();
            this.dom.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            cancelAnimationFrame(this.animationFrameId);
            this.saveState();
        }

        visualize() {
            const bufferLength = this.analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            this.analyser.getByteFrequencyData(dataArray);

            const canvas = this.dom.spectrumCanvas;
            const ctx = this.spectrumCtx;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 1.5;
            let x = 0;
            const color = this.songs[this.currentSongIndex]?.spectrumColor || '#FFFFFF';

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * canvas.height;
                ctx.fillStyle = color;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
            this.animationFrameId = requestAnimationFrame(() => this.visualize());
        }

        togglePlayPause() { this.isPlaying ? this.pause() : this.play(); }
        playPrevious() { this.loadSong((this.currentSongIndex - 1 + this.songs.length) % this.songs.length); }
        playNext() { this.loadSong((this.currentSongIndex + 1) % this.songs.length); }

        updateProgress() {
            if (this.audio.duration) {
                const progressPercent = (this.audio.currentTime / this.audio.duration) * 100;
                this.dom.progressBarPlayed.style.width = `${progressPercent}%`;
                this.dom.currentTime.textContent = this.formatTime(this.audio.currentTime);
                this.dom.duration.textContent = this.formatTime(this.audio.duration);
            }
        }

        seek(e) {
            const width = this.dom.progressContainer.clientWidth;
            const clickX = e.offsetX;
            this.audio.currentTime = (clickX / width) * this.audio.duration;
        }

        setVolume() {
            this.audio.volume = this.dom.volumeSlider.value;
            this.audio.muted = this.audio.volume === 0;
            this.updateMuteIcon();
            this.saveState();
        }

        toggleMute() {
            this.audio.muted = !this.audio.muted;
            this.updateMuteIcon();
            this.saveState();
        }

        updateMuteIcon() {
            const icon = this.audio.muted || this.audio.volume === 0 ? 'fa-volume-xmark' : 'fa-volume-high';
            this.dom.muteBtn.innerHTML = `<i class="fas ${icon}"></i>`;
        }

        updatePlayerUI(song) {
            this.dom.playerCover.src = song.cover || 'rhalza.png';
            this.dom.songTitle.textContent = song.title;
            this.dom.songArtist.textContent = song.artist;
        }



        formatTime(seconds) {
            const min = Math.floor(seconds / 60);
            const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
            return `${min}:${sec}`;
        }
    }

    new MusicPlayer();
});