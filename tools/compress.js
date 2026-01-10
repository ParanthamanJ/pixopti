const qualitySlider = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");

qualitySlider.oninput = () => {
  qualityValue.innerText = qualitySlider.value + "%";
};

function compressImage() {
  const fileInput = document.getElementById("upload");
  const file = fileInput.files[0];
  const button = document.querySelector("button");
  const output = document.getElementById("output");

  if (!file) {
    alert("Please select an image");
    return;
  }

  button.disabled = true;
  output.innerHTML = `<div class="loader"></div><p>Compressing...</p>`;

  const quality = qualitySlider.value / 100;
  const reader = new FileReader();

  reader.readAsDataURL(file);
  reader.onload = e => {
    const img = new Image();
    img.src = e.target.result;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(blob => {
        const compressedURL = URL.createObjectURL(blob);

        output.innerHTML = `
          <p>Original Size: ${(file.size / 1024).toFixed(2)} KB</p>
          <p>Compressed Size: ${(blob.size / 1024).toFixed(2)} KB</p>
          <a href="${compressedURL}" download="compressed.jpg">Download Image</a>
        `;

        button.disabled = false;
      }, "image/jpeg", quality);
    };
  };
}

const uploadInput = document.getElementById("upload");
const fileNameText = document.getElementById("fileName");

uploadInput.addEventListener("change", () => {
  if (uploadInput.files.length > 0) {
    fileNameText.innerText = uploadInput.files[0].name;
  } else {
    fileNameText.innerText = "No file selected";
  }
});