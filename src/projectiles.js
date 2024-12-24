import { PXFromMetr } from "./util.js";

const projectiles = {
  machineBullet: {
    size: 15,
    image: "machineBullet",
    do: async (projectile, timedelta) => {
      const speed = PXFromMetr(3000 / 1000); // Скорость снаряда

      // Если у снаряда ещё нет направления, задаём его
      if (!projectile.dx || !projectile.dy) {
        // Генерируем случайное направление
        const angle = Math.random() * 2 * Math.PI; // Случайный угол в радианах
        projectile.dx = Math.cos(angle);
        projectile.dy = Math.sin(angle);
      }

      // Перемещаем снаряд в заданном направлении
      projectile.sprite.x += projectile.dx * timedelta * speed;
      projectile.sprite.y += projectile.dy * timedelta * speed;
    },
  },
  baseBullet: {
    size: 15,
    image: "baseBullet",
    do: async (projectile, timedelta) => {
      const speed = PXFromMetr(3000 / 1000); // Скорость снаряда

      // Найти ближайшего к центру врага
      let closestEnemy = null;
      let closestDistanceSquared = Infinity;
      const centerX = state.towerSprite.x;
      const centerY = state.towerSprite.y;

      for (let enemy of state.enemies) {
        let dx = enemy.sprite.x - centerX;
        let dy = enemy.sprite.y - centerY;
        let distSquared = dx * dx + dy * dy;

        if (distSquared < closestDistanceSquared) {
          closestDistanceSquared = distSquared;
          closestEnemy = enemy;
        }
      }

      // Если ближайший враг найден, направляемся к нему
      if (closestEnemy) {
        let dxToEnemy = closestEnemy.sprite.x - projectile.sprite.x;
        let dyToEnemy = closestEnemy.sprite.y - projectile.sprite.y;
        let distToEnemy = Math.sqrt(
          dxToEnemy * dxToEnemy + dyToEnemy * dyToEnemy,
        );

        if (distToEnemy > 0) {
          projectile.dx = dxToEnemy / distToEnemy;
          projectile.dy = dyToEnemy / distToEnemy;
        }
      }

      // Перемещаем снаряд в направлении к ближайшему врагу
      projectile.sprite.x += projectile.dx * timedelta * speed;
      projectile.sprite.y += projectile.dy * timedelta * speed;
    },
  },
};

export default projectiles;
