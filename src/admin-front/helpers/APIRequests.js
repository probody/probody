const API_URL = 'https://probody.kz/v1';
// const API_URL = 'http://0.0.0.0:4119/v1';
// const PAGE_SIZES = {
//     MAIN: 5,
//     MAIN_MAP: 15,
//     REVIEWS: 3,
//     VACANCY: 5
// };

export default class APIRequests {
    static withCredentials(headers) {
        return {
            'X-Auth-Token': localStorage.getItem('authToken'),
            ...headers
        }
    }

    static withJSON(headers) {
        return {
            'Content-Type': 'application/json',
            ...headers
        }
    }

    static async uploadPic(file, asReplacementFor = undefined) {
        const formData = new FormData();

        formData.append('pic', file);

        return fetch(`https://probody.kz/pic`, {
            method: 'POST',
            headers: APIRequests.withCredentials({
                'X-Replacement-For': asReplacementFor
            }),
            body: formData
        })
    }

    static async getMe() {
        return ((await fetch(`${API_URL}/user/me`, {
            headers: APIRequests.withCredentials()
        })).json())
    }

    static async searchWorkers(page, dto, sortBy, sortDir) {
        return (await fetch(`${API_URL}/admin/worker/search?page=${page}&sortBy=${sortBy}&sortDir=${sortDir}`, {
            method: 'POST',
            headers: APIRequests.withCredentials(APIRequests.withJSON()),
            body: JSON.stringify(dto)
        })).json()
    }

    static logOut() {
        fetch(`https://probody.kz/v1/auth/logout`, {
            method: 'POST',
            headers: APIRequests.withCredentials()
        })
    }

    static async logIn(phone, password) {
        return (await fetch(`${API_URL}/auth/login?admin=1`, {
            method: 'POST',
            headers: APIRequests.withJSON(),
            body: JSON.stringify({
                phone,
                password
            })
        })).json()
    }
}
