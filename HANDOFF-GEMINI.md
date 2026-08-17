# Traspaso de proyecto: "Anatómica Natural" — app de rutinas de gimnasio

## Antes de empezar (importante)

Este proyecto se desarrolló con Claude en un entorno sandbox sin acceso persistente a
GitHub. **Hoy el código vive en la máquina local del usuario (dentro de Claude Code),
no en un repositorio remoto todavía.** Antes de que Gemini pueda tomarlo desde GitHub,
alguien tiene que:

1. Inicializar git en la carpeta del proyecto (`git init`) si no existe ya.
2. Crear un repositorio en GitHub y hacer el primer push.
3. Recién ahí darle a Gemini la URL del repo.

Si esto ya se hizo y estás leyendo esto en el propio repo, ignorá esta sección.

---

## Qué es este proyecto

Se llama **Anatómica Natural**. Es una app de generación de rutinas de gimnasio con un
diferencial deliberado: no es "otra app de fitness genérica", su foco está en
**seguridad y personalización real** — rehabilitación de lesiones, corrección
postural, tercera edad, entrenamiento infantil, embarazo/posparto y deportes
específicos — por sobre la hipertrofia/fuerza genérica que domina el mercado.

Hay un documento fuente extenso ("marco teórico") de 26 secciones que definió toda
la lógica de negocio antes de escribir código: filosofía del producto, variables de
entrenamiento, periodización, motor de reglas de seguridad (30 reglas
condición-acción), esquemas de datos, y algoritmo del generador paso a paso. Si existe
en el repo un archivo `marco-teorico-app-rutinas.md`, es la fuente de verdad
conceptual — cualquier cambio de comportamiento debería poder justificarse contra
ese documento (o contra evidencia real si el documento tiene un error, cosa que pasó
varias veces durante el desarrollo — ver sección de aprendizajes abajo).

## Stack técnico

- **Next.js** (App Router) + **TypeScript**
- **Tailwind v4** (paleta "clínico-cálido": tonos hueso, verde pino, terracota — ver
  `app/globals.css` para los tokens de color exactos)
- **Prisma 7** configurado con **driver adapters** (no la sintaxis clásica de
  `url` en el datasource — Prisma 7 cambió esto) — **pero todavía no está conectado
  de verdad**, ver más abajo.
- **SQLite** como base de datos (cuando se conecte Prisma)

## Arquitectura actual: JSON en vez de base de datos real (pendiente #1)

Esto es lo más importante para entender antes de tocar nada: **el modelo de datos de
Prisma existe y compila (`prisma/schema.prisma`), pero ninguna pantalla lo usa
todavía.** Toda la persistencia real hoy pasa por archivos JSON en `/data/*.json`,
leídos y escritos con `node:fs/promises` desde funciones "store" en `/lib/store-*.ts`.

Por qué: el desarrollo se hizo en un sandbox sin acceso a internet, y Prisma necesita
descargar un binario ("engine") la primera vez que se genera el cliente — eso nunca
funcionó ahí. El usuario después instaló todo bien en su máquina real vía Claude Code
(sí compiló y corrió Prisma ahí), pero para no perder velocidad de iteración, todo el
desarrollo posterior se siguió haciendo contra los stores de JSON, con la promesa
explícita (documentada en comentarios del código) de migrar a Prisma real más
adelante — **esa migración nunca se hizo. Es el pendiente más grande y más
importante del proyecto.**

### Los dos tipos de archivos en `/data/`

- **Datos base, NO se tocan ni se borran nunca**: `ejercicios-seed.json` (86
  ejercicios), `reglas.json` (31 reglas del motor), `metodos.json` (3 métodos de
  intensificación).
- **Estado de sesión, se regeneran solos, se pueden borrar sin miedo**:
  `usuario-demo.json`, `rutina-cache.json`, `estado-rutina.json`,
  `sesion-activa.json`, `tests-fuerza.json`, `registros-carga.json`,
  `metodos-aplicados.json`, `rehab-checkpoints.json`.

### ⚠️ Gotcha real que costó tiempo descubrir

