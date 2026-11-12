// Uso: node build.js <excel> <nombreArchivo>
const XLSX=require('xlsx'),fs=require('fs');
const html=fs.readFileSync('/home/claude/stock/index.html','utf8');
const js='/*'+html.split('/* ===== Ubicaciones')[1].split('/* ===== Estado')[0]+html.match(/const KW_STRIP[\s\S]*?\nlet busy/)[0].replace('let busy','');
const parseSheet=new Function('XLSX','document',js+';return parseSheet;')(XLSX,{querySelector:()=>null});
const wb=XLSX.read(fs.readFileSync(process.argv[2]),{type:'buffer'});
const res=parseSheet(XLSX,wb);
const emb={rows:res.rows,updatedAt:Date.now(),file:process.argv[3]};
if (process.argv[4]) emb.ofertas=require('./ofertas.js')(XLSX,process.argv[4],res.rows);
// Novedades: node build.js <stock> <nombre> <ofertas> <stock_anterior> <fecha_anterior>
if (process.argv[5]){
  const prev=parseSheet(XLSX,XLSX.read(fs.readFileSync(process.argv[5]),{type:'buffer'})).rows;
  const P=new Map(),Q=new Map();
  for(const r of prev) if(!P.has(r[1])) P.set(r[1],r);
  for(const r of res.rows) if(!Q.has(r[1])) Q.set(r[1],r);
  const nov={desde:process.argv[6]||'',nuevos:[],agotados:[],precios:[]};
  for(const [c,r] of Q) if(!P.has(c)) nov.nuevos.push(c);
  for(const [c,r] of P) if(!Q.has(c)) nov.agotados.push({c,n:r[0]});
  for(const [c,r] of Q){ const o=P.get(c); if(o && o[6] && r[6] && Math.abs(o[6]-r[6])>0.001) nov.precios.push({c,n:r[0],a:o[6],b:r[6]}); }
  emb.nov=nov;
  console.log('Novedades: nuevos',nov.nuevos.length,'agotados',nov.agotados.length,'precios',nov.precios.length);
}
const out=html.replace('/*EMB*/null',JSON.stringify(emb).replace(/</g,'\\u003c'));
fs.mkdirSync('/home/claude/stock/dist',{recursive:true});
fs.writeFileSync('/home/claude/stock/dist/index.html',out);
console.log('filas',res.rows.length,'omitidas',res.skipped,'columnas',res.found.join(','));
