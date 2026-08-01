export function uploadImageToCloudinary(file, onProgress) {
  return new Promise((resolve, reject) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      reject(new Error("Cloudinary configuration is missing."));
      return;
    }

    const xhr = new XMLHttpRequest();

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    xhr.open("POST", url);

    xhr.upload.addEventListener("progress", (event) => {
      if (!event.lengthComputable) return;

      const progress = (event.loaded / event.total) * 100;

      onProgress?.(progress);
    });

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);

          resolve({
            url: data.secure_url,
            publicId: data.public_id,
            width: data.width,
            height: data.height,
            format: data.format,
            bytes: data.bytes,
          });
        } catch {
          reject(new Error("Invalid Cloudinary response."));
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error while uploading."));
    };

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    xhr.send(formData);
  });
}
