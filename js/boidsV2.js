class BoidsV2 {
    constructor(x , y, app){
        this.position = new PIXI.Point(x, y);
        this.velocity = new PIXI.Point(Math.random() * 2 - 1, Math.random() * 2 - 1);
        this.acceleration = new PIXI.Point(0, 0);
        this.maxSpeed = 2;
        this.maxForce = 0.05;
        this.sprite = new PIXI.Graphics();
        this.app = app;
        this.flock = [];
        this.draw();
        this.render();
    }

    draw() {
        this.sprite.beginFill(0xffffff);
        this.sprite.drawCircle(0, 0, 5);
        this.sprite.endFill();
        this.sprite.position.set(this.position.x, this.position.y);
    }

    update() {
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        // Limitar velocidad
        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        if (speed > this.maxSpeed) {
            this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
            this.velocity.y = (this.velocity.y / speed) * this.maxSpeed;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.acceleration.set(0, 0);
        this.sprite.position.set(this.position.x, this.position.y);
    }
    

    cohesion(boid, flock) {
        let perceptionRadius = 50;
        let centerOfMass = new PIXI.Point(0, 0);
        let total = 0;

        flock.forEach(other => {
            const distance = PIXI.Point.distance(boid.position, other.position);
            if (other !== boid && distance < perceptionRadius) {
                centerOfMass.x += other.position.x;
                centerOfMass.y += other.position.y;
                total++;
            }
        });

        if (total > 0) {
            centerOfMass.x /= total;
            centerOfMass.y /= total;

            const desired = new PIXI.Point(centerOfMass.x - boid.position.x, centerOfMass.y - boid.position.y);
            desired.setMagnitude(boid.maxSpeed);
            const steer = new PIXI.Point(desired.x - boid.velocity.x, desired.y - boid.velocity.y);
            steer.setMagnitude(boid.maxForce);
            return steer;
        }

        return new PIXI.Point(0, 0);
    }

    render(){
        this.app.ticker.add(() => {
            flock.forEach(boid => {
                const cohesionForce = cohesion(boid, flock);
                boid.applyForce(cohesionForce);
                boid.update();
                this.app.stage.addChild(boid.sprite);
            });
        });
    }
}