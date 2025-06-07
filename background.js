// Basitleştirilmiş parçacık efekti
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('main');
    const ctx = canvas.getContext('2d');
    
    // Canvas boyutunu ayarla
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Parçacık ayarları
    const particles = [];
    const particleCount = 150;
    
    // Vektör işlemleri için yardımcı fonksiyonlar
    const vNorm = (v) => {
        const mag = Math.sqrt(v[0]*v[0] + v[1]*v[1]);
        return [v[0]/mag, v[1]/mag];
    };
    
    const vScale = (s, v) => [v[0]*s, v[1]*s];
    const vAdd = (v1, v2) => [v1[0]+v2[0], v1[1]+v2[1]];
    const vSub = (v1, v2) => [v1[0]-v2[0], v1[1]-v2[1]];
    const vDist = (v1, v2) => Math.sqrt(Math.pow(v1[0]-v2[0], 2) + Math.pow(v1[1]-v2[1], 2));
    const vMag = (v) => Math.sqrt(v[0]*v[0] + v[1]*v[1]);
    
    // Rastgele sayı üretici
    const rndB = (range) => Math.random() * (range[1] - range[0]) + range[0];
    const rndIntB = (range) => Math.round(rndB(range));
    
    // Parçacık oluştur
    const createParticle = () => ({
        pos: [rndIntB([0, canvas.width]), rndIntB([0, canvas.height])],
        vel: vScale(rndB([1, 3]), vNorm([rndB([-1, 1]), rndB([-1, 1])]))
    });
    
    // Parçacık sınır kontrolü
    const bounds = (p) => {
        if (p.pos[0] < -15) p.pos[0] = canvas.width;
        if (p.pos[0] > canvas.width + 15) p.pos[0] = 0;
        if (p.pos[1] < -15) p.pos[1] = canvas.height;
        if (p.pos[1] > canvas.height + 15) p.pos[1] = 0;
    };
    
    // Parçacıkları oluştur
    for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
    }
    
    // Animasyon döngüsü
    let frameCount = 0;
    const draw = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const T = 30 + 30 * Math.sin(frameCount * 0.01);
        
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.pos[0], p.pos[1], 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fill();
            
            p.pos = vAdd(p.pos, p.vel);
            bounds(p);
            
            if (vMag(p.vel) > 3) {
                p.vel = p.vel.map(c => c * 0.995);
            }
            
            particles.forEach(o => {
                if (o !== p && vDist(p.pos, o.pos) <= T) {
                    ctx.beginPath();
                    ctx.moveTo(p.pos[0], p.pos[1]);
                    ctx.lineTo(o.pos[0], o.pos[1]);
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                    ctx.stroke();
                }
            });
        });
        
        frameCount++;
        requestAnimationFrame(draw);
    };
    
    // Tıklama etkisi
    canvas.addEventListener('click', (evt) => {
        const cPos = [evt.clientX, evt.clientY];
        particles.forEach(p => {
            const iDir = vNorm(vSub(p.pos, cPos));
            p.vel = vAdd(vAdd(
                vNorm([rndB([-1, 1]), rndB([-1, 1])]),
                vScale(10, iDir)
            ), p.vel);
        });
    });
    
    // Pencere boyutu değiştiğinde
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    draw();
});