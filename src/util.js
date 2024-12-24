import { app } from "./app.js";

/**
 * Преобразует расстояние в тысячных долях от меньшей стороны канваса в пиксели.
 * @param {number} distance - Расстояние в тысячных долях от меньшей стороны канваса (0-1000).
 * @returns {number} Расстояние в пикселях.
 */
export function PXFromMetr(distance) {
  let shortSideLength = Math.min(app.canvas.width, app.canvas.height);
  return (distance / 1000) * shortSideLength;
}

/**
 * Преобразует расстояние из пикселей в тысячные доли от меньшей стороны канваса.
 * @param {number} distance - Расстояние в пикселях.
 * @returns {number} Расстояние в тысячных долях от меньшей стороны канваса (0-1000).
 */
export function MetrFromPX(distance) {
  let shortSideLength = Math.min(app.canvas.width, app.canvas.height);
  return (distance / shortSideLength) * 1000;
}
