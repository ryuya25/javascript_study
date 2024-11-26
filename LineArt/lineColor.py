import pygame,math
import colorsys

pygame.init()

W, H = 800, 600

screen =  pygame.display.set_mode((W,H))

clock = pygame.time.Clock()


degreeMax = 360
degree2radian = 2 * math.pi / degreeMax

circleNumber = 3
lineNumber = 8
groundNumber = 6

class rotateCircle():
    centerX = 0.5;
    centerY = 0.33;
    rangeX = 0.33;
    rangeY = 0.1;
    centerRadius = 0.01;
    rangeRadius = 0.003;

    gradationAngle = 2
    gradationNumber = 5
    updateAngle = 10

    def __init__(self, angle):
        self.angle = angle
        self.hue = angle


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

    X1 = 0.5
    Y1 = 0.07
    X2 = 0.5
    Y2 = 0.72
    centerX = 0.5
    centerY = 0.6
    rangeX = 0.3
    rangeY = 0.05

    gradationAngle = 1
    gradationNumber = 10
    updateAngle = 3

    def __init__(self, angle):
        self.angle = angle
        self.hue = angle

    def draw(self):
        angle = self.angle * degree2radian;

        x1 = W * self.X1
        x2 = W * self.X2
        y1 = H * self.Y1
        y2 = H * self.Y2

        for i in range(self.gradationNumber):
            rgb = colorsys.hls_to_rgb(self.hue / degreeMax, 0.5 * i/ self.gradationNumber, 0.5 + self.angle / 360 / 2)

            angle -= self.gradationAngle * degree2radian
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

    X = 0.5
    Ystart = 0.75
    Yend = 1

    gradationNumber = 10
    rangeHue = 0.8

    def __init__(self, position):
        self.position = position
        self.hue = position * self.rangeHue

    def draw(self):

        for i in range(self.gradationNumber):
            pos = self.position + (self.gradationNumber - i)  / (self.gradationNumber * groundNumber)

            x = W * self.X
            y = H * (self.Ystart + (self.Yend - self.Ystart)  * pos * pos)
            size = W * (pos * pos) / 2
    
            rgb = colorsys.hls_to_rgb(self.hue, 0.6 - i/ self.gradationNumber * 0.4,  0.5 )
            
            pygame.draw.ellipse(screen,([_ *255 for _ in rgb]),(x-size, y-size*(self.Yend - self.Ystart), 2*size,2*size*(self.Yend - self.Ystart)))

    def update(self):
        self.position += 1 / (self.gradationNumber * groundNumber)
        if self.position > 1:
            self.position = 0
            self.hue += 1 - self.rangeHue
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
    grounds.append(dropGround(i / groundNumber))

running = True
while running:
    for e in pygame.event.get():
        if e.type == pygame.QUIT:
            running = False
    
    screen.fill((0,0,0))

    for l in lines:
        l.draw()
        l.update()

    for c in circles:
        c.draw()
        c.update()

    for g in sorted(grounds, key=lambda grounds: grounds.position, reverse=True):
        g.draw()
        g.update()

    pygame.display.flip()
    clock.tick(30)

pygame.quit()
