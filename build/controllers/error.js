"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorController = void 0;
const codes_1 = require("../http/codes");
class ErrorController {
    static error(err, req, res, next) {
        return res.status(codes_1.STATUS_UNAUTHORIZE).send(err);
    }
}
exports.ErrorController = ErrorController;
