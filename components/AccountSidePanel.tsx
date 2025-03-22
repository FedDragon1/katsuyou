import { FC } from "react";
import SideEntry from "@/components/SideEntry";
import SideLink from "@/components/SideLink";
import { loginWithGithub, loginWithGoogle } from "@/lib/account";
import { useTranslations } from "next-intl";

interface AccountProps {
    onClick: () => void
    accountHeading: string
    accountAction: string
}

const AccountSidePanel: FC<AccountProps> = ({ onClick, accountHeading, accountAction }) => {
    const t = useTranslations("Signup")

    return (
        <>
            <SideEntry name={t("sso.name")}>
                <SideLink display={t("sso.google")} onClick={loginWithGoogle} />
                <SideLink display={t("sso.github")} onClick={loginWithGithub} />
            </SideEntry>
            <SideEntry name={accountHeading}>
                <SideLink display={accountAction} onClick={onClick} />
            </SideEntry>
        </>
    )
}

export default AccountSidePanel