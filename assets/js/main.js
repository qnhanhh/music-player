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

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const cd = $('.dashboard__cd');
const audio = $('#audio');
const togglePlay = $('.control-toggle');
const progress=$('#progress');
const nextBtn=$('.next-icon');
const prevBtn=$('.prev-icon');
const shuffleBtn=$('.shuffle-icon');

const app = {
    currentIndex: 0,
    isPlaying: false,
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
        const cdWidth = cd.offsetWidth;
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
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
        const cdAnimate=cdThumb.animate([{
            transform:'rotate(360deg)'
        }],{
            duration:10000, //10 seconds
            iterations:Infinity
        })
        cdAnimate.pause();

        //time update
        audio.ontimeupdate=function(){
            if(audio.duration){
                progress.value=Math.floor(audio.currentTime / audio.duration * 100);
            }
        }

        //seek song
        progress.oninput=function(){
            const seekTime=progress.value * audio.duration / 100;
            audio.currentTime=seekTime;
        }

        //next song
        nextBtn.onclick=function(){
            app.nextSong();
            audio.play();
        }

        //previous song
        prevBtn.onclick=function(){
            app.prevSong();
            audio.play();
        }
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.url;
    },

    render: function () {
        const htmls = this.songs.map(song => {
            return `
            <div class="playlist__item">
                <div class="song__thumb" style="background: url('${song.image}') top center /cover;"></div>
                <div class="song__body">
                    <h3 class="body__title">${song.name}</h3>
                    <p class="body__author">${song.singer}</p>
                </div>
                <div class="song__option">
                    <i class="option-icon fa-solid fa-ellipsis"></i>
                </div>
            </div>
            `
        });
        $('.playlist__list').innerHTML = htmls.join(' ');
    },

    nextSong:function(){
        this.currentIndex++;
        if(this.currentIndex>=this.songs.length){
            this.currentIndex=0;
        }
        this.loadCurrentSong();
    },

    prevSong:function(){
        if(this.currentIndex<0){
            this.currentIndex=this.songs.length;
        }
        this.currentIndex--;
        this.loadCurrentSong();
    },

    start: function () {
        //dinh nghia thuoc tinh cho object
        this.defineProperties();

        //lang nghe, xu ly su kien DOM events
        this.handleEvents();

        //tai bai hat hien tai
        this.loadCurrentSong();

        //render playlist
        this.render();
    }
}

app.start();


