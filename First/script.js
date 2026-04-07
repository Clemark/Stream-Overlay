// CONFIG
const client = new StreamerbotClient();

// FUNCTIONS

async function init() {
  await client.on("General.Custom", (payload) => {
    if (payload.data.event === "firstRedeem") {
      let username = payload.data.username;
      let pfpurl = payload.data.pfpurl;
      console.log(payload);

      highlight(username, pfpurl);
    }
  });
}

init();

function highlight(username, pfpurl) {
  let pfpdiv = document.querySelector(".profile");
  pfpdiv.src = pfpurl;
  let name = document.querySelector(".first");
  name.innerHTML = "FIRST: <span>" + username + "</span> is awesome"; // Set the username
}
