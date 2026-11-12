// Lee el listado de ofertas, lo vincula por código (o nombre) al stock y controla los precios.
const fs=require('fs');
const N=s=>String(s??'').normalize('NFD').replace(/[̀-ͯ]/g,'').toUpperCase().replace(/¥|\\/g,'N').replace(/[^A-Z0-9]+/g,' ').trim();
const num=v=>{if(v==null||v==='')return null;if(typeof v==='number')return v;let s=String(v).replace(/[^\d,.\-]/g,'');if(s.includes(','))s=s.replace(/\./g,'').replace(',','.');else if((s.match(/\./g)||[]).length>1||/^\d{1,3}\.\d{3}$/.test(s))s=s.replace(/\./g,'');const n=parseFloat(s);return isFinite(n)?n:null;};
module.exports=(XLSX,file,rows)=>{
  const wb=XLSX.read(fs.readFileSync(file),{cellDates:true});const sh=wb.SheetNames.find(n=>/ofert/i.test(n))||wb.SheetNames[0];const A=XLSX.utils.sheet_to_json(wb.Sheets[sh],{header:1,raw:true,defval:''});
  let hi=-1,c={};
  for(let i=0;i<Math.min(20,A.length);i++){const h=A[i].map(x=>N(x).toLowerCase());
    const f=(re,not=[])=>h.findIndex((x,j)=>re.test(x)&&!not.includes(j));
    c.n=f(/descr/); if(c.n<0) c.n=f(/producto|nombre/);
    c.cod=f(/^cod|codigo|sku|^articulo$|^art$/,[c.n]);
    c.pct=f(/descuento|porc|dto|^%|off/,[c.n]);
    c.po=f(/preoferta|precio oferta|oferta|promo/,[c.n,c.pct]);
    c.pl=f(/precionac|lista|precio$/,[c.n,c.po]);
    c.fin=f(/finaliza|vence|hasta|vigencia/);
    if((c.n>=0||c.cod>=0)&&(c.pct>=0||c.po>=0)){hi=i;break;}}
  if(hi<0) throw new Error('No encontré encabezados en ofertas');
  const prods=new Map();for(const r of rows) if(!prods.has(r[1])) prods.set(r[1],{nombre:r[0],pm:r[6]});
  const byName=new Map();for(const [code,p] of prods){const k=N(p.nombre);(byName.get(k)||byName.set(k,[]).get(k)).push(code);}
  const out={},sinMatch=[],avisos=[];let total=0;
  for(const r of A.slice(hi+1)){
    const name=String(r[c.n]??'').replace(/ /g,' ').trim(), cod=c.cod>=0?String(r[c.cod]??'').trim():'';
    if(!name&&!cod) continue; total++;
    let pct=c.pct>=0?num(r[c.pct]):null, po=c.po>=0?num(r[c.po]):null, pl=c.pl>=0?num(r[c.pl]):null;
    if(pct!=null&&pct>0&&pct<1) pct=pct*100;
    let codes=[];
    if(cod&&prods.has(cod)) codes=[cod];
    else if(!cod){ codes=byName.get(N(name))||[]; }
    if(!codes.length){sinMatch.push(`${cod} ${name}`);continue;}
    let fin=c.fin>=0?r[c.fin]:null; if(fin instanceof Date){ fin = fin.getFullYear()<2100 ? fin.toISOString().slice(0,10) : null; } else fin=null;
    for(const code of codes){ const pm=prods.get(code).pm;
      if(pl!=null&&pm&&Math.abs(pl-pm)>0.01) avisos.push(`${code} ${name}: precio de lista en ofertas $${pl} ≠ stock $${pm}`);
      if(po==null&&pct!=null) po=Math.round((pl||pm)*(1-pct/100)*100)/100;
      if(pct==null&&po!=null&&(pl||pm)) pct=Math.round((1-po/(pl||pm))*1000)/10;
      const chk=(pl||pm)?Math.round((pl||pm)*(1-pct/100)*100)/100:null;
      if(chk!=null&&Math.abs(chk-po)>1) avisos.push(`${code} ${name}: oferta $${po} no coincide con ${pct}% (daría $${chk})`);
      out[code]={po,pct,fin}; }
  }
  console.log(`Ofertas en el listado: ${total} | vinculadas: ${Object.keys(out).length} | sin stock/no encontradas: ${sinMatch.length}`);
  if(sinMatch.length) console.log('NO ESTÁN EN EL STOCK:\n - '+sinMatch.join('\n - '));
  if(avisos.length) console.log('AVISOS:\n - '+avisos.join('\n - '));
  return out;
};
