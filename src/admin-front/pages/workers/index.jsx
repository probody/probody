import {TITLE_POSTFIX} from "../../helpers/constants";
import Head from "next/head";
import {useState} from "react";
import useAsyncEffect from "../../helpers/AsyncEffect";
import APIRequests from "../../helpers/APIRequests";
import WorkerClosedCard from "../../components/WorkerClosedCard";

export default function WorkersPage(props) {
    const [tab, setTab] = useState('all'),
        [query, setQuery] = useState(''),
        [salons, setSalons] = useState([]),
        [page, setPage] = useState(1),
        [pageCnt, setPageCnt] = useState(1)

    useAsyncEffect(runSearch, [tab])

    async function runSearch() {
        console.group('searching:')
        console.log('tab', tab)
        console.log('query', query)
        console.groupEnd()

        APIRequests.searchWorkers(page, {query, tab}, 'createdAt', 'ASC').then(salons => {
            setPageCnt(salons.pageCount)
            setSalons(salons.results)
        })
    }

    return <>
        <Head>
            <title>Анкеты{TITLE_POSTFIX}</title>
        </Head>

        <form onSubmit={e => {
            e.preventDefault()

            runSearch()
        }}>
            <a href="javascript:void(0)" onClick={() => setTab('all')}>Все</a>&nbsp;
            <a href="javascript:void(0)" onClick={() => setTab('salons')}>Салоны</a>&nbsp;
            <a href="javascript:void(0)" onClick={() => setTab('salonMasters')}>Мастера
                салонов</a>&nbsp;
            <a
                href="javascript:void(0)" onClick={() => setTab('privateMasters')}>Частные мастера</a>&nbsp;
            <a href="javascript:void(0)" onClick={() => setTab('paused')}>На паузе</a>&nbsp;
            <a
                href="javascript:void(0)" onClick={() => setTab('archive')}>Архив</a>

            <div className="flex" style={{gap: 8}}>
                <p className={'textSubtitle2'} style={{marginRight: 24}}>Фильтр</p>
                <input style={{flexGrow: 1}} type="text" placeholder={'Название салона или имя частного мастера'}
                       value={query} onInput={e => setQuery(e.target.value)}/>
                <button>Верификация: все</button>
                <button>Аккаунт: Standard</button>
            </div>
        </form>

        <div style={{marginTop: 48, display: 'flex', flexDirection: 'column', gap: '16px 0'}}>
            {salons.map((worker, i) =>
                <WorkerClosedCard dto={worker} key={i} />
            )}
        </div>
    </>
}
