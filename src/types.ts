import {Router} from "express";

export interface Controller {
    path: string;
    router: Router;

    [service: string]: any;
}

export interface JsonResponse {
    done: boolean;
    value?: any
}