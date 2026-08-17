# Marco Teórico – App de Rutinas de Entrenamiento
### Documento base desde la perspectiva de Licenciatura en Alto Rendimiento Deportivo

---

## 1. Rol y filosofía de la app

**Esta no es una app más de rutinas de gimnasio.** El mercado ya está saturado de generadores genéricos de hipertrofia/fuerza para adultos sanos — eso la app lo soporta, pero no es su razón de ser. **El diferencial y la base del producto son cinco pilares que la mayoría de las apps de fitness no atiende con seriedad**: recuperación de lesiones (sección 12), corrección postural y escoliosis (sección 13), tercera edad (sección 14), entrenamiento infantil (sección 15) y rendimiento deportivo específico (sección 11). Todo el resto del marco teórico — fuerza, hipertrofia, cardio, métodos de intensificación — existe como soporte transversal de estos cinco pilares, no al revés.

Esto tiene consecuencias concretas de diseño, no es solo una declaración de intenciones:

- La app actúa como un **entrenador virtual con criterio profesional**, nunca como un simple "generador de rutinas". Nunca arma o valida una rutina sin cruzarla contra variables de seguridad (historial de lesiones, experiencia, frecuencia, volumen acumulado).
- Cuando el usuario arma su propia rutina "a mano", el sistema debe **auditarla en tiempo real** y advertir sobre riesgos (ej: sobrecarga de un grupo muscular, falta de antagonistas, volumen excesivo para su nivel, combinación peligrosa de ejercicios en personas con lesiones activas).
- Educa mientras guía: cada alerta debe explicar el "por qué", no solo bloquear.
- **Todo ejercicio, rutina o recomendación que la app entrega debe presentarse explícitamente como una recomendación basada en evidencia — nunca como una indicación clínica ni un reemplazo del criterio de un profesional.** Esto no es un disclaimer que se muestra una vez al abrir la app y se olvida: debe ser un principio de diseño persistente. En la práctica, esto significa:
  - Un mensaje breve y siempre visible (no un modal que se cierra y desaparece) en cualquier pantalla donde se muestre una rutina de los cinco pilares — algo como *"Recomendación basada en evidencia. No reemplaza la evaluación de un profesional."* visible de forma discreta pero constante, no solo en el onboarding.
  - En los módulos más sensibles (rehabilitación, escoliosis, entrenamiento infantil), este mensaje se refuerza con lenguaje más específico según el contexto (ej. "requiere supervisión de un adulto responsable", "consultá a tu kinesiólogo antes de avanzar de fase").
  - Las fuentes profesionales que respaldan cada módulo (sección 26) deben ser accesibles desde la propia app, no quedar solo en este documento — esto es lo que le da credibilidad real al mensaje "basado en evidencia" frente al usuario.

---

## 2. Perfil de usuario (inputs base del sistema)

Todo el motor de recomendaciones y alertas depende de un perfil inicial:

| Categoría | Datos |
|---|---|
| Antropometría | edad, sexo biológico, peso, altura |
| Experiencia | principiante (<6 meses), intermedio (6m–2a), avanzado (2a+) |
| Objetivo principal | hipertrofia, fuerza máxima, potencia, resistencia, salud general, rendimiento deportivo, rehabilitación |
| Disponibilidad | días/semana, minutos/sesión |
| Equipamiento | gimnasio completo, casa con mancuernas, bandas, sin equipo |
| Historial de lesiones | zona, tipo, fecha, estado (activa/en recuperación/resuelta), fase de rehab si aplica |
| Condiciones especiales | tercera edad, embarazo, hipertensión, etc. (flags de precaución) |
| Deporte específico | opcional, si busca rendimiento deportivo |

Este perfil es el que activa las reglas de negocio (ver sección 9).

---

## 3. Variables del entrenamiento (la "gramática" de toda rutina)

Toda rutina, sin importar el objetivo, se construye combinando estas variables:

- **Volumen**: series x repeticiones x carga (o series semanales por grupo muscular — la unidad más usada hoy es *series efectivas/semana/grupo muscular*).
- **Intensidad**: % de 1RM, o percepción de esfuerzo (RPE 1–10 / RIR "repeticiones en reserva").
- **Frecuencia**: veces por semana que se estimula un grupo muscular o patrón de movimiento.
- **Densidad**: relación trabajo/descanso.
- **Tempo**: velocidad de cada fase del movimiento (excéntrica-isométrica-concéntrica, ej. 3-1-1).
- **Selección de ejercicios**: multiarticulares (básicos) vs monoarticulares (aislamiento).
- **Orden de ejecución**: de básicos a aislados, de mayor a menor demanda técnica/neural.
- **Progresión**: cómo evoluciona la carga de trabajo en el tiempo.

La app debe permitir configurar estas variables por ejercicio, por sesión y por mesociclo (bloque de semanas).

---

## 4. Estructura de rutina: agonistas, antagonistas y splits

### 4.1 Conceptos clave
- **Agonista**: músculo protagonista del movimiento (ej. pectoral en press de banca).
- **Antagonista**: músculo opuesto funcionalmente (ej. dorsal en el mismo caso).
- **Sinergista/estabilizador**: asiste el movimiento sin ser el protagonista.

Mantener equilibrio agonista/antagonista es central para prevenir lesiones (ej. cuádriceps/isquiotibiales, pectoral/dorsal, deltoides anterior/posterior). La app debe calcular automáticamente el **ratio de volumen** entre grupos antagonistas y alertar si hay desbalance (ej. empuje >> tracción).

### 4.2 Tipos de organización (splits) que la app debe soportar
- **Full Body**: todo el cuerpo por sesión (ideal principiantes, 2-3x/semana).
- **Upper/Lower**: tren superior / tren inferior (4x/semana).
- **Push/Pull/Legs (PPL)**: empuje / tracción / piernas (3-6x/semana).
- **Split por grupo muscular ("bro split")**: un grupo grande por día (avanzados con alto volumen tolerado).
- **Agonista-antagonista por sesión**: ej. pecho+espalda, bíceps+tríceps, cuádriceps+isquiotibiales.
- **Push/Pull/Legs con énfasis en patrones de movimiento** (sentadilla, bisagra de cadera, empuje horizontal/vertical, tracción horizontal/vertical) — más funcional que "por músculo".

La app debe sugerir el split según días disponibles + experiencia, y permitir edición manual con validación.

---

## 5. Métodos y técnicas de entrenamiento (biblioteca de métodos)

La app debe incluir estos métodos como "modificadores" aplicables a un ejercicio dentro de una rutina:

### 5.1 Métodos de intensificación (hipertrofia/fuerza)
- **Series rectas**: mismo peso y reps en todas las series.
- **Piramidal ascendente/descendente**: la carga sube y las reps bajan (o viceversa).
- **Drop set**: al fallo, se reduce el peso (15-30%) y se continúa sin pausa. 1-3 "drops".
- **Rest-pause**: al fallo, pausa de 10-20seg y se continúan repeticiones con el mismo peso.
- **Myo-reps**: una serie de activación al fallo técnico + mini-series de 3-5 reps con pausas cortas.
- **Cluster sets**: fraccionar una serie en mini-bloques con descansos de 10-15seg entre repeticiones, permite usar más carga.
- **Superseries**: dos ejercicios seguidos sin descanso.
  - *Agonista-antagonista* (ej. curl + press tríceps): mantiene intensidad, ahorra tiempo.
  - *Del mismo grupo muscular (pre-exhaustación/post-exhaustación)*: mayor estrés metabólico.
- **Series gigantes (giant sets)**: 3-4 ejercicios seguidos, mismo grupo muscular.
- **Excéntricas acentuadas/enfatizadas**: fase negativa lenta (3-5seg) o con sobrecarga excéntrica.
- **Isometrías**: mantenimiento de una posición bajo tensión (útil también en rehab).
- **Repeticiones parciales**: rango incompleto al final de una serie al fallo.
- **EMOM (every minute on the minute)**: técnica/potencia, útil en híbridos.
- **AMRAP (as many reps as possible)**: común en fuerza-resistencia y CrossFit-style.

### 5.2 Reglas de seguridad asociadas
- Drop set, rest-pause y myo-reps: **no recomendar** en usuarios principiantes ni en fases de rehabilitación (alto estrés articular/fatiga con técnica aún no consolidada).
- Excéntricas acentuadas: contraindicadas en lesiones tendinosas agudas.
- Techniques al fallo: limitar frecuencia semanal (recuperación del sistema nervioso central).

---

## 6. Sobrecarga progresiva

Principio rector: el estímulo debe aumentar progresivamente para seguir generando adaptación.

### 6.1 Formas de progresión que la app debe permitir programar
1. **Progresión de carga**: mismo esquema, más peso.
2. **Progresión de volumen**: más series/repeticiones con la misma carga.
3. **Progresión de densidad**: mismo trabajo, menos descanso.
4. **Progresión de rango de movimiento / dificultad técnica**: ej. de sentadilla a sentadilla con pausa.
5. **Progresión de frecuencia**: mismo volumen semanal, repartido en más sesiones.

### 6.2 Modelos de periodización (a nivel de mesociclo)
- **Lineal**: intensidad sube y volumen baja progresivamente en semanas (clásica para fuerza).
- **Ondulante (diaria o semanal)**: se varía intensidad/volumen entre sesiones de la misma semana (común en hipertrofia/fuerza combinadas).
- **Por bloques**: bloques de acumulación (volumen) → intensificación (intensidad) → realización (pico).
- **Autorregulada (RPE/RIR based)**: la carga se ajusta según el esfuerzo percibido real de cada sesión, no un número fijo predeterminado.

La app debe registrar el historial de cargas para sugerir automáticamente el siguiente incremento (ej. +2.5kg si RIR real fue mayor al planificado dos sesiones seguidas) y **alertar sobre estancamiento o señales de sobreentrenamiento** (caída de rendimiento sostenida, RPE creciente con misma carga).

---

## 7. Tipos de fuerza (módulos independientes)

| Tipo | % 1RM | Reps | Series | Descanso | Objetivo fisiológico |
|---|---|---|---|---|---|
| **Fuerza máxima** | 85-100% | 1-5 | 3-6 | 3-5 min | Reclutamiento neural, RFD, coordinación intramuscular |
| **Fuerza-potencia** | 30-60% (carga óptima) o con sobrecarga en gestos explosivos | 1-5 (máxima velocidad) | 3-6 | 2-4 min (recuperación completa, calidad > cantidad) | Producción de fuerza en el menor tiempo posible (RFD, pliometría, olímpicos) |
| **Fuerza-resistencia** | 40-60% | 15-25+ | 2-4 | 30-60 seg | Tolerancia al lactato, resistencia muscular local |
| **Hipertrofia** (transversal a los anteriores) | 65-80% | 6-12 | 3-5 | 60-90 seg | Estrés mecánico + metabólico, tiempo bajo tensión |

La app debe ofrecer un **selector de objetivo** que automáticamente ajuste rangos de reps/descansos/tempo por defecto, editables por el usuario (con alerta si se sale mucho del rango recomendado para su objetivo).

---

## 8. Cardio y rutinas híbridas

### 8.1 Métodos de cardio
- **LISS** (baja intensidad continua): 60-70% FCmáx, útil en recuperación activa y salud cardiovascular base.
- **MICT** (intensidad moderada continua): 70-80% FCmáx.
- **HIIT**: intervalos de alta intensidad (85-95% FCmáx) con pausas, formatos: Tabata, 30/30, 1:1, etc.
- **Zonas de entrenamiento** (basadas en % FC máxima o umbral): la app debe calcular zonas automáticamente (fórmula de Karvonen recomendada, más precisa que 220-edad).

### 8.2 Entrenamiento concurrente (híbrido fuerza + cardio)
Punto crítico a nivel profesional: existe el **"efecto de interferencia"** (el cardio, sobre todo de larga duración, puede atenuar las adaptaciones de fuerza/hipertrofia si se programa mal).

Reglas que la app debe aplicar:
- Priorizar el objetivo principal del usuario al inicio de la sesión (si el foco es fuerza, fuerza primero).
- Separar sesiones de fuerza y cardio de alta intensidad por al menos 6-8h si es posible, o en días distintos.
- Preferir cardio de bajo impacto (bici, elíptico) sobre corridas de alto impacto si el objetivo prioritario es fuerza en tren inferior.
- Controlar volumen total semanal combinado para evitar fatiga acumulada excesiva.

---

## 9. Motor de alertas y seguridad (núcleo diferencial de la app)

Esto es lo que convierte a la app en algo más que una planilla. Debe funcionar como un **sistema de reglas** que cruza el perfil del usuario con la rutina armada:

### 9.1 Alertas por desbalance estructural
- Volumen de empuje >> tracción (o viceversa) → riesgo postural (ej. hombros redondeados, pinzamiento).
- Ausencia de trabajo de core/estabilizadores en rutinas de fuerza alta.
- Ausencia de trabajo unilateral en deportes con gestos asimétricos.

### 9.2 Alertas por volumen/frecuencia
- Series semanales por grupo muscular fuera de rango según experiencia (ej. principiante con >20 series/grupo/semana).
- Mismo grupo muscular entrenado con <48h de recuperación en usuarios no avanzados.
- Ejercicios de alto impacto axial (sentadilla, peso muerto pesado) en días consecutivos.

### 9.3 Alertas por historial de lesiones (reglas condicionales)
Ejemplos de reglas "si-entonces" que el sistema debe tener precargadas:

- **Hombro (manguito rotador)**: si hay lesión activa o en fase temprana → bloquear/advertir sobre press militar detrás de nuca, fondos profundos, press banca con rango completo y cargas altas; sugerir rango parcial, rotación externa con banda, trabajo de estabilidad escapular.
- **Rodilla (meniscos)**: advertir sobre sentadilla profunda con carga alta y ejercicios de torsión con pie fijo; sugerir progresión de ángulos de rodilla y control excéntrico.
- **Desgarros musculares** (isquiotibiales, gemelos, etc.): bloquear trabajo excéntrico intenso y pliometría hasta confirmar fase de remodelación tisular avanzada; priorizar reintroducción gradual de tensión.
- **Post-operatorio LCA**: la app debe pedir **semanas/meses post-cirugía** y aplicar fases (ver sección 12) — nunca permitir pliometría o cambios de dirección antes del alta funcional del profesional tratante.

**Regla general no negociable**: ante cualquier lesión activa o post-quirúrgica, la app debe mostrar siempre un disclaimer de que **no reemplaza la evaluación de un kinesiólogo/médico/traumatólogo**, y limitarse a un rol de acompañamiento dentro de rangos conservadores.

