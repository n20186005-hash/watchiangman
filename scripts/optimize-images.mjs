import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const dir = path.resolve('public/gallery');
const files = (await fs.readdir(dir)).filter((f) => /^wat-chiang-man-\d+\.jpg$/i.test(f));

let before = 0;
let after = 0;

for (const f of files.sort()) {
  const n = Number(f.match(/(\d+)/)[1]);
  const out = `wat-chiang-man-chiang-mai-${n}.jpg`;
  const input = path.join(dir, f);
  const outPath = path.join(dir, out);

  const beforeSize = (await fs.stat(input)).size;
  before += beforeSize;

  const pipeline = sharp(input).rotate().resize({ width: 1600, withoutEnlargement: true });

  await pipeline
    .clone()
    .jpeg({ quality: 72, progressive: true, mozjpeg: true, chromaSubsampling: '4:2:0' })
    .toFile(outPath);

  await pipeline
    .clone()
    .webp({ quality: 72, effort: 5 })
    .toFile(outPath.replace(/\.jpg$/, '.webp'));

  const afterSize = (await fs.stat(outPath)).size;
  after += afterSize;

  console.log(
    `${f} -> ${out}  ${(beforeSize / 1024 / 1024).toFixed(2)}MB -> ${(afterSize / 1024).toFixed(0)}KB`
  );
}

console.log(
  `\nTotal: ${(before / 1024 / 1024).toFixed(1)}MB -> ${(after / 1024 / 1024).toFixed(1)}MB (${files.length} photos)`
);
