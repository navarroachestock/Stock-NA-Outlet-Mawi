// Compara lo que muestra la página contra el Excel crudo, producto por producto
const {chromium}=require('playwright');const XLSX=require('xlsx');const fs=require('fs');
(async()=>{
 const A=XLSX.utils.sheet_to_json(XLSX.read(fs.readFileSync(process.argv[2])).Sheets[XLSX.read(fs.readFileSync(process.argv[2])).SheetNames[0]],{header:1,raw:true});
 const H=A[0].map(String);const ix=k=>H.indexOf(k);
 const exp={};let price={};
 for(const r of A.slice(1)){ if(!r[ix('ar_descr')]) continue;
   const u=String(r[ix('ubicacion')]).replace(/\W/g,'').toUpperCase();
   const loc=u.includes('MEGA')?'Dep Mega':u.startsWith('DEP')?'Depósito Mashwitz':'Mi local (Mashwitz)';
   const k=String(r[ix('ar_codig')]).trim()+'|'+loc; const e=exp[k]||(exp[k]={m2:0,c:0});
   e.m2+=+r[ix('metros')]||0; e.c+=+r[ix('disponible')]||0; price[String(r[ix('ar_codig')]).trim()]=+r[ix('precio')]||0; }
 const b=await chromium.launch();const p=await b.newPage();
 p.on('pageerror',e=>console.log('ERROR JS',e.message));
 await p.goto('file:///home/claude/stock/dist/index.html');await p.waitForTimeout(500);
 const got=await p.evaluate(()=>products.map(x=>({c:x.codigo,pm:x.pm,pc:x.pc,mc:x.mc,unit:x.unit,locs:x.locs.map(l=>({n:l.name,m2:l.m2,c:l.cajas}))})));
 let bad=0,n=0;const seen=new Set();
 for(const g of got){ if(Math.abs((g.pm||0)-price[g.c])>0.001){bad++;console.log('PRECIO',g.c,g.pm,price[g.c]);}
   if(g.pc && Math.abs(g.pc-Math.round(price[g.c]*g.mc*100)/100)>0.001){bad++;console.log('PRECIO CAJA',g.c);}
   for(const l of g.locs){ const e=exp[g.c+'|'+l.n]; seen.add(g.c+'|'+l.n); n++;
     if(!e||Math.abs(e.m2-l.m2)>0.005||Math.abs(e.c-l.c)>0.005){bad++;console.log('CANT',g.c,l,e);} } }
 for(const k in exp) if(!seen.has(k)){bad++;console.log('FALTA',k);}
 console.log(`Verificados ${got.length} productos / ${n} ubicaciones — diferencias: ${bad}`);
 await b.close(); process.exit(bad?1:0);})();
