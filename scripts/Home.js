const tracks = [
  document.getElementById("trackA"),
  document.getElementById("trackB")
];

let currentFiles = [];

function addImage(track, file) {
  const frame = document.createElement("div");
  frame.className = "frame";

  const img = document.createElement("img");
  img.src = "images/gallery/" + file;

  frame.appendChild(img);
  track.appendChild(frame);
}

async function loadReels() {
  try {
    const res = await fetch("images.json");
    const files = await res.json();

    currentFiles = files;

    tracks.forEach(track => {
      files.forEach(f => addImage(track, f));
      files.forEach(f => addImage(track, f)); // duplicate for seamless loop
    });

    buildBackgroundCollage(files);

  } catch (err) {
    console.error("Failed to load images.json", err);
  }
}


/* Evenly spread blurred collage */
function buildBackgroundCollage(files) {
  const container = document.getElementById("bg-collage");
  container.innerHTML = "";

  const imgW = 240;
  const imgH = 180;

  const cols = Math.ceil(window.innerWidth / imgW);
  const rows = Math.ceil(window.innerHeight / imgH);

  const totalNeeded = cols * rows;

  for (let i = 0; i < totalNeeded; i++) {
    const img = document.createElement("img");
    const file = files[i % files.length];

    img.src = "images/gallery/" + file;

    const col = i % cols;
    const row = Math.floor(i / cols);

    let x = col * imgW;
    let y = row * imgH;

    // small organic randomness
    x += (Math.random() - 0.5) * 40;
    y += (Math.random() - 0.5) * 40;

    img.style.left = x + "px";
    img.style.top = y + "px";
    img.style.transform += ` rotate(${Math.random() * 10 - 5}deg)`;

    container.appendChild(img);
  }
}


/* Rebuild collage on resize */
window.addEventListener("resize", () => {
  if (currentFiles.length) {
    buildBackgroundCollage(currentFiles);
  }
});

document.addEventListener("DOMContentLoaded", loadReels);
