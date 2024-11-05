class Juego {
    constructor() {

        this.app = new PIXI.Application();

        this.players = [];
        this.player;
        this.playerContainer = new PIXI.Container();
        this.keys = {};
        this.boids = [];
        this.boidsV2 = [];
        this.graphicsArray = [];

        this.canvasWidth = window.innerWidth * 2;
        this.canvasHeight = window.innerHeight * 2;

        let promesa = this.app.init({ background: '#1099bb', resizeTo: window, height: this.canvasWidth, width: this.canvasHeight });

        //this.ponerListeners()
        //this.moverPlayer()
        

        promesa.then((e) => {
            document.body.appendChild(this.app.canvas)
            this.app.stage.addChild(this.playerContainer);
            window.__PIXI_APP__ = this.app;
            
            //this.constroles();
            this.constrolesV2();

            this.app.ticker.add(() => {
                //this.update();
                this.player.update();
                this.actualizarCamara();
                //console.log(this.app.renderer.width / 2);
            });
            
            this.cargarPlayer();
            
            this.cargarBoids();
            this.moverBoids();
            
            
            
        })
    }

    update(){
        
    }

    
    /*
    constroles(){
        //if(!this.playerV3[0].listo) return
        let speed = 5
        window.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
        });
        
        window.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;

            if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
                this.players[0].dejarDeCorrer(); // Acción para dejar de correr
            }
        });

        this.app.ticker.add(() => {
           for (const key in this.keys) {
                if (this.keys[key]) {
                    switch (key) {
                        case 'KeyW':
                            this.players[0].moverArriba(); // Mover hacia arriba
                            break;
                        case 'KeyS':
                            this.players[0].moverAbajo(); // Mover hacia abajo
                            break;
                        case 'KeyA':
                            this.players[0].moverIzquierda(); // Mover hacia la izquierda
                            break;
                        case 'KeyD':
                            this.players[0].moverDerecha(); // Mover hacia la derecha
                            break;
                        case 'ShiftLeft':
                            this.players[0].correr();
                            break;
                    }
                }
           }
        });
    }
    */

    constrolesV2(){
        //if(!this.playerV3[0].listo) return
        let speed = 5
        window.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
        });
        
        window.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;

            if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
                this.player.dejarDeCorrer(); // Acción para dejar de correr
            }
        });

        this.app.ticker.add(() => {
           for (const key in this.keys) {
                if (this.keys[key]) {
                    switch (key) {
                        case 'KeyW':
                            this.player.moverArriba(); // Mover hacia arriba
                            break;
                        case 'KeyS':
                            this.player.moverAbajo(); // Mover hacia abajo
                            break;
                        case 'KeyA':
                            this.player.moverIzquierda(); // Mover hacia la izquierda
                            break;
                        case 'KeyD':
                            this.player.moverDerecha(); // Mover hacia la derecha
                            break;
                        case 'ShiftLeft':
                            this.player.correr();
                            break;
                    }
                }
           }
        });
    }
    
    cargarPlayer(){
        //this.player = new Player(400, 300, this.app, this);
        this.player = new Player(window.innerWidth / 2, window.innerHeight / 2, this.app, this);
    }
    cargarContainer(){
        //this.app.stage.addChild(this.playerContainer);
        this.playerContainer.addChild(this.player);

    }
    actualizarCamara(){
        let lerpFactor = 0.05;
        

        const playerX = this.player.playerContainer.x;
        const playerY = this.player.playerContainer.y;

        const halfScreenWidth = this.app.screen.width / 5;
        const halfScreenHeight = this.app.screen.height / 5;
        
        const targetX = halfScreenWidth - playerX;
        const targetY = halfScreenHeight - playerY;

        const clampedX = Math.min(
            Math.max(targetX, -(this.canvasWidth - this.app.screen.width)),
            0
        );
        const clampedY = Math.min(
            Math.max(targetY, -(this.canvasHeight - this.app.screen.height)),
            0
        );
        
        this.app.stage.position.x = lerp(
            this.app.stage.position.x,
            clampedX,
            lerpFactor
        );
        this.app.stage.position.y = lerp(
            this.app.stage.position.y,
            clampedY,
            lerpFactor
        );

        const fixedObject = this.player.barraVida; // Asegúrate de tener este objeto definido
        fixedObject.x = this.app.stage.position.x + 1; // Margen deseado desde la esquina
        fixedObject.y = this.app.stage.position.y + 1; // Margen deseado desde la esquina
        
        
    }
    /*
    cargarBoids(){
        for (let i = 0; i < 10; i++) {
            this.boids.push(new Boid(Math.random() * this.app.view.width, Math.random() * this.app.view.height, this.app));
        }
    }

    moverBoids(){
        this.app.ticker.add(() => {
            this.boids.forEach(boid => {
                boid.update(this.boids);
                // Dibuja el boid
                const graphics = new PIXI.Graphics();
                graphics.beginFill(0x66CCFF);
                graphics.drawCircle(boid.position.x, boid.position.y, boid.size);
                graphics.endFill();
                this.app.stage.addChild(graphics);
            });
        });
    }
    */
    
    cargarBoids(){
        for (let i = 0; i < 10; i++) {
            const boid = new Boid(Math.random() * this.app.view.width, Math.random() * this.app.view.height, this.app);
            this.boids.push(boid);
        
            const graphics = new PIXI.Graphics();
            graphics.beginFill(0x66CCFF);
            graphics.drawCircle(0, 0, boid.size); // Dibuja en (0, 0)
            graphics.endFill();
            this.app.stage.addChild(graphics);
            this.graphicsArray.push(graphics);
        }
    }

    moverBoids(){
        this.app.ticker.add(() => {
            this.boids.forEach((boid, index) => {
                boid.update(this.boids);
                // Actualiza la posición del gráfico existente
                const graphics = this.graphicsArray[index];
                graphics.x = boid.position.x;
                graphics.y = boid.position.y;
            });
        });
    }

    cargarBoidsV2(){
        for (let i = 0; i < 100; i++) {
            const boid = new Boid(Math.random() * app.screen.width, Math.random() * app.screen.height);
            flock.push(boid);
        }
    }
}