// Tipos base — reflejan los esquemas de las secciones 22 y 24 del marco teórico.

export interface LesionUsuario {
  zona: string;
  tipo: string;
  fecha: string;
  estado: "activa" | "en_recuperacion" | "resuelta";
  faseRehabActual?: string | null;
  origen: "declarado_por_usuario" | "inferido_por_reportes_dolor";
}

export interface PerfilUsuario {
  id: string;
  nombre?: string;
  edad?: number;
  experiencia: "principiante" | "intermedio" | "avanzado";
  objetivoPrincipal?: string;
  diasPorSemana?: number;
  equipamientoDisponible: string[];
  condicionesEspeciales: string[];
  historialLesiones: LesionUsuario[];
  alteracionesPosturales: string[];
  franjaEtaria: "niño_preadolescente" | "adolescente" | "adulto";
  consentimientoAdultoConfirmado: boolean;
  estadoGestacional: "no_aplica" | "embarazada" | "posparto";
  semanaGestacionOPosparto?: number | null;
  autorizacionMedicaConfirmada: boolean;
  deporte?: string | null;
}

export interface EjercicioCandidato {
  id: string;
  patronMovimiento: string;
  equipamientoRequerido: string[];
  nivelDificultad: "principiante" | "intermedio" | "avanzado";
  tipo?: "multiarticular" | "monoarticular";
  grupoMuscularAgonista?: string;
  musculosSecundarios?: string[];
  contraindicaciones: { lesion: string; fase: string; severidad: "bloqueo" | "alerta" }[];
  tagsAdicionales: string[];
  implicaValsalva?: boolean;
  intensidadAltaConsecutiva?: boolean; // >80%1RM en días consecutivos (R-010)
}

export interface ParametrosSesion {
  intensidadPorcentaje1RM?: number;
  esTestDe1RMReal?: boolean;
  posicionSupinaProlongada?: boolean;
  metodoIntensificacionId?: string | null;
  horasDesdeUltimoEntrenoMismoGrupo?: number; // R-009
}

export interface ReporteMolestia {
  ejercicioId: string;
  tipo: "fatiga_muscular_normal" | "molestia_articular" | "dolor_agudo_punzante";
  zonaCorporal: string;
  intensidad: number; // 1-10
  countEnMesociclo: number;
}

export interface SenalRehabCheckpoint {
  faseActualCompletadaPorTiempo: boolean;
  confirmadaPorProfesional: boolean;
}

export interface ContextoEvaluacion {
  usuario: PerfilUsuario;
  ejercicio: EjercicioCandidato;
  parametros: ParametrosSesion;
  reporteMolestia?: ReporteMolestia;
  volumenSemanaGrupoMuscular?: number;
  ratioEmpujeTraccion?: number;
  rehabCheckpoint?: SenalRehabCheckpoint;
  rpeCrecienteDosSemanas?: boolean; // R-013
  diasDescansoUltimas2Semanas?: number; // R-014
  rutinaIncluyeCore?: boolean; // R-012
  sesionesFuerzaPorSemana?: number; // R-012
  volumenGluteoCoreSuficiente?: boolean; // R-023
}

export type TipoAccion =
  | "bloqueo"
  | "bloqueo_generador"
  | "bloqueo_avance_fase"
  | "alerta_fuerte"
  | "alerta_fuerte_inmediata"
  | "alerta_leve"
  | "sustitucion"
  | "sin_accion";

export interface ResultadoRegla {
  id: string;
  categoria: string;
  accionTipo: TipoAccion;
  sustituto: string | null;
  prioridad: "alta" | "media" | "baja";
  seccionReferencia: string;
}

export interface MetodoIntensificacion {
  id: string;
  nombre: string;
  descripcion: string;
  nivelMinimo: "principiante" | "intermedio" | "avanzado";
  frecuenciaMaximaSemanal: number;
  seccionReferencia: string;
}
