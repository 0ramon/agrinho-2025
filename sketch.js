// === VARIAVEIS ===
// tamanho da tela
let largura_tela = 650, altura_tela = 450;
let progresso = 0; // em que parte do jogo está
let recomecar = true; // reinicia o personagem quando ele perde

// slides da historia 
let slide = {
  qual: 1, // qual slide o jogo mostra 
  recomecar: false 
}

let tutorial = { 
  // imagens que aparecem no tutorial
  cargas: null,
  distancia: null,
}

// transição
let transicao = {
  ocorrendo: false, // está ocorrendo?
  opacidade: 0, // o quanto está transparente
  tipo: "", // vai sair ou entrar?
  proximo_progresso: 0 // proximo nivel depois de sair
}

// botao jogar
let botao = {
  // posição
  x: 325,
  y: 300,
  
  // tamanho
  largura: 130, 
  altura: 45,
  cor: [100, 180, 117], // cor verde
  sprite: null, // imagem do botão
}

// personagem
let personagem = {
  // posição
  x : 325,
  y : 320,
  
  // tamanho
  largura : 150,
  altura: 200,
  
  // configurações
  passos: 5,
  pode_andar: false, 
  imunidade: false, // verifica se o personagem pode colidir com os troncos
  morreu: false, // vê se o personagem perdeu
  animar: 0, // muda a fantasia atual do trator
  contar_quadros: 0, // define o tempo de cada fantasia
  
  // fantasias
  sprite1: null,
  sprite2: null,
  sprite3: null,
  sprite4: null,
  sprite5: null,
  sprite6: null,
  sprite_atual1: null,
  sprite_atual2: null,
} 

// painel de informações
let informacoes_distancia = {
  distancia: 500, // distancia total
  distancia_percorrida: 0, // quanto o jogador percorreu 
  velocidade: 5, // veocidade do jogo
  cargas: 3 // vidas restantes
}

// rua do jogo
let rua = {
  // posição
  y: 225,
  y2: -175,
  x: 325,
  
  se_mover: true // vê se a rua é para se movimentar
}

// troncos do jogo
let troncos = {
  // posição
  x: 155,
  y: -700,
  
  // tamanho
  largura: 290,
  altura: 60,
  
  lado: "direita", // qual lado o tronco vai vir
  sprite1: null, // aparencia do tronco
}

let avisos = {
  // posição
  x: 325,
  
  // tamanho
  tamanho: 70,
  
  sprite: null, // fantasia do tronco
}

// === VARIAVEIS DE SONS ===
let clicar;

// === CARREGAR IMAGENS E SONS ===
function preload() {
  // tutorial
  tutorial.cargas = loadImage("imagens/cargas.png")
  tutorial.distancia = loadImage("imagens/distancia.png")
  // troncos
  troncos.sprite1 = loadImage("imagens/tronco 1.png")

  // aviso
  avisos.sprite = loadImage("imagens/aviso.png")
  
  // botao
  botao.sprite = loadImage("imagens/avancar.png")
  
  // personagem
  personagem.sprite1 = loadImage("imagens/personagem/sprite 1 a.png")
  personagem.sprite2 = loadImage("imagens/personagem/sprite 1 b.png")
  personagem.sprite3 = loadImage("imagens/personagem/sprite 2 a.png")
  personagem.sprite4 = loadImage("imagens/personagem/sprite 2 b.png")
  personagem.sprite5 = loadImage("imagens/personagem/sprite 3 a.png")
  personagem.sprite6 = loadImage("imagens/personagem/sprite 3 b.png")
  
  // sons
  clicar = loadSound("sons/toc.wav")
}

function setup() {
  let canvas = createCanvas(largura_tela, altura_tela); // cria a tela
  canvas.id('meuCanvas'); // centraliza a tela 
  rectMode(CENTER); // define o meio dos retangulos
  textAlign(CENTER, CENTER); // centraliza os textos
  imageMode(CENTER) // imagem centralizada
  textFont("Bebas Neue");
}

