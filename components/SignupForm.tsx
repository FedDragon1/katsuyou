"use client"

import { FC, useEffect, useState } from "react";
import AccountBanner from "@/components/AccountBanner";
import AccountForm from "@/components/AccountForm";
import FormEntry from "@/components/FormEntry";
import Button from "@/components/Button";
import { useTranslations } from "next-intl";
import { signUp } from "@/lib/account";
import { useRouter } from "next/navigation";
import AccountSidePanel from "@/components/AccountSidePanel";

const SignupForm: FC = () => {
    const t = useTranslations("Signup")
    const router = useRouter()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")

    const [unCorrect, setUnCorrect] = useState(true)
    const [rpCorrect, setRpCorrect] = useState(true)
    const [pwCorrect, setPwCorrect] = useState(true)
    const [emCorrect, setEmCorrect] = useState(true)

    const signup = () => {
        setUnCorrect(checkUsername())
        setEmCorrect(checkEmail())
        setPwCorrect(checkPassword())
        setRpCorrect(checkRepeatPassword())

        if (unCorrect && rpCorrect && pwCorrect && emCorrect) {
            signUp(username, email, password, router)
        }
    }

    function checkUsername() {
        return username.length > 0 && username.length < 20
    }

    function checkRepeatPassword() {
        return password === repeatPassword
    }

    function checkPassword() {
        return password.length <= 20 && password.length >= 6
    }

    function checkEmail() {
        const m = email
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
        return Boolean(m)
    }

    useEffect(() => {
        setUnCorrect(true)
    }, [username]);

    useEffect(() => {
        setEmCorrect(true)
    }, [email]);

    useEffect(() => {
        setPwCorrect(true)
    }, [password]);

    useEffect(() => {
        setRpCorrect(true)
    }, [repeatPassword]);

    return (
        <>
            <AccountBanner title={t("title")} />
            <AccountForm caption={t("caption")}
                         side={<AccountSidePanel onClick={() => router.push("/login")}
                                                 accountAction={t("login.link")}
                                                 accountHeading={t("login.name")}/>}>
                <FormEntry caption={t("form.username.name")} placeholder={t("form.username.placeholder")}
                           borderClass={`${unCorrect ? '' : 'border-emphasis'}`} className={`${unCorrect ? '' : 'text-emphasis placeholder:text-emphasis'}`}
                           type={"email"} value={username} onChange={(e) => setUsername(e.target.value)} />
                <FormEntry caption={t("form.email.name")} placeholder={t("form.email.placeholder")}
                           borderClass={`${emCorrect ? '' : 'border-emphasis'}`} className={`${emCorrect ? '' : 'text-emphasis placeholder:text-emphasis'}`}
                           type={"email"} value={email} onChange={(e) => setEmail(e.target.value)} />
                <FormEntry caption={t("form.password.name")} placeholder={t("form.password.placeholder")}
                           borderClass={`${pwCorrect ? '' : 'border-emphasis'}`} className={`${pwCorrect ? '' : 'text-emphasis placeholder:text-emphasis'}`}
                           type={"password"} value={password} onChange={(e) => setPassword(e.target.value)} />
                <FormEntry caption={t("form.verification.name")} placeholder={t("form.verification.placeholder")}
                           borderClass={`${rpCorrect ? '' : 'border-emphasis'}`} className={`${rpCorrect ? '' : 'text-emphasis placeholder:text-emphasis'}`}
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
        </>
    )
}

export default SignupForm