const client = initStreamerbotConnection();

document.addEventListener("DOMContentLoaded", () => {
  const template = document.getElementById("chat-template");
  const queue = [];
  let isShowing = false;
  const avatarMap = new Map();

  const fetchAvatarUrl = async (username) => {
    if (avatarMap.has(username)) {
      return avatarMap.get(username);
    }

    try {
      console.debug(`Retrieving avatar from Decapi for ${username}.`);
      let response = await fetch("https://decapi.me/twitch/avatar/" + username);
      let data = await response.text();
      avatarMap.set(username, data);
      return data;
    } catch (error) {
      console.error(`Error fetching avatar for ${username}:`, error);
      return "https://via.placeholder.com/70";
    }
  };

  const showNext = async () => {
    if (queue.length > 0 && !isShowing) {
      isShowing = true;
      const data = queue.shift();

      // Clone the template
      const clone = template.content.cloneNode(true);
      const chatUsername = clone.querySelector(".name");
      const chatMessage = clone.querySelector(".message");
      const userProfile = clone.querySelector(".profpic");

      // Fetch the actual avatar URL from DecAPI
      const avatarUrl = await fetchAvatarUrl(data.user.login);
      userProfile.src = avatarUrl;

      // Update the name
      chatUsername.textContent = data.message.displayName;
      chatUsername.style.backgroundColor = data.user.color;

      // Update the badge based on user role
      const badge = clone.querySelector(".badge");
      if (data.user.role === 3) {
        badge.textContent = "VIP";
        badge.style.backgroundColor = "purple";
      } else if (data.user.role === 4) {
        badge.textContent = "MOD";
        badge.style.backgroundColor = "green";
      } else if (data.user.role === 1 || data.user.role === 2) {
        badge.style.display = "none";
      }

      // Update subscription months
      const sub = clone.querySelector(".sub");
      if (data.user.monthsSubscribed) {
        sub.textContent = data.user.monthsSubscribed + " months";
      }
      chatMessage.textContent = data.parts
        .map((part) => (typeof part === "string" ? part : part.text || ""))
        .join("");

      // Create a wrapper to contain the cloned template elements
      const wrapper = document.createElement("div");
      wrapper.className = "chat-template";
      wrapper.appendChild(clone);

      // Append the wrapper to body
      document.body.appendChild(wrapper);

      // Play sound
      const audio = new Audio("audio/floop.mp3");
      audio.play();

      // Remove after 10 seconds
      setTimeout(() => {
        wrapper.remove();
        isShowing = false;
        showNext(); // Show the next in queue
      }, 10000);
    }
  };

  // Subscribe to Twitch Chat messages and register an event handler
  client.on("Twitch.ChatMessage", ({ event, data }) => {
    const blockedBots = ["streamelements", "kofibot", "serybot"];
    if (blockedBots.includes(data.user.login)) {
      return;
    }
    queue.push(data);
    console.log(data);
    showNext();
  });
});
