import { createNextId } from "./helpers.js";
import storage from "./storage.js"

const tag = "[Store]";

class Store {
  constructor(storage) {
    console.log(tag, "constructor");

    if (!storage) throw "no storage";

    this.storage = storage;

  }

  search(keyword) {
    return this.storage.productData.filter((product) => 
      product.name.includes(keyword)
    );

    // 검색어 최근 검색어 목록에 추가
    this.addHistory(keyword);
  }

  /**
   * 추천 검색어 목록 반환
   */
  getKeywordList() {
    return this.storage.keywordData;
  }

  /**
   * 최근 검색어 목록 반환
   */
  getHistoryList() {
    return this.storage.historyData.sort(this._sortHistory);
  }

  _sortHistory(history1, history2) {
    return history2.date > history1.date;
  }

  removeHistory(keyword) {
    this.storage.historyData = this.storage.historyData.filter((history) => history.keyword !== keyword);
  }

  addHistory(keyword) {
    keyword = keyword.trim();
    if(!keyword) {
      return;
    }

    // 최근 검색어에 이미 있는지 확인
    const hasHistory = this.storage.historyData.some(history => history.keyword === keyword);
    if(hasHistory) {
      this.removeHistory(keyword);
    }

    const id = createNextId(this.storage.historyData);
    const date = new Date();
    this.storage.historyData.push({id, keyword, date});
    this.storage.historyData = this.storage.historyData.sort(this._sortHistory);
  }
}

const store = new Store(storage)
export default store