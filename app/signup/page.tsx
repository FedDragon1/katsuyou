import { FC } from "react";
import LandingNav from "@/components/LandingNav";
import Footer from "@/components/Footer";
import SignupForm from "@/components/SignupForm";

const SignupPage: FC = () => {
    return (
        <>
            <div className={"h-[40vh] sm:h-[60vh] sm:min-h-[400px]"}>
                <LandingNav hideOptions sticky/>
            </div>
            <div className={"w-full relative"}>
                <SignupForm />
            </div>
            <Footer/>
        </>
    )
}

export default SignupPage