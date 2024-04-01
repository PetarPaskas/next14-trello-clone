"use client";
import { XCircle } from "lucide-react";

interface FormErrorsProps{
    id: string;
    errors?:Record<string, string[] | undefined>
}

export function FormErrors({id, errors}:FormErrorsProps){
    if(!errors)
    return null;

    const errorElements = errors?.[id]?.map((error:string)=><div key={error} className="flex items-center font-medium border border-rose-500/10 rounded-sm">
        <XCircle className="h-4 w-4 mr-2"/>{error}</div>);

    return (
        <div id={`${id}-error`} aria-live="polite" className="mt-2 text-xs text-rose-500"> 
            {errorElements}
        </div>
    )
}