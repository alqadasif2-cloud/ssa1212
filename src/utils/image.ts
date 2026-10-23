export async function processImageFile(
  file: File,
  maxDimension = 1920,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          reject(new Error('تعذر معالجة الصورة'));
        }
      };
      img.onerror = () => reject(new Error('فشل تحميل ملف الصورة'));
      if (e.target?.result) {
        img.src = e.target.result as string;
      } else {
        reject(new Error('ملف الصورة فارغ'));
      }
    };
    reader.onerror = () => reject(new Error('خطأ في قراءة ملف الصورة'));
    reader.readAsDataURL(file);
  });
}
