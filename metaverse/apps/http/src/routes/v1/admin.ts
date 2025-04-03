import { Router } from "express";
import { adminMiddleware } from "../../middleware/admin";
import prisma from "@repo/db/client";
import { CreateAvatarSchema, CreateElementSchema, CreateMapSchema, UpdateElementSchema } from "../../types";

export const adminRouter = Router();

adminRouter.post("/element", adminMiddleware, async (req, res) => {

    const parsedData = CreateElementSchema.safeParse(req.body);

    if(!parsedData.success) {
        res.status(400).json({msg: "Validation failed"})
        return
    }

    const element = await prisma.element.create({
        data: {
            width: parsedData.data.widht,
            height: parsedData.data.height,
            imageUrl: parsedData.data.imageUrl,
            static: parsedData.data.static
        }
    })

    res.json({id: element.id})
    
})

adminRouter.put("/element/:elementId", async (req, res) => {

    const parsedData = UpdateElementSchema.safeParse(req.params.elementId);
    if(!parsedData.success) {
        res.status(400).json({msg: "Validataion failed"})
        return
    }

    await prisma.element.update({
        where: {
            id: req.params.elementId
        },
        data: {
            imageUrl: parsedData.data.imageUrl
        }
    })
    res.json({msg: "Element updated"})
})

adminRouter.post("/avatar", async (req, res) => {
     
    const parsedData = CreateAvatarSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(400).json({msg: "Validation failed"})
        return
    }
    const createdAvatarId = await prisma.avatar.create({
        data: {
            imageUrl: parsedData.data.imageUrl,
            name: parsedData.data.name
        }
    })
    res.json({
        avatarId: createdAvatarId.id
    })
})

adminRouter.get("/map", async (req, res) => {

    const parsedData = CreateMapSchema.safeParse(req.body);

    if(!parsedData.success) {
        res.status(400).json({msg: "Validation failed"})
        return
    }

    const createdMapId = await prisma.map.create({
        data: {
            name: parsedData.data.name,
            width: parseInt((parsedData.data?.dimensions ?? "x").split("x")[0]),
            height: parseInt((parsedData.data?.dimensions ?? "x").split("x")[1]),
            thumbnail: parsedData.data.thumbnail,
            mapElements: {
                create: parsedData.data.defaultElements.map(e => ({
                    elementId: e.elementId,
                    x: e.x,
                    y: e.y
                }))
            }
        }
    })

    res.json({
        id: createdMapId.id
    })
})