import { TypeJson } from './typeJson.ts';

class API {
    static setData(key: string, value: object) {
        localStorage.setItem(key, TypeJson.stringify(value));
    }

    static getData(key: string): any {
        const data = localStorage.getItem(key);
        if (data === null) return null;
        return TypeJson.parse(data);
    }
}

export { API };
