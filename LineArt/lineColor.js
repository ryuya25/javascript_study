const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let W = window.innerWidth;
let H = window.innerHeight;

const degreeMax = 360
const degree2radian = 2 * Math.PI / degreeMax

const circleNumber = 3
const lineNumber = 8
const groundNumber = 6

// ウィンドウサイズに合わせてキャンバスをリサイズ
function resizeCanvas() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
}

function hls_to_rgb(h, l, s) {
    let r, g, b;

    if (s === 0) {
        // 無彩色 (グレー)
        r = g = b = l;
    } else {
        const hue_to_rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue_to_rgb(p, q, h + 1 / 3);
        g = hue_to_rgb(p, q, h);
        b = hue_to_rgb(p, q, h - 1 / 3);
    }

    // RGBを0-255の範囲に変換
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgb_to_hls(r, g, b) {
    // RGB値を0-1の範囲に正規化
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2; // Lightness

    let h, s;

    if (max === min) {
        // 無彩色 (グレー)
        h = 0; // Hueは定義できないので0に設定
        s = 0; // Saturationも0
    } else {
        const d = max - min;

        // Saturation (彩度)
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        // Hue (色相)
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h /= 6; // 0-1の範囲に正規化
    }

    return [h, l, s];
}


class RotateCircle {
    constructor(angle) {
        this.angle = angle;
        this.hue = angle;

        this.centerX = 0.5;
        this.centerY = 0.33;
        this.rangeX = 0.33;
        this.rangeY = 0.1;
        this.centerRadius = 0.01;
        this.rangeRadius = 0.003;

        this.updateAngle = 10
        this.gradationNumber = 5
        this.gradationAngle = 2
    }

    draw() {
        let angle = this.angle * degree2radian;

        for (let i = 0; i < this.gradationNumber; i++) {
            angle += this.gradationAngle * degree2radian;
            const x = W * (this.centerX + this.rangeX * Math.cos(angle));
            const y = H * (this.centerY + this.rangeY * Math.sin(angle));
            const size = Math.max(W, H) * (this.centerRadius + this.rangeRadius * Math.sin(angle));
            const rgb = hls_to_rgb(this.hue / degreeMax, (i+1) / this.gradationNumber * 0.5, 0.5)

            ctx.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    update() {
        this.angle += this.updateAngle;
        this.angle %= degreeMax
    }
}

class RotateLine {
    constructor(angle) {
        this.angle = angle;
        this.hue = angle;

        this.X1 = 0.5;
        this.Y1 = 0.07;
        this.X2 = 0.5;
        this.Y2 = 0.72;
        this.centerX = 0.5
        this.centerY = 0.6
        this.rangeX = 0.3
        this.rangeY = 0.05
    
        this.gradationAngle = 1
        this.gradationNumber = 10
        this.updateAngle = 3
    }

    draw() {
        let angle = this.angle * degree2radian;

        const x1 = W * this.X1
        const x2 = W * this.X2
        const y1 = H * this.Y1
        const y2 = H * this.Y2

        for (let i = 0; i < 10; i++) {
            angle -= this.gradationAngle * degree2radian

            const x = W * (this.centerX + this.rangeX * Math.cos(angle))
            const y = H * (this.centerY + this.rangeY * Math.sin(angle))
            const width = angle < Math.PI ? 2 : 1;
            const rgb = hls_to_rgb(this.hue / degreeMax, 0.5 * i/ this.gradationNumber, 0.5 + this.angle / degreeMax / 2)

            ctx.strokeStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
            ctx.lineWidth = width;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }

    update() {
        this.angle -= this.updateAngle;
        if (this.angle < 0) this.angle += degreeMax;
    }
}

class DropGround {
    rangeHue = 0.8

    constructor(position) {
        this.position = position;
        this.hue = position * this.rangeHue

        this.X = 0.5
        this.Ystart = 0.75
        this.Yend = 1
    
        this.gradationNumber = 10
    }

    draw() {
        for (let i = 0; i < this.gradationNumber; i++) {
            const pos = this.position + (this.gradationNumber - i)  / (this.gradationNumber * groundNumber)

            const x = W * this.X
            const y = H * (this.Ystart + (this.Yend - this.Ystart)  * pos * pos)
            const size = W * (pos * pos) / 2

            const rgb = hls_to_rgb(this.hue, 0.6 - i/ this.gradationNumber * 0.4,  0.5 )

            ctx.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
            ctx.beginPath();
            ctx.ellipse(x, y, size, size * (H / W)*0.3, 0, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    update() {
        this.position += 1 / (this.gradationNumber * groundNumber)
        if (this.position > 1){
            this.position = 0
            this.hue += 1 - this.rangeHue
            if (this.hue >= 1){
                this.hue -= 1
            }
        }
    }
}

const circles = [];
for (let i = 0; i < circleNumber; i++) {
    circles.push(new RotateCircle((degreeMax / circleNumber) * i));
}

const lines = [];
for (let i = 0; i < lineNumber; i++) {
    lines.push(new RotateLine((degreeMax / lineNumber) * i));
}

const grounds = [];
for (let i = 0; i < groundNumber; i++) {
    grounds.push(new DropGround(i / groundNumber));
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