### 9.4 Alertas por señales de sobrecarga/sobreentrenamiento
- Caída sostenida de rendimiento (misma carga, más RPE) por 2+ semanas.
- Dolor reportado como "agudo" o "articular" (distinto de fatiga muscular) → recomienda pausa y consulta profesional, no solo "bajar intensidad".
- Frecuencia cardíaca en reposo elevada de forma sostenida (si hay integración wearable).

---

## 10. Entrenamiento sin equipamiento (calistenia y mobiliario urbano)

Este módulo cubre un caso de uso muy real, sobre todo en el mercado argentino: usuarios que no tienen acceso a un gimnasio y entrenan con su propio cuerpo, en casa o en espacios públicos (plazas, parques). No es simplemente "la rutina de gimnasio sin las máquinas" — requiere lógica propia porque la variable de progresión ya no es la carga externa (kg), sino la **dificultad mecánica de la palanca, el ángulo, o el tiempo bajo tensión**.

### 10.1 Niveles de equipamiento configurables

El campo `equipamiento` del perfil de usuario (sección 2) debe ser granular, no binario. Se propone un sistema de **checkboxes acumulativos**, ya que un mismo usuario puede tener acceso a combinaciones distintas según el día (ej. en casa solo peso corporal, pero los fines de semana va a la plaza):

| Nivel | Elementos | Ejemplo de contexto |
|---|---|---|
| **Solo peso corporal** | Ninguno | Habitación, living, hotel |
| **Peso corporal + bandas elásticas** | Bandas de resistencia (liviana/media/fuerte) | Casa, mochila de viaje |
| **Mobiliario urbano tipo plaza/parque (Argentina)** | Barra de dominadas fija, paralelas bajas, espaldera, banco/cajón de cemento, barras a distinta altura | Plazas y parques públicos, muy comunes en Argentina |
| **Mobiliario urbano + accesorios portátiles** | Lo anterior + bandas elásticas, tobilleras con peso, mochila lastrada (chaleco o mochila con peso agregado) | Combinación más completa sin gimnasio |

El generador de rutinas (sección 14.3, generador asistido) debe filtrar la biblioteca de ejercicios exclusivamente por los elementos que el usuario marcó como disponibles, y debe poder recalcular la rutina al vuelo si el usuario cambia de contexto un día puntual (ej. "hoy entreno en casa, sin plaza").

### 10.2 Lógica de progresión sin carga externa

Como no hay forma de "agregar 2.5kg" en la mayoría de estos ejercicios, la sobrecarga progresiva (sección 6) se adapta usando estas variables, en este orden de prioridad recomendado:

1. **Progresión de volumen**: más repeticiones o series con la misma variante del ejercicio (la más simple de aplicar, y la primera que debería sugerir el sistema).
2. **Progresión de densidad**: mismo volumen, menos descanso entre series.
3. **Progresión de tempo**: fases excéntricas más lentas (ej. flexión de brazos bajando en 4 segundos), o pausas isométricas en el punto más difícil del recorrido.
4. **Progresión de palanca/dificultad mecánica**: cambiar a una variante biomecánicamente más exigente del mismo patrón de movimiento cuando el usuario supera un umbral de repeticiones limpias (ej. 3 series de 12-15 reps estrictas) — es el equivalente calisténico a "subir el peso".
5. **Progresión de carga externa portátil**: si tiene mochila lastrada o chaleco con peso, se puede sumar peso externo controlado antes de saltar de variante.

La app debe tener precargada, para los ejercicios principales de calistenia, una **escalera de progresión de variantes** (de más fácil a más difícil) para poder sugerir automáticamente el siguiente escalón. Ejemplos:

- **Empuje horizontal**: flexión de rodillas → flexión de pie inclinada (manos elevadas) → flexión estándar → flexión con pies elevados → flexión a una mano asistida (con apoyo parcial).
- **Tracción vertical**: dominada asistida con banda elástica → negativas (bajar controlado desde arriba) → dominada completa → dominada con lastre.
- **Empuje vertical (hombro)**: flexión pike (cadera elevada) → flexión pike con pies elevados → parada de manos apoyada en pared, flexión parcial.
- **Sentadilla/tren inferior**: sentadilla asistida (sosteniéndose de una barra) → sentadilla libre → sentadilla búlgara (pie trasero en banco/cajón) → sentadilla a una pierna asistida.
- **Core**: plancha con rodillas apoyadas → plancha estándar → plancha con elevación de pierna → rueda abdominal parcial.

### 10.3 Ejercicios específicos con mobiliario urbano argentino

Biblioteca dedicada a los elementos típicos de plazas/parques públicos, con su función y forma de uso:

| Elemento urbano | Ejercicios habilitados |
|---|---|
| **Barra de dominadas fija** | Dominadas (pronada/supinada/neutra según el diseño de la barra), remo invertido en barra baja, elevación de piernas colgado (core), fondos si la barra lo permite |
| **Paralelas bajas/barras paralelas** | Fondos de tríceps, plancha en paralelas, elevación de piernas |
| **Espaldera** | Elevación de piernas colgado, estiramientos activos, sentadilla asistida |
| **Banco/cajón de cemento o madera** | Sentadilla búlgara (pie trasero elevado), zancadas con elevación, fondos de tríceps con banco (manos apoyadas atrás), flexiones con pies elevados |
| **Superficie plana amplia (césped/cemento)** | Todo el bloque de ejercicios de piso: core, flexiones, sentadillas, zancadas, ejercicios pliométricos básicos (saltos) |

Esta biblioteca debe integrarse con el **motor de sustitución inteligente** (sección 20.4.2): si el usuario marca "mobiliario urbano" pero un día puntual no tiene acceso a una barra de dominadas específica, el sistema sustituye por la variante de tracción horizontal más cercana disponible (ej. remo con mochila lastrada, o directamente aumenta volumen de otro patrón de tracción).

### 10.4 Integración con los tipos de fuerza y objetivos (secciones 7 y 20)

El modo "sin equipamiento" no es un objetivo en sí mismo — es una **restricción de recursos** que atraviesa todos los objetivos ya definidos. La app debe poder generar, dentro de este modo:

- **Hipertrofia**: usando progresión de volumen/tempo/palanca como reemplazo de la progresión de carga.
- **Fuerza-resistencia**: es el objetivo que más naturalmente encaja con calistenia sin lastre (altas repeticiones, circuitos).
- **Fuerza máxima/potencia relativa**: variantes avanzadas de alta dificultad mecánica (ej. flexiones a una mano, dominadas con lastre, pistol squat) cumplen un rol equivalente a las cargas altas — pero requieren una base de nivel intermedio-avanzado antes de sugerirse, y el sistema debe advertir sobre el riesgo de progresar de variante demasiado rápido (mismo principio de seguridad de la sección 6).
- **Rutinas deportivas y tercera edad** (secciones 11 y 14): totalmente compatibles — de hecho, para tercera edad el trabajo de peso corporal con apoyo (silla, banco) suele ser el punto de partida más seguro antes de progresar a cualquier carga externa.

---

## 11. Rutinas para deportes específicos

Estructura común para todo módulo deportivo: **Fuerza base → Fuerza específica → Potencia/Velocidad → Componente cardio-metabólico específico del deporte → Prevención de lesiones → Periodización por temporada (pretemporada/competencia/transición)**.

### 11.1 Componente cardio-metabólico específico por deporte

Este es un bloque que **todo módulo deportivo debe incluir de forma obligatoria**, y que hasta ahora en el documento estaba implícito dentro de "potencia/velocidad" — conviene separarlo como categoría propia porque tiene su propia lógica de programación (series, distancias, pausas, relación trabajo:descanso), distinta tanto del cardio genérico de la sección 8 como del trabajo de fuerza.

La razón es simple: el cardio genérico (LISS/HIIT continuo o por intervalos regulares) no reproduce la demanda real de un deporte de campo/cancha, donde el esfuerzo es **intermitente, acíclico y con cambios de dirección** — no una carrera continua. Por eso cada deporte necesita su propia batería de ejercicios de acondicionamiento específico, con estas categorías transversales:

| Categoría | Qué es | Ejemplos genéricos |
|---|---|---|
| **Sprints/pasadas rectas** | Series de velocidad máxima o submáxima en línea recta, distancias cortas | Pasadas de 10-30m, series de 40-60m |
| **Cambios de dirección (COD) / agilidad** | Aceleración-desaceleración con cambio de vector | Test en T, 5-10-5, slalom entre conos |
| **Resistencia intermitente específica** | Series que imitan el patrón real de esfuerzo del deporte (esprintar-caminar-trotar repetido) | Yo-Yo Intermittent Recovery Test y variantes, series tipo "fartlek" estructurado |
| **Capacidad de repetir esprints (RSA)** | Series cortas repetidas con pausas incompletas, clave en deportes de duelo constante | 6-10 x 20-30m con 20-30seg de pausa |

El generador de rutinas debe permitir configurar este bloque según el **momento de temporada** (sección 11 intro): mayor volumen de resistencia intermitente en pretemporada, mayor énfasis en velocidad pura y RSA cerca de competencia, y reducción marcada en fase de recuperación/transición.

### 11.2 Fútbol
- Fuerza de tren inferior (sentadilla, peso muerto, zancadas) + core anti-rotación.
- Trabajo de potencia: saltos, sprints cortos, cambios de dirección (agilidad).
- **Cardio específico**: pasadas de 20-40m a máxima intensidad (6-10 repeticiones, pausa 1-2min), series de RSA (ej. 8x30m con 20seg de pausa), resistencia intermitente tipo Yo-Yo para base aeróbica específica, trabajo de cambios de dirección con balón y sin balón.
- Prevención específica: protocolo tipo "Nordic hamstring" (isquiotibiales), fuerza de aductores, propiocepción de tobillo/rodilla.
- Periodización: mayor volumen de fuerza y resistencia intermitente en pretemporada, mantenimiento + foco en velocidad/potencia/RSA en competencia.

### 11.3 Vóley
- Fuerza y potencia de tren inferior orientada al salto vertical (sentadilla, pliometría progresiva).
- Fuerza de hombro con énfasis en salud del manguito rotador (alto volumen de remate/saque).
- Core rotacional y anti-extensión.
- **Cardio específico**: al ser un deporte de esfuerzos muy cortos y explosivos con pausas frecuentes (no de carrera continua), el énfasis cardio-metabólico va en capacidad de repetir saltos/esprints cortos (ej. series de sprint lateral 5-10m) más que en resistencia intermitente larga — la base aeróbica se trabaja como apoyo, no como eje central.
- Prevención: fuerza excéntrica de cuádriceps (tendinopatía rotuliana), estabilidad de tobillo.

### 11.4 Básquet
- Fuerza de tren inferior orientada a salto vertical y aceleración (sentadilla, zancada, step-up explosivo), fuerza de tren superior para contacto y protección del balón.
- Potencia: pliometría (saltos verticales y horizontales), trabajo de primer paso explosivo.
- **Cardio específico**: series de RSA muy relevantes (el básquet es de los deportes con mayor cantidad de esprints cortos repetidos por partido) — ej. 10-15 x 15-20m con 15-20seg de pausa; cambios de dirección con frenado y arranque (simulando defensa/ataque); resistencia intermitente para sostener el ritmo en los últimos minutos de cada cuarto.
- Prevención específica: fuerza excéntrica de cuádriceps y control de aterrizaje (prevención de esguinces de tobillo, muy frecuentes en el deporte, y de lesiones de rodilla en aterrizaje de salto), fuerza de core para cambios de dirección.
- Periodización: base de fuerza y capacidad aeróbica general en pretemporada, RSA y potencia de salto priorizadas en competencia.

### 11.5 Tenis / Pádel
- Fuerza rotacional de core (el gesto de golpe es predominantemente rotacional), fuerza de tren inferior para desplazamientos laterales y frenadas, fuerza de hombro/manguito rotador (alto volumen de gesto de saque/golpe por encima de la cabeza en tenis, golpes repetidos en pádel).
- Potencia: trabajo rotacional explosivo (lanzamiento de balón medicinal rotacional), primer paso lateral.
- **Cardio específico**: el patrón dominante es de esfuerzos muy cortos (2-10 segundos de punto) con pausas variables entre puntos — la RSA y los cambios de dirección lateral/diagonal (no sprints rectos largos) son el foco principal; series tipo "shadow" de desplazamientos laterales imitando el juego (ej. 8-10 series de 10-15seg de desplazamiento intenso con 20-30seg de pausa).
- Prevención específica: salud de hombro (mismo enfoque conservador que la sección 12.1 para quienes reportan molestias), fuerza excéntrica de isquiotibiales y aductores por las frenadas laterales, cuidado de epicóndilo/epitróclea (codo de tenista/pádel) con trabajo de antebrazo.
- Periodización: acondicionamiento físico general y fuerza de base en pretemporada, mantenimiento de fuerza + foco en RSA/agilidad lateral en competencia.

### 11.6 Hockey (césped)
- Fuerza de tren inferior con énfasis en la posición flexionada característica del deporte (sentadilla, zancadas, trabajo de cadera en flexión sostenida), core anti-rotación y anti-flexión lateral.
- Potencia: aceleración desde posiciones bajas, cambios de dirección frecuentes.
- **Cardio específico**: similar al fútbol en su componente intermitente (resistencia intermitente + RSA), pero con la particularidad de que gran parte del juego se realiza en posición de flexión de cadera/rodilla — conviene incluir series de aceleración partiendo desde esa posición específica, no solo desde parado. Ej. RSA 6-8 x 20-25m con arranque desde posición flexionada.
- Prevención específica: fuerza de zona lumbar y cadena posterior (por la postura sostenida en flexión), fortalecimiento de aductores, protección de muñeca/antebrazo (por el uso constante del palo).
- Periodización: igual lógica que fútbol — mayor volumen de resistencia intermitente en pretemporada, RSA y potencia en competencia.

### 11.7 Atletismo (según prueba)
- Velocistas: fuerza máxima + potencia, pliometría, técnica de carrera.
- Fondistas: fuerza-resistencia, trabajo de economía de carrera, prevención de sobrecarga (tibia, fascia plantar).
- Saltadores/lanzadores: potencia y fuerza explosiva específica del gesto.
- **Cardio específico**: a diferencia de los deportes de cancha, en atletismo el cardio *es* el gesto competitivo — la programación de series/repeticiones/ritmos se define directamente por la prueba objetivo (velocidad pura, medio fondo, fondo) en vez de ser un bloque complementario aparte.

