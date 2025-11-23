import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserModel } from "./models/user";
import { gameModel } from "./models/game";
import { guideModel } from "./models/guide";
import { postModel } from "./models/post";
import config from "./utils/config";

const seedDatabase = async () => {
  try {
    // Conectar a la base de datos
    const uri = config.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI no está definido");
    }

    await mongoose.connect(uri, { dbName: config.MONGODB_DBNAME });
    console.log("✅ Conectado a MongoDB");

    // Limpiar la base de datos
    await UserModel.deleteMany({});
    await gameModel.deleteMany({});
    await guideModel.deleteMany({});
    await postModel.deleteMany({});
    console.log("🧹 Base de datos limpiada");

    // Crear usuarios
    const passwordHash = await bcrypt.hash("password123", 10);
    
    const users = await UserModel.insertMany([
      {
        username: "gamer_pro",
        email: "gamer@example.com",
        passwordHash,
        posts: [],
        guides: [],
      },
      {
        username: "strategy_master",
        email: "strategy@example.com",
        passwordHash,
        posts: [],
        guides: [],
      },
      {
        username: "casual_player",
        email: "casual@example.com",
        passwordHash,
        posts: [],
        guides: [],
      },
    ]);
    console.log("👥 Usuarios creados:", users.length);

    // Crear juegos
    const games = await gameModel.insertMany([
      {
        name: "The Legend of Zelda: Breath of the Wild",
        genre: "Action-Adventure",
        platform: "Nintendo Switch",
        description: "Explora un vasto mundo abierto lleno de aventuras, puzzles y combates épicos.",
        guides: [],
        image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800",
      },
      {
        name: "Elden Ring",
        genre: "Action RPG",
        platform: "Multi-platform",
        description: "Un desafiante juego de rol de acción en un mundo oscuro y épico.",
        guides: [],
        image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800",
      },
      {
        name: "Stardew Valley",
        genre: "Simulation",
        platform: "Multi-platform",
        description: "Construye la granja de tus sueños y conecta con los habitantes del pueblo.",
        guides: [],
        image: "https://images.unsplash.com/photo-1625805866449-3589fe3f71a3?w=800",
      },
      {
        name: "Hollow Knight",
        genre: "Metroidvania",
        platform: "Multi-platform",
        description: "Explora un reino insectil subterráneo lleno de secretos y desafíos.",
        guides: [],
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
      },
      {
        name: "Minecraft",
        genre: "Sandbox",
        platform: "Multi-platform",
        description: "Construye, explora y sobrevive en un mundo infinito de bloques.",
        image: "https://images.unsplash.com/photo-1587731556938-38755b4803a6?w=800",
        guides: [],
      },
    ]);
    console.log("🎮 Juegos creados:", games.length);

    // Crear guías CON el campo game
    const guides = await guideModel.insertMany([
      {
        tags: "beginner,combat,tips",
        title: "Guía para principiantes - Zelda BOTW",
        content: `# Bienvenido a Hyrule

Esta guía te ayudará a comenzar tu aventura en Breath of the Wild.

## Primeros pasos
1. Completa el tutorial en la Gran Meseta
2. Consigue la paravela
3. Explora las torres para revelar el mapa

## Consejos de combate
- Aprende a hacer parrys perfectos
- Usa el arco para enemigos a distancia
- Cocina comida antes de peleas difíciles`,
        author: users[0]._id,
        game: games[0]._id, // ✅ Agregar referencia al juego
      },
      {
        tags: "boss,strategy,advanced",
        title: "Cómo derrotar a Margit - Elden Ring",
        content: `# Estrategia para Margit el Caído

Margit es el primer jefe principal y puede ser muy desafiante.

## Preparación
- Nivel recomendado: 20+
- Invoca al hechicero Rogier para ayuda
- Equipa un escudo con buen bloqueo físico

## Fase 1
- Mantén distancia media
- Ataca después de sus combos largos
- Cuidado con su bastón brillante

## Fase 2
- Aparecen ataques con martillo y dagas
- Más agresivo, busca aperturas cortas
- Usa la invocación para distraerlo`,
        author: users[1]._id,
        game: games[1]._id, // ✅ Agregar referencia al juego
      },
      {
        tags: "farming,money,crops",
        title: "Maximiza tus ganancias - Stardew Valley",
        content: `# Guía de agricultura rentable

Aprende a maximizar tus ganancias en la granja.

## Cultivos más rentables por temporada

**Primavera:** Fresas (compra en el festival)
**Verano:** Arándanos y melones
**Otoño:** Arándanos rojos y calabazas

## Tips adicionales
- Invierte en aspersores de calidad
- Procesa productos en conservas
- Cría animales para productos constantes`,
        author: users[0]._id,
        game: games[2]._id, // ✅ Agregar referencia al juego
      },
      {
        tags: "exploration,secrets,collectibles",
        title: "Secretos ocultos - Hollow Knight",
        content: `# Secretos de Hallownest

Descubre áreas ocultas y coleccionables secretos.

## Áreas secretas principales
1. **Ciudad de las Lágrimas** - Pasaje detrás de la estación
2. **Jardines de la Reina** - Requiere mantis claw
3. **El Abismo** - Área final del juego

## Coleccionables importantes
- Fragmentos de máscara: Aumentan tu vida
- Recipientes de alma: Más energía para hechizos
- Amuletos: Mejoras pasivas únicas`,
        author: users[1]._id,
        game: games[3]._id, // ✅ Agregar referencia al juego
      },
      {
        tags: "redstone,automation,tutorial",
        title: "Introducción a Redstone - Minecraft",
        content: `# Redstone para principiantes

Aprende los fundamentos de la redstone.

## Componentes básicos
- **Polvo de redstone:** Transmite señal
- **Antorcha de redstone:** Invierte señales
- **Repetidor:** Extiende y retrasa señales
- **Comparador:** Compara señales

## Proyectos simples
1. Puerta automática con placas de presión
2. Sistema de iluminación con palancas
3. Granja automática básica`,
        author: users[2]._id,
        game: games[4]._id, // ✅ Agregar referencia al juego
      },
    ]);
    console.log("📚 Guías creadas:", guides.length);

    // Crear posts (comentarios en guías)
    const posts = await postModel.insertMany([
      {
        content: "¡Acabo de terminar Elden Ring! Qué experiencia tan increíble. Los jefes finales son épicos 🔥",
        author: users[1]._id,
        guide: guides[1]._id, // Comentario en la guía de Margit
      },
      {
        content: "Excelente guía! Los aspersores de calidad realmente cambian el juego 👍",
        author: users[2]._id,
        guide: guides[2]._id, // Comentario en la guía de Stardew Valley
      },
      {
        content: "Gracias por los consejos de combate. El parry me salvó muchas veces 🛡️",
        author: users[0]._id,
        guide: guides[0]._id, // Comentario en la guía de Zelda
      },
      {
        content: "No encuentro el pasaje detrás de la estación. ¿Alguien puede ser más específico?",
        author: users[1]._id,
        guide: guides[3]._id, // Comentario en la guía de Hollow Knight
      },
      {
        content: "Perfecto para empezar con redstone. ¿Harás una guía avanzada? 🔴",
        author: users[0]._id,
        guide: guides[4]._id, // Comentario en la guía de Minecraft
      },
    ]);
    console.log("💬 Posts creados:", posts.length);

    // Actualizar relaciones: Asignar guías a juegos
    await gameModel.findByIdAndUpdate(games[0]._id, {
      $push: { guides: guides[0]._id },
    });
    await gameModel.findByIdAndUpdate(games[1]._id, {
      $push: { guides: guides[1]._id },
    });
    await gameModel.findByIdAndUpdate(games[2]._id, {
      $push: { guides: guides[2]._id },
    });
    await gameModel.findByIdAndUpdate(games[3]._id, {
      $push: { guides: guides[3]._id },
    });
    await gameModel.findByIdAndUpdate(games[4]._id, {
      $push: { guides: guides[4]._id },
    });

    // Actualizar relaciones: Asignar posts y guías a usuarios
    await UserModel.findByIdAndUpdate(users[0]._id, {
      $push: { 
        posts: { $each: [posts[2]._id, posts[4]._id] },
        guides: { $each: [guides[0]._id, guides[2]._id] }
      },
    });
    await UserModel.findByIdAndUpdate(users[1]._id, {
      $push: { 
        posts: { $each: [posts[0]._id, posts[3]._id] },
        guides: { $each: [guides[1]._id, guides[3]._id] }
      },
    });
    await UserModel.findByIdAndUpdate(users[2]._id, {
      $push: { 
        posts: posts[1]._id,
        guides: guides[4]._id
      },
    });

    console.log("🔗 Relaciones actualizadas");
    console.log("\n✨ Seed completado exitosamente!\n");
    console.log("📊 Resumen:");
    console.log(`   - ${users.length} usuarios`);
    console.log(`   - ${games.length} juegos`);
    console.log(`   - ${guides.length} guías`);
    console.log(`   - ${posts.length} posts`);
    console.log("\n🔑 Credenciales de prueba:");
    console.log("   Username: gamer_pro / strategy_master / casual_player");
    console.log("   Password: password123");

  } catch (error) {
    console.error("❌ Error en el seed:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n👋 Desconectado de MongoDB");
  }
};

// Ejecutar el seed
seedDatabase();