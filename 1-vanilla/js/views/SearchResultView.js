import { qs } from "../helpers.js";
import View from "./View.js";

export default class SearchResultView extends View {
    constructor() {
        super(qs('#search-result-view'))

        this.template = new Template()
    }

    /**
     * View show() 오버라이딩
     * 검색 결과 배열 형태로 받음
     */
    show(data = []) {
        // 데이터에 따라 DOM 동적으로 만들어줌 
        this.element.innerHTML = 
            data.length > 0 
                ? this.template.getList(data) 
                : this.template.getEmptyMessage();
        super.show(); // 부모 show() 호출
    }
}


class Template {
    // 비어있는 HTML 반환
    getEmptyMessage() {
        return `
            <div class="empty-box">검색결과가 없습니다.</div>
        `
    }

    getList(data = []) {
        return `
            <ul class="result">
                ${data.map(this._getItem).join("")}
            </ul>
        `;
    }

    _getItem({imageUrl, name}) {
        return `
            <li>
                <img src="${imageUrl}" alt="${name}" />
                <p>${name}</p>
            </li>
        `;
    }
}