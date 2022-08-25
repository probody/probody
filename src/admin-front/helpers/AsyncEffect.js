import {useEffect} from "react";

const useAsyncEffect = (fn, deps) => useEffect(() => {
    fn()
}, deps)

export default useAsyncEffect
