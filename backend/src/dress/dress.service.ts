import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThanOrEqual } from "typeorm";
import { CreateDressDto } from "./dto/create-dress.dto";
import { UpdateDressDto } from "./dto/update-dress.dto";
import { Dress } from "./entities/dress.entity";

@Injectable()
export class DressService {
  private readonly logger = new Logger(DressService.name);

  constructor(
    @InjectRepository(Dress)
    private dressRepository: Repository<Dress>,
  ) {}

  async create(createDressDto: CreateDressDto) {
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
    this.logger.log(
      `✅ Vestido creado: ${saved.name} con stock: ${saved.quantity}`,
    );

    if (saved.quantity <= 1) {
      this.logger.warn(
        `⚠️ ALERTA: Vestido "${saved.name}" (ID: ${saved.id}) tiene stock BAJO: ${saved.quantity}`,
      );
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

  async findLowStock(threshold: number = 1) {
    this.logger.log(`⚠️ Buscando vestidos con stock <= ${threshold}`);

    const lowStock = await this.dressRepository.find({
      where: {
        quantity: LessThanOrEqual(threshold),
      },
      relations: ["images", "catalog"],
      order: { quantity: "ASC" },
    });

    this.logger.warn(
      `⚠️ ENCONTRADOS ${lowStock.length} vestidos con stock bajo:`,
    );

    lowStock.forEach((dress) => {
      this.logger.warn(
        `   - ${dress.name} (ID: ${dress.id}): ${dress.quantity} unidades, Activo: ${dress.isActive}`,
      );
    });

    return lowStock;
  }

  async findOne(id: number) {
    const dress = await this.dressRepository.findOne({
      where: { id },
      relations: ["images", "catalog"],
    });

    if (!dress) {
      throw new NotFoundException(`Vestido con ID ${id} no encontrado`);
    }

    return dress;
  }

  async update(id: number, updateDressDto: UpdateDressDto) {
    this.logger.log(`📝 Actualizando vestido ID ${id}:`, updateDressDto);

    const dress = await this.findOne(id);

    // ✅ Tipo correcto: Partial<Dress> en lugar de any
    const updateData: Partial<Dress> = {
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
    } else if (updateDressDto.color) {
      updateData.colors = [updateDressDto.color];
    }

    if (updateDressDto.quantity !== undefined) {
      updateData.quantity = updateDressDto.quantity;
      updateData.isActive = updateDressDto.quantity > 0;

      this.logger.log(
        `📦 Nuevo stock: ${updateData.quantity}, Activo: ${updateData.isActive}`,
      );

      if (updateData.quantity <= 1) {
        this.logger.warn(
          `⚠️ ALERTA: "${dress.name}" (ID: ${id}) ahora tiene stock BAJO: ${updateData.quantity}`,
        );
      }

      if (!updateData.isActive) {
        this.logger.error(
          `❌ DESACTIVADO: "${dress.name}" (ID: ${id}) sin stock disponible`,
        );
      }
    }

    await this.dressRepository.update(id, updateData);
    return this.findOne(id);
  }

  async decreaseStock(id: number, amount: number = 1) {
    this.logger.log(`📉 Reduciendo stock de vestido ID ${id} en ${amount}`);

    const dress = await this.findOne(id);

    if (dress.quantity < amount) {
      throw new Error(
        `Stock insuficiente. Disponible: ${dress.quantity}, Solicitado: ${amount}`,
      );
    }

    const newQuantity = dress.quantity - amount;
    const isActive = newQuantity > 0;

    await this.dressRepository.update(id, {
      quantity: newQuantity,
      isActive: isActive,
    });

    this.logger.log(
      `✅ Stock actualizado: ${dress.quantity} → ${newQuantity}, Activo: ${isActive}`,
    );

    if (newQuantity <= 1 && newQuantity > 0) {
      this.logger.warn(
        `⚠️ ALERTA: "${dress.name}" (ID: ${id}) tiene ÚLTIMO VESTIDO disponible`,
      );
    }

    if (newQuantity === 0) {
      this.logger.error(
        `❌ SIN STOCK: "${dress.name}" (ID: ${id}) - DESACTIVADO AUTOMÁTICAMENTE`,
      );
    }

    return this.findOne(id);
  }

  async increaseStock(id: number, amount: number = 1) {
    this.logger.log(`📈 Aumentando stock de vestido ID ${id} en ${amount}`);

    const dress = await this.findOne(id);
    const newQuantity = dress.quantity + amount;
    const wasInactive = !dress.isActive;

    await this.dressRepository.update(id, {
      quantity: newQuantity,
      isActive: true,
    });

    this.logger.log(
      `✅ Stock actualizado: ${dress.quantity} → ${newQuantity}, Activo: true`,
    );

    if (wasInactive) {
      this.logger.log(
        `🔄 REACTIVADO: "${dress.name}" (ID: ${id}) - Ahora disponible en catálogo`,
      );
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    const dress = await this.findOne(id);
    await this.dressRepository.delete(id);
    this.logger.log(`🗑️ Vestido eliminado: ${dress.name} (ID: ${id})`);
    return { deleted: true, dress };
  }
}
