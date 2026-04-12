// Shared Streamer.Bot connection helper for overlay pages.

function setStreamerbotConnectionStatus(connected, elementId = "connection-status") {
  const connectionStatus = document.getElementById(elementId);
  if (!connectionStatus) {
    return;
  }

  if (connected) {
    connectionStatus.innerText = "Connected!";
    connectionStatus.classList.add("connected");
  } else {
    connectionStatus.innerText = "Connecting...";
    connectionStatus.classList.remove("connected");
  }
}

function createStreamerbotClient(options = {}) {
  const {
    host = "127.0.0.1",
    port = "8080",
    statusElementId = "connection-status",
    onConnect,
    onDisconnect,
    ...rest
  } = options;

  return new StreamerbotClient({
    host,
    port,
    onConnect: (data) => {
      setStreamerbotConnectionStatus(true, statusElementId);
      if (typeof onConnect === "function") {
        onConnect(data);
      }
    },
    onDisconnect: () => {
      setStreamerbotConnectionStatus(false, statusElementId);
      if (typeof onDisconnect === "function") {
        onDisconnect();
      }
    },
    ...rest,
  });
}

function initStreamerbotConnection(options = {}) {
  return createStreamerbotClient(options);
}
