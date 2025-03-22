"use client"

import { FC, useState } from "react";
import AccountBanner from "@/components/AccountBanner";
import AccountForm from "@/components/AccountForm";
import FormEntry from "@/components/FormEntry";
import Button from "@/components/Button";
import { loginWithEmail } from "@/lib/account";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import AccountSidePanel from "@/components/AccountSidePanel";

const LoginForm: FC = () => {
    const t = useTranslations("Login")
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
        <>
            <AccountBanner title={t("title")}/>
            <AccountForm caption={t("caption")}
                         side={<AccountSidePanel onClick={() => router.push("/signup")}
                                                 accountAction={t("signup.link")}
                                                 accountHeading={t("signup.name")}/>}>
                <FormEntry caption={t("form.email.name")} placeholder={t("form.email.placeholder")}
                           autoComplete={"email"}
                           type={"email"} value={email} onChange={(e) => setEmail(e.target.value)}/>
                <FormEntry caption={t("form.password.name")} placeholder={t("form.password.placeholder")}
                           autoComplete={"current-password"}
                           type={"password"} value={password} onChange={(e) => setPassword(e.target.value)}/>
                <Button className={"px-20 py-4 inline-flex items-center gap-2 group self-start"}
                        onClick={() => loginWithEmail(router, email, password)}>
                    <span className={"text-xl sm:text-2xl"}>{t("form.button")}</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"
                         className={"stroke-foreground group-hover:stroke-background transition-all duration-500"}>
                        <path
                            d="M1.16663 7.00002H12.8333M12.8333 7.00002L6.99996 1.16669M12.8333 7.00002L6.99996 12.8334"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </Button>
            </AccountForm>
        </>
    )
}

export default LoginForm