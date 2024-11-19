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



class RotateCircle {
    constructor(angle) {
        this.angle = angle;

        this.centerX = 0.5;
        this.centerY = 0.33;
        this.rangeX = 0.33;
        this.rangeY = 0.1;
        this.centerRadius = 0.01;
        this.rangeRadius = 0.003;

        this.updateAngle = 10
        this.gradationNumber = 5
        this.gradationAngle = 2
        this.degrees = 360
    }

    draw() {
        let angle = (this.angle / this.degrees) * 2 * Math.PI;

        for (let i = 0; i < this.gradationNumber; i++) {
            const color = 255 * (i + 1) / this.gradationNumber;
            angle += (this.gradationAngle / this.degrees) * 2 * Math.PI;
            const x = W * (this.centerX + this.rangeX * Math.cos(angle));
            const y = H * (this.centerY + this.rangeY * Math.sin(angle));
            const r = Math.max(W, H) * (this.centerRadius + this.rangeRadius * Math.sin(angle));

            ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    update() {
        this.angle += this.updateAngle;
        if (this.angle > this.degrees){
            this.angle -= this.degrees;
        }   
    }
}

class RotateLine {
    constructor(angle) {
        this.angle = angle;
    }

    draw() {
        let angle = (this.angle / 360) * 2 * Math.PI;

        const x1 = W / 2;
        const y1 = H * 0.07;
        const x3 = W / 2;
        const y3 = H * 0.72;

        for (let i = 0; i < 10; i++) {
            const color = 255 * (i + 1) / 10;
            angle -= (1 / 360) * 2 * Math.PI;
            const width = angle < Math.PI ? 2 : 1;

            const x2 = W * (0.5 + Math.cos(angle) * 0.3);
            const y2 = H * (0.6 + Math.sin(angle) * 0.05);

            ctx.strokeStyle = `rgb(${color}, ${color}, ${color})`;
            ctx.lineWidth = width;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.stroke();
        }
    }

    update() {
        this.angle -= 5;
        if (this.angle < 0) this.angle += 360;
    }
}

class DropGround {
    constructor(position) {
        this.position = position;
    }

    draw() {
        for (let i = 9; i >= 0; i--) {
            const pos = this.position + i;
            const x = W / 2;
            const y = H * (0.75 + 0.25 * (pos ** 2) / 60 / 60);
            const r = (pos ** 2) / 3600 * (W / 2);

            const color = 255 * (i + 1) / 10;

            ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
            ctx.beginPath();
            ctx.ellipse(x, y, r, r * (H / W) * 0.3, 0, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    update() {
        this.position += 1;
        if (this.position > 60) this.position = 0;
    }
}

const circles = [];
for (let i = 0; i < 3; i++) {
    circles.push(new RotateCircle((360 / 3) * i));
}

const lines = [];
for (let i = 0; i < 6; i++) {
    lines.push(new RotateLine((360 / 6) * i));
}

const grounds = [];
for (let i = 5; i >= 0; i--) {
    grounds.push(new DropGround((i / 6) * 60));
}



window.addEventListener('resize', resizeCanvas);
resizeCanvas();


// アニメーション関数
function animate() {

    // 画面を黒に塗りつぶす
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, W, H);

    for (const circle of circles) {
        circle.draw();
        circle.update();
    }

    for (const line of lines) {
        line.draw();
        line.update();
    }

    // positionの降順でソートして描画
    grounds.sort((a, b) => b.position - a.position);
    for (const ground of grounds) {
        ground.draw();
        ground.update();
    }

    setTimeout(animate, 33);

    // 次のフレームをリクエスト
//    requestAnimationFrame(animate);
}

// アニメーション開始
animate();