import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { User } from "./entities/user.entity";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AdminGuard } from "./guards/admin.guard";
import { JwtStrategy } from ".//strategies/jwt.strategy";
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret:
        process.env.JWT_SECRET ||
        "tu-secreto-super-seguro-cambiar-en-produccion",
      signOptions: { expiresIn: "7d" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, AdminGuard, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
