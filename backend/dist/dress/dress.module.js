"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DressModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const dress_service_1 = require("./dress.service");
const dress_controller_1 = require("./dress.controller");
const dress_entity_1 = require("./entities/dress.entity");
let DressModule = class DressModule {
};
exports.DressModule = DressModule;
exports.DressModule = DressModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([dress_entity_1.Dress])],
        controllers: [dress_controller_1.DressController],
        providers: [dress_service_1.DressService],
        exports: [dress_service_1.DressService],
    })
], DressModule);
//# sourceMappingURL=dress.module.js.map