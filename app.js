const bgInput = document.getElementById("bgInput");
const logoInput = document.getElementById("logoInput");

const fontSize = document.getElementById("fontSize");
const lineHeight = document.getElementById("lineHeight");
const maxWidth = document.getElementById("maxWidth");

const textPosX = document.getElementById("textPosX");
const textPosY = document.getElementById("textPosY");

const darkBg = document.getElementById("darkBg");
const textStroke = document.getElementById("textStroke");
const autoFit = document.getElementById("autoFit");

const normalColor = document.getElementById("normalColor");
const meColor = document.getElementById("meColor");
const doColor = document.getElementById("doColor");

const canvasW = document.getElementById("canvasW");
const canvasH = document.getElementById("canvasH");

const logoSize = document.getElementById("logoSize");
const logoPosX = document.getElementById("logoPosX");
const logoPosY = document.getElementById("logoPosY");

const logInput = document.getElementById("logInput");
const logPreview = document.getElementById("logPreview");

const bgImage = document.getElementById("bgImage");
const logoImage = document.getElementById("logoImage");
const canvasArea = document.getElementById("canvasArea");
const canvasWrap = document.getElementById("canvasWrap");
const textLayer = document.getElementById("textLayer");
const overlay = document.getElementById("overlay");

const overlayOpacity = document.getElementById("overlayOpacity");
const blurAmount = document.getElementById("blurAmount");
const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");

const fitBtn = document.getElementById("fitBtn");
const savePngBtn = document.getElementById("savePngBtn");
const savePngBtn2 = document.getElementById("savePngBtn2");

function readImage(file, callback) {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    callback(e.target.result);
  };

  reader.readAsDataURL(file);
}

bgInput.addEventListener("change", function () {
  readImage(bgInput.files[0], function (src) {
    bgImage.src = src;
    bgImage.style.display = "block";
    updateAll();
  });
});

logoInput.addEventListener("change", function () {
  readImage(logoInput.files[0], function (src) {
    logoImage.src = src;
    logoImage.style.display = "block";
    updateAll();
  });
});

function safeText(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatLog(text) {
  return text
    .split("\n")
    .map(function (line) {
      const safe = safeText(line);
      const trim = safe.trim();

      if (trim.startsWith("**")) {
        return `<div class="do-line">${safe}</div>`;
      }

      if (trim.startsWith("*")) {
        return `<div class="me-line">${safe}</div>`;
      }

      return `<div class="normal-line">${safe}</div>`;
    })
    .join("");
}

function fitCanvasToScreen() {
  const wrapW = canvasWrap.clientWidth;
  const wrapH = canvasWrap.clientHeight;

  const realW = Number(canvasW.value);
  const realH = Number(canvasH.value);

  const scaleX = wrapW / realW;
  const scaleY = wrapH / realH;

  const scale = Math.min(scaleX, scaleY, 1);

  canvasArea.style.transform = `scale(${scale})`;
}

function fitTextInsideCanvas() {
  if (!autoFit.checked) return;

  let size = Number(fontSize.value);
  const minSize = 14;

  logPreview.style.fontSize = size + "px";

  const canvasHeight = Number(canvasH.value);
  const textTop = (Number(textPosY.value) / 100) * canvasHeight;
  const maxTextHeight = canvasHeight - textTop - 20;

  while (logPreview.scrollHeight > maxTextHeight && size > minSize) {
    size -= 1;
    logPreview.style.fontSize = size + "px";
  }
}

function updateAll() {
  canvasArea.style.width = canvasW.value + "px";
  canvasArea.style.height = canvasH.value + "px";

  document.documentElement.style.setProperty("--normal-color", normalColor.value);
  document.documentElement.style.setProperty("--me-color", meColor.value);
  document.documentElement.style.setProperty("--do-color", doColor.value);

  logPreview.innerHTML = formatLog(logInput.value);

  logPreview.style.fontSize = fontSize.value + "px";
  logPreview.style.lineHeight = lineHeight.value;

  textLayer.style.width = maxWidth.value + "%";
  textLayer.style.left = textPosX.value + "%";
  textLayer.style.top = textPosY.value + "%";

  if (darkBg.checked) {
    logPreview.classList.add("dark-bg");
  } else {
    logPreview.classList.remove("dark-bg");
  }

  if (textStroke.checked) {
    logPreview.classList.add("stroke");
  } else {
    logPreview.classList.remove("stroke");
  }

  logoImage.style.width = logoSize.value + "px";
  logoImage.style.left = logoPosX.value + "%";
  logoImage.style.top = logoPosY.value + "%";

  overlay.style.opacity = overlayOpacity.value / 100;

  bgImage.style.filter =
    "blur(" + blurAmount.value + "px) " +
    "brightness(" + brightness.value + "%) " +
    "contrast(" + contrast.value + "%)";

  setTimeout(function () {
    fitTextInsideCanvas();
    fitCanvasToScreen();
  }, 0);
}

[
  fontSize,
  lineHeight,
  maxWidth,
  textPosX,
  textPosY,
  darkBg,
  textStroke,
  autoFit,
  normalColor,
  meColor,
  doColor,
  canvasW,
  canvasH,
  logoSize,
  logoPosX,
  logoPosY,
  logInput,
  overlayOpacity,
  blurAmount,
  brightness,
  contrast
].forEach(function (el) {
  el.addEventListener("input", updateAll);
  el.addEventListener("change", updateAll);
});

fitBtn.addEventListener("click", fitCanvasToScreen);

window.addEventListener("resize", fitCanvasToScreen);

async function savePNG() {
  const oldTransform = canvasArea.style.transform;
  canvasArea.style.transform = "scale(1)";

  const canvas = await html2canvas(canvasArea, {
    backgroundColor: null,
    scale: 2,
    useCORS: true
  });

  canvasArea.style.transform = oldTransform;

  const link = document.createElement("a");
  link.download = "merakee-log-story.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

savePngBtn.addEventListener("click", savePNG);
savePngBtn2.addEventListener("click", savePNG);

updateAll();