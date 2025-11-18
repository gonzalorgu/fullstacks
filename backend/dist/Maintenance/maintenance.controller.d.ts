import { MaintenanceService } from "./maintenance.service";
import { CreateMaintenanceDto } from "./dto/create-maintenance.dto";
interface RequestWithUser extends Request {
    user: {
        id: number;
        userId: number;
        email: string;
        role: string;
    };
}
export declare class MaintenanceController {
    private maintenanceService;
    constructor(maintenanceService: MaintenanceService);
    createMaintenance(createMaintenanceDto: CreateMaintenanceDto, req: RequestWithUser): Promise<import("./maintenance.entity/maintenance.entity").Maintenance>;
    getAllMaintenance(): Promise<import("./maintenance.entity/maintenance.entity").Maintenance[]>;
    getMaintenanceByDress(dressId: string): Promise<import("./maintenance.entity/maintenance.entity").Maintenance[]>;
    updateStatus(id: string, estado: "pendiente" | "en_proceso" | "completado" | "cancelado"): Promise<import("./maintenance.entity/maintenance.entity").Maintenance>;
    finalizeMaintenance(id: string): Promise<import("./maintenance.entity/maintenance.entity").Maintenance>;
    deleteMaintenance(id: string): Promise<void>;
}
export {};
