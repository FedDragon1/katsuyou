"use client"

import { FC, useState } from "react";
import LandingNav from "@/components/LandingNav";
import AccountBanner from "@/components/AccountBanner";
import Footer from "@/components/Footer";
import AccountForm from "@/components/AccountForm";
import { useTranslations } from "next-intl";
import SideLink from "@/components/SideLink";
import SideEntry from "@/components/SideEntry";
import Button from "@/components/Button";
import FormEntry from "@/components/FormEntry";
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
        router.push("/signup/callback")
    }

    return (
        <>
            <div className={"h-[40vh] sm:h-[60vh] sm:min-h-[400px]"}>
                <LandingNav hideOptions sticky/>
            </div>
            <div className={"w-full relative"}>
                <AccountBanner title={t("title")} />
                <AccountForm caption={t("caption")} side={side}>
                    <FormEntry caption={t("form.username.name")} placeholder={t("form.username.placeholder")}
                               type={"email"} value={username} onChange={(e) => setUsername(e.target.value)} />
                    <FormEntry caption={t("form.email.name")} placeholder={t("form.email.placeholder")}
                               type={"email"} value={email} onChange={(e) => setEmail(e.target.value)} />
                    <FormEntry caption={t("form.password.name")} placeholder={t("form.password.placeholder")}
                               type={"password"} value={password} onChange={(e) => setPassword(e.target.value)} />
                    <FormEntry caption={t("form.verification.name")} placeholder={t("form.verification.placeholder")}
                               type={"password"} value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
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