export default class ReducerPageMapperCacheUtil {
    private _pageIdCountMap: Map<string, number> = new Map<string, number>();

    public setPageId(pageId: string) {
        this._pageIdCountMap.set(pageId, (this._pageIdCountMap.get(pageId) ?? 0) + 1);
    }

    public getCountForPageId(pageId: string): number {
        return this._pageIdCountMap.get(pageId) ?? 0;
    }

    public decrementPageIdCount(pageId: string) {
        const count = this._pageIdCountMap.get(pageId);
        if (count) {
            if (count > 1) {
                this._pageIdCountMap.set(pageId, count - 1);
            } else {
                this._pageIdCountMap.delete(pageId);
            }
        }
    }
}
