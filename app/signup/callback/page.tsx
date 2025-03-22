import { FC } from "react";
import LandingNav from "@/components/LandingNav";
import Footer from "@/components/Footer";
import SignupCallback from "@/components/SignupCallback";

const SignupPage: FC = () => {
    return (
        <>
            <div className={"h-[40vh] sm:h-[60vh] sm:min-h-[400px]"}>
                <LandingNav hideOptions sticky/>
            </div>
            <div className={"w-full"}>
                <SignupCallback />
            </div>
            <Footer/>
        </>
    )
}

export default SignupPage