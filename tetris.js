// ************************************
// *     EJERCICIO 1                   *
// ************************************

// ============== Point =======================

function Point (x, y) {
	this.x = x;
	this.y = y;
}

// ============== Rectangle ====================
function Rectangle() {}

//recibe los 2 puntos del bloque como parametro
Rectangle.prototype.init = function(p1,p2) {
	this.px = p1.x;
	this.py = p1.y;
	this.width = p2.x - p1.x;
	this.height = p2.y - p1.y;
	this.lineWidth= 1;
	this.color = 'black';
}

Rectangle.prototype.draw = function() {

	// TU CÓDIGO AQUÍ:
	// pinta un rectángulo del color actual en pantalla en la posición px,py, con
	// la anchura y altura actual y una línea de anchura=lineWidth. Ten en cuenta que
	// en este ejemplo la variable ctx es global y que guarda el contexto (context)
	// para pintar en el canvas.

	//comenzar camino
	ctx.beginPath();

	//nos movemos al punto P1(esquina superior derecha), donde se empieza a pintar el rectangulo
	ctx.moveTo(this.px,this.py);

	//nos colocamos en el punto P1(p1.x,p1.y) y dibujamos un rectangulo con la anchura this.width y
	//la altura this.heigth.
	ctx.lineTo(this.px+this.width,this.py);
	ctx.lineTo(this.px+this.width,this.py+this.height);
	ctx.lineTo(this.px,this.py+this.height);

	//cerrar camino
	ctx.closePath();

	//la anchura de la linea=this.lineWidth
	ctx.lineWidth = this.lineWidth;

	//rellenar el rectangulo del color this.color
	ctx.fillStyle = this.color;
	ctx.fill();

	//para que al mover la pieza se mantenga el contorno
	ctx.strokeStyle = 'black';

	//finalizamos con stroke haciendo el contorno del rectangulo
	ctx.stroke();


}


Rectangle.prototype.setLineWidth = function(width) { this.lineWidth=width}
Rectangle.prototype.setFill = function(color) { this.color = color}

//** Método introducido en el EJERCICIO 4 */

Rectangle.prototype.move = function(x,y){
	this.px += x;
	this.py += y;
	this.draw();
}

//** Método introducido en el EJERCICIO 4 */

Rectangle.prototype.erase = function(){
	ctx.beginPath();
	ctx.lineWidth = this.lineWidth+2;
	ctx.strokeStyle = Tetris.BOARD_COLOR;
	ctx.rect(this.px, this.py, this.width, this.height);
	ctx.stroke();
	ctx.fillStyle = Tetris.BOARD_COLOR;
	ctx.fill()

}


// ============== Block ===============================

function Block (pos, color) {


	// TU CÓDIGO AQUÍ: este es el constructor de la clase Block. Recibe dos parámetros, pos y color.
	// Pos = posición de la celda, por ejemplo, (9,19).
	// color = color que hay que emplear para pintar el bloque.
	// Internamente este método crea dos puntos (empleando las coordenadas del pixel)
	// y llama al método init de la clase Rectangle, pasándole como parámetro,
	// estos dos puntos.
	// Sería interesante que emplearas las constantes Block.BLOCK_SIZE y Block.OUTLINE_WIDTH,
	// para establecer la anchura del bloque y la anchura de la línea.

	//coordenadas (x,y) de la celda. Por ejemplo (1,1)
	this.x = pos.x;
	this.y = pos.y;

	//Se crean internamente 2 puntos empleando las coordenadas del pixel
	//Imaginemos que tenemos la coordenadas pos.x=1, pos.y=1.
	//ese punto1 se convertira en (1*30,1*30)=(30,30) y el rectangulo se empezara a pintar en ese punto.
	//para completar el bloque cuadrado necesitamos que acabe en (60,60). Para ello le sumamos 30 pixeles
	//tanto en altura como en anchura y asi queda (60,60).

	var nuevaposx = pos.x*Block.BLOCK_SIZE;
	var nuevaposy = pos.y*Block.BLOCK_SIZE;

	var punto1 = new Point(nuevaposx,nuevaposy);
	var punto2 = new Point(punto1.x + Block.BLOCK_SIZE, punto1.y + Block.BLOCK_SIZE);

	//se le llama al metodo init de la clase Rectangle y le pasamos los 2 puntos definidos anteriormente
	//el (30,30) y el (60,60).
	this.init(punto1,punto2);
	this.setFill(color);
	this.setLineWidth(Block.OUTLINE_WIDTH);


}

//una casilla es un cuadrado de 30 pixels de ancho. Cada bloque ocupa una única casilla
Block.BLOCK_SIZE = 30;
//anchura de la linea que rodea al bloque
Block.OUTLINE_WIDTH = 2;


