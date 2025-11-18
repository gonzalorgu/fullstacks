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
exports.DressImageController = void 0;
const common_1 = require("@nestjs/common");
const dress_image_service_1 = require("./dress-image.service");
const create_dress_image_dto_1 = require("./dto/create-dress-image.dto");
const update_dress_image_dto_1 = require("./dto/update-dress-image.dto");
let DressImageController = class DressImageController {
    dressImageService;
    constructor(dressImageService) {
        this.dressImageService = dressImageService;
    }
    create(createDressImageDto) {
        return this.dressImageService.create(createDressImageDto);
    }
    findAll() {
        return this.dressImageService.findAll();
    }
    findOne(id) {
        return this.dressImageService.findOne(+id);
    }
    update(id, updateDressImageDto) {
        return this.dressImageService.update(+id, updateDressImageDto);
    }
    remove(id) {
        return this.dressImageService.remove(+id);
    }
};
exports.DressImageController = DressImageController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dress_image_dto_1.CreateDressImageDto]),
    __metadata("design:returntype", void 0)
], DressImageController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DressImageController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DressImageController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_dress_image_dto_1.UpdateDressImageDto]),
    __metadata("design:returntype", void 0)
], DressImageController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DressImageController.prototype, "remove", null);
exports.DressImageController = DressImageController = __decorate([
    (0, common_1.Controller)("dress-image"),
    __metadata("design:paramtypes", [dress_image_service_1.DressImageService])
], DressImageController);
//# sourceMappingURL=dress-image.controller.js.map