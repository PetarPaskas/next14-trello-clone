"use client"
import { Plus, X } from "lucide-react"
import { ListWrapper } from "./list-wrapper"
import { ElementRef, useRef, useState } from "react"
import { useEventListener, useOnClickOutside } from "usehooks-ts"
import { FormInput } from "@/components/form/form-input"
import { useParams, useRouter } from "next/navigation"
import { FormSubmit } from "@/components/form/form-button"
import { Button } from "@/components/ui/button"
import { useAction } from "@/hooks/use-action"
import { CreateListAction } from "@/actions/create-list/index"
import { toast } from "sonner"

 
interface ListFormProps {

}


export const ListForm = ({}:ListFormProps)=>{
    const params = useParams();
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);

    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);

    const enableEditing = ()=>{
        setIsEditing(true);
        setTimeout(()=>{
            inputRef.current?.focus();
        })
    }

    const disableEditing = ()=>{
        setIsEditing(false);
    }

    const onKeyDown = (e:KeyboardEvent) => {
        if(e.key === "Escape"){
            disableEditing();
        }
    }
    useEventListener("keydown", onKeyDown);
    useOnClickOutside(formRef, disableEditing);


    const {execute, fieldErrors} = useAction(CreateListAction,{
        onSuccess(data){
            console.log("Success!", data);
            toast.success("List created successfully.");
            disableEditing();
            router.refresh();
        },
        onError(error){
            toast.error("Error while creating a list - "+error);
        }
    })

    const handleCreateList = (formData: FormData)=>{
        const title = formData.get("title") as string;
        const boardId = formData.get("boardId") as string;

        execute({ title, boardId });
    }

    if(isEditing)
    {
        return (<ListWrapper>
            <form ref={formRef} action={handleCreateList} className="w-full p-3 bg-white rounded-md space-y-4 shadow-md">
                <FormInput
                    errors={fieldErrors}
                    ref={inputRef}
                    id="title"
                    className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
                    placeholder="Enter list title..."
                    />
                <input type="hidden" value={params.boardId} id="boardId" name="boardId"/>
                <div className="flex items-center gap-x-1">
                    <FormSubmit>
                        Add List
                    </FormSubmit>
                    <Button onClick={disableEditing} size="sm" variant="ghost">
                        <X className="w-5 h-5"/>
                    </Button>
                </div>
            </form>
        </ListWrapper>)
    }


    return <ListWrapper>
        <button 
        onClick={enableEditing}
        className="w-full rounded-md bg-white/80 transition p-3 flex items-center text-sm font-medium hover:bg-white/50">
            <Plus className="h-4 w-4 mr-2"/>
            Add a list
        </button>
    </ListWrapper>
}