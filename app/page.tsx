import LandingNav from "@/components/LandingNav";
import { useTranslations } from "next-intl";
import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import Footer from "@/components/Footer";

interface ListProps {
    order: string,
    desc: string,
    emphasis?: string
}

const ListItem: FC<ListProps> = ({ order, desc, emphasis }) => {
    return (
        <div className={"flex gap-10 h-[9rem] items-center"}>
            <span className={"text-[6rem] w-[100px] sm:text-[9rem] sm:w-[180px] m-0 "}>{order}</span>
            <div className={"flex flex-col gap-2 justify-between max-w-[200px]"}>
                {
                    emphasis ?
                        <>
                            <p className={"text-xl sm:text-2xl"}>{desc}</p>
                            <span className={"emphasis text-xl sm:text-2xl self-start before:-bottom-1 pr-2"}>{emphasis}</span>
                        </>
                        : <>
                            <p className={"text-xl sm:text-2xl leading-9"}>{desc}</p>
                        </>
                }
            </div>
        </div>
    )
}

export default function Home() {
    const t = useTranslations("Landing")
    const desc = t("title.description").split("\n")

    const titleSize = "xl:text-[9rem] md:text-[8rem] sm:text-[6rem] text-6xl text-nowrap"
    const sloganSize = "text-4xl md:text-[3rem] md:leading-[3rem] lg:text-[4rem] lg:leading-[4rem] xl:text-[5rem] xl:leading-[5rem] 2xl:text-[6rem] 2xl:leading-[6rem]"

    return (
        <>
            <LandingNav/>
            <main id={"main"} className={"px-10 sm:px-20 pt-[220px] box-border w-full h-screen flex justify-between"}>
                <div className={"h-full flex flex-col pb-4"}>
                    <div className={"flex flex-col gap-0"}>
                        <h1 className={`${titleSize} leading-none m-0`}>{t("title.slogan.line1")}</h1>
                        <h1 className={`${titleSize} leading-none m-0`}>{t("title.slogan.line2")}</h1>
                    </div>
                    <div className={"flex mt-10"}>
                        <h1 className={`${titleSize} emphasis sm:pr-8`}>{t("title.slogan.emphasis")}</h1>
                        <h1 className={`${titleSize}`}>{t("title.slogan.remainder")}</h1>
                    </div>
                    <div className={"flex-grow border-l border-foreground pl-4 flex items-end"}>
                        <span className={"text-lg"}>{t("title.scroll")}</span>
                    </div>
                </div>
                <div className={"w-[400px] xl:flex flex-col gap-8 2xl:text-2xl lg:text-xl hidden mt-20"}>
                    {desc.map((para) => (
                        <p key={para}>{para}</p>
                    ))}
                </div>
            </main>
            <div
                className={"flex absolute w-full h-full top-0 -z-10 justify-center items-center sm:pt-[220px] sm:pb-[100px]"}>
                <video src={"/landing_book.mp4"} muted autoPlay loop playsInline preload="auto"
                       className={"w-full h-full sm:max-w-[70%] sm:max-h-[90%] object-cover brightness-50 saturate-50"}/>
            </div>
            <div className={"w-full min-h-screen flex flex-col md:flex-row px-10 sm:px-20 pt-32 gap-10"} id={"solution"}>
                <div>
                    <span className={"text-emphasis leading-[3.75rem] text-nowrap"}>{t("solution.aside")}</span>
                </div>
                <div className={"flex-grow flex flex-col gap-20"}>
                    <div className={"flex justify-between items-center gap-8"}>
                        <h1 className={"text-4xl sm:text-6xl"}>{t("solution.title")}</h1>
                        <hr className={"border-b hidden lg:block border-foreground flex-grow max-w-[50%]"}/>
                    </div>
                    <div className={"flex-grow max-h-[150px]"}>
                        <p className={"text-xl sm:text-3xl max-w-[520px]"}>{t("solution.subtitle")}</p>
                    </div>
                    <div className={"grid grid-cols-1 pb-20 xl:grid-cols-2 2xl:grid-cols-3 gap-x-20 gap-y-20 justify-evenly flex-grow"}>
                        <ListItem order={"01"} desc={t("solution.verb.description")}
                                  emphasis={t("solution.verb.emphasis")}/>
                        <ListItem order={"02"} desc={t("solution.adjective.description")}
                                  emphasis={t("solution.adjective.emphasis")}/>
                        <ListItem order={"03"} desc={t("solution.adjectivalNoun.description")}
                                  emphasis={t("solution.adjectivalNoun.emphasis")}/>
                        <ListItem order={"04"} desc={t("solution.classic.description")}
                                  emphasis={t("solution.classic.emphasis")}/>
                        <ListItem order={"05"} desc={t("solution.auxiliary.description")}/>
                    </div>
                </div>
            </div>
            <div className={"w-full min-h-screen flex flex-col pl-10 sm:pl-20 gap-20 justify-center relative z-10"}>
                <div className={"pr-[20px]"}>
                    <p className={`${sloganSize}`}>{t("join.slogan.line1")}</p>
                    <span className={`${sloganSize} emphasis before:bottom-0`}>{t("join.slogan.emphasis")}</span>
                    <span className={`${sloganSize}`}>{t("join.slogan.remainder")}</span>
                </div>
                <div className={"self-start"}>
                    <Button className={"py-4 px-8 md:py-8 md:px-20 xl:py-10 xl:px-28"}>
                        <Link href={"/signup"} className={"text-2xl md:text-4xl"}>{t("join.button")}</Link>
                    </Button>
                </div>
                <div className={"absolute right-0 -z-10 max-w-[20px] md:max-w-[40%] xl:max-w-[50%] h-2/3"}>
                    <Image src={"/landing_decoration.png"} alt={"landing decoration"} width={900} height={700}
                           className={"block h-full object-cover"}  />
                </div>
            </div>
            <Footer />
        </>
    );
}
