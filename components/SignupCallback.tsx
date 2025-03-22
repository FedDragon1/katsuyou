"use client"

import { FC } from "react";
import AccountBanner from "@/components/AccountBanner";
import AccountForm from "@/components/AccountForm";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import AccountSidePanel from "@/components/AccountSidePanel";

const SignupCallback: FC = () => {
    const router = useRouter()
    const t = useTranslations("Signup")

    return (
        <>
            <AccountBanner title={t("title")}/>
            <AccountForm caption={t("caption")}
                         side={<AccountSidePanel onClick={() => router.push("/login")}
                                                 accountAction={t("login.link")}
                                                 accountHeading={t("login.name")}/>}>
                <div className={"flex flex-col gap-10 items-center lg:py-6"}>
                    <div className={"flex w-full justify-center items-center"}>
                        <Image src={"/Mail.png"} alt={"mail"} width={140} height={140}/>
                        <Image src={"/Check.png"} alt={"check"} width={140} height={140}/>
                    </div>
                    <p className={"text-center text-xl sm:text-2xl max-w-[600px]"}>{t("callback")}</p>
                </div>
            </AccountForm>
        </>
    )
}

export default SignupCallback