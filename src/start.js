import { Sprite } from "pixi.js";
import { textureUrl, texture } from "./texture.js";
import { app, objContainer } from "./app.js";
import cn from "./constants.js";
import state from "./state.js";

// Функция для добавления врага

// Экспортируемая функция для создания 500 врагов
export default async () => {
  const towerSprite = new Sprite(await texture.get(textureUrl("tower"), 150));
  towerSprite.anchor.set(0.5, 0.7);

  towerSprite.x = cn.centerX;
  towerSprite.y = cn.centerY;
  objContainer.addChild(towerSprite);
  state.towerSprite = towerSprite;
};
