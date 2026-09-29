// app.js

// ----- 공통 요소 선택 -----
const getTodoBtn = document.getElementById("getTodoBtn");
const postBtn = document.getElementById("postBtn");
const patchBtn = document.getElementById("patchBtn");
const putBtn = document.getElementById("putBtn");
const deleteBtn = document.getElementById("deleteBtn");
const listBtn = document.getElementById("listBtn");
const resultDisplay = document.getElementById("resultDisplay");
const todoList = document.getElementById("todoList");

// API 기본 주소 - "http://localhost:8080/api"
const BASE_URL = "https://jsonplaceholder.typicode.com";

// 결과를 pre 태그에 보여주는 헬퍼 함수
function showResult(data) {
  resultDisplay.textContent = JSON.stringify(data, null, 2);
}

// 1. GET 조회
async function fetchTodo() {
  resultDisplay.textContent = "Loading (GET) ......";
  try {
    // 1) 요청을 보내고 응답이 도착할 대까지 여기서 잠시 대기
    //    fetch 함수에서 기본값을 GET 요청이다.
    const response = await fetch(`${BASE_URL}/todos/1`);

    console.log(response.status); // 응답 상태코드

    // 2) 응답 본문 (json 문자열)을 객체로 바꿀 때까지 기다린다.
    const data = await response.json();
    console.log(data);

    // 3) 화면에 뿌려보자.
    showResult(data);
  } catch (error) {
    // 인터넷이 끊기는 등 요청 자체가 실패 했을 때
    resultDisplay.textContent = "요청 실패 : " + error.message;
  }
}

// 1-1. GET 조회 - then 사용
function fetchTodo2() {
  resultDisplay.textContent = "Loading (GET) ....";

  // fetch 는 Promise를 돌려준다 . 메서드를 안쓰면 기본 GET 요청이다.
  fetch(`${BASE_URL}/todos/100`, { method: "GET" })
    .then((response) => {
      // 1) 응답이 도착하면 실행된다.
      console.log(response.status); //응답 상태 코드
      // response.json() 도 Promise를 돌려준다.
      return response.json();
    })
    .then((data) => {
      // 응답 본문에 문자열을 js Object로 파싱해서 넘겨 받는다.
      console.log(data);
      showResult(data); // 내부에서 다시 객체를 문자열로 변환해서 화면에 그림
    })
    .catch((error) => {
      // 인터넷 끊기는 동안 요청 자체 실패 ... 등
      resultDisplay.textContent = "요청 실패 : " + error.message;
    });
}

getTodoBtn.addEventListener("click", fetchTodo2);

// -- 2. POST : 생성 --
async function createTodo() {
  resultDisplay.textContent = "Loading (POST) ....";

  const newTodo = { title: "자바 스크립트 복습", completed: false, userId: 1 };

  try {
    const response = await fetch(`${BASE_URL}/todos`, {
      method: "POST",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify(newTodo), // 객체를 문자열로 바꿔 보내야한다.
    });

    // 상태 코드 POST : 201 (Created)
    console.log(response.status);
    const data = await response.json(); // JSON 형식에 문자열이 객체로 변한 됨.
    showResult(data);
  } catch (error) {
    resultDisplay.textContent = "요청 실패 :" + error.message;
  }
}
postBtn.addEventListener("click", createTodo);


// 3. ---- PATCH : 부분 수정 ----
async function patchTodo() {
    resultDisplay.textContent = "Loading (PATCH)....";

    const patchData = {title : "파이썬 복습"};

    try {
        const response = await fetch(`${BASE_URL}/todos/1`,{
            method: "PATCH",
            headers: {"Content-type" : "application/json; charset=UTF-8"},
            body: JSON.stringify(patchData),
        });

        console.log(response.status); //상태코드 (200)
        const data = await response.json();
        showResult(data);
    } catch (error) {
        resultDisplay.textContent = "요청 실패 :" + error.message;
    }
}
patchBtn.addEventListener("click", patchTodo);

// 4. ---- PUT : 전체 수정 ----
async function putTodo() {
    resultDisplay.textContent = "Loading (PUT) ...";

    const updateData = {id: 1, title: "C++ 입문", completed: true, userId : 1};

    try { 
        const response = await fetch(`${BASE_URL}/todos/1`,{
            method: "PUT",
            headers: {"Content-type" : "application/json; charset=UTF-8"},
            body: JSON.stringify(updateData),
        });

        console.log(response.status);
        const data = await response.json();
       showResult(data);

    } catch (error) {
        resultDisplay.textContent = "요청 실패" +error.message;
    }
}
putBtn.addEventListener("click", putTodo);


// 5. ---- DELETE : 삭제  ----
async function deleteTodo() {
    resultDisplay.textContent = "Loading (DELETE).....";

    try {
        const response = await fetch(`${BASE_URL}/todos/1`,{
            method: "DELETE",
        });

        console.log(response.status);

        if(response.ok) {
            const data = await response.json();
            showResult({message : "삭제 성공", response : data});
        }
    } catch (error) {
        resultDisplay.textContent = "요청 실패" + error.message;
    }
}
 deleteBtn.addEventListener("click", deleteTodo);

// 6. ----- 받은 목록을 화면에 그리기 (todo) 응용 코드 ----
async function readerTodoLiset() {
    todoList.innerHTML = "<li>목록 불러오는 중...</li>";

    try {
        const response = await fetch(`${BASE_URL}/todos?_limit=5`);
        const todos = await response.json();

        todoList.innerHTML = "";

        todos.forEach((todo) => {
            const li = document.createElement("li");
            li.textContent = `${todo.id}. ${todo.title} [${todo.completed ? "완료" : "미완료"}]`;

            if (todo.completed) {
                li.style.textDecoration = "line-through";
                li.style.color = "gray";
            }

            todoList.appendChild(li);
        });
    } catch (error) {
        todoList.innerHTML = `<li style="color: red;"> 목록 로드 실패 : ${error.message}</li>`;
    }
}

listBtn.addEventListener("click", readerTodoLiset);