import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import {
  ElementHandle,
  Page,
} from "https://deno.land/x/puppeteer@16.2.0/vendor/puppeteer-core/puppeteer/common/Page.js";
//
// error handling.....?????

// const browser = await puppeteer.launch({
//   product: "chrome",
//   headless: false,
//   args: ["--start-maximized"],
// });
//
//

export type Threshold = {
  temperature: number;
  period: string;
  result: string[];
};

const PERIOD_ARRY = ["2016-2045", "2036-2065", "2056-2085", "2075-2104"];
const TEMP_ARRY = ["35", "40"];

const scrape = async (page: Page, locationName: string, temp: number) => {
  const data: Threshold[] = [];
  try {
    for (let i = 0; i < PERIOD_ARRY.length; i++) {
      const threshold = <Threshold> {};
      threshold.temperature = temp;
      threshold.period = PERIOD_ARRY[i];
      console.log(
        `crawling the period of ${PERIOD_ARRY[i]} for ${locationName}`,
      );
      const item = PERIOD_ARRY[i];

      await page.evaluate("window.scrollTo(0, -300)");

      const period = await page.waitForSelector('[name="timespan"]');
      if (period) {
        await period.click();
        await period.select(item);
      }
      // await page.waitForTimeout(400);
      const location = await page.waitForSelector("#townSelect");
      if (location && locationName) {
        await location.click();
        await location.select(locationName);
        await location.click();
        await location.dispose();
      }
      await page.waitForTimeout(2000);

      const tdValues = await page.$$eval(
        "td",
        (tds: Array<ElementHandle>) => tds.map((td) => td.innerText),
      );
      if (tdValues.length === 0) throw new Error("tdValues is empty");
			threshold.result = tdValues;
      console.log(tdValues);
      data.push(threshold);
      await page.click(".summary-data-content > .close");
    }
  } catch (error) {
    console.log(error);
    return null;
  }

  return data;
};

export async function ThresholdCrawler(locationName: string) {
  const browser = await puppeteer.launch({
    product: "chrome",
    headless: true,
  });

	const timeStart = Date.now();
  const data: Threshold[] = [];

  console.log(`crawling requested for ${locationName}`);

  const page = await browser.newPage();
  const url =
    "https://www.climatechangeinaustralia.gov.au/en/projections-tools/threshold-calculator/#";

  await page.setViewport({ width: 1900, height: 920 });
  await page.goto(url, { waitUntil: "networkidle2" });
  await page.evaluate("window.scrollTo(0, 100)");

  console.log(`page loaded for ${locationName}`);

  for (let i = 0; i < TEMP_ARRY.length; i++) {
    console.log(`crawling at temp ${TEMP_ARRY[i]} for ${locationName}`);
    const threshold = await page.waitForSelector('[name="threshold"]');
    if (threshold) {
      await threshold.click();
      await threshold.select(TEMP_ARRY[i]);
    }
    // await page.waitForTimeout(400);

    const scenario = await page.waitForSelector('[name="experiment"]');
    if (scenario) {
      await scenario.click();
      await scenario.select("rcp85");
    }

    const val = await scrape(page, locationName, parseInt(TEMP_ARRY[i]));
    val && data.push(...val);
  }

  await browser.close();
	const timeEnd = Date.now();
  console.log(`crawling finished for ${locationName} in ${timeEnd - timeStart}ms`)

  return data;
}
