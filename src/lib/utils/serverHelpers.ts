import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Todos } from '@/types/Todos';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initTodosData: Todos = { items: {}, topLevelTodos: [], timeStamp: new Date().toISOString() };

export const writeTodos = async (data = initTodosData): Promise<void> => {
    const filePath = path.join(__dirname, '..', '..', '..', 'data', 'data.json');

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

export const readTodos = async (): Promise<Todos> => {
    const filePath = path.join(__dirname, '..', '..', '..', 'data', 'data.json');

    let data;

    try {
        data = await fs.readFile(filePath, 'utf-8');
    } catch (error) {
        if ((error as { code: string }).code === 'ENOENT') {
            await writeTodos();
        }
        return initTodosData;
    }

    return JSON.parse(data);
};

export const generateId = async (currentId?: string): Promise<string> => {
    let id = currentId;

    if (id) {
        id = (parseInt(id, 10) + 1).toString().padStart(4, '0');
        return id;
    }

    const filePath = path.join(__dirname, '..', '..', '..', 'data', 'id.json');
    let idData;

    try {
        idData = await fs.readFile(filePath, 'utf-8');
    } catch (error) {
        if ((error as { code: string }).code === 'ENOENT') {
            idData = JSON.stringify({ id: '0000' });
            await fs.writeFile(filePath, idData);
        } else {
            throw error;
        }
    }

    const idJson = JSON.parse(idData);
    id = (parseInt(idJson.id, 10) + 1).toString().padStart(4, '0');
    await fs.writeFile(filePath, JSON.stringify({ id }, null, 2));
    return id;
};
