class API {
    static setData(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static getData(key: string): any {
        return localStorage.getItem(key);
    }
}

export { API };
