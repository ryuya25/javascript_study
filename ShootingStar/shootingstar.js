const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let W = window.innerWidth;
let H = window.innerHeight;

const myRandom = (min, max) => Math.floor(Math.random() * (max - min) + min);

let stars;

// ウィンドウサイズに合わせてキャンバスをリサイズ
function resizeCanvas() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const starColors = [
        "LightYellow",  // 明るい白系
        "Gold",         // 温かみのある黄色・オレンジ
        "LightSkyBlue", // 冷たさを演出する青系
        "Orchid"        // 儚い雰囲気を加える紫系
    ];
    stars = Array.from({ length: 100 }, () => ({
        x: myRandom(0, W),
        y: myRandom(0, H),
        r: myRandom(1, 3),
        c: starColors[myRandom(0,starColors.length)],
        d: myRandom(1, 5)
    }));
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawStars() {
    for (const star of stars) {
        // 一定の確率で星のサイズを変更して、星の瞬きを再現
        if (Math.random() < 0.05) {
            star.r = myRandom(1, 3);
        }
        star.x += star.d / 3;
        star.y += star.d / 5;

        if (star.x > W) star.x -= W;
        if (star.y > H) star.y -= H;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = star.c;
        ctx.fill();
    }
}

let shootingStar = null;
function drawShootingStar() {
    if (shootingStar) {
        const { x, y, dx, dy } = shootingStar;
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + dx * 2, y + dy * 2);
        ctx.stroke();

        shootingStar.x += dx;
        shootingStar.y += dy;

        if (shootingStar.x > W || shootingStar.y > H) {
            shootingStar = null;
        }
    } else if (Math.random() < 0.1) {
        shootingStar = {
            x: myRandom(0, W),
            y: myRandom(0, H / 2),
            dx: myRandom(5, 10),
            dy: myRandom(5, 10)
        };
    }
}

function animate() {
    ctx.fillStyle = "MidnightBlue";
    ctx.fillRect(0, 0, W, H);

    drawStars();
    drawShootingStar();

    requestAnimationFrame(animate);
}

animate();
