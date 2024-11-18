import pygame,math

pygame.init()

W, H = 800, 600

screen =  pygame.display.set_mode((W,H))

clock = pygame.time.Clock()

class rotateCircle():
    def __init__(self, angle):
        self.angle = angle

    def draw(self):
        angle = self.angle / 360 * 2 * math.pi;
        
        for i in range(5):
            color = 255 * (i+1) / 5
            angle += 2 / 360 * 2 * math.pi;
            x = W * (0.5 + 0.33 * math.cos(angle));
            y = H * (0.33 + 0.13 * math.sin(angle));
            r = W * (0.01 + 0.003 * math.sin(angle));
            pygame.draw.circle(screen,(color,color,color),(x, y), r)

    def update(self):
        self.angle += 5

class rotateLine():
    def __init__(self, angle):
        self.angle = angle

    def draw(self):
        angle = self.angle / 360 * 2 * math.pi;

        x1 = W / 2;
        x3 = W / 2;
        y1 = H * 0.07;
        y3 = H * 0.72;

        for i in range(10):
            color = 255 * (i+1) / 10
            angle -= 1 / 360 * 2 * math.pi;
            width = 1 if angle > math.pi else 2

            x2 = W * (0.5 + math.cos(angle) * 0.3);
            y2 = H * (0.6 + math.sin(angle) * 0.05);

            pygame.draw.line(screen,(color,color,color),(x1,y1),(x2,y2),width)
            pygame.draw.line(screen,(color,color,color),(x2,y2),(x3,y3),width)

    def update(self):
        self.angle -= 5
        if self.angle < 0:
            self.angle += 360

class dropGround():
    def __init__(self, position):
        self.position = position

    def draw(self):

        for i in range(9,-1,-1):
            pos = self.position + i

            x = W / 2;
            y = H * (0.75 + 0.25 * pos * pos / 60 / 60);
            r = (pos * pos) / 3600 * (W / 2);
    
            color = 255 * (i + 1) / 10
        
            pygame.draw.ellipse(screen,(color,color,color),(x-r, y-r*0.3, 2*r,2*r*0.3))

    def update(self):
        self.position += 1
        if self.position > 60:
            self.position = 0

circles = []
for i in range(3):
    circles.append(rotateCircle(360 / 3 * i))

lines = []
for i in range(6):
    lines.append(rotateLine(360 / 6 * i))

grounds = []
for i in range(5,-1,-1):
    grounds.append(dropGround(i / 6 * 60))

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
