import Head from "next/head";
import {TITLE_POSTFIX} from "../../helpers/constants";

export default function NewsPage(props) {
    return <>
        <Head>
            <title>Блог{TITLE_POSTFIX}</title>
        </Head>

        блог
    </>
}
