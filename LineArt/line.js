const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let W = window.innerWidth;
let H = window.innerHeight;

// ウィンドウサイズに合わせてキャンバスをリサイズ
function resizeCanvas() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// base 配列のデータを生成
const base = [];
for (let ii = 180; ii >= 1; ii--) {
    let i = ii * 60 / 180
    const x = W / 2;
    const y = (H / 4) * 3 + (H / 4) * (i * i) / 3600;
    const r = (i * i) / 3600 * (W / 2);
    base.push({ x, y, r });
}

// 円のデータを生成
const circle = [];
for (let i = 0; i < 40; i++) {
    const angle = (2 * Math.PI * i) / 40;
    const x = Math.sin(angle) * (W / 4) * (3 / 2) + W / 2;
    const y = Math.cos(angle) * (H / 6) + H / 3;
    const r = Math.cos(angle) * 2 + 10;
    circle.push({ x, y, r });
}

// アニメーション用のカウンタ
let countBase = 0;
let countLine = 0;
let countCircle = 0;

// アニメーション関数
function animate() {

    // 画面を黒に塗りつぶす
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, W, H);

    countBase += 1;
    countLine += 1;
    countCircle += 1;

    // 楕円の描画
    for (let i = 0; i < base.length; i++) {
        const { x, y, r } = base[i];
        const color = 255 - (255 * ((i + countBase) % 20)) / 20;
        ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;

        ctx.beginPath();
        ctx.ellipse(x, y, r, r * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
    }


    // ラインの描画
    for (let i = 0; i < 90; i++) {
        const color = 255 - (255 * ((i + countLine) % 15)) / 15;
        const angle = (2 * Math.PI * i) / 90;
        const x = Math.sin(angle) * 160 + 255;
        const y = Math.cos(angle) * 38 + 140;

        const xCanvas = (x / 512) * W;
        const yCanvas = (y / 212) * H;

        const x1 = (255 / 512) * W;
        const x2 = (255 / 512) * W;
        const y1 = (8 / 212) * H;
        const y2 = (150 / 212) * H;

        ctx.strokeStyle = `rgb(${color}, ${color}, ${color})`;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(xCanvas, yCanvas);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    // 円の描画
    for (let j = 0; j < 2; j++) {
        for (let i = 0; i < 5; i++) {
            const index = (countCircle + (i + j * 20)) % 40;
            const { x, y, r } = circle[index];
            const color = (255 * (i+1)) / 5;
            ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    setTimeout(animate, 33);

    // 次のフレームをリクエスト
//    requestAnimationFrame(animate);
}

// アニメーション開始
animate();