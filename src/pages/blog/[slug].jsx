import {withRouter} from "next/router.js";
import React from "react";
import ShareInSocialMedia from "../../components/ShareInSocialMedia";
import ArticleCard from "../../components/ArticleCard.jsx";
import {GlobalContext} from "../../contexts/Global.js";
import Breadcrumbs from "../../components/kit/Breadcrumbs.jsx";
import Head from "next/head.js";
import {TITLE_POSTFIX} from "../../helpers/constants.js";

class BlogArticlePage extends React.Component {
    static contextType = GlobalContext

    constructor(props) {
        super(props);

        this.state = {
            article: {},
            similarArticles: []
        }
    }

    componentDidMount() {
        //fetch article with id {this.props.router.query.slug}
        this.setState({
            article: {
                "_id": "629f26fb379f441955fb448e",
                "title": "Что блокирует мужскую энергию?",
                "photos": [
                    "https://img.championat.com/s/735x490/news/big/d/l/tehnika-tochechnogo-massazha-dlja-pohudenija_15905066501829841550.jpg",
                    'https://novaya.com.ua/wp-content/uploads/2021/09/massazh-spiny-1.jpg'
                ],
                "text": "Самая важная энергия – это, безусловно, энергия жизни или же мужская энергия. От  нее  напрямую  зависит  наша  реализация  в  обществе,  успех,  умение  притягивать возможности, здоровье и вообще все. Потому что сама жизнь и является проявленной энергией от нее действительно зависит многое. Но к большому сожалению у многих из нас она проседает и мы используем свой потенциал максимум на 10%.<br/>  Почему так происходит? Что  блокирует мужскую   энергию  и не дает  раскрыть потенциал  на  все  100?  Как  быстро  убрать  мужские    блоки? Ответы  на  эти  и  многие другие интересные вопросы вы узнаете в этой статье.<br/><br/>  <h2>Что такое энергия?</h2> В  классическом  понимании  энергия  -  это  нечто,  что  образуется  в  результате взаимодействия частиц. Как топливо, электричество или вибрации. Для человека это активность, удовольствие, наслаждение, драйв и все, что связанно с этими понятиями. Так, например, после занятий спортом мы чувствуем прилив жизненной энергии из-за возбуждения и изменения гормонального фона. <br><br>  Также,  прилив  сил  и  повышенная  возбужденность  после  подписания удачного контракта, победы любимой футбольной команды, покупки дорогого автомобиля тоже характеризуют повышение мужской  энергии. <br><br>  <i><b>Жизненная  энергия  генерируется  практически  во  время  любого  жизненного процесса,  за  исключением  сна.  Только  в  каком-то  процессе  она  слабо производится, а каком-то сильно.</b></i><br><br> <h2> Как понять что мужская энергия заблокирована</h2> Мужская  энергия  проявляется  на  всех  уровнях  нашей  жизни  :  физическом, психологическом  и  духовным.  Когда  происходит  блокировка  на  одном  уровне, постепенно блокируются остальные. Поэтому решать проблемы в любом случае нужно будет комплексно. Но, для начала давайте охарактеризуем проблемы каждого уровня.<br/><br>  <h3>Физиологический</h3> Пониженное  либидо,  трудно  получить  удовольствие  от  обыденных  радостей апатия,  млявость. Могут  быть  проблемы  со  сном,  быстро  падает  продуктивность  и утомляемость. Если все это сопровождает вас больше месяца, и при этом не связано с болезнью, значит физиологический уровень поврежден. <br><br> Иногда на этом этапе хватает качественного отдыха без раздражителей. Когда организм  полностью  восстанавливается,  он  автоматически  приводит  все  жизненные процессы в нормальное состояние. <br>    <br />" +
                        "<h3>Психологический</h3> Повышенная  эмоциональность  и  раздражительность,  комплексы  и  страхи, нежелание проявлять себе, отсутствие новых целей и достижений. Когда болит душа, это автоматически  отражается на социальном мире и эмоциональном состоянии. Как правило,  именно  психологические  блоки    или  ранние  детские  травмы  служат  катализатором блокировки мужской энергии. <br><br>  В  жизни  человека  случается  определенное  событие,  которое  резонирует  с травмой  полученной  в  детстве  (например:  ради  хороших  денег  нужно  угробить здоровье,  и  когда  в  жизни  появляются  те  самые  деньги  активируется  программа уничтожения). и запускает цепную реакцию. Подробнее о психологических причинах мы расскажем ниже. Сейчас же просто отметим, что: <br><br> <b> При  наличии  психологических  блоков  обязательно  нужно  обратится  к психологу.</b><br><br>  <h3>Духовный</h3> Это тонкий уровень и его ощущает немного людей. Духовные конфликты обычно появляются при внешней материальной благополучности, стабильном эмоциональном фоне и отсутствием комплексов, и их можно только ощутить. <br>  Человеку  с  заблокированной  мужской  энергией  на  духовном  уровне  хочется делиться знаниями, помогать другим людям, уже не интересны просто большие деньги. <br> Духовные проблемы - верный признак того, что вы готовы перейти на следующий уровень в своем развитии и направлять энергии в нечто большее. Обычно это называют миссией или предназначением. <br><br>  Все эти уровни всегда стоит развивать в комплексе. Даже, если сейчас вам 30 лет и о ни о каком предназначении вы не думаете или на данном этапе считаете, что духовность  не  про  вас.  Это  понятие  тоже  можно  очень  широко  трактовать,  но  не  в рамках сегодняшней статьи.  <br><br> <h2>Что блокирует мужскую энергию?</h2><br>  <h3>Физический уровень</h3> Все,  что  касается  здоровья  и  образа  жизни:  вредные  привычки,  отсутствие качественного  отдыха,  плохое  питание,  малоактивный  образ  жизни,  любые  болезни. Без крепкого здоровья говорить  о проявленной мужской энергии и как ее использовать нет смысла. У больного человека попросту не хватит сил ее реализовать. Поэтому, если хотите повысить уровень мужской энергии, нужно однозначно пройти полный check-up организма и начать вести правильный образ жизни.  <br><br>    <h3>Психологический уровень</h3>" +
                        "Все то о жизни , что мы слышали в детстве или же просто молча воспринимали из коллективного поля во взрослом возрасте блокирует жизненную энергию. Многим с малых  лет  внушали,  что  жить  хорошо,  иметь  много  или  постоянно  радоваться нехорошо. Нужно страдать и постоянно следовать за обществом. <br>Также, многие из нас выросли на теории идеального человека . Будто есть вот идеальный человек, у которого и доход, и здоровье и образ жизни идеален, он успевает заниматься собой и хобби, а также много времени посвящает благотворительности. И вот  мы  такие  неидеальные  постоянно  требуем  от  себя  чересчур  чтобы  таки  стать похожим  на  свой  идеал.  И  в  итоге  попросту  выгораем,  даже  не  понимая  почему  так сильно себя загнали.  <br>  Психологические  блоки    могли  возникнуть  даже  из-за  того,  что  вы  спали  с родителями в одной комнате и волей не волей, но хоть раз были пассивным участником процесса. Отсюда мог быть сделать вывод: сексуальная энергия - это вред для других людей. <br><br> <b><i>Все  психологические  блоки  являются  иррациональными  и  обнаружить  их  у себя самостоятельно не получиться. Чтобы выявить их нужно обратиться к психологу.</i></b><br><br>  <h3>Духовный уровень</h3> На  этом  уровне  проблемы  возникают  из-за  того,  что  человек  долго  отрицает важность духовной составляющей, не понимает что для него значит духовность или же имеет на этот счет множество предрассудков. Такое часто бывает если определенное время  человек  посещает  кардинальные  религиозные  сообщества  или  же воспитывается  в  семье,  где  религия  прививается  жестким  образом.  Во  взрослом возрасте это влияет и на психику, и на само понятие духовности. <br><br>  <b><i>Чтобы убрать блоки на этом уровне, нужно сначала убрать психологические блоки. Без этого работать с духовностью не получиться.</i></b> <br><br>  <h2>Как боди массаж помогает убрать сексуальные блоки?</h2>  Боди  массаж  задействует  два  основных  уровня,  на  которых  возникают сексуальные блоки - физический(физиологический) и психологический. <br>  На  физическом уровне массаж  помогает  человеку  расслабить  мышцы,  убрать спазмы,  нормализовать  обмен  веществ  и  усилить  лимфоток.  После  процедуры организм  освобождается  от  накопившихся  токсинов,  которые  в  будущем  могли закупоривать сосуды. <br> Что же происходит с психологией? Любая непрожитая  эмоция или полученная психологическая травма  оставляют  свой  отпечаток  на  теле  (об  этом  много  говорит психосоматика).  Во  время  массажа  мастер  снимая  спазмы,  параллельно  убирая психологические блоки (психика воздействует на соматику, и наоборот). Таким образом после  боди  массажа  освобождается  огромное  количество  мужской  энергии,  которую можно  направлять  на  собственные  достижения  и    реализацию,  повышается  уровень потенции  и  улучшается  общее  состояние  здоровье.  Плюс  как  бонус  человек расслабляется после одного массажа так, как после дня проведенного в спа. <br><br>" +
                "<h3>Куда направить высвожденную энергию?</h3>Освобожденную мужскую энергию можно направить на улучшение любой сферы жизни: здоровье, семья. реализация, духовность и т.д. Когда человек чувствует прилив и уверенность, придумать куда направить энергию несложно. Главное не сливать ее на бессмысленное времяпровождение или на то, что не способствует улучшению качества жизни. <br><br>Телесные  и  психологические  блоки  есть  в  90%  населения  СНГ,  однако большинство их не осознает. И это нормально. Ты не начнешь осознавать пока не с чем сравнить.  Поэтому,  рекомендуем  выполнять  рекомендации  из  статьи  на  протяжении месяца,  и  тогда  вы  точно  поймете  какие  у  вас  блоки  были  и  насколько  сильно  они мешали реализовать свой потенциал.",
                "slug": "Derf434808",
                "tag": 'Мужская энергия',
                "createdAt": "2022-05-07T10:22:51.952Z",
                "updatedAt": "2022-06-07T10:22:51.952Z"
            }
        })

        //fetch similar articles {this.props.router.query.slug}
        this.setState({
            similarArticles: [
                {
                    "_id": "629f26fb379f441955fb448e",
                    "title": "Spikefish southern grayling cutthroat trout",
                    "photos": [
                        "https://images.ukrsalon.com.ua/files/1/1558/1369622/original/20120814155054.jpg",
                        'https://img.championat.com/s/735x490/news/big/q/j/massazh-kotoryj-umenshit-vashi-formy-vy-prosto-lezhite-i-hudeete_1564681008234562299.jpg',
                        'https://stamina.center/ru/wp-content/uploads/sites/2/2019/10/Stamina-likuvalnyj-masazh-01.jpg'
                    ],
                    "text": "Jellynose fish snook tiger shovelnose catfish; Pacific saury whitetip reef shark snake mudhead. Rock bass bristlemouth plunderfish yellow tang mudsucker hardhead catfish rough scad. Neon tetra, queen parrotfish lenok Pacific herring combtooth blenny blue eye blackchin duckbill cobbler! Black bass, Oriental loach slender snipe eel Norwegian Atlantic salmon porbeagle shark handfish buri! Flagblenny marlin saber-toothed blenny electric eel yellow perch, flathead smooth dogfish! Flagtail African lungfish trumpeter livebearer pickerel flat loach Australian prowfish.\n" +
                        "<br />" +
                        "Garden eel luderick jewfish ghost carp Kafue pike Rasbora electric knifefish firefish, cod. Frogmouth catfish, baikal oilfish candlefish baikal oilfish sind danio dogfish redtooth triggerfish emperor. Coolie loach lumpsucker trumpeter swordtail tidewater goby South American darter. Whitebait, inconnu North American darter greeneye; tapetail Indian mul. Píntano rock cod electric catfish. Sea devil sturgeon whalefish yellow bass ricefish barreleye Black angelfish squawfish threespine stickleback Cornish Spaktailed Bream. Pollock, cavefish pink salmon Sacramento blackfish king of herring. Goosefish parrotfish Colorado squawfish dealfish man-of-war fish, longfin escolar Celebes rainbowfish ghost flathead soldierfish zebra lionfish dogfish smoothtongue driftfish, pencilsmelt soldierfish porcupinefish wahoo Pacific argentine. Deep sea bonefish pikehead butterflyfish redmouth whalefish oilfish fire bar danio.",
                    "slug": "Derf808",
                    tag: 'Мужская энергия',
                    "createdAt": "2022-06-07T10:22:51.952Z",
                    "updatedAt": "2022-06-07T10:22:51.952Z"
                },
                {
                    "_id": "629f26fb379f441955fb448e",
                    "title": "Spikefish southern grayling cutthroat trout",
                    "photos": [
                        "https://images.ukrsalon.com.ua/files/1/1558/1369622/original/20120814155054.jpg",
                        'https://img.championat.com/s/735x490/news/big/q/j/massazh-kotoryj-umenshit-vashi-formy-vy-prosto-lezhite-i-hudeete_1564681008234562299.jpg',
                        'https://stamina.center/ru/wp-content/uploads/sites/2/2019/10/Stamina-likuvalnyj-masazh-01.jpg'
                    ],
                    "text": "Jellynose fish snook tiger shovelnose catfish; Pacific saury whitetip reef shark snake mudhead. Rock bass bristlemouth plunderfish yellow tang mudsucker hardhead catfish rough scad. Neon tetra, queen parrotfish lenok Pacific herring combtooth blenny blue eye blackchin duckbill cobbler! Black bass, Oriental loach slender snipe eel Norwegian Atlantic salmon porbeagle shark handfish buri! Flagblenny marlin saber-toothed blenny electric eel yellow perch, flathead smooth dogfish! Flagtail African lungfish trumpeter livebearer pickerel flat loach Australian prowfish.\n" +
                        "<br />" +
                        "Garden eel luderick jewfish ghost carp Kafue pike Rasbora electric knifefish firefish, cod. Frogmouth catfish, baikal oilfish candlefish baikal oilfish sind danio dogfish redtooth triggerfish emperor. Coolie loach lumpsucker trumpeter swordtail tidewater goby South American darter. Whitebait, inconnu North American darter greeneye; tapetail Indian mul. Píntano rock cod electric catfish. Sea devil sturgeon whalefish yellow bass ricefish barreleye Black angelfish squawfish threespine stickleback Cornish Spaktailed Bream. Pollock, cavefish pink salmon Sacramento blackfish king of herring. Goosefish parrotfish Colorado squawfish dealfish man-of-war fish, longfin escolar Celebes rainbowfish ghost flathead soldierfish zebra lionfish dogfish smoothtongue driftfish, pencilsmelt soldierfish porcupinefish wahoo Pacific argentine. Deep sea bonefish pikehead butterflyfish redmouth whalefish oilfish fire bar danio.",
                    "slug": "Derf808",
                    tag: 'Мужская энергия',
                    "createdAt": "2022-06-07T10:22:51.952Z",
                    "updatedAt": "2022-06-07T10:22:51.952Z"
                }
            ]
        })
    }

