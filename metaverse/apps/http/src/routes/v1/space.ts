import { Router } from "express";
import { CreateSpaceSchema } from "../../types";
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

spaceRouter.get("/all", (req, res) => {


})

spaceRouter.post("/element", (req, res) => {

})

spaceRouter.delete("/element", (req, res) => {

})

spaceRouter.get("/:spaceId", (req, res) => {
    
})