function draw() {
  
  // === CARREGA AS FASES DO JOGO ===
  switch (progresso) {
    case 0:
      menu_inicio(); // menu inicial (começar)
      break
    case 1:
      slides(); // história inicial
      break
    case 2:
      if (personagem.morreu) {
        tela_morte(); // se o personagem está morto então tela de morte
      } else {
        jogo_principal(); // senão jogo normal
      }
      break;
    case 3:
      fim(); // finalisa a história
      break
  }
  
  // === TRANSIÇÃO DE TELAS ===
  if (transicao.ocorrendo == true) { // verifica se é para fazer a transição
    if (transicao.tipo == "out") { // qual o tipo de transição
        transicao.opacidade += 10; // aumenta 10
        if (transicao.opacidade >= 255) {
          progresso = transicao.proximo_progresso;
          fazer_transicao("in"); // entra a transição de entrar
        }
    }
    else if (transicao.tipo == "in") {
        transicao.opacidade -= 10; // aumenta a transparencia da tela
        if (transicao.opacidade <= 0) {
          transicao.ocorrendo = false;
        }
    }
    
    // === CRIA A TELA DE TRANSIÇÃO ===
    // cria um quadrado escuro que aumenta sua opacidade dependendo da animação
    fill(0, transicao.opacidade);
    rect(largura_tela / 2, altura_tela / 2, largura_tela, altura_tela);
  }
}

// === FAZ A TRANSIÇÃO ===
  // quando a função é chamada faz a transição aqui e no draw
function fazer_transicao(tipo, proximoProgresso) { 
  transicao.ocorrendo = true;
  transicao.tipo = tipo;
  transicao.proximo_progresso = proximoProgresso;
  if (transicao.tipo == "out") {
    transicao.opacidade = 0;
  } else {
    transicao.opacidade = 255;
  }
}

// === MOUSE PRESSIONADO ===
function mousePressed() {
  if (progresso == 0 && tocando_no_botao_jogar()){
    clicar.play(); // toca o efeito sonoro de clicar
    fazer_transicao("out", 1); // verifica se o botão jogar foi pressionado e chama a a transição "out" 
  }
  // botão de avançar slides
  let d = dist(mouseX, mouseY, 600, 400);
  
  // se estiver na tela de trocar de slide e o mouse for clicado emcima do botão,então troque de slide
  if (progresso == 1 || progresso == 3 && d < 30 && slide.recomecar == false){ // botão de avançar slide
    slide.qual += 1;
    clicar.play(); // toca o efeito sonoro de clicar
  }
  if (progresso == 3 && slide.recomecar && tocando_no_botao_jogar()){ // botão de recomecar
    fazer_transicao("out", 0);
    clicar.play(); // toca o efeito sonoro de clicar
    slide.recomecar = false;
  }
  
  if (progresso == 2 && personagem.morreu && tocando_no_botao_jogar()){
    personagem.morreu = false
    informacoes_distancia.cargas = 3
    recomecar = true
    clicar.play(); // toca o efeito sonoro de clicar
    fazer_transicao("in", 2)
  }
}

// verifica se a posição do mouse e do botao se tocam
function tocando_no_botao_jogar(){ 
  return(mouseX > botao.x - botao.largura / 2 &&
        mouseX < botao.x + botao.largura / 2 &&
        mouseY > botao.y - botao.altura / 2 &&
        mouseY < botao.y + botao.altura / 2)
}

// === TELA INICIAL ===
function menu_inicio() {
  slide.qual = 1;
  background(255); // cor do fundo
  textSize(20); // tamanho da fonte

  // botão jogar
  fill(botao.cor); 
  rect(botao.x, botao.y, botao.largura, botao.altura, 10); // Botão com borda arredondada
  textSize(80)
  fill(0)
  text("troncos na estrada", largura_tela/2, 150); // titulo

  // texto da tela
  textSize(20)
  fill(0);
  textFont("Bebas Neue");
  text("jogar", botao.x, 302);
  text("Por Ramon Filipe Cius", 90, 430);
  text("Agrinho 2025", 580, 430);

  // muda a cor quando o mouse passa por cima do botão
  if (tocando_no_botao_jogar()) {
    botao.cor = [153, 205, 148];
  } else {
    botao.cor = [100, 180, 117];
  }
}