    render() {
        const {t} = this.context

        return <section>
            <Head>
                <title>{this.state.article.title || t('record')}{TITLE_POSTFIX}</title>
            </Head>

            <Breadcrumbs items={[
                {
                    name: t('mainPage'),
                    href: '/',
                },
                {
                    name: t('records'),
                    href: '/blog',
                },
                {
                    name: this.state.article.title || t('record'),
                    href: '/blog/' + this.state.article.slug,
                }
            ]} />
            <div bp={'grid'}>
                <div bp={'12 8@md'}>
                    {this.state.article.title &&
                        <ArticleCard single={true} title={this.state.article.title} photos={this.state.article.photos}
                                     slug={this.state.article.slug} tag={this.state.article.tag}
                                     createdAt={this.state.article.createdAt}/>}
                    <div className={'responsive-content'}>
                        <p style={{padding: '24px 0'}} dangerouslySetInnerHTML={{__html: this.state.article.text}}/>
                        <h2 style={{marginBottom: 12}}>{t('otherNews')}</h2>
                    </div>
                    <div bp={'grid'}>
                        {this.state.similarArticles.length && this.state.similarArticles.map((article, index) =>
                            <div bp={'12 6@md'} key={index}>
                                <ArticleCard {...article} />
                            </div>
                        )}
                    </div>
                </div>
                <div bp={'12 4@md'}>
                    <ShareInSocialMedia url={'https://probody.kz/blog/' + this.state.article.slug}/>
                </div>
            </div>
        </section>;
    }
}

export default withRouter(BlogArticlePage);
