import { Router } from "express";
import { UpdateMetadataSchema } from "../../types";
import prisma from "@repo/db/client";
import { userMiddleware } from "../../middleware/user";

export const userRouter = Router();

userRouter.post("/metadata", userMiddleware, async (req, res) => {
    const parsedData = UpdateMetadataSchema.safeParse(req.body);
    console.log(req.body);
    
    if(!parsedData.success) {
        res.status(400).json({
            msg: "Validation failed"
        })
        return
    }

    await prisma.user.update({
        where: {
            id: req.userId
        },
        data: {
            avatarId: parsedData.data?.avatarId
        }
    })
   res.status(200).json({msg: "Metadata updated"})
})

userRouter.get("/metadata/bulk", async (req, res) => {
    const userIdString = (req.query.ids ?? "[]") as string;
    const userIds = (userIdString).slice(1, userIdString?.length - 2).split(",");
    
    const metadata = await prisma.user.findMany({
        where: {
            id: {
                in: userIds
            }
        },
        select: {
            avatar: true,
            id: true
        }
    })
    
    res.json({
        avatars: metadata.map(m => ({
            userId: m.id,
            avatarId: m.avatar?.imageUrl
        }))
    })
})