// === HISTÓRIA DO JOGO ===
function slides() { 
  background(255);
  fill(0)
  
 switch (slide.qual){
  case 1:
    textSize(24);
    text("Marquito é um agricultor que vive na mesma fazenda desde criança. Mas ele enfrenta um grande desafio: levar suas colheitas até a cidade para vender e garantir o seu sustento. Isso se torna ainda mais difícil por morar em uma região isolada, distante das cidades.", largura_tela / 2, 100, 550);
    textSize(18);
    text("slide 1 de 6", 50, 430);
    break;
    
  case 2:
    textSize(24);
    text("Depois de uma noite de tempestade, várias árvores caíram e bloquearam a estrada. Agora, você irá controlar Marquito e ajudá-lo a desviar dos troncos pelo caminho. Cada vez que bater em um tronco, ele perderá parte das cargas. Se todas forem perdidas, será necessário recomeçar a viagem!", largura_tela / 2, 100, 550);
    textSize(18);
    text("slide 2 de 6", 50, 430);
    break;
    
  case 3:
    textSize(24);
    text("Marquito leva sua colheita até a cidade e, com o dinheiro que ganha, compra novas tecnologias, ferramentas e produtos para investir na produção rural. Esses itens são adquiridos na cidade, o que movimenta o comércio local e fortalece a economia urbana. Além disso, seus alimentos ajudam a abastecer a população.", largura_tela / 2, 100, 550);
    textSize(18);
    text("slide 3 de 6", 50, 430);
    break;
    
  case 4:
    textSize(24);
    text("Use as setas direita e esquerda do teclado para mover o trator e desviar dos troncos. A barra no topo mostra quantas cargas ainda restam e a distância até a cidade.", largura_tela / 2, 100, 550);
    textSize(18);
    text("slide 4 de 6", 50, 430);
    image(tutorial.cargas, 200, 300,)
    image(tutorial.distancia, 425, 300,)
    break;
    
  case 5:
    textSize(24);
    text("Fique atento aos avisos na tela! Eles indicam de qual lado o próximo tronco vai aparecer. Se você perder todas as cargas, não se preocupe: sempre é possível tentar de novo!", largura_tela / 2, 100, 550);
    rect(largura_tela / 2, 300, 100, 100, 20)
    image(avisos.sprite, largura_tela / 2, 300, 90, 90)
    textSize(18);
    text("slide 5 de 6", 50, 430);
    break;
    
  case 6:
    textSize(28);
    text("Prepare-se!", largura_tela / 2, 180);
    text("3... 2... 1...", largura_tela / 2, 230);
    textSize(18);
    text("slide 6 de 6", 50, 430);
    fazer_transicao("out", 2);
    break;
} 
  image(botao.sprite, 600, 400, 55, 55)
}

// === JOGO PRINCIPAL ===
function jogo_principal(){
  if (!personagem.morreu){
    if (informacoes_distancia.cargas == 0){
      personagem.morreu = true
      fazer_transicao("in", 2)
    } else {
      // === SEQUENCIA DE FUNÇÕES QUE MOVEM O JOGO ===
      resetar_jogo(); // reinicia tudo do jogo
      criar_rua(); // faz a rua se movimentar
      criar_troncos() // cria os troncos no meio da pista
      movimentar(); // verifica as teclas do teclado para se mover
      criar_avisos() // dá os avisos do tronco em qual das pistas
      verifica_colisao() // vê se o player está colidindo com o tronco
      criar_info_cargas(); // cria a barra de cargas
      criar_info_distancia(); // cria a barra de distancia 
    }
  }
}

//===REINICIA AS VARIÁVEIS DO JOGO ===
function resetar_jogo(){
  if (recomecar == true){ 
    personagem.x = 325
    personagem.imunidade = false
    informacoes_distancia.distancia_percorrida = 0
    informacoes_distancia.cargas = 3
    rua.y = 225
    rua.y2 = -175
    rua.se_mover = true
    troncos.y = -1000
    troncos.lado = "direita"
    personagem.pode_andar = true;
    personagem.opacidade = 255;
    slide.qual = 1;

    recomecar = false   
  }
}

