import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✨ Configuración de validación mejorada
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remueve campos no declarados en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay campos extra
      transform: true, // Transforma automáticamente tipos
    }),
  );

  // ✨ CORS mejorado
  app.enableCors({
    origin: "http://localhost:4200",
    credentials: true, // Permite cookies/JWT
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Accept, Authorization",
  });

  await app.listen(3000);
  console.log("🚀 ErmaZafe Backend running on http://localhost:3000");
}

bootstrap().catch((err) => console.error(err));