`lib/db.ts` importa `ejercicios-seed.json` con un **`import` estático de ES modules**
(`import ejerciciosSeed from "@/data/ejercicios-seed.json"`). Next.js/Turbopack
**empaqueta ese JSON en el build de producción**. Si corrés `npm run build` una vez y
después modificás `ejercicios-seed.json`, **el cambio no se refleja hasta que
volvés a correr `npm run build`** — `npm start` sirve el bundle viejo. Esto generó
confusión varias veces durante el desarrollo. En modo `npm run dev` esto no pasa
(hot reload sí lo toma), pero conviene tenerlo presente si Gemini prueba con
`build` + `start`.

## Los stores (equivalente a "repositorios" antes de Prisma)

Todos siguen el mismo patrón: leer JSON, mutar, escribir JSON, con comentarios
explícitos de "esto se reemplaza por `prisma.X.findMany()` sin cambiar la firma de
la función cuando se migre".

| Store | Qué guarda |
|---|---|
| `lib/db.ts` | Biblioteca de 86 ejercicios (lectura, no hay escritura) |
| `lib/store-usuario.ts` | Perfil del usuario (un solo usuario "demo" hardcodeado — no hay multi-usuario ni auth todavía) |
| `lib/store-estado-rutina.ts` | Qué día del split le toca, semana de mesociclo, fase |
| `lib/store-rutina-cache.ts` | La rutina ya generada para el día/semana actual (evita que se recalculen ejercicios distintos entre pantallas — ver "aprendizajes" abajo, este fue un bug real) |
| `lib/store-sesion-activa.ts` | Cuántas series de cada ejercicio ya se completaron hoy |
| `lib/store-registro-carga.ts` | Historial de cargas/RIR + lógica de sugerencia de próxima carga |
| `lib/store-test-fuerza.ts` | Tests de 1RM (fórmula de Epley) |
| `lib/store-metodos.ts` | Qué método de intensificación se usó y cuándo (para respetar frecuencia máxima semanal) |
| `lib/store-rehab-checkpoint.ts` | Fase de rehabilitación confirmada por lesión |

## El generador (`lib/generador.ts`) — el corazón del proyecto

Es el archivo más largo e importante. Función pública: `generarRutina(perfil)`.
Internamente:

1. **Cachea por día/semana** (`generarRutina` es un wrapper alrededor de
   `generarRutinaSinCache` que consulta/guarda en `store-rutina-cache.ts`) — esto es
   deliberado, ver "aprendizajes".
2. Determina el **split** (full_body / upper_lower / ppl) según
   `perfil.diasPorSemana`, o usa una **plantilla deportiva** (`PLANTILLAS_DEPORTE`)
   si `perfil.deporte` está seteado (fútbol, vóley, básquet, tenis/pádel, hockey).
3. Arma **buckets** de patrones de movimiento por día (ej. día "Push" =
   empuje_horizontal + empuje_vertical + extensión de codo + core).
4. Por cada bucket, filtra candidatos por equipamiento/nivel, y **ordena por
   prioridad**: primero ejercicios correctivos para una lesión activa del usuario,
   después multiarticulares antes que monoarticulares (esto generó un bug sutil, ver
   abajo).
5. Pasa cada candidato por el **motor de reglas** (`lib/motor-reglas.ts`) — si
   bloquea, prueba el siguiente candidato del mismo bucket (sustitución automática).
6. Asigna series/reps/descanso según objetivo, ajustado por fase de mesociclo
   (acumulación/intensificación/descarga).
7. Prescribe **duración en vez de repeticiones** para ejercicios isométricos
   (tag `isometrico`).
8. Aplica un **método de intensificación** al último ejercicio elegible (solo
   monoarticular, nunca isométrico, nunca multiarticular pesado — ver evidencia
   citada abajo).
9. Rota candidatos si el mismo tipo de día se repite más de una vez en la semana
   (PPL con 5-6 días) para no repetir exactamente los mismos ejercicios.

## Motor de reglas (`lib/motor-reglas.ts` + `data/reglas.json`)

31 reglas condición-acción (30 originales + R-031 agregada durante el desarrollo).
Cada regla es un predicado TypeScript puro: `(ctx: ContextoEvaluacion) => boolean`.
Tipos de acción: `bloqueo` (descarta el candidato), `alerta_fuerte` (se muestra pero
no bloquea), `bloqueo_generador` (vacía toda la rutina — usado para casos como
embarazo sin autorización médica confirmada).

