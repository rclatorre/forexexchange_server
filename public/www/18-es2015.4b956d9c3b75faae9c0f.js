(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{WVB3:function(l,n,u){"use strict";u.r(n);var t=u("8Y7J"),i=u("mrSG"),e=u("ZZ/e"),o=u("wd/R"),a=u("S90N"),c=u("wr3e");class r{constructor(l,n,u,t){this.navCtrl=l,this.transaccionService=n,this.cotizacionService=u,this.alertController=t,this.temporizadorRefresco=6e4,this.transacciones=[],this.today=Date.now(),this.m=o(),this.cotizacionBase={moneda:"",compra:"",venta:""},o.locale("es")}ngOnInit(){setInterval(()=>{this.cargaRegistros()},this.temporizadorRefresco)}ionViewDidEnter(){this.cargaRegistros()}cargaRegistros(){this.cargaTransacciones(),this.cargaCotizacionBase()}cargaTransacciones(){this.transaccionService.getTransaccionEnCursoControl().subscribe(l=>{console.log(l),this.transacciones=l.transaccion})}cargaCotizacionBase(){this.cotizacionService.getCotizacion("USDPEN").subscribe(l=>{this.cotizacionBase.compra=l.cotizacion[0].cotizacion}),this.cotizacionService.getCotizacion("PENUSD").subscribe(l=>{this.cotizacionBase.venta=l.cotizacion[0].cotizacion})}confirmarTransferencia(l){return i.b(this,void 0,void 0,(function*(){const n=yield this.alertController.create({header:"N\xb0 Operaci\xf3n",inputs:[{name:"valor",type:"text",placeholder:"Ingrese un valor"}],buttons:[{text:"Cancelar",role:"cancel",cssClass:"secondary",handler:()=>{}},{text:"Enviar",handler:n=>{n.valor?this.transaccionService.confirmarTransferenciaPropia(l,n.valor).subscribe(l=>{this.cargaRegistros()}):this.failedAlertTransferencia("Debe ingresar todos los valores",l)}}]});yield n.present()}))}modificarCotizacion(){return i.b(this,void 0,void 0,(function*(){const l=yield this.alertController.create({header:"Modificar Cotizaci\xf3n",inputs:[{label:"Compra",name:"compra",type:"number",placeholder:"compra "+this.cotizacionBase.compra},{label:"Venta",name:"venta",type:"number",placeholder:"venta "+this.cotizacionBase.venta}],buttons:[{text:"Cancelar",role:"cancel",cssClass:"secondary",handler:()=>{}},{text:"Publicar",handler:l=>{l.compra&&l.venta?this.cotizacionService.actualizaCotizacion([{codigo:"PENUSD",cotizacion:l.venta},{codigo:"USDPEN",cotizacion:l.compra}]).subscribe(l=>{this.cargaRegistros()}):this.failedAlertCotizacion("Debe ingresar todos los valores")}}]});yield l.present()}))}irInicio(){this.navCtrl.navigateForward("/home")}tiempo(l){return o(l).startOf("minutes").fromNow()}fecha(l){return o(l).format("DD MMMM YYYY, h:mm:ss a")}failedAlertCotizacion(l){return i.b(this,void 0,void 0,(function*(){const n=yield this.alertController.create({header:"Error",subHeader:l,buttons:[{text:"OK",handler:()=>{this.modificarCotizacion()}}]});yield n.present()}))}failedAlertTransferencia(l,n){return i.b(this,void 0,void 0,(function*(){const u=yield this.alertController.create({header:"Error",subHeader:l,buttons:[{text:"OK",handler:()=>{this.confirmarTransferencia(n)}}]});yield u.present()}))}}class b{}var s=u("pMnS"),p=u("oBZk"),d=u("SVse"),C=t.Ab({encapsulation:0,styles:[["[_nghost-%COMP%]   ion-content[_ngcontent-%COMP%]{--background:linear-gradient(-135deg, var(--ion-color-medium), var(--ion-color-light))}ion-card[_ngcontent-%COMP%]{margin:0}.cotizacion[_ngcontent-%COMP%]{border:1px dotted;margin:5px;padding:15px;display:-webkit-box;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;flex-direction:row;-webkit-box-pack:center;justify-content:center}.cotizacion[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%]{text-align:center}.cotizacion[_ngcontent-%COMP%]   .texto[_ngcontent-%COMP%]{font-size:1.5em;margin-right:5px}.cotizacion[_ngcontent-%COMP%]   .valor[_ngcontent-%COMP%]{font-size:2em}@media (max-width:700px){.cotizacion[_ngcontent-%COMP%]{-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column}.cotizacion[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{text-align:center}}.card[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%]{display:block;text-align:center}.card[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]{padding:16px;background-color:var(--ion-color-dark);color:#fff}.card[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%]{font-size:1.5em}.card[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]   .cantidad[_ngcontent-%COMP%]{font-size:2em}.card[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]   .banco[_ngcontent-%COMP%], .card[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]   .cuenta[_ngcontent-%COMP%], .card[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]   .moneda[_ngcontent-%COMP%]{font-size:1.5em}.card[_ngcontent-%COMP%]   .operacion[_ngcontent-%COMP%]{margin-bottom:20px;font-size:1.5em}.card[_ngcontent-%COMP%]   .destino[_ngcontent-%COMP%]{font-size:1.5em;margin-bottom:20px}.card[_ngcontent-%COMP%]   .destino[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%]{font-weight:700}.card[_ngcontent-%COMP%]   .enviar[_ngcontent-%COMP%]{border:1px dotted;padding:5px;margin-top:10px;text-align:center}.card[_ngcontent-%COMP%]   .enviar[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%]{font-size:1em}.card[_ngcontent-%COMP%]   .enviar[_ngcontent-%COMP%]   .cantidad[_ngcontent-%COMP%]{font-size:2em}.card[_ngcontent-%COMP%]   .enviar[_ngcontent-%COMP%]   .moneda[_ngcontent-%COMP%]{font-size:1.5em}.flag_res[_ngcontent-%COMP%]{width:25px;padding:0;margin-right:10px;display:-webkit-inline-box;display:inline-flex}.flexV[_ngcontent-%COMP%]{display:-webkit-box!important;display:flex!important;-webkit-box-orient:horizontal!important;-webkit-box-direction:normal!important;flex-direction:row!important}.flexC[_ngcontent-%COMP%]{display:-webkit-box!important;display:flex!important;-webkit-box-orient:vertical!important;-webkit-box-direction:normal!important;flex-direction:column!important}"]],data:{}});function m(l){return t.Yb(0,[(l()(),t.Cb(0,0,null,null,2,"ion-row",[["class","ion-align-items-center ion-justify-content-center pb_40 "]],null,null,null,p.Gb,p.J)),t.Bb(1,49152,null,0,e.mb,[t.j,t.p,t.F],null,null),(l()(),t.Wb(-1,0,[" Aun no existen transacciones registradas "]))],null,null)}function g(l){return t.Yb(0,[(l()(),t.Cb(0,0,null,null,4,"ion-row",[["class","ion-align-items-center ion-justify-content-center"]],null,null,null,p.Gb,p.J)),t.Bb(1,49152,null,0,e.mb,[t.j,t.p,t.F],null,null),(l()(),t.Cb(2,0,null,0,2,"ion-col",[["size","12"]],null,null,null,p.ib,p.l)),t.Bb(3,49152,null,0,e.w,[t.j,t.p,t.F],{size:[0,"size"]},null),(l()(),t.Wb(4,0,[" Existen "," transacciones pendientes de atenci\xf3n "]))],(function(l,n){l(n,3,0,"12")}),(function(l,n){l(n,4,0,n.component.transacciones.length)}))}function f(l){return t.Yb(0,[(l()(),t.Cb(0,0,null,null,137,"ion-col",[],null,null,null,p.ib,p.l)),t.Bb(1,49152,null,0,e.w,[t.j,t.p,t.F],null,null),(l()(),t.Cb(2,0,null,0,135,"ion-card",[["class","card"]],null,null,null,p.hb,p.g)),t.Bb(3,49152,null,0,e.p,[t.j,t.p,t.F],null,null),(l()(),t.Cb(4,0,null,0,42,"div",[["class","title"]],null,null,null,null,null)),(l()(),t.Cb(5,0,null,null,41,"ion-grid",[["fixed",""]],null,null,null,p.ob,p.r)),t.Bb(6,49152,null,0,e.D,[t.j,t.p,t.F],{fixed:[0,"fixed"]},null),(l()(),t.Cb(7,0,null,0,39,"ion-row",[["class","ion-align-items-center ion-justify-content-center "]],null,null,null,p.Gb,p.J)),t.Bb(8,49152,null,0,e.mb,[t.j,t.p,t.F],null,null),(l()(),t.Cb(9,0,null,0,17,"ion-col",[["size-sm","4"],["size-xs","12"]],null,null,null,p.ib,p.l)),t.Bb(10,49152,null,0,e.w,[t.j,t.p,t.F],null,null),(l()(),t.Cb(11,0,null,0,3,"ion-label",[["style","margin-bottom: 15px;"]],null,null,null,p.xb,p.A)),t.Bb(12,49152,null,0,e.Q,[t.j,t.p,t.F],null,null),(l()(),t.Cb(13,0,null,0,1,"span",[["style","border: dotted 1px; padding: 10px;"]],null,null,null,null,null)),(l()(),t.Wb(14,null,["",""])),(l()(),t.Cb(15,0,null,0,3,"ion-label",[],null,null,null,p.xb,p.A)),t.Bb(16,49152,null,0,e.Q,[t.j,t.p,t.F],null,null),(l()(),t.Cb(17,0,null,0,1,"span",[["class","subtitle"]],null,null,null,null,null)),(l()(),t.Wb(-1,null,["Importe Recibido"])),(l()(),t.Cb(19,0,null,0,7,"ion-label",[],null,null,null,p.xb,p.A)),t.Bb(20,49152,null,0,e.Q,[t.j,t.p,t.F],null,null),(l()(),t.Cb(21,0,null,0,1,"ion-img",[["class","flag_res"]],null,null,null,p.rb,p.u)),t.Bb(22,49152,null,0,e.G,[t.j,t.p,t.F],{src:[0,"src"]},null),(l()(),t.Cb(23,0,null,0,1,"span",[["class","cantidad"]],null,null,null,null,null)),(l()(),t.Wb(24,null,["",""])),(l()(),t.Cb(25,0,null,0,1,"span",[["class","moneda"]],null,null,null,null,null)),(l()(),t.Wb(26,null,[" ",""])),(l()(),t.Cb(27,0,null,0,9,"ion-col",[["size-sm","4"],["size-xs","12"]],null,null,null,p.ib,p.l)),t.Bb(28,49152,null,0,e.w,[t.j,t.p,t.F],null,null),(l()(),t.Cb(29,0,null,0,3,"ion-label",[],null,null,null,p.xb,p.A)),t.Bb(30,49152,null,0,e.Q,[t.j,t.p,t.F],null,null),(l()(),t.Cb(31,0,null,0,1,"span",[["class","banco"]],null,null,null,null,null)),(l()(),t.Wb(32,null,["",""])),(l()(),t.Cb(33,0,null,0,3,"ion-label",[],null,null,null,p.xb,p.A)),t.Bb(34,49152,null,0,e.Q,[t.j,t.p,t.F],null,null),(l()(),t.Cb(35,0,null,0,1,"span",[["class","cuenta"]],null,null,null,null,null)),(l()(),t.Wb(36,null,["",""])),(l()(),t.Cb(37,0,null,0,9,"ion-col",[["size-sm","4"],["size-xs","12"]],null,null,null,p.ib,p.l)),t.Bb(38,49152,null,0,e.w,[t.j,t.p,t.F],null,null),(l()(),t.Cb(39,0,null,0,3,"ion-label",[["style","font-size: 2em;"]],null,null,null,p.xb,p.A)),t.Bb(40,49152,null,0,e.Q,[t.j,t.p,t.F],null,null),(l()(),t.Cb(41,0,null,0,1,"ion-icon",[["name","arrow-round-down"]],null,null,null,p.qb,p.t)),t.Bb(42,49152,null,0,e.F,[t.j,t.p,t.F],{name:[0,"name"]},null),(l()(),t.Cb(43,0,null,0,3,"ion-label",[],null,null,null,p.xb,p.A)),t.Bb(44,49152,null,0,e.Q,[t.j,t.p,t.F],null,null),(l()(),t.Cb(45,0,null,0,1,"span",[["class","banco"]],null,null,null,null,null)),(l()(),t.Wb(46,null,["N\xb0 Operaci\xf3n: ",""])),(l()(),t.Cb(47,0,null,0,90,"ion-card-content",[],null,null,null,p.db,p.h)),t.Bb(48,49152,null,0,e.q,[t.j,t.p,t.F],null,null),(l()(),t.Cb(49,0,null,0,88,"ion-grid",[["fixed",""]],null,null,null,p.ob,p.r)),t.Bb(50,49152,null,0,e.D,[t.j,t.p,t.F],{fixed:[0,"fixed"]},null),(l()(),t.Cb(51,0,null,0,86,"ion-row",[],null,null,null,p.Gb,p.J)),t.Bb(52,49152,null,0,e.mb,[t.j,t.p,t.F],null,null),(l()(),t.Cb(53,0,null,0,31,"ion-col",[["size-sm","4"],["size-xs","12"]],null,null,null,p.ib,p.l)),t.Bb(54,49152,null,0,e.w,[t.j,t.p,t.F],null,null),(l()(),t.Cb(55,0,null,0,29,"div",[["class","operacion"]],null,null,null,null,null)),(l()(),t.Cb(56,0,null,null,3,"ion-label",[],null,null,null,p.xb,p.A)),t.Bb(57,49152,null,0,e.Q,[t.j,t.p,t.F],null,null),(l()(),t.Cb(58,0,null,0,1,"strong",[],null,null,null,null,null)),(l()(),t.Wb(59,null,["Transacci\xf3n: ",""])),(l()(),t.Cb(60,0,null,null,7,"ion-label",[],null,null,null,p.xb,p.A)),t.Bb(61,49152,null,0,e.Q,[t.j,t.p,t.F],null,null),(l()(),t.Cb(62,0,null,0,3,"span",[],null,null,null,null,null)),(l()(),t.Cb(63,0,null,null,1,"strong",[],null,null,null,null,null)),(l()(),t.Wb(-1,null,["Titular:"])),(l()(),t.Wb(65,null,[" ",""])),(l()(),t.Cb(66,0,null,0,1,"span",[],null,null,null,null,null)),(l()(),t.Wb(67,null,[" ",""])),(l()(),t.Cb(68,0,null,null,5,"ion-label",[],null,null,null,p.xb,p.A)),t.Bb(69,49152,null,0,e.Q,[t.j,t.p,t.F],null,null),(l()(),t.Cb(70,0,null,0,3,"span",[],null,null,null,null,null)),(l()(),t.Cb(71,0,null,null,1,"strong",[],null,null,null,null,null)),(l()(),t.Wb(-1,null,["Telefono:"])),(l()(),t.Wb(73,null,[" ",""])),(l()(),t.Cb(74,0,null,null,5,"ion-label",[],null,null,null,p.xb,p.A)),t.Bb(75,49152,null,0,e.Q,[t.j,t.p,t.F],null,null),(l()(),t.Cb(76,0,null,0,3,"span",[],null,null,null,null,null)),(l()(),t.Cb(77,0,null,null,1,"strong",[],null,null,null,null,null)),(l()(),t.Wb(-1,null,["Email:"])),(l()(),t.Wb(79,null,[" ",""])),(l()(),t.Cb(80,0,null,null,4,"ion-label",[],null,null,null,p.xb,p.A)),t.Bb(81,49152,null,0,e.Q,[t.j,t.p,t.F],null,null),(l()(),t.Cb(82,0,null,0,1,"strong",[],null,null,null,null,null)),(l()(),t.Wb(-1,null,["Cotizacion:"])),(l()(),t.Wb(84,0,[" "," ",""])),(l()(),t.Cb(85,0,null,0,34,"ion-col",[["size-sm","4"],["size-xs","12"]],null,null,null,p.ib,p.l)),t.Bb(86,49152,null,0,e.w,[t.j,t.p,t.F],null,null),(l()(),t.Cb(87,0,null,0,32,"div",[["class","destino"]],null,null,null,null,null)),(l()(),t.Cb(88,0,null,null,3,"ion-label",[],null,null,null,p.xb,p.A)),t.Bb(89,49152,null,0,e.Q,[t.j,t.p,t.F],null,null),(l()(),t.Cb(90,0,null,0,1,"span",[["class","subtitle"]],null,null,null,null,null)),(l()(),t.Wb(-1,null,["Cuenta de Destino"])),(l()(),t.Cb(92,0,null,null,3,"ion-label",[],null,null,null,p.xb,p.A)),t.Bb(93,49152,null,0,e.Q,[t.j,t.p,t.F],null,null),(l()(),t.Cb(94,0,null,0,1,"span",[],null,null,null,null,null)),(l()(),t.Wb(95,null,[" ",""])),(l()(),t.Cb(96,0,null,null,5,"ion-label",[],null,null,null,p.xb,p.A)),t.Bb(97,49152,null,0,e.Q,[t.j,t.p,t.F],null,null),(l()(),t.Cb(98,0,null,0,3,"span",[],null,null,null,null,null)),(l()(),t.Cb(99,0,null,null,1,"strong",[],null,null,null,null,null)),(l()(),t.Wb(-1,null,["Banco:"])),(l()(),t.Wb(101,null,[" ",""])),(l()(),t.Cb(102,0,null,null,5,"ion-label",[],null,null,null,p.xb,p.A)),t.Bb(103,49152,null,0,e.Q,[t.j,t.p,t.F],null,null),(l()(),t.Cb(104,0,null,0,3,"span",[],null,null,null,null,null)),(l()(),t.Cb(105,0,null,null,1,"strong",[],null,null,null,null,null)),(l()(),t.Wb(-1,null,["Tipo:"])),(l()(),t.Wb(107,null,[" ",""])),(l()(),t.Cb(108,0,null,null,5,"ion-label",[],null,null,null,p.xb,p.A)),t.Bb(109,49152,null,0,e.Q,[t.j,t.p,t.F],null,null),(l()(),t.Cb(110,0,null,0,3,"span",[],null,null,null,null,null)),(l()(),t.Cb(111,0,null,null,1,"strong",[],null,null,null,null,null)),(l()(),t.Wb(-1,null,["Numero:"])),(l()(),t.Wb(113,null,[" ",""])),(l()(),t.Cb(114,0,null,null,5,"ion-label",[],null,null,null,p.xb,p.A)),t.Bb(115,49152,null,0,e.Q,[t.j,t.p,t.F],null,null),(l()(),t.Cb(116,0,null,0,3,"span",[],null,null,null,null,null)),(l()(),t.Cb(117,0,null,null,1,"strong",[],null,null,null,null,null)),(l()(),t.Wb(-1,null,["CCI:"])),(l()(),t.Wb(119,null,[" ",""])),(l()(),t.Cb(120,0,null,0,17,"ion-col",[["size-sm","4"],["size-xs","12"]],null,null,null,p.ib,p.l)),t.Bb(121,49152,null,0,e.w,[t.j,t.p,t.F],null,null),(l()(),t.Cb(122,0,null,0,15,"div",[["class","enviar"]],null,null,null,null,null)),(l()(),t.Cb(123,0,null,null,3,"ion-label",[["class","mt_10"]],null,null,null,p.xb,p.A)),t.Bb(124,49152,null,0,e.Q,[t.j,t.p,t.F],null,null),(l()(),t.Cb(125,0,null,0,1,"span",[["class","subtitle"]],null,null,null,null,null)),(l()(),t.Wb(-1,null,["Importe a Transferir"])),(l()(),t.Cb(127,0,null,null,7,"ion-label",[],null,null,null,p.xb,p.A)),t.Bb(128,49152,null,0,e.Q,[t.j,t.p,t.F],null,null),(l()(),t.Cb(129,0,null,0,1,"ion-img",[["class","flag_res"]],null,null,null,p.rb,p.u)),t.Bb(130,49152,null,0,e.G,[t.j,t.p,t.F],{src:[0,"src"]},null),(l()(),t.Cb(131,0,null,0,1,"span",[["class","cantidad"]],null,null,null,null,null)),(l()(),t.Wb(132,null,["",""])),(l()(),t.Cb(133,0,null,0,1,"span",[["class","moneda"]],null,null,null,null,null)),(l()(),t.Wb(134,null,[" ",""])),(l()(),t.Cb(135,0,null,null,2,"ion-button",[["class","mt_10 mb_20"],["fill","outline"],["slot","end"]],null,[[null,"click"]],(function(l,n,u){var t=!0;return"click"===n&&(t=!1!==l.component.confirmarTransferencia(l.context.$implicit._id)&&t),t}),p.bb,p.e)),t.Bb(136,49152,null,0,e.n,[t.j,t.p,t.F],{fill:[0,"fill"]},null),(l()(),t.Wb(-1,0,["Confirmar Transferencia"]))],(function(l,n){l(n,6,0,""),l(n,22,0,t.Gb(1,"/assets/flags/4x3/",n.context.$implicit.monedaDe.pais.valorUno,"")),l(n,42,0,"arrow-round-down"),l(n,50,0,""),l(n,130,0,t.Gb(1,"/assets/flags/4x3/",n.context.$implicit.monedaA.pais.valorUno,"")),l(n,136,0,"outline")}),(function(l,n){l(n,14,0,n.component.tiempo(n.context.$implicit.transferencia.fechaTransferenciaCliente)),l(n,24,0,n.context.$implicit.cantidadDe),l(n,26,0,n.context.$implicit.monedaDe.codigo),l(n,32,0,n.context.$implicit.transferencia.cuentaPropiaDestino.banco.descripcion),l(n,36,0,n.context.$implicit.transferencia.cuentaPropiaDestino.numeroDeCuenta),l(n,46,0,n.context.$implicit.transferencia.numeroOperacionOrigen),l(n,59,0,n.context.$implicit.numeroTransaccion),l(n,65,0,"CuentaPropia"===n.context.$implicit.transferencia.cuentaOrigen.tipoPropiedadCuenta.codigo?n.context.$implicit.cliente.nombre:n.context.$implicit.empresa.razonSocial),l(n,67,0,"CuentaPropia"===n.context.$implicit.transferencia.cuentaOrigen.tipoPropiedadCuenta.codigo?n.context.$implicit.cliente.tipoDocumentoIdentidad.descripcion+"-"+n.context.$implicit.cliente.numeroDocumentoIdentidad:n.context.$implicit.empresa.ruc),l(n,73,0,n.context.$implicit.cliente.telefono),l(n,79,0,n.context.$implicit.cliente.email),l(n,84,0,n.context.$implicit.cotizacion,n.context.$implicit.monedaA.codigo),l(n,95,0,n.context.$implicit.transferencia.cuentaDestino.tipoPropiedadCuenta.descripcion),l(n,101,0,n.context.$implicit.transferencia.cuentaDestino.banco.descripcion),l(n,107,0,n.context.$implicit.transferencia.cuentaDestino.tipoDeCuenta.descripcion),l(n,113,0,n.context.$implicit.transferencia.cuentaDestino.numeroDeCuenta),l(n,119,0,n.context.$implicit.transferencia.cuentaDestino.numeroDeCCI),l(n,132,0,n.context.$implicit.cantidadA),l(n,134,0,n.context.$implicit.monedaA.codigo)}))}function x(l){return t.Yb(0,[(l()(),t.Cb(0,0,null,null,3,"ion-row",[["class","ion-align-items-center ion-justify-content-center pb_40 "]],null,null,null,p.Gb,p.J)),t.Bb(1,49152,null,0,e.mb,[t.j,t.p,t.F],null,null),(l()(),t.rb(16777216,null,0,1,null,f)),t.Bb(3,278528,null,0,d.j,[t.X,t.T,t.x],{ngForOf:[0,"ngForOf"]},null)],(function(l,n){l(n,3,0,n.component.transacciones)}),null)}function M(l){return t.Yb(0,[(l()(),t.Cb(0,0,null,null,13,"ion-header",[["class","header"]],null,null,null,p.pb,p.s)),t.Bb(1,49152,null,0,e.E,[t.j,t.p,t.F],null,null),(l()(),t.Cb(2,0,null,0,11,"ion-toolbar",[["class","ion-toolbar ion-no-padding"]],null,null,null,p.Tb,p.W)),t.Bb(3,49152,null,0,e.Fb,[t.j,t.p,t.F],null,null),(l()(),t.Cb(4,0,null,0,9,"ion-buttons",[["color","primary"],["slot","start"]],null,null,null,p.cb,p.f)),t.Bb(5,49152,null,0,e.o,[t.j,t.p,t.F],null,null),(l()(),t.Cb(6,0,null,0,2,"ion-back-button",[["defaultHref","home"]],null,[[null,"click"]],(function(l,n,u){var i=!0;return"click"===n&&(i=!1!==t.Ob(l,8).onClick(u)&&i),i}),p.Z,p.c)),t.Bb(7,49152,null,0,e.j,[t.j,t.p,t.F],{defaultHref:[0,"defaultHref"]},null),t.Bb(8,16384,null,0,e.k,[[2,e.lb],e.Mb],{defaultHref:[0,"defaultHref"]},null),(l()(),t.Cb(9,0,null,0,4,"div",[["class","ion-text-center ion-no-padding bg-white"]],null,null,null,null,null)),(l()(),t.Cb(10,0,null,null,3,"a",[],null,[[null,"click"]],(function(l,n,u){var t=!0;return"click"===n&&(t=!1!==l.component.irInicio()&&t),t}),null,null)),(l()(),t.Cb(11,0,null,null,2,"ion-text",[["class",""],["color","light"]],null,null,null,p.Qb,p.T)),t.Bb(12,49152,null,0,e.Ab,[t.j,t.p,t.F],{color:[0,"color"]},null),(l()(),t.Cb(13,0,null,0,0,"p",[["class","logo originel ion-no-margin"]],null,null,null,null,null)),(l()(),t.Cb(14,0,null,null,33,"ion-content",[["class","animated fadeIn"]],null,null,null,p.jb,p.m)),t.Bb(15,49152,null,0,e.x,[t.j,t.p,t.F],null,null),(l()(),t.Cb(16,0,null,0,31,"div",[["class","ion-no-margin bg-white pt_40 pb_40"]],null,null,null,null,null)),(l()(),t.Cb(17,0,null,null,30,"ion-grid",[["fixed",""]],null,null,null,p.ob,p.r)),t.Bb(18,49152,null,0,e.D,[t.j,t.p,t.F],{fixed:[0,"fixed"]},null),(l()(),t.Cb(19,0,null,0,22,"ion-row",[["class","ion-align-items-center ion-justify-content-center"]],null,null,null,p.Gb,p.J)),t.Bb(20,49152,null,0,e.mb,[t.j,t.p,t.F],null,null),(l()(),t.Cb(21,0,null,0,20,"ion-col",[["size","12"]],null,null,null,p.ib,p.l)),t.Bb(22,49152,null,0,e.w,[t.j,t.p,t.F],{size:[0,"size"]},null),(l()(),t.Cb(23,0,null,0,18,"div",[["class","cotizacion"]],null,null,null,null,null)),(l()(),t.Cb(24,0,null,null,6,"div",[["class","pr_10"]],null,null,null,null,null)),(l()(),t.Cb(25,0,null,null,5,"ion-label",[["class","label"]],null,null,null,p.xb,p.A)),t.Bb(26,49152,null,0,e.Q,[t.j,t.p,t.F],null,null),(l()(),t.Cb(27,0,null,0,1,"span",[["class","texto"]],null,null,null,null,null)),(l()(),t.Wb(-1,null,["Compra"])),(l()(),t.Cb(29,0,null,0,1,"span",[["class","valor"]],null,null,null,null,null)),(l()(),t.Wb(30,null,["",""])),(l()(),t.Cb(31,0,null,null,6,"div",[],null,null,null,null,null)),(l()(),t.Cb(32,0,null,null,5,"ion-label",[["class","label"]],null,null,null,p.xb,p.A)),t.Bb(33,49152,null,0,e.Q,[t.j,t.p,t.F],null,null),(l()(),t.Cb(34,0,null,0,1,"span",[["class","texto"]],null,null,null,null,null)),(l()(),t.Wb(-1,null,["Venta"])),(l()(),t.Cb(36,0,null,0,1,"span",[["class","valor"]],null,null,null,null,null)),(l()(),t.Wb(37,null,["",""])),(l()(),t.Cb(38,0,null,null,3,"div",[],null,null,null,null,null)),(l()(),t.Cb(39,0,null,null,2,"ion-button",[["fill","outline"],["slot","end"]],null,[[null,"click"]],(function(l,n,u){var t=!0;return"click"===n&&(t=!1!==l.component.modificarCotizacion()&&t),t}),p.bb,p.e)),t.Bb(40,49152,null,0,e.n,[t.j,t.p,t.F],{fill:[0,"fill"]},null),(l()(),t.Wb(-1,0,["Modificar"])),(l()(),t.rb(16777216,null,0,1,null,m)),t.Bb(43,16384,null,0,d.k,[t.X,t.T],{ngIf:[0,"ngIf"]},null),(l()(),t.rb(16777216,null,0,1,null,g)),t.Bb(45,16384,null,0,d.k,[t.X,t.T],{ngIf:[0,"ngIf"]},null),(l()(),t.rb(16777216,null,0,1,null,x)),t.Bb(47,16384,null,0,d.k,[t.X,t.T],{ngIf:[0,"ngIf"]},null)],(function(l,n){var u=n.component;l(n,7,0,"home"),l(n,8,0,"home"),l(n,12,0,"light"),l(n,18,0,""),l(n,22,0,"12"),l(n,40,0,"outline"),l(n,43,0,!u.transacciones),l(n,45,0,u.transacciones),l(n,47,0,u.transacciones)}),(function(l,n){var u=n.component;l(n,30,0,u.cotizacionBase.compra),l(n,37,0,u.cotizacionBase.venta)}))}function h(l){return t.Yb(0,[(l()(),t.Cb(0,0,null,null,1,"app-about",[],null,null,null,M,C)),t.Bb(1,114688,null,0,r,[e.Mb,a.a,c.a,e.b],null,null)],(function(l,n){l(n,1,0)}),null)}var z=t.yb("app-about",r,h,{},{},[]),v=u("s7LF"),B=u("TSSN"),O=u("iInd");u.d(n,"ControlOperacionesPageModuleNgFactory",(function(){return P}));var P=t.zb(b,[],(function(l){return t.Lb([t.Mb(512,t.m,t.kb,[[8,[s.a,z]],[3,t.m],t.D]),t.Mb(4608,d.m,d.l,[t.z,[2,d.x]]),t.Mb(4608,v.n,v.n,[]),t.Mb(4608,e.c,e.c,[t.F,t.g]),t.Mb(4608,e.Lb,e.Lb,[e.c,t.m,t.w]),t.Mb(4608,e.Qb,e.Qb,[e.c,t.m,t.w]),t.Mb(4608,B.g,B.f,[]),t.Mb(4608,B.c,B.e,[]),t.Mb(4608,B.i,B.d,[]),t.Mb(4608,B.b,B.a,[]),t.Mb(4608,B.k,B.k,[B.l,B.g,B.c,B.i,B.b,B.m,B.n]),t.Mb(1073742336,d.b,d.b,[]),t.Mb(1073742336,v.m,v.m,[]),t.Mb(1073742336,v.e,v.e,[]),t.Mb(1073742336,e.Hb,e.Hb,[]),t.Mb(1073742336,B.h,B.h,[]),t.Mb(1073742336,O.o,O.o,[[2,O.t],[2,O.m]]),t.Mb(1073742336,b,b,[]),t.Mb(256,B.n,void 0,[]),t.Mb(256,B.m,void 0,[]),t.Mb(1024,O.k,(function(){return[[{path:"",component:r}]]}),[])])}))}}]);