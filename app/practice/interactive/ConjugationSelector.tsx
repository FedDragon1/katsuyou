import { FC } from "react";
import { verbConjugationDisplay } from "@/data/conjugator";

interface SelectorProps {
    setConjugationType: (type: VerbConjugations) => void
    defaultValue: VerbConjugations
}

const ConjugationSelector: FC<SelectorProps> = ({ setConjugationType, defaultValue }) => (
    <div>
        <select name="conjugations"
                defaultValue={defaultValue}
                onChange={(e) => setConjugationType(e.target.value as VerbConjugations)}>
            {Object.entries(verbConjugationDisplay).map(([type, display]) => (
                <option value={type} key={type}>{display}</option>
            ))}
        </select>
    </div>
)

export default ConjugationSelector