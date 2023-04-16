import { NextFunction, Request, Response } from "express";
import { STATUS_UNAUTHORIZE } from "../http/codes";

export class ErrorController {
    static error(err: Error, req: Request, res: Response, next: NextFunction) {
        return res.status(STATUS_UNAUTHORIZE).send(err);
    }
}