/**
 * Verificación manual (no requiere framework de testing) de que el motor de
 * reglas dispara los casos definidos en la sección 21.3 del marco teórico.
 * Correr con: npx tsx lib/__tests__/verificar-motor-reglas.ts
 */
import { evaluarReglas } from "../motor-reglas";
import type { ContextoEvaluacion } from "../types";

const usuarioBase: ContextoEvaluacion["usuario"] = {
  id: "u1",
  experiencia: "intermedio",
  equipamientoDisponible: ["barra", "banco_plano", "rack"],
  condicionesEspeciales: [],
  historialLesiones: [],
  alteracionesPosturales: [],
  franjaEtaria: "adulto",
  consentimientoAdultoConfirmado: true,
  estadoGestacional: "no_aplica",
  autorizacionMedicaConfirmada: true,
};

// Caso 1 — R-001: hombro activo + press vertical con barra → debe bloquear
const caso1: ContextoEvaluacion = {
  usuario: { ...usuarioBase, historialLesiones: [{ zona: "hombro", tipo: "tendinopatia", fecha: "2026-06-01", estado: "activa", origen: "declarado_por_usuario" }] },
  ejercicio: { id: "ex1", patronMovimiento: "empuje_vertical_barra", equipamientoRequerido: ["barra"], nivelDificultad: "intermedio", contraindicaciones: [], tagsAdicionales: [] },
  parametros: {},
};

// Caso 2 — R-026: adolescente sin consentimiento de adulto → bloqueo del generador
const caso2: ContextoEvaluacion = {
  usuario: { ...usuarioBase, franjaEtaria: "niño_preadolescente", consentimientoAdultoConfirmado: false },
  ejercicio: { id: "ex2", patronMovimiento: "sentadilla", equipamientoRequerido: [], nivelDificultad: "principiante", contraindicaciones: [], tagsAdicionales: [] },
  parametros: {},
};

// Caso 3 — sin disparadores → no debería devolver ninguna regla
const caso3: ContextoEvaluacion = {
  usuario: usuarioBase,
  ejercicio: { id: "ex3", patronMovimiento: "traccion_horizontal", equipamientoRequerido: ["barra"], nivelDificultad: "intermedio", contraindicaciones: [], tagsAdicionales: [] },
  parametros: {},
};

// Caso 4 — R-014: 0 días de descanso en 2 semanas → alerta_fuerte
const caso4: ContextoEvaluacion = {
  usuario: usuarioBase,
  ejercicio: { id: "ex4", patronMovimiento: "empuje_horizontal", equipamientoRequerido: [], nivelDificultad: "intermedio", contraindicaciones: [], tagsAdicionales: [] },
  parametros: {},
  diasDescansoUltimas2Semanas: 0,
};

// Caso 5 — R-020: tercera edad + ejercicio con Valsalva → alerta_fuerte
const caso5: ContextoEvaluacion = {
  usuario: { ...usuarioBase, condicionesEspeciales: ["tercera_edad"] },
  ejercicio: { id: "ex5", patronMovimiento: "bisagra_cadera", equipamientoRequerido: [], nivelDificultad: "intermedio", contraindicaciones: [], tagsAdicionales: [], implicaValsalva: true },
  parametros: {},
};

// Caso 6 — R-007: fase de rehab completada por tiempo sin confirmación profesional → bloqueo de avance
const caso6: ContextoEvaluacion = {
  usuario: usuarioBase,
  ejercicio: { id: "ex6", patronMovimiento: "empuje_horizontal", equipamientoRequerido: [], nivelDificultad: "intermedio", contraindicaciones: [], tagsAdicionales: [] },
  parametros: {},
  rehabCheckpoint: { faseActualCompletadaPorTiempo: true, confirmadaPorProfesional: false },
};

console.log("Caso 1 (esperado: R-001 bloqueo):", evaluarReglas(caso1).map((r) => r.id));
console.log("Caso 2 (esperado: R-026 bloqueo_generador):", evaluarReglas(caso2).map((r) => r.id));
console.log("Caso 3 (esperado: [] sin reglas):", evaluarReglas(caso3).map((r) => r.id));
console.log("Caso 4 (esperado: R-014 alerta_fuerte):", evaluarReglas(caso4).map((r) => r.id));
console.log("Caso 5 (esperado: R-020 alerta_fuerte):", evaluarReglas(caso5).map((r) => r.id));
console.log("Caso 6 (esperado: R-007 bloqueo_avance_fase):", evaluarReglas(caso6).map((r) => r.id));
