export const post = (url: string, params: RequestInit = {}): Promise<unknown> =>
	fetch(url, { ...params, method: "POST" }).then((response) => {
		if (!response.ok) {
			throw new Error(response.statusText);
		}
		return response.json();
	});

export function assert(condition: boolean, msg?: string): asserts condition {
	if (!condition) {
		throw new Error(msg || "condition is not truthy");
	}
}

const femaleWords = ["she", "her"];
const maleWords = ["he", "him", "his"];
const genderedWords = [...femaleWords, ...maleWords];

const startRegExp = "(^|\\s)";
const endRegExp = "($|\\s)";
export const femaleTokenRegExp = new RegExp(
	femaleWords.map((word) => `^${word}$`).join("|"),
	"i",
);
export const maleTokenRegExp = new RegExp(
	maleWords.map((word) => `^${word}$`).join("|"),
	"i",
);
export const genderedElementRegExp = new RegExp(
	genderedWords.map((word) => `${startRegExp}${word}${endRegExp}`).join("|"),
	"gi",
);

export const mask = (text: string): string =>
	text.replace(genderedElementRegExp, " <mask> ");

export const sanitizeText = (text: string): string =>
	text.replace(/\n/g, " ").replace(/"/g, "'").trim();
