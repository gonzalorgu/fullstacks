import { Repository } from "typeorm";
import { Maintenance } from "../Maintenance/maintenance.entity/maintenance.entity";
import { CreateMaintenanceDto } from "./dto/create-maintenance.dto";
import { DressService } from "../dress/dress.service";
import { NotificationsGateway } from "../notifications/notifications.gateway";
export declare class MaintenanceService {
    private maintenanceRepository;
    private readonly dressService;
    private readonly notificationsGateway;
    private readonly logger;
    constructor(maintenanceRepository: Repository<Maintenance>, dressService: DressService, notificationsGateway: NotificationsGateway);
    createMaintenance(userId: number, createMaintenanceDto: CreateMaintenanceDto): Promise<Maintenance>;
    completeMaintenance(id: string): Promise<Maintenance>;
    updateMaintenanceStatus(id: string, estado: "pendiente" | "en_proceso" | "completado" | "cancelado"): Promise<Maintenance>;
    getAllMaintenance(): Promise<Maintenance[]>;
    getMaintenanceByDressId(dressId: string): Promise<Maintenance[]>;
    deleteMaintenance(id: string): Promise<void>;
}
