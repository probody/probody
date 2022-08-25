import React from "react"

export const GlobalContext = React.createContext({
    isLoggedIn: false,
    setLoggedIn: Function.prototype,
    isMobile: false
});
