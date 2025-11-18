"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const rental_service_1 = require("./rental.service");
const rental_controller_1 = require("./rental.controller");
const rental_entity_1 = require("./entities/rental.entity");
const user_entity_1 = require("../auth/entities/user.entity");
const dress_module_1 = require("../dress/dress.module");
const notifications_module_1 = require("../notifications/notifications.module");
let RentalModule = class RentalModule {
};
exports.RentalModule = RentalModule;
exports.RentalModule = RentalModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([rental_entity_1.Rental, user_entity_1.User]),
            dress_module_1.DressModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [rental_controller_1.RentalController],
        providers: [rental_service_1.RentalService],
        exports: [rental_service_1.RentalService],
    })
], RentalModule);
//# sourceMappingURL=rental.module.js.map