import { useContext } from "react";
import { UIContext } from '../UIProvider';
import DarkModeToggle from "react-dark-mode-toggle";

export default function DarkModeButton(){
    const {darkMode, toggleDarkMode} = useContext(UIContext);

    return (
        <DarkModeToggle
            onChange={toggleDarkMode}
            checked={darkMode}
            size={45}
        />
    )
}