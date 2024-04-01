import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ListContainer } from "../_components/list-container";


interface BoardPageProps {
    params:{
        boardId:string
    },
    children:React.ReactNode
}

export default async function BoardPage({params}:BoardPageProps){
    const {boardId} = params;

    const {userId, orgId} = auth();

    if(!orgId)
    redirect("/select-org");

    const listsWithCards = await db.list.findMany({
        where:{
            boardId: boardId,
            board:{
                orgId
            }
        },
        include:{
            cards:{
                orderBy:{
                    order:"asc"
                }
            }
        },
        orderBy:{
            order:"asc"
        }
    })

    return <div className="pt-15 p-4 h-full overflow-x-auto">
        <ListContainer
            boardId={boardId}
            data={listsWithCards}
            />
    </div>
}