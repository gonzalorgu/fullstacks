"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDressDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_dress_dto_1 = require("./create-dress.dto");
class UpdateDressDto extends (0, mapped_types_1.PartialType)(create_dress_dto_1.CreateDressDto) {
}
exports.UpdateDressDto = UpdateDressDto;
//# sourceMappingURL=update-dress.dto.js.map