Verificación: `lib/__tests__/verificar-motor-reglas.ts` — correr con
`npx tsx lib/__tests__/verificar-motor-reglas.ts`. Tiene 6 casos que SIEMPRE deben
seguir pasando después de cualquier cambio.

### Reglas más relevantes para entender rápido el sistema

- **R-001/R-002**: lesión de hombro bloquea empuje vertical y fondos profundos.
- **R-003/R-004**: lesión de rodilla bloquea sentadilla de alta intensidad, salvo
  ejercicios tageados `rango_controlado`.
- **R-005**: desgarro muscular bloquea ejercicios donde ese músculo es agonista
  **o secundario** — se ajustó dos veces durante el desarrollo, primero solo
  bloqueaba pliometría/excéntrico, después se amplió a cualquier carga sobre el
  músculo (con evidencia clínica real, ver más abajo).
- **R-006**: LCA post-operatorio bloquea pliometría antes de los 6 meses (se calcula
  desde una fecha derivada de "meses transcurridos" que carga el usuario).
- **R-020**: tercera edad + ejercicio con maniobra de Valsalva → alerta.
- **R-031**: tercera edad + CUALQUIER ejercicio con barra → bloqueo (agregada
  después de un bug grave, ver abajo).

## Features completas y verificadas

- Onboarding → perfil (con precarga de datos existentes, no arranca en blanco)
- Selector de equipamiento, días por semana, objetivo, deporte
- Alteraciones posturales, estado gestacional + autorización médica, franja etaria
  automática (calculada desde la edad, no manual)
- Historial de lesiones con **detalle expandible**: músculo específico (desgarro),
  lado (hombro/rodilla/LCA), meses transcurridos (LCA), tipo específico de lesión de
  hombro (manguito rotador/tendinitis/bursitis/pinzamiento/inestabilidad — el dato
  se guarda pero **no cambia el comportamiento de las reglas todavía**, ver
  pendientes)
- Split multi-día + periodización de mesociclo (4 semanas, 3 fases) con
  explicación educativa que se abre sola la primera vez que arranca cada fase
  (componente `InfoFaseMesociclo.tsx`)
- Sobrecarga progresiva por RIR reportado + integración con test de fuerza (1RM
  Epley) para sugerir carga inicial como % de 1RM
- Métodos de intensificación (drop set/rest-pause/myo-reps) aplicados solo donde
  corresponde según evidencia (ver sección de investigación abajo)
- Modo accesible para tercera edad: **persiste en toda la app** (dashboard, detalle
  de ejercicio, auditor, test de fuerza — este último literalmente redirige lejos a
  un usuario de tercera edad, no se le ofrece el test), texto grande, menos campos,
  espacio de video de demostración
- Auditor de rutina (ratio empuje/tracción, alertas del motor de reglas)
- Rehabilitación por fases persistida (`/progreso/[lesion]`), con link de acceso
  desde el detalle de cada lesión en el perfil
- Badge "Para tratar tu lesión" en ejercicios correctivos, con **prioridad real de
  selección** (no es solo un badge cosmético — el ejercicio correctivo gana su
  bloque activamente cuando hay una lesión activa que lo justifica)
- Manejo de cambios de perfil a mitad de sesión: si el usuario ya completó series
  hoy y cambia algo que afecta la rutina, se le pregunta explícitamente si quiere
  seguir con la actual o descartar el progreso y empezar de cero

## Aprendizajes / bugs reales encontrados durante el desarrollo (léelos antes de tocar código)

1. **Caché del navegador de Next.js (Router Cache) mostraba pantallas viejas.**
   Solución: `next.config.ts` tiene `experimental.staleTimes.dynamic = 0`. Si
   Gemini ve comportamiento de "no se actualiza hasta refrescar", revisar esto
   primero antes de asumir que es un bug de lógica.

