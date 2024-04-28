let currFolder;
let songs;

const getsongs = async (folder) => {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/Songs/${currFolder}/`);
  let res = await a.text();
  let div = document.createElement("div");
  div.innerHTML = res;

  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${currFolder}/`)[1]);
    }
  }
  let songul = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  songul.innerHTML = "";

  for (const song of songs) {
    songul.innerHTML =
      songul.innerHTML +
      `<li>
     
                <img class="invert" src="music.svg" alt="" />
                <div class="info">
                  <p>${song.replaceAll("%20", " ")}</p>
                  <p>song artist</p>
                </div>
                <div class="playnow">
                  <span>play now</span>
                  <img class="invert" src="play.svg" alt="" />
                </div>
              
      </li>`;
  }

  let songli = Array.from(document.querySelectorAll(".songlist li"));
  songli.forEach((e) => {
    e.addEventListener("click", (elm) => {
      console.log(
        e.getElementsByTagName("div")[0].getElementsByTagName("p")[0].innerHTML
      );

      playMusic(
        e.getElementsByTagName("div")[0].getElementsByTagName("p")[0].innerHTML
      );
    });
  });
  return songs
};

//
function formatSeconds(seconds) {
  // Calculate minutes and seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Add leading zero if necessary
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  // Combine minutes and seconds
  const formattedTime = `${formattedMinutes}:${formattedSeconds}`;

  return formattedTime;
}
//

let currentSong = new Audio(); //
///
let playMusic = async (music, pause = false) => {
  // let audio = await new Audio("/Songs/" + music);
  currentSong.src = `Songs/${currFolder}/` + music;
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(music);
  document.querySelector(".songtime").innerHTML = "00:00";
};

async function displayalbum() {
  let a = await fetch(`http://127.0.0.1:3000/Songs/`);
  let res = await a.text();
  let div = document.createElement("div");
  div.innerHTML = res;
  let allas = div.getElementsByTagName("a");
  let folders = [];
  let array = Array.from(allas);
  for (let index = 0; index < array.length; index++) {
    const element = array[index];

    // console.log(element.href);
    if (element.href.includes("/Songs")) {
      let folder = element.href.split("/").slice(-2)[0];

      let a = await fetch(`http://127.0.0.1:3000/Songs/${folder}/info.json`);
      let res = await a.json();
      let cardContainer = document.querySelector(".cardContainer");
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `
            <div data-folder="${folder}" class="card">
              <div class="play">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 20V4L19 12L5 20Z"
                    stroke="#141B34"
                    stroke-width="1.5"
                    fill=" #000"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <img src="/Songs/${folder}/lofi.jpg" alt="" />
              <h2>${res.title}</h2>
              <p>${res.description}</p>
            </div>`;
    }

    Array.from(document.getElementsByClassName("card")).forEach((element) => {
      element.addEventListener("click", async (item) => {
        songs = await getsongs(`${item.currentTarget.dataset.folder}`);
        playMusic(songs[0])
      });
    });
  }
}

async function main() {
  await getsongs("ncs");
  // console.log(songs[0]);
  playMusic(songs[0], true);
  displayalbum();
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    //////
    // console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${formatSeconds(
      Math.floor(currentSong.currentTime)
    )}/${formatSeconds(Math.floor(currentSong.duration))}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let songPercent =
      (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = songPercent + "%";
    currentSong.currentTime = (currentSong.duration * songPercent) / 100;
  });

  //add event listner for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    console.log("hamburger pe click ho gaya ryyy");
    document.querySelector(".left").style.left = 0;
  });
  //add close
  document.querySelector("#close").addEventListener("click", () => {
    document.querySelector(".left").style.left = -100 + "%";
  });

  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    // currentSong.pause();
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  document.querySelector(".volrange").addEventListener("change", (e) => {
    currentSong.volume = Number(e.target.value) / 100;
  });

  document.querySelector(".volbox > img").addEventListener("click", (e) => {
    if (e.target.src.endsWith("volume.svg")) {
      e.target.src = `http://127.0.0.1:3000/mute.svg`;
      currentSong.volume = 0;
      document.querySelector(".volrange").value = 0;
      console.log(e.target.src);
    } else if (e.target.src.endsWith("mute.svg")) {
      e.target.src = `http://127.0.0.1:3000/volume.svg`;
      currentSong.volume = 0.1;
      document.querySelector(".volrange").value = 20;
    }
  });
}
main();