// === FAZ A RUA SE MOVER ===
function criar_rua(){
  background(0);
  
  fill(249,212,40)
  rect(325, rua.y, 25, 300)
  rect(325, rua.y2, 25, 300)
  
  if (rua.se_mover == true) {
    rua.y += informacoes_distancia.velocidade // faz a faixa descer
    rua.y2 += informacoes_distancia.velocidade // faz a faixa descer
    
    // teleporta uma faixa para cima da outra para dar o efeito de infinito
    if (rua.y2 == 225){
      rua.y = -175
    }
    if (rua.y == 225){
      rua.y2 = -175
    }
  }
}

// === CRIA AS INFORMAÇÕES NO TOPO ===
function criar_info_cargas(){
  // define as cores das bordas
  if (!personagem.morreu){
    // cor das bordas das informações
    if (informacoes_distancia.cargas == 3) stroke(80,145,80);
    if (informacoes_distancia.cargas == 2) stroke(200,190,30);
    if (informacoes_distancia.cargas == 1) stroke(180,30,35);
    
    fill(81,81,81);
    rect(75, 40, 110, 50, 10); // informações da vida

    // texto
    fill(0);
    noStroke(); // sem borda
    text("cargas:", 73, 30, 20, 20)

    strokeWeight(2);

    if (informacoes_distancia.cargas === 3) {
      stroke(80, 145, 80);
      fill(100, 164, 100);
      rect(40, 50, 20, 20, 5);
      rect(75, 50, 20, 20, 5);
      rect(110, 50, 20, 20, 5);
    } else if (informacoes_distancia.cargas === 2) {
      stroke(200, 190, 30);
      fill(249, 212, 40);
      rect(40, 50, 20, 20, 5);
      rect(75, 50, 20, 20, 5);
    } else {
      stroke(180, 30, 35);
      fill(198, 38, 45);
      rect(40, 50, 20, 20, 5);
    }

    noStroke();
  }
}

// === MOVIMENTAÇÃO ===
function movimentar(){
  if (personagem.pode_andar){
    if (keyIsDown(RIGHT_ARROW) && personagem.x < 575) personagem.x += personagem.passos
    if (keyIsDown(LEFT_ARROW) && personagem.x > 75) personagem.x -= personagem.passos
    animar_trator()
  }
}

// === ANIMAR O TRATOR ===
function animar_trator(){
  if (informacoes_distancia.cargas == 3){
    personagem.sprite_atual1 = personagem.sprite1
    personagem.sprite_atual2 = personagem.sprite2
  } else if (informacoes_distancia.cargas == 2){
    personagem.sprite_atual1 = personagem.sprite3
    personagem.sprite_atual2 = personagem.sprite4
  } else {
    personagem.sprite_atual1 = personagem.sprite5
    personagem.sprite_atual2 = personagem.sprite6
  }
  
  if (personagem.animar == 0){
    image(personagem.sprite_atual1, personagem.x, personagem.y, personagem.largura, personagem.altura);
  } else {
    image(personagem.sprite_atual2, personagem.x, personagem.y, personagem.largura, personagem.altura);
  }
  
  personagem.contar_quadros += 1
  
  if (personagem.contar_quadros >= 5){
    personagem.animar = (personagem.animar + 1) % 2; // Alterna entre 0 e 1
    personagem.contar_quadros = 0;
  }
}

// === CRIAR OS TRONCOS ===
function criar_troncos(){
  if (troncos.lado == "direita")troncos.x = 495;
  if (troncos.lado == "esquerda")troncos.x = 155;
  
  if (rua.se_mover){
    troncos.y += informacoes_distancia.velocidade;
    if (troncos.y == 480){
      personagem.imunidade = false; // ativa a colisão novamente
      troncos.y = -500;
      
      // decide qual lado vai aparecer o tronco
      let numero = int(random(1, 3)); // numero aleatorio 1 ou 2
      if (numero == 1) troncos.lado = "esquerda";
      if (numero == 2) troncos.lado = "direita";
    }
  }

  image(troncos.sprite1, troncos.x, troncos.y , troncos.largura, troncos.altura); 
}

// === AVISA QUAL LADO VAI VIR O TRONCO ===
function criar_avisos(){ 
  if(troncos.lado == "direita") avisos.x = 500;
  if(troncos.lado == "esquerda") avisos.x = 150;
  if (troncos.y >= -400 && troncos.y <= -20){
  image(avisos.sprite, avisos.x, 160, avisos.tamanho, avisos.tamanho);
  }
} 

