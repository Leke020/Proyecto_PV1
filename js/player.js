class Player {
    constructor(x, y, app, juego) {
        this.player = new PIXI.Graphics();
        this.playerContainer = new PIXI.Container();
        this.playerPosition = new PIXI.Point(x, y);
        this.hudContainer = new PIXI.Container();
        //this.playerContainer
        this.barraVida = new PIXI.Graphics();
        this.x = x;
        this.y = y;
        this.app = app;
        this.juego = juego;
        
        this.speed = 5;

        this.listo = false;
        
        
        //this.setUp();
        this.crearPlayer();
        this.barraDeVida();
        this.update();
        this.backGroundCont()
        
    }

    setUp(){
        this.app.stage.addChild(this.hudContainer);
        this.hudContainer.innerWidth = window.innerWidth;
        this.hudContainer.innerHeight = window.innerHeight;
        
    }

    crearPlayer(){
        

        // Configurar el color y la transparencia
        this.player.beginFill(0xFFFFFF, 1); // Color rojo con opacidad total
        this.player.drawCircle(this.x, this.y, 50); // Dibuja un círculo en (400, 300) con radio 50
        this.player.endFill();
        this.player.pivot.set(this.x, this.y)
        // Añadir el gráfico al escenario
        this.player.x = this.x;
        this.player.y = this.y;
        this.playerContainer.addChild(this.player)
        this.app.stage.addChild(this.playerContainer);
        this.listo = true;
        //this.player = graphics;
    }

    // Movimiento

    moverIzquierda(){
        //this.player.x -= this.speed
        
        this.playerContainer.x -= this.speed
    }
    moverDerecha(){
        //this.player.x += this.speed
        this.playerContainer.x += this.speed
        
    }
    moverArriba(){
        //this.player.y -= this.speed
        this.playerContainer.y -= this.speed
    }
    moverAbajo(){
        //this.player.y += this.speed
        this.playerContainer.y += this.speed
    }
    correr(){
        this.speed = 10
    }
    dejarDeCorrer(){
        this.speed = 5
    }
    // HUD

    barraDeVida(){
        this.barraVida.beginFill(0xFF0000); // Color rojo
        this.barraVida.drawRect(0, 0, 400, 30); // x, y, ancho, alto
        this.barraVida.endFill();
        this.app.stage.addChild(this.barraVida);
        this.playerContainer.addChild(this.barraVida);
        //this.hudContainer.addChild(this.barraVida);
        
        //this.hudContainer.background()
    }

    backGroundCont(){
        const fondo = new PIXI.Graphics();
        fondo.beginFill(0xFF0000); // Color rojo
        fondo.drawRect(100, 100, 500, 600); // Ajusta el tamaño según necesites
        fondo.endFill();
        //this.hudContainer.addChild(fondo);
    }
    
    mantenerElemento(){
        this.barraVida.x = window.innerWidth - 70;
        this.barraVida.y = 10;
    }

    update(){
        console.log("test");
        //console.log(this.app.renderer.height)
        //this.mantenerElemento()
        console.log(this.juego.canvasHeight);
        console.log(this.playerPosition.x)
        if (this.playerPosition.x < 0 || this.playerPosition.x > this.app.view.width) {
            this.speed = 0;
        }
        if (this.playerPosition.y < 0 || this.playerPosition.y > this.app.view.height) {
            this.speed = 0;
        }
    }
    
}


