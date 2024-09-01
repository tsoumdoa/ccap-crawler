//new
import { LOCALITY } from "../static/locality.ts";
import { ThresholdCrawler } from "./threshold-calculator.ts";

export async function CrawlAll() {
  let isSuccess = false;
  const container: any[] = [];
  const locations = LOCALITY.map((item) => item.key);
  const totalLength = locations.length;
  const start = Date.now();

  for (let i = 0; i < totalLength; i++) {
    const location = locations[i];
    console.log(`crawling ${location} - ${i + 1} of ${totalLength}`);
    const data = await ThresholdCrawler(location);

    const taggedData = {
      locations: location,
      data: data,
    };

    container.push(taggedData);
    console.log("---------------------");
  }

  const json = JSON.stringify(container);

  const bytes = new TextEncoder().encode(json);
  const file = await Deno.create("./static/seed-data.json");
  const written = await file.write(bytes);
  isSuccess = true;
  const end = Date.now();
  console.log(`Time taken: ${end - start}ms`);
  return isSuccess;
}
