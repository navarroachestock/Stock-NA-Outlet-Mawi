// Lee la hoja "mercaderia" (mercadería a recibir) del Excel del día
const fs=require('fs');
const N=s=>String(s??'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim();
module.exports=(XLSX,file)=>{
  const wb=XLSX.read(fs.readFileSync(file),{cellDates:true});
  const sh=wb.SheetNames.find(n=>/mercader/i.test(n)); if(!sh) return null;
  const A=XLSX.utils.sheet_to_json(wb.Sheets[sh],{header:1,raw:true,defval:''});
  let hi=-1,c={};
  for(let i=0;i<Math.min(10,A.length);i++){const h=A[i].map(N);const f=re=>h.findIndex(x=>re.test(x));
    c={cod:f(/^cod|^ar_codig|articulo/),n:f(/descr/),m:f(/marca/),f:f(/entrega|fecha/),comp:f(/^comprado/),rec:f(/^recibido/),cpr:f(/comprometido/),rr:f(/recibiremos|a recibir/),nro:f(/numero|orden/)};
    if(c.n>=0&&c.rr>=0){hi=i;break;}}
  if(hi<0) throw new Error('No encontré encabezados en mercadería');
  const num=v=>typeof v==='number'?v:(parseFloat(String(v).replace(/\./g,'').replace(',','.'))||0);
  const out=[];
  for(const r of A.slice(hi+1)){ const n=String(r[c.n]??'').trim(); if(!n) continue;
    let f=r[c.f]; f=(f instanceof Date && f.getFullYear()<2100)? f.toISOString().slice(0,10) : null;
    out.push([String(r[c.cod]??'').trim(), n.replace(/¥/g,'Ñ').replace(/\\/g,'Ñ').replace(/\s+/g,' '), String(r[c.m]??'').trim(), f, num(r[c.comp]), num(r[c.rec]), num(r[c.cpr]), num(r[c.rr]), String(r[c.nro]??'').trim()]);
  }
  console.log('Mercadería a recibir: filas',out.length,'| total a recibir',out.reduce((a,x)=>a+x[7],0));
  return out;
};
