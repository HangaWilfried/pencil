import joi from "joi";
import argon from "argon2";
import { prisma } from './orm';
import { Request, Response } from "express"

export async function getAllUsers(req: Request, res: Response) {
    console.log("request", req)
    try {
        const blogs = await prisma.user.findMany();
        res.send(blogs);
    } catch(error) {
        console.log(error)
    }
}

export async function login(req: Request, res: Response) {
    const schema = joi.object({
        email: joi.string().required(),
        password: joi.string().required(),
    });

    try {
        const userCredential = await schema.validateAsync(req.body);
        const user = await prisma.user.findFirst({
            where: {email: userCredential.email}
        })
        const message = "email or password are incorrect";
        if (!user) return res.status(404).send({message});
        const isPasswordOk = await argon.verify(user.password, userCredential.password);
        if (!isPasswordOk) return res.status(400).send({message});
    }
    catch (error) {
        const { message, statusCode } = error as { message: string; statusCode: number };
        return res.status(statusCode).send({ message });
    }
}

export async function createUser(req: Request, res: Response) {
    const schema = joi.object({
        firstname: joi.string(),
        lastname: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required(),
    });

    try {
        const user = await schema.validateAsync(req.body);
        const password = await argon.hash(user.password);

        const entity = await prisma.user.create({
            data: {
                ...user,
                password,
            }
        })
        res.send(entity.id).sendStatus(201);
    } catch(error) {
        console.log(error)
    }
}

export async function getUserById(req: Request, res: Response) {
    try {
        const blog = await prisma.user.findFirst({ where: { id: req.params.id } });
        res.json(blog);
    } catch(error) {
        console.log(error)
    }
}

export async function editUser(req: Request, res: Response) {
    console.log("edit blog", res, req)
}