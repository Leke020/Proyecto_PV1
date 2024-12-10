class Depredador extends Entidad{
  constructor(x, y, juego){
    super(x, y, juego);
    this.lado = 10;
    this.velMax = 10;
    this.accMax = 1;
    this.crearGrafico();

    this.estado = 0;

    this.distanciaParaFrenar = 100;
    
    this.vision = 200;
//
    this.position = new PIXI.Point(x, y);
    this.velocity = new PIXI.Point(Math.random() * 2 - 1, Math.random() * 2 - 1);

  }

  crearGrafico(){
    this.grafico = new PIXI.Graphics()
      .rect(0, 0, this.lado, this.lado / 2)
      .fill(0xffff00);
    this.container.addChild(this.grafico);
  }


  estados(){
    if (this.estado == 1){
      this.perseguir(this.juego.player.position);
    }else{
      //this.pasivo(this.juego.player.position);
      this.pasivoV2();
    }
  }

  perseguir(aQuien){
    if(!aQuien) return

    let vectorQApuntaAltarget = {x: aQuien.x - this.x, y: aQuien.y - this.y};
    let vectorNormalizado = normalizeVector(vectorQApuntaAltarget);

    let velocidadDeseadaNormalizada = {
      x: vectorNormalizado.x * this.velMax, 
      y: vectorNormalizado.y * this.velMax
    };

    this.distanciaAlObjetivo = distancia(this, aQuien);
    if (this.distanciaAlObjetivo < this.distanciaParaFrenar){
      velocidadDeseadaNormalizada = {x: 0, y: 0};
    }

    let fuerzaParaGirar = {
      x: velocidadDeseadaNormalizada.x - this.velocidad.x, 
      y: velocidadDeseadaNormalizada.y - this.velocidad.y
    };



    this.aplicarFuerza(fuerzaParaGirar.x, fuerzaParaGirar.y);

  }

  pasivo(aQuien){
    if(!aQuien) return

    this.velMax = 1;
    this.accMax = 0.1;

    let vectorQApuntaAltarget = {x: this.x - aQuien.x, y: this.y - aQuien.y};
    let vectorNormalizado = normalizeVector(vectorQApuntaAltarget);

    let velocidadDeseadaNormalizada = {
      x: vectorNormalizado.x * this.velMax, 
      y: vectorNormalizado.y * this.velMax
    };


    let fuerzaParaGirar = {
      x: velocidadDeseadaNormalizada.x - this.velocidad.x, 
      y: velocidadDeseadaNormalizada.y - this.velocidad.y
    };

    

    this.aplicarFuerza(fuerzaParaGirar.x, fuerzaParaGirar.y);
  }

  pasivoV2(){
    this.velMax = 1;
    this.accMax = 0.1;
    this.aplicarFuerza(this.velocity.x, this.velocity.y);
    //this.position.x += this.velocity.x;
    //this.position.y += this.velocity.y;
    
  }

  agruparse(){
    this.depsCerca = []
    for(let dep of this.juego.depredadores){
      if(dep == this)continue;
      let dist = distancia(dep, this)
      if(dist<this.vision){
        this.depsCerca.push(dep);
      }
    }

    let promX = 0;
    let promY = 0;

    for(let depredadorCerca of this.depsCerca){
      promX += depredadorCerca.x;
      promY += depredadorCerca.y;
    }

    promX /= this.depsCerca.length
    promY /= this.depsCerca.length

    let vectorQApuntaAlPromedioDeposiciones = {
      x:this.x-promX, 
      y:this.y-promY,
    };

    let factor = 0.01;

    this.aplicarFuerza(
      vectorQApuntaAlPromedioDeposiciones.x*factor, 
      vectorQApuntaAlPromedioDeposiciones.y*factor
    );

  }

separacion(){
  this.depsCercaParaSeparacion = []
    for(let dep of this.juego.depredadores){
      if(dep == this)continue;
      let dist = distancia(dep, this)
      if(dist<this.vision/2){
        this.depsCercaParaSeparacion.push(dep);
      }
    }

    let promX = 0;
    let promY = 0;

    for(let depredadorCerca of this.depsCercaParaSeparacion){
      promX += depredadorCerca.x;
      promY += depredadorCerca.y;
    }

    promX /= this.depsCercaParaSeparacion.length;
    promY /= this.depsCercaParaSeparacion.length;

    let vectorQApuntaAlPromedioDeposiciones = {
      x: promX - this.x, 
      y: promY - this.y
    };

    let factor = 1;

    this.aplicarFuerza(
      vectorQApuntaAlPromedioDeposiciones.x*factor, 
      vectorQApuntaAlPromedioDeposiciones.y*factor
    );
  

}


  hacerDaño(){
    if (this.juego.player.position < this.position){
      console.log("daño");
    }
  }

  update(){
    super.update();
    this.agruparse();
    this.separacion();
    this.hacerDaño();
    this.estados()
    //console.log(this.juego.player.position)
    
  }
}
  