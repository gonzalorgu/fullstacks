import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

// ✅ Importa todos tus módulos
import { DressModule } from "./dress/dress.module";
import { RentalModule } from "./rental/rental.module";
import { PaymentModule } from "./payment/payment.module";
import { CustomerModule } from "./customer/customer.module";
import { ReservationModule } from "./reservation/reservation.module";
import { CatalogModule } from "./catalog/catalog.module";
import { DressImageModule } from "./dress-image/dress-image.module";
import { UploadModule } from "./upload/upload.module";
import { AuthModule } from "./auth/auth.module";
import { ReportsModule } from "./reports/reports.module";
import { TransactionsModule } from "./transactions/transactions.module";
import { MaintenanceModule } from "./Maintenance/maintenance.module";

@Module({
  imports: [
    ConfigModule.forRoot(),

    // ✅ CONFIGURACIÓN OPTIMIZADA PARA IMÁGENES
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads"),
      serveRoot: "/uploads",
      exclude: ["/api/*"],
      serveStaticOptions: {
        maxAge: "1d",
        cacheControl: true,
        etag: false,
        lastModified: true,
        setHeaders: (res, path) => {
          // ✅ Headers para evitar carga progresiva
          res.set("Cache-Control", "public, max-age=86400, immutable");
          res.set("Accept-Ranges", "bytes");

          if (path.endsWith(".jpg") || path.endsWith(".jpeg")) {
            res.set("Content-Type", "image/jpeg");
            res.set("X-Content-Type-Options", "nosniff");
          } else if (path.endsWith(".png")) {
            res.set("Content-Type", "image/png");
          }
        },
      },
    }),

    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? "5432"),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),

    // ✅ Todos tus módulos (SIN DUPLICADOS)
    AuthModule,
    MaintenanceModule,
    TransactionsModule,
    ReportsModule,
    RentalModule,
    DressModule,
    PaymentModule,
    CustomerModule,
    ReservationModule,
    CatalogModule,
    DressImageModule,
    UploadModule,
  ],
})
export class AppModule {}
