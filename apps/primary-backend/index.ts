import { prismaClient } from "db/client";
import express from "express";
import cors from "cors";
import { authMiddleware } from "./middleware";
const app = express();
app.use(cors());
app.use(express.json());

app.post("/project",authMiddleware, async (req, res) => {
    const { prompt } = req.body;
    const userId = req.userId!;
    //TODO: (When we hit the LLM here) add logic to get a useful name for the project fromt the prompt
    const description = prompt.split("\n")[0];
    const project = await prismaClient.project.create({
        data: {
            description,
            userId,
        },
    });
    res.json({ projectId: project.id });
})

app.get('/projects',authMiddleware, async (req, res) => {
    const userId = req.userId!
    const project = await prismaClient.project.findFirst({
        where: {
            userId,
        },
    });
    res.json(project);
})

app.listen(3001, () => {
    console.log("Server running on port 3001");
});

