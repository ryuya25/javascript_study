const onClickAdd = () => {
    // テキストボックスの内容を取得して、クリアする
    const inputText = document.getElementById("add-text").value;
    document.getElementById("add-text").value = ""

    /* TODOリストに追加された項目(下記 HTML) を生成
    <li>
        <div class="list-row">
            <p class="todo-item">TODOです</p>
            <button>完了</button>
            <button>削除</button>
        </div>
    <li>
    */

    // li生成
    const li = document.createElement("li")

    // div生成
    const div = document.createElement("div")
    div.className = "list-row"

    // p生成
    const p = document.createElement("p")
    p.className = "todo-item"
    p.innerText = inputText;

    // button(完了)生成
    const completeButton = document.createElement("button")
    completeButton.innerText = "完了"
    completeButton.addEventListener("click", () => {
        alert("完了");
    })

    // button(削除)生成
    const deleteButton = document.createElement("button")
    deleteButton.innerText = "削除"
    deleteButton.addEventListener("click", () => {
        alert("削除");
    })


    // 階層構造を追加
    div.appendChild(p);
    div.appendChild(completeButton);
    div.appendChild(deleteButton);
    li.appendChild(div);

    // 未完了のTODOリスト(imcomplete-list)に対して、上記までで作成したHTMLを追加
    document.getElementById("imcomplete-list").appendChild(li);
}

document.getElementById("add-button").addEventListener("click", onClickAdd)