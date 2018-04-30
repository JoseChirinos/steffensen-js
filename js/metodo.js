/* Objeto de Datos */
var datos = {
	fun: [],
	xi:  [],
	fi:  [],
	h:   0.001,
	tam: {n:3,m:3}
};
function initialEvents(){
	$('#btnCalcular').click(function(){
		init();
		$('#tablasDer').html("");
		getNewtonRaphson();
	});
	$('#btnCalcularPaso').click(function(){
		init();
		$('#tablasDer').html("");
		__getNewtonRaphson();
	});
	$('#btnReset').click(function(){
		$('#tablasDer').html("");
		resetDatos();
	});
	$('#btnDefault').click(function(){
		$('#tablasDer').html("");
		resetDatos();
		defaultDatos();
	});
}

/* Funciones */
function defaultDatos(){
	$('#initialX').val('1');
	$('#initialY').val('3');
	$('#initialZ').val('0.5');
	$('#initialF1').val('function(x,y,z){ return (x*x)-(2*y)+(x*z)+2 }');
	$('#initialF2').val('function(x,y,z){ return (x*y*z)+(2*z)-3 }');
	$('#initialF3').val('function(x,y,z){ return (y*y)+(z*z)-6 }');
}
function resetDatos(){
	/* reseteando matriz Xo */
	var initialVar = document.forms.initialVar.children;
	[].forEach.call(initialVar,function(i,index){
		i.children[1].value = "";
	});
	/* reseteando matriz de funciones */
	var initialFun = document.forms.initialFun.children;
	[].forEach.call(initialFun,function(i,index){
		i.children[1].value = "";
	});
	datos = {
		fun: [],
		xi:  [],
		fi:  [],
		h:   0.001,
		tam: {n:3,m:3}
	};
}
function init(){
	var cont = 0;
	/* Obteniendo matriz Xo */
	var initialVar = document.forms.initialVar.children;
	[].forEach.call(initialVar,function(i,index){
		if(i.children[1].value == ""){
			cont++;
		}else{
			datos.xi[index] = parseFloat(i.children[1].value);
		}
	});
	/* Obteniendo matriz de funciones */
	var initialFun = document.forms.initialFun.children;
	[].forEach.call(initialFun,function(i,index){
		if(i.children[1].value == ""){
			cont++;
		}else{
			datos.fun[index] = eval('('+i.children[1].value+')');
		}
	});
	/* Resolver las funciones con los valores iniciales Matriz Fo*/
	
	datos.xi.forEach(function(i,index){
		datos.fi[index] = datos.fun[index].apply(this,datos.xi);
	});
	if(cont>0){
		$('#msg').text('Le falta llenar datos');
	}
	else{
		$('#msg').text('');
	}
	getJacobi();
}
function derivada(index_fun,index_xi){
	var d   = 0,
		n   = 0,
		x   = datos.xi[index_xi],
		fun = datos.fun[index_fun],
		h   = datos.h,
		fi  = datos.fi[index_fun],
		fi1 = 0;
		n++;
		x = x+h;
		switch(index_xi){
			case 0: fi1 = fun(x,datos.xi[1],datos.xi[2]);break;
			case 1: fi1 = fun(datos.xi[0],x,datos.xi[2]);break;
			case 2: fi1 = fun(datos.xi[0],datos.xi[1],x);break;
			default:break;
		}
		d = (fi1 - fi)/h;
		return d;

}

function getJacobi(){
	var jacobi = new Array();

	for(var i =0;i<datos.tam.n;i++){
		jacobi[i] = new Array();
		for(var j =0;j<datos.tam.m;j++){
			jacobi[i].push(derivada(i,j));
		}
	}
	return jacobi;
}

function getNewtonRaphson(){
	var jacobi 	  = new Matrix(getJacobi()),
		invJacobi = jacobi.clone().inverse(),
		x0        = new Matrix(new Array(datos.xi)),
		f0        = new Matrix(new Array(datos.fi)),
		cont 	  = 0,
		xr		  = new Matrix([[0,0,0]]);
	
	while(cont<10){
		cont++;
		xr = x0.subtract(f0.multiply(invJacobi));
		if(compare(xr,x0)){
			break;
		}
		x0 = xr.clone();
	}
	var html = "<h3>Resultado</h3><table class='table table-striped table-hover table-bordered'><tbody>";
	for(var i=0;i<xr.cols;i++){
		html+= "<tr><td>"+xr[0][i].toPrecision(4)+"</td></tr>";
	}
	html+="</tbody></table>";
	$('#tablasDer').append(html);
	return xr;
}