// TU CÓDIGO: emplea el patrón de herencia (Block es un Rectangle)
//Block hereda de la clase Rectangle
Block.prototype = new Rectangle();
//el constructor de bloque es bloque
Block.prototype.constructor = Block;


/** Método introducido en el EJERCICIO 4 */
Block.prototype.move = function(dx, dy) {
	this.x += dx;
	this.y += dy;

	Rectangle.prototype.move.call(this, dx * Block.BLOCK_SIZE, dy * Block.BLOCK_SIZE);
}

/**************************************************
 *	 Código que se da dado para el EJERCICIO 5 *
 ***************************************************/

Block.prototype.can_move = function(board, dx, dy) {
	// TU CÓDIGO AQUÍ: toma como parámetro un increment (dx,dy)
	// e indica si es posible mover el bloque actual si
	// incrementáramos su posición en ese valor

	var incrementoPosx = dx + this.x;
	var incrementoPosy = dy + this.y;

	//console.log("Incremento de X: " + incrementoPosx);
	//console.log("Incremento de Y: "+ incrementoPosy)

	var puedeMoverseElBloque = board.can_move(incrementoPosx,incrementoPosy);
	//console.log("Puede moverse: " + puedeMoverseElBloque);
	return puedeMoverseElBloque;

}




// ************************************
// *      EJERCICIO 2                  *
// ************************************

function Shape() {}


Shape.prototype.init = function(coords, color) {

	// TU CÓDIGO AQUÍ: método de inicialización de una Pieza del tablero
	// Toma como parámetros: coords, un array de posiciones de los bloques
	// que forman la Pieza y color, un string que indica el color de los bloques
	// Post-condición: para cada coordenada, crea un bloque de ese color y lo guarda en un bloque-array.


	this.bloquesArray = [];
	coords.forEach(coordenada => this.bloquesArray.push(new Block(coordenada,color)));


	//console.log(this.bloquesArray);

};

Shape.prototype.draw = function() {

	// TU CÓDIGO AQUÍ: método que debe pintar en pantalla todos los bloques
	// que forman la Pieza
	this.bloquesArray.forEach( bloque => bloque.draw());

};



/**************************************************
 *	 Código que se da dado para el EJERCICIO 5 *
 ***************************************************/

Shape.prototype.can_move = function(board, dx, dy) {

// TU CÓDIGO AQUÍ: comprobar límites para cada bloque de la pieza


	for (bloque of this.bloquesArray) {
		var bloquePuedeMoverse = bloque.can_move(board, dx, dy)
		//si uno de los bloques no puede moverse la pieza tampoco --> return false
		if (!bloquePuedeMoverse) return false;
	}
	return true;
};




/* Método introducido en el EJERCICIO 4 */
Shape.prototype.move = function(dx, dy) {

	for (block of this.bloquesArray) {
		block.erase();
	}

	for (block of this.bloquesArray) {
		block.move(dx,dy);
	}
};


// ============= I_Shape ================================
function I_Shape(center) {
	var coords = [new Point(center.x - 2, center.y),
		new Point(center.x - 1, center.y),
		new Point(center.x , center.y),
		new Point(center.x + 1, center.y)];

	Shape.prototype.init.call(this, coords, "blue");

}

// TU CÓDIGO AQUÍ: La clase I_Shape hereda de la clase Shape
I_Shape.prototype = new Shape();
I_Shape.prototype.constructor = I_Shape;


// =============== J_Shape =============================
function J_Shape(center) {

	// TU CÓDIGO AQUÍ: Para programar J_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x - 1, center.y),
		new Point(center.x, center.y),
		new Point(center.x + 1, center.y),
		new Point(center.x + 1, center.y + 1)];

	Shape.prototype.init.call(this, coords, "orange");

}

// TU CÓDIGO AQUÍ: La clase J_Shape hereda de la clase Shape
J_Shape.prototype = new Shape();
J_Shape.prototype.constructor = J_Shape;

// ============ L Shape ===========================
function L_Shape(center) {

	// TU CÓDIGO AQUÍ: Para programar L_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x - 1, center.y),
		new Point(center.x, center.y),
		new Point(center.x + 1, center.y),
		new Point(center.x - 1, center.y + 1)];

	Shape.prototype.init.call(this, coords, "cyan");
}

// TU CÓDIGO AQUÍ: La clase L_Shape hereda de la clase Shape
L_Shape.prototype = new Shape();
L_Shape.prototype.constructor = L_Shape;


// ============ O Shape ===========================
function O_Shape(center) {

	// TU CÓDIGO AQUÍ: Para programar O_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x - 1, center.y),
		new Point(center.x - 1, center.y + 1),
		new Point(center.x, center.y),
		new Point(center.x, center.y + 1)];

	Shape.prototype.init.call(this, coords, "red");


}

// TU CÓDIGO AQUÍ: La clase O_Shape hereda de la clase Shape
O_Shape.prototype = new Shape();
O_Shape.prototype.constructor = O_Shape;