// === VERIFICA A COLISÃO ===
function verifica_colisao(){
  // verifica se não passou 2 vezes sobre o tronco e se esta na mesma altura
  if (personagem.imunidade == false && troncos.y > 210 && troncos.y < 410){
    // vê se o tronco encosta no player
    if (troncos.lado == "direita" && personagem.x >= 275 || troncos.lado == "esquerda" && personagem.x <= 375) {
      personagem.imunidade = true;
      informacoes_distancia.cargas -=  1;
    }
  }
}

// === CRIA AS INFORMAÇÕES DE DISTANCIA ===  
function criar_info_distancia(){
  if (personagem.morreu == false){
  
    // adiciona a cordernada y para descer na tela 
    if (rua.se_mover && informacoes_distancia.distancia_percorrida < informacoes_distancia.distancia) {
      informacoes_distancia.distancia_percorrida += informacoes_distancia.velocidade / 30;
    }

    // nao deixa ficar decimal nem negativo
    let falta = max(0, int(informacoes_distancia.distancia - informacoes_distancia.distancia_percorrida));

    stroke(31,31,31)
    strokeWeight(2)
    fill(81,81,81)
    rect(550, 50, 160, 70, 10)
    noStroke() // sem borda
    fill(0)
    text("Distâcia:", 548, 30, 20, 20)
    text(`Faltam ${falta} metros`, 548, 50)
    text("para chegar na cidade", 548, 70)

    if (falta == 0 && rua.se_mover) {
    personagem.pode_andar = false;
    rua.se_mover = false;
    fazer_transicao("out", 3);
    }
  }
}

// ===  TELA DE MORTE ===
function tela_morte(){
  background(255)
  fill(botao.cor)
  rect(botao.x, botao.y, botao.largura, botao.altura, 10)
  fill(0)
  textSize(30)
  text("você perdeu todas as suas cargas", 325, 50)
  textSize(20)
  text("recomeçar", botao.x, botao.y )

  if (tocando_no_botao_jogar()) {botao.cor = [153, 205, 148]} else {botao.cor = [100, 180, 117]}
  
}

// === TERMINA O JOGO ===
function fim(){
  background(255)
  switch (slide.qual){
    case 1:
      textSize(18);
      text("slide 1 de 4", 50, 430);

      fill(0);
      textSize(24);
      text("Você conseguiu ajudar Marquito a chegar à cidade com suas colheitas!", largura_tela / 2, 190, 500, 150);
      text("Parabéns pela conquista!", largura_tela / 2, 250);

      image(botao.sprite, 600, 400, 55, 55);
      break;

    case 2:
      textSize(18);
      text("slide 2 de 4", 50, 430);

      fill(0);
      textSize(22);
      text("Com o dinheiro das vendas, Marquito pôde investir em novas ferramentas e melhorar sua produção.", largura_tela / 2, 200, 500, 150);
      image(botao.sprite, 600, 400, 55, 55);
      break;

    case 3:
      textSize(18);
      text("slide 3 de 4", 50, 430);

      fill(0);
      textSize(22);
      text("Essa jornada mostra como o campo e a cidade estão conectados. Um depende do outro para crescer, produzir e viver melhor.", largura_tela / 2, 200, 500, 150);
      image(botao.sprite, 600, 400, 55, 55);
      break;

    case 4:
      slide.recomecar = true;

      // botão voltar
      fill(botao.cor);
      rect(botao.x, botao.y, botao.largura, botao.altura, 10);

      if (tocando_no_botao_jogar()) {
        botao.cor = [153, 205, 148];
      } else {
        botao.cor = [100, 180, 117];
      }

      fill(0);
      textSize(18);
      text("slide 4 de 4", 50, 430);
      text("voltar", botao.x, 302);

      textSize(22);
      text("Obrigado por jogar e celebrar a união entre o campo e a cidade com Marquito!", largura_tela / 2, 170, 500, 150);
      text("Clique em voltar para retornar ao início.", largura_tela / 2, 230);

      recomecar = true;
      break;
  }
}  
