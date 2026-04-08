const client = new StreamerbotClient();

document.addEventListener("DOMContentLoaded", () => {
  const template = document.getElementById("chat-template");
  const queue = [];
  let isShowing = false;

  const showNext = () => {
    if (queue.length > 0 && !isShowing) {
      isShowing = true;
      const data = queue.shift();

      // Clone the template
      const clone = template.content.cloneNode(true);
      const instance = clone.querySelector(".chat-instance");
      const nameEl = clone.querySelector(".name");
      const messageEl = clone.querySelector(".message");

      // Update the name
      nameEl.textContent = data.message.displayName;

      // Construct message from parts
      messageEl.textContent = data.parts
        .map((part) => (typeof part === "string" ? part : part.text || ""))
        .join("");

      // Append to body
      document.body.appendChild(instance);

      // Play sound
      const audio = new Audio("audio/floop.mp3");
      audio.play();

      // Remove after 10 seconds
      setTimeout(() => {
        instance.remove();
        isShowing = false;
        showNext(); // Show the next in queue
      }, 10000);
    }
  };

  // Subscribe to Twitch Chat messages and register an event handler
  client.on("Twitch.ChatMessage", ({ event, data }) => {
    queue.push(data);
    showNext();
  });
});
