import Head from "next/head";
import {TITLE_POSTFIX} from "../../helpers/constants";

export default function AccountsPage(props) {
    return <>
        <Head>
            <title>Аккаунты{TITLE_POSTFIX}</title>
        </Head>

        аккаунты
    </>
}