### 11.8 Módulo genérico "otro deporte"
Formulario configurable: patrón dominante (salto, sprint, lanzamiento, contacto), demandas energéticas (aeróbico/anaeróbico/mixto), patrón de esfuerzo (continuo vs. intermitente), zonas de lesión típicas del deporte — para generar recomendaciones, incluyendo el bloque de cardio específico de la sección 11.1, aunque el deporte no esté precargado.

---

## 12. Rehabilitación de lesiones comunes

**Principio rector**: la app puede acompañar procesos de *reintroducción al entrenamiento*, pero las fases agudas y las indicaciones médicas específicas siempre dependen del profesional tratante. El rol de la app es ofrecer progresiones conservadoras, con checkpoints de "consultar profesional antes de avanzar".

### 12.1 Manguito rotador
- **Fase 1 (dolor/inflamación)**: movilidad pasiva/activa asistida, isometrías submáximas, sin carga axial.
- **Fase 2**: fortalecimiento con banda (rotación externa/interna), trabajo de estabilizadores escapulares (serrato anterior, trapecio inferior).
- **Fase 3**: reintroducción de ejercicios multiarticulares con rango parcial y carga progresiva.
- **Fase 4**: retorno a rango completo y gestos específicos (deportivos si aplica).

### 12.2 Meniscos
- **Fase temprana**: control de inflamación, movilidad en rango sin dolor, activación de cuádriceps (isométricos).
- **Fase intermedia**: fortalecimiento en cadena cerrada (prensa, sentadilla parcial), propiocepción.
- **Fase avanzada**: sentadilla completa, trabajo unilateral, reintroducción de impacto controlado.

### 12.3 Desgarros musculares (isquiotibiales, gemelos, cuádriceps)
- **Fase aguda**: reposo relativo, movilidad sin dolor, isometrías suaves.
- **Fase de remodelación**: fortalecimiento concéntrico progresivo, luego excéntrico controlado (clave para prevenir recidivas).
- **Fase funcional**: reintroducción de velocidad/cambios de dirección solo al final, con criterios objetivos (fuerza simétrica vs lado sano ≥90%).

### 12.4 Post-operatorio de ligamento cruzado anterior (LCA)
Fases orientativas (siempre supeditadas al alta del cirujano/kinesiólogo):
- **0-6 semanas**: movilidad, control de inflamación, activación de cuádriceps, marcha.
- **6-12 semanas**: fortalecimiento progresivo en cadena cerrada, bicicleta, propiocepción básica.
- **3-6 meses**: fuerza simétrica, inicio de trote lineal si hay criterios cumplidos.
- **6-9 meses**: pliometría progresiva, cambios de dirección.
- **9-12 meses**: retorno deportivo, siempre con criterios de test funcional (no solo tiempo transcurrido).

La app **nunca debe generar automáticamente pliometría o gestos deportivos antes del mes 6 post-LCA**, incluso si el usuario lo solicita manualmente — debe mostrar advertencia fuerte y pedir confirmación de alta profesional.

---

## 13. Corrección postural y escoliosis

Este módulo es distinto de la rehabilitación de lesiones (sección 12): no se trata de una lesión puntual con fecha de inicio, sino de **patrones posturales sostenidos en el tiempo**, generalmente asociados a hábito (sedentarismo, horas sentado, gesto deportivo repetitivo) más que a una lesión aguda. La excepción es la escoliosis, que sí es una condición estructural y requiere un tratamiento completamente distinto al resto de este módulo — por eso se separa con su propio criterio de seguridad.

### 13.1 Principio general de corrección postural

La mayoría de las alteraciones posturales comunes siguen el patrón descripto por el concepto de **síndrome cruzado** (superior e inferior): un grupo de músculos se vuelve corto/hipertónico mientras el grupo opuesto se debilita/inhibe, generando un desequilibrio de fuerzas alrededor de una articulación. La corrección, en todos los casos, sigue la misma lógica de tres partes:

1. **Elongar/liberar** la musculatura acortada o hipertónica.
2. **Fortalecer** la musculatura débil o inhibida (que normalmente es la antagonista de la anterior).
3. **Reeducar el control motor** — no alcanza con estirar y fortalecer si la persona no aprende a mantener la posición corregida en sus actividades diarias (de ahí que estos ejercicios funcionen mejor como bloque frecuente y de bajo volumen, no como una sesión aislada semanal).

### 13.2 Escoliosis (manejo conservador — máxima cautela)

**Diferencia clave con el resto del módulo**: la escoliosis es una curvatura estructural de la columna, diagnosticada por imagen (radiografía) y clasificada por el ángulo de Cobb (leve: <25°, moderada: 25-40°, severa: >40°). No es un desbalance muscular corregible solo con ejercicio — es una condición que requiere diagnóstico y seguimiento médico/kinesiológico específico (frecuentemente con protocolos especializados tipo Schroth, llevados adelante por profesionales certificados en esa técnica).

**Rol de la app, y sus límites:**
- La app **nunca diagnostica** ni estima el grado de escoliosis. Solo puede registrar que el usuario declaró tener este diagnóstico (hecho por un profesional).
- Si el usuario marca escoliosis en su perfil, la app debe mostrar de entrada un disclaimer reforzado: cualquier trabajo postural específico para su curvatura debe ser indicado por su kinesiólogo/traumatólogo, y la app **no reemplaza ese tratamiento**.
- Lo que la app sí puede ofrecer con seguridad, y sin necesidad de indicación específica de un profesional: una rutina general de fuerza simétrica y movilidad de columna, en la misma línea que cualquier otro usuario — evitando cargas axiales máximas (sentadilla/peso muerto a intensidades cercanas al 1RM) y evitando ejercicios marcadamente asimétricos y repetidos siempre hacia el mismo lado (ej. cargar mancuerna pesada de un solo lado en gestos que impliquen inclinación lateral repetida).
- Ante cualquier reporte de dolor asociado a la zona de la curvatura (vía el botón de la sección 20.1), el sistema debe tratarlo con la misma severidad que una lesión activa (bloqueo, no solo alerta), dado que en escoliosis el margen de error es menor.

### 13.3 Hombros adelantados y cabeza adelantada (síndrome cruzado superior)

Estas dos alteraciones suelen presentarse juntas (por eso se agrupan) y son las más comunes en usuarios con mucho tiempo sentado o frente a pantallas.

- **Estirar/liberar**: pectoral mayor y menor, subescapular, trapecio superior, elevador de la escápula, suboccipitales, esternocleidomastoideo.
- **Fortalecer**: trapecio medio e inferior, romboides, serrato anterior, flexores profundos del cuello.
- **Ejercicios característicos**: retracción escapular con banda, remo con foco en "juntar omóplatos" (no solo tirar con brazos), face pull, wall slides/"ángeles de pared", chin tuck isométrico (retracción de mentón), estiramiento de pectoral en marco de puerta, movilidad torácica en cuadrupedia (tipo "gato-camello" con énfasis torácico).
- **Regla de programación**: aumentar el ratio de tracción sobre empuje respecto al ratio estándar de la sección 4.1 (más volumen de tracción horizontal y retracción escapular que lo habitual), y evitar sumar volumen extra de ejercicios que refuercen la posición encorvada (ej. exceso de trabajo de pectoral en rango interno sin el balance correspondiente de espalda alta).

### 13.4 Anteversión pélvica (con hiperlordosis lumbar asociada)

- **Estirar/liberar**: flexores de cadera (psoas ilíaco, recto femoral), erectores espinales lumbares.
- **Fortalecer**: glúteo mayor, abdominales (recto abdominal, oblicuos, transverso), isquiotibiales.
- **Ejercicios característicos**: estiramiento de psoas en zancada baja (con retroversión pélvica activa durante el estiramiento), puente de glúteo, "dead bug" (control de zona lumbar en extensión de extremidades), plancha frontal, elevación de cadera con foco en glúteo (no en lumbar).
- **Regla de programación**: limitar el volumen de ejercicios de flexores de cadera aislados y de alto rango (ej. elevación de piernas colgado en exceso) si no van acompañados de suficiente trabajo de glúteo/core — y vigilar la técnica en ejercicios de bisagra de cadera (peso muerto, peso muerto rumano) donde una anteversión marcada suele generar hiperextensión lumbar compensatoria bajo carga.

### 13.5 Otras alteraciones posturales frecuentes (ampliable)

El mismo esquema de tres pasos (13.1) se aplica a otras alteraciones comunes que se pueden ir sumando a la biblioteca sin cambiar la lógica general: hiperkifosis dorsal marcada, escápulas aladas (debilidad de serrato anterior), hiperlordosis cervical, genu valgo/varo (relevante también para prevención de lesiones de rodilla en deportes, sección 11). Cada una se modela igual: qué liberar, qué fortalecer, y qué ejercicios evitar mientras la alteración esté presente.

### 13.6 Integración con el resto del sistema

- **Perfil de usuario** (sección 2 / 23.1): se agrega el campo `alteraciones_posturales` (tags: `hombros_adelantados`, `cabeza_adelantada`, `anteversion_pelvica`, `escoliosis`, `hiperkifosis`, etc.), separado de `historial_lesiones` porque no son lesiones sino patrones posturales — salvo escoliosis, que además dispara el tratamiento conservador reforzado de 13.2.
- **Esquema de Ejercicio** (sección 23.1): se agrega el campo `objetivo_correctivo` (array de tags, ej. `estira_pectoral_menor`, `fortalece_serrato_anterior`, `fortalece_gluteo_antianteversion`) para que el generador pueda armar un **bloque correctivo add-on** de 10-15 minutos dentro de cualquier rutina — no reemplaza el objetivo principal del usuario, se suma como calentamiento específico o bloque final 2-3 veces por semana.
- **Motor de reglas** (sección 22): se suman tres reglas nuevas a la tabla:

| id | categoría | condición | acción | prioridad | sección |
|---|---|---|---|---|---|
| R-021 | postural | `escoliosis` en perfil + sin confirmación de evaluación profesional reciente | bloqueo del bloque correctivo específico + disclaimer reforzado, deriva a profesional | alta | 13.2 |
| R-022 | postural | `hombros_adelantados` o `cabeza_adelantada` + ratio empuje/tracción de la rutina fuera del rango reforzado de 13.3 | alerta_leve → sugerir sumar tracción/retracción escapular | media | 13.3 / 4.1 |
| R-023 | postural | `anteversion_pelvica` + ejercicio de bisagra de cadera con carga alta y sin suficiente volumen de glúteo/core en la rutina | alerta_leve → sugerir sumar glúteo/core antes de progresar la carga | media | 13.4 |

---

## 14. Tercera edad y poblaciones especiales

- Prioridad: fuerza funcional (levantarse de una silla, subir escaleras), equilibrio, densidad ósea (carga axial controlada), movilidad articular.
- Volumen e intensidad moderados, con énfasis en técnica y control excéntrico (menor riesgo de caída/lesión).
- Ejercicios recomendados por defecto: sentadilla asistida/con apoyo, prensa, remo, step-up bajo, trabajo de equilibrio (unipodal asistido).
- Alertas específicas: evitar Valsalva prolongada (riesgo cardiovascular), evitar cargas máximas o técnicas de fallo, priorizar RIR alto (3-4).
- Considerar comorbilidades (hipertensión, osteoporosis, artrosis) como flags que ajustan automáticamente rangos de movimiento y cargas sugeridas.

---

## 15. Entrenamiento infantil (niños y preadolescentes)

Este es uno de los cinco pilares centrales del producto (sección 1). Es también el módulo donde más vale la pena que la app tome una posición activa de **educación**, porque el obstáculo principal no es técnico — es un mito extendido que hace que padres y hasta profesores de educación física eviten el entrenamiento de fuerza en niños por miedo a que "afecte el crecimiento".

### 15.1 El mito del crecimiento — qué dice la evidencia

**El mito**: entrenar con pesas antes de la pubertad daña las placas de crecimiento (fisis) y reduce la estatura adulta.

**Qué dice la evidencia real**: la National Strength and Conditioning Association (NSCA) actualizó en 2009 su declaración de posición sobre entrenamiento de fuerza en jóvenes — con aval también de la American Academy of Pediatrics — y concluyó que no hay evidencia de una reducción de estatura en niños que entrenan fuerza de forma regular en un entorno controlado, y que no se ha reportado ninguna fractura de placa de crecimiento en estudios de entrenamiento de fuerza juvenil. Más aún: cuando se siguen pautas apropiadas para la edad y una nutrición adecuada, el entrenamiento de fuerza puede **ayudar** a maximizar la densidad mineral ósea durante la niñez y adolescencia — el efecto contrario al que asume el mito.

**El origen real del mito**: viene de reportes de lesiones en niños que entrenaban **sin supervisión, con técnica deficiente, o intentando levantamientos máximos** — es decir, el mismo riesgo que existe en cualquier actividad física mal ejecutada (fútbol, gimnasia, patín), no algo inherente al entrenamiento de fuerza en sí. El error histórico fue culpar a la herramienta (las pesas) en vez de a la falta de programación y supervisión adecuadas.

**Cómo debe comunicar esto la app**: no alcanza con "permitir" rutinas infantiles — la app debe activamente desmentir el mito con lenguaje claro cuando un adulto responsable configura un perfil infantil, citando la fuente (sección 26.4), para que el mensaje tenga peso real y no sea solo la opinión de la app.

### 15.2 Definiciones y etapas de maduración

A diferencia del resto del marco teórico (que usa edad cronológica), acá conviene trabajar con **madurez biológica** cuando sea posible, porque el desarrollo físico varía mucho entre niños de la misma edad:

- **Niños (preadolescencia)**: hasta aproximadamente 11 años en niñas y 13 años en niños (Tanner 1-2, antes del desarrollo de caracteres sexuales secundarios).
- **Adolescentes**: desde el inicio de la pubertad — a partir de acá, gran parte de las pautas de fuerza para adultos jóvenes empiezan a aplicar con ajustes progresivos, no reglas completamente distintas.

### 15.3 Principios de programación para niños (preadolescencia)

