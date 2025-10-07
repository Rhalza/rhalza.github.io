document.addEventListener('DOMContentLoaded', () => {
    const songListContainer = document.getElementById('song-list');
    const defaultCover = 'media/covers/rhalza.png';
    let playlist = [];
    let currentSongIndex = -1;

    const playerCoverArt = document.getElementById('player-cover-art');
    const playerTitle = document.getElementById('player-title');
    const playerArtist = document.getElementById('player-artist');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const forwardBtn = document.getElementById('forward-btn');
    const backwardBtn = document.getElementById('backward-btn');

    const wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'rgba(255, 255, 255, 0.5)',
        progressColor: 'rgba(255, 255, 255, 0.9)',
        height: 45,
        barWidth: 3,
        barRadius: 3,
        cursorWidth: 2,
        cursorColor: '#ff4b5c',
        responsive: true,
        normalize: true,
        backend: 'MediaElement',
    });

    const ctx = document.createElement('canvas').getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, wavesurfer.options.height);
    gradient.addColorStop(0, '#ff4b5c');
    gradient.addColorStop(0.5, '#9a5fbd');
    gradient.addColorStop(1, '#7b68ee');
    wavesurfer.options.waveColor = gradient;
    wavesurfer.options.progressColor = gradient;

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const loadSong = (index) => {
        if (index < 0 || index >= playlist.length) return;
        
        currentSongIndex = index;
        const song = playlist[index];
        const audioPath = `audio/music/${song.audioFile}`;
        const coverPath = song.coverFile ? `media/covers/${song.coverFile}` : defaultCover;
        
        playerTitle.textContent = song.title;
        playerArtist.textContent = song.artist;
        playerCoverArt.src = coverPath;

        wavesurfer.load(audioPath);
 document.querySelectorAll('.song-item').forEach((item, idx) => {
            item.classList.toggle('playing', idx === currentSongIndex);
        });
    };

    const playNext = () => loadSong((currentSongIndex + 1) % playlist.length);
    const playPrev = () => loadSong((currentSongIndex - 1 + playlist.length) % playlist.length);

    playPauseBtn.addEventListener('click', () => wavesurfer.playPause());
    nextBtn.addEventListener('click', playNext);
    prevBtn.addEventListener('click', playPrev);
    forwardBtn.addEventListener('click', () => wavesurfer.skip(10));
    backwardBtn.addEventListener('click', () => wavesurfer.skip(-10));

    wavesurfer.on('play', () => playPauseBtn.textContent = '❚❚');
    wavesurfer.on('pause', () => playPauseBtn.textContent = '▶');
    wavesurfer.on('ready', () => {
        totalTimeEl.textContent = formatTime(wavesurfer.getDuration());
        wavesurfer.play();
    });
    wavesurfer.on('audioprocess', () => {
        currentTimeEl.textContent = formatTime(wavesurfer.getCurrentTime());
    });
    wavesurfer.on('finish', playNext);

    fetch('songs.json')
        .then(response => response.json())
        .then(data => {
            playlist = data;
            songListContainer.innerHTML = '';
            playlist.forEach((song, index) => {
                const coverPath = song.coverFile ? `media/covers/${song.coverFile}` : defaultCover;
                const songItem = document.createElement('div');
                songItem.className = 'song-item';
                songItem.innerHTML = `
                    <img src="${coverPath}" alt="${song.title}" class="song-item-cover">
                    <div class="song-item-info">
                        <span class="song-item-title">${song.title}</span>
                        <span class="song-item-artist">${song.artist}</span>
                    </div>
                `;
                songItem.addEventListener('click', () => loadSong(index));
                songListContainer.appendChild(songItem);
            });
        })
        .catch(error => {
            console.error('Error fetching songs.json:', error);
            songListContainer.textContent = 'Could not load music library.';
        });
});