function compare(x,y){
	var cont = 0;
	for(var i=0;i<x.rows;i++){
		for(var j=0;j<x.cols;j++){
			var a = parseFloat(x[i][j].toPrecision(4));
			var b = parseFloat(y[i][j].toPrecision(4));
			if(a === b){
				cont++;
			}
		}
	}
	if(cont == x.cols){
		return true;
	}
	else{
		return false;
	}
}


/* Paso por paso functions */

function __derivada(index_fun,index_xi){
	var d   = 0,
		n   = 0,
		x   = datos.xi[index_xi],
		fun = datos.fun[index_fun],
		h   = datos.h,
		fi  = datos.fi[index_fun],
		fi1 = 0;
		var nombreVar = "";
		switch(index_xi){
			case 0: nombreVar = "X";break;
			case 1: nombreVar = "Y";break;
			case 2: nombreVar = "Z";break;
			default:break;
		}
		var nombreFun = "";
		switch(index_fun){
			case 0: nombreFun = "f1";break;
			case 1: nombreFun = "f2";break;
			case 2: nombreFun = "f3";break;
			default:break;
		}
		var html = "<h6>d"+nombreFun+"/d"+nombreVar+"</h6><table class='table table-striped table-hover table-bordered'><thead class='thead-dark'><tr><th>n</th><th>"+ nombreVar +"</th><th>"+nombreFun+"</th><th>d</th></tr></thead><tbody>";
		html+= "<tr><td>"+n+"</td><td>"+x+"</td><td>"+fi+"</td><td></td></tr>";

		n++;
		x = x+h;
		switch(index_xi){
			case 0: fi1 = fun(x,datos.xi[1],datos.xi[2]);break;
			case 1: fi1 = fun(datos.xi[0],x,datos.xi[2]);break;
			case 2: fi1 = fun(datos.xi[0],datos.xi[1],x);break;
			default:break;
		}
		d = (fi1 - fi)/h;
		html+= "<tr><td></td><td></td><td></td><td>"+d+"</td></tr>";
		html+= "<tr><td>"+n+"</td><td>"+x+"</td><td>"+fi1+"</td><td></td></tr>";

		html+="</tbody></table>";
		$('#tablasDer').append(html);
		return d;

}

function __getJacobi(){
	var jacobi = new Array();
	$('#tablasDer').append('<h4>Calcular Derivadas</h4><br>');
	var html = "<h4>Matriz Jacobi</h4><table class='table table-striped table-hover table-bordered'><tbody>";
	for(var i =0;i<datos.tam.n;i++){
		jacobi[i] = new Array();
		html+= "<tr>";
		for(var j =0;j<datos.tam.m;j++){
			jacobi[i].push(__derivada(i,j));
			html+= "<td>"+jacobi[i][j].toPrecision(4)+"</td>";
		}
		html+="</tr>";
	}
	html+="</tbody></table>";
	$('#tablasDer').append(html);
	return jacobi;
}

function __getNewtonRaphson(){
	var jacobi 	  = new Matrix(__getJacobi()),
		invJacobi = jacobi.clone().inverse(),
		x0        = new Matrix(new Array(datos.xi)),
		f0        = new Matrix(new Array(datos.fi)),
		cont 	  = 0,
		xr		  = new Matrix([[0,0,0]]);
	
	var html = "<h4>Matriz Inversa Jacobi</h4><table class='table table-striped table-hover table-bordered'><tbody>";
	for(var i=0;i<invJacobi.rows;i++){
		html+= "<tr>";
		for(var j=0;j<invJacobi.cols;j++){
			html+= "<td>"+invJacobi[i][j].toPrecision(4)+"</td>";
		}
		html+="</tr>";
	}
	html+="</tbody></table>";
	$('#tablasDer').append(html);

	while(cont<10){
		cont++;
		xr = x0.subtract(f0.multiply(invJacobi));
		if(compare(xr,x0)){
			break;
		}
		x0 = xr.clone();
	}
	var html = "<h4>Resultado</h4><table class='table table-striped table-hover table-bordered'><tbody>";
	for(var i=0;i<xr.cols;i++){
		html+= "<tr><td>"+xr[0][i].toPrecision(4)+"</td></tr>";
	}
	html+="</tbody></table>";
	$('#tablasDer').append(html);
	return xr;
}

/* Inicializar Eventos */
initialEvents();