import { Board } from "@prisma/client"
import { BoardTitleForm } from "./board-title-form";
import { BoardOptions } from "./board-options";

interface BoardNavbarProps {
    data:Board
}

export const BoardNavbar = function({data}:BoardNavbarProps){

    const {orgId} = data;

    return <div className="w-full h-14 z-[40] bg-black/50 items-center px-6 gap-x-4 top-14 fixed flex text-white">
        <BoardTitleForm data={data} />
        <div className="ml-auto">
            <BoardOptions id={data.id}/>
        </div>
    </div>
}