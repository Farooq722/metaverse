import { Router } from "express";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import { SigninSchema, SignupSchema } from "../../types";
import { hash, compare } from "../../script";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config";
import prisma from "@repo/db/client";

export const router = Router();

// router.post("/signup", async (req, res) => {
//     const parsedData = SignupSchema.safeParse(req.body);
//     if (!parsedData.success) {
//         res.status(400).json({
//             msg: "validation failed",
//         });
//         return;
//     }
//     const hashPassword = await hash(parsedData.data.password);
//     try {
//         const user = await prisma.user.create({
//             data: {
//                 username: parsedData.data.username,
//                 password: hashPassword,
//                 role: parsedData.data.type === "admin" ? "Admin" : "User",
//             },
//     });
//     res.status(200).json({
//         msg: "User created successfully",
//       userId: user.id,
//     });
//   } catch (error) {
//     res.status(400).json({
//         msg: "Internal server error",
//     });
//   }
// });

// router.post("/signin", async (req, res) => {
//   const parsedData = SigninSchema.safeParse(req.body);

//   if (!parsedData.success) {
//     res.status(403).json({
//         msg: "validation failed",
//     });
//     return;
// }
//   try {
//     const user = await prisma.user.findUnique({
//       where: {
//           username: parsedData.data.username,
//         },
//     });
//     if (!user) {
//         res.status(403).json({ msg: "Validation failed" });
//         return;
//     }
    
//     const isValidPassword = await compare(
//         parsedData.data.password,
//         user?.password
//     );
//     if (!isValidPassword) {
//         res.status(403).json({
//             msg: "Invalid password",
//         });
//         return;
//     }
    
//     const token = jwt.sign(
//         {
//             userId: user.id,
//             role: user.role,
//         },
//         JWT_SECRET
//     );
//     res.json({
//         token,
//     });
// } catch (error) {
//     res
//     .status(400)
//     .json({ msg: "Internal server error" + error });
// }

// /* try run program npm run build and node dist./index/js */
// });

router.post("/signup", async (req, res) => {

    const parsedData = SignupSchema.safeParse(req.body)
    if (!parsedData.success) {
        console.log("parsed data incorrect")
        res.status(400).json({message: "Validation failed"})
        return
    }

    const hashedPassword = await hash(parsedData.data.password)

    try {
         const user = await prisma.user.create({
            data: {
                username: parsedData.data.username,
                password: hashedPassword,
                role: parsedData.data.type === "admin" ? "Admin" : "User",
            }
        })
        res.json({
            userId: user.id
        })
    } catch(e) {
        console.log("erroer thrown")
        console.log(e)
        res.status(400).json({message: "User already exists"})
    }
})

router.post("/signin", async (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(403).json({message: "Validation failed"})
        return
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                username: parsedData.data.username
            }
        })
        
        if (!user) {
            res.status(403).json({message: "User not found"})
            return
        }
        const isValid = await compare(parsedData.data.password, user.password)

        if (!isValid) {
            res.status(403).json({message: "Invalid password"})
            return
        }
        const token = jwt.sign({
            userId: user.id,
            role: user.role
        }, JWT_SECRET);

        res.json({
            token
        })
    } catch(e) {
        res.status(400).json({message: "Internal server error"})
    }
})

router.get("/elements", (req, res) => {});

router.get("/avatars", (req, res) => {});

router.use("/user", userRouter);
router.use("/space", spaceRouter);
router.use("/admin", adminRouter);

/*
17460kg
873kg -
5238
177219rs 
*/