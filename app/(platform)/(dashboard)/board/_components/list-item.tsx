"use client";

import { ListWithCards } from "@/types"
import { ListHeader } from "./list-header"
import {useRef, useState, ElementRef} from "react";
import { CardForm } from "./card-form";
import { cn } from "@/lib/utils";
import {CardItem} from "./card-item";
import { Draggable, Droppable } from "@hello-pangea/dnd";
interface ListItemProps{
    index:number,
    data:ListWithCards
}

export function ListItem({index, data}:ListItemProps){

    const textAreaRef = useRef<ElementRef<"textarea">>(null)
    const [isEditing, setIsEditing] = useState(false);

    const disableEditing=()=>setIsEditing(false);
    const enableEditing = ()=>{setIsEditing(true);setTimeout(()=>{textAreaRef.current?.focus();})}

    return <Draggable draggableId={data.id} index={index}>
        {(provided)=>{
            return (<li 
                {...provided.draggableProps}
                ref={provided.innerRef}
                className="shrink-0 h-full w-[272px] select-none">
            <div {...provided.dragHandleProps} className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
                <ListHeader data={data} 
                    onAddCard={enableEditing}
                    />
                <Droppable droppableId={data.id} type="card">
                    {(prvd)=>(
                                    <ol 
                                        {...prvd.droppableProps}
                                        ref={prvd.innerRef}
                                        className={cn("mx-1 px-1 py-0.5 flex flex-col gap-y-2", data.cards.length > 0 ? "mt-2" : "mt-0")}>
                                        {data.cards.map((card, index)=>{
                                            return <CardItem key={card.id} data={card} index={index}/>
                                        })}
                                        {prvd.placeholder}
                                    </ol>
                    )}
                </Droppable>
                <CardForm 
                    listId={data.id}
                    ref={textAreaRef}
                    isEditing={isEditing}
                    enableEditing={enableEditing}
                    disableEditing={disableEditing}
                />
            </div>
        </li>)
        }}

    </Draggable>
}