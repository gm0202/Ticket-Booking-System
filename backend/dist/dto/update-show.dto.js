"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateShowDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_show_dto_1 = require("./create-show.dto");
class UpdateShowDto extends (0, swagger_1.PartialType)(create_show_dto_1.CreateShowDto) {
}
exports.UpdateShowDto = UpdateShowDto;
