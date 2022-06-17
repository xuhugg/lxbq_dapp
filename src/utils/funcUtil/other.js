import html2canvas from "html2canvas";

export function saveDomImage(el) {
  return new Promise((resolve) => {
    toImage(el).then((url) => {
      if (window.test && window.test.savebase64image) {
        window.test.savebase64image(url);
      } else {
        let downloadBtn = document.createElement("a");
        downloadBtn.setAttribute("download", new Date().getTime().toString());
        downloadBtn.setAttribute("href", url);
        downloadBtn.click();
      }
      resolve();
    });
  })
}

export function toImage(el) {
  return new Promise((resolve, reject) => {
    html2canvas(el)
      .then((canvas) => {
        resolve(canvas.toDataURL("image/png"));
      })
      .catch(reject);
  });
}

export function imageToBase64(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = url;
    image.onload = function() {
      const canvas = document.createElement("canvas")
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, image.width, image.height);
      resolve(canvas.toDataURL("image/png"));
    }
    image.onerror = () => {
      reject(new Error("图片加载失败"))
    };
  })
}

export function saveImage(url) {
  return new Promise((resolve, reject) => {
    if (typeof url === 'string') {
      if (url.startsWith("data:image")) {
        if (window.test && window.test.savebase64image) {
          window.test.savebase64image(url);
        } else {
          const downloadBtn = document.createElement("a");
          downloadBtn.setAttribute("download", new Date().getTime().toString());
          downloadBtn.setAttribute("href", url);
          downloadBtn.click();
        }
        resolve();
        return;
      } else {
        if (window.test && window.test.saveimage) {
          window.test.saveimage(url);
          resolve();
        } else {
          imageToBase64(url).then((res) =>
            saveImage(res).then(resolve).catch(reject)
          ).catch(reject);
        }
        return
      }
    }
    reject("Type Error")
  })
}
