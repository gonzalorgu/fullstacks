"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const dress_module_1 = require("./dress/dress.module");
const rental_module_1 = require("./rental/rental.module");
const payment_module_1 = require("./payment/payment.module");
const customer_module_1 = require("./customer/customer.module");
const reservation_module_1 = require("./reservation/reservation.module");
const catalog_module_1 = require("./catalog/catalog.module");
const dress_image_module_1 = require("./dress-image/dress-image.module");
const upload_module_1 = require("./upload/upload.module");
const auth_module_1 = require("./auth/auth.module");
const reports_module_1 = require("./reports/reports.module");
const transactions_module_1 = require("./transactions/transactions.module");
const maintenance_module_1 = require("./Maintenance/maintenance.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, "..", "uploads"),
                serveRoot: "/uploads",
                exclude: ["/api/*"],
                serveStaticOptions: {
                    maxAge: "1d",
                    cacheControl: true,
                    etag: false,
                    lastModified: true,
                    setHeaders: (res, path) => {
                        res.set("Cache-Control", "public, max-age=86400, immutable");
                        res.set("Accept-Ranges", "bytes");
                        if (path.endsWith(".jpg") || path.endsWith(".jpeg")) {
                            res.set("Content-Type", "image/jpeg");
                            res.set("X-Content-Type-Options", "nosniff");
                        }
                        else if (path.endsWith(".png")) {
                            res.set("Content-Type", "image/png");
                        }
                    },
                },
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: "postgres",
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT ?? "5432"),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                entities: [__dirname + "/**/*.entity{.ts,.js}"],
                synchronize: true,
            }),
            auth_module_1.AuthModule,
            maintenance_module_1.MaintenanceModule,
            transactions_module_1.TransactionsModule,
            reports_module_1.ReportsModule,
            rental_module_1.RentalModule,
            dress_module_1.DressModule,
            payment_module_1.PaymentModule,
            customer_module_1.CustomerModule,
            reservation_module_1.ReservationModule,
            catalog_module_1.CatalogModule,
            dress_image_module_1.DressImageModule,
            upload_module_1.UploadModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map