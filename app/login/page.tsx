"use client"

import { FC, Suspense, useEffect, useState } from "react";
import LandingNav from "@/components/LandingNav";
import AccountBanner from "@/components/AccountBanner";
import Footer from "@/components/Footer";
import AccountForm from "@/components/AccountForm";
import { useTranslations } from "next-intl";
import SideLink from "@/components/SideLink";
import SideEntry from "@/components/SideEntry";
import Button from "@/components/Button";
import FormEntry from "@/components/FormEntry";
import { useRouter, useSearchParams } from "next/navigation";
import { loginWithEmail, loginWithGoogle, loginWithGithub } from "@/lib/account";
import supabase from "@/lib/supabaseClient";

const ErrorMessage: FC = () => {
    const query = useSearchParams();

    const error = query.get("error");
    const errorMessage = error === "auth" ? `Error: ${query.get("message")}` : "Error Signing In"

    return <>
        {
            error &&
            <div className={"fixed flex justify-center top-12 w-full h-20 items-center"}>
                <div className={"bg-primary py-4 px-6 rounded-md flex gap-2 items-center drop"}>
                    <svg className="w-6 fill-foreground"
                         viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M810.65984 170.65984q18.3296 0 30.49472 12.16512t12.16512 30.49472q0 18.00192-12.32896 30.33088l-268.67712 268.32896 268.67712 268.32896q12.32896 12.32896 12.32896 30.33088 0 18.3296-12.16512 30.49472t-30.49472 12.16512q-18.00192 0-30.33088-12.32896l-268.32896-268.67712-268.32896 268.67712q-12.32896 12.32896-30.33088 12.32896-18.3296 0-30.49472-12.16512t-12.16512-30.49472q0-18.00192 12.32896-30.33088l268.67712-268.32896-268.67712-268.32896q-12.32896-12.32896-12.32896-30.33088 0-18.3296 12.16512-30.49472t30.49472-12.16512q18.00192 0 30.33088 12.32896l268.32896 268.67712 268.32896-268.67712q12.32896-12.32896 30.33088-12.32896z"/>
                    </svg>
                    <h3 className={"text-lg"}>{errorMessage}</h3>
                </div>
            </div>
        }
    </>
}

const LoginPage: FC = () => {
    const t = useTranslations("Login")
    const router = useRouter()

    useEffect(() => {
        supabase.auth.getUser().then((u) => {
            if (u.data.user?.id) {
                router.push("/dashboard")
            }
        })
    }, [router]);

    const side = <>
        <SideEntry name={t("sso.name")}>
            <SideLink display={t("sso.google")} onClick={loginWithGoogle}/>
            <SideLink display={t("sso.github")} onClick={loginWithGithub}/>
        </SideEntry>
        <SideEntry name={t("signup.name")}>
            <SideLink display={t("signup.link")} onClick={() => router.push("/signup")}/>
        </SideEntry>
    </>

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
        <>
            <Suspense>
                <ErrorMessage />
            </Suspense>
            <div className={"h-[40vh] sm:h-[60vh] sm:min-h-[400px]"}>
                <LandingNav hideOptions sticky/>
            </div>
            <div className={"w-full"}>
                <AccountBanner title={t("title")}/>
                <AccountForm caption={t("caption")} side={side}>
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
            </div>
            <Footer/>
        </>
    )
}

export default LoginPage