class Boid {
    constructor(x , y, app){
        this.position = new PIXI.Point(x, y);
        this.velocity = new PIXI.Point(Math.random() * 2 - 1, Math.random() * 2 - 1);
        this.size = 5;
        this.app = app;
    }

    update(boids) {
        // Aquí se implementan las reglas de Boids
        this.flock(boids);
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Lógica para mantener dentro del lienzo
        if (this.position.x < 0 || this.position.x > this.app.view.width) {
            this.velocity.x *= -1;
        }
        if (this.position.y < 0 || this.position.y > this.app.view.height) {
            this.velocity.y *= -1;
        }
    }
    
    distance(pointA, pointB) {
        const dx = pointA.x - pointB.x;
        const dy = pointA.y - pointB.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    distance(pointA, pointB) {
        const dx = pointA.x - pointB.x;
        const dy = pointA.y - pointB.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    flock(boids) {
        // Implementa separación, alineación y cohesión
        // Ejemplo de separación:
        let separation = new PIXI.Point(0, 0);
        boids.forEach(boid => {
            const dist = this.distance(this.position, boid.position);
            if (dist > 0 && dist < 50) {
                separation.x += this.position.x - boid.position.x;
                separation.y += this.position.y - boid.position.y;
            }
        });
        this.velocity.x += separation.x * 0.05;
        this.velocity.y += separation.y * 0.05;
    }
}