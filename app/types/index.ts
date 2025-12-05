export interface Question {
    wordId: string;
    wordText: string;
    level: string;
    questionText: string;
    correctAnswer: string;
    choices: string[];
    hint: string;
    type: string;
    detail: {
        reading: string;
        meaning: string;
    };
}
