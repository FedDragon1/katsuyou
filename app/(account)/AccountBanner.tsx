import { FC } from "react";
import Image from "next/image";

interface AccountBannerProps {
    title: string
}

const AccountBanner: FC<AccountBannerProps> = ({ title }) => {
    return (
        <div className={"w-full h-[40vh] sm:h-[60vh] relative flex items-end justify-between p-10 sm:p-20 z-10"}>
            <Image src={"/account_banner.png"} alt={"banner"} width={1440} height={498}
                   className={"absolute top-0 left-0 w-full h-full object-cover -z-10"} />
            <span className={"lg:text-[8rem] lg:leading-[8rem] sm:text-[7rem] sm:leading-[7rem] text-[4rem] leading-[4rem] m-0"}>{title}</span>
            <Image src={"/down_arrow.png"} alt={"arrow"} width={92} height={92}
                   className={"w-[92px] h-[92px] hidden lg:block"} />
        </div>
    )
}

export default AccountBanner