////////////////////
// CONFIG
////////////////////
const client = initStreamerbotConnection();
const sound = new Audio("audio/Notification.wav");

////////////////////
// FUNCTIONS
////////////////////

async function init() {
  await client.on("General.Custom", (payload) => {
    if (payload.data.event === "attendanceRedeem") {
      let username = payload.data.username;
      let pfpurl = payload.data.pfpurl;
      let gamecategory = payload.data.category;
      console.log(payload);

      steamOnline(username, pfpurl, gamecategory);
    }
  });
}

init();

function steamOnline(username, pfpurl, gamecategory) {
  let pfpdiv = document.querySelector(".profile-picture");
  pfpdiv.src = pfpurl;
  let name = document.querySelector(".username");
  let category = document.querySelector(".category");
  name.innerHTML = username; // Set the username
  category.innerHTML = gamecategory; // Set the category

  triggerSlide();
}

function triggerSlide() {
  sound.play();

  const element = document.getElementById("steam-container");
  element.classList.toggle("active");

  // hide after 3 seconds
  setTimeout(() => {
    element.classList.remove("active");
  }, 3000);
}
