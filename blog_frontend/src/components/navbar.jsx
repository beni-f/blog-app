"use client"

import { SimpleHeader } from "@/components/ui/simple-header";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export default function NavigationBar() {
    const { user, loading } = useContext(AuthContext)
    return (
        <div className="relative w-full">
            <SimpleHeader />
        </div>
    );
}

