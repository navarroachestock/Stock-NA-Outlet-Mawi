# Reyes Hermanos — Control del negocio

Página web para anotar gastos y ventas de las milanesas, ver cuánto queda de ganancia por día, semana y mes, y seguir objetivos mensuales o trimestrales. Funciona en la compu y en el celular.

## 1. Usarla ya (solo en tu dispositivo)

Abrí `index.html` con el navegador (Chrome, Safari). Todo lo que cargues queda guardado en ese navegador. Si borrás los datos del navegador se pierde: usá **Ajustes → Descargar copia** de vez en cuando.

## 2. Compartirla con tus socios (Google Sheets, gratis)

Así todos cargan y ven lo mismo, y además queda todo en una planilla de Google.

1. Entrá a [sheets.new](https://sheets.new) y creá una planilla. Ponele de nombre "Reyes Hermanos – Datos".
2. Menú **Extensiones → Apps Script**.
3. Borrá lo que aparece y pegá todo el contenido de `Codigo.gs`.
4. En la línea `const CLAVE = 'cambiar-esta-clave';` poné una clave propia (ej. `milas-reyes-2026`). Guardá (ícono del disquete).
5. Arriba, elegí la función **prepararPlanilla** y tocá **▶ Ejecutar**. Google te va a pedir permisos: aceptá (si dice "app no verificada", tocá *Configuración avanzada → Ir a…*). Se crean las hojas `gastos`, `ventas`, `objetivos`, `clientes` y `pedidos`.
6. Tocá **Implementar → Nueva implementación** → tipo **Aplicación web**:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
7. Copiá la **URL de la aplicación web** (termina en `/exec`).
8. En la página: **Ajustes → Compartir con tus socios** → pegá la URL y la clave → **Conectar y sincronizar**.
9. Pasale la URL y la clave a tu hermano y socios para que hagan lo mismo en su celular.

Si después cambiás el código del script: **Implementar → Administrar implementaciones → editar → Versión nueva**, así la URL sigue siendo la misma.

> La clave es lo que protege los datos: el link de la página puede ser público, pero sin la clave nadie puede leer ni cargar nada. No la publiques.

## 3. Subirla a GitHub Pages (para abrirla con un link desde cualquier lado)

1. Creá una cuenta en [github.com](https://github.com) si no tenés.
2. **New repository** → nombre `reyes-hermanos` → Public → Create.
3. **Add file → Upload files** → subí `index.html` (y si querés este LEEME). **Commit changes**.
4. **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
5. En 1–2 minutos queda en `https://TU-USUARIO.github.io/reyes-hermanos/`.
6. En el celular, abrí ese link y usá **Compartir → Agregar a pantalla de inicio** para tenerla como una app.

No subas `Codigo.gs` con tu clave real a un repositorio público.

## Cómo calcula

- **Ganancia** = lo vendido − lo gastado en ese período (según la fecha de cada carga).
- **Caja / "Hoy hay"** = todo lo cobrado menos todo lo gastado, separado por forma de pago (efectivo o transferencia). Es lo que debería haber en cada lugar.
- **Pedidos**: cuando tocás *Entregar* y confirmás, el pedido se convierte solo en venta (una por producto), con la fecha de hoy.
- **Clientes que dejaron de comprar**: aparecen los que hace más de X días (lo elegís en Ajustes) que no compran y no tienen pedido pendiente, con un botón para mandarles un WhatsApp ya escrito.
- **Te deben** = ventas marcadas como "No, me debe". Cuando te paguen, editá la venta y marcala como cobrada.
- **Costo del pollo por kg** sale de los gastos de "Pollo / pechugas" donde pusiste la cantidad en kg.
- En **Objetivos**, la rayita negra en la barra marca dónde deberías estar hoy para llegar a la meta a tiempo, y te dice a qué ritmo cerrás el período.
