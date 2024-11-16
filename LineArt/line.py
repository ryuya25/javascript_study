import pygame,math

pygame.init()

W, H = 800, 600

screen =  pygame.display.set_mode((W,H))

clock = pygame.time.Clock()
count = 0
count_circle = 0


base=[]
for i in range(1,61)[::-1]:
    x = W / 2
    y = H / 4 * 3 + H / 4 / 3600 * i * i
    
    r = i*i/3600*W/2
    
    base.append([x,y,r])

circle=[]
for i in range(40):
    x = math.sin(2*math.pi*i/40)*W/4*3/2+W/2 
    y = math.cos(2*math.pi*i/40)*H/6+H/3
    r = math.cos(2*math.pi*i/40)*2+10
    
    circle.append([x,y,r])
    
    
    
running = True
while running:
    for e in pygame.event.get():
        if e.type == pygame.QUIT:
            running = False
    
    screen.fill((0,0,0))
    
    for i,(x,y,r) in enumerate(base):
        
        color = 255 - 255 * ((i+ count) % 10) / 10
        
        pygame.draw.ellipse(screen,(color,color,color),(x-r, y-r*0.3, 2*r,2*r*0.3))

    for i in range(90):
        color = 255 - 255 * ((i+ count) % 10) / 10
        
        x = math.sin(2*math.pi*i/90)*160+255
        y = math.cos(2*math.pi*i/90)*38+140
        
        x = x / 512 * W
        y = y / 212 * H
        
        x1 = 255 / 512 * W
        x2 = 255 / 512 * W
        y1 = 8 / 212 * H
        y2 = 134 / 212 * H
        
#        pygame.draw.line(screen,(color,color,color),(255,8),(x,y))
#        pygame.draw.line(screen,(color,color,color),(255,134),(x,y))
        pygame.draw.line(screen,(color,color,color),(x1,y1),(x,y))
        pygame.draw.line(screen,(color,color,color),(x2,y2),(x,y))

    for i in range(1,6):
        (x,y,r) = circle[(count_circle+i)%40]
        
        color = 255 * i / 5
        
        pygame.draw.circle(screen,(color,color,color),(x, y), r)
                   
        
#for i = 26 to 114
#    line(255,8) - (sin(i/14.2)*160+255, cos(i/14.2)*38 + 140)
#    line - (255,134)
        
        
    pygame.display.flip()
    clock.tick(30)
    
    count += 1
    count_circle += 1
    
    if count >= 10:
        count = 0
    if count_circle >= 40:
        count_circle = 0
            
pygame.quit()


'''
    for i in range(20):
        color = 255 * (i % 10) * 10 
        pygame.draw.ellipse(screen,(color,color,color),(sin(i/3.2)*178*255,cos(i/3.2)*30+70,cos(i/3.2)*2+10))
    
    for i in range(26,114):
        pygame.draw.ellipse(screen,(color,color,color),(sin(i/3.2)*178*255,cos(i/3.2)*30+70,cos(i/3.2)*2+10))
'''

#for i = 60 to 0 step -1
#    circle(255,150+i*i/35,i*i/12),imod10+1
#
#for i = 0 to 19
#    circle(sin(i/3.2)*178+255,cos(i/3.2)*30+70,cos(i/3.2)*2+10,10-i mod 10
#    
#for i = 26 to 114
#    line(255,8) - (sin(i/14.2)*160+255, cos(i/14.2)*38 + 140)
#    line - (255,134)
           
#pygame.draw.line(Surface, color, start_pos, end_pos, width=1):    