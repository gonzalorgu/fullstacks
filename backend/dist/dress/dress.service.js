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
var DressService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DressService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const dress_entity_1 = require("./entities/dress.entity");
let DressService = DressService_1 = class DressService {
    dressRepository;
    logger = new common_1.Logger(DressService_1.name);
    constructor(dressRepository) {
        this.dressRepository = dressRepository;
    }
    async create(createDressDto) {
        this.logger.log("📥 Creando vestido:", createDressDto);
        const dress = this.dressRepository.create({
            ...createDressDto,
            size: Array.isArray(createDressDto.size)
                ? createDressDto.size
                : createDressDto.size
                    ? [createDressDto.size]
                    : [],
            colors: Array.isArray(createDressDto.colors)
                ? createDressDto.colors
                : createDressDto.colors
                    ? [createDressDto.colors]
                    : createDressDto.color
                        ? [createDressDto.color]
                        : [],
            quantity: createDressDto.quantity || 1,
            isActive: (createDressDto.quantity || 1) > 0,
        });
        const saved = await this.dressRepository.save(dress);
        this.logger.log(`✅ Vestido creado: ${saved.name} con stock: ${saved.quantity}`);
        if (saved.quantity <= 1) {
            this.logger.warn(`⚠️ ALERTA: Vestido "${saved.name}" (ID: ${saved.id}) tiene stock BAJO: ${saved.quantity}`);
        }
        return saved;
    }
    async findAll() {
        return await this.dressRepository.find({
            relations: ["images", "catalog"],
            order: { quantity: "ASC" },
        });
    }
    async findAllActive() {
        this.logger.log("🌐 Obteniendo vestidos activos para catálogo web");
        return await this.dressRepository.find({
            where: { isActive: true },
            relations: ["images", "catalog"],
            order: { created_at: "DESC" },
        });
    }
    async findLowStock(threshold = 1) {
        this.logger.log(`⚠️ Buscando vestidos con stock <= ${threshold}`);
        const lowStock = await this.dressRepository.find({
            where: {
                quantity: (0, typeorm_2.LessThanOrEqual)(threshold),
            },
            relations: ["images", "catalog"],
            order: { quantity: "ASC" },
        });
        this.logger.warn(`⚠️ ENCONTRADOS ${lowStock.length} vestidos con stock bajo:`);
        lowStock.forEach((dress) => {
            this.logger.warn(`   - ${dress.name} (ID: ${dress.id}): ${dress.quantity} unidades, Activo: ${dress.isActive}`);
        });
        return lowStock;
    }
    async findOne(id) {
        const dress = await this.dressRepository.findOne({
            where: { id },
            relations: ["images", "catalog"],
        });
        if (!dress) {
            throw new common_1.NotFoundException(`Vestido con ID ${id} no encontrado`);
        }
        return dress;
    }
    async update(id, updateDressDto) {
        this.logger.log(`📝 Actualizando vestido ID ${id}:`, updateDressDto);
        const dress = await this.findOne(id);
        const updateData = {
            ...updateDressDto,
        };
        if (updateDressDto.size) {
            updateData.size = Array.isArray(updateDressDto.size)
                ? updateDressDto.size
                : [updateDressDto.size];
        }
        if (updateDressDto.colors) {
            updateData.colors = Array.isArray(updateDressDto.colors)
                ? updateDressDto.colors
                : [updateDressDto.colors];
        }
        else if (updateDressDto.color) {
            updateData.colors = [updateDressDto.color];
        }
        if (updateDressDto.quantity !== undefined) {
            updateData.quantity = updateDressDto.quantity;
            updateData.isActive = updateDressDto.quantity > 0;
            this.logger.log(`📦 Nuevo stock: ${updateData.quantity}, Activo: ${updateData.isActive}`);
            if (updateData.quantity <= 1) {
                this.logger.warn(`⚠️ ALERTA: "${dress.name}" (ID: ${id}) ahora tiene stock BAJO: ${updateData.quantity}`);
            }
            if (!updateData.isActive) {
                this.logger.error(`❌ DESACTIVADO: "${dress.name}" (ID: ${id}) sin stock disponible`);
            }
        }
        await this.dressRepository.update(id, updateData);
        return this.findOne(id);
    }
    async decreaseStock(id, amount = 1) {
        this.logger.log(`📉 Reduciendo stock de vestido ID ${id} en ${amount}`);
        const dress = await this.findOne(id);
        if (dress.quantity < amount) {
            throw new Error(`Stock insuficiente. Disponible: ${dress.quantity}, Solicitado: ${amount}`);
        }
        const newQuantity = dress.quantity - amount;
        const isActive = newQuantity > 0;
        await this.dressRepository.update(id, {
            quantity: newQuantity,
            isActive: isActive,
        });
        this.logger.log(`✅ Stock actualizado: ${dress.quantity} → ${newQuantity}, Activo: ${isActive}`);
        if (newQuantity <= 1 && newQuantity > 0) {
            this.logger.warn(`⚠️ ALERTA: "${dress.name}" (ID: ${id}) tiene ÚLTIMO VESTIDO disponible`);
        }
        if (newQuantity === 0) {
            this.logger.error(`❌ SIN STOCK: "${dress.name}" (ID: ${id}) - DESACTIVADO AUTOMÁTICAMENTE`);
        }
        return this.findOne(id);
    }
    async increaseStock(id, amount = 1) {
        this.logger.log(`📈 Aumentando stock de vestido ID ${id} en ${amount}`);
        const dress = await this.findOne(id);
        const newQuantity = dress.quantity + amount;
        const wasInactive = !dress.isActive;
        await this.dressRepository.update(id, {
            quantity: newQuantity,
            isActive: true,
        });
        this.logger.log(`✅ Stock actualizado: ${dress.quantity} → ${newQuantity}, Activo: true`);
        if (wasInactive) {
            this.logger.log(`🔄 REACTIVADO: "${dress.name}" (ID: ${id}) - Ahora disponible en catálogo`);
        }
        return this.findOne(id);
    }
    async remove(id) {
        const dress = await this.findOne(id);
        await this.dressRepository.delete(id);
        this.logger.log(`🗑️ Vestido eliminado: ${dress.name} (ID: ${id})`);
        return { deleted: true, dress };
    }
};
exports.DressService = DressService;
exports.DressService = DressService = DressService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(dress_entity_1.Dress)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DressService);
//# sourceMappingURL=dress.service.js.map