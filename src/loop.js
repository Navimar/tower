import state from "./state.js";
import enemies from "./enemies.js";
import projectiles from "./projectiles.js";

import rule from "./rules.js";

import { objContainer, particleContainer } from "./app.js";

export default async (time) => {
  let timedelta = time.deltaTime;

  objContainer.children.forEach((sprite) => {
    sprite.zIndex = sprite.y;
  });

  particleContainer.children.forEach(async (particle) => {
    if (typeof particle.customUpdate === "function") {
      await particle.customUpdate(particle, timedelta);
    }
  });

  state.enemies.forEach(async (enemy) => {
    enemies[enemy.type].do(enemy, timedelta);
  });
  state.projectiles.forEach(async (projectile) => {
    projectiles[projectile.type].do(projectile, timedelta);
  });
  await rule.richTower();
  await rule.removeOffscreenProjectiles();
  await rule.handleProjectileEnemyCollision();
  await rule.pusherBirth(timedelta);
  await rule.baseGun(timedelta);
  await rule.machineGun(timedelta);
};
