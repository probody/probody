import Head from "next/head";
import {TITLE_POSTFIX} from "../../helpers/constants";

export default function VacanciesPage(props) {
    return <>
        <Head>
            <title>Вакансии{TITLE_POSTFIX}</title>
        </Head>

        вакансии
    </>
}
