"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDressImageDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_dress_image_dto_1 = require("./create-dress-image.dto");
class UpdateDressImageDto extends (0, mapped_types_1.PartialType)(create_dress_image_dto_1.CreateDressImageDto) {
}
exports.UpdateDressImageDto = UpdateDressImageDto;
//# sourceMappingURL=update-dress-image.dto.js.map