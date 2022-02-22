var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var player, player_correndo, player_colidiu;
var solo, soloInvisivel, imagemDoSolo;

var grupoDeNuvens, imagemDaNuvem;
var grupodeobstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var pontuacao=0;

var fimDeJogo, reiniciar;

var plataforma1


function preload(){
  player_correndo =   loadAnimation("trex1.png","trex3.png","trex4.png");
  player_colidiu = loadAnimation("trex_collided.png");
  
  imagemDoSolo = loadImage("imagens/groundF.png");
  platImg = loadImage("imagens/plat.png");
  imagemDaNuvem = loadImage("cloud.png");
  
  obstaculo1 = loadImage("imagens/coca.png");
  obstaculo2 = loadImage("imagens/papel.png");
  obstaculo3 = loadImage("imagens/pet.png");
  obstaculo4 = loadImage("imagens/vidro.png");
  
  imgFimDeJogo = loadImage("gameOver.png");
  imgReiniciar = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  player = createSprite(50,height-120 ,20,50);
  
  player.addAnimation("running", player_correndo);
  player.addAnimation("collided", player_colidiu);
  player.debug=true
  player.scale = 0.5;
  
  solo = createSprite(width,height/1.4,width,20);
  solo.addImage("ground",imagemDoSolo);
  
  solo.x = solo.width/2;
  solo.velocityX = -6;
  //profuncidade
  player.depth = solo.depth;
  player.depth +=1;
  //
  
  fimDeJogo = createSprite(width /2,height-400);
  fimDeJogo.addImage(imgFimDeJogo);
  
  reiniciar = createSprite(width /2,height-360);
  reiniciar.addImage(imgReiniciar);
  
  fimDeJogo.scale = 0.5;
  reiniciar.scale = 0.5;

  fimDeJogo.visible = false;
  reiniciar.visible = false;
  
  soloInvisivel = createSprite(width/2,height-48,width,10);
  soloInvisivel.visible = false;
  
  grupoDeNuvens = new Group();
  grupoDeObstaculos = new Group();
  grupoDePlataforma = new Group();
  grupoBlocoInvisivel = new Group();
  
  pontuacao = 0;
}

function draw() {
  //player.debug = true;
  background("#2a9df4");
  textSize(25);
  text("Pontuação: "+ pontuacao, width-200,height-600);
  
  if (estadoJogo === JOGAR){
   // pontuacao = pontuacao + Math.round(getFrameRate()/60);
    solo.velocityX = -6;
    //(6 + 3*pontuacao/100)
  
    if(touches.lenght > 0 || keyDown("space") && player.y >= height-300) {
      player.velocityY = -12;
      touches = [];
    }
    
  
    player.velocityY = player.velocityY + 0.8
  
    if (solo.x < 300){
      solo.x = solo.width/2;
    }
  
    player.collide(soloInvisivel)
    gerarNuvens();
    gerarObstaculos();
    plataforma();
    if(grupoDeObstaculos.isTouching(player)){
        console.log("aee");
        pontuacao = pontuacao + 1;
    }

    if(grupoDePlataforma.isTouching(player)){
      player.velocityY = 0;
    }
  }
  else if (estadoJogo === ENCERRAR) {
    fimDeJogo.visible = true;
    reiniciar.visible = true;
    
    //define velocidade de cada objeto do jogo como 0
    solo.velocityX = 0;
    player.velocityY = 0;
    grupoDeObstaculos.setVelocityXEach(0);
    grupoDeNuvens.setVelocityXEach(0);
    
    //altera a animação do player
    player.changeAnimation("collided",player_colidiu);
    
    //define o tempo de vida dos objetos do jogo para que nunca sejam destruídos
    grupoDeObstaculos.setLifetimeEach(-1);
    grupoDeNuvens.setLifetimeEach(-1);
    
    if(mousePressedOver(reiniciar)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function gerarNuvens() {
  //escreva o código aqui para gerar as nuvens 
  if (frameCount % 60 === 0) {
    nuvem = createSprite(width,height-300,40,10);
    nuvem.y = Math.round(random(100,height-120));
    nuvem.addImage(imagemDaNuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
     //atribuir tempo de duração à variável
    nuvem.lifetime = 1000; 
    
    //ajustando a profundidade
    nuvem.depth = player.depth;
    player.depth = player.depth + 1;
        
    //adicionando nuvem ao grupo
   grupoDeNuvens.add(nuvem);
  }
  
}

function gerarObstaculos() {
  if(frameCount % 90 === 0) {
    obstaculo = createSprite(600,height-90,40,10);
    obstaculo.y = Math.round(random(100,height-120));
    obstaculo.velocityX = -3;
    
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      default: break;
    }
    
    //atribuir escala e tempo de duração ao obstáculo           
    obstaculo.scale = 0.1;
    obstaculo.lifetime = 650;

    //adicionar cada obstáculo ao grupo
    grupoDeObstaculos.add(obstaculo);
  }
}

function reset(){
  estadoJogo = JOGAR;
  fimDeJogo.visible = false;
  reiniciar.visible = false;
  
  grupoDeObstaculos.destroyEach();
  grupoDeNuvens.destroyEach();
  
  player.changeAnimation("running",player_correndo);
  
 
  
  pontuacao = 0;
  
}
function plataforma(){
  if (frameCount % 120 === 0) {
    plataforma1 = createSprite(width/2,height/1.3, 90,20);
    plataforma1.addImage(platImg)
    plataforma1.y = Math.round(random(width/3,height-120));
    plataforma1.velocityX = -3;
    grupoDePlataforma.add(plataforma1)
   // plataforma1.debug=true
    plataforma1.setCollider("rectangle",0,0,20,90,90);


  
    player.depth = plataforma1.depth;
    player.depth +=1;
    
  }
}
