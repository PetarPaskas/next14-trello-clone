"use client";
import { List } from "@prisma/client";
import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, X } from "lucide-react";
import { FormSubmit } from "@/components/form/form-button";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/use-action";
import { DeleteListAction } from "@/actions/delete-list";
import { toast } from "sonner";
import { ElementRef, useRef } from "react";
import { CopyListAction } from "@/actions/copy-list";

interface ListOptionsProps{
    data:List
    onAddCard:()=>void
}

export function ListOptions({data, onAddCard}:ListOptionsProps){
    
    const closeRef = useRef<ElementRef<"button">>(null);

    const {execute:executeDelete} = useAction(DeleteListAction,{
        onSuccess(data){
            toast.success(`Successfully deleted a list "${data.title}"`);
            closeRef.current?.click();
        },
        onError(error){
            toast.error(`Error while deleting a list "${error}"`);
        }
    })

    const handleDeleteForm = (formData: FormData)=>{
        executeDelete({
            boardId: formData.get("boardId") as string,
            id: formData.get("id") as string
        })
    }


    const {execute:executeCopy} = useAction(CopyListAction,{
        onSuccess(data){
            toast.success(`Successfully copied a list "${data.title}"`);
            closeRef.current?.click();
        },
        onError(error){
            toast.error(`Error while copying a list "${error}"`);
        }
    })

    const handleCopyForm = (formData: FormData)=>{
        executeCopy({
            boardId: formData.get("boardId") as string,
            id: formData.get("id") as string
        })
    }



    return <Popover>
        <PopoverTrigger asChild>
            <Button className="h-auto w-auto p-2 " variant="ghost">
                <MoreHorizontal className="h-4 w-4"/>
            </Button>
        </PopoverTrigger>
        <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
            <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                List Actions 
            </div>
            <PopoverClose ref={closeRef} asChild>
                <Button className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600" variant="ghost">
                    <X className="h-4 w-4"/>
                </Button>
            </PopoverClose>
            <Button 
                onClick={onAddCard}
                className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm" 
                variant="ghost">
                Add card...
            </Button>
            <form action={handleCopyForm}>
                <input type="hidden" name="id" id="id" value={data.id}/>
                <input type="hidden" name="boardId" id="boardId" value={data.boardId}/>
                <FormSubmit
                    className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm" 
                    variant="ghost"
                >
                    Copy list...
                </FormSubmit>
            </form>
            <Separator/>
            <form action={handleDeleteForm}>
                <input type="hidden" name="id" id="id" value={data.id}/>
                <input type="hidden" name="boardId" id="boardId" value={data.boardId}/>
                <FormSubmit
                    className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm" 
                    variant="ghost"
                >
                    Delete this list...
                </FormSubmit>
            </form>
        </PopoverContent>
    </Popover>
}