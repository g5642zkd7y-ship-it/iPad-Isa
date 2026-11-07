// « Joyeux Noël » écrit à la main (Kalam gras, en tracés), à la place de « Bienvenue » sur la banderole des trois mascottes.
// usage : node joyeux_noel.js <dossier des paquets> <sortie.txt>
const path = require('path'); const fs = require('fs');
const [, , PKG, OUTF, MOT] = process.argv;
const opentype = require(path.join(PKG, 'node_modules/opentype.js'));
const buf = fs.readFileSync(path.join(PKG, 'node_modules/@fontsource/kalam/files/kalam-latin-700-normal.woff'));
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const word = MOT || 'Joyeux Noël';
// même zone que « Bienvenue » : centre x = 213, de y = 132 à y = 160 (jambage du y compris), au plus 250 de large
const CX = 213, TOPY = 132, BOTY = 160, MAXW = 250;
let p = font.getPath(word, 0, 0, 100); let bb = p.getBoundingBox();
const s = Math.min((BOTY - TOPY) / (bb.y2 - bb.y1), MAXW / (bb.x2 - bb.x1));
p = font.getPath(word, 0, 0, 100 * s); bb = p.getBoundingBox();
p = font.getPath(word, CX - (bb.x1 + bb.x2) / 2, BOTY - bb.y2, 100 * s);
fs.writeFileSync(OUTF, p.toPathData(1));
console.log('ok', Math.round(bb.x2 - bb.x1), Math.round(bb.y2 - bb.y1));
