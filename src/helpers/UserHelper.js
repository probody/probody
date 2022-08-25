import APIRequests from "./APIRequests.js";

export default class UserHelper {
    static logIn(jwt) {
        localStorage.setItem('authToken', jwt);
    }

    static logOut() {
        APIRequests.logOut()
        localStorage.removeItem('authToken');
    }

    static isLoggedIn() {
        return !!window.localStorage.getItem('authToken')?.length
    }

    static currentRegion() {
        return JSON.parse(window.localStorage.getItem('currentRegion'))
    }

    static regions() {
        return JSON.parse(window.localStorage.getItem('regions'))
    }

    static setRegion(regionName) {
        const regions = UserHelper.regions()

        window.localStorage.setItem('currentRegion', JSON.stringify(regions.find(i => i.name === regionName)))
    }
}
