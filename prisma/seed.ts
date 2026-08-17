import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";
import ejercicios from "../data/ejercicios-seed.json";

const adapter = new PrismaBetterSQLite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(`Insertando ${ejercicios.length} ejercicios...`);

  for (const ej of ejercicios) {
    await prisma.ejercicio.upsert({
      where: { id: ej.id },
      update: {},
      create: {
        id: ej.id,
        nombreEs: ej.nombreEs,
        nombreEn: ej.nombreEn,
        patronMovimiento: ej.patronMovimiento,
        grupoMuscularAgonista: ej.grupoMuscularAgonista,
        grupoMuscularAntagonista: ej.grupoMuscularAntagonista,
        musculosSecundarios: JSON.stringify(ej.musculosSecundarios),
        tipo: ej.tipo,
        equipamientoRequerido: JSON.stringify(ej.equipamientoRequerido),
        nivelDificultad: ej.nivelDificultad,
        contraindicaciones: JSON.stringify(ej.contraindicaciones),
        deportesRelevantes: JSON.stringify(ej.deportesRelevantes),
        objetivoCorrectivo: JSON.stringify(ej.objetivoCorrectivo),
        instruccionesEs: ej.instruccionesEs,
        instruccionesEn: ej.instruccionesEn,
        gifUrl: ej.gifUrl,
        videoUrl: ej.videoUrl,
        mediaStatus: ej.mediaStatus,
        tagsAdicionales: JSON.stringify(ej.tagsAdicionales),
      },
    });
  }

  console.log("Listo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