// ============ S Shape ===========================
function S_Shape(center) {

	// TU CÓDIGO AQUÍ: Para programar S_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x - 1, center.y + 1),
		new Point(center.x, center.y + 1),
		new Point(center.x, center.y),
		new Point(center.x + 1, center.y)];

	Shape.prototype.init.call(this, coords, "green");

}

// TU CÓDIGO AQUÍ: La clase S_Shape hereda de la clase Shape
S_Shape.prototype = new Shape();
S_Shape.prototype.constructor = S_Shape;

// ============ T Shape ===========================
function T_Shape(center) {

	// TU CÓDIGO AQUÍ: : Para programar T_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x - 1, center.y),
		new Point(center.x, center.y + 1),
		new Point(center.x, center.y),
		new Point(center.x + 1, center.y)];

	Shape.prototype.init.call(this, coords, "yellow");

}

// TU CÓDIGO AQUÍ: La clase T_Shape hereda de la clase Shape
T_Shape.prototype = new Shape();
T_Shape.prototype.constructor = T_Shape;


// ============ Z Shape ===========================
function Z_Shape(center) {

	// TU CÓDIGO AQUÍ: : Para programar Z_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x - 1, center.y),
		new Point(center.x, center.y),
		new Point(center.x, center.y + 1),
		new Point(center.x + 1, center.y + 1)];

	Shape.prototype.init.call(this, coords, "magenta");
}

// TU CÓDIGO AQUÍ: La clase Z_Shape hereda de la clase Shape
Z_Shape.prototype = new Shape();
Z_Shape.prototype.constructor = Z_Shape;



// ************************************
// *     EJERCICIO 3               *
// ************************************

// ====================== BOARD ================

function Board(width, height) {
	this.width = width;
	this.height = height;
	this.grid = {}; /* 6. Estructura de datos introducida en el EJERCICIO 6 */

}


// Si la pieza nueva puede entrar en el tablero, pintarla y devolver true.
// Si no, devoler false

Board.prototype.draw_shape = function(shape){
	if (shape.can_move(this,0,0)){
		shape.draw();
		return true;
	}
	return false;
}




/*****************************
 *	 EJERCICIO 6          *
 *****************************/

Board.prototype.add_shape = function(shape){

	// TU CÓDIGO AQUÍ: meter todos los bloques de la pieza que hemos recibido por parámetro en la estructura de datos grid

	var bloques = shape.bloquesArray;
	for (bloque of bloques){

		//dict[new_key] = new_value
		var keyString = bloque.x+","+bloque.y;

		this.grid[keyString] = bloque;
		//this.grid[(bloque.x,bloque.y)] = bloque;

		console.log("GRID (x,y): " + bloque.x + "," + bloque.y);


	}



}


// ****************************
// *     EJERCICIO 5          *
// ****************************

Board.prototype.can_move = function(x,y){

 	// TU CÓDIGO AQUÍ: 
 	// hasta ahora, este método siempre devolvía el valor true. Ahora,
 	// comprueba si la posición que se le pasa como párametro está dentro de los  
	// límites del tablero y en función de ello, devuelve true o false.

	//anchura y altura del tablero
	var anchura = this.width;
	var altura = this.height;
	//console.log("Anchura y Altura del Board: " +anchura + "," + altura);
	console.log("(x,y): " + x + "," + y);


	if ((x<0 || x>=anchura) || (y<0 || y>=altura)) return false;


	/* EJERCICIO 7 */
	// TU CÓDIGO AQUÍ: código para detectar colisiones. Si la posición x,y está en el diccionario grid, devolver false y true en cualquier otro caso.
	var posxyString = x+","+y;
	if (posxyString in this.grid) return false;




	return true;
};


// ==================== Tetris ==========================

function Tetris() {
	this.board = new Board(Tetris.BOARD_WIDTH, Tetris.BOARD_HEIGHT);
}

Tetris.SHAPES = [I_Shape, J_Shape, L_Shape, O_Shape, S_Shape, T_Shape, Z_Shape];
Tetris.DIRECTION = {'Left':[-1, 0], 'Right':[1, 0], 'Down':[0, 1]};
Tetris.BOARD_WIDTH = 10;
Tetris.BOARD_HEIGHT = 20;
Tetris.BOARD_COLOR='white';

