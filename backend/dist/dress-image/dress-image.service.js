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
exports.DressImageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const dress_image_entity_1 = require("./entities/dress-image.entity");
let DressImageService = class DressImageService {
    dressImageRepository;
    constructor(dressImageRepository) {
        this.dressImageRepository = dressImageRepository;
    }
    create(createDressImageDto) {
        const dressImage = this.dressImageRepository.create(createDressImageDto);
        return this.dressImageRepository.save(dressImage);
    }
    findAll() {
        return this.dressImageRepository.find({ relations: ["dress"] });
    }
    findOne(id) {
        return this.dressImageRepository.findOne({
            where: { id },
            relations: ["dress"],
        });
    }
    async update(id, updateDressImageDto) {
        await this.dressImageRepository.update(id, updateDressImageDto);
        return this.findOne(id);
    }
    async remove(id) {
        await this.dressImageRepository.delete(id);
        return { deleted: true };
    }
};
exports.DressImageService = DressImageService;
exports.DressImageService = DressImageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(dress_image_entity_1.DressImage)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DressImageService);
//# sourceMappingURL=dress-image.service.js.map