const container = document.querySelector('.container');
const image = container.querySelector('#music-image');
const audio = container.querySelector('#audio');
const title = container.querySelector('#music-details .title');
const singer = container.querySelector('#music-details .singer');
const prev = container.querySelector('#controls #prev');
const play = container.querySelector('#controls #play');
const next = container.querySelector('#controls #next');
const progressBar = container.querySelector('#progress-bar');
const currentTime = container.querySelector('#current-time');
const duration = container.querySelector('#duration');
const volume = container.querySelector('#volume');
const volumeBar = container.querySelector('#volume-bar');
const ul = container.querySelector('ul');

const displayMusic = music => {
  image.src = 'img/' + music.img;
  audio.src = 'mp3/' + music.file;
  title.innerText = music.getName();
  singer.innerText = music.singer;
}

const playMusic = () => {
  container.classList.add('playing');
  play.querySelector('i').className = 'fa-solid fa-pause';
  audio.play();
}

const pauseMusic = () => {
  container.classList.remove('playing');
  play.querySelector('i').className = 'fa-solid fa-play';
  audio.pause();
}

const prevMusic = () => {
    player.prev();
    const music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlayingNow();
}

const nextMusic = () => {
    player.next();
    const music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlayingNow()
}

const calcTime = seconds => {
  let minutes = Math.floor(seconds / 60);
  let extraSeconds = Math.floor(seconds % 60);
  minutes = minutes < 10 ? "0" + minutes : minutes;
  extraSeconds = extraSeconds < 10 ? "0" + extraSeconds : extraSeconds;
  return minutes + ':' + extraSeconds;
}

const muteMusic = obj => {
    const { currVolume } = obj;
    volume.className = 'fa-solid fa-volume-high mx-2';
    audio.muted = false;
    audio.volume = currVolume / 100;
    volumeBar.value = currVolume;
}

const unmuteMusic = () => {
  volume.className = 'fa-solid fa-volume-xmark mx-2';
  audio.muted = true;
  audio.volume = 0;
  volumeBar.value = 0;
}

const displayMusicList = list => {
    ul.innerHTML = '';
    list.forEach((x, i) => {
        ul.innerHTML += `
        <li data-index="${i}" class="list-group-item d-flex justify-content-between align-items-center" onclick="selectedMusic(this)">
            <span>${x.title}</span>
            <span class="badge bg-primary rounded-pill"></span>
            <audio src="mp3/${x.file}"></audio>
        </li>`;
    });

    const audio = ul.querySelectorAll('li audio');
    audio.forEach((x, i) => {
        x.addEventListener('loadedmetadata', () => {
            x.previousElementSibling.innerText = calcTime(x.duration);
        });
    });
}

const selectedMusic = li => {
    player.index = Number(li.getAttribute('data-index'));
    displayMusic(player.getMusic());
    playMusic();
    isPlayingNow();
}

const isPlayingNow = () => {
    ul.querySelectorAll('li').forEach((x, i) => {
        if(x.classList.contains('playing')) {
            x.classList.remove('playing');
        }

        if(Number(x.getAttribute('data-index')) === player.index) {
            x.classList.add('playing');
        }
    });
}

const player = new Musicplayer(musicList);
let music = player.getMusic();
displayMusic(music);
displayMusicList(player.musicList);
isPlayingNow();

play.addEventListener('click', () => {
    const isMusicPlay = container.classList.contains('playing');
    isMusicPlay ? pauseMusic() : playMusic();
});

prev.addEventListener('click', () => { prevMusic(); });

next.addEventListener('click', () => { nextMusic(); });

audio.addEventListener('loadedmetadata', () => {
    progressBar.setAttribute('min', '0');
    progressBar.setAttribute('max', Math.floor(audio.duration).toString());
    duration.textContent = calcTime(progressBar.getAttribute('max'));
});

audio.addEventListener('timeupdate', () => {
    progressBar.value = Math.floor(audio.currentTime);
    currentTime.textContent = calcTime(progressBar.value);
});

progressBar.addEventListener('input', () => {
    currentTime.textContent = calcTime(progressBar.value);
    audio.currentTime = progressBar.value;
});

volume.addEventListener('click', e => {
    const isMuted = e.target.classList.contains('fa-volume-high');
    isMuted ? unmuteMusic() : muteMusic({ currVolume: 100 });
});

volumeBar.addEventListener('input', (e) => {
    const value = e.target.value;
    value === '0' ? unmuteMusic() : muteMusic({ currVolume: value });
});

audio.addEventListener('ended', () => {
    nextMusic();
});