Tetris.prototype.create_new_shape = function(){

	// TU CÓDIGO AQUÍ:
	// Elegir un nombre de pieza al azar del array Tetris.SHAPES

	//coger un elemento randomizadamente de un array -->
	//https://stackoverflow.com/questions/4550505/getting-a-random-value-from-a-javascript-array
	//const randomElement = array[Math.floor(Math.random() * array.length)];
	const pieza_random = Tetris.SHAPES[Math.floor(Math.random() * Tetris.SHAPES.length)];

	//para hacer las pruebas unitarias coger S_shape
	//const s_shape= Tetris.SHAPES[4];
	//console.log(s_shape);

	//console.log(pieza_random);

	// Crear una instancia de ese tipo de pieza (x = centro del tablero, y = 0)


	//se coge la pieza. Por ejemplo Z_Shape y se crea una pieza de su tipo
	//new Z_Shape --> le pasamos como centro --> (x = centro del tablero, y = 0)
	//En ese punto sera donde se cree el centro y el resto de la pieza
	var anchura_x = Tetris.BOARD_WIDTH/2;
	var altura_y = 0;
	//console.log(anchura_x);

	var pieza_nueva = new pieza_random(new Point(anchura_x,altura_y));
	//var pieza_nueva = new s_shape(new Point(anchura_x,altura_y));

	// Devolver la referencia de esa pieza nueva
	return pieza_nueva;


}

Tetris.prototype.init = function(){

	/**************
	 EJERCICIO 4
	 ***************/

	// gestor de teclado

	document.addEventListener('keydown', this.key_pressed.bind(this), false);

	// Obtener una nueva pieza al azar y asignarla como pieza actual

	this.current_shape = this.create_new_shape()

	// TU CÓDIGO AQUÍ:
	// Pintar la pieza actual en el tablero
	// Aclaración: (Board tiene un método para pintar)
	this.board.draw_shape(this.current_shape);

}

Tetris.prototype.key_pressed = function(e) {

	//imprimir en la consola la tecla que pulse
	console.log(e);

	//para impedir que haga la accion
	//e.preventDefault();

	var key = e.keyCode ? e.keyCode : e.which;

	console.log("KEY: " + key );

	//ARROWLEFT --> ASCII : 37
	//ARROWUP --> ASCII : 38
	//ARROWRIGHT --> ASCII : 39
	//ARROWDOWN --> ASCII : 40

	// TU CÓDIGO AQUÍ:
	// en la variable key se guardará el código ASCII de la tecla que
	// ha pulsado el usuario. ¿Cuál es el código key que corresponde
	// a mover la pieza hacia la izquierda, la derecha, abajo o a rotarla?
	if (key == 37) {
		e.preventDefault();
		console.log("Ha pulsado ARROWLEFT");
		this.do_move("Left");
	}
	else if (key == 38) {
		e.preventDefault();
		console.log("Ha pulsado ARROWUP");
	}
	else if (key == 39) {
		e.preventDefault();
		console.log("Ha pulsado ARROWRIGHT");
		this.do_move("Right");
	}
	else if (key == 40) {
		e.preventDefault();
		console.log("Ha pulsado ARROWDOWN");
		this.do_move("Down");
	}
	//cuando se pulse el espacio --> ASCII:32 la pieza baja inmediatamente
	else if (key == 32) {
		e.preventDefault();
		console.log("Ha pulsado ESPACIO");
		var abajox = Tetris.DIRECTION['Down'][0];
		var abajoy = Tetris.DIRECTION['Down'][1];

		//mientras la pieza se pueda mover para abajo --> moverla para abajo
		//en la direccion Down teniendo en cuenta si desde (abajox,abajoy) puede moverse
		while (this.current_shape.can_move(this.board,abajox,abajoy)){
			this.do_move("Down");
		}
		//el ultimo movimiento para que salga la pieza nueva arriba
		this.do_move("Down");
	}




}

Tetris.prototype.do_move = function(direction) {

	// TU CÓDIGO AQUÍ: el usuario ha pulsado la tecla Left, Right o Down (izquierda,
	// derecha o abajo). Tenemos que mover la pieza en la dirección correspondiente
	// a esa tecla. Recuerda que el array Tetris.DIRECTION guarda los desplazamientos
	// en cada dirección, por tanto, si accedes a Tetris.DIRECTION[direction],
	// obtendrás el desplazamiento (dx, dy). A continuación analiza si la pieza actual
	// se puede mover con ese desplazamiento. En caso afirmativo, mueve la pieza.
	var dx = Tetris.DIRECTION[direction][0];
	var dy = Tetris.DIRECTION[direction][1];
	if (this.current_shape.can_move(this.board, dx, dy)) {
		//si le llega Left se movera [-1,0]
		//si le llega Right se movera [1,0]
		//si le llega Down se movera [0,1]

		this.current_shape.move(dx, dy);
	}



	/* Código que se pide en el EJERCICIO 6 */
	// else if(direction=='Down')
	// TU CÓDIGO AQUÍ: añade la pieza actual al grid. Crea una nueva pieza y dibújala en el tablero.
	else if(direction=='Down'){
		this.board.add_shape(this.current_shape);
		this.current_shape = this.create_new_shape();
		this.board.draw_shape(this.current_shape);


	}



}