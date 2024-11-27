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
        // 押された完了ボタンの親にあるliタグは以下の完了ボタンと削除ボタンを削除
        const moveTarget = completeButton.closest("li");
        completeButton.nextElementSibling.remove(); // 削除ボタン(完了ボタンの次にあるボタン)を削除
        completeButton.remove(); // 完了ボタン(実際にクリックしたボタン)を削除
        // 戻すボタンを生成してdivタグ配下に追加
        const backButton = document.createElement("button");
        backButton.innerText = "戻す";
        moveTarget.firstElementChild.appendChild(backButton)
        // 完了リストに追加(liタグを完了リストに移動させたので未完了リストから自動的に削除される)
        document.getElementById("complete-list").appendChild(moveTarget);

    })

    // button(削除)生成
    const deleteButton = document.createElement("button")
    deleteButton.innerText = "削除"
    deleteButton.addEventListener("click", () => {
        // 押された削除ボタンの親にあるliタグを未完了リストから削除
        const deleteTarget = deleteButton.closest("li");
        document.getElementById("incomplete-list").removeChild(deleteTarget);
    })

    // 階層構造を追加
    div.appendChild(p);
    div.appendChild(completeButton);
    div.appendChild(deleteButton);
    li.appendChild(div);

    // 未完了のTODOリスト(incomplete-list)に対して、上記までで作成したHTMLを追加
    document.getElementById("incomplete-list").appendChild(li);
}

document.getElementById("add-button").addEventListener("click", onClickAdd)