export default function PlaceMark(pm) {
    const emptyLayout = window.ymaps.templateLayoutFactory.createClass('')

    return {
        async open(t, infoPromise) {
            const cardBody = `
<svg width="141" height="40" viewBox="0 0 141 40" xmlns="http://www.w3.org/2000/svg">
    <style>
        .text {
            font-family: 'Lato', sans-serif;
            font-size: 12px;
        }
    </style>

    <g>
        <path d="M14.5 10C14.5 4.47715 18.9772 0 24.5 0H130.5C136.023 0 140.5 4.47715 140.5 10V30C140.5 35.5228 136.023 40 130.5 40H14.5V10Z"
              fill="white" fill-opacity="0.94"/>
        <text dx="33" dy="12" class="text" color="#252420">%s</text>
    </g>

    <g clip-path="url(#clip0_3219_98048)">
        <path d="M33.8333 27.5931C33.9572 27.5008 34.0491 27.3721 34.0961 27.2249C34.1431 27.0777 34.1429 26.9196 34.0955 26.7725C34.0481 26.6255 33.9558 26.497 33.8317 26.405C33.7075 26.3131 33.5577 26.2623 33.4033 26.2598L30.4033 26.1464C30.3885 26.1454 30.3744 26.1402 30.3626 26.1313C30.3507 26.1224 30.3417 26.1103 30.3366 26.0964L29.2999 23.2964C29.2479 23.154 29.1533 23.031 29.0289 22.9441C28.9046 22.8572 28.7566 22.8105 28.6049 22.8105C28.4533 22.8105 28.3053 22.8572 28.1809 22.9441C28.0566 23.031 27.962 23.154 27.9099 23.2964L26.8766 26.1064C26.8715 26.1203 26.8625 26.1324 26.8507 26.1413C26.8388 26.1502 26.8247 26.1554 26.8099 26.1564L23.8099 26.2698C23.6555 26.2723 23.5057 26.3231 23.3815 26.415C23.2574 26.507 23.1652 26.6355 23.1178 26.7825C23.0703 26.9296 23.0701 27.0877 23.1171 27.2349C23.1642 27.3821 23.2561 27.5108 23.3799 27.6031L25.7333 29.4531C25.7451 29.4624 25.7539 29.4749 25.7586 29.4891C25.7633 29.5033 25.7638 29.5186 25.7599 29.5331L24.9499 32.4031C24.908 32.5492 24.912 32.7048 24.9616 32.8485C25.0111 32.9923 25.1038 33.1173 25.2269 33.2065C25.35 33.2958 25.4976 33.3449 25.6497 33.3473C25.8017 33.3497 25.9508 33.3051 26.0766 33.2198L28.5633 31.5531C28.5755 31.5446 28.5901 31.5401 28.6049 31.5401C28.6198 31.5401 28.6344 31.5446 28.6466 31.5531L31.1333 33.2198C31.2574 33.308 31.406 33.3555 31.5583 33.3555C31.7106 33.3555 31.8591 33.308 31.9833 33.2198C32.1064 33.1314 32.1991 33.007 32.2487 32.8637C32.2982 32.7205 32.3022 32.5654 32.2599 32.4198L31.4433 29.5398C31.439 29.5253 31.4392 29.5099 31.444 29.4955C31.4487 29.4812 31.4578 29.4687 31.4699 29.4598L33.8333 27.5931Z"
              fill="#252420"/>
    </g>

    <text dx="36" dy="33" class="text">%s</text>
    <path d="M13.8808 35.0829C14.4904 33.4892 15.8329 32.3217 17.137 31.2214C18.8872 29.7447 20 27.5281 20 25.05C20 20.6041 16.4183 17 12 17C7.58172 17 4 20.6041 4 25.05C4 27.5281 5.11279 29.7447 6.86298 31.2214C8.16709 32.3217 9.50957 33.4892 10.1192 35.0829L11.533 38.7791C11.6969 39.2076 12.3031 39.2076 12.467 38.7791L13.8808 35.0829Z"
          fill="#252420"/>
    <circle cx="12" cy="25" r="4" fill="#FFC83A"/>
    <defs>
        <clipPath id="clip0_3219_98048">
            <rect width="12" height="12" fill="white" transform="translate(22.5 22)"/>
        </clipPath>
    </defs>
</svg>
`

            pm.options.set('iconImageHref', '/icons/dot_empty.svg')
            pm.options.set('iconContentLayout', window.ymaps.templateLayoutFactory.createClass(
                cardBody.replace('%s', t('loading')).replace('%s', '0.0')
            ))

            const salonInfo = await infoPromise

            pm.options.set('iconContentLayout', window.ymaps.templateLayoutFactory.createClass(
                cardBody.replace('%s', salonInfo.worker.name).replace('%s', salonInfo.review.length === 0 ? '0.0' : salonInfo.review[0].avg.toFixed(1))
            ))

            pm.options.set('opened', true)
        },

        close() {
            if (pm.options.get('opened') === false) {
                return
            }

            pm.options.set('iconContentLayout', emptyLayout)
            pm.options.set('iconImageHref', '/icons/dot.svg')
            pm.options.set('opened', false)
        },

        setActive() {
            // console.log(pm.options.get('iconContentLayout'))
            // pm.options.set('iconContentLayout', ')
        }
    }
}
