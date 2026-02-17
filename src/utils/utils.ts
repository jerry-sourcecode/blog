import { Document, Folder } from '../data/model.ts';
import { useFileSystemStore } from '../data/data.ts';

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 递归恢复文件夹及其子项的位置和内容。由于经过 TypeJsaon 压缩后 pos_obj 会消失，因此粗腰进行还原
 * @param fol - 要恢复的文件夹对象。
 * @return 没有返回值。此方法通过修改传入的文件夹对象来工作。
 */
function recovery(fol: Folder) {
    const dataStore = useFileSystemStore();
    fol.sub.forEach((item) => {
        item.pos = dataStore.fromString<Folder>(item.pos_path!);
        if (item instanceof Folder) {
            recovery(item);
        } else if (item instanceof Document) {
            item.tmpContent = item.content;
        }
    });
}

export { formatDate, recovery };
