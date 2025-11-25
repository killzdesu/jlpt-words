export const parseCSV = <T>(csvText: string): Promise<T[]> => {
    return new Promise((resolve) => {
        const lines = csvText.split(/\r?\n/).filter(l => l.trim());
        if (lines.length === 0) {
            resolve([]);
            return;
        }

        const firstLine = lines[0];
        if (!firstLine) {
            resolve([]);
            return;
        }

        const headers = parseLine(firstLine);
        const result: T[] = [];

        for (let i = 1; i < lines.length; i++) {
            const currentLine = lines[i];
            if (!currentLine || !currentLine.trim()) continue;

            const values = parseLine(currentLine);
            const obj: any = {};
            headers.forEach((header, index) => {
                obj[header] = values[index] || '';
            });
            result.push(obj as T);
        }
        resolve(result);
    });
};

function parseLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuote = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (inQuote) {
            if (char === '"') {
                if (i + 1 < line.length && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuote = false;
                }
            } else {
                current += char;
            }
        } else {
            if (char === '"') {
                inQuote = true;
            } else if (char === ',') {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
    }
    result.push(current);
    return result;
}
