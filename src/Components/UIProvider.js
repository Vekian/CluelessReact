import { createContext, useState } from "react"

export const UIContext = createContext();

// début du composant
export default function UIProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [clueMode, setClueMode] = useState(false);
  const [filterQuestion, setFilterQuestion] = useState(['?page=1', '']);
  const [filterClue, setFilterClue] = useState(['?page=1', '']);

  function toggleDarkMode() {
    setDarkMode(!darkMode);
  }

  function toggleClueMode() {
    setClueMode(!clueMode);
  }

  function changeFilterQuestion(filter){
    setFilterQuestion(filter);
  }

  function changeFilterClue(filter){
    setFilterClue(filter);
  }
  return (
    <UIContext.Provider
    value={ {darkMode, toggleDarkMode, clueMode, toggleClueMode, filterQuestion, changeFilterQuestion, filterClue, changeFilterClue} }>
      {children}
    </UIContext.Provider>
  )
}