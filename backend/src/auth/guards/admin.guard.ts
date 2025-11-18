import { Injectable, ForbiddenException } from "@nestjs/common";
import { CanActivate, ExecutionContext } from "@nestjs/common";

interface RequestWithUser extends Express.Request {
  user: {
    userId: number;
    email: string;
    role: string;
  };
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    console.log(`🔐 Verificando acceso admin para: ${request.user?.email}`);

    if (!request.user || request.user.role !== "admin") {
      console.log(`❌ Acceso denegado - Usuario no es admin`);
      throw new ForbiddenException(
        "Solo administradores pueden acceder a este recurso",
      );
    }

    console.log(`✅ Acceso concedido - Usuario es admin`);
    return true;
  }
}
