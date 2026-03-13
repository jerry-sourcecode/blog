import { TypeJson } from './typeJson.ts';
import { useEmitter } from './emitter.ts';

const updateItem: Set<string> = new Set();
const deleteItem: Set<string> = new Set();
const insertPath: Set<string> = new Set();
// -1表示 empty 发生变化
const updateContent: Set<number> = new Set();

class API {
    static setData(key: string, value: object) {
        localStorage.setItem(key, TypeJson.stringify(value));
    }

    static getData(key: string): any {
        const data = localStorage.getItem(key);
        if (data === null) return null;
        return TypeJson.parse(data);
    }

    static remoteInit(): void {
        const emitter = useEmitter();
        emitter.on('onItemChange', (id) => {
            updateItem.add(id);
        });
        emitter.on('onItemDelete', (id) => {
            deleteItem.add(id);
        });
        emitter.on('onItemAppend', (path) => {
            insertPath.add(path);
        });
        emitter.on('onContentChange', (id) => {
            updateContent.add(id);
        });
        emitter.on('onEmptyChange', () => {
            updateContent.add(-1);
        });
    }

    static remotePush(): number {
        return 0;
    }
}

export { API };
