import state from "./state.js";
import { app } from "./app.js";

import cn from "./constants.js";
import en from "./engine.js";

import { PXFromMetr } from "./util.js";

const shakeTower = (sprite, intensity, duration) => {
  const originalPosition = { x: sprite.x, y: sprite.y };
  const shakeInterval = 50; // Время между сдвигами (в миллисекундах)
  const shakeSteps = Math.floor(duration / shakeInterval);

  let currentStep = 0;
  const shake = setInterval(() => {
    if (currentStep >= shakeSteps) {
      clearInterval(shake);
      sprite.x = originalPosition.x;
      sprite.y = originalPosition.y;
      return;
    }

    sprite.x = originalPosition.x + (Math.random() * 2 - 1) * intensity;
    sprite.y = originalPosition.y + (Math.random() * 2 - 1) * intensity;
    currentStep++;
  }, shakeInterval);
};

let pusherSpawnTime = 0;
let bulletSpawnTime = 0;
export default {
  removeOffscreenProjectiles: async () => {
    for (let projectile of state.projectiles) {
      if (
        projectile.sprite.x < 0 ||
        projectile.sprite.x > app.canvas.width ||
        projectile.sprite.y < 0 ||
        projectile.sprite.y > app.canvas.height
      ) {
        en.removeProjectile(projectile);
      }
    }
  },

  handleProjectileEnemyCollision: async () => {
    for (let projectile of state.projectiles) {
      for (let enemy of state.enemies) {
        let dx = enemy.sprite.x - projectile.sprite.x;
        let dy = enemy.sprite.y - projectile.sprite.y;
        let distSquared = dx * dx + dy * dy;

        let collisionRadiusSquared =
          PXFromMetr((projectile.size / 2 + enemy.size / 2) * 0.95) ** 2; // Квадрат радиуса столкновения

        if (distSquared < collisionRadiusSquared) {
          // Уменьшаем pierceCount
          projectile.pierceCount -= 1;

          // Удаляем снаряд, если pierceCount равен 0
          if (projectile.pierceCount <= 0) {
            en.removeProjectile(projectile);
          }

          // Наносим урон врагу
          await en.damageEnemy(enemy, projectile.damage);

          // Выходим из цикла врагов, чтобы избежать повторных столкновений
          break;
        }
      }
    }
  },

  baseGun: async (timedelta) => {
    if (bulletSpawnTime > 0) {
      bulletSpawnTime -= timedelta;
      return;
    }
    bulletSpawnTime += 10;
    let projectile = await en.addProjectile("baseBullet");
  },

  machineGun: async (timedelta) => {
    if (bulletSpawnTime > 0) {
      bulletSpawnTime -= timedelta;
      return;
    }
    bulletSpawnTime += 10;
    let projectile = await en.addProjectile("machineBullet");
  },

  richTower: async () => {
    // state.towerSprite
    for (let enemy of state.enemies) {
      let distToCenter = Math.sqrt(
        (enemy.sprite.x - state.towerSprite.x) ** 2 +
          (enemy.sprite.y - state.towerSprite.y) ** 2,
      );
      let maxdistance = PXFromMetr(50); // Задайте максимально допустимое расстояние

      if (distToCenter < maxdistance) {
        await en.removeEnemy(enemy);
        shakeTower(state.towerSprite, 1.5, 250); // Интенсивность = 5, Длительно
      }
    }
  },
  pusherBirth: async (timedelta) => {
    if (pusherSpawnTime > 0) {
      pusherSpawnTime -= timedelta;
      return;
    }
    pusherSpawnTime += 1;
    let enemy = await en.addEnemy("pusher");

    let randomEdge = Math.floor(Math.random() * 4);
    switch (randomEdge) {
      case 0: // Левый край
        enemy.sprite.x = 0;
        enemy.sprite.y = Math.random() * app.canvas.height;
        break;
      case 1: // Правый край
        enemy.sprite.x = app.canvas.width;
        enemy.sprite.y = Math.random() * app.canvas.height;
        break;
      case 2: // Верхний край
        enemy.sprite.x = Math.random() * app.canvas.width;
        enemy.sprite.y = 0;
        break;
      case 3: // Нижний край
        enemy.sprite.x = Math.random() * app.canvas.width;
        enemy.sprite.y = app.canvas.height;
        break;
    }
  },
};
