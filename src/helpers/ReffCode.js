export const REFFCODE_LENGTH = 6

export default class ReffCode {
    static generate() {
        let code = ''
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            charactersLength = characters.length

        for (let i = 0; i < REFFCODE_LENGTH; i++) {
            code += characters.charAt(Math.floor(Math.random() *
                charactersLength))
        }

        return code
    }
}
