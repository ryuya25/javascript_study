import pygame,math
import colorsys

pygame.init()

W, H = 800, 600

screen =  pygame.display.set_mode((W,H))

clock = pygame.time.Clock()


degreeMax = 360
degree2radian = 2 * math.pi / degreeMax

circleNumber = 3
lineNumber = 6
groundNumber = 10

class rotateCircle():
    def __init__(self, angle):
        self.angle = angle
        self.hue = angle

        self.centerX = 0.5;
        self.centerY = 0.33;
        self.rangeX = 0.33;
        self.rangeY = 0.1;
        self.centerRadius = 0.01;
        self.rangeRadius = 0.003;
    
        self.gradationAngle = 2
        self.gradationNumber = 5
        self.updateAngle = 10

    def draw(self):
        angle = self.angle * degree2radian;
        
        for i in range(self.gradationNumber):
            rgb = colorsys.hls_to_rgb(self.hue / degreeMax, (i+1) / self.gradationNumber * 0.5, 0.5)

            angle += self.gradationAngle * degree2radian;
            x = W * (self.centerX + self.rangeX * math.cos(angle));
            y = H * (self.centerY + self.rangeY * math.sin(angle));
            size = W * (self.centerRadius + self.rangeRadius * math.sin(angle));
            pygame.draw.circle(screen,([_ * 255 for _ in rgb]),(x, y), size)

    def update(self):
        self.angle += self.updateAngle
        self.angle %= degreeMax

class rotateLine():
    def __init__(self, angle):
        self.angle = angle
        self.hue = angle

        self.X1 = 0.5
        self.Y1 = 0.07
        self.X2 = 0.5
        self.Y2 = 0.72
        self.centerX = 0.5
        self.centerY = 0.6
        self.rangeX = 0.3
        self.rangeY = 0.05

        self.gradationAngle = 1
        self.gradationNumber = 10
        self.updateAngle = 3

    def draw(self):
        angle = self.angle * degree2radian;

        x1 = W * self.X1
        x2 = W * self.X2
        y1 = H * self.Y1
        y2 = H * self.Y2

        for i in range(self.gradationNumber):
            rgb = colorsys.hls_to_rgb(self.hue / degreeMax, 0.5 * i/ self.gradationNumber, 0.5 + self.angle / 360 / 2)

            angle -= 1 * degree2radian
            width = 1 if angle > math.pi else 2

            x = W * (self.centerX + self.rangeX * math.cos(angle))
            y = H * (self.centerY + self.rangeY * math.sin(angle))

            pygame.draw.line(screen,([_ *255 for _ in rgb]),(x1,y1),(x,y),width)
            pygame.draw.line(screen,([_ *255 for _ in rgb]),(x2,y2),(x,y),width)

    def update(self):
        self.angle -= self.updateAngle
        if self.angle < 0:
            self.angle += degreeMax

class dropGround():
    def __init__(self, position):
        self.position = position
        self.hue = position / 200

    def draw(self):

        for i in range(9,-1,-1):
            pos = self.position + i

            x = W / 2;
            y = H * (0.75 + 0.25 * pos * pos / 100 / 100);
            size = (pos * pos) / 10000 * (W / 2);
    
            rgb = colorsys.hls_to_rgb(self.hue, (i+1) / 15, 1.0 - pos / 110 * 0.25)
            
            pygame.draw.ellipse(screen,([_ *255 for _ in rgb]),(x-size, y-size*0.3, 2*size,2*size*0.3))

    def update(self):
        self.position += 1
        if self.position > 100:
            self.position = 0
            self.hue += 100 / 200
            if self.hue >= 1:
                self.hue -= 1

circles = []
for i in range(circleNumber):
    circles.append(rotateCircle(degreeMax / circleNumber * i))

lines = []
for i in range(lineNumber):
    lines.append(rotateLine(degreeMax / lineNumber * i))

grounds = []
for i in range(groundNumber):
    grounds.append(dropGround(i / 10 * 100))

running = True
while running:
    for e in pygame.event.get():
        if e.type == pygame.QUIT:
            running = False
    
    screen.fill((0,0,0))

    for c in circles:
        c.draw()
        c.update()

    for l in lines:
        l.draw()
        l.update()

    for g in sorted(grounds, key=lambda grounds: grounds.position, reverse=True):
        g.draw()
        g.update()

    pygame.display.flip()
    clock.tick(30)

pygame.quit()
