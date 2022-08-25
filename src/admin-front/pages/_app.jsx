import '../styles/globals.scss'
import React, {useEffect, useState} from "react"
import AdminLayout from "../layouts/AdminLayout";
import UserHelper from "../helpers/UserHelper";
import AdminLoginPage from "./index";
import {useRouter} from "next/router";

function ProbodyAdmin(props) {
    const {Component: Page, pageProps} = props,
        router = useRouter(),
        [isLoggedIn, setLoggedIn] = useState(false)

    useEffect(() => setLoggedIn(UserHelper.isLoggedIn()), [router])
    useEffect(() => {
        const { fetch: originalFetch } = window;
        window.fetch = async (...args) => {
            let [resource, config ] = args;

            const response = await originalFetch(resource, config);

            if (response.status === 401) {
                UserHelper.logOut()
                router.push('/')
            }

            return response;
        };
    }, [])

    return isLoggedIn ? <AdminLayout>
        <Page {...pageProps} />
    </AdminLayout> : <AdminLoginPage {...pageProps} />
}

export default React.memo(ProbodyAdmin)
