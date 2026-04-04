// Standard Belbin mapping for 7 sections, 10 options per section (a to j).
// 'j' is treated as a generic/dummy option not mapping to any role for this simplified 10-option formula.
const BELBIN_SCORING_MATRIX = [
    // Section 1
    { a: 'ri', b: 'tw', c: 'co', d: 'pl', e: 'me', f: 'sh', g: 'im', h: 'cf', i: 'sp', j: null },
    // Section 2
    { a: 'im', b: 'co', c: 'sh', d: 'pl', e: 'ri', f: 'me', g: 'tw', h: 'cf', i: 'sp', j: null },
    // Section 3
    { a: 'co', b: 'sh', c: 'pl', d: 'ri', e: 'me', f: 'tw', g: 'im', h: 'cf', i: 'sp', j: null },
    // Section 4
    { a: 'sh', b: 'pl', c: 'ri', d: 'me', e: 'tw', f: 'im', g: 'co', h: 'cf', i: 'sp', j: null },
    // Section 5
    { a: 'pl', b: 'ri', c: 'me', d: 'tw', e: 'im', f: 'co', g: 'sh', h: 'cf', i: 'sp', j: null },
    // Section 6
    { a: 'me', b: 'tw', c: 'im', d: 'co', e: 'sh', f: 'pl', g: 'ri', h: 'cf', i: 'sp', j: null },
    // Section 7
    { a: 'tw', b: 'im', c: 'co', d: 'sh', e: 'pl', f: 'ri', g: 'me', h: 'cf', i: 'sp', j: null }
];

export type FormSection = {
    a: number; b: number; c: number; d: number; e: number;
    f: number; g: number; h: number; i: number; j: number;
};

export type BelbinScores = {
    im: number; co: number; sh: number; pl: number;
    ri: number; me: number; tw: number; cf: number; sp: number;
};

export function calculateBelbinScores(sections: FormSection[]): BelbinScores {
    const scores: BelbinScores = {
        im: 0, co: 0, sh: 0, pl: 0, ri: 0, me: 0, tw: 0, cf: 0, sp: 0
    };

    if (sections.length !== 7) {
        throw new Error("Expected exactly 7 sections");
    }

    sections.forEach((section, index) => {
        const mapping = BELBIN_SCORING_MATRIX[index];
        for (const [key, value] of Object.entries(section)) {
            const role = mapping[key as keyof typeof mapping];
            if (role) {
                scores[role as keyof BelbinScores] += (value || 0);
            }
        }
    });

    return scores;
}
