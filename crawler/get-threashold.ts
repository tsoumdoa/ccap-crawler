import seededData from "../static/seed-data-minify.json" with { type: "json" };

export function GetThreashold(locationName: string) {
  const data = seededData.filter((seed) => seed.locations === locationName)[0];
	return data
}

