"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
var Model = /** @class */ (function () {
    function Model(parsedJson) {
        this.ID = parsedJson['ID'];
        this.UserID = parsedJson['UserID'];
        this.Error = parsedJson['Error'];
        this.Category = parsedJson['Category'];
        this.Language = parsedJson['Language'];
        this.CompileCount = parsedJson['CompileCount'];
    }
    return Model;
}());
exports.Model = Model;
//# sourceMappingURL=model.js.map