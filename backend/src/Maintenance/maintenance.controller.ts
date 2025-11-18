import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { MaintenanceService } from "./maintenance.service";
import { CreateMaintenanceDto } from "./dto/create-maintenance.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

interface RequestWithUser extends Request {
  user: {
    id: number;
    userId: number;
    email: string;
    role: string;
  };
}

@Controller("maintenance")
export class MaintenanceController {
  constructor(private maintenanceService: MaintenanceService) {}

  @UseGuards(JwtAuthGuard)
  @Post("create")
  createMaintenance(
    @Body() createMaintenanceDto: CreateMaintenanceDto,
    @Request() req: RequestWithUser,
  ) {
    const userId = req.user.id || req.user.userId;
    return this.maintenanceService.createMaintenance(
      userId,
      createMaintenanceDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get("all")
  getAllMaintenance() {
    return this.maintenanceService.getAllMaintenance();
  }

  @UseGuards(JwtAuthGuard)
  @Get("dress/:dressId")
  getMaintenanceByDress(@Param("dressId") dressId: string) {
    return this.maintenanceService.getMaintenanceByDressId(dressId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body("estado")
    estado: "pendiente" | "en_proceso" | "completado" | "cancelado",
  ) {
    return this.maintenanceService.updateMaintenanceStatus(id, estado);
  }

  // --- ENDPOINT PARA FINALIZAR Y REINCORPORAR STOCK ---
  @UseGuards(JwtAuthGuard)
  @Post(":id/finalize")
  finalizeMaintenance(@Param("id") id: string) {
    return this.maintenanceService.completeMaintenance(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  deleteMaintenance(@Param("id") id: string) {
    return this.maintenanceService.deleteMaintenance(id);
  }
}
