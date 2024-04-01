import {Schema, ZodSchema, z} from "zod";

export type FieldError<T> ={
    [K in keyof T]: string[]
};

export type ActionState<TInput, TOutput> = {
    fieldErrors?: FieldError<TInput>,
    error?:string | null,
    data?:TOutput
}

export function createSafeAction <TInput, TOutput>(
    inputSchema: z.Schema<TInput>,
    handle:(validatedData:TInput)=>Promise<ActionState<TInput, TOutput>>)
    {
        return async (input:TInput) : Promise<ActionState<TInput, TOutput>> => {
            const validationResult = inputSchema.safeParse(input);

            if(!validationResult.success)
            {
                return ({
                    fieldErrors: validationResult.error.flatten().fieldErrors as FieldError<TInput>
                });
            }

            return await handle(input);
            
        }
    }