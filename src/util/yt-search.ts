import assert from "assert/strict";
import ytsr from "ytsr";

enum Status {
  UNINITIALIZED,
  INITIALIZED,
  FINISHED,
}

export class YTSearch {
  static Status = Status;

  private _totalResults: number | undefined;
  private _correctedQuery = "";
  private _lastResult: ytsr.ContinueResult | null = null;
  private _status: Status = Status.UNINITIALIZED;
  private resultsCache: ytsr.Item[] = [];

  constructor(readonly query: string, readonly pageSize: number = 7) {}

  // public

  public async load() {
    switch (this._status) {
      case Status.UNINITIALIZED:
        {
          // create filters
          const filters = await ytsr.getFilters(this.query);
          const videosFilter = filters.get("Type")?.get("Video");

          // get the first response
          assert(videosFilter?.url);
          const res = await ytsr(videosFilter.url, { pages: 1 });

          // remember search meta results
          this._totalResults = res.results;
          this._correctedQuery = res.correctedQuery;

          this._status = res.continuation
            ? Status.INITIALIZED
            : Status.FINISHED;
          this._lastResult = res;

          // add results to cache
          this.resultsCache.push(...res.items);
        }
        break;
      case Status.INITIALIZED:
        {
          // get continuation response
          assert(this._lastResult?.continuation);
          const res = await ytsr.continueReq(this._lastResult.continuation);

          // remember search meta results
          this._lastResult = res;
          if (!res.continuation) this._status = Status.FINISHED;

          // add results to cache
          this.resultsCache.push(...res.items);
        }
        break;
      case Status.FINISHED: {
        throw new Error("No more pages to load.");
      }
    }
  }

  public async page(n: number) {
    const start = n * this.pageSize;
    const end = Math.min(start + this.pageSize, this.totalResults ?? Infinity);
    while (!this._lastResult || end > this.resultsCache.length) {
      await this.load();
    }
    return this.resultsCache.slice(start, end);
  }

  // acessor

  get totalResults() {
    return this._totalResults;
  }

  get correctedQuery() {
    return this._correctedQuery;
  }

  get pages() {
    return this._totalResults !== undefined
      ? Math.ceil(this._totalResults / this.pageSize)
      : undefined;
  }
}
