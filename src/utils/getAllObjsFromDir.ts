import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const getAllObjsFromDir = async <T>(dirname: string): Promise<T[]> => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const objsFolderPath = path.join(__dirname, `../${dirname}`);

    const objs: T[] = [];

    const objFiles = fs
        .readdirSync(objsFolderPath)
        .filter((file) => file.endsWith('.js') || file.endsWith('.ts'));

    for (const objFile of objFiles) {
        const absolutePathToObjFile = path.join(objsFolderPath, objFile);
        const obj = (await import(absolutePathToObjFile)).default;

        objs.push(obj);
    }

    return objs;
};

export default getAllObjsFromDir;
