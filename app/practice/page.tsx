"use client"

import { FC } from "react";
import { test } from "@/lib/account";

const Practice: FC = () => {
    return (
        <button onClick={test}>Test</button>
    )
}

export default Practice