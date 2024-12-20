const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let W = window.innerWidth;
let H = window.innerHeight;

const degreeMax = 360
const degree2radian = 2 * Math.PI / degreeMax

const circleNumber = 3
const lineNumber = 8
const groundNumber = 6

const backgroundcolor = `rgb(25, 25, 112)`; // "MidnightBlue";
const backgroundcolorRGB = [25, 25, 112]
const backgroundColorHLS = rgb_to_hls(...backgroundcolorRGB)

const RandomRangeInt = (min, max) => Math.floor(Math.random() * (max - min) + min);
const RandomRange = (min, max) => Math.random() * (max - min) + min;

const Side = {
    Front: true,
    Back: false
};

// ウィンドウサイズに合わせてキャンバスをリサイズ
function resizeCanvas() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    stars.resetStars();
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

    isFrontSide(){
        if (this.angle < 180){
                return Side.Front
        }else{
            return Side.Back
        }
    }

    draw(side) {
        let angle = this.angle * degree2radian;

        for (let i = 0; i < this.gradationNumber; i++) {
            angle += this.gradationAngle * degree2radian;
            const x = W * (this.centerX + this.rangeX * Math.cos(angle));
            const y = H * (this.centerY + this.rangeY * Math.sin(angle));
            const size = Math.max(W, H) * (this.centerRadius + this.rangeRadius * Math.sin(angle));

            const h = (backgroundColorHLS[0] + this.hue) / degreeMax / 2 
            const l = (backgroundColorHLS[1] * (this.gradationNumber - i) + 0.6 * i) / this.gradationNumber;
            const s = (backgroundColorHLS[2] * (this.gradationNumber - i)  + 1 * i) / this.gradationNumber;

            const rgb = hls_to_rgb(h,l,s)

            ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${(i+1)/this.gradationNumber})`;
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

    isFrontSide(){
        if (this.angle < 180){
                return Side.Front
        }else{
            return Side.Back
        }
    }

    draw(side) {
        let angle = this.angle * degree2radian;

        const x1 = W * this.X1
        const x2 = W * this.X2
        const y1 = H * this.Y1
        const y2 = H * this.Y2

        for (let i = 0; i < this.gradationNumber; i++) {
            angle += this.gradationAngle * degree2radian

            const x = W * (this.centerX + this.rangeX * Math.cos(angle))
            const y = H * (this.centerY + this.rangeY * Math.sin(angle))
            const width = angle < Math.PI ? 2 : 1;

            const h = (backgroundColorHLS[0] + this.hue) / degreeMax / 2 
            const l = (0.6 * (this.gradationNumber-i) + backgroundColorHLS[1] * i) / this.gradationNumber;
            const s = (1 * (this.gradationNumber - i)  + backgroundColorHLS[2] * i) / this.gradationNumber;

            const rgb = hls_to_rgb(h,l,s)

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

class Stars {

    stars = null

    constructor() {
        this.resetStars()
    }

    resetStars() {
        const starColors = [
            [255, 255, 224],    // LightYellow  明るい白系
            [255, 215, 0  ],    // Gold         温かみのある黄色・オレンジ
            [135, 206, 250],    // LightSkyBlue 冷たさを演出する青系
            [218, 112, 214]     // Orchid       儚い雰囲気を加える紫系
        ];

        this.stars = Array.from({ length: 100 }, () => ({
            x: RandomRangeInt(0, W),
            y: RandomRangeInt(0, H),
            r: RandomRangeInt(1, 3),
            c: `rgba(${starColors[RandomRangeInt(0, starColors.length)]},${RandomRange(0.5, 1.0)})`,
            d: RandomRangeInt(1, 5)
        }))
    }

    draw() {
        for (const star of this.stars) {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            ctx.fillStyle = star.c;
            ctx.fill();
        }
    }

    update() {
        for (const star of this.stars) {
            // 一定の確率で星のサイズを変更して、星の瞬きを再現
            if (Math.random() < 0.05) {
                star.r = RandomRangeInt(1, 3);
            }
            star.x += star.d / 3;
            star.y += star.d / 5;
    
            if (star.x > W) star.x -= W;
            if (star.y > H) star.y -= H;
        }
    }
}

class ShootingStar {
    shootingStar = null;

    draw() {
        if (this.shootingStar) {
            const { x, y, dx, dy } = this.shootingStar;
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + dx * 2, y + dy * 2);
            ctx.stroke();
        }
    }

    update() {
        if (this.shootingStar) {
            this.shootingStar.x += this.shootingStar.dx;
            this.shootingStar.y += this.shootingStar.dy;
    
            if (this.shootingStar.x > W || this.shootingStar.y > H) {
                this.shootingStar = null;
            }
        } else if (Math.random() < 0.1) {
            this.shootingStar = {
                x: RandomRangeInt(0, W),
                y: RandomRangeInt(0, H / 2),
                dx: RandomRangeInt(5, 10),
                dy: RandomRangeInt(5, 10)
            };
        }
    }
}

// オブジェクトの作成
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

const stars = new Stars;

const sstar = new ShootingStar;

// イベントの作成
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let animation = true
function clickCanvas() {
    animation = !animation;
}

canvas.addEventListener('click', clickCanvas, false);

// アニメーション関数
function animate() {

    if (animation == true){

        ctx.fillStyle = backgroundcolor;
        ctx.fillRect(0, 0, W, H);

        // 星の表示とデータ更新
        stars.draw();
        stars.update();
    
        // 流れ星の表示とデータ更新
        sstar.draw();
        sstar.update();
    
        // 地面の表示とデータ更新
        // positionの降順でソートして描画
        grounds.sort((a, b) => b.position - a.position);
        for (const ground of grounds) {
            ground.draw();
            ground.update();
        }

        // 奥側を表示
        // (奥側を先に表示することで手前側の表示を優先する)

        // 回転する円の表示(奥側)
        for (const circle of circles) {
            if (!circle.isFrontSide()){
                circle.draw(Side.Back);
            }
        }

        // 回転する線の表示(奥側)
        for (const line of lines) {
            if (!line.isFrontSide()){
                line.draw(Side.Back);
            }
        }

        // 手前側を表示

        // 回転する線の表示(手前側)
        for (const line of lines) {
            if (line.isFrontSide()){
                line.draw(Side.Front);
            }
        }

        // 回転する円の表示(手前側)
        for (const circle of circles) {
            if (circle.isFrontSide()){
                circle.draw(Side.Front);
            }
        }

        // 回転する線のデータ更新
        for (const line of lines) {
            line.update();
        }
    
        // 回転する円のデータ更新
        for (const circle of circles) {
            circle.update();
        }

    }
    setTimeout(animate, 33);

    // 次のフレームをリクエスト
//    requestAnimationFrame(animate);
}

// アニメーション開始
animate();