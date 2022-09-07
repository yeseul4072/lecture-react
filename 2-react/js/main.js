import store from "./js/Store.js";

// Component 클래스를 상속하는 클래스
class App extends React.Component {

    constructor() {
        super(); // 부모 클래스의 생성자

        this.state = {
            searchKeyword: "",
            searchResult: [],
            submitted: false
        };
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
        console.log("handleSubmit: ", this.state.searchKeyword);

        this.search(this.state.searchKeyword);
    }

    search(searchkeyword) {
        const searchResult = store.search(searchkeyword);
        this.setState({ 
            searchResult,
            submitted: true,
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

        return (
            <> 
                <header>
                    <h2 className="container">검색</h2>
                </header>
                <div className="container">
                    { searchForm }
                    <div className="content">
                        { this.state.submitted && searchResult }
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