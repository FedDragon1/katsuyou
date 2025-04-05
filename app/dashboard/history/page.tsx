import { FC } from "react";
import TabFrame from "@/components/TabFrame";

const HistoryPage: FC = () => {
    return (
        <TabFrame title={"History"}>
            <div className={"text-4xl flex flex-col gap-10 p-20"}>
                <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium aperiam eaque earum in maxime
                    minima, nam nisi quaerat quo rem rerum sequi similique veritatis vero voluptate. Animi dignissimos
                    numquam reiciendis.
                </div>
                <div>Amet aut cupiditate dolores eos nam nobis nostrum quia quibusdam quo reiciendis, rem rerum sit
                    tempore voluptatibus voluptatum? Accusamus assumenda commodi dolor dolorum eum ex inventore magnam
                    porro. Ipsam, suscipit.
                </div>
                <div>Doloribus exercitationem inventore necessitatibus nobis, quas quidem quis repellat. Ad amet aut
                    dolore dolores eveniet hic, labore libero, magni minima nemo nostrum odit optio provident quae quasi
                    repellendus sapiente, similique.
                </div>
                <div>Accusantium alias aliquam amet at deserunt eligendi error est et excepturi expedita fuga fugiat
                    itaque molestias nihil obcaecati, optio praesentium quaerat quam quas sapiente sed sit tempora
                    voluptate voluptatem voluptates?
                </div>
                <div>Accusamus animi blanditiis consequuntur corporis debitis distinctio dolor, eaque earum id incidunt
                    iure magnam nemo possimus quae quaerat quibusdam quod ratione repellendus sapiente sequi similique
                    sunt tempora ullam, veniam voluptatum.
                </div>
            </div>
        </TabFrame>
    )
}

export default HistoryPage