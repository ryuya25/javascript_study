import pygame,random

pygame.init()

W, H = 800, 600

win =  pygame.display.set_mode((W,H))

stars = [
    {
        'x':random.randint(0,W),
        'y':random.randint(0,H),
        'r':random.randint(1,3),
        'c':random.choice([(255,102,193),(240,230,140),(221,160,221),(173,216,230)]),
        'd':random.randint(1,5),
    } for _ in range(100)
]

shooting_star=None

clock = pygame.time.Clock()

running = True
while running:
    for e in pygame.event.get():
        if e.type == pygame.QUIT:
            running = False

    if not shooting_star and random.random()<0.1:
        shooting_star={'x':random.randint(0,W),'y':random.randint(0,H/2),'dx':random.uniform(5,10),'dy':random.uniform(5,10)}
            
    win.fill((25,25,112))
    
    for s in stars:
        if random.random() < 0.05:
            s['r'] = random.randint(1,3)
        s['x'] += s['d'] / 3
        s['y'] += s['d'] / 5

        if s['x'] > W:
            s['x'] -= W
        if s['y'] > H:
            s['y'] -= H
        pygame.draw.circle(win,s['c'],(s['x'],s['y']),s['r'])

    if shooting_star:
        pygame.draw.line(win,(255,255,255),
                         (shooting_star['x'],shooting_star['y']),
                         (shooting_star['x']+shooting_star['dx']*2,shooting_star['y']+shooting_star['dy']*2), 3)
        shooting_star['x']+=shooting_star['dx']
        shooting_star['y']+=shooting_star['dy']
        if shooting_star['x'] >W or shooting_star['y'] > H:
            shooting_star = None
    
    pygame.display.flip()
    clock.tick(30)

pygame.quit()
