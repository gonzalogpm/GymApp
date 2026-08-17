# App de Rutinas — módulo de lesiones con base de datos funcional para las 4 zonas

Stack: Next.js (TypeScript) + Tailwind v4 + Prisma 7 (driver adapters) + SQLite.

## Investigación previa: qué faltaba para que el módulo de lesiones fuera "real"
Analicé programáticamente, para cada uno de los 7 músculos comunes de desgarro, si algún bloque de la rutina quedaba completamente vacío. Encontré 2 casos — desgarro de pectoral vacía el bloque de empuje horizontal entero, desgarro de deltoides vacía el de empuje vertical entero — pero **no los "arreglé" agregando ejercicios falsos**: es clínicamente correcto que no haya ninguna variante segura de press con un pectoral desgarrado. La app ya maneja bien ese caso (salta el bloque, sigue con el resto de la sesión).

Encontré dos gaps reales que sí ameritaban una solución:

### 1. R-006 (LCA post-operatorio) nunca se podía probar
Ningún ejercicio de pierna tenía el tag pliométrico que la regla busca. Agregué "Sentadilla con salto (jump squat)". Verificado de forma aislada: bloquea correctamente antes de los 6 meses post-operatorio, deja de bloquear después — usando la fecha real que calculamos a partir de los meses que carga el usuario en el perfil.

### 2. LCA post-operatorio no tenía ningún ejercicio correctivo propio
La "Sentadilla con caja (rango controlado)" ya existía para rodilla/menisco — tiene sentido clínico que sirva también para LCA post-operatorio (mismo principio: reducir el rango de la sentadilla para proteger la articulación). Ahora un mismo ejercicio puede tratar más de una zona lesionada (unifiqué el mapa que antes estaba duplicado en dos lugares del código, con riesgo real de desincronizarse).

## Estado real del módulo de lesiones, zona por zona
- **Hombro**: bloquea empuje vertical y fondos profundos (R-001/R-002), tiene ejercicio correctivo propio (scaption) con prioridad real de selección.
- **Rodilla**: bloquea sentadilla de alta intensidad (R-003), sustituye por rango controlado con prioridad real.
- **Desgarro muscular**: bloquea por músculo específico (agonista + secundario, sección de la sesión anterior) — sin ejercicio correctivo propio todavía, pero probado que no deja ningún bloque roto de forma inesperada.
- **LCA post-operatorio**: bloquea pliometría antes de los 6 meses (R-006, recién conectada), comparte el correctivo de rango controlado con rodilla.

## Verificado
- Los 6 casos del motor de reglas base siguen pasando.
- R-006 verificado de forma aislada (2 meses bloquea, 8 meses no).
- 86 ejercicios, todos con id único.
- Las 8 rutas responden bien.

## Pendiente
1. Migrar los stores de JSON a Prisma real.
2. Desgarro muscular sigue sin ejercicio correctivo dedicado (es más difícil de generalizar porque depende de qué músculo específico se lesionó).
3. La escalera de calistenia todavía no tiene la misma prioridad de selección que ahora tienen los ejercicios correctivos.
