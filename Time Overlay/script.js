function updateClock() {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  let hour12 = now.getHours() % 12;
  if (hour12 === 0) hour12 = 12;
  const ampm = now.getHours() < 12 ? "AM" : "PM";

  let timeElement = document.getElementById("time");
  if (timeElement) {
    timeElement.textContent = `${String(hour12).padStart(2, "0")}:${minutes} ${ampm}`;
  }
}

updateClock();
setInterval(updateClock, 1000);
