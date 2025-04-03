import { Router } from "express";
import { AddElementSchema, CreateSpaceSchema, DeleteElemntSchema } from "../../types";
import prisma from "@repo/db/client";
import { userMiddleware } from "../../middleware/user";

export const spaceRouter = Router();

spaceRouter.post("/", userMiddleware, async (req, res) => {
    const parsedData = CreateSpaceSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(400).json({msg: "Validation failed"});
        return
    }

    if(!parsedData.data?.mapId) {
        const space = await prisma.space.create({
            data: {
                name: parsedData.data?.name ?? "Name",
                width: parseInt((parsedData.data?.dimensions ?? "x").split("x")[0]),
                height: parseInt((parsedData.data?.dimensions ?? "x").split("x")[1]),
                creatorId: req.userId!
            }
        });

        res.json({ spaceId: space.id});
    }

    const map = await prisma.map.findUnique({
        where: {
            id: parsedData.data?.mapId
        }, 
        select:{
            mapElements: true,
            width: true,
            height: true
        }
    })
    if(!map) {
        res.status(400).json({
            msg: "Map not found"
        })
        return
    }

    let space = await prisma.$transaction( async () =>{
        const space = await prisma.space.create({
            data: {
                name: parsedData.data?.name ?? "Name",
                width: map.width,
                height: map.height,
                creatorId: req.userId!,
            }
        })
        return space;
    });
    await prisma.spaceElements.createMany({
        data: map.mapElements.map( e => ({
            spaceId: space.id,
            elementId: e.elementId,
            x: e.x!,
            y: e.y!
        }))
    })

    res.json({spaceId: space.id})
})

spaceRouter.delete("/:spaceId",userMiddleware, async (req, res) => {

    const space = await prisma.space.findUnique({
        where: {
            id: req.params.spaceId,
        },
        select:{
            creatorId: true
        }
    });

    if(!space) {
        res.status(400).json({msg: "Space not found"})
        return  
    }

    if(space.creatorId !== req.userId) {
        res.status(403).json({msg: "Unathorized"})
        return
    }

    await prisma.space.delete({
        where: {
            id: req.params.spaceId
        }
    })
    res.json({msg: "Space Deleted"})
    return
})

spaceRouter.get("/all",userMiddleware, async (req, res) => {

    const spaces = await prisma.space.findMany({
        where: {
            creatorId: req.userId  
        }
    });

    res.json({
        spaces: spaces.map( s => ({
            id: s.id,
            name: s.name,
            thumbnail: s.thumbnail,
            dimensions: `${s.width}x${s.height}`
        }))
    })
})

spaceRouter.post("/element", userMiddleware, async (req, res) => {

    const parsedData = AddElementSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(400).json({msg: "Validation failed"});
        return
    }

    const space = await prisma.space.findUnique({
        where: {
            id: req.body.spaceId,
            creatorId: req.userId
        },
        select: {
            width: true,
            height: true
        }
    })

    if(!space) {
        res.status(400).json({msg: "Space not found"})
        return
    }

    await prisma.spaceElements.create({
        data: {
            spaceId: req.body.spaceId,
            elementId: req.body.elementId,
            x: req.body.x,
            y: req.body.y
        }
    })

    res.json({msg: "Element added"})
})

spaceRouter.delete("/element", userMiddleware, async (req, res) => {
    const parsedData = DeleteElemntSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(400).json({msg: "Validation failed"});
        return
    }

    const spaceElement = await prisma.spaceElements.findFirst({
        where: {
            id: parsedData.data.id,
        },
        include: {
            space: true
        }
    })

    if(!spaceElement?.space.creatorId || spaceElement.space.creatorId !== req.userId) {
        res.status(403).json({msg: "Unauthorized"})
        return
    }

    await prisma.spaceElements.delete({
        where: {
            id: parsedData.data.id
        }
    })

    res.json({msg: "Element Deleted"})
})

spaceRouter.get("/:spaceId", userMiddleware, async (req, res) => {
    
    const space = await prisma.space.findUnique({
        where:{
            id: req.params.spaceId
        },
        include:{
            elements: {
                include: {
                    element: true
                }
            }
        }
    })
    if(!space) {
        res.status(400).json({msg:"Space not found"})
        return
    }

    res.json({
        "dimensions": `${space.width}x${space.height}`,
        elements: space.elements.map( e => ({
            id: e.id,
            element: {
                id: e.element.id,
                imageUrl: e.element.imageUrl,
                width: e.element.width,
                height: e.element.height,
                static: e.element.static,
            },
            x: e.x,
            y: e.y
        })),
    })
})

/* start admim.ts at4:55 */