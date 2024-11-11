"use client"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {User} from "@prisma/client";
import {UploadIcon} from "lucide-react";
import {toast} from "sonner";
import {uploadImageAction} from "@/features/upload/upload.action";
import {useMutation} from "@tanstack/react-query";
import {prisma} from "@/prisma";

export type AvatarWithUploadProps = {
    user: User
}


export const AvatarWithUpload = (props: AvatarWithUploadProps) => {
    const user = props.user


    const submitImage = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.set("file", file);
            const uploadImage = await uploadImageAction(formData)
            const data = uploadImage?.data?.data

            if (uploadImage?.serverError || !data) {
                console.log(uploadImage?.serverError);
                toast.error(uploadImage?.serverError);
                return;
            }

            console.log(props.user.id)
            await prisma.user.update({
                where: {
                    id: props.user.id,
                },
                data: {
                    image: data.url
                }
            })

            toast.success("Successfully uploaded user image!");



        }
    })

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.includes("image")) {
            toast.error("File not an image")
            return;
        }
        submitImage.mutate(file)
    };


    return (
        <div className="relative " >
                <Avatar className="size-14 mr-3 ">
                    <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                    {user.image ? (
                        <AvatarImage src={user.image} alt={`${user.name ?? "-"}'s profile picture`}/>
                    ) : null}
                </Avatar>
            <div
                onClick={() => {
                    const fileInput = document.createElement("input");
                    fileInput.type = "file";
                    fileInput.accept = "image/*";
                    // @ts-ignore
                    fileInput.onchange = handleImageUpload;
                    fileInput.click();
                }}
                className="cursor-pointer absolute inset-0 flex justify-center items-center opacity-0 transition-opacity hover:opacity-100 hover:bg-gray-500 hover:bg-opacity-50 rounded-full size-14"
            >
                <UploadIcon className="w-8 h-8 text-primary"/>
            </div>
        </div>
    )
}