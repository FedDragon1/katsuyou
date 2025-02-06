"use client"

import { ChangeEvent, FC, useState } from "react";
import LandingNav from "@/app/LandingNav";
import AccountBanner from "@/app/(account)/AccountBanner";
import Footer from "@/app/Footer";
import AccountForm from "@/app/(account)/AccountForm";
import { useTranslations } from "next-intl";
import SideLink from "@/app/(account)/SideLink";
import SideEntry from "@/app/(account)/SideEntry";
import Button from "@/app/Button";
import FormEntry from "@/app/(account)/FormEntry";
import { useRouter } from "next/navigation";

const SignupPage: FC = () => {
    const t = useTranslations("Signup")

    const loginWithGoogle = () => {
        console.log("google")
    }

    const loginWithMicrosoft = () => {
        console.log("microsoft")
    }

    const router = useRouter()

    const side = <>
        <SideEntry name={t("sso.name")}>
            <SideLink display={t("sso.google")} onClick={loginWithGoogle} />
            <SideLink display={t("sso.microsoft")} onClick={loginWithMicrosoft} />
        </SideEntry>
        <SideEntry name={t("login.name")}>
            <SideLink display={t("login.link")} onClick={() => router.push("/login")} />
        </SideEntry>
    </>

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")

    const signup = () => {
        console.log(username, email, password, repeatPassword)
    }

    return (
        <>
            <LandingNav hideOptions absolute />
            <div className={"w-full"}>
                <AccountBanner title={t("title")} />
                <AccountForm caption={t("caption")} side={side}>
                    <FormEntry caption={t("form.username.name")} placeholder={t("form.username.placeholder")}
                               type={"email"} onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} />
                    <FormEntry caption={t("form.email.name")} placeholder={t("form.email.placeholder")}
                               type={"email"} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                    <FormEntry caption={t("form.password.name")} placeholder={t("form.password.placeholder")}
                               type={"password"} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
                    <FormEntry caption={t("form.verification.name")} placeholder={t("form.verification.placeholder")}
                               type={"password"} onChange={(e: ChangeEvent<HTMLInputElement>) => setRepeatPassword(e.target.value)} />
                    <Button className={"px-20 py-4 inline-flex items-center gap-2 group self-start"} onClick={signup}>
                        <span className={"text-2xl"}>{t("form.button")}</span>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"
                             className={"stroke-foreground group-hover:stroke-background transition-all duration-500"}>
                            <path
                                d="M1.16663 7.00002H12.8333M12.8333 7.00002L6.99996 1.16669M12.8333 7.00002L6.99996 12.8334"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Button>
                </AccountForm>
            </div>
            <Footer/>
        </>
    )
}

export default SignupPage