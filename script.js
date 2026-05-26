const imageInput =
  document.getElementById("imageInput");

const previewImage =
  document.getElementById("previewImage");

const resultImage =
  document.getElementById("resultImage");

const enhanceBtn =
  document.getElementById("enhanceBtn");

const loading =
  document.getElementById("loading");

const downloadBtn =
  document.getElementById("downloadBtn");

let uploadedFile;

/* =========================
   PREVIEW IMAGE
========================= */

imageInput.addEventListener(
  "change",
  (e) => {

    uploadedFile =
      e.target.files[0];

    if (uploadedFile) {

      previewImage.src =
        URL.createObjectURL(uploadedFile);

      resultImage.src = "";

      downloadBtn.style.display =
        "none";

    }

  }
);

/* =========================
   ENHANCE AI
========================= */

enhanceBtn.addEventListener(
  "click",
  async () => {

    if (!uploadedFile) {

      alert("Upload gambar dulu");

      return;
    }

    loading.style.display =
      "block";

    enhanceBtn.disabled =
      true;

    try {

      /* =========================
         Upload image
      ========================= */

      const formData =
        new FormData();

      formData.append(
        "file",
        uploadedFile
      );

      const uploadResponse =
        await fetch(
          "https://tmpfiles.org/api/v1/upload",
          {
            method: "POST",
            body: formData
          }
        );

      const uploadData =
        await uploadResponse.json();

      const imageUrl =
        uploadData.data.url.replace(
          "tmpfiles.org/",
          "tmpfiles.org/dl/"
        );

      console.log(imageUrl);

      /* =========================
         Request AI Worker
      ========================= */

      const response =
        await fetch(
          "https://ai-enhancer-api.yahyaagus204.workers.dev",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              image: imageUrl
            })

          }
        );

      /* =========================
         CHECK RESPONSE TYPE
      ========================= */

      const contentType =
        response.headers.get(
          "content-type"
        );

      console.log(contentType);

      // Kalau JSON/error
      if (
        contentType &&
        contentType.includes(
          "application/json"
        )
      ) {

        const data =
          await response.json();

        console.log(data);

        alert(
          JSON.stringify(data)
        );

      }

      // Kalau image valid
      else {

        const blob =
          await response.blob();

        const resultUrl =
          URL.createObjectURL(blob);

        resultImage.src =
          resultUrl;

        downloadBtn.href =
          resultUrl;

        downloadBtn.style.display =
          "inline-block";

        alert(
          "Enhance berhasil 🔥"
        );

      }

    } catch (error) {

      console.log(error);

      alert(error.message);

    }

    loading.style.display =
      "none";

    enhanceBtn.disabled =
      false;

  }
);
