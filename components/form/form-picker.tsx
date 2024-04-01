"use client";

import { unsplash } from "@/lib/unsplash";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { defaultImages } from "@/constants/images";
import Link from "next/link";
import { FormErrors } from "./form-errors";
import { Input } from "../ui/input";

interface FormPickerProps{
    id:string,
    errors?:Record<string, string[] | undefined>
}

type FormPickerImage = {id:string, 
    user:{name:string},
    urls:{thumb:string,full:string}, 
    links:{html:string}};

export const FormPicker = function ({id, errors}:FormPickerProps){
    const {pending} = useFormStatus();
    const [images, setImages] = useState<FormPickerImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

    useEffect(()=>{
        const fetchImages = async ()=>{
            try{
                const result = await unsplash.photos.getRandom({
                    collectionIds: ["317099"],
                    count:9
                });

                if(result && result.response){
                    const newImages = result.response; 
                    setImages(newImages as FormPickerImage[]);
                }else{
                    console.error("Failed to get images from unsplash");
                }

            }catch(error){
                setImages(defaultImages);
            }
            finally{
                setIsLoading(false);
            }
        }

        fetchImages()
    },[])

    if(isLoading)
    return <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-sky-700 animate-spin"/>
    </div>

    return <div className="relative">
        <div className="grid grid-cols-3 mb-2 gap-2">
            {images.map((image)=>{
                return <div 
                onClick={()=>{
                    if(pending)
                    return;
                    setSelectedImageId(image.id)
                }}
                key={image.id} 
                className={cn("cursor-pointer hover:opacity-75 aspect-video group relative transition bg-muted", pending && "opacity-50 hover:opacity-50 cursor-auto")}>
                    <Image src={image.urls.thumb} alt="Unsplash image" className="object-cover rounded-sm" fill />
                    {image.id === selectedImageId && <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                            <Check className="h-4 w-4 text-white"/>
                        </div>}
                    <Link href={image.links.html} target="_blank" className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/30">
                        {image.user.name}
                    </Link>
                    <Input type="radio" id={id} name={id} className="hidden" checked={selectedImageId === image.id} disabled={pending}
                        readOnly
                        value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}/>
                </div>
            })}
        </div>
        <FormErrors
        id="image"
        errors={errors}/>
    </div>
}