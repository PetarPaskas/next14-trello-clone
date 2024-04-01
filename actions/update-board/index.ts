"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateBoard } from "./schema";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data:InputType):Promise<ReturnType> => {
    const {userId, orgId} = auth();

    if(!userId || !orgId){
        return { error: "Unauthorized" };
    }

    const {title, id} = data;
    let board; 

    try{
        board = await db.board.update({
            where:{
                id:id,
                orgId:orgId
            }, 
            data:{
                title
            }
        });

        await createAuditLog({
            entityId: board.id,
            entityTitle: board.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.UPDATE
        })

    }catch{
        return {
            error:"Failed to update"
        }
    }

    revalidatePath(`/boards/${board.id}`);
    return {data:board};
}

export const UpdateBoardAction = createSafeAction(UpdateBoard,handler);