1. **Técnica y control motor por sobre la carga, siempre.** El objetivo primario no es la fuerza máxima, es el aprendizaje del patrón de movimiento correcto.
2. **Supervisión de un adulto responsable o entrenador calificado, obligatoria.** La app nunca debe presentarse como sustituto de esa supervisión presencial — ver 15.4.
3. **Progresión ultra-conservadora**: dominar el patrón sin carga (o con el propio peso corporal) → carga simbólica → aumentos graduales solo cuando la técnica es consistente.
4. **Prohibido explícitamente**: entrenamiento al fallo muscular, técnicas de intensificación (drop set, rest-pause, myo-reps — sección 5), y test de 1RM real (carga máxima absoluta). Todo esto está fuera de rango incluso para el "principiante adulto" del resto del sistema, y con más razón acá.
5. **Priorizar variedad y multilateralidad** por sobre la especialización deportiva temprana — desarrollo motor general (saltar, lanzar, trepar, correr, equilibrio) antes que perfeccionar un solo gesto.
6. **Volumen y frecuencia conservadores**: 2-3 sesiones por semana, series bajas (1-3), sesiones cortas, con calentamiento dinámico y foco en que la experiencia sea disfrutable — la adherencia a largo plazo importa más que la progresión rápida.
7. **Ejercicios característicos**: variantes de peso corporal (sentadilla, flexión de rodillas, zancada asistida), trabajo con bandas elásticas livianas, ejercicios lúdicos que refuercen patrones fundamentales de movimiento, y — cuando hay supervisión calificada — cargas externas livianas (mancuernas, barra sin peso o con peso mínimo) con foco exclusivo en técnica.

### 15.4 Consentimiento y supervisión — no negociable

- El perfil de un usuario menor de edad **no puede crearse ni operarse de forma autónoma** dentro de la app: requiere la confirmación de un adulto responsable (madre/padre/tutor) al momento de la configuración, y esa confirmación queda registrada.
- La app deja explícito, en el propio flujo de configuración, que **el entrenamiento de fuerza en niños debe estar supervisado presencialmente** por un adulto responsable o un profesional calificado (entrenador con formación específica en poblaciones pediátricas) — la app es una herramienta de apoyo a esa supervisión, nunca un reemplazo de la presencia física de un adulto durante la sesión.
- Mientras no exista esa confirmación, el generador de rutinas para el perfil infantil queda bloqueado y solo se habilita contenido educativo (como el desmentido del mito de 15.1).

### 15.5 Integración con el resto del sistema

- **Perfil de usuario** (sección 24.1): se agrega `franja_etaria` (`niño_preadolescente | adolescente | adulto`) y `consentimiento_adulto_responsable` (booleano, con fecha de confirmación).
- **Motor de reglas** (sección 22): se suman tres reglas de máxima prioridad — a diferencia de las demás reglas del sistema, estas no admiten excepción manual del usuario, ni siquiera con auditor de rutina (sección 20.4.1):

| id | categoría | condición | acción | prioridad | sección |
|---|---|---|---|---|---|
| R-024 | infantil | `franja_etaria = niño_preadolescente` + cualquier método de intensificación (sección 5) aplicado | bloqueo total, sin excepción | alta | 15.3 |
| R-025 | infantil | `franja_etaria = niño_preadolescente` + ejercicio con intensidad ≥85% 1RM o solicitud de test de 1RM real | bloqueo total → sustituir por progresión basada en técnica/RPE bajo | alta | 15.3 |
| R-026 | infantil | `franja_etaria = niño_preadolescente` o `adolescente` + `consentimiento_adulto_responsable = false` | bloqueo total del generador de rutinas de fuerza (solo contenido educativo disponible) | alta | 15.4 |

---

## 16. Entrenamiento con bandas elásticas (ideal principiantes, adultos mayores o niños)

Es un módulo horizontal, no exclusivo de un pilar — las bandas elásticas resuelven una barrera de **adopción**, no solo de programación, y esa barrera aparece en varios perfiles distintos: el principiante que nunca pisó un gimnasio, el adulto mayor que asocia las mancuernas con un ambiente intimidante, y el niño para quien el peso libre tradicional no es apropiado pero sí necesita estímulo de fuerza (sección 15). Por eso se trata como módulo propio, con sus propios ejercicios, progresión y reglas — y se referencia desde cada pilar donde aplica, en vez de quedar enterrado dentro de uno solo.

### 16.1 Por qué funcionan como puerta de entrada

- **Percepción de menor intimidación**: se perciben como un elemento suave y de bajo compromiso, aunque bien programadas ofrecen una curva de resistencia perfectamente progresiva y son igual de efectivas que la carga libre para estos perfiles.
- **Resistencia variable y acomodada**: la tensión crece a lo largo del recorrido — es más suave al inicio del movimiento, justo donde la articulación suele estar en una posición menos favorable (relevante tanto para adultos mayores como para rehabilitación, sección 12).
- **Sin riesgo de carga que "se cae"**: elimina un miedo común en principiantes y adultos mayores.
- **Bajo costo y portabilidad**: ocupan poco espacio, permiten entrenar en casa sin trasladarse — reduce también la barrera de acceso, no solo la psicológica.
- **Apropiadas para niños**: dan estímulo de fuerza controlado sin la connotación de "levantar pesas", encajando con el enfoque de técnica-primero de la sección 15.3.

### 16.2 Progresión

A diferencia de la carga libre, acá no se "sube el peso": se avanza por **nivel de tensión de la banda** (habitualmente codificado por color/grosor) o **acortando la banda** para aumentar la resistencia efectiva en el mismo movimiento. El generador debe tratar esto como una escalera de progresión propia — misma lógica que la sección 10.2 para calistenia — nunca como equivalente directo a kilos.

### 16.3 Ejercicios de entrada por objetivo

- **Tren superior (empuje/tracción)**: remo sentado con banda, press de pecho con banda anclada, elevación lateral pisando la banda, face pull con banda (también relevante para el patrón postural de la sección 13.3).
- **Tren inferior**: sentadilla con banda a la altura de rodillas (activación de glúteo medio, útil para prevención de caídas en tercera edad), extensión de cadera con banda anclada, caminata lateral con banda en tobillos.
- **Rehabilitación específica**: rotación externa/interna de hombro con banda (protocolo ya definido en 12.1), es el equipamiento por defecto en las fases tempranas de varios protocolos de rehab de este marco.

### 16.4 Seguridad

- Revisar el punto de anclaje antes de cada uso.
- Descartar bandas con signos de desgaste (microroturas) por riesgo de corte brusco de tensión.
- No arrancar con tensión alta como punto de entrada — el objetivo inicial es construir confianza con el movimiento, no maximizar la carga desde el primer día. Esto aplica con más razón todavía en el perfil infantil (sección 15).

### 16.5 Integración con el resto del sistema

- Conecta directo con el nivel de equipamiento "peso corporal + bandas elásticas" ya definido en 10.1.
- Para perfiles de tercera edad (14), infantil (15) y usuarios marcados como principiantes sin experiencia previa, el generador debería sugerir este nivel como punto de partida por defecto — no "sin equipamiento" a secas ni carga libre directamente — salvo que el usuario indique preferencia o acceso a otra cosa.
- Se agrega `objetivo_correctivo` y `equipamiento_requerido: banda_elastica` como filtros ya existentes en el esquema de Ejercicio (23.1) — no requiere una entidad nueva, solo una biblioteca de ejercicios etiquetados correctamente bajo el esquema ya definido.

---

## 17. Embarazo y posparto

Otro módulo poblacional con guías profesionales propias y bien establecidas — el mismo tratamiento que ya recibieron tercera edad (14) e infantil (15).

### 17.1 Principios generales durante el embarazo

El Colegio Americano de Obstetras y Ginecólogos (ACOG) establece que, en ausencia de complicaciones obstétricas o médicas, la actividad física durante el embarazo es segura y deseable, y que debe alentarse tanto a continuar como a iniciar actividad física segura — incluyendo entrenamiento de fuerza, no solo cardio. Los beneficios documentados incluyen menor riesgo de diabetes gestacional, preeclampsia y cesárea, y un rol en la prevención de trastornos depresivos posparto.

- **Volumen general recomendado**: sesiones de 20-30 minutos la mayoría de los días de la semana, hasta totalizar 150 minutos semanales de actividad aeróbica moderada — la misma referencia que ya usamos para población general (sección 8).
- **Deportistas y usuarias que ya entrenaban con regularidad**: pueden mantener su nivel de actividad previo (incluyendo intensidad vigorosa) mientras estén sanas y bajo seguimiento de su obstetra, con atención reforzada a hidratación y prevención de hipertermia.
- **Contraindicaciones**: existen contraindicaciones absolutas y relativas definidas por ACOG (ej. ciertas condiciones cardíacas/pulmonares, insuficiencia cervical, sangrado persistente, rotura de membranas). La app **nunca debe asumir autorización médica** — siempre debe requerir confirmación explícita antes de habilitar el generador de rutinas de fuerza (ver 17.4).

### 17.2 Ajustes por trimestre

- Evitar ejercicios en posición supina prolongada a partir del segundo trimestre (riesgo de compresión de la vena cava) — preferir variantes inclinadas o de costado.
- Evitar la hipertermia, con especial cuidado en el primer trimestre.
- Evitar deportes de contacto, alto riesgo de caída, o actividades con cambios bruscos de presión.
- La laxitud articular aumenta (efecto de la relaxina) — evitar rangos de movimiento extremos y movimientos balísticos o de alto impacto articular.
- Core: reemplazar el trabajo abdominal tradicional (crunches, elevaciones de tronco) por ejercicios de estabilización anti-rotación/anti-extensión (ej. Pallof press, plancha modificada) a medida que avanza el embarazo.

### 17.3 Posparto: fases y retorno gradual

- **Fase inicial** (primeras semanas, antes del control médico posparto): caminata suave, respiración diafragmática, activación de piso pélvico — nada de entrenamiento estructurado de fuerza.
- **Fase de reconstrucción** (habitualmente desde la confirmación médica en el control posparto, comúnmente entre semana 6-8 en adelante): reintroducción gradual de fuerza, priorizando activación coordinada de transverso abdominal y piso pélvico antes que ejercicio de alta carga.
- **Retorno a alto impacto/running**: fase posterior, basada en criterios funcionales (sin dolor, sin pérdidas de orina durante el ejercicio, sin abombamiento/"doming" abdominal bajo carga) — no solo en semanas transcurridas, siguiendo la misma lógica criterio-dependiente que ya usamos en rehabilitación (sección 12).
- **Diastasis de rectos abdominales**: es común (la separación persiste en una proporción relevante de mujeres a los 6 meses posparto sin rehabilitación estructurada) y no se "cierra" solo con ejercicio — lo que sí se puede entrenar es la función del core. Mientras esté presente, evitar crunches/abdominales tradicionales y priorizar respiración + activación de transverso.
- **Señales de alarma que requieren pausa y derivación**: abombamiento visible de la línea media bajo esfuerzo, pérdidas de orina durante el ejercicio, dolor pélvico — todas ameritan derivación a un kinesiólogo especializado en piso pélvico, no solo "bajar la intensidad".

### 17.4 Reglas de seguridad

| id | categoría | condición | acción | prioridad | sección |
|---|---|---|---|---|---|
| R-027 | embarazo | `estado_gestacional = embarazada` + sin `autorizacion_medica_confirmada` | bloqueo del generador de rutinas de fuerza (solo contenido educativo disponible) | alta | 17.1 |
| R-028 | embarazo | `estado_gestacional = embarazada` + trimestre ≥2 + ejercicio en posición supina prolongada | alerta_fuerte → sustituir por variante inclinada o de costado | alta | 17.2 |
| R-029 | posparto | `estado_gestacional = posparto` + `semanas_posparto` < 6 + ejercicio de alta intensidad o impacto | bloqueo → sustituir por fase inicial (caminata, respiración, activación de piso pélvico) | alta | 17.3 |
| R-030 | posparto | reporte de abombamiento abdominal o pérdida de orina durante el ejercicio | bloqueo del ejercicio + sugerir derivación a kinesiólogo de piso pélvico | alta | 17.3 |

### 17.5 Integración con el resto del sistema

- **Perfil de usuario** (sección 23.1): se agrega `estado_gestacional` (`no_aplica | embarazada | posparto`), `semana_gestacion` o `semanas_posparto` según corresponda, y `autorizacion_medica_confirmada` (booleano, con fecha) — mismo patrón que el consentimiento infantil de la sección 15.4.
- **Esquema de Ejercicio** (23.1): se agregan tags `contraindicado_embarazo` y `apto_posparto_fase_X` a `tags_adicionales`, para que el motor de sustitución (20.4.2) pueda filtrar automáticamente.

---

## 18. Resumen de módulos que debería tener la app

1. **Perfil de usuario** (datos, objetivos, lesiones, deporte).
2. **Constructor de rutina manual** con auditoría en tiempo real (motor de alertas).
3. **Generador asistido** (según objetivo/experiencia/días disponibles).
4. **Biblioteca de ejercicios** con: grupo agonista/antagonista, patrón de movimiento, nivel de dificultad, contraindicaciones por lesión.
5. **Biblioteca de métodos** (drop set, rest-pause, myo-reps, etc.) aplicable a cualquier ejercicio.
6. **Motor de sobrecarga progresiva** con historial y sugerencias automáticas.
7. **Módulos de fuerza** (máxima/potencia/resistencia) con parámetros predefinidos editables.
8. **Módulo cardio** con zonas de FC y métodos (LISS/MICT/HIIT).
9. **Módulo híbrido** con gestión del efecto interferencia.
10. **Módulo sin equipamiento** (calistenia + mobiliario urbano tipo plaza/parque), con escaleras de progresión de variantes propias.
11. **Módulos deportivos** (fútbol, vóley, básquet, tenis/pádel, hockey, atletismo, genérico configurable).
12. **Módulo rehabilitación** con fases por lesión y checkpoints de consulta profesional.
13. **Módulo corrección postural y escoliosis**, con bloque correctivo add-on independiente del objetivo principal.
14. **Módulo tercera edad / poblaciones especiales**.
15. **Módulo entrenamiento infantil**, con desmentido activo del mito del crecimiento, consentimiento de adulto responsable obligatorio y bloqueos no negociables (sin excepción manual).
16. **Módulo bandas elásticas**, horizontal a principiantes/tercera edad/niños, con escalera de progresión propia por tensión.
17. **Módulo embarazo y posparto**, con ajustes por trimestre, fases de retorno posparto criterio-dependientes y autorización médica obligatoria.
18. **Sistema de alertas transversal** (el "cerebro" que cruza todo lo anterior).
19. **Disclaimers legales/salud** integrados contextualmente (no como pantalla única al inicio).

---

## 19. Ejemplos concretos de rutinas

### 19.1 Hipertrofia – Upper/Lower (intermedio, 4 días)
**Día 1 – Upper (empuje-tracción balanceado)**
- Press banca plano: 4x6-8, RIR 2, descanso 2min
- Remo con barra: 4x8-10, RIR 2, descanso 2min
- Press militar mancuernas: 3x8-10, RIR 2
- Jalón al pecho: 3x10-12, RIR 2
- Elevaciones laterales: 3x12-15, RIR 1
- Curl bíceps + Press francés (superserie): 3x12 / 3x12

