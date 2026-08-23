// Downscales and re-encodes an image file in the browser before it's uploaded to Supabase
// Storage. Uploads here come straight from a camera/phone <input type="file"> (often 3000px+
// and several MB) but are only ever displayed at thumbnail sizes (e.g. a 224px-tall grid card),
// so shipping the original wastes bandwidth on every page load, not just the upload. Falls back
// to the original file whenever compression can't help or fails, so a call site can always just
// upload whatever this returns.
export async function compressImage(file, { maxDimension = 1920, quality = 0.82 } = {}) {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
    if (!blob || blob.size >= file.size) return file;

    const baseName = file.name.replace(/\.[^./\\]+$/, '');
    return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' });
  } catch (error) {
    console.warn('No se pudo comprimir la imagen, se sube el archivo original:', error);
    return file;
  }
}
