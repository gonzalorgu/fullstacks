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
exports.DressImage = void 0;
const typeorm_1 = require("typeorm");
const dress_entity_1 = require("../../dress/entities/dress.entity");
let DressImage = class DressImage {
    id;
    dress;
    dress_id;
    image_url;
    is_main;
    uploaded_at;
};
exports.DressImage = DressImage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DressImage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dress_entity_1.Dress, (dress) => dress.images),
    (0, typeorm_1.JoinColumn)({ name: "dress_id" }),
    __metadata("design:type", dress_entity_1.Dress)
], DressImage.prototype, "dress", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DressImage.prototype, "dress_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 500 }),
    __metadata("design:type", String)
], DressImage.prototype, "image_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], DressImage.prototype, "is_main", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DressImage.prototype, "uploaded_at", void 0);
exports.DressImage = DressImage = __decorate([
    (0, typeorm_1.Entity)("DressImage")
], DressImage);
//# sourceMappingURL=dress-image.entity.js.map