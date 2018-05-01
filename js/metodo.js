/* Objeto de Datos */
var datos = {
	fun: [],
	xi:  [],
	fi:  [],
  h:   0.001,
  i: 0,
	tam: {n:3,m:3}
};
function initialEvents(){
	$('#btnCalcular').click(function(){
		init();
		$('#tablasDer').html("");
		calcSteffensen();
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
	$('#initialX1').val('5');
	$('#initialX2').val('2');
	$('#initialF1').val('function(x1,x2){ return (x1*x1)-2*(x1*x2)+x2-8 }');
	$('#initialF2').val('function(x1,x2){ return x1+2*(x2*x2)-10 }');
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
    i: 0,
    tam: {n:3,m:3},
    k:   [],
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
  calcFun();
  
	if(cont>0){
		$('#msg').text('Le falta llenar datos');
	}
	else{
		$('#msg').text('');
  }
}

function calcFun(){
  datos.xi.forEach(function(i,index){
		datos.fi[index] = datos.fun[index].apply(this,datos.xi);
  });
  mostrarHead();
  mostrarMatrizX();
  mostrarFunciones();
}
function calcMatrizK(){
  var x1 = datos.xi[0];
  var x2 = datos.xi[1]
  var matrizK = new Array();
  for(var i=0;i<datos.tam.m-1;i++){
    matrizK[i] = new Array();
    for(var j=0;j<datos.tam.n-1;j++){
      if(!j%2){
        matrizK[i].push( (datos.fun[i](x1+datos.fi[i], x2) - datos.fi[i])/ datos.fi[i] );
      }
      else{
        matrizK[i].push( (datos.fun[i](x1, x2 + datos.fi[i]) - datos.fi[i])/ datos.fi[i] );
      }
    }
  }
  mostrarMatrizK(matrizK);
  return matrizK;
}
function calcInversaMatrizK(){
  var matrizK = new Matrix(calcMatrizK());
  var inversaMatrizK = matrizK.clone().inverse();
  return inversaMatrizK;
}

function calcSteffensen(){
  var k;
  var f0;
  var x0 = new Matrix(new Array(datos.xi));
  var m1 = [];  
  var xn = [];
  var cont = 0;

  while(cont<10){
    calcFun();
    k = calcInversaMatrizK();
    f0 = new Matrix(new Array(datos.fi));

    m1 = f0.clone().multiply(k.clone());
    xn = m1.clone().subtract(x0.clone());    
    if(xn.equals(x0)){
      break;
    }
    else{
      x0 = xn.clone();
      datos.xi[0] = x0[0][0];
      datos.xi[1] = x0[0][1];
    }
    cont++;
    datos.i = cont;
  }
  var html = "<h3>Resultado x"+datos.i+"</h3><table class='table table-striped table-hover table-bordered'><tbody>";
	for(var i=0;i<xn.cols;i++){
		html+= "<tr><td>"+xn[0][i].toPrecision(4)+"</td></tr>";
	}
	html+="</tbody></table>";
  $('#tablasDer').append(html);
}

/* mostrar datos */
function mostrarHead(){
  var html = "<br/><h1 class='text-primary'>Iteracion "+(datos.i+1)+"</h1>";
  $('#tablasDer').append(html);
}
function mostrarMatrizX(){
  var m = new Matrix(new Array(datos.xi));
  var html = "<table class='table table-striped table-hover table-bordered'><thead class='thead-dark'><tr><th colspan='"+m.cols+"'>matriz X"+datos.i+"</th></tr></thead><tbody>";
  for(var i=0; i<m.cols; i++){
    html+= "<tr><td>"+m[0][i]+"</td></tr>";
  }
  html+="</tbody></table>";
	$('#tablasDer').append(html);
}
function mostrarFunciones(){
  var m = new Matrix(new Array(datos.fi));
  var html = "<h6>matriz f"+datos.i+"</h6><table class='table table-striped table-hover table-bordered'><tbody>";
  for(var i=0; i<m.cols; i++){
    html+= "<tr><td>"+m[0][i]+"</td></tr>";
  }
  html+="</tbody></table>";
	$('#tablasDer').append(html);
}
function mostrarMatrizK(matrizK){
  var m = new Matrix(matrizK);
  var html = "<h6>Calculo de matriz K"+datos.i+"</h6><table class='table table-striped table-hover table-bordered'><tbody>";
    
  for(var i=0; i<m.rows; i++){
    html+='<tr>';
    for(var j=0; j<m.cols; j++){
      html+= "<td>"+m[i][j]+"</td>";
    }
    html+='</tr>';
  }
  html+="</tbody></table>";
	$('#tablasDer').append(html);
}
/* Inicializar Eventos */
initialEvents();