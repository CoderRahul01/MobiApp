import type { NextFunction , Request , Response } from "express";
import jwt from "jsonwebtoken";
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token
    if (!token) {
        res.status(401).json({message: "Unauthorized"});
        return;
    }

    const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY!,{
        algorithms: ["RS256"],
    });

    if(!decoded){
        res.sendStatus(401).json({message: "Unauthorized"})
        return;
    }

   const userId = (decoded as any).payload.sub;
   //payload is the decoded token
   //sub is the user id

   if(!userId){
     res.sendStatus(401).json({message: "Unauthorized"})
     return;
   }
   req.userId = userId;
   next();


}