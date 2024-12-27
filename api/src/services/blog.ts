import joi from "joi";
import { prisma } from './orm';
import { Request, Response } from "express"

export async function getAllPosts(req: Request, res: Response) {
    console.log("request", req)
    try {
        const blogs = await prisma.post.findMany();
        res.send(blogs);
    } catch(error) {
        console.log(error)
    } 
}

export async function createPost(req: Request, res: Response) {
    const schema = joi.object({
        title: joi.string().required(),
        content: joi.string().required(),
        author: joi.string().required(),
    });

    try {
        const post = await schema.validateAsync(req.body);
        const entity = await prisma.post.create({data: post})
        res.send(entity.id).sendStatus(201);
    } catch(error) {
        console.log(error)
    }
}

export async function getPostById(req: Request, res: Response) {
    try {
        const blog = await prisma.post.findFirst({ where: { id: req.params.id } });
        res.json(blog);
    } catch(error) {
        console.log(error)
    } 
}

export async function editPost(req: Request, res: Response) {
    console.log("edit blog", res, req)
}