2. **La rutina del día se recalculaba de forma independiente en cada pantalla**,
   lo que causaba 404 en links viejos si el perfil cambiaba a mitad de sesión (el
   ejercicio dejaba de existir en el recálculo). Se resolvió con
   `store-rutina-cache.ts`: la rutina se genera UNA vez por día/semana y se
   reutiliza. **No volver a la generación "on the fly" sin este cache.**

3. **El criterio de selección prioriza multiarticular sobre monoarticular** por
   diseño (tiene sentido en general — favorece básicos). Efecto secundario: un
   ejercicio isométrico o de aislamiento casi nunca gana un bucket si compite con
   algo multiarticular. Se resolvió parcialmente dándole prioridad más alta a
   ejercicios **correctivos de una lesión activa** (le ganan a todo), pero la
   escalera de progresión de calistenia (ver pendientes) **todavía no tiene esa
   prioridad** y en la práctica casi nunca se selecciona.

4. **Bug grave real**: tercera edad recibía sentadilla/peso muerto/press banca **con
   barra** en su rutina generada — completamente inapropiado. Causa: las reglas
   de tercera edad (R-019/R-020) solo cubrían Valsalva e intensidad extrema, no
   equipamiento. Se agregó R-031 (bloqueo total de cualquier ejercicio con barra
   para tercera edad) tras detectarlo. **Si Gemini agrega una nueva población
   especial o condición, revisar explícitamente qué equipamiento/intensidad es
   apropiado, no asumir que las reglas de intensidad ya cubren todo.**

