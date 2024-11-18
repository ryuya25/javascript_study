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

    // base 配列のデータを生成
    const base = [];
    for (let ii = 180; ii >= 1; ii--) {
        let i = ii * 60 / 180
        const x = W / 2;
        const y = H * (0.75 + 0.25 * i * i / 60 / 60);
        const r = (i * i) / 3600 * (W / 2);
        base.push({ x, y, r });
    }

    // 円の位置と大きさのデータを生成
    const circle = [];
    for (let i = 0; i < 40; i++) {
        const angle = (2 * Math.PI * i) / 40;
        const x = W * (0.5 + 0.33 * Math.sin(angle));
        const y = H * (0.33 + 0.16 * Math.cos(angle));
        const r = W * (0.01 + 0.003 * Math.cos(angle));
        circle.push({ x, y, r });
    }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// base 配列のデータを生成
const base = [];
for (let ii = 180; ii >= 1; ii--) {
    let i = ii * 60 / 180
    const x = W / 2;
    const y = H * (0.75 + 0.25 * i * i / 60 / 60);
    const r = (i * i) / 3600 * (W / 2);
    base.push({ x, y, r });
}

// 円の位置と大きさのデータを生成
const circle = [];
for (let i = 0; i < 40; i++) {
    const angle = (2 * Math.PI * i) / 40;
    const x = W * (0.5 + 0.33 * Math.sin(angle));
    const y = H * (0.33 + 0.16 * Math.cos(angle));
    const r = W * (0.01 + 0.003 * Math.cos(angle));
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
    x1 = W / 2;
    x2 = W / 2;
    y1 = H * 0.07;
    y2 = H * 0.72;
    for (let i = 0; i < 90; i++) {
        color = 255 - (255 * ((i + countLine) % 15)) / 15;
        angle = (2 * Math.PI * i) / 90;

        xCanvas = W * (0.5 + Math.sin(angle) * 0.3);
        yCanvas = H * (0.63 + Math.cos(angle) * 0.05);

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