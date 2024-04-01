"use client";

import { FormSubmit } from "@/components/form/form-button";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { ElementRef, forwardRef, useRef, KeyboardEventHandler, KeyboardEvent } from "react"
import { useAction } from "@/hooks/use-action";
import { CreateCardAction } from "@/actions/create-card";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface CardFormProps{
    enableEditing:()=>void,
    disableEditing:()=>void,
    listId:string,
    isEditing:boolean
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(({enableEditing, disableEditing,listId,isEditing},ref)=>{
    const params = useParams();
    const formRef = useRef<ElementRef<"form">>(null);
    const {execute:createCardExecute, fieldErrors} = useAction(CreateCardAction,{
        onError(error){
            toast.error(`Error while creating - ${error}`);
        },
        onSuccess(data){
            toast.success(`Card ${data.title} created successfully`);
            disableEditing();
        }
    })



    useOnClickOutside(formRef, disableEditing);
    useEventListener("keydown", (e)=>{
        if(e.key === "Escape")
            disableEditing();
    });

    const onTextareaKeyDown:KeyboardEventHandler<HTMLTextAreaElement> = (e)=>{
        //While writing; 
        //ENTER => submit
        //ENTER + SHIFT => new line
        if(e.key === "Enter" && !e.shiftKey){
            e.preventDefault();
            formRef.current?.requestSubmit();
        }
    }

    const handleFormSubmit = (formData:FormData)=>{
        const title = formData.get("title") as string;
        const boardId = formData.get("boardId") as string;
        const listId = formData.get("listId") as string;

        createCardExecute({
            title,
            boardId,
            listId
        });
    }

    if(isEditing){
        return (<form ref={formRef} action={handleFormSubmit} className="m-1 py-0.5 px-1 space-y-4">
            <FormTextarea 
                id="title"
                onKeyDown={onTextareaKeyDown}
                errors={fieldErrors}
                ref={ref}
                placeholder="Enter a title for this card..."
                />
            <div className="flex items-center gap-x-1">
                <FormSubmit>
                    Add card
                </FormSubmit>
                <Button
                    onClick={disableEditing}
                    size="sm"
                    variant="ghost"
                    >
                    <X className="h-5 w-5"/>
                </Button>
            </div>

            <input type="hidden" id="listId" name="listId" value={listId} />
            <input type="hidden" id="boardId" name="boardId" value={params.boardId} />
        </form>)
    }

    return <div className="pt-2 px-2">
        <Button 
            onClick={enableEditing}
            className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
            size="sm"
            variant="ghost">
            <Plus className="h-4 w-4 mr-2"/>
            Add a card
        </Button>
    </div>
})

CardForm.displayName = "CardForm"