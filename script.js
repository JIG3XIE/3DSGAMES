let selectedGame = null;

// These are SHA-256 hashed versions of your codes.
// Do NOT put your real codes directly here.
const games = {
  "galaxy-runner": {
    title: "Galaxy Runner 3D",
    qrImage: "images/game1-qr.png",
    validCodeHashes: [
      "PUT_HASHED_CODE_HERE",
      "PUT_ANOTHER_HASHED_CODE_HERE"
    ]
  },

  "zombie-hallway": {
    title: "Zombie Hallway",
    qrImage: "images/game2-qr.png",
    validCodeHashes: [
      "PUT_HASHED_CODE_HERE"
    ]
  }
};

function openUnlock(gameId) {
  selectedGame = gameId;

  const popup = document.getElementById("popup");
  const title = document.getElementById("popup-title");
  const message = document.getElementById("message");
  const input = document.getElementById("code-input");
  const qrSection = document.getElementById("qr-section");

  title.textContent = "Unlock " + games[gameId].title;
  message.textContent = "";
  input.value = "";
  qrSection.classList.add("hidden");

  popup.classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

async function checkCode() {
  const input = document.getElementById("code-input").value.trim();
  const message = document.getElementById("message");
  const qrSection = document.getElementById("qr-section");
  const qrImage = document.getElementById("qr-image");

  if (!selectedGame) {
    message.textContent = "No game selected.";
    message.style.color = "#f87171";
    return;
  }

  if (input === "") {
    message.textContent = "Please enter a code.";
    message.style.color = "#f87171";
    return;
  }

  const enteredHash = await sha256(input);
  const game = games[selectedGame];

  if (game.validCodeHashes.includes(enteredHash)) {
    message.textContent = "Code accepted.";
    message.style.color = "#4ade80";

    qrImage.src = game.qrImage;
    qrSection.classList.remove("hidden");
  } else {
    message.textContent = "Invalid code.";
    message.style.color = "#f87171";
    qrSection.classList.add("hidden");
  }
}

async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}
