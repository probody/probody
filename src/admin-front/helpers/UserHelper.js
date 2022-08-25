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
}
