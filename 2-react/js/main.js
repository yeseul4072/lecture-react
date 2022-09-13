import { formatRelativeDate } from "./js/helpers.js";
import store from "./js/Store.js";

const TabType = {
    KEYWORD: 'KEYWORD',
    HISTORY: 'HISTORY',
}

const TabLabel = {
    [TabType.KEYWORD]: '추천 검색어',
    [TabType.HISTORY]: '최근 검색어',
}

// Component 클래스를 상속하는 클래스
class App extends React.Component {

    constructor() {
        super(); // 부모 클래스의 생성자

        this.state = {
            searchKeyword: "",
            searchResult: [],
            submitted: false,
            selectedTab: TabType.KEYWORD,
            keywordList: [],
            historyList: [],
        };
    }

    componentDidMount() { // DOM이 마운트된 직후에 호출하는 메소드
        const keywordList = store.getKeywordList()
        const historyList = store.getHistoryList()
        this.setState({ 
            keywordList,
            historyList,
        })
    }

    handleChangeInput(event) {
        //this.state.searchKeyword = event.target.value;
        // 강제로 컴포넌트 render 해주기
        //this.forceUpdate();
        const searchKeyword = event.target.value;
        // setState()는 React.Component가 제공하는 메소드로 state를 업데이트한 후 render() 함수를 호출한다.
        if(searchKeyword.length <= 0) {
            return this.handleReset();
        }
        this.setState({ searchKeyword });
        
    }

    handleSubmit(event) {
        // 화면 refresh 막기
        event.preventDefault();
        this.search(this.state.searchKeyword);
    }
    
    search(searchkeyword) {
        const searchResult = store.search(searchkeyword);
        const historyList = store.getHistoryList();

        this.setState({ 
            searchKeyword: searchkeyword,
            searchResult,
            submitted: true,
            historyList,
        }); // 변경된 필드만 병합하는 방식으로 동작!
    }

    handleReset(event) {
        // setState()는 항상 비동기로 동작한다!!! => 바로 적용되지 않음
        // this.setState({searchKeyword: ""});
        
        // 상태 값 변경이 완료된 후에 콜백 함수 호출하는 방법
        this.setState(() => {
            return {searchKeyword: ""}
        }, () => {
            console.log("handleReset: ", this.state.searchKeyword);
            // 결과 리스트 삭제
            this.setState({
                searchResult: [],
                submitted: false,
            })
        })
    }

    handleClickRemoveHistory(event, keyword) {
        // 이벤트 전파 차단 - button에서 발생한 이벤트를 상위 태그인 li로 가는 것 막기!
        event.stopPropagation(); 

        store.removeHistory(keyword);
        const historyList = store.getHistoryList();
        this.setState({historyList});
    }

    render() { // 리액트 엘리먼트를 반환해야하는 render()

        const searchForm = (
            <form 
                onSubmit={(event) => this.handleSubmit(event)}
                onReset={(event) => this.handleReset(event)}
            >
                <input 
                    type="text" 
                    placeholder="검색어를 입력하세요" 
                    autoFocus 
                    value={this.state.searchKeyword}
                    onChange={(event) => this.handleChangeInput(event)}
                />
                {/* {resetButton} */}
                {this.state.searchKeyword.length > 0 && (
                    <button type="reset" className="btn-reset"></button>
                )}
            </form>
        )

        const searchResult = (
            this.state.searchResult.length > 0 ? (
                <ul className="result">
                    {this.state.searchResult.map(item => {
                        return (
                            // DOM은 트리 구조이기 때문에 가상 DOM을 실제 DOM과 매번 비교하기 위해서는 많은 시간이 든다.
                            // 따라서 REACT는 리스트의 key 값을 기준으로 비교를 하게 된다.
                            <li key={item.id}>
                                <img src={item.imageUrl} alt={item.name}/>
                                <p>{item.name}</p>
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <div className="empty-box">검색 결과가 없습니다.</div>
            )
        )

        const keywordList = (
            <ul className="list">
                {this.state.keywordList.map((item, index) => {
                    return (
                        <li key={item.id} onClick={() => this.search(item.keyword)}>
                            <span className="number">{index + 1}</span>
                            <span>{item.keyword}</span>
                        </li>
                    )
                })}
            </ul>
        )

        const historyList = (
            <ul className="list">
                {this.state.historyList.map(({id, keyword, date}) => {
                    return (
                        <li key={id} onClick={() => this.search(keyword)}>
                            <span>{keyword}</span>
                            <span className="date">{formatRelativeDate(date)}</span>
                            <button className="btn-remove" onClick={event => this.handleClickRemoveHistory(event, keyword)}></button>
                        </li>
                    );
                    })}
            </ul>
        );

        const tabs = (
            <>
            <ul className="tabs">
                {Object.values(TabType).map(tabType => {
                    return (
                        <li 
                        className={this.state.selectedTab === tabType ? "active": ""} 
                        onClick={() => this.setState({selectedTab: tabType})}
                        key={tabType}>{TabLabel[tabType]}
                        </li>
                    )
                })}
            </ul>
            {this.state.selectedTab === TabType.KEYWORD && keywordList}
            {this.state.selectedTab === TabType.HISTORY && historyList}
            </>
        )
        

        return (
            <> 
                <header>
                    <h2 className="container">검색</h2>
                </header>
                <div className="container">
                    { searchForm }
                    <div className="content">
                        { this.state.submitted ? searchResult : tabs }
                    </div>
                </div>
            </>
        )
    }

}

/* JSX 문법
1. 소괄호 사용: 자바스크립트 엔진이 자동으로 ;을 넣어주는 것 방지
2. 카멜 케이스 사용: 모양이 HTML과 비슷하지만 실제로는 Javascript이기 때문 -> class(x), className(o) 
*/
/*
const element = (
    // <>는 DOM에 반영되지 않음
    <> 
        <header>
            <h2 className="container">검색</h2>
        </header>
        <div className="container">
            <form>
                <input type="text" placeholder="검색어를 입력하세요" autoFocus />
                <button type="reset" className="btn-reset"></button>
            </form>
        </div>
    </>
)*/

// ReactDOM.render(element, document.querySelector("#app"));
ReactDOM.render(<App/>, document.querySelector("#app"));