**Día 2 – Lower**
- Sentadilla: 4x6-8, RIR 2, descanso 3min
- Peso muerto rumano: 3x8-10, RIR 2
- Prensa: 3x10-12, RIR 2
- Curl femoral: 3x12-15, RIR 1
- Elevación de talones (gemelos): 4x12-15

*(Días 3-4 repiten estructura con variación de ejercicios/ángulos — la app debe rotar automáticamente cada mesociclo)*

### 19.2 Fuerza máxima – 4 días, estilo bloques
- Sentadilla: 5x3 @85-90% 1RM, descanso 4min
- Press banca: 5x3 @85-90%
- Peso muerto: 4x2 @88-92%
- Accesorios livianos (RIR 3-4) al final, sin buscar fallo.

### 19.3 Fuerza-potencia (deportista, pretemporada)
- Sentadilla con salto (carga liviana, máxima velocidad): 5x3
- Peso muerto con trap bar (submáximo, explosivo): 4x3
- Saltos al cajón: 4x5
- Lanzamiento de balón medicinal (rotacional): 4x6
- Descansos completos (2-4min) entre series — se prioriza calidad del gesto, no fatiga.

### 19.4 Fuerza-resistencia (circuito, 3 vueltas)
- Sentadilla goblet x20, Remo con banda x20, Push-up x15, Plancha 45seg
- Descanso 60seg entre ejercicios, 2min entre vueltas.

### 19.5 Híbrida (fuerza 3x + cardio 2x, mismo usuario)
- Lun: Fuerza tren superior (foco fuerza, 5-8 reps)
- Mar: HIIT bici 20min (bajo impacto en rodillas)
- Mié: Fuerza tren inferior
- Jue: LISS caminata inclinada 40min
- Vie: Fuerza full body (hipertrofia, 8-12 reps)

### 19.6 Sin equipamiento – full body con mobiliario urbano (nivel intermedio, en plaza)
- Dominadas pronadas (barra fija): 4x al fallo técnico (o negativas de 4seg si aún no llega a dominada completa)
- Fondos en paralelas: 4x al fallo técnico
- Sentadilla búlgara con pie en banco/cajón: 3x12/pierna
- Flexiones de brazos con pies elevados en banco: 3x al fallo técnico
- Remo invertido en barra baja: 3x12-15
- Plancha con elevación de pierna: 3x30-40seg
- Circuito final (sin descanso entre ejercicios, 2 vueltas): saltos al cajón/banco x10, escalador (mountain climbers) x20, sentadilla con salto x15

### 19.7 Fútbol – sesión de pretemporada (fuerza + prevención + cardio específico)
- Sentadilla trasera: 4x5
- Nordic hamstring: 3x6-8
- Zancada búlgara: 3x10/pierna
- Copenhagen plank (aductores): 3x20-30seg/lado
- Core anti-rotación (Pallof press): 3x12/lado
- **Bloque cardio específico**: 8x30m sprint al 90-95% con 20-25seg de pausa (RSA) + resistencia intermitente tipo Yo-Yo (según nivel del jugador)

### 19.8 Básquet – sesión de competencia (potencia + RSA)
- Sentadilla con salto (carga liviana): 4x4
- Step-up explosivo con salto: 3x6/pierna
- Saltos al cajón: 4x5
- Core anti-rotación: 3x12/lado
- **Bloque cardio específico**: 12x15m sprint máximo con frenado y cambio de dirección, pausa 15-20seg (RSA) — simula transiciones de defensa a ataque
- Trabajo de aterrizaje controlado (prevención de esguince de tobillo): 3x8 saltos con aterrizaje estabilizado

### 19.9 Tercera edad (2-3x/semana, funcional)
- Sentadilla a silla (asistida): 3x10
- Remo sentado en polea: 3x12
- Step-up bajo: 3x8/pierna
- Equilibrio unipodal asistido: 3x20-30seg/lado
- Movilidad de cadera y hombro: 5-10min

### 19.10 Rehabilitación – Manguito rotador (fase 2)
- Rotación externa con banda (codo pegado al cuerpo): 3x15
- Rotación interna con banda: 3x15
- Elevación en plano escapular ("scaption") con peso liviano: 3x12
- Retracción escapular (remo con banda, foco en escápula): 3x15
- **Sin** press militar ni fondos hasta fase 3, y sin dolor durante ejecución.

### 19.11 Post-operatorio LCA (semana 8, ejemplo orientativo)
- Bicicleta fija: 15-20min, resistencia baja
- Prensa (rango parcial, controlado): 3x12
- Puente de glúteo: 3x15
- Sentadilla isométrica en pared (30-45°): 3x30seg
- Propiocepción en superficie estable, apoyo bipodal → progresar a unipodal solo si no hay dolor/inestabilidad.
- **Sin trote, sin salto, sin cambios de dirección** — requiere criterio de alta específico.

---

## 20. Funcionalidades adicionales de producto

Estas funcionalidades no son módulos de entrenamiento en sí (eso ya está cubierto en las secciones 1-16), sino **capas de producto** que hacen que el motor de alertas y el sistema de rutinas funcionen con datos reales del usuario en el tiempo, y que sostengan la retención y la seguridad clínica de la app. Se agrupan en cuatro bloques.

### 20.1 Seguridad y prevención

#### 20.1.1 Semáforo de estado del ejercicio
Cada ejercicio de la biblioteca (tanto en el constructor de rutina como durante la ejecución de una sesión) muestra un indicador visual de tres estados, calculado a partir del historial de `registro_molestia` (sección de "me genera dolor/incomodidad") de ese usuario para ese ejercicio:

- 🟢 **Verde**: sin reportes, o reportes únicos de fatiga muscular normal.
- 🟡 **Amarillo**: 1 reporte de molestia articular/dolor, o reportes de fatiga normal muy frecuentes (posible señal temprana).
- 🔴 **Rojo**: ejercicio "en observación" (2-3 reportes de molestia articular/dolor en el mismo mesociclo) o marcado como contraindicado por el perfil de lesiones.

Este semáforo se muestra **antes** de que el usuario ejecute el ejercicio, no solo como resultado posterior — es una capa preventiva, no solo reactiva. Es la interfaz visual del motor de alertas de la sección 9.

#### 20.1.2 Check-in pre-sesión
Antes de empezar cada sesión, pantalla rápida de una sola pregunta: estado general del día (descansado / cansado / con alguna molestia puntual). Reglas de ajuste automático:

| Respuesta | Ajuste automático de la sesión |
|---|---|
| Descansado | Sin cambios, rutina como está planificada |
| Cansado | Reduce automáticamente 1 serie por ejercicio principal y sugiere bajar el RIR objetivo (más margen, menos cerca del fallo) |
| Con molestia puntual | Pide especificar zona → cruza con `registro_molestia` y con el perfil de lesiones → sustituye o reduce rango de movimiento en los ejercicios que involucran esa zona para esa sesión únicamente (no reprograma el mesociclo completo) |

#### 20.1.3 Detección de racha de sobreesfuerzo
A diferencia del semáforo (que es reactivo a reportes de dolor), esta es una alerta **proactiva basada en volumen y frecuencia**, sin que el usuario tenga que reportar nada:

- Cruza el volumen semanal real ejecutado contra los rangos de referencia de la sección 9.2, por experiencia y objetivo.
- Detecta ausencia de días de descanso durante 2+ semanas consecutivas.
- Detecta series al fallo/técnicas de intensificación (drop set, rest-pause) usadas con una frecuencia mayor a la recomendada en la sección 5.2.

Cuando se dispara, el mensaje no es solo una alerta: ofrece directamente una **semana de descarga sugerida** (reducción de volumen ~40-50% manteniendo intensidad) como acción concreta, no solo como advertencia.

### 20.2 Seguimiento y motivación

#### 20.2.1 Registro de cargas con progresión visual
Por cada ejercicio, gráfico de línea simple: carga x fecha (y opcionalmente volumen total = series x reps x carga). Esto alimenta directamente al **motor de sobrecarga progresiva** (sección 6.1) — el mismo dato que se usa para graficar es el que dispara las sugerencias automáticas de incremento de carga. Debe permitir filtrar por ejercicio individual o por grupo muscular (volumen semanal acumulado en el tiempo).

#### 20.2.2 Test de fuerza periódico
Cada 4-6 semanas (configurable), la app sugiere —no obliga— un mini-test:

- **1RM estimado** (vía fórmula submáxima, ej. Epley o Brzycki, a partir de una serie cercana al fallo con carga conocida) para los ejercicios básicos (sentadilla, press banca, peso muerto).
- **Test de resistencia** (ej. máximo de repeticiones a una carga fija) para usuarios en fase de fuerza-resistencia o fuerza-resistencia deportiva.

El resultado recalcula automáticamente los porcentajes de carga (%1RM) de toda la rutina vigente — cierra el ciclo de periodización de la sección 6.2 sin que el usuario tenga que reingresar datos a mano.

#### 20.2.3 Racha de constancia (streaks)
Gamificación simple: contador de sesiones/semanas completadas sin interrupciones según el plan asignado. Debe ser **complementario, nunca contradictorio con la seguridad**: si el motor de alertas sugiere una semana de descarga (20.1.3) o pausa por dolor (sección 9.3/9.4), la racha no debe "romperse" ni penalizar al usuario por seguir esa indicación — de lo contrario se incentiva a ignorar alertas de seguridad para no perder la racha.

### 20.3 Rehabilitación específica

#### 20.3.1 Checkpoints de "alta de fase"
En los módulos de rehabilitación (sección 12: manguito rotador, meniscos, desgarros, post-LCA), el avance de una fase a la siguiente **no debe ser automático por tiempo transcurrido únicamente**. Se agrega un checkpoint manual:

- El usuario (o idealmente su kinesiólogo/médico, si la app permite vincular un profesional — ver 20.5) debe confirmar explícitamente "alta de fase" antes de que el sistema desbloquee los ejercicios de la fase siguiente.
- Si no hay confirmación, la app permite seguir entrenando la fase actual indefinidamente, pero **bloquea el avance** — mensaje claro: "Esta fase requiere confirmación profesional antes de continuar."
- Esto es especialmente crítico en post-LCA (sección 12.4), donde la regla ya establecida es no generar pliometría ni gestos deportivos antes de los criterios de alta — el checkpoint es el mecanismo que hace cumplir esa regla en la práctica.

#### 20.3.2 Comparación de fuerza lado sano vs. lado lesionado
Para lesiones unilaterales (post-LCA, desgarros de isquiotibiales/gemelos, meniscos), permitir registrar cargas/reps por separado en ejercicios unilaterales (zancada, prensa a una pierna, curl femoral a una pierna) y calcular automáticamente el **ratio de simetría** (lado afectado / lado sano x 100).

- Por debajo de 80-85% de simetría: la app mantiene el ejercicio en modalidad conservadora.
- 85-90%: zona de transición, visible pero sin desbloqueo automático de la fase siguiente (igual requiere checkpoint 20.3.1).
- ≥90%: criterio objetivo típico para considerar el retorno a gestos de mayor demanda (coincide con el criterio mencionado en 12.4) — se muestra como referencia, no como decisión automática de la app.

### 20.4 Constructor de rutinas — mejoras de experiencia

#### 20.4.1 Auditor de rutina "antes de guardar"
En vez de interrumpir al usuario ejercicio por ejercicio mientras arma su rutina manualmente, el auditor se ejecuta como resumen único al momento de guardar/confirmar:

- % de volumen por patrón de movimiento (empuje/tracción, tren superior/inferior) con comparación al ratio saludable de la sección 4.1.
- Grupos musculares con volumen fuera de rango para el nivel de experiencia del usuario (sección 9.2).
- Ejercicios en estado 🔴 (semáforo 20.1.1) incluidos en la rutina, con sugerencia de sustituto.
- Frecuencia de técnicas de intensificación (drop set, rest-pause, etc.) fuera de lo recomendado para su nivel (sección 5.2).

El usuario puede guardar la rutina igual aceptando las advertencias (no es bloqueante, salvo los casos de la sección 9.3 vinculados a lesiones activas, que sí deben bloquear).

#### 20.4.2 Sustitución inteligente de ejercicios
Motor de reemplazo automático, activado en tres situaciones: (a) el usuario no tiene el equipamiento requerido, (b) el ejercicio está en semáforo 🔴, o (c) el usuario lo solicita manualmente ("cambiar ejercicio"). El reemplazo debe respetar, en este orden de prioridad: mismo patrón de movimiento → mismo grupo muscular agonista → nivel de dificultad técnica similar o menor. Ejemplo: sentadilla con barra sin equipamiento de rack → sentadilla goblet; press banca con molestia de hombro → press con mancuernas en rango parcial o press en máquina (mayor estabilidad, menor demanda de estabilizadores del hombro).

### 20.5 Social / profesional (roadmap futuro, no MVP)

#### 20.5.1 Modo entrenador
Un profesional (entrenador certificado, kinesiólogo) puede vincularse a la cuenta de un usuario mediante invitación, con permisos para:

- Ver el historial completo de cargas, reportes de molestia y adherencia del usuario.
- Confirmar los checkpoints de alta de fase (20.3.1) directamente, en vez de que el usuario los autoconfirme.
- Ajustar manualmente la rutina generada por el sistema, quedando esos ajustes marcados como "editado por profesional" (con mayor peso que las sugerencias automáticas del motor).

Esto abre un modelo de monetización adicional (suscripción para entrenadores que gestionan múltiples clientes desde la misma app), pero se deja fuera del MVP inicial dado que agrega una capa completa de permisos y roles que conviene resolver después de validar el producto para usuario final.

---

## 21. Disclaimer general (para incluir en la app)

> Esta aplicación es una herramienta de planificación y educación en base a principios generales de entrenamiento y ciencias del ejercicio. No reemplaza la evaluación, diagnóstico ni seguimiento de un profesional de la salud (médico, kinesiólogo/fisioterapeuta) o de un entrenador certificado presencial, especialmente en procesos de rehabilitación, post-operatorios o condiciones médicas preexistentes.

---

## 22. Apéndice técnico: Motor de reglas (tabla condición-acción)

Esta es la traducción directa de la sección 9 (y de las reglas de seguridad dispersas en otras secciones) a un formato que el motor de reglas puede ejecutar sin ambigüedad. Cada fila es independiente del código de la app: se puede leer, auditar y modificar en una planilla o panel de admin, y el motor solo la interpreta.

