"use client"

import { FC } from "react";
import LandingNav from "@/components/LandingNav";
import AccountBanner from "@/components/AccountBanner";
import Footer from "@/components/Footer";
import AccountForm from "@/components/AccountForm";
import { useTranslations } from "next-intl";
import SideLink from "@/components/SideLink";
import SideEntry from "@/components/SideEntry";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

    return (
        <>
            <div className={"h-[40vh] sm:h-[60vh] sm:min-h-[400px]"}>
                <LandingNav hideOptions sticky/>
            </div>
            <div className={"w-full"}>
                <AccountBanner title={t("title")}/>
                <AccountForm caption={t("caption")} side={side}>
                    <div className={"flex flex-col gap-10 items-center lg:py-6"}>
                        <div className={"flex w-full justify-center items-center"}>
                            <Image src={"/Mail.png"} alt={"mail"} width={140} height={140}/>
                            <Image src={"/Check.png"} alt={"check"} width={140} height={140}/>
                        </div>
                        <p className={"text-center text-xl sm:text-2xl max-w-[600px]"}>{t("callback")}</p>
                    </div>
                </AccountForm>
            </div>
            <Footer/>
        </>
    )
}

export default SignupPage