import { defineStore } from 'pinia'
import { ref } from "vue";
import { File, Folder, type Item } from "./model.ts";

export const useFileSystemStore = defineStore('FileSystem', () => {
    const root = ref<Folder>(new Folder(':', null));

    function fromString(path: string): Item | null {
        const parts = path.split('/').filter(Boolean); // Split the path and remove empty strings
        let current: Folder = root.value;
        const findFile = path[path.length - 1] !== '/';

        for (let i = 1, len = parts.length; i < len; i++) {
            const part = parts[i];
            let found = false;
            for (const sub of current.sub) {
                if (i == len - 1 && findFile && sub instanceof Folder) continue;
                if (i == len - 1 && !findFile && sub instanceof File) continue;
                if (sub.name === part) {
                    if (sub instanceof File){
                        if (!findFile || i != len - 1){
                            continue;
                        } else {
                            return sub;
                        }
                    }
                    current = sub;
                    found = true;
                    break;
                }
            }
            if (!found) { // If not found, create a new one
                return null;
            }
        }
        return current;
    }

    return {
        root,
        fromString
    }
})