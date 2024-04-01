"use client";

import { UpdateListAction } from "@/actions/update-list";
import { FormInput } from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";
import { List } from "@prisma/client";
import {useState, useRef, ElementRef} from "react";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";
import { ListOptions } from "./list-options";


interface ListHeaderProps{
    data:List,
    onAddCard:()=>void
}

export function ListHeader({data, onAddCard}:ListHeaderProps){

    const [title, setTitle] = useState(data.title);
    const [isEditing, setIsEditing] = useState(false);

    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);

    const {execute} = useAction(UpdateListAction, {
        onError(err){
            toast.success("Failed to rename - "+err);
        },
        onSuccess(data){
            toast.success("Renamed to "+data.title);
            setTitle(data.title);
            disableEditing();
        }
    });

    const handleSubmit = (formData:FormData)=>{
        const formTitle = formData.get("title") as string;
        const id = formData.get("id") as string;
        const boardId = formData.get("boardId") as string;

        if(title === formTitle){
            return disableEditing();
        }

        execute({
            title:formTitle, 
            id, 
            boardId
        });
    }

    const enableEditing = ()=>{
        setIsEditing(true);
        setTimeout(()=>{
            inputRef?.current?.focus();
            inputRef?.current?.select();
        });
    }

    const disableEditing = ()=>{
        setIsEditing(false);
    }

    const onKeyDown = (ev:KeyboardEvent)=>{
        if(ev.key === "Escape"){
            formRef.current?.requestSubmit();
        }
    }

    useEventListener("keydown", onKeyDown);

    const onBlur = ()=>{
        formRef?.current?.requestSubmit();
    }

    const renderEditForm = ()=>{
        return <form className="flex-1 px-[2px]" ref={formRef} action={handleSubmit}>
            <input type="hidden" id="id" name="id" value={data.id} />
            <input type="hidden" id="boardId" name="boardId" value={data.boardId} />
            <FormInput 
                ref={inputRef}
                onBlur={onBlur}
                id="title"
                placeholder={"Enter list title"}
                defaultValue={title}
                className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input
                transition truncate bg-transparent focus:bg-white"
                />
            <button hidden type="submit" />
        </form>
    }


    return <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
        {isEditing ? renderEditForm() : renderView()}
    </div>

    function renderView(){
        return <>
        <div onClick={enableEditing} className="w-full text-sm px-2.5 h-7 font-medium border-transparent py-1">
        {title}
        </div>
        <ListOptions 
            data={data}
            onAddCard={onAddCard}/>
        </>
    }

}