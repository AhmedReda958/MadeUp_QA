// Register SW, Register Push, Send Push
async function send() {
  const register = await navigator.serviceWorker.register("/serviceWorker.js", {
    scope: "/",
  });
}

const registerSW = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      send().catch((err) => console.error(err));
    });
  }
};

export default registerSW;
