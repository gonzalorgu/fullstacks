"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMaintenanceDto = void 0;
const class_validator_1 = require("class-validator");
class CreateMaintenanceDto {
    dressId;
    dressNombre;
    foto;
    tipo;
    estado;
    observaciones;
    costo;
    fechaInicio;
    fechaFin;
    cantidad;
}
exports.CreateMaintenanceDto = CreateMaintenanceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMaintenanceDto.prototype, "dressId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMaintenanceDto.prototype, "dressNombre", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMaintenanceDto.prototype, "foto", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(["lavado", "reparacion", "limpieza_profunda", "ajuste"]),
    __metadata("design:type", String)
], CreateMaintenanceDto.prototype, "tipo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(["pendiente", "en_proceso", "completado", "cancelado"]),
    __metadata("design:type", String)
], CreateMaintenanceDto.prototype, "estado", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMaintenanceDto.prototype, "observaciones", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMaintenanceDto.prototype, "costo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMaintenanceDto.prototype, "fechaInicio", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMaintenanceDto.prototype, "fechaFin", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMaintenanceDto.prototype, "cantidad", void 0);
//# sourceMappingURL=create-maintenance.dto.js.map