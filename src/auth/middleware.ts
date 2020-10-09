import {Response, Request, NextFunction} from "express";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
    if (req.user) {
        return next()
    }

    return res.status(401).end('Not Authorized.')
}