# Brief de proyecto web — integrado a takariwa-website

Formulario propio en `/briefs/web_brief` + panel de administración en
`/admin/briefs`, hecho a la medida del repo real (`takariwastudio/takariwa-website`,
Next.js 16, Tailwind v4, Bebas Neue + Jost). Validado con `tsc --noEmit` y
`eslint` contra ese proyecto — solo faltan las variables de entorno reales.

## Qué se agrega

```
app/briefs/web_brief/
  page.tsx        rutas y metadata
  BriefForm.tsx   el formulario multi-paso (client component)
  steps.ts        todas las preguntas — única fuente de verdad
  actions.ts      server action que guarda en Supabase
app/admin/briefs/
  page.tsx        lista de briefs recibidos
  [id]/page.tsx   detalle de un brief
lib/supabase/
  client.ts       cliente con anon key (solo INSERT)
  server.ts       cliente con service role key (solo servidor)
proxy.ts          protección básica de /admin (ver nota Next 16 abajo)
supabase/schema.sql
```

Nada de esto toca `app/page.tsx`, `layout.tsx` ni `globals.css` — es aditivo.

## Nota importante: Next.js 16 renombró Middleware a Proxy

Este repo corre Next 16.2.12. Desde la v16, `middleware.ts` está deprecado y
la convención pasó a ser `proxy.ts` (la función exportada se llama `proxy`,
no `middleware`). Ya está resuelto en este entrega — si el repo ya tenía un
`middleware.ts` propio, avísame para fusionarlo en vez de que convivan dos
archivos haciendo lo mismo.

## Instalación

```bash
npm install @supabase/supabase-js
```

1. Crear un proyecto en [supabase.com](https://supabase.com) (plan gratis
   alcanza sin problema). En el **SQL editor**, correr `supabase/schema.sql`.
2. Copiar `.env.example` a `.env.local` y llenar con las keys reales
   (Project Settings → API) y un usuario/clave para `/admin`. En Vercel,
   agregar las mismas variables en Project Settings → Environment Variables.
3. `npm run dev` → probar en `localhost:3000/briefs/web_brief`.

## Diseño

Usa exactamente los tokens ya definidos en `globals.css` (`--color-ink`,
`--color-paper`, `--color-yellow`, `--color-orange`, `--color-magenta`,
`--color-purple`, `--color-blue`) y las mismas fuentes (`font-display` =
Bebas Neue, `font-body` = Jost). La barra de progreso usa los mismos 5
colores que ya rotan en el marquee de la home — un acento distinto por
paso, no una paleta nueva. El título de "brief recibido" reutiliza la
clase `.headline` que ya tienen para el efecto glitch del "Próximamente".

Las preguntas del formulario viven solas en `steps.ts` — agregar, quitar o
reordenar un campo se hace ahí una vez y se refleja solo en el formulario
y en la vista admin.

## Gestión de briefs

El estado (`nuevo`, `en_revision`, `aprobado`, `archivado`) vive en Supabase
pero por ahora se cambia directo desde la tabla en el dashboard de Supabase
— con el volumen que va a tener esto al inicio no hace falta más. Si más
adelante quieres botones de estado o notas internas desde el panel mismo,
es una extensión chica sobre lo que ya está armado.

## Seguridad

- El formulario público usa la Supabase **anon key**, que solo puede
  `INSERT` (política RLS en `schema.sql`) — no puede leer briefs ajenos
  aunque alguien inspeccione el código del navegador.
- `/admin/briefs` usa la **service_role key**, que solo corre en
  componentes de servidor y nunca se envía al navegador.
- `/admin` está protegido con autenticación básica vía `proxy.ts`. Para
  uno o dos administradores es suficiente; si el equipo crece, vale la
  pena migrar a algo como Supabase Auth.
