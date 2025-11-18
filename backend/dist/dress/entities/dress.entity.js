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
exports.Dress = void 0;
const typeorm_1 = require("typeorm");
const catalog_entity_1 = require("../../catalog/entities/catalog.entity");
const dress_image_entity_1 = require("../../dress-image/entities/dress-image.entity");
let Dress = class Dress {
    id;
    name;
    size;
    color;
    colors;
    status;
    rental_price;
    imagen;
    description;
    quantity;
    isActive;
    catalog;
    catalog_id;
    created_at;
    update_at;
    images;
};
exports.Dress = Dress;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Dress.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], Dress.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", array: true, default: "{}", nullable: true }),
    __metadata("design:type", Array)
], Dress.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], Dress.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "text",
        array: true,
        default: "{}",
        nullable: true,
    }),
    __metadata("design:type", Array)
], Dress.prototype, "colors", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, default: "available" }),
    __metadata("design:type", String)
], Dress.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Dress.prototype, "rental_price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Dress.prototype, "imagen", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Dress.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "integer", default: 1 }),
    __metadata("design:type", Number)
], Dress.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], Dress.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => catalog_entity_1.Catalog, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "catalog_id" }),
    __metadata("design:type", catalog_entity_1.Catalog)
], Dress.prototype, "catalog", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Dress.prototype, "catalog_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Dress.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Dress.prototype, "update_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => dress_image_entity_1.DressImage, (image) => image.dress),
    __metadata("design:type", Array)
], Dress.prototype, "images", void 0);
exports.Dress = Dress = __decorate([
    (0, typeorm_1.Entity)("Dress")
], Dress);
//# sourceMappingURL=dress.entity.js.map