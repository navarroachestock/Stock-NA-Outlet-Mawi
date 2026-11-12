# Página de stock Navarro Ache — cómo actualizar

Artifact: https://claude.ai/artifact/HWtWE49DwiRW59WWJ8AE3J (slug 85be873d-9e3d-4a94-b4b4-8bb25041fb91, público → publicar con shared_live "public" y artifact_title "Stock Navarro Ache").

Cada día Francisco manda STOCK-dd-mm-aaaa.xlsx (columnas: ar_codig, ar_descr, precio, marca, disponible, metros, mtsporcaja, lote, ubicacion) y a veces OFERTAS.xlsx (articulo, descripcio, cajas, vendidas, precionac, descuento, preoferta, disponibl, finaliza).

IMPORTANTE (12-11): la versión MÁS NUEVA de pagina-template.html, build.js, ofertas.js y verify.js está en el repo GitHub navarroachestock/Stock-NA-Outlet-Mawi, carpeta /herramientas (la copia de pagina-template.html de este proyecto quedó vieja, del 05-11). Clonar el repo y usar esos archivos.

Pasos:
1. Copiar pagina-template.html a /home/claude/stock/index.html; build.js, ofertas.js y verify.js a /home/claude/tools; `npm i xlsx@0.18.5` en tools.
2. `node build.js <stock.xlsx> <NombreArchivo.xlsx> [ofertas.xlsx]` → genera /home/claude/stock/dist/index.html con los datos incrustados.
3. `node verify.js <stock.xlsx>` → debe dar 0 diferencias (metros, cajas, precio m², precio caja).
4. Informar ofertas que no están en el stock y avisos de precios.
5. Publicar dist/index.html con publish_files.

6. GITHUB (desde 05-11, YA CONECTADO): cuenta navarroachestock, repo navarroachestock/Stock-NA-Outlet-Mawi (público, rama main, Pages activo). Link para compañeros: https://navarroachestock.github.io/Stock-NA-Outlet-Mawi/ . Flujo: add_repo(owner navarroachestock, repo Stock-NA-Outlet-Mawi, access push) → git clone --depth 1 → copiar el index.html con meta noindex → commit → git push origin main → esperar el run "pages build and deployment" (gh api repos/.../actions/runs) en success. El Excel diario puede traer 2 hojas: "stock dd-mm-aaaa" y "ofertas" (ofertas.js toma la hoja que contiene "ofert"); pasar el mismo archivo como stock y como ofertas a build.js.
   Anterior (04-11): agregar `<meta name="robots" content="noindex, nofollow">` antes del meta viewport de dist/index.html y mandarle el index.html a Francisco (SendUserFile) para que lo suba a su repo público "stock" (Add file → Upload files → Commit). Si gh queda vinculado a su cuenta, hacer push directo a main de ese repo.

Ubicaciones: MASHWITZ = Mi local (verde) · DEP.MASHWI = Depósito Mashwitz, atrás del local (azul) · DEP. MEGA = Dep Mega, más lejos (amarillo).
Ofertas en VERDE (pedido de Francisco 04-11): en el CSS, .ofin, .ofb, .price.offer div y .price.offer b usan var(--ok)/var(--okbg). Si la plantilla guardada todavía tiene var(--no)/var(--nobg) en esas 4 reglas, cambiarlas.
Botones de filtro con color (04-11): si la plantilla guardada no los tiene, agregar después de `.chip.on{...}`:
.chip[data-f=local]{background:var(--okbg);color:var(--ok);font-weight:700}
.chip[data-f=dep]{background:var(--midbg);color:var(--mid);font-weight:700}
.chip[data-f=mega]{background:var(--warnbg);color:var(--warn);font-weight:700}
.chip[data-f=local].on{background:var(--ok);color:#fff}
.chip[data-f=dep].on{background:var(--mid);color:#fff}
.chip[data-f=mega].on{background:var(--warn);color:#fff}
@media (prefers-color-scheme: dark){ .chip[data-f=local].on,.chip[data-f=dep].on,.chip[data-f=mega].on{color:#111} }
Cotizador (05-11): SIN PDF (Francisco lo pidió sacar). Solo botón verde "Enviar por WhatsApp a <tel>" (wa.me con el número del cliente), línea de resumen arriba (fecha · Cliente · Atendido por) para screenshots, "De dónde sale" reparte Mi local → Depósito Mashwitz → Dep Mega, siempre redondea cajas para arriba. Si la plantilla guardada todavía tiene el botón #cPdf, sacarlo y aplicar esto.
Forma de pago en cotizador (06-11): botones Efectivo / Transferencia · Débito o crédito 1 pago (sin cambio) · Crédito 3 cuotas (+15%) · Crédito 6 cuotas (+25%). Recargo sobre el subtotal de cada línea (precio de oferta si está en oferta, si no de lista) y muestra "N cuotas de $X". Tilde "Aplicar 5% de descuento" MANUAL, visible solo con Efectivo/Transferencia y si hay al menos un producto que NO está en oferta; el 5% nunca se aplica a ofertas. El texto de WhatsApp incluye forma de pago, subtotal, recargo/descuento, total y cuotas. Si la plantilla guardada no tiene esto (busca "const PAGOS"), hay que volver a implementarlo.
Novedades + categorías + últimas (12-11): build.js acepta 2 args más: `node build.js <stock> <NOMBRE> <ofertas> <stock_DEL_DIA_ANTERIOR> <dd/mm/aaaa anterior>` → EMB.nov {desde, nuevos[códigos], agotados[{c,n}], precios[{c,n,a,b}]}. La página muestra aviso amarillo "📢 Novedades" (abre lista; tocar un producto lo busca), etiquetas NUEVO y PRECIO ACTUALIZADO (con precio anterior). Categorías (2da fila de botones, combinables con ubicación): Porcelanatos y cerámicos / Grifería (FV, Peirano, Robinet, Hidromet, Piazza grifería) / Sanitarios (Ferrum, Roca, Derpla, Lavaica, Johnson, Home Navarro, Piazza bachas/bañeras) / Pegamentos y accesorios (Weber, Abrasivos, Moldumet, etc.) / Otros (INSUMOS internos, Administración, servicios). "Últimas X cajas/u.": en Mi local ≤5 cajas o ≤2 unidades. Guardar SIEMPRE el Excel de cada día para comparar al siguiente.
"precio" del Excel = por m² en cerámicos/porcelanatos (precio caja = precio × mtsporcaja) y por unidad en el resto.
