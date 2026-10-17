/**
 * Generates icon-192.png and icon-512.png for Softly PWA.
 * Pure Node.js — no external dependencies. Uses zlib (built-in) + raw PNG binary.
 * Design: coral (#FFB7B2) rounded square background + white "S" lettermark.
 */
const fs = require('fs');
const zlib = require('zlib');

function writePNG(size, filepath) {
  const w = size;
  const h = size;

  // RGBA pixel buffer
  const pixels = Buffer.alloc(w * h * 4);

  const bgR = 0xFF, bgG = 0xB7, bgB = 0xB2; // #FFB7B2 coral
  const fgR = 0xFF, fgG = 0xFF, fgB = 0xFF; // white

  const radius = size * 0.22; // rounded corner radius

  // Helper: is pixel inside rounded rect?
  function inRoundedRect(x, y) {
    const pad = size * 0.0;
    const x0 = pad, y0 = pad, x1 = w - pad, y1 = h - pad;
    if (x < x0 || x > x1 || y < y0 || y > y1) return false;
    // corners
    const corners = [
      [x0 + radius, y0 + radius],
      [x1 - radius, y0 + radius],
      [x0 + radius, y1 - radius],
      [x1 - radius, y1 - radius],
    ];
    for (const [cx, cy] of corners) {
      if (x < cx - radius + 0.001 || x > cx + radius - 0.001) continue;
      if (y < cy - radius + 0.001 || y > cy + radius - 0.001) continue;
      const dx = x - cx, dy = y - cy;
      if (dx * dx + dy * dy > radius * radius) return false;
    }
    return true;
  }

  // Draw "S" glyph using bezier approximation via filled rectangles + circles
  // The S is built from two arcs (top and bottom halves) approximated as pixel tests
  function inLetterS(x, y) {
    // Normalize to 0..1 space within a centered box
    const boxW = size * 0.44;
    const boxH = size * 0.60;
    const ox = (w - boxW) / 2;
    const oy = (h - boxH) / 2;
    const lx = (x - ox) / boxW; // 0..1
    const ly = (y - oy) / boxH; // 0..1

    if (lx < 0 || lx > 1 || ly < 0 || ly > 1) return false;

    const stroke = 0.16; // stroke thickness relative to boxW

    // Top arc (upper half of S): center at (0.5, 0.27), radius ~0.30
    // Bottom arc (lower half of S): center at (0.5, 0.73), radius ~0.30
    // Plus a diagonal connector in the middle

    // Top arc: open circle, bottom-right quadrant excluded, top-left quadrant
    const tcx = 0.5, tcy = 0.265, tr = 0.295;
    const tdx = lx - tcx, tdy = ly - tcy;
    const tDist = Math.sqrt(tdx * tdx + tdy * tdy);
    const inTopArc = tDist >= tr - stroke && tDist <= tr + stroke && !(tdx > 0 && tdy > 0);

    // Bottom arc: center at (0.5, 0.735), open circle, top-left quadrant excluded
    const bcx = 0.5, bcy = 0.735, br = 0.295;
    const bdx = lx - bcx, bdy = ly - bcy;
    const bDist = Math.sqrt(bdx * bdx + bdy * bdy);
    const inBottomArc = bDist >= br - stroke && bDist <= br + stroke && !(bdx < 0 && bdy < 0);

    return inTopArc || inBottomArc;
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const inBg = inRoundedRect(x + 0.5, y + 0.5);
      const inS = inBg && inLetterS(x + 0.5, y + 0.5);

      if (!inBg) {
        // Transparent outside rounded rect
        pixels[idx] = 0; pixels[idx+1] = 0; pixels[idx+2] = 0; pixels[idx+3] = 0;
      } else if (inS) {
        pixels[idx] = fgR; pixels[idx+1] = fgG; pixels[idx+2] = fgB; pixels[idx+3] = 255;
      } else {
        pixels[idx] = bgR; pixels[idx+1] = bgG; pixels[idx+2] = bgB; pixels[idx+3] = 255;
      }
    }
  }

  // Build PNG raw image data (filter byte 0 = None before each row)
  const rawRows = [];
  for (let y = 0; y < h; y++) {
    const row = Buffer.alloc(1 + w * 4);
    row[0] = 0; // filter type None
    pixels.copy(row, 1, y * w * 4, (y + 1) * w * 4);
    rawRows.push(row);
  }
  const rawData = Buffer.concat(rawRows);
  const compressed = zlib.deflateSync(rawData, { level: 6 });

  // PNG signature
  const sig = Buffer.from([137,80,78,71,13,10,26,10]);

  function chunk(type, data) {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const typeB = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.concat([typeB, data]);
    const crc = crc32(crcBuf);
    const crcOut = Buffer.alloc(4); crcOut.writeInt32BE(crc);
    return Buffer.concat([len, typeB, data, crcOut]);
  }

  // CRC32
  function crc32(buf) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) {
      crc ^= buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc & 1) ? (0xEDB88320 ^ (crc >>> 1)) : (crc >>> 1);
      }
    }
    return (crc ^ 0xFFFFFFFF) | 0;
  }

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type: RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  // IDAT
  const idat = compressed;

  // IEND
  const iend = Buffer.alloc(0);

  const png = Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', iend),
  ]);

  fs.writeFileSync(filepath, png);
  console.log(`✅ Written ${filepath} (${png.length} bytes)`);
}

writePNG(192, 'public/icon-192.png');
writePNG(512, 'public/icon-512.png');
console.log('Done! PWA icons ready.');
