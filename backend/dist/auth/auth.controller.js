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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./dto/auth.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const admin_guard_1 = require("./guards/admin.guard");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async register(registerDto) {
        try {
            return await this.authService.register(registerDto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async login(loginDto) {
        try {
            return await this.authService.login(loginDto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async resetPassword(resetPasswordDto) {
        try {
            return await this.authService.resetPassword(resetPasswordDto.email);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getProfile(req) {
        try {
            return await this.authService.getProfile(req.user.userId);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateProfile(req, updateProfileDto) {
        try {
            return await this.authService.updateProfile(req.user.userId, updateProfileDto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async changePassword(req, changePasswordDto) {
        try {
            return await this.authService.changePassword(req.user.userId, changePasswordDto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getAllUsers(req) {
        console.log(`👮 Admin ${req.user.email} consultando usuarios`);
        try {
            return await this.authService.getAllUsers();
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getUserById(req, id) {
        try {
            const userId = parseInt(id, 10);
            if (isNaN(userId)) {
                throw new common_1.BadRequestException("ID de usuario inválido");
            }
            return await this.authService.getProfile(userId);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateUser(req, id, updateUserDto) {
        try {
            const userId = parseInt(id, 10);
            if (isNaN(userId)) {
                throw new common_1.BadRequestException("ID de usuario inválido");
            }
            console.log(`👮 Admin ${req.user.email} actualizando usuario ${userId}`);
            return await this.authService.updateProfile(userId, updateUserDto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async deleteUser(req, id) {
        try {
            const userId = parseInt(id, 10);
            if (isNaN(userId)) {
                throw new common_1.BadRequestException("ID de usuario inválido");
            }
            if (userId === req.user.userId) {
                throw new common_1.ForbiddenException("No puedes eliminar tu propia cuenta como admin");
            }
            console.log(`👮 Admin ${req.user.email} eliminando usuario ${userId}`);
            return await this.authService.deleteUser(userId);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async toggleUserActive(req, id) {
        try {
            const userId = parseInt(id, 10);
            if (isNaN(userId)) {
                throw new common_1.BadRequestException("ID de usuario inválido");
            }
            if (userId === req.user.userId) {
                throw new common_1.ForbiddenException("No puedes desactivar tu propia cuenta como admin");
            }
            console.log(`👮 Admin ${req.user.email} toggleando estado del usuario ${userId}`);
            return await this.authService.toggleUserActive(userId);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("register"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("reset-password"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("profile"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)("profile"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)("change-password"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Get)("users"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Get)("users/:id"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUserById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Put)("users/:id"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, auth_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Delete)("users/:id"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Put)("users/:id/toggle-active"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "toggleUserActive", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map