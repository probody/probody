import css from '../styles/components/cards.module.scss'
import {cnb} from "cnbuilder";
import {useEffect} from "react";

export default function WorkerClosedCard({dto}) {
    useEffect(() => console.log(dto), [])
    return <div className={cnb("card", "fullwidth", css.root)}>
        <div className="card-body" style={{display: "flex", gap: '0 32px'}}>
            <img className={css.pic} width={335} height={240} src={dto.photos[0]} alt={"Фото " + dto.name}/>
            <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '24px 0'}}>
                <div>isVerified</div>
                <div style={{flexGrow: 1}}>title <br/> text</div>
                <div style={{display: "flex", gap: '0 40px'}}>
                    <div>
                        <p className={'textXS'} style={{marginBottom: 8}}>Город</p>
                        <p className={'textSBold'}>{dto.region.name}</p>
                    </div>

                    <div>
                        <p className={'textXS'} style={{marginBottom: 8}}>Мессенджеры</p>
                        <p className={'textSBold'}>{Object.values(dto.messengers || {}).some(i => i.length > 0) ? 'Есть' : 'Нет'}</p>
                    </div>

                    {dto.kind === 'salon' && <div>
                        <p className={'textXS'} style={{marginBottom: 8}}>Мастера</p>
                        <p className={'textSBold'}>{dto.masters.length}</p>
                    </div>}

                    <div>
                        <p className={'textXS'} style={{marginBottom: 8}}>Услуги</p>
                        <p className={'textSBold'}>{dto.programs.length}</p>
                    </div>
                </div>
            </div>
            <div className={css.actions}>
                <div>approve</div>
                <div>decline</div>
                <div>pause</div>
                <div>edit</div>
            </div>
        </div>
    </div>
}
