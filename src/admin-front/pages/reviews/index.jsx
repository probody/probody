import Head from "next/head";
import {TITLE_POSTFIX} from "../../helpers/constants";

export default function ReviewsPage(props) {
    return <>
        <Head>
            <title>Отзывы{TITLE_POSTFIX}</title>
        </Head>

        отзывы
    </>
}
