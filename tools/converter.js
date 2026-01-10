const uploadInput = document.getElementById("upload");
const fileNameText = document.getElementById("fileName");
const formatSelect = document.getElementById("format");
const output = document.getElementById("output");

uploadInput.addEventListener("change", () => {
  if (uploadInput.files.length > 0) {
    fileNameText.innerText = uploadInput.files[0].name;
  } else {
    fileNameText.innerText = "No file selected";
  }
});

function convertImage() {
  const file = uploadInput.files[0];

  if (!file) {
    alert("Please select an image first");
    return;
  }

  const targetFormat = formatSelect.value; // png / jpg / webp
  output.innerHTML = `<div class="loader"></div><p>Converting...</p>`;

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = (e) => {
    const img = new Image();
    img.src = e.target.result;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      // JPG background fix (PNG transparency issue)
      if (targetFormat === "jpg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      let mimeType = "image/png";
      if (targetFormat === "jpg") mimeType = "image/jpeg";
      if (targetFormat === "webp") mimeType = "image/webp";

      canvas.toBlob(
        (blob) => {
          const convertedURL = URL.createObjectURL(blob);

          const originalName = file.name.split(".").slice(0, -1).join(".");
          const newFileName = `${originalName}.${targetFormat}`;

          output.innerHTML = `
            <p>Original Format: ${file.type}</p>
            <p>Converted Format: ${mimeType}</p>
            <a href="${convertedURL}" download="${newFileName}">
              Download Image
            </a>
          `;
        },
        mimeType,
        0.95
      );
    };
  };
}