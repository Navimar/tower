import {
  app,
  particleContainer,
  objContainer,
  projectileContainer,
} from "./app.js";

import {
  AnimatedSprite,
  Assets,
  Particle,
  ParticleContainer,
  Sprite,
  Texture,
} from "pixi.js";
import { PXFromMetr } from "./util.js";

import { stepTextureUrl, textureUrl, texture } from "./texture.js";
import state from "./state.js";
import projectiles from "./projectiles.js";
import enemies from "./enemies.js";

import cn from "./constants.js";

const engine = {
  addEnemy: async (type) => {
    let sprite = new AnimatedSprite([
      {
        texture: await texture.get(
          stepTextureUrl("pusher.unit", 1),
          enemies[type].size,
        ),
        time: 200,
      },
      {
        texture: await texture.get(
          stepTextureUrl("pusher.unit", 2),
          enemies[type].size,
        ),
        time: 200,
      },
    ]);

    sprite.anchor.set(0.5);

    sprite.x = Math.random() * app.screen.width;
    sprite.y = Math.random() * app.screen.height;

    let newEnemy = {
      type,
      brain: 0,
      size: enemies[type].size,
      dx: 0,
      dy: 0,
      animationStep: 0,
      cadr: 1,
      sprite,
      hp: 100,
    };

    state.enemies.push(newEnemy);
    sprite.play();
    objContainer.addChild(sprite);
    return newEnemy;
  },

  removeEnemy: async (enemy) => {
    const index = state.enemies.indexOf(enemy);

    if (index !== -1) {
      state.enemies.splice(index, 1);

      // Создаем эффект частиц перед удалением спрайта
      await createParticles(enemy.sprite);

      objContainer.removeChild(enemy.sprite);

      enemy.sprite.stop();
      enemy.sprite.destroy();
    }
  },

  damageEnemy: (enemy, damage) => {
    enemy.hp -= damage;

    if (enemy.hp <= 0) {
      engine.removeEnemy(enemy);
    }
  },
  addProjectile: async (type, startX, startY, dx, dy) => {
    startX = startX || state.towerSprite.x || cn.centerX;
    startY = startY || state.towerSprite.y || cn.centerY;
    let sprite = new Sprite(
      await texture.get(
        textureUrl(projectiles[type].image),
        projectiles[type].size,
      ),
    );

    sprite.anchor.set(0.5);

    sprite.x = startX;
    sprite.y = startY;

    let newProjectile = {
      type,
      size: projectiles[type].size,
      damage: 100,
      sprite,
      dx,
      dy,
      lifetime: 3000, // Время жизни в миллисекундах
      pierceCount: 2,
    };

    state.projectiles.push(newProjectile);
    objContainer.addChild(sprite);

    return newProjectile;
  },

  removeProjectile: (projectile) => {
    const index = state.projectiles.indexOf(projectile);

    if (index !== -1) {
      state.projectiles.splice(index, 1);
      objContainer.removeChild(projectile.sprite);
      projectile.sprite.destroy();
    }
  },
};
async function createParticles(sprite) {
  //   const x = sprite.x;
  //   const y = sprite.y;

  for (let i = 0; i < 7; ++i) {
    let part = new Sprite(await texture.get(textureUrl("star"), 10));
    part.anchor.set(0.5);
    part.tint = Math.floor(Math.random() * 0xffffff);
    part.x = sprite.x;
    part.y = sprite.y;
    part.lifetime = 45;
    part.life = 0;
    part.rotation = Math.PI / 2;
    part.velocityX = (Math.random() - 0.5) * PXFromMetr(2); // случайное направление по X
    part.velocityY = -Math.random() * PXFromMetr(5) - PXFromMetr(7); // вверх по Y
    //   //   alpha: 1, // начальная непрозрачность
    part.customUpdate = (me, timedelta) => {
      if (me.life > me.lifetime) {
        // Удаляем частицу, если время жизни истекло
        me.destroy();
        return;
      }
      const t = me.life / me.lifetime; // перевод времени в секунды
      const gravity = PXFromMetr(15); // гравитация (ускорение)
      // Обновляем позицию частицы
      me.x = me.x + me.velocityX;
      me.y = me.y + me.velocityY * t + gravity * t * t;
      //     // // Обновляем поворот частицы для реалистичного эффекта
      if (me.velocityX > 0) me.rotation += 0.3 * Math.random();
      if (me.velocityX < 0) me.rotation -= 0.3 * Math.random();
      me.life += timedelta;
    };
    particleContainer.addChild(part);
  }
}

export default engine;
