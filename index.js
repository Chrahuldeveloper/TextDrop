import { deflate, inflate } from "https://cdn.skypack.dev/pako";

const editor = document.querySelector('[contenteditable="true"]');


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then(() => {
      console.log("sw reg done")
    }).catch((err) => {
      console.log(err, "reg not done")
    })
  })
}


function deCompress(base64) {
  try {
    if (!base64) return "";
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    console.log(padded)
    const bytes = Uint8Array.from(atob(padded), c => c.charCodeAt(0));
    const original = inflate(bytes, { to: "string" });
    return original;
  } catch (err) {
    console.error("Failed to decompress:", err);
    return "";
  }
}

window.addEventListener("load", () => {
  const hash = window.location.hash.slice(1);
  if(hash){
    editor.innerHTML = deCompress(hash);
  }
  editor.innerHTML = "Start writing"

});

function compress(text) {
  const compressed = deflate(text);
  const base64 = btoa(String.fromCharCode(...compressed));
  window.location.hash = base64;
  return base64;
}

let userTyping;
document.addEventListener("input", () => {
  clearTimeout(userTyping);
  userTyping = setTimeout(() => {
    compress(editor.innerHTML);
  }, 1000);
});
