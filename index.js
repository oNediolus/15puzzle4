// ordersModel 変数の要素を増やす
const ordersModel = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 0, 26];

// 盤面の大きさに合わせて空白セルの隣接するセルを返す関数を書き換える
function findAdjacentOfEmpty() {
  const emptyIndex = ordersModel.indexOf(0);
  const adjacentIndexes = [];
  const size = 5; // 盤面の1辺の長さ

  // 上方向のセル
  if (emptyIndex - size >= 0) {
    adjacentIndexes.push(emptyIndex - size);
  }
  // 下方向のセル
  if (emptyIndex + size < size * size) {
    adjacentIndexes.push(emptyIndex + size);
  }
  // 左方向のセル
  if (emptyIndex % size !== 0) {
    adjacentIndexes.push(emptyIndex - 1);
  }
  // 右方向のセル
  if ((emptyIndex + 1) % size !== 0) {
    adjacentIndexes.push(emptyIndex + 1);
  }

  return adjacentIndexes;
}

// 移動回数を記録する変数を追加
let count = 0;

// 移動回数を表示するための要素を取得
const moveCountElement = document.getElementById("moveCount");

// 移動回数を表示する関数を追加
function displayMoveCount() {
  moveCountElement.textContent = `移動回数: ${count}`;
}

// タップされたときの処理を書き換えて移動回数を記録
function onTapped(index) {
  const emptyIndex = ordersModel.indexOf(0);
  const adjacentIndexes = findAdjacentOfEmpty();
  if (adjacentIndexes.includes(index)) {
    ordersModel[emptyIndex] = ordersModel[index];
    ordersModel[index] = 0;
    count++; // 移動回数を増やす
    displayMoveCount(); // 移動回数を表示
    component(); // ボードを再描画
  }
}

// 初期化処理
function init() {
  const container = document.querySelector(".board");
  for (let i = 0; i < ordersModel.length; i++) {
    const piece = document.createElement("div");
    piece.textContent = ordersModel[i] === 0 ? "" : ordersModel[i];
    piece.classList.add("piece");
    piece.classList.add(`piece-${ordersModel[i]}`);
    piece.addEventListener("click", () => onTapped(i));
    container.appendChild(piece);
  }
}

init();
displayMoveCount(); // 初期表示時に移動回数を表示

// State 相当の値を準備
// ----------------------------------------------------------------------------
let up;    // 空白ピース基準で 1 つ上のピースの場所を記録
let down;  // 空白ピース基準で 1 つ下のピースの場所を記録
let left;  // 空白ピース基準で 1 つ左のピースの場所を記録
let right; // 空白ピース基準で 1 つ右のピースの場所を記録

// 各ピースの場所を記録
let positions = [
  6, 4, 3, 10, 7, 2, 1, 5, 9, 13, 11, 8, 15, 14, 12, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 0,
];

// 空白ピースを基準に、上下左右のピースの場所を調べる関数
// ----------------------------------------------------------------------------
function calcAdjacentPositions() {
  const empty = positions[25];

  let temp_up = empty - 5;
  let temp_down = empty + 5;
  let temp_left = empty - 1;
  let temp_right = empty + 1;

  if (temp_up < 1) temp_up = null;
  if (temp_down > 25) temp_down = null;
  if (empty % 5 === 1) temp_left = null;
  if (empty % 5 === 0) temp_right = null;

  up = temp_up;
  down = temp_down;
  left = temp_left;
  right = temp_right;
}

// Component 相当の関数を準備 (State => View にあたるもの)
// ----------------------------------------------------------------------------
function component() {
  for (let n = 0; n < 25; n = n + 1) {
    const piece = document.querySelector('.piece-' + (n + 1));

    piece.style.order = positions[n];
  }
}

// 初期化処理
// ----------------------------------------------------------------------------
component();
calcAdjacentPositions();

// ピースがクリックされたときに実行する処理 (関数)
// ----------------------------------------------------------------------------
function pieceClickHandler(event) {
  // event.target からピースの番号 N を特定する (文字で取得されるので数値に変換する)
  const N = Number(event.target.innerText);

  if (
    positions[N - 1] === up ||
    positions[N - 1] === down ||
    positions[N - 1] === left ||
    positions[N - 1] === right
  ) {
    // ピースの場所を入れ替える
    [positions[25], positions[N - 1]] = [positions[N - 1], positions[25]];

    // State => View の反映を行う
    component();

    // 隣接するピースを再計算する
    calcAdjacentPositions();
  }
}

// 1 ～ 25 番ピースのクリックを監視し、クリックされたら pieceClickHandler を呼ぶ
// ----------------------------------------------------------------------------
for (let n = 1; n <= 25; n = n + 1) {
  const piece = document.querySelector('.piece-' + n);

  piece.addEventListener('click', pieceClickHandler);
}
