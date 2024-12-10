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

        this.entidades = [];
        this.depredadores = [];

        this.canvasWidth = window.innerWidth * 4;
        this.canvasHeight = window.innerHeight * 4;

        this.escala = 1;

        this.tamanoCelda = 100;

        let promesa = this.app.init({ background: '#1099bb', resizeTo: window, height: this.canvasWidth, width: this.canvasHeight });

        //this.ponerListeners()
        //this.moverPlayer()
        

        promesa.then((e) => {
            this.juegoListo();
            this.cargarBoids();
            this.moverBoids();
        })
    }

    juegoListo(){
        this.contenedorPrincipal = new PIXI.Container();
        this.contenedorPrincipal.name = "contenedorPrincipal";
        this.app.stage.addChild(this.contenedorPrincipal);

        document.body.appendChild(this.app.canvas)
        this.app.stage.addChild(this.playerContainer);
        window.__PIXI_APP__ = this.app;
        
        this.grid = new Grid(this, this.tamanoCelda);

        // Update
        this.app.ticker.add((e) => {
            this.player.update();
            //this.moverCamara();
            
            this.update(e)
            //this.moverUI();
            
        });

        //this.cargarFondoV2();
        
        this.constrolesV2();
        this.cargarPlayer();
        //this.cargarBoids();
        //this.moverBoids();
        this.cargarCubo();
        this.crearUI();
        
        //this.ponerListeners();
        
        
    }

    

    cargarFondo(){
        PIXI.Assets.load("../Assets/img/fondo.jpg").then((textura) => {
            this.fondo = new PIXI.Sprite(textura);

            this.fondo.width = app.screen.width;
            this.fondo.height = app.screen.height;

            this.app.stage.addChild(fondo);
        }).catch((error) => {
            console.error("Error al cargar la imagen de fondo:", error);
        });
        
    }

    cargarFondoV2(){
        PIXI.Texture.fromURL("./Assets/img/fondo.jpg").then((patternTuexture) => {
            this.backgroundSprite = new PIXI.TilingSprite(patternTuexture, 5000, 5000);

            this.app.stage.addChild(this.backgroundSprite);
        });
        
    }

    crearUI(){
        this.ui = new PIXI.Container();
        this.ui.name = "UI";
        this.app.stage.addChild(this.ui);

        this.uiVida();

        //this.ui.pivot.x = this.ui.x;
        //this.ui.pivot.x = this.ui.y;
         
    }

    uiVida(){
        this.barraVida = new PIXI.Graphics();
        this.barraVida.name = "BarraVida";
        this.barraVida.beginFill(0xFF0000);
        this.barraVida.drawRect(20, 20, 500, 20); // (100, 100) es la posición y (200, 150) es el tamaño
        this.barraVida.endFill();

        this.ui.addChild(this.barraVida);
    }


    moverUI(){
        this.ui.x = 
            this.playerContainer.x - window.innerWidth / 2 ;
        this.ui.y = 
            this.playerContainer.y - window.innerHeight / 2 / this.escala;
    }

    
    
    // ----- Controles ------
    constrolesV2(){
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

    

    cargarCubo(){
        this.cubo = new PIXI.Graphics();
        this.cubo.name = "CUBO"
        this.cubo.beginFill(0xFF0000);
        this.cubo.drawRect(2000, 1000, 500, 500); // (100, 100) es la posición y (200, 150) es el tamaño
        this.cubo.endFill();

        this.contenedorPrincipal.addChild(this.cubo);
    }
    /*
    cargarContainer(){
        //this.app.stage.addChild(this.playerContainer);
        this.playerContainer.addChild(this.player);
        this.contenedorPrincipal.addChild(this.playerContainer);

    }
    */
    


    actualizarCamara(){
        let lerpFactor = 0.05;
        

        const playerX = this.player.playerContainer.x;
        const playerY = this.player.playerContainer.y;

        const halfScreenWidth = this.app.screen.width / 2;
        const halfScreenHeight = this.app.screen.height / 2;
        
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
        /*
        const fixedObject = this.ui; // Asegúrate de tener este objeto definido
        fixedObject.x = this.app.stage.position.x + 1; // Margen deseado desde la esquina
        fixedObject.y = this.app.stage.position.y + 1; // Margen deseado desde la esquina
        */
        
    }
    moverCamara(){
        this.contenedorPrincipal.x = - this.player.playerContainer.x;
        this.contenedorPrincipal.y = - this.player.playerContainer.y;
    }

    update(e){
        this.objetoTickDePixi = e;

        //this.moverCamara();
        //console.log(this.player.playerContainer.x);
        this.actualizarCamara();

        this.grid.update();
        this.player.update();
        

        for (let entidad of this.entidades){
            entidad.update();
            entidad.render();
        }

        
    }

    agregarDepredador(x,y){
        let depredador = new Depredador(x, y, this)
        this.entidades.push(depredador);
        this.depredadores.push(depredador);
    }

    
    cargarBoids(){
        for (let i = 0; i < 2; i++) {
            const boid = new Boid(Math.random() * this.app.view.width, Math.random() * this.app.view.height, this.app);
            this.boids.push(boid);
        
            const graphics = new PIXI.Graphics();
            graphics.beginFill(0x66CCFF);
            graphics.drawCircle(0, 0, boid.size); // Dibuja en (0, 0)
            graphics.endFill();
            //this.app.stage.addChild(graphics);
            this.contenedorPrincipal.addChild(graphics);
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