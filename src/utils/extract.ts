import { rgbToHex } from "./color";

type Point = [number, number, number];
const distance = (a: Point, b: Point) => (a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2;

export async function extractPalette(file: File, k = 6): Promise<string[]> {
  const bitmap = await createImageBitmap(file);
  const max = 180;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const points: Point[] = [];
  for (let i = 0; i < data.length; i += 16) {
    if (data[i + 3] < 180) continue;
    const p: Point = [data[i], data[i+1], data[i+2]];
    const maxC = Math.max(...p), minC = Math.min(...p);
    if (maxC > 248 && minC > 248) continue;
    points.push(p);
  }
  if (points.length < k) throw new Error("pixels");
  let centers: Point[] = Array.from({ length: k }, (_, i) => points[Math.floor((i + .5) * points.length / k)]);
  let counts = Array(k).fill(0);
  for (let iteration = 0; iteration < 12; iteration++) {
    const sums: Point[] = Array.from({ length: k }, () => [0,0,0]);
    counts = Array(k).fill(0);
    for (const point of points) {
      let best = 0;
      for (let c = 1; c < k; c++) if (distance(point, centers[c]) < distance(point, centers[best])) best = c;
      sums[best][0] += point[0]; sums[best][1] += point[1]; sums[best][2] += point[2]; counts[best]++;
    }
    centers = centers.map((old, i) => counts[i] ? [sums[i][0]/counts[i], sums[i][1]/counts[i], sums[i][2]/counts[i]] : old);
  }
  return centers.map((c, i) => ({ c, count: counts[i] })).sort((a, b) => b.count - a.count).map(({ c }) => rgbToHex(...c));
}
