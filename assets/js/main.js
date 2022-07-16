/*
1. render songs
2. scroll top
3. play/pause/seek
4. cd rotate
5. next/prev
6. random
7. next/repeat when ended
8. active song
9. scroll active song into view
10. play song when click
*/
const PLAYER_STORAGE_KEY='Music_Player';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('.cd-name');
const cdThumb = $('.cd-thumb');
const dashWrapper=$('.dashboard .wrapper');
const cd = $('.dashboard__cd');
const audio = $('#audio');
const togglePlay = $('.control-toggle');
const progress = $('#progress');
const nextBtn = $('.next-icon');
const prevBtn = $('.prev-icon');
const shuffleBtn = $('.shuffle-icon');
const replayBtn = $('.replay-icon');
const playlist = $('.playlist__list');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isReplay: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))||{},

    setConfig: function(key, value){
        this.config[key]=value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    songs: [
        {
            name: 'Song1',
            singer: 'singer1',
            url: '/assets/music/Chay-Khoi-The-Gioi-Nay-Da-LAB-Phuong-Ly.mp3',
            image: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg'
        },
        {
            name: 'Song2',
            singer: 'singer2',
            url: '/assets/music/Chay-Khoi-The-Gioi-Nay-Da-LAB-Phuong-Ly.mp3',
            image: 'https://static.remove.bg/remove-bg-web/5c20d2ecc9ddb1b6c85540a333ec65e2c616dbbd/assets/start-1abfb4fe2980eabfbbaaa4365a0692539f7cd2725f324f904565a9a744f8e214.jpg'
        },
        {
            name: 'Song3',
            singer: 'singer3',
            url: '/assets/music/Chay-Khoi-The-Gioi-Nay-Da-LAB-Phuong-Ly.mp3',
            image: 'https://www.w3schools.com/w3css/img_lights.jpg'
        },
        {
            name: 'Song4',
            singer: 'singer4',
            url: '/assets/music/Chay-Khoi-The-Gioi-Nay-Da-LAB-Phuong-Ly.mp3',
            image: 'https://www.w3schools.com/w3css/img_lights.jpg'
        },
        {
            name: 'Song5',
            singer: 'singer5',
            url: '/assets/music/Chay-Khoi-The-Gioi-Nay-Da-LAB-Phuong-Ly.mp3',
            image: 'https://www.w3schools.com/w3css/img_lights.jpg'
        },
        {
            name: 'Song6',
            singer: 'singer6',
            url: '/assets/music/Chay-Khoi-The-Gioi-Nay-Da-LAB-Phuong-Ly.mp3',
            image: 'https://www.w3schools.com/w3css/img_lights.jpg'
        },
        {
            name: 'Song7',
            singer: 'singer7',
            url: '/assets/music/Chay-Khoi-The-Gioi-Nay-Da-LAB-Phuong-Ly.mp3',
            image: 'https://www.w3schools.com/w3css/img_lights.jpg'
        },
        {
            name: 'Song8',
            singer: 'singer8',
            url: '/assets/music/Chay-Khoi-The-Gioi-Nay-Da-LAB-Phuong-Ly.mp3',
            image: 'https://www.w3schools.com/w3css/img_lights.jpg'
        },
        {
            name: 'Song9',
            singer: 'singer9',
            url: '/assets/music/Chay-Khoi-The-Gioi-Nay-Da-LAB-Phuong-Ly.mp3',
            image: 'https://www.w3schools.com/w3css/img_lights.jpg'
        },
        {
            name: 'Song10',
            singer: 'singer10',
            url: '/assets/music/Chay-Khoi-The-Gioi-Nay-Da-LAB-Phuong-Ly.mp3',
            image: 'https://www.w3schools.com/w3css/img_lights.jpg'
        }
    ],

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function () {
        //stretch/skrink cd
        const cdWidth = cdThumb.offsetWidth;
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
            const newPadding=dashWrapper.offsetTop - scrollTop;
            dashWrapper.style.paddingTop= newPadding > 10 ? newPadding + 'px' : 10;
        }

        //play/pause audio
        togglePlay.onclick = function () {
            if (app.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        audio.onplay = function () {
            app.isPlaying = true;
            togglePlay.classList.add('playing');
            cdAnimate.play();
        }
        audio.onpause = function () {
            app.isPlaying = false;
            togglePlay.classList.remove('playing');
            cdAnimate.pause();
        }

        //cd rotation
        const cdAnimate = cdThumb.animate([{
            transform: 'borderRadius(50%) rotate(360deg)'
        }], {
            duration: 10000, //10 seconds
            iterations: Infinity
        })
        cdAnimate.pause();

        //time update
        audio.ontimeupdate = function () {
            if (audio.duration) {
                progress.value = Math.floor(audio.currentTime / audio.duration * 100);
            }
        }

        //seek song
        progress.oninput = function () {
            const seekTime = progress.value * audio.duration / 100;
            audio.currentTime = seekTime;
        }

        //next song
        nextBtn.onclick = function () {
            if (app.isRandom) {
                app.randomSong();
            } else {
                app.nextSong();
            }
            audio.play();
        }

        //previous song
        prevBtn.onclick = function () {
            if (app.isRandom) {
                app.randomSong();
            } else {
                app.prevSong();
            }
            audio.play();
        }

        //random song
        shuffleBtn.onclick = function () {
            app.isRandom = !app.isRandom;
            app.setConfig('isRandom',app.isRandom);
            shuffleBtn.classList.toggle('active', app.isRandom);
        }

        //replay song
        replayBtn.onclick = function () {
            app.isReplay = !app.isReplay;
            app.setConfig('isReplay',app.isReplay);
            replayBtn.classList.toggle('active', app.isReplay);
        }

        //next song when ended
        audio.onended = function () {
            if (app.isReplay) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        //listen when click a song
        playlist.onclick = function (e) {
            const chosenSong = e.target.closest('.playlist__item:not(.active)');
            if(chosenSong){
                app.currentIndex=Number(chosenSong.dataset.index);
                app.loadCurrentSong();
                app.render();
                audio.play();
            }
        }
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.url;
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="playlist__item ${index === this.currentIndex ?'active' : ''}" data-index="${index}">
              <div
                class="song__thumb"
                style="
                  background: url('${song.image}')
                    top center / cover;
                "
              ></div>
              <div class="song__body">
                <h3 class="body__title">${song.name}</h3>
                <p class="body__author">${song.singer}</p>
              </div>
              <div class="song__duration">
                <small>03:57</small>
              </div>
            </div>
            `
        });
        playlist.innerHTML = htmls.join('');
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
        this.render();
        this.scrollToActiveSong();
    },

    prevSong: function () {
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length;
        }
        this.currentIndex--;
        this.loadCurrentSong();
        this.render();
        this.scrollToActiveSong();
    },

    randomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * app.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    scrollToActiveSong: function () {
        $('.playlist__item.active').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    },

    loadConfig:function(){
        this.isRandom=this.config.isRandom;
        this.isReplay=this.config.isReplay;
    },

    start: function () {
        //load cau hinh
        this.loadConfig();

        //dinh nghia thuoc tinh cho object
        this.defineProperties();

        //lang nghe, xu ly su kien DOM events
        this.handleEvents();

        //tai bai hat hien tai
        this.loadCurrentSong();

        //render playlist
        this.render();

        //hien thi trang thai config
        shuffleBtn.classList.toggle('active', app.isRandom);
        replayBtn.classList.toggle('active', app.isReplay);
    }
}

app.start();


