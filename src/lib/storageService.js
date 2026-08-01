"use client";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export function uploadFile(file, folder = "works", onProgress) {
  return new Promise((resolve, reject) => {
    if (!CLOUDINARY_CLOUD_NAME) {
      reject(new Error("Cloudinary cloud name is missing."));
      return;
    }

    if (!CLOUDINARY_UPLOAD_PRESET) {
      reject(new Error("Cloudinary upload preset is missing."));
      return;
    }

    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    // Folder داخل Cloudinary
    formData.append("folder", folder);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", url);

    // ================================
    // REAL UPLOAD PROGRESS
    // ================================

    xhr.upload.addEventListener("progress", (event) => {
      if (!event.lengthComputable) return;

      const percent = Math.round((event.loaded / event.total) * 100);

      onProgress?.(percent);
    });

    // ================================
    // SUCCESS
    // ================================

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);

          onProgress?.(100);

          resolve({
            url: data.secure_url,
            publicId: data.public_id,
            assetId: data.asset_id,
            width: data.width,
            height: data.height,
            format: data.format,
            bytes: data.bytes,
          });
        } catch (error) {
          reject(error);
        }

        return;
      }

      try {
        const error = JSON.parse(xhr.responseText);

        reject(new Error(error?.error?.message || "Cloudinary upload failed."));
      } catch {
        reject(new Error(`Cloudinary upload failed with status ${xhr.status}`));
      }
    });

    // ================================
    // NETWORK ERROR
    // ================================

    xhr.addEventListener("error", () => {
      reject(new Error("Network error while uploading image."));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Image upload was cancelled."));
    });

    // ================================
    // START
    // ================================

    onProgress?.(0);

    xhr.send(formData);
  });
}
