// appModule.js
import {
  Application,
  Container,
  ParticleContainer,
  Assets,
  Sprite,
} from "pixi.js";
import cn from "./constants.js";

import loop from "./loop.js";

export const app = new Application();
export const objContainer = new Container();
export const particleContainer = new Container();
export const projectileContainer = new Container();

export const initApp = async () => {
  // Create a new application

  // Initialize the application
  await app.init({
    background: "#6fbf67",
    resizeTo: window,
    // autoResize: true,
    roundPixels: true,
  });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  cn.centerX = app.screen.width / 2;
  cn.centerY = app.screen.height / 2;

  app.stage.addChild(objContainer);
  app.stage.addChild(particleContainer);
  app.stage.addChild(projectileContainer);

  app.ticker.add(async (time) => {
    await loop(time);
  });
  // app.ticker.maxFPS = 15;
};
