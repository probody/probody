import Head from "next/head";
import {TITLE_POSTFIX} from "../../helpers/constants";

export default function StatsPage(props) {
    return <>
        <Head>
            <title>Статистика{TITLE_POSTFIX}</title>
        </Head>

        статистика
    </>
}
