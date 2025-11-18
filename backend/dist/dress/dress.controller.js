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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DressController = void 0;
const common_1 = require("@nestjs/common");
const dress_service_1 = require("./dress.service");
const create_dress_dto_1 = require("./dto/create-dress.dto");
const update_dress_dto_1 = require("./dto/update-dress.dto");
let DressController = class DressController {
    dressService;
    constructor(dressService) {
        this.dressService = dressService;
    }
    create(createDressDto) {
        return this.dressService.create(createDressDto);
    }
    findAll() {
        return this.dressService.findAll();
    }
    findAllActive() {
        return this.dressService.findAllActive();
    }
    findLowStock(threshold) {
        const limit = threshold ? parseInt(threshold, 10) : 1;
        return this.dressService.findLowStock(limit);
    }
    findOne(id) {
        return this.dressService.findOne(+id);
    }
    update(id, updateDressDto) {
        return this.dressService.update(+id, updateDressDto);
    }
    decreaseStock(id, amount = 1) {
        return this.dressService.decreaseStock(+id, amount);
    }
    increaseStock(id, amount = 1) {
        return this.dressService.increaseStock(+id, amount);
    }
    remove(id) {
        return this.dressService.remove(+id);
    }
};
exports.DressController = DressController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dress_dto_1.CreateDressDto]),
    __metadata("design:returntype", void 0)
], DressController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DressController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("active"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DressController.prototype, "findAllActive", null);
__decorate([
    (0, common_1.Get)("low-stock"),
    __param(0, (0, common_1.Query)("threshold")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DressController.prototype, "findLowStock", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DressController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_dress_dto_1.UpdateDressDto]),
    __metadata("design:returntype", void 0)
], DressController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(":id/decrease-stock"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("amount")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], DressController.prototype, "decreaseStock", null);
__decorate([
    (0, common_1.Patch)(":id/increase-stock"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("amount")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], DressController.prototype, "increaseStock", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DressController.prototype, "remove", null);
exports.DressController = DressController = __decorate([
    (0, common_1.Controller)("dress"),
    __metadata("design:paramtypes", [dress_service_1.DressService])
], DressController);
//# sourceMappingURL=dress.controller.js.map