### 22.1 Estructura de una regla

```
id                  → identificador único (ej. "R-014")
categoria           → lesion | volumen_frecuencia | desbalance | sobreentrenamiento
                      | equipamiento | edad | rehab_checkpoint | dolor_reportado
condicion           → una o más comparaciones sobre el perfil/rutina/historial del usuario
accion.tipo         → bloqueo | alerta_fuerte | alerta_leve | sustitucion | ajuste_automatico
accion.mensaje      → texto mostrado al usuario, explicando el "por qué"
accion.sustituto     → (si aplica) ejercicio o parámetro de reemplazo
prioridad           → alta | media | baja (si dos reglas chocan, gana la de mayor prioridad)
seccion_referencia  → trazabilidad al marco teórico (para futuras revisiones)
```

### 22.2 Tabla de reglas (primera versión — base para ampliar)

| id | categoría | condición | acción | prioridad | sección |
|---|---|---|---|---|---|
| R-001 | lesión | hombro activa/temprana + ejercicio.patrón = empuje vertical con barra/rango completo | bloqueo → sustituir por empuje con mancuernas en rango parcial | alta | 9.3 |
| R-002 | lesión | hombro activa/temprana + ejercicio = fondos profundos | bloqueo → sustituir por fondos en banco con rango limitado | alta | 9.3 |
| R-003 | lesión | rodilla (menisco) activa + ejercicio = sentadilla profunda con carga alta | bloqueo → sustituir por sentadilla en rango parcial controlado | alta | 9.3 |
| R-004 | lesión | rodilla (menisco) activa + ejercicio.tiene_torsión = true (pie fijo) | bloqueo total, sin sustituto automático (requiere revisión profesional) | alta | 9.3 |
| R-005 | lesión | desgarro muscular reciente (<X semanas) + ejercicio.tipo_contracción = excéntrica intensa o pliometría | bloqueo → mantener solo trabajo concéntrico controlado | alta | 9.3 |
| R-006 | lesión | post-LCA + meses_post_operatorio < 6 + ejercicio.categoría = pliometría o cambio de dirección | bloqueo total + mensaje explícito de alta profesional requerida | alta | 9.3 / 12.4 |
| R-007 | rehab_checkpoint | módulo de rehabilitación + fase_actual completada por tiempo, pero sin confirmación profesional | bloqueo de avance de fase (no bloquea seguir entrenando la fase actual) | alta | 20.3.1 |
| R-008 | volumen_frecuencia | experiencia = principiante + series_semana_grupo_muscular > 15 | alerta_leve → sugerir reducir volumen | media | 9.2 |
| R-009 | volumen_frecuencia | mismo_grupo_muscular entrenado con <48h de diferencia + experiencia ≠ avanzado | alerta_leve → sugerir reordenar sesiones | media | 9.2 |
| R-010 | volumen_frecuencia | sentadilla o peso muerto pesado (>80% 1RM) en días consecutivos | alerta_fuerte → sugerir espaciar sesiones | media | 9.2 |
| R-011 | desbalance | volumen_empuje / volumen_tracción > 1.4 (ratio configurable) | alerta_leve → sugerir sumar volumen de tracción | media | 4.1 / 9.1 |
| R-012 | desbalance | ausencia de ejercicios de core en rutina de fuerza alta (>3 sesiones/semana) | alerta_leve → sugerir agregar core | baja | 9.1 |
| R-013 | sobreentrenamiento | mismo peso/ejercicio + RPE reportado creciente durante ≥2 semanas | alerta_fuerte → sugerir semana de descarga (−40/50% volumen) | media | 9.4 / 20.1.3 |
| R-014 | sobreentrenamiento | 0 días de descanso en ≥2 semanas consecutivas | alerta_fuerte → sugerir día de descanso obligatorio | alta | 20.1.3 |
| R-015 | dolor_reportado | reporte "dolor agudo/punzante" con intensidad ≥7/10 | alerta_fuerte inmediata → pausar esa zona en la sesión actual + sugerir consulta profesional | alta | 20.1 (botón "me genera dolor") |
| R-016 | dolor_reportado | mismo ejercicio + misma zona reportada como "molestia articular" 2-3 veces en el mismo mesociclo | bloqueo automático del ejercicio (estado 🔴) + sustitución sugerida | alta | 20.1.1 |
| R-017 | dolor_reportado | reporte único de "fatiga muscular normal" | sin acción (se guarda como dato, no genera alerta) | baja | 20.1.1 |
| R-018 | equipamiento | ejercicio requiere equipamiento no marcado como disponible por el usuario | sustitucion automática por mismo patrón de movimiento/grupo muscular | media | 10.1 / 20.4.2 |
| R-019 | edad | perfil = tercera edad + ejercicio.técnica = fallo muscular o carga máxima | bloqueo → limitar a RIR ≥3 | alta | 14 |
| R-020 | edad | perfil = tercera edad + ejercicio implica Valsalva prolongada (ej. peso muerto máximo) | alerta_fuerte → sugerir variante con menor demanda respiratoria | alta | 14 |

### 22.3 Ejemplo de dos reglas en formato JSON (listo para el motor)

```json
[
  {
    "id": "R-001",
    "categoria": "lesion",
    "condicion": {
      "operador": "AND",
      "reglas": [
        { "campo": "perfil.lesiones.hombro.estado", "operador": "in", "valor": ["activa", "fase_temprana"] },
        { "campo": "ejercicio.patron_movimiento", "operador": "=", "valor": "empuje_vertical_barra" },
        { "campo": "ejercicio.rango_movimiento", "operador": "=", "valor": "completo" }
      ]
    },
    "accion": {
      "tipo": "bloqueo",
      "mensaje": "Este ejercicio no es recomendable con tu lesión de hombro activa. Lo reemplazamos por una variante más segura.",
      "sustituto": "press_mancuernas_rango_parcial"
    },
    "prioridad": "alta",
    "seccion_referencia": "9.3"
  },
  {
    "id": "R-016",
    "categoria": "dolor_reportado",
    "condicion": {
      "operador": "AND",
      "reglas": [
        { "campo": "registro_molestia.ejercicio_id", "operador": "=", "valor": "$ejercicio_actual" },
        { "campo": "registro_molestia.tipo", "operador": "=", "valor": "molestia_articular" },
        { "campo": "registro_molestia.count_en_mesociclo", "operador": ">=", "valor": 2 }
      ]
    },
    "accion": {
      "tipo": "bloqueo",
      "mensaje": "Este ejercicio quedó en observación por reportes repetidos de molestia. Te sugerimos un reemplazo y consultar a un profesional si continúa.",
      "sustituto": "auto_por_patron_movimiento"
    },
    "prioridad": "alta",
    "seccion_referencia": "20.1.1"
  }
]
```

### 22.4 Cómo se resuelven los conflictos entre reglas

Cuando varias reglas aplican al mismo ejercicio en el mismo momento (ej. R-001 por lesión y R-018 por falta de equipamiento), el motor debe:

1. Ordenar por `prioridad` (alta > media > baja).
2. Si hay empate, priorizar siempre la categoría `lesion` o `rehab_checkpoint` sobre cualquier otra — la seguridad clínica nunca cede ante conveniencia de equipamiento o preferencia de entrenamiento.
3. Un `bloqueo` siempre gana sobre una `alerta` o `sustitucion` — si el ejercicio queda bloqueado por una regla, no se evalúan las de menor severidad para ese mismo ejercicio.

### 22.5 Cómo escala esta tabla

Estas 20 reglas cubren los casos críticos de seguridad definidos hasta este punto del marco teórico, pero **no es una lista cerrada** — de hecho, ya se sumaron 6 reglas más (R-021 a R-026) en las secciones 13.6 (postural/escoliosis) y 15.5 (entrenamiento infantil), que siguen exactamente este mismo formato. Cada vez que sumemos un módulo nuevo (por ejemplo, un deporte adicional o una nueva lesión), el patrón a seguir es siempre el mismo: identificar la condición de riesgo → definir la acción concreta → asignar prioridad → referenciar la sección del marco teórico de la que surge. Esto mantiene el motor de reglas auditable y desacoplado del código de la app en todo momento — aunque para la implementación real, las 26 reglas deberían consolidarse en una única tabla maestra en vez de quedar repartidas por sección, algo a resolver al construir la base de datos.

---

## 23. Esquema de datos de la capa de conocimiento

Este es el desarrollo de la "capa 1" del diagrama de arquitectura: los tres tipos de entidades que alimentan tanto al generador de rutinas como al motor de reglas de la sección 22. Cada esquema incluye la definición de campos y un registro de ejemplo ya completado, para que sirva como referencia directa al programar la base de datos.

### 23.1 Esquema de Ejercicio

```json
{
  "id": "string (único)",
  "nombre": { "es": "string", "en": "string" },
  "patron_movimiento": "empuje_horizontal | empuje_vertical | traccion_horizontal | traccion_vertical | sentadilla | bisagra_cadera | core_antirotacion | core_antiextension | core_antiflexion | salto | sprint | rotacional",
  "grupo_muscular_agonista": "string (ej. pectoral, cuádriceps, dorsal ancho)",
  "grupo_muscular_antagonista": "string (para el cálculo del ratio de la sección 4.1)",
  "musculos_secundarios": ["string"],
  "tipo": "multiarticular | monoarticular",
  "equipamiento_requerido": ["ninguno | barra | mancuernas | máquina | banda_elástica | barra_dominadas | paralelas | banco_cajón | kettlebell | ..."],
  "nivel_dificultad": "principiante | intermedio | avanzado",
  "contraindicaciones": [
    { "lesion": "hombro | rodilla | lumbar | isquiotibiales | ...", "fase": "activa | temprana | cualquiera", "severidad": "bloqueo | alerta" }
  ],
  "deportes_relevantes": ["futbol", "voley", "basquet", "tenis_padel", "hockey", "atletismo_velocidad", "atletismo_fondo", "..."],
  "objetivo_correctivo": ["string | null (ej. estira_pectoral_menor, fortalece_serrato_anterior, fortalece_gluteo_antianteversion — sección 13.6)"],
  "escalera_progresion": {
    "variante_anterior_id": "string | null",
    "variante_siguiente_id": "string | null"
  },
  "instrucciones": { "es": "string", "en": "string", "...otros_idiomas": "string" },
  "media": {
    "gif_url": "string | null",
    "video_url": "string | null",
    "media_status": "pendiente | cargado"
  },
  "tags_adicionales": ["string (ej. unilateral, alto_impacto, bajo_impacto, isometrico)"]
}
```

**Ejemplo poblado — Press banca plano:**

```json
{
  "id": "EX-0142",
  "nombre": { "es": "Press banca plano", "en": "Flat barbell bench press" },
  "patron_movimiento": "empuje_horizontal",
  "grupo_muscular_agonista": "pectoral",
  "grupo_muscular_antagonista": "dorsal_ancho",
  "musculos_secundarios": ["tríceps", "deltoides_anterior"],
  "tipo": "multiarticular",
  "equipamiento_requerido": ["barra", "banco_plano", "rack"],
  "nivel_dificultad": "intermedio",
  "contraindicaciones": [
    { "lesion": "hombro", "fase": "activa", "severidad": "bloqueo" },
    { "lesion": "hombro", "fase": "temprana", "severidad": "alerta" }
  ],
  "deportes_relevantes": ["voley", "hockey"],
  "escalera_progresion": { "variante_anterior_id": "EX-0098", "variante_siguiente_id": "EX-0201" },
  "instrucciones": { "es": "Acostado en el banco, bajar la barra al pecho controladamente y empujar hasta extensión completa de brazos.", "en": "Lying on the bench, lower the bar to chest level with control and press to full arm extension." },
  "media": { "gif_url": null, "video_url": null, "media_status": "pendiente" },
  "tags_adicionales": ["bilateral", "básico_estructural"]
}
```

### 23.2 Esquema de Método (biblioteca de técnicas, sección 5)

```json
{
  "id": "string",
  "nombre": { "es": "string", "en": "string" },
  "tipo": "intensificacion | tempo | densidad | pausa_intraserie",
  "descripcion": "string",
  "parametros_configurables": {
    "campo_1": "descripción del parámetro (ej. porcentaje_reduccion_carga, cantidad_drops, segundos_pausa)"
  },
  "restricciones": {
    "nivel_minimo": "principiante | intermedio | avanzado",
    "contraindicado_si": ["lesion_activa_cualquiera | rehab_fase_1_2 | ..."],
    "frecuencia_maxima_semanal": "number | null"
  },
  "aplicable_a": {
    "patrones_movimiento": ["string"] ,
    "tipo_ejercicio": "multiarticular | monoarticular | ambos"
  },
  "seccion_referencia": "string"
}
```

**Ejemplo poblado — Drop set:**

```json
{
  "id": "MET-004",
  "nombre": { "es": "Drop set", "en": "Drop set" },
  "tipo": "intensificacion",
  "descripcion": "Al llegar al fallo técnico, se reduce la carga entre 15-30% y se continúa la serie sin pausa. Se puede repetir 1-3 veces (drops).",
  "parametros_configurables": {
    "porcentaje_reduccion_carga": "15-30% por drop",
    "cantidad_drops": "1-3"
  },
  "restricciones": {
    "nivel_minimo": "intermedio",
    "contraindicado_si": ["rehab_fase_1_2", "lesion_activa_zona_involucrada"],
    "frecuencia_maxima_semanal": 2
  },
  "aplicable_a": {
    "patrones_movimiento": ["empuje_horizontal", "empuje_vertical", "traccion_horizontal", "traccion_vertical", "sentadilla"],
    "tipo_ejercicio": "ambos"
  },
  "seccion_referencia": "5.1 / 5.2"
}
```

### 23.3 Esquema de Reglas/Plantilla de deporte (sección 11)

A diferencia del ejercicio y el método (entidades "atómicas"), el deporte es una **plantilla compuesta**: define qué bloques debe tener la rutina y con qué parámetros, pero se completa con ejercicios reales de la biblioteca (23.1) filtrados por `deportes_relevantes` y por los patrones de movimiento que cada bloque necesita.

