type Item = File | Folder;

class Folder {
    name: string;
    readonly pos: Folder | null;
    sub: Item[];
    constructor(name: string, pos: Folder | null) {
        this.name = name;
        this.pos = pos;
        this.sub = [];
    }
    newSubDir(name: string, type?: 'Folder'): Folder;
    newSubDir(name: string, type: 'File'): File;
    newSubDir(name: string, type: 'File' | 'Folder' = 'Folder'): Folder | File {
        let k;
        if (type === 'File') k = new File(name, this);
        else k = new Folder(name, this);
        this.sub.push(k);
        return k;
    }
    getSubDir(name: string, type?: 'Folder'): Folder;
    getSubDir(name: string, type: 'File'): File;
    getSubDir(
        name: string,
        type: 'File' | 'Folder' = 'Folder',
    ): Folder | File | null {
        return (
            (this.sub.find(
                (x) =>
                    x.name === name &&
                    x instanceof (type === 'File' ? File : Folder),
            ) as Folder) ?? null
        );
    }
    subDir(name: string, type?: 'Folder'): Folder;
    subDir(name: string, type: 'File'): File;
    subDir(name: string, type: 'File' | 'Folder' = 'Folder'): Folder | File {
        if (type === 'File')
            return this.getSubDir(name, 'File') ?? this.newSubDir(name, 'File');
        else
            return (
                this.getSubDir(name, 'Folder') ?? this.newSubDir(name, 'Folder')
            );
    }
    toString(): string {
        if (this.pos == null) {
            return this.name + '/';
        }
        return this.pos!.toString() + this.name + '/';
    }
}

class File {
    name: string;
    readonly pos: Folder;
    constructor(name: string, pos: Folder) {
        this.name = name;
        this.pos = pos;
    }
    toString(): string {
        return this.pos.toString() + this.name;
    }
}

class Document extends File
{
    writer: string;
    title: string;
    content: string;
    creationTime: Date;
    lastModifiedTime: Date;
    id: string;
    constructor(name: string, pos: Folder, writer: string, title: string, content: string, id: string){
        super(name, pos);
        this.writer = writer;
        this.title = title;
        this.content = content;
        this.id = id;
        this.creationTime = new Date();
        this.lastModifiedTime = new Date();
    }
}

export { Folder, File, type Item, Document };
