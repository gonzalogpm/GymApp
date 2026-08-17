-- CreateTable
CREATE TABLE "ejercicios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombreEs" TEXT NOT NULL,
    "nombreEn" TEXT,
    "patronMovimiento" TEXT NOT NULL,
    "grupoMuscularAgonista" TEXT NOT NULL,
    "grupoMuscularAntagonista" TEXT NOT NULL,
    "musculosSecundarios" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "equipamientoRequerido" TEXT NOT NULL,
    "nivelDificultad" TEXT NOT NULL,
    "contraindicaciones" TEXT NOT NULL,
    "deportesRelevantes" TEXT NOT NULL,
    "objetivoCorrectivo" TEXT,
    "variantePrevioId" TEXT,
    "varianteSiguienteId" TEXT,
    "instruccionesEs" TEXT NOT NULL,
    "instruccionesEn" TEXT,
    "gifUrl" TEXT,
    "videoUrl" TEXT,
    "mediaStatus" TEXT NOT NULL DEFAULT 'pendiente',
    "tagsAdicionales" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "metodos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombreEs" TEXT NOT NULL,
    "nombreEn" TEXT,
    "tipo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "parametrosConfigurables" TEXT NOT NULL,
    "nivelMinimo" TEXT NOT NULL,
    "contraindicadoSi" TEXT NOT NULL,
    "frecuenciaMaximaSemanal" INTEGER,
    "patronesMovimiento" TEXT NOT NULL,
    "tipoEjercicio" TEXT NOT NULL,
    "seccionReferencia" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "plantillas_deporte" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombreEs" TEXT NOT NULL,
    "nombreEn" TEXT,
    "patronDominante" TEXT NOT NULL,
    "demandasEnergeticas" TEXT NOT NULL,
    "patronEsfuerzo" TEXT NOT NULL,
    "bloques" TEXT NOT NULL,
    "zonasLesionTipicas" TEXT NOT NULL,
    "seccionReferencia" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "edad" INTEGER,
    "sexoBiologico" TEXT,
    "pesoKg" REAL,
    "alturaCm" REAL,
    "experiencia" TEXT NOT NULL DEFAULT 'principiante',
    "objetivoPrincipal" TEXT,
    "diasSemanaDisponibles" INTEGER,
    "minutosSesionDisponibles" INTEGER,
    "equipamientoDisponible" TEXT NOT NULL,
    "deporte" TEXT,
    "condicionesEspeciales" TEXT NOT NULL,
    "historialLesiones" TEXT NOT NULL,
    "alteracionesPosturales" TEXT NOT NULL,
    "franjaEtaria" TEXT NOT NULL DEFAULT 'adulto',
    "consentimientoAdultoConfirmado" BOOLEAN NOT NULL DEFAULT false,
    "consentimientoAdultoFecha" DATETIME,
    "estadoGestacional" TEXT NOT NULL DEFAULT 'no_aplica',
    "semanaGestacionOPosparto" INTEGER,
    "autorizacionMedicaConfirmada" BOOLEAN NOT NULL DEFAULT false,
    "autorizacionMedicaFecha" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "rutinas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "objetivo" TEXT NOT NULL,
    "split" TEXT NOT NULL,
    "diasPorSemana" INTEGER NOT NULL,
    "modeloPeriodizacion" TEXT NOT NULL,
    "faseMesociclo" TEXT NOT NULL,
    "semanaActualMesociclo" INTEGER NOT NULL DEFAULT 1,
    "fechaInicio" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "auditoriaGeneracion" TEXT,
    CONSTRAINT "rutinas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "rutina_ejercicios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rutinaId" TEXT NOT NULL,
    "ejercicioId" TEXT NOT NULL,
    "dia" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL,
    "series" INTEGER NOT NULL,
    "repsObjetivo" TEXT NOT NULL,
    "intensidad" TEXT,
    "tempo" TEXT,
    "descansoSeg" INTEGER,
    "metodoAplicadoId" TEXT,
    CONSTRAINT "rutina_ejercicios_rutinaId_fkey" FOREIGN KEY ("rutinaId") REFERENCES "rutinas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "rutina_ejercicios_ejercicioId_fkey" FOREIGN KEY ("ejercicioId") REFERENCES "ejercicios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "rutina_ejercicios_metodoAplicadoId_fkey" FOREIGN KEY ("metodoAplicadoId") REFERENCES "metodos" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sesiones" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rutinaId" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diaDeRutina" INTEGER NOT NULL,
    "checkInPreSesion" TEXT,
    "zonaMolestiaPuntual" TEXT,
    "ajusteAutomaticoAplicado" TEXT,
    "completada" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "sesiones_rutinaId_fkey" FOREIGN KEY ("rutinaId") REFERENCES "rutinas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "registros_carga" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sesionId" TEXT NOT NULL,
    "ejercicioId" TEXT NOT NULL,
    "serieNumero" INTEGER NOT NULL,
    "cargaKg" REAL NOT NULL,
    "repsRealizadas" INTEGER NOT NULL,
    "rirReportado" INTEGER,
    "metodoAplicadoId" TEXT,
    CONSTRAINT "registros_carga_sesionId_fkey" FOREIGN KEY ("sesionId") REFERENCES "sesiones" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "registros_carga_ejercicioId_fkey" FOREIGN KEY ("ejercicioId") REFERENCES "ejercicios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "registros_molestia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sesionId" TEXT NOT NULL,
    "ejercicioId" TEXT NOT NULL,
    "serieNumero" INTEGER,
    "tipo" TEXT NOT NULL,
    "zonaCorporal" TEXT NOT NULL,
    "intensidad" INTEGER NOT NULL,
    "continuoOPuntual" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "registros_molestia_sesionId_fkey" FOREIGN KEY ("sesionId") REFERENCES "sesiones" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "registros_molestia_ejercicioId_fkey" FOREIGN KEY ("ejercicioId") REFERENCES "ejercicios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tests_fuerza" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "ejercicioId" TEXT NOT NULL,
    "tipoTest" TEXT NOT NULL,
    "valorResultado" REAL NOT NULL,
    "formulaUsada" TEXT,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tests_fuerza_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tests_fuerza_ejercicioId_fkey" FOREIGN KEY ("ejercicioId") REFERENCES "ejercicios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "rehab_checkpoints" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "lesion" TEXT NOT NULL,
    "faseActual" INTEGER NOT NULL,
    "faseConfirmadaHasta" INTEGER NOT NULL DEFAULT 0,
    "confirmadoPor" TEXT,
    "fechaConfirmacion" DATETIME,
    "bloqueado" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "rehab_checkpoints_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
