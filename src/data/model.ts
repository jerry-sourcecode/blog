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
    newSubDir(name: string, type: 'Document'): Document;
    newSubDir(
        name: string,
        type: 'Document' | 'Folder' = 'Folder',
    ): Folder | Document {
        let k;
        if (type === 'Document') k = new Document(name, this, '', '', '');
        else k = new Folder(name, this);
        this.sub.push(k);
        return k;
    }
    getSubDir(name: string, type?: 'Folder'): Folder;
    getSubDir(name: string, type: 'Document'): Document;
    getSubDir(
        name: string,
        type: 'Document' | 'Folder' = 'Folder',
    ): Document | Folder | null {
        return (
            (this.sub.find(
                (x) =>
                    x.name === name &&
                    x instanceof (type === 'Document' ? Document : Folder),
            ) as Document | Folder) ?? null
        );
    }
    subDir(name: string, type?: 'Folder'): Folder;
    subDir(name: string, type: 'Document'): Document;
    subDir(
        name: string,
        type: 'Document' | 'Folder' = 'Folder',
    ): Folder | Document {
        if (type === 'Document')
            return (
                this.getSubDir(name, 'Document') ??
                this.newSubDir(name, 'Document')
            );
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
    filename(): string {
        return this.name;
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
    filename(): string {
        return this.name;
    }
}

class Document extends File {
    writer: string;
    title: string;
    content: string;
    creationTime: Date;
    lastModifiedTime: Date;
    constructor(
        name: string,
        pos: Folder,
        writer: string,
        title: string,
        content: string,
    ) {
        super(name, pos);
        this.writer = writer;
        this.title = title;
        this.content = content;
        this.creationTime = new Date();
        this.lastModifiedTime = new Date();
    }
    toString(): string {
        return super.toString() + '.doc';
    }
    filename(): string {
        return super.filename() + '.doc';
    }
}

export { Folder, File, type Item, Document };
