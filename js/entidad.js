class Entidad {
    constructor(x, y, juego){
        this.container = new PIXI.Container();
        this.juego = juego;

        this.juego.app.stage.addChild(this.container);

        this.x = x;
        this.y = y;
        this.velocidad = {x: 0, y:0}

        this.acc = {x: 0, y: 0};

        this.changuiMargenes = 100;

    }

    aplicarFuerza(x,y){
        this.acc.x += x;
        this.acc.y += y;
    }
    /*
    rebotarContraLosBordes(){
        let distXAlMargenDercho = window.innerWidth - this.x;
        let distXAlMargenIzq = this.x;

        let distYAlMargenInferior = window.innerHeight - this.y;
        let distYAlMargenSuperior = this.y;

        let factor = 10;

        if(distXAlMargenDercho < this.changuiMargenes){
            this.aplicarFuerza(-Math.abs(distXAlMargenDercho) * factor, 0)
        }else if(this.x < this.changuiMargenes){
            this.aplicarFuerza(Math.abs(this.x) * factor, 0);
        }

        if(distYAlMargenInferior < this.changuiMargenes){
            this.aplicarFuerza(-Math.abs(distYAlMargenInferior) * factor, 0)
        }else if(distYAlMargenSuperior < this.changuiMargenes){
            this.aplicarFuerza(Math.abs(distYAlMargenSuperior) * factor, 0)
        }
    }
    */

    rebotarContraLosBordes(){
        if(this.x < this.changuiMargenes){
            this.velocidad.x = Math.abs(this.velocidad.x)
        }else if(this.x < window.innerWidth - this.changuiMargenes){
            this.velocidad.x = Math.abs(this.velocidad.x)
        }

        if(this.y < this.changuiMargenes){
            this.velocidad.y = Math.abs(this.velocidad.y)
        }else if(this.y < window.innerHeight - this.changuiMargenes){
            this.velocidad.y = Math.abs(this.velocidad.y)
        }
    }

    update(){

        //this.rebotarContraLosBordes();

        //if(isNaN(this.acc.x)) debugger
        this.position = {x: this.container.x, y: this.container.y};
        this.acc = limitMagnitude(this.acc, this.accMax)

        this.velocidad.x += this.acc.x;
        this.velocidad.y += this.acc.y;

        this.acc.x = 0;
        this.acc.y = 0;

        this.velocidad = limitMagnitude(this.velocidad, this.velMax)

        this.rebotarContraLosBordes();

        this.x += this.velocidad.x;
        this.y += this.velocidad.y;

        //this.x = (this.x + window.innerWidth) % window.innerWidth;
        //this.y = (this.y + window.innerHeight) % window.innerHeight;
 
    }       
    
    render(){

        this.angulo = Math.atan2(this.velocidad.y, this.velocidad.x),

        this.container.rotation = this.angulo;
        this.container.x = this.x;
        this.container.y = this.y;
    }
}