```json
{
  "id": "string",
  "nombre": { "es": "string", "en": "string" },
  "patron_dominante": ["salto | sprint | lanzamiento | contacto | rotacional | resistencia"],
  "demandas_energeticas": "aerobico | anaerobico | mixto",
  "patron_esfuerzo": "continuo | intermitente",
  "bloques": {
    "fuerza_base": { "patrones_movimiento_prioritarios": ["string"], "series_reps_default": "string (rango)" },
    "fuerza_especifica": { "patrones_movimiento_prioritarios": ["string"] },
    "potencia_velocidad": { "tipo_ejercicio": "pliometria | explosivo | ambos" },
    "cardio_especifico": {
      "categorias": ["sprints_rectos | cambios_direccion | resistencia_intermitente | rsa"],
      "parametros_por_fase": {
        "pretemporada": "string (ej. mayor volumen resistencia intermitente)",
        "competencia": "string (ej. foco en RSA y velocidad pura)",
        "transicion": "string (ej. volumen reducido)"
      }
    },
    "prevencion": { "zonas_prioritarias": ["string"], "ejercicios_tipo": ["string"] }
  },
  "zonas_lesion_tipicas": ["string"],
  "seccion_referencia": "string"
}
```

**Ejemplo poblado — Fútbol:**

```json
{
  "id": "SPORT-001",
  "nombre": { "es": "Fútbol", "en": "Soccer / Football" },
  "patron_dominante": ["sprint", "salto", "contacto"],
  "demandas_energeticas": "mixto",
  "patron_esfuerzo": "intermitente",
  "bloques": {
    "fuerza_base": { "patrones_movimiento_prioritarios": ["sentadilla", "bisagra_cadera", "core_antirotacion"], "series_reps_default": "3-4 x 6-10" },
    "fuerza_especifica": { "patrones_movimiento_prioritarios": ["zancada", "unilateral_cadera"] },
    "potencia_velocidad": { "tipo_ejercicio": "ambos" },
    "cardio_especifico": {
      "categorias": ["sprints_rectos", "cambios_direccion", "resistencia_intermitente", "rsa"],
      "parametros_por_fase": {
        "pretemporada": "mayor volumen de resistencia intermitente (tipo Yo-Yo) y base de fuerza",
        "competencia": "foco en RSA (6-10x20-30m) y velocidad pura, volumen de fuerza en mantenimiento",
        "transicion": "volumen reducido, prioridad en recuperación activa"
      }
    },
    "prevencion": { "zonas_prioritarias": ["isquiotibiales", "aductores", "tobillo"], "ejercicios_tipo": ["nordic_hamstring", "copenhagen_plank", "propiocepcion_tobillo"] }
  },
  "zonas_lesion_tipicas": ["isquiotibiales", "rodilla", "tobillo", "aductores"],
  "seccion_referencia": "11.2"
}
```

---

## 24. Esquema de datos — Usuario, Rutina y registros de seguimiento

Estas son las entidades que completan el modelo: el perfil del usuario, la rutina que consume la capa de conocimiento (sección 23), y los registros que alimentan el ciclo de adaptación (capa 4 del diagrama de arquitectura). Todas están enlazadas por relaciones 1-a-muchos, salvo `RUTINA`-`EJERCICIO` que es muchos-a-muchos (una rutina incluye muchos ejercicios, y un mismo ejercicio aparece en muchas rutinas distintas).

### 24.1 Usuario

```json
{
  "id": "uuid",
  "edad": "number",
  "sexo_biologico": "string",
  "peso_kg": "number",
  "altura_cm": "number",
  "experiencia": "principiante | intermedio | avanzado",
  "objetivo_principal": "hipertrofia | fuerza_maxima | fuerza_potencia | fuerza_resistencia | salud_general | rendimiento_deportivo | rehabilitacion",
  "disponibilidad": { "dias_semana": "number", "minutos_sesion": "number" },
  "equipamiento_disponible": ["ninguno | bandas | mobiliario_urbano | gimnasio_completo | ..."],
  "deporte": "string | null (referencia a id de 23.3)",
  "condiciones_especiales": ["tercera_edad | embarazo | hipertension | ..."],
  "historial_lesiones": [
    { "zona": "string", "tipo": "string", "fecha": "date", "estado": "activa | en_recuperacion | resuelta", "fase_rehab_actual": "string | null", "origen": "declarado_por_usuario | inferido_por_reportes_dolor" }
  ],
  "alteraciones_posturales": ["hombros_adelantados | cabeza_adelantada | anteversion_pelvica | escoliosis | hiperkifosis | ... (sección 13.6)"],
  "franja_etaria": "niño_preadolescente | adolescente | adulto (sección 15.5)",
  "consentimiento_adulto_responsable": { "confirmado": "boolean", "fecha_confirmacion": "date | null" },
  "estado_gestacional": "no_aplica | embarazada | posparto (sección 17.5)",
  "semana_gestacion_o_posparto": "number | null",
  "autorizacion_medica_confirmada": { "confirmado": "boolean", "fecha_confirmacion": "date | null" }
}
```

`historial_lesiones` es el **perfil dinámico de lesiones** de la sección 20 — no es estático: el motor de reglas lo actualiza automáticamente cuando `REGISTRO_MOLESTIA` (24.5) detecta un patrón repetido (regla R-016), marcando `origen: inferido_por_reportes_dolor` para distinguir lo que el usuario declaró de lo que el sistema dedujo.

### 24.2 Rutina

```json
{
  "id": "uuid",
  "usuario_id": "uuid (FK)",
  "objetivo": "string (hereda de usuario.objetivo_principal, pero editable por rutina)",
  "split": "full_body | upper_lower | ppl | agonista_antagonista | bro_split | deportiva | rehab",
  "dias_por_semana": "number",
  "modelo_periodizacion": "lineal | ondulante | por_bloques | autorregulada",
  "fase_mesociclo": "acumulacion | intensificacion | realizacion | descarga",
  "semana_actual_mesociclo": "number",
  "fecha_inicio": "date",
  "ejercicios_incluidos": [
    { "ejercicio_id": "string (FK a 23.1)", "dia": "number", "orden": "number", "series": "number", "reps_objetivo": "string (rango)", "intensidad": "%1RM o RIR objetivo", "tempo": "string | null", "descanso_seg": "number", "metodo_aplicado_id": "string | null (FK a 23.2)" }
  ],
  "auditoria_generacion": { "alertas_disparadas": ["id de regla, sección 22"], "sustituciones_aplicadas": ["string"] }
}
```

`auditoria_generacion` es el registro de qué reglas del motor (sección 22) se activaron al generar o guardar esta rutina — clave para trazabilidad si el usuario reporta un problema más adelante.

### 24.3 Sesión (entrenamiento ejecutado)

```json
{
  "id": "uuid",
  "rutina_id": "uuid (FK)",
  "fecha": "date",
  "dia_de_rutina": "number",
  "check_in_pre_sesion": "descansado | cansado | con_molestia_puntual",
  "zona_molestia_puntual": "string | null",
  "ajuste_automatico_aplicado": "string | null (ej. -1 serie, sustitución de ejercicio)",
  "completada": "boolean"
}
```

### 24.4 Registro de carga (progresión, sección 20.2.1)

```json
{
  "id": "uuid",
  "sesion_id": "uuid (FK)",
  "ejercicio_id": "string (FK a 23.1)",
  "serie_numero": "number",
  "carga_kg": "number",
  "reps_realizadas": "number",
  "rir_reportado": "number",
  "metodo_aplicado_id": "string | null"
}
```

Es la tabla que alimenta el gráfico de progresión de carga y, junto con `TEST_FUERZA` (24.6), el recálculo automático de %1RM para el mesociclo siguiente (sección 6.1).

### 24.5 Registro de molestia (botón "me genera dolor/incomodidad")

```json
{
  "id": "uuid",
  "sesion_id": "uuid (FK)",
  "ejercicio_id": "string (FK a 23.1)",
  "serie_numero": "number | null",
  "tipo": "fatiga_muscular_normal | molestia_articular | dolor_agudo_punzante",
  "zona_corporal": "string",
  "intensidad": "number (1-10)",
  "continuo_o_puntual": "solo_este_ejercicio | se_repite_hace_varias_sesiones"
}
```

Cada registro nuevo dispara una re-evaluación contra las reglas R-015, R-016 y R-017 (sección 22) — el resultado (bloqueo, alerta o ninguna acción) no se guarda acá, se calcula en tiempo real cruzando el historial de esta tabla con las reglas.

### 24.6 Test de fuerza (sección 20.2.2)

```json
{
  "id": "uuid",
  "usuario_id": "uuid (FK)",
  "ejercicio_id": "string (FK a 23.1)",
  "tipo_test": "1rm_estimado | test_resistencia",
  "valor_resultado": "number (kg estimados, o repeticiones máximas)",
  "formula_usada": "epley | brzycki | null",
  "fecha": "date"
}
```

### 24.7 Checkpoint de rehabilitación (sección 20.3.1)

```json
{
  "id": "uuid",
  "usuario_id": "uuid (FK)",
  "lesion": "string (referencia a historial_lesiones)",
  "fase_actual": "number",
  "fase_confirmada_hasta": "number",
  "confirmado_por": "usuario | profesional_vinculado | null",
  "fecha_confirmacion": "date | null",
  "bloqueado": "boolean (true si fase_actual > fase_confirmada_hasta)"
}
```

Este registro es el que hace cumplir en la práctica la regla R-006 y R-007 (sección 22): mientras `bloqueado = true`, el generador de rutinas no puede incluir ejercicios de la fase siguiente, sin importar cuánto tiempo haya transcurrido.

### 24.8 Relación con la biblioteca de ejercicios

`RUTINA.ejercicios_incluidos[].ejercicio_id` y `REGISTRO_CARGA.ejercicio_id` apuntan siempre al mismo catálogo (23.1) — es la relación muchos-a-muchos entre `RUTINA` y `EJERCICIO` del diagrama: una rutina incluye muchos ejercicios, y un ejercicio (ej. sentadilla) aparece en miles de rutinas de usuarios distintos. Esto es lo que permite, a futuro, análisis agregados (ej. "qué ejercicios generan más reportes de molestia en la base completa de usuarios") sin duplicar información.

---

Con esto el modelo de datos queda completo: **Ejercicio, Método y Plantilla de deporte** (sección 23, la capa de conocimiento) y **Usuario, Rutina, Sesión, Registro de carga, Registro de molestia, Test de fuerza y Checkpoint de rehabilitación** (sección 24, la capa dinámica del usuario). Entre las dos capas y el motor de reglas (sección 22) está todo lo necesario para que la app genere y adapte rutinas de forma autónoma, con trazabilidad completa al marco teórico.

---

## 25. Algoritmo del generador de rutinas

Este es el procedimiento concreto que corre la "capa 3" del diagrama de arquitectura: toma todo lo definido en las secciones 23, 24 y 22, y produce (o adapta) una rutina real. Se divide en dos flujos: **generación inicial** (cuando el usuario arma o pide una rutina por primera vez) y **adaptación continua** (cómo se ajusta sesión a sesión sin regenerar todo desde cero).

### 25.1 Flujo de generación inicial — paso a paso

**Paso 1 — Leer el perfil (`USUARIO`, sección 24.1)**
Objetivo principal, experiencia, disponibilidad, equipamiento disponible, deporte (si aplica), condiciones especiales, historial de lesiones (activas y en fase de rehab).

**Paso 2 — Elegir la plantilla base**
- Si el usuario definió un deporte → la plantilla es la de `PLANTILLA_DEPORTE` (sección 23.3) correspondiente.
- Si no → la plantilla surge de cruzar `objetivo_principal` (sección 7) con `dias_por_semana` (sección 4.2) para elegir el split (full body, upper/lower, PPL, etc.).
- Si hay lesión activa relevante → se prioriza la plantilla de rehabilitación (sección 11) para la zona afectada, y el resto de la rutina se arma alrededor de esa restricción (no al revés).

**Paso 3 — Determinar la fase de mesociclo**
Si es una rutina nueva → fase `acumulación` por defecto (sección 6.2). Si es una rutina que continúa una anterior → leer `RUTINA.semana_actual_mesociclo` y calcular la fase correspondiente según el `modelo_periodizacion` elegido.

**Paso 4 — Poblar cada bloque de la plantilla con ejercicios reales**
Para cada bloque (`fuerza_base`, `fuerza_especifica`, `potencia_velocidad`, `cardio_especifico`, `prevencion`, o los grupos musculares del split si no hay deporte):
1. Filtrar la biblioteca de ejercicios (23.1) por `patron_movimiento` requerido por el bloque.
2. Descartar los que requieren `equipamiento_requerido` no disponible para el usuario (sección 10.1) — excepto si hay sustituto por mobiliario urbano/bandas.
3. Descartar los que tengan `contraindicaciones` que matcheen con `historial_lesiones` en estado `activa` (severidad `bloqueo`).
4. Ordenar por `nivel_dificultad` (no debe superar la experiencia del usuario) y por `tags_adicionales` (ej. priorizar "básico_estructural" antes que aislamiento).
5. Elegir el ejercicio mejor rankeado que aún no esté usado en la rutina de esa sesión.

**Paso 5 — Verificar balance agonista/antagonista (sección 4.1)**
Calcular el ratio de volumen empuje/tracción (y equivalentes) de lo seleccionado hasta el momento. Si está fuera de rango, el paso 4 se repite priorizando el patrón de movimiento faltante antes de seguir sumando ejercicios del que ya está sobrerrepresentado.

**Paso 6 — Asignar parámetros de entrenamiento**
Para cada ejercicio seleccionado, completar series/reps/intensidad/descanso/tempo según los rangos por defecto del objetivo (tabla de la sección 7), ajustados por la fase de mesociclo del paso 3 (más volumen en acumulación, más intensidad en intensificación, etc.).

**Paso 7 — Aplicar métodos de intensificación (opcional, sección 23.2)**
Solo si `experiencia` del usuario ≥ `nivel_minimo` del método, no hay contraindicación activa en la zona (`contraindicado_si`), y no se excede `frecuencia_maxima_semanal` ya usada en la rutina. Se aplica a lo sumo a 1-2 ejercicios por sesión, nunca a todos (ver restricción implícita de sección 5.2).

**Paso 8 — Pasar todo por el motor de reglas (sección 22)**
Se evalúa la rutina completa (todos los ejercicios + parámetros + métodos) contra la tabla de reglas condición-acción:
- Si una regla dispara `bloqueo` → se ejecuta la sustitución automática indicada, y se vuelve a correr el paso 5 (rebalanceo) si el reemplazo cambia el patrón de movimiento.
- Si dispara `alerta_fuerte` o `alerta_leve` → se marca para mostrar en el auditor final (paso 9), pero no bloquea.
- Los conflictos entre reglas se resuelven según el orden de la sección 22.4 (prioridad, luego categoría `lesión`/`rehab_checkpoint` primero, luego bloqueo gana sobre alerta).

