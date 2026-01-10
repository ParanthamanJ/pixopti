const upload = document.getElementById("upload");
const fileNameText = document.getElementById("fileName");
const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");
const keepAspect = document.getElementById("keepAspect");
const resizeBtn = document.getElementById("resizeBtn");
const output = document.getElementById("output");

let originalWidth = 0;
let originalHeight = 0;
let imgType = "image/jpeg"; // default

// Show file name + detect format
upload.addEventListener("change", () => {
  if (!upload.files.length) return;

  const file = upload.files[0];
  fileNameText.innerText = file.name;
  imgType = file.type; // 🔥 AUTO DETECT JPG / PNG

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = e => {
    const img = new Image();
    img.src = e.target.result;

    img.onload = () => {
      originalWidth = img.width;
      originalHeight = img.height;

      widthInput.value = originalWidth;
      heightInput.value = originalHeight;
    };
  };
});

// Keep aspect ratio logic
widthInput.addEventListener("input", () => {
  if (keepAspect.checked && originalWidth) {
    heightInput.value = Math.round(
      (widthInput.value / originalWidth) * originalHeight
    );
  }
});

heightInput.addEventListener("input", () => {
  if (keepAspect.checked && originalHeight) {
    widthInput.value = Math.round(
      (heightInput.value / originalHeight) * originalWidth
    );
  }
});

// Resize + Download
resizeBtn.addEventListener("click", () => {
  if (!upload.files.length) {
    alert("Please select an image");
    return;
  }

  const file = upload.files[0];
  const reader = new FileReader();

  reader.readAsDataURL(file);
  reader.onload = e => {
    const img = new Image();
    img.src = e.target.result;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = widthInput.value;
      canvas.height = heightInput.value;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 🔥 Auto format download
      const ext = imgType === "image/png" ? "png" : "jpg";
      const dataURL = canvas.toDataURL(imgType, 0.92);

      output.innerHTML = `
        <img src="${dataURL}" style="max-width:100%;margin:10px 0;">
        <a href="${dataURL}" download="resized-image.${ext}" class="download-btn">
          Download Image
        </a>
      `;
    };
  };
});