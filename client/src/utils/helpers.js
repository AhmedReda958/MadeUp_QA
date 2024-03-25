export const formatDate = (dateString) => {
  const options = {
    hour: "numeric",
    hour12: true,
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const copyToClipboard = (str) => {
  const legacyCopy = (str) => {
    const el = document.createElement("textarea");
    el.value = str;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    const selected =
      document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false;
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }
  };

  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(str);
  } else legacyCopy(str);
};

export const share = (url = null, title = null, text = null) => {
  if (navigator.share) {
    navigator.share({ url, title, text });
  } else {
    copyToClipboard(url);
    console.error("Native sharing is not supported");
  }
};

export const determineLoginType = (credentials) => {
  // Determine if the entered value is an email or mobile number
  const isEmail = /\S+@\S+\.\S+/.test(credentials.username);
  const isMobile = /^\d{10}$/.test(credentials.username);

  // You can customize this logic based on your requirements
  let loginData = {};
  if (isEmail) {
    loginData = {
      email: credentials.username,
      password: credentials.password,
    };
  } else if (isMobile) {
    loginData = {
      mobile: credentials.username,
      password: credentials.password,
    };
  } else {
    loginData = {
      username: credentials.username.toLowerCase(),
      password: credentials.password,
    };
  }

  return loginData;
};

export function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
