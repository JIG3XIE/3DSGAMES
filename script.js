const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxEKxNFSRjOJW5xdSV-ixOda6sN-5ZJV5h688wE315b8b0MdJ6qts7Cd3UOeySywUJvRA/exec";

let selectedGameId = null;
let selectedGameTitle = null;

function openUnlock(gameId, gameTitle) {
  selectedGameId = gameId;
  selectedGameTitle = gameTitle;

  document.getElementById("popup-title").textContent = "Unlock " + gameTitle;
  document.getElementById("code-input").value = "";
  document.getElementById("message").textContent = "";
  document.getElementById("qr-section").classList.add("hidden");
  document.getElementById("popup").classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

async function redeemCode() {
  const codeInput = document.getElementById("code-input");
  const message = document.getElementById("message");
  const submitBtn = document.getElementById("submit-btn");
  const qrSection = document.getElementById("qr-section");
  const qrImage = document.getElementById("qr-image");
  const qrTitle = document.getElementById("qr-title");
  const usesLeft = document.getElementById("uses-left");

  const code = codeInput.value.trim();

  if (!selectedGameId) {
    showMessage("No game selected.", "error");
    return;
  }

  if (!code) {
    showMessage("Please enter a code.", "error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Checking...";
  qrSection.classList.add("hidden");

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        code: code,
        gameId: selectedGameId
      })
    });

    const result = await response.json();

    if (result.success) {
      showMessage(result.message, "success");

      qrTitle.textContent = result.gameTitle + " QR Code";
      qrImage.src = result.qrImage;
      usesLeft.textContent = "Uses left on this code: " + result.usesLeft;

      qrSection.classList.remove("hidden");
    } else {
      showMessage(result.message, "error");
    }

  } catch (error) {
    showMessage("Connection error. Please try again.", "error");
    console.error(error);
  }

  submitBtn.disabled = false;
  submitBtn.textContent = "Submit Code";
}

function showMessage(text, type) {
  const message = document.getElementById("message");

  message.textContent = text;

  if (type === "success") {
    message.style.color = "#4ade80";
  } else {
    message.style.color = "#f87171";
  }
}
