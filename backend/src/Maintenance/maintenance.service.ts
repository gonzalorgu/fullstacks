import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Maintenance } from "../Maintenance/maintenance.entity/maintenance.entity";
import { CreateMaintenanceDto } from "./dto/create-maintenance.dto";
import { DressService } from "../dress/dress.service";
import { NotificationsGateway } from "../notifications/notifications.gateway";

@Injectable()
export class MaintenanceService {
  private readonly logger = new Logger(MaintenanceService.name);

  constructor(
    @InjectRepository(Maintenance)
    private maintenanceRepository: Repository<Maintenance>,
    private readonly dressService: DressService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  // Crear mantenimiento y restar inventario
  async createMaintenance(
    userId: number,
    createMaintenanceDto: CreateMaintenanceDto,
  ): Promise<Maintenance> {
    const dress = await this.dressService.findOne(
      +createMaintenanceDto.dressId,
    );
    if (!dress) throw new NotFoundException("Vestido no encontrado");

    if (dress.quantity < createMaintenanceDto.cantidad) {
      throw new BadRequestException(
        `Stock insuficiente. Disponible: ${dress.quantity}, solicitado: ${createMaintenanceDto.cantidad}`,
      );
    }

    const newMaintenance = this.maintenanceRepository.create({
      ...createMaintenanceDto,
      userId,
      estado: createMaintenanceDto.estado || "pendiente",
    });
    const saved = await this.maintenanceRepository.save(newMaintenance);

    // Restar del inventario
    await this.dressService.decreaseStock(
      +createMaintenanceDto.dressId,
      createMaintenanceDto.cantidad,
    );

    // Notificación
    if (this.notificationsGateway) {
      this.notificationsGateway.notifyAdmins({
        titulo: "Vestido en mantenimiento",
        mensaje: `${dress.name} - Enviado a mantenimiento (${createMaintenanceDto.tipo}). Unidades: ${createMaintenanceDto.cantidad}`,
        fecha: new Date(),
        datos: { maintenanceId: saved.id, dressId: dress.id },
      });
    }

    return saved;
  }

  // Finalizar mantenimiento y reincorporar inventario
  async completeMaintenance(id: string): Promise<Maintenance> {
    const maintenance = await this.maintenanceRepository.findOne({
      where: { id },
    });
    if (!maintenance)
      throw new NotFoundException(`Mantenimiento con ID ${id} no encontrado`);
    if (maintenance.estado === "completado") {
      throw new BadRequestException("Mantenimiento ya finalizado");
    }

    maintenance.estado = "completado";
    maintenance.fechaFin = new Date();
    const updated = await this.maintenanceRepository.save(maintenance);

    // Reincorporar cantidad al inventario
    await this.dressService.increaseStock(
      +maintenance.dressId,
      maintenance.cantidad,
    );

    // Notificación
    if (this.notificationsGateway) {
      this.notificationsGateway.notifyAdmins({
        titulo: "Mantenimiento finalizado",
        mensaje: `El vestido ${maintenance.dressNombre} (${maintenance.cantidad} unidades) volvió al inventario.`,
        fecha: new Date(),
        datos: { maintenanceId: maintenance.id, dressId: maintenance.dressId },
      });
    }

    return updated;
  }

  // Cambia el estado y si se marca "completado", ejecuta toda la lógica correspondiente
  async updateMaintenanceStatus(
    id: string,
    estado: "pendiente" | "en_proceso" | "completado" | "cancelado",
  ): Promise<Maintenance> {
    const maintenance = await this.maintenanceRepository.findOne({
      where: { id },
    });

    if (!maintenance) {
      throw new NotFoundException(`Mantenimiento con ID ${id} no encontrado`);
    }

    const eraCompletado = maintenance.estado === "completado";

    // Si ahora es completado y antes no, completa y retorna el actualizado
    if (estado === "completado" && !eraCompletado) {
      return this.completeMaintenance(id);
    } else {
      maintenance.estado = estado;
      await this.maintenanceRepository.save(maintenance);
      return maintenance;
    }
  }

  async getAllMaintenance(): Promise<Maintenance[]> {
    return await this.maintenanceRepository.find({
      order: { createdAt: "DESC" },
    });
  }

  async getMaintenanceByDressId(dressId: string): Promise<Maintenance[]> {
    return await this.maintenanceRepository.find({
      where: { dressId },
      order: { createdAt: "DESC" },
    });
  }

  async deleteMaintenance(id: string): Promise<void> {
    await this.maintenanceRepository.delete(id);
  }
}
