import { useContext } from "react";
import { UIContext } from "../../../Components/UIProvider";

function ToggleMode() {
    const {clueMode, toggleClueMode} = useContext(UIContext);

    return(
        <div className="toggleMode mb-1" >
            <label className="switch">
                <input type="checkbox" readOnly checked={clueMode} id="togBtn" onClick={(e) => { toggleClueMode()}}/>
                <div className="slider round">
                    <span className="on fw-bold">Astuces</span>
                    <span className="off fw-bold">Questions</span>
                </div>
            </label>
        </div>
    )
}

export default ToggleMode;