5. **Métodos de intensificación aplicados a ejercicios isométricos** (ej. "Plancha
   frontal" con "Drop set") no tenía sentido — no hay "repetición" que reducir de
   peso en un ejercicio que se sostiene por tiempo. Se investigó evidencia (fuentes:
   StrengthLog, Arvo, citas de Eric Helms) y se restringió la aplicación de métodos
   a **solo ejercicios monoarticulares (aislamiento), nunca isométricos, nunca
   multiarticulares pesados** (sentadilla/peso muerto/press banca con barra —
   riesgo de fallo técnico bajo fatiga). Ver `lib/generador.ts`, comentario "Paso 7".

6. **Ejercicios isométricos prescriptos con repeticiones** ("8-12 reps" de una
   plancha) en vez de tiempo. Se agregó el tag `isometrico` y una función
   `duracionIsometrica(fase)` que devuelve "30-45s" / "45-60s" / "20-30s" según
   fase de mesociclo. Ver campo `esIsometrico` en `EjercicioRutina`.

7. **R-005 (desgarro muscular) solo miraba el agonista principal**, no los
   músculos secundarios — "Fondos en paralelas" (agonista tríceps, pectoral como
   secundario) no se bloqueaba con un desgarro de pectoral pese a cargarlo de
   verdad. Se agregó comparación contra `musculosSecundarios` también (con mapa de
   normalización, esos datos vienen en inglés sin traducir desde el dataset
   fuente).

8. **La semana de mesociclo avanzaba mal**: originalmente avanzaba cada vez que el
   ciclo del split volvía al día 0 — para full_body (ciclo de 1 día) esto
   significaba que la semana avanzaba **en cada sesión**, llegando a "descarga" en
   4 entrenamientos en vez de 4 semanas reales. Se separó el conteo de "sesiones
   completadas esta semana" (basado en `perfil.diasPorSemana` real) del "día del
   ciclo del split" — son conceptos independientes. Ver `store-estado-rutina.ts`,
   función `avanzarDia`.

## Investigación citada (para justificar decisiones de producto, no inventar)

- **Métodos de intensificación solo en ejercicios de aislamiento**: consistente
  entre StrengthLog, Arvo.guru, y citas directas de Eric Helms ("Doing drop sets or
  rest pause on big compounds, especially squats and deadlifts, is going to
  generate a lot of fatigue") y Børge Fagerli.
- **Lesión de hombro (cualquier subtipo — manguito rotador, tendinitis,
  pinzamiento) evita empuje por encima de la cabeza y fondos profundos**:
  consistente entre Hospital for Special Surgery, NYSI, Jacksonville Orthopaedic
  Institute — la compresión del manguito rotador contra el acromion ocurre
  independientemente del diagnóstico específico.
- **Desgarro muscular activo: evitar carga significativa sobre el músculo
  lesionado**, progresión clínica isométrico sin dolor → isotónico → isocinético
  (Physiopedia, guías de fisioterapia deportiva).

## Base de ejercicios (86 en `data/ejercicios-seed.json`)

Fuente: **free-exercise-db** (github.com/yuhonas/free-exercise-db), licencia
Unlicense (dominio público, uso comercial libre). El dataset original tiene 873
ejercicios — se trajeron 86 a mano, priorizando cobertura de patrones de
movimiento + equipamiento + casos de uso del módulo de lesiones, no cantidad. Cada
entrada tiene: nombre en español (traducido/adaptado a mano, no literal),
instrucciones en español (reescritas, no traducidas literalmente por temas de
calidad), patrón de movimiento, agonista/antagonista, equipamiento, nivel, tags
adicionales, y opcionalmente `objetivoCorrectivo` (qué lesión trata) y
`escaleraAnteriorId`/`escaleraSiguienteId` (progresión de calistenia).

**Vocabulario de equipamiento unificado en español**: `barra`, `mancuernas`,
`maquina`, `polea`, `kettlebell`, `banda_elastica`, `barra_ez`, `otro`, `ninguno`.
(El dataset original tenía tags en inglés — se tradujeron todos, fue un bug real
que costó tiempo detectar porque el filtro de equipamiento comparaba tags en
idiomas distintos silenciosamente.)

## Pendientes explícitos, en orden de importancia

1. **Migrar todos los stores de JSON a Prisma real.** El schema ya existe
   (`prisma/schema.prisma`) y compila. Hay que: (a) escribir `prisma/seed.ts`
   actualizado si no existe, (b) reemplazar cada función de `lib/store-*.ts` y
   `lib/db.ts` por queries de Prisma manteniendo la misma firma de función, (c)
   correr `npx prisma migrate dev` en la máquina real (esto NO se pudo hacer en
   sandbox, sí debería poder hacerse con Gemini si tiene acceso a shell real).
2. **Desgarro muscular no tiene ejercicio correctivo propio** (a diferencia de
   hombro y rodilla) — es más difícil de generalizar porque depende de qué
   músculo específico se lesionó.
3. **Escalera de calistenia sin prioridad de selección** — mismo mecanismo que ya
   existe para ejercicios correctivos de lesión, pendiente de aplicar también acá.
4. **Tipo específico de lesión de hombro no cambia el comportamiento de las
   reglas** — se guarda el dato (manguito rotador vs. tendinitis, etc.) pero todos
   comparten la misma restricción conservadora hoy.
5. **Deportes usan una sola plantilla de sesión**, no rotan por día como el split
   genérico.
6. **Cargar imágenes/gifs reales por ejercicio** — todos tienen
   `mediaStatus: "pendiente"`, hay un campo `videoUrl` ya conectado en la UI
   (muestra placeholder si es null) esperando contenido real.
7. **No hay autenticación ni multi-usuario** — todo el sistema asume un usuario
   único `"demo"` hardcodeado. Habría que agregar auth real antes de cualquier
   lanzamiento.
8. **Métodos de intensificación no citan estudios per-ejercicio** dentro de la
   app — la investigación se usó para decidir la restricción de aplicación pero
   no se expone al usuario final más allá del nombre y descripción del método.

## Cómo verificar que algo sigue funcionando después de un cambio

```bash
npm run build                                          # debe compilar sin errores
npx tsx lib/__tests__/verificar-motor-reglas.ts         # 6 casos, todos deben pasar
```

Para probar de punta a punta sin navegador, usar `curl` contra las rutas de API
(`/api/perfil`, `/api/rutina`, `/api/registro-carga`, `/api/test-fuerza`,
`/api/estado-rutina`, `/api/rehab-checkpoint`, `/api/mesociclo-visto`,
`/api/progreso-sesion`, `/api/ejercicios-test`) — es el método que se usó durante
todo el desarrollo para verificar lógica de negocio sin depender de un navegador
real.

**Ojo con el gotcha del build/import estático** (sección de arquitectura arriba):
si se modifica `data/*.json` y se está corriendo `npm start` (producción), hay que
volver a correr `npm run build` para que el cambio se refleje. En `npm run dev` no
hace falta.
