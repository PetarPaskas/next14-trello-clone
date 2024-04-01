"use client"

import { UpdateBoardAction } from "@/actions/update-board"
import { FormInput } from "@/components/form/form-input"
import { Button } from "@/components/ui/button"
import { useAction } from "@/hooks/use-action"
import { Board } from "@prisma/client"
import { ElementRef, useRef, useState } from "react"
import { toast } from "sonner"

interface BoardTitleForm{
    data:Board
}

export const BoardTitleForm = ({data}:BoardTitleForm)=>{
    const [isEditing, setIsEditing] = useState(false);
    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);
    const [title, setTitle] = useState(data.title);

    const {execute } = useAction(UpdateBoardAction,{
        onSuccess(data){
            toast.success("Updated board title. - "+data.title);
            setTitle(data.title);
            disableEditing();
        },
        onError(error){
            toast.error(error);
        }
    })

    const disableEditing = ()=>{
        setIsEditing(false);
    };
    const enableEditing = ()=>{
        setIsEditing(true);
        setTimeout(()=>{
            inputRef.current?.focus();
            inputRef.current?.select();
        });

    }

    const handleSubmit = (formData:FormData)=>{
        console.log("I am submitting");

        const title = formData.get("title") as string;

        if(title === data.title)
        return;


        execute({title:title, id:data.id});
    }

    const handleBlur = ()=>{
        formRef?.current?.requestSubmit();
    }

    if(isEditing){
        return <form ref={formRef} className="flex items-center gap-x-2" action={handleSubmit}>
            <FormInput 
            ref={inputRef}
            id="title" 
            onBlur={handleBlur}
            defaultValue={title}
            className="text-lg font-bold px-[7px] py-1 bg-transparent focus:visible outline-none focus-visible:ring-transparent border-none h-7" />
        </form>
    }


    return <Button onClick={enableEditing} variant="transparent" className="font-bold text-lg h-auto w-auto p-1 px-2">
        {title}
    </Button>
}