**Paso 9 — Auditor final (sección 20.4.1)**
Se genera el resumen consolidado (% empuje/tracción, volumen por grupo muscular vs. rango esperado para su experiencia, ejercicios en semáforo 🔴, alertas de las reglas no bloqueantes) y se muestra antes de confirmar.

**Paso 10 — Guardar**
Se persiste la `RUTINA` con `ejercicios_incluidos` completo y `auditoria_generacion` (qué reglas se dispararon y qué sustituciones se aplicaron), para trazabilidad futura.

### 25.2 Pseudocódigo del flujo (resumen ejecutable)

```
function generarRutina(usuario):
    plantilla = elegirPlantilla(usuario)                     // Paso 2
    fase = determinarFaseMesociclo(usuario, plantilla)         // Paso 3

    ejerciciosSeleccionados = []
    para cada bloque en plantilla.bloques:
        candidatos = biblioteca.filtrar(
            patron_movimiento = bloque.patrones_requeridos,
            equipamiento_disponible = usuario.equipamiento_disponible,
            nivel_maximo = usuario.experiencia,
            excluir_contraindicados = usuario.historial_lesiones
        )
        ejercicio = elegirMejorRankeado(candidatos, ejerciciosSeleccionados)
        ejerciciosSeleccionados.agregar(ejercicio)

    rebalancearAgonistaAntagonista(ejerciciosSeleccionados)     // Paso 5

    para cada ejercicio en ejerciciosSeleccionados:
        asignarParametros(ejercicio, usuario.objetivo, fase)    // Paso 6
        si aplicaMetodo(ejercicio, usuario):
            aplicarMetodo(ejercicio)                            // Paso 7

    resultadoReglas = motorReglas.evaluar(ejerciciosSeleccionados, usuario)  // Paso 8
    para cada conflicto en resultadoReglas.bloqueos:
        sustituir(conflicto.ejercicio, conflicto.sustituto)
        rebalancearAgonistaAntagonista(ejerciciosSeleccionados)

    auditoria = generarAuditor(ejerciciosSeleccionados, resultadoReglas.alertas)  // Paso 9

    retornar { rutina: ejerciciosSeleccionados, auditoria: auditoria }          // Paso 10
```

### 25.3 Flujo de adaptación continua (no regenera desde cero)

A diferencia de la generación inicial, la adaptación **no vuelve a correr todo el algoritmo** — sería costoso e innecesario. En cambio, reacciona a eventos puntuales:

| Evento (tabla origen) | Qué dispara |
|---|---|
| Nuevo `REGISTRO_CARGA` con RIR real distinto al objetivo, sostenido 2+ sesiones | Recalcula la carga sugerida para ese ejercicio la próxima vez que aparezca (sección 6.1), sin tocar el resto de la rutina |
| Nuevo `REGISTRO_MOLESTIA` que dispara R-015/R-016 (sección 22) | Sustituye ese ejercicio puntual en la sesión actual (bloqueo inmediato) o lo marca 🔴 para futuras sesiones (bloqueo persistente), sin regenerar la rutina completa |
| `check_in_pre_sesion = cansado` o `con_molestia_puntual` | Ajusta solo la sesión del día (menos series, o sustitución puntual) — la rutina guardada no cambia |
| Nuevo `TEST_FUERZA` | Recalcula los `%1RM` de todos los ejercicios afectados en el próximo mesociclo (paso 6 se vuelve a correr solo para esos ejercicios) |
| `REHAB_CHECKPOINT.bloqueado` pasa a `false` (confirmación profesional) | Recién ahí el paso 4 puede incluir ejercicios de la fase siguiente para esa lesión — hasta ese momento, quedan excluidos de los candidatos sin importar el tiempo transcurrido |
| Fin de mesociclo (semana_actual_mesociclo llega al máximo definido) | Sí dispara una regeneración parcial: se vuelve a correr el Paso 3 en adelante (nueva fase de periodización), manteniendo el mismo split y objetivo salvo que el usuario los cambie |

Esta distinción es importante: la adaptación es **incremental por diseño** — cambia lo mínimo necesario en respuesta a un dato nuevo, en vez de recalcular toda la rutina cada vez. Esto también hace que las alertas y sustituciones sean más predecibles para el usuario (no ve su plan completo reordenado por un solo reporte de molestia).

---

## 26. Fuentes y respaldo profesional del contenido clínico

Esta sección responde directamente a un requisito tuyo: que el contenido clínico de la app (rehabilitación, escoliosis, corrección postural, tercera edad) esté respaldado por información certificada por profesionales en cada tema, no solo por conocimiento general de ciencias del ejercicio. Acá se contrasta cada módulo sensible contra guías clínicas y consensos profesionales publicados y vigentes.

**Importante**: esto confirma que el marco conceptual coincide con el consenso profesional actual — pero sigue sin reemplazar la revisión de un profesional con matrícula sobre el contenido final de la app antes de lanzarla (ver 24.5).

### 26.1 Rehabilitación (sección 12)

**Manguito rotador (12.1)** — Respaldado por la guía de práctica clínica 2025 de la American Physical Therapy Association (APTA) y la Academy of Orthopaedic Physical Therapy, publicada en el *Journal of Orthopaedic & Sports Physical Therapy* (JOSPT), que recomienda un programa de ejercicio activo (motor control y/o entrenamiento de fuerza) como tratamiento inicial para reducir dolor y discapacidad en tendinopatía del manguito rotador, en línea con el enfoque conservador y progresivo por fases que ya definimos.
Fuente: JOSPT / APTA — "Rotator Cuff Tendinopathy Diagnosis, Nonsurgical Medical Care, and Rehabilitation: A Clinical Practice Guideline" (2025). https://www.jospt.org/doi/10.2519/jospt.2025.13182

**Meniscos (12.2)** — Respaldado por el consenso formal EU-US de Rehabilitación de Menisco 2024, iniciativa conjunta de ESSKA, AOSSM y AASPT, que recomienda dividir la rehabilitación en fases criterio-dependientes (protectora, restaurativa, y preparación para el retorno a la actividad), con criterios objetivos de avance como rango de movimiento casi completo, ausencia de derrame articular y control neuromuscular del cuádriceps — exactamente la lógica de fases que usamos en 12.2.
Fuente: ESSKA-AOSSM-AASPT — "The Formal EU-US Meniscus Rehabilitation 2024 Consensus" (Parte I y II). https://pmc.ncbi.nlm.nih.gov/articles/PMC12310086/

**Desgarros musculares (12.3)** — Respaldado por la guía de práctica clínica de lesión de isquiotibiales de la Academy of Orthopaedic Physical Therapy y la American Academy of Sports Physical Theropy (JOSPT, 2022), que documenta que instituir el ejercicio nórdico de isquiotibiales redujo la tasa de reincidencia de 7 de 35 casos a 1 de 34 en jugadores profesionales de fútbol en la misma institución, y recomienda entrenamiento excéntrico en posición de elongación muscular como estrategia central — esto respalda tanto el protocolo de rehabilitación de 12.3 como el uso preventivo del "Nordic hamstring" en el módulo de fútbol (11.2).
Fuente: JOSPT / Academy of Orthopaedic PT & Academy of Sports PT (APTA) — "Hamstring Strain Injury in Athletes: Clinical Practice Guidelines" (2022). https://www.jospt.org/doi/10.2519/jospt.2022.0301

**Post-operatorio de LCA (12.4)** — Respaldado por el consenso del Panther Symposium sobre retorno deportivo tras lesión de LCA, que establece una progresión basada en criterios objetivos (no solo en tiempo transcurrido) a través de las fases de retorno a la participación, retorno al deporte y retorno al rendimiento, con un índice de simetría de fuerza del cuádriceps ≥90% como umbral de referencia aceptado para el alta — coincide exactamente con el criterio de simetría que ya usamos en 12.4 y en la funcionalidad de comparación lado sano/lesionado (20.3.2).
Fuentes: Panther Symposium ACL Injury Return to Sport Consensus Group (2020); AOSSM — "Return to Play After ACL Reconstruction: Integrating Key Metrics" (2025). https://www.sportsmed.org/membership/sports-medicine-update/winter-2025/return-to-play-after-acl-integrating-key-metrics

### 26.2 Corrección postural y escoliosis (sección 13)

**Síndrome cruzado superior — hombros adelantados y cabeza adelantada (13.1/13.3)** — El modelo de referencia es el descrito originalmente por el Dr. Vladimir Janda, que caracteriza este patrón como un acortamiento de pectorales/trapecio superior/suboccipitales combinado con debilidad de flexores profundos del cuello/romboides/trapecio medio e inferior. Una revisión sistemática con metaanálisis publicada en *BMC Musculoskeletal Disorders* (2024) confirma, con nivel de evidencia 1, que los ejercicios terapéuticos de fortalecimiento y elongación son efectivos para reducir la cabeza adelantada, los hombros redondeados y la hipercifosis torácica — esto respalda directamente el enfoque de estiramiento + fortalecimiento + reeducación motora de 13.1 y 13.3.
Fuentes: Physiopedia — "Upper-Crossed Syndrome"; *BMC Musculoskeletal Disorders* — "The effect of various therapeutic exercises on forward head posture, rounded shoulder, and hyperkyphosis among people with upper crossed syndrome: a systematic review and meta-analysis" (2024). https://link.springer.com/article/10.1186/s12891-024-07224-4

**Escoliosis (13.2)** — Respaldado directamente por las guías de la SOSORT (International Society on Scoliosis Orthopaedic and Rehabilitation Treatment), la referencia global más citada en tratamiento conservador de escoliosis idiopática. Estas guías establecen que el bracing es la intervención con mayor nivel de evidencia para curvas evolutivas mayores a 25° durante el crecimiento, y — el punto más importante para nuestro diseño — que los ejercicios específicos de escoliosis (PSSE, como los métodos Schroth o SEAS) **no deben aplicarse de forma aislada sin bracing, salvo que lo prescriba un médico especialista en escoliosis**. Esto confirma exactamente el límite conservador que ya habíamos definido en 13.2, y refuerza que la regla R-021 (bloqueo sin confirmación profesional) es el diseño correcto, no una precaución excesiva.
Fuente: SOSORT — "Guidelines for Conservative Treatment of Idiopathic Scoliosis" (actualización 2016-2018). https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5795289/

### 26.3 Tercera edad (sección 14)

Respaldado por las recomendaciones ExRx del American College of Sports Medicine (ACSM) para adultos mayores de 65 años, que especifican entrenamiento de fuerza con 8-10 ejercicios de los grandes grupos musculares, flexibilidad al menos 2 días/semana (manteniendo cada estiramiento 30-60 segundos), y entrenamiento de equilibrio 2-3 días/semana en personas con riesgo de caída — una estructura que coincide con la de la sección 14. Además, una revisión sistemática que informó las guías de actividad física de la OMS para mayores de 65 años encontró que el ejercicio reduce la tasa de caídas en un 23% en adultos mayores que viven en la comunidad, con alta certeza de evidencia.
Fuentes: ACSM — "Coming of Age: Considerations in the Prescription of Exercise for Older Adults"; revisión sistemática que informó las guías de la OMS sobre actividad física y prevención de caídas en mayores de 65 años. https://pmc.ncbi.nlm.nih.gov/articles/PMC4969034/ / https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7689963/

### 26.4 Entrenamiento infantil (sección 15)

Respaldado directamente por la declaración de posición actualizada de la National Strength and Conditioning Association (NSCA) sobre entrenamiento de fuerza en jóvenes (2009), avalada también por la American Academy of Pediatrics, que concluye que no hay evidencia de reducción de estatura en niños que entrenan fuerza de forma regular en un entorno controlado, que no se ha reportado ninguna fractura de placa de crecimiento en estudios de entrenamiento de fuerza juvenil, y que — siguiendo pautas apropiadas para la edad — el entrenamiento de fuerza puede ayudar a maximizar la densidad mineral ósea durante la niñez y adolescencia. Esta es la fuente que respalda directamente el desmentido del mito planteado en 15.1, y confirma que el riesgo real proviene de la falta de supervisión y técnica deficiente, no del entrenamiento de fuerza en sí.
Fuente: Faigenbaum et al. — "Youth Resistance Training: Updated Position Statement Paper from the National Strength and Conditioning Association", *Journal of Strength and Conditioning Research* (2009). https://journals.lww.com/nsca-jscr/fulltext/2009/08005/youth_resistance_training__updated_position.2.aspx

### 26.5 Embarazo y posparto (sección 17)

Respaldado por la Opinión de Comité 804 del American College of Obstetricians and Gynecologists (ACOG), que establece que, en ausencia de complicaciones obstétricas o médicas, la actividad física durante el embarazo es segura y deseable, que debe alentarse el entrenamiento aeróbico y de fuerza antes, durante y después del embarazo, y que los beneficios documentados incluyen menor riesgo de diabetes gestacional, preeclampsia, cesárea y trastornos depresivos posparto — esta es la fuente directa de los principios generales de 17.1. La recomendación de volumen (150 minutos semanales de actividad aeróbica moderada) coincide con la que ya usábamos para población general.
Fuente: ACOG — "Physical Activity and Exercise During Pregnancy and the Postpartum Period", Committee Opinion No. 804 (2020). https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2020/04/physical-activity-and-exercise-during-pregnancy-and-the-postpartum-period

### 26.6 Qué significa esto en la práctica para el motor de reglas

Cada una de estas fuentes no solo "valida" lo ya escrito — también da pie a **ajustar con más precisión** algunos parámetros del motor de reglas (sección 22) y de las fases de rehabilitación (sección 12) con los valores exactos de los consensos (ej. tiempos de retorno deportivo por tipo de reparación de menisco, umbrales específicos de fuerza para meniscectomía vs. reparación). Esto queda como tarea pendiente natural: revisar sección por sección y afinar los números actuales contra estas fuentes específicas.

### 26.7 Lo que estas fuentes no reemplazan

Estas guías y consensos son literatura profesional revisada por pares — le dan al marco teórico un respaldo real y verificable, no genérico. Pero siguen siendo **guías generales de población**, no una evaluación de un caso individual. Antes de que cualquier usuario real siga los módulos de rehabilitación, escoliosis, corrección postural, entrenamiento infantil o embarazo/posparto, sigue siendo necesario que un profesional con matrícula (kinesiólogo, médico deportólogo, fisioterapeuta especializado en columna o piso pélvico según el caso, obstetra, o un preparador físico con formación específica en poblaciones pediátricas) revise y avale el contenido final de la app — idealmente de forma documentada, porque eso es lo que te protege legalmente y le da credibilidad real al producto frente al usuario, más allá de las fuentes citadas acá.


---





