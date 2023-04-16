"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorController = void 0;
class ErrorController {
    static error(err, req, res, next) {
        return res.status(500).send("No authorizado papi");
    }
}
exports.ErrorController = ErrorController;
