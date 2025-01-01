"use client"
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function NotFound() {

    const router = useRouter();

    useEffect(() => {
        router.push('/');
    }, [router]);

    return null; // You can return null or a loading spinner while the redirect happens
}