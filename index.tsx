/** @jsx jsx */
/** @jsxFrag Fragment */

import { Hono } from "https://deno.land/x/hono/mod.ts";
import { Fragment, html, jsx } from "https://deno.land/x/hono/middleware.ts";
import { renderer } from "./renderer.tsx";
import { SUB_CLUSTER_LIST } from "./static/sub-cluster.ts";
import { LOCALITY } from "./static/locality.ts";
import { Threshold, ThresholdCrawler } from "./crawler/threshold-calculator.ts";
import { renderToReadableStream } from "https://deno.land/x/hono@v3.12.7/jsx/streaming.ts";
import {sampleData} from "./static/sampleData.ts";

const app = new Hono();

app.get("*", renderer);
app.post("*", renderer);

const Layout: FC = (props) => {
  return (
    <html>
      <body>{props.children}</body>
    </html>
  );
};

const Top: FC<{ messages: string[] }> = () => {
  return (
    <Layout>
      <a class="text-xl" href="/">Threshold Calculator</a>
      <form method="POST">
        <label>
          <p>Select a Location and press GO!</p>
          <select name="location">
            <option value="none" selected disabled hidden>
              Select an Location
            </option>
            {LOCALITY.map((local) => {
              return <option value={local.key}>{local.displayName}</option>;
            })}
          </select>
        </label>
        <button type="submit" class="pl-2">GO</button>
      </form>
    </Layout>
  );
};

type TData = {
  label: string;
  result: string;
};

const Table: FC<{ messages: string[] }> = (props: { tData: TData[] }) => {
  return (
    <Layout>
      <table class="table-fixed w-[18rem]">
        <tr>
          <th class="text-left">Model</th>
          <th>Prediction</th>
        </tr>
        {props.tData.map((data) => {
          return (
            <div>
              <tr>
                <td class="text-left">{data.label}</td>
                <td class="text-center">{data.result}</td>
              </tr>
            </div>
          );
        })}
      </table>
    </Layout>
  );
};

const TableContainer: FC<{ messages: string[] }> = (
  props: { data: Threshold },
) => {
  const mainTData: TData[] = [];
  const summaryTData: TData[] = [];

  const arry = props.data.result;
  let i = 0;
  while (i + 1 < arry.length) {
    if (i <= 15) {
      if (i % 2 === 0) {
        const obj = {} as TData;
        obj.label = arry[i];
        i += 1;
        obj.result = arry[i];
        mainTData.push(obj);
      }
    } else {
      if (i % 2 === 0) {
        const obj = {} as TData;
        obj.label = arry[i];
        i += 1;
        obj.result = arry[i];
        summaryTData.push(obj);
      }
    }
    i++;
  }

  return (
    <Layout>
      <div class="flex flex-col flex-wrap">
        <div>
          <div class="text-sm font-bold">
            Period: {props.data.period}
          </div>
          <Table tData={mainTData} />
        </div>
        <div>
          <div class="text-sm font-bold w-full text-center">
            SUMMARY
          </div>
          <Table tData={summaryTData} />
        </div>
      </div>
    </Layout>
  );
};

const Crawler: FC<{ messages: string[] }> = async (
  props: { location: string },
) => {
  if (!props.location) {
    return (
      <Layout>
        <a class="text-xl" href="/">Threshold Calculator</a>
        <div>
          Try again - pick the location
        </div>
      </Layout>
    );
  }
  const startT = Date.now();

  // const res = await ThresholdCrawler(props.location);
	const res = sampleData as Threshold[];

  const endT = Date.now();
  const timeS = Math.round((endT - startT) / 1000);
  const data35Degree = res.filter((data) => data.temperature === 35);
  const data40Degree = res.filter((data) => data.temperature === 40);
  return (
    <Layout>
      <a class="text-xl" href="/">Threshold Calculator</a>
      <div>
        <div class="text-lg font-bold">
          {props.location}
        </div>
        <span class="text-xs">
          Finished in {timeS} secs
        </span>
        <div class="flex flex-col">
          <div>
            <span class="text-lg font-bold underline">
              35 Degree
            </span>
            <div class="flex flex-row flex-wrap w-full gap-4">
              {data35Degree.map((data) => {
                return <TableContainer data={data} />;
              })}
            </div>
          </div>
          <div class="py-2" />
          <hr />
          <div class="py-2" />
          <div>
            <span class="text-lg font-bold underline">
              40 Degree
            </span>
            <div class="flex flex-row w-full gap-4 flex-wrap">
              {data40Degree.map((data) => {
                return <TableContainer data={data} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const Loading: FC<{ messages: string[] }> = (props: { status: string }) => {
  return (
    <Layout>
      <a class="text-xl" href="/">Threshold Calculator</a>
      <div>Crawling</div>
    </Layout>
  );
};

app.get("/", (c) => {
  return c.render(<Top />);
});

app.post("/", async (c) => {
  const input = await c.req.parseBody();

  return c.render(<Crawler location={input.location} />);
});

Deno.serve(
  {
    port: 8080,
  },
  app.fetch,
);
