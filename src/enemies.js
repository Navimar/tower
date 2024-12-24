import { app, objContainer } from "./app.js";
import { stepTextureUrl, texture } from "./texture.js";
import { PXFromMetr } from "./util.js";
import state from "./state.js";

const enemies = {
  pusher: {
    image: "pusher.unit",
    size: 60,
    do: async (me, timedelta) => {
      const speed = PXFromMetr(2500 / 1000); // Скорость движения
      const repelDistance = PXFromMetr((enemies[me.type].size * 1) / 2); // Минимальная дистанция для отталкивания

      // Перемещаем объект в направлении
      me.sprite.x += me.dx * timedelta * speed;
      me.sprite.y += me.dy * timedelta * speed;

      if (me.brain > 0) {
        me.brain -= timedelta;
        return;
      }
      me.brain += 50;
      // Рассчитываем вектор направления к центру экрана
      let dxToCenter = state.towerSprite.x - me.sprite.x;
      let dyToCenter = state.towerSprite.y - me.sprite.y;
      let distToCenter = Math.sqrt(
        dxToCenter * dxToCenter + dyToCenter * dyToCenter,
      );

      // Нормализация вектора
      if (distToCenter > 0) {
        dxToCenter /= distToCenter;
        dyToCenter /= distToCenter;
      }

      // Проверяем взаимодействие с другими "бычками" в objContainer
      for (let obj of objContainer.children) {
        if (obj === me.sprite) continue;
        let dxOther = me.sprite.x - obj.x;
        let dyOther = me.sprite.y - obj.y;
        let distOther = Math.sqrt(dxOther * dxOther + dyOther * dyOther);

        if (distOther > 0 && distOther < repelDistance) {
          // Добавляем отталкивающий эффект
          dxToCenter += dxOther / distOther;
          dyToCenter += dyOther / distOther;
        }
      }

      // Нормализация итогового вектора направления
      let totalDist = Math.sqrt(
        dxToCenter * dxToCenter + dyToCenter * dyToCenter,
      );
      if (totalDist > 0) {
        me.dx = dxToCenter / totalDist;
        me.dy = dyToCenter / totalDist;
      }

      // Устанавливаем масштаб объекта в зависимости от направления
      me.sprite.scale.x = me.dx < 0 ? -1 : 1;
    },
  },
};

export default enemies;
