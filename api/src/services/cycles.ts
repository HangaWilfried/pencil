import joi from "joi";
import { prisma } from './orm';
import { Request, Response } from "express"

export async function getCycles(req: Request, res: Response) {
    try {
        const cycles = await prisma.cycle.findMany();
        res.send(cycles);
    } catch(error) {
        console.log(error)
    } 
}

export async function createCycle(req: Request, res: Response) {
    const schema = joi.object({
        code: joi.string().required(),
        name: joi.string().required(),
        description: joi.string().optional(),
    });

    try {
        const cycle = await schema.validateAsync(req.body);
        const entity = await prisma.cycle.create({ data: cycle })
        res.send(entity.id).sendStatus(201);
    } catch(error) {
        console.log(error)
    }
}

export async function getCycleById(req: Request, res: Response) {
    try {
        const cycle = await prisma.cycle.findFirst({ where: { id: req.params.id } });
        res.json(cycle);
    } catch(error) {
        console.log(error)
    } 
}

export async function editCycle(req: Request, res: Response) {
    console.log("edit cycle")
}