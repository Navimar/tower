import { Texture, Sprite, Container } from "pixi.js";
import { app } from "./app.js";
import Pica from "pica";

// Функция для загрузки изображения через объект Image и масштабирования с помощью Pica
const loadImageToCanvas = async (url, size) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;

    img.onload = async () => {
      console.log(`Image loaded successfully from ${url}`);

      // Создаём временный canvas для исходного изображения
      const originalCanvas = document.createElement("canvas");
      originalCanvas.width = img.width;
      originalCanvas.height = img.height;

      let shortSideLenght = Math.min(app.canvas.width, app.canvas.height);
      let aspectRatio = img.width / img.height;
      let targetWidth = (shortSideLenght / 1000) * size;
      let targetHeight = targetWidth / aspectRatio;

      const originalCtx = originalCanvas.getContext("2d");
      originalCtx.drawImage(img, 0, 0);

      // Создаём целевой canvas для масштабирования
      const targetCanvas = document.createElement("canvas");
      targetCanvas.width = Math.round(targetWidth);
      targetCanvas.height = Math.round(targetHeight);

      // Масштабирование с использованием Pica
      const pica = new Pica();
      await pica.resize(originalCanvas, targetCanvas, { filter: "lanczos3" });
      resolve(targetCanvas);
    };

    img.onerror = (error) => {
      console.error(`Error loading image from ${url}`, error);
      reject(new Error(`Failed to load image from ${url}: ${error.message}`));
    };
  });
};

const lazyTextureLoader = () => {
  const textures = {};

  return {
    get: async (url, size = 50) => {
      // Если текстура уже загружена, вернуть её
      if (textures[url]) {
        return textures[url];
      }

      try {
        // Загружаем изображение и масштабируем на canvas
        const canvas = await loadImageToCanvas(url, size);
        // Создаём текстуру из canvas
        const originalTexture = Texture.from(canvas);

        const sprite = new Sprite(originalTexture);
        sprite.width = canvas.width;
        sprite.height = canvas.height;

        // Создаём контейнер для рендеринга
        const container = new Container();
        container.addChild(sprite);

        // Генерируем текстуру и сохраняем её
        const scaledTexture = await app.renderer.generateTexture(container);
        textures[url] = scaledTexture;

        return textures[url];
      } catch (error) {
        console.error(`Error loading texture: ${url}`, error);
        throw new Error(`Failed to load texture from ${url}: ${error.message}`);
      }
    },
  };
};

export const texture = lazyTextureLoader();

export function stepTextureUrl(name, step) {
  if (!name || typeof name !== "string" || !step || typeof step !== "number") {
    throw new Error("Invalid input: name must be a string and step a number.");
  }

  // Формируем URL
  const url = `./assets/${name}-${step}.png`;
  return url;
}

export function textureUrl(name) {
  if (!name || typeof name !== "string") {
    throw new Error("Invalid input: name must be a string.");
  }

  // Формируем URL
  const url = `./assets/${name}.png`;
  return url;
}
