function _classCallCheck(l,n){if(!(l instanceof n))throw new TypeError("Cannot call a class as a function")}function _defineProperties(l,n){for(var u=0;u<n.length;u++){var e=n[u];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(l,e.key,e)}}function _createClass(l,n,u){return n&&_defineProperties(l.prototype,n),u&&_defineProperties(l,u),l}(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{WVB3:function(l,n,u){"use strict";u.r(n);var e=u("8Y7J"),t=u("mrSG"),i=u("ZZ/e"),o=u("wd/R"),a=u("S90N"),c=u("wr3e"),r=function(){function l(n,u,e,t){_classCallCheck(this,l),this.navCtrl=n,this.transaccionService=u,this.cotizacionService=e,this.alertController=t,this.temporizadorRefresco=6e4,this.transacciones=[],this.today=Date.now(),this.m=o(),this.cotizacionBase={moneda:"",compra:"",venta:""},o.locale("es")}return _createClass(l,[{key:"ngOnInit",value:function(){var l=this;setInterval((function(){l.cargaRegistros()}),this.temporizadorRefresco)}},{key:"ionViewDidEnter",value:function(){this.cargaRegistros()}},{key:"cargaRegistros",value:function(){this.cargaTransacciones(),this.cargaCotizacionBase()}},{key:"cargaTransacciones",value:function(){var l=this;this.transaccionService.getTransaccionEnCursoControl().subscribe((function(n){console.log(n),l.transacciones=n.transaccion}))}},{key:"cargaCotizacionBase",value:function(){var l=this;this.cotizacionService.getCotizacion("USDPEN").subscribe((function(n){l.cotizacionBase.compra=n.cotizacion[0].cotizacion})),this.cotizacionService.getCotizacion("PENUSD").subscribe((function(n){l.cotizacionBase.venta=n.cotizacion[0].cotizacion}))}},{key:"confirmarTransferencia",value:function(l){return t.b(this,void 0,void 0,regeneratorRuntime.mark((function n(){var u,e=this;return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,this.alertController.create({header:"N\xb0 Operaci\xf3n",inputs:[{name:"valor",type:"text",placeholder:"Ingrese un valor"}],buttons:[{text:"Cancelar",role:"cancel",cssClass:"secondary",handler:function(){}},{text:"Enviar",handler:function(n){n.valor?e.transaccionService.confirmarTransferenciaPropia(l,n.valor).subscribe((function(l){e.cargaRegistros()})):e.failedAlertTransferencia("Debe ingresar todos los valores",l)}}]});case 2:return u=n.sent,n.next=5,u.present();case 5:case"end":return n.stop()}}),n,this)})))}},{key:"modificarCotizacion",value:function(){return t.b(this,void 0,void 0,regeneratorRuntime.mark((function l(){var n,u=this;return regeneratorRuntime.wrap((function(l){for(;;)switch(l.prev=l.next){case 0:return l.next=2,this.alertController.create({header:"Modificar Cotizaci\xf3n",inputs:[{label:"Compra",name:"compra",type:"number",placeholder:"compra "+this.cotizacionBase.compra},{label:"Venta",name:"venta",type:"number",placeholder:"venta "+this.cotizacionBase.venta}],buttons:[{text:"Cancelar",role:"cancel",cssClass:"secondary",handler:function(){}},{text:"Publicar",handler:function(l){l.compra&&l.venta?u.cotizacionService.actualizaCotizacion([{codigo:"PENUSD",cotizacion:l.venta},{codigo:"USDPEN",cotizacion:l.compra}]).subscribe((function(l){u.cargaRegistros()})):u.failedAlertCotizacion("Debe ingresar todos los valores")}}]});case 2:return n=l.sent,l.next=5,n.present();case 5:case"end":return l.stop()}}),l,this)})))}},{key:"irInicio",value:function(){this.navCtrl.navigateForward("/home")}},{key:"tiempo",value:function(l){return o(l).startOf("minutes").fromNow()}},{key:"fecha",value:function(l){return o(l).format("DD MMMM YYYY, h:mm:ss a")}},{key:"failedAlertCotizacion",value:function(l){return t.b(this,void 0,void 0,regeneratorRuntime.mark((function n(){var u,e=this;return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,this.alertController.create({header:"Error",subHeader:l,buttons:[{text:"OK",handler:function(){e.modificarCotizacion()}}]});case 2:return u=n.sent,n.next=5,u.present();case 5:case"end":return n.stop()}}),n,this)})))}},{key:"failedAlertTransferencia",value:function(l,n){return t.b(this,void 0,void 0,regeneratorRuntime.mark((function u(){var e,t=this;return regeneratorRuntime.wrap((function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,this.alertController.create({header:"Error",subHeader:l,buttons:[{text:"OK",handler:function(){t.confirmarTransferencia(n)}}]});case 2:return e=u.sent,u.next=5,e.present();case 5:case"end":return u.stop()}}),u,this)})))}}]),l}(),s=function l(){_classCallCheck(this,l)},b=u("pMnS"),p=u("oBZk"),d=u("SVse"),C=e.Ab({encapsulation:0,styles:[["[_nghost-%COMP%]   ion-content[_ngcontent-%COMP%]{--background:linear-gradient(-135deg, var(--ion-color-medium), var(--ion-color-light))}ion-card[_ngcontent-%COMP%]{margin:0}.cotizacion[_ngcontent-%COMP%]{border:1px dotted;margin:5px;padding:15px;display:-webkit-box;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;flex-direction:row;-webkit-box-pack:center;justify-content:center}.cotizacion[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%]{text-align:center}.cotizacion[_ngcontent-%COMP%]   .texto[_ngcontent-%COMP%]{font-size:1.5em;margin-right:5px}.cotizacion[_ngcontent-%COMP%]   .valor[_ngcontent-%COMP%]{font-size:2em}@media (max-width:700px){.cotizacion[_ngcontent-%COMP%]{-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column}.cotizacion[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{text-align:center}}.card[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%]{display:block;text-align:center}.card[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]{padding:16px;background-color:var(--ion-color-dark);color:#fff}.card[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%]{font-size:1.5em}.card[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]   .cantidad[_ngcontent-%COMP%]{font-size:2em}.card[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]   .banco[_ngcontent-%COMP%], .card[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]   .cuenta[_ngcontent-%COMP%], .card[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]   .moneda[_ngcontent-%COMP%]{font-size:1.5em}.card[_ngcontent-%COMP%]   .operacion[_ngcontent-%COMP%]{margin-bottom:20px;font-size:1.5em}.card[_ngcontent-%COMP%]   .destino[_ngcontent-%COMP%]{font-size:1.5em;margin-bottom:20px}.card[_ngcontent-%COMP%]   .destino[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%]{font-weight:700}.card[_ngcontent-%COMP%]   .enviar[_ngcontent-%COMP%]{border:1px dotted;padding:5px;margin-top:10px;text-align:center}.card[_ngcontent-%COMP%]   .enviar[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%]{font-size:1em}.card[_ngcontent-%COMP%]   .enviar[_ngcontent-%COMP%]   .cantidad[_ngcontent-%COMP%]{font-size:2em}.card[_ngcontent-%COMP%]   .enviar[_ngcontent-%COMP%]   .moneda[_ngcontent-%COMP%]{font-size:1.5em}.flag_res[_ngcontent-%COMP%]{width:25px;padding:0;margin-right:10px;display:-webkit-inline-box;display:inline-flex}.flexV[_ngcontent-%COMP%]{display:-webkit-box!important;display:flex!important;-webkit-box-orient:horizontal!important;-webkit-box-direction:normal!important;flex-direction:row!important}.flexC[_ngcontent-%COMP%]{display:-webkit-box!important;display:flex!important;-webkit-box-orient:vertical!important;-webkit-box-direction:normal!important;flex-direction:column!important}"]],data:{}});function m(l){return e.Yb(0,[(l()(),e.Cb(0,0,null,null,2,"ion-row",[["class","ion-align-items-center ion-justify-content-center pb_40 "]],null,null,null,p.Gb,p.J)),e.Bb(1,49152,null,0,i.mb,[e.j,e.p,e.F],null,null),(l()(),e.Wb(-1,0,[" Aun no existen transacciones registradas "]))],null,null)}function f(l){return e.Yb(0,[(l()(),e.Cb(0,0,null,null,4,"ion-row",[["class","ion-align-items-center ion-justify-content-center"]],null,null,null,p.Gb,p.J)),e.Bb(1,49152,null,0,i.mb,[e.j,e.p,e.F],null,null),(l()(),e.Cb(2,0,null,0,2,"ion-col",[["size","12"]],null,null,null,p.ib,p.l)),e.Bb(3,49152,null,0,i.w,[e.j,e.p,e.F],{size:[0,"size"]},null),(l()(),e.Wb(4,0,[" Existen "," transacciones pendientes de atenci\xf3n "]))],(function(l,n){l(n,3,0,"12")}),(function(l,n){l(n,4,0,n.component.transacciones.length)}))}function g(l){return e.Yb(0,[(l()(),e.Cb(0,0,null,null,137,"ion-col",[],null,null,null,p.ib,p.l)),e.Bb(1,49152,null,0,i.w,[e.j,e.p,e.F],null,null),(l()(),e.Cb(2,0,null,0,135,"ion-card",[["class","card"]],null,null,null,p.hb,p.g)),e.Bb(3,49152,null,0,i.p,[e.j,e.p,e.F],null,null),(l()(),e.Cb(4,0,null,0,42,"div",[["class","title"]],null,null,null,null,null)),(l()(),e.Cb(5,0,null,null,41,"ion-grid",[["fixed",""]],null,null,null,p.ob,p.r)),e.Bb(6,49152,null,0,i.D,[e.j,e.p,e.F],{fixed:[0,"fixed"]},null),(l()(),e.Cb(7,0,null,0,39,"ion-row",[["class","ion-align-items-center ion-justify-content-center "]],null,null,null,p.Gb,p.J)),e.Bb(8,49152,null,0,i.mb,[e.j,e.p,e.F],null,null),(l()(),e.Cb(9,0,null,0,17,"ion-col",[["size-sm","4"],["size-xs","12"]],null,null,null,p.ib,p.l)),e.Bb(10,49152,null,0,i.w,[e.j,e.p,e.F],null,null),(l()(),e.Cb(11,0,null,0,3,"ion-label",[["style","margin-bottom: 15px;"]],null,null,null,p.xb,p.A)),e.Bb(12,49152,null,0,i.Q,[e.j,e.p,e.F],null,null),(l()(),e.Cb(13,0,null,0,1,"span",[["style","border: dotted 1px; padding: 10px;"]],null,null,null,null,null)),(l()(),e.Wb(14,null,["",""])),(l()(),e.Cb(15,0,null,0,3,"ion-label",[],null,null,null,p.xb,p.A)),e.Bb(16,49152,null,0,i.Q,[e.j,e.p,e.F],null,null),(l()(),e.Cb(17,0,null,0,1,"span",[["class","subtitle"]],null,null,null,null,null)),(l()(),e.Wb(-1,null,["Importe Recibido"])),(l()(),e.Cb(19,0,null,0,7,"ion-label",[],null,null,null,p.xb,p.A)),e.Bb(20,49152,null,0,i.Q,[e.j,e.p,e.F],null,null),(l()(),e.Cb(21,0,null,0,1,"ion-img",[["class","flag_res"]],null,null,null,p.rb,p.u)),e.Bb(22,49152,null,0,i.G,[e.j,e.p,e.F],{src:[0,"src"]},null),(l()(),e.Cb(23,0,null,0,1,"span",[["class","cantidad"]],null,null,null,null,null)),(l()(),e.Wb(24,null,["",""])),(l()(),e.Cb(25,0,null,0,1,"span",[["class","moneda"]],null,null,null,null,null)),(l()(),e.Wb(26,null,[" ",""])),(l()(),e.Cb(27,0,null,0,9,"ion-col",[["size-sm","4"],["size-xs","12"]],null,null,null,p.ib,p.l)),e.Bb(28,49152,null,0,i.w,[e.j,e.p,e.F],null,null),(l()(),e.Cb(29,0,null,0,3,"ion-label",[],null,null,null,p.xb,p.A)),e.Bb(30,49152,null,0,i.Q,[e.j,e.p,e.F],null,null),(l()(),e.Cb(31,0,null,0,1,"span",[["class","banco"]],null,null,null,null,null)),(l()(),e.Wb(32,null,["",""])),(l()(),e.Cb(33,0,null,0,3,"ion-label",[],null,null,null,p.xb,p.A)),e.Bb(34,49152,null,0,i.Q,[e.j,e.p,e.F],null,null),(l()(),e.Cb(35,0,null,0,1,"span",[["class","cuenta"]],null,null,null,null,null)),(l()(),e.Wb(36,null,["",""])),(l()(),e.Cb(37,0,null,0,9,"ion-col",[["size-sm","4"],["size-xs","12"]],null,null,null,p.ib,p.l)),e.Bb(38,49152,null,0,i.w,[e.j,e.p,e.F],null,null),(l()(),e.Cb(39,0,null,0,3,"ion-label",[["style","font-size: 2em;"]],null,null,null,p.xb,p.A)),e.Bb(40,49152,null,0,i.Q,[e.j,e.p,e.F],null,null),(l()(),e.Cb(41,0,null,0,1,"ion-icon",[["name","arrow-round-down"]],null,null,null,p.qb,p.t)),e.Bb(42,49152,null,0,i.F,[e.j,e.p,e.F],{name:[0,"name"]},null),(l()(),e.Cb(43,0,null,0,3,"ion-label",[],null,null,null,p.xb,p.A)),e.Bb(44,49152,null,0,i.Q,[e.j,e.p,e.F],null,null),(l()(),e.Cb(45,0,null,0,1,"span",[["class","banco"]],null,null,null,null,null)),(l()(),e.Wb(46,null,["N\xb0 Operaci\xf3n: ",""])),(l()(),e.Cb(47,0,null,0,90,"ion-card-content",[],null,null,null,p.db,p.h)),e.Bb(48,49152,null,0,i.q,[e.j,e.p,e.F],null,null),(l()(),e.Cb(49,0,null,0,88,"ion-grid",[["fixed",""]],null,null,null,p.ob,p.r)),e.Bb(50,49152,null,0,i.D,[e.j,e.p,e.F],{fixed:[0,"fixed"]},null),(l()(),e.Cb(51,0,null,0,86,"ion-row",[],null,null,null,p.Gb,p.J)),e.Bb(52,49152,null,0,i.mb,[e.j,e.p,e.F],null,null),(l()(),e.Cb(53,0,null,0,31,"ion-col",[["size-sm","4"],["size-xs","12"]],null,null,null,p.ib,p.l)),e.Bb(54,49152,null,0,i.w,[e.j,e.p,e.F],null,null),(l()(),e.Cb(55,0,null,0,29,"div",[["class","operacion"]],null,null,null,null,null)),(l()(),e.Cb(56,0,null,null,3,"ion-label",[],null,null,null,p.xb,p.A)),e.Bb(57,49152,null,0,i.Q,[e.j,e.p,e.F],null,null),(l()(),e.Cb(58,0,null,0,1,"strong",[],null,null,null,null,null)),(l()(),e.Wb(59,null,["Transacci\xf3n: ",""])),(l()(),e.Cb(60,0,null,null,7,"ion-label",[],null,null,null,p.xb,p.A)),e.Bb(61,49152,null,0,i.Q,[e.j,e.p,e.F],null,null),(l()(),e.Cb(62,0,null,0,3,"span",[],null,null,null,null,null)),(l()(),e.Cb(63,0,null,null,1,"strong",[],null,null,null,null,null)),(l()(),e.Wb(-1,null,["Titular:"])),(l()(),e.Wb(65,null,[" ",""])),(l()(),e.Cb(66,0,null,0,1,"span",[],null,null,null,null,null)),(l()(),e.Wb(67,null,[" ",""])),(l()(),e.Cb(68,0,null,null,5,"ion-label",[],null,null,null,p.xb,p.A)),e.Bb(69,49152,null,0,i.Q,[e.j,e.p,e.F],null,null),(l()(),e.Cb(70,0,null,0,3,"span",[],null,null,null,null,null)),(l()(),e.Cb(71,0,null,null,1,"strong",[],null,null,null,null,null)),(l()(),e.Wb(-1,null,["Telefono:"])),(l()(),e.Wb(73,null,[" ",""])),(l()(),e.Cb(74,0,null,null,5,"ion-label",[],null,null,null,p.xb,p.A)),e.Bb(75,49152,null,0,i.Q,[e.j,e.p,e.F],null,null),(l()(),e.Cb(76,0,null,0,3,"span",[],null,null,null,null,null)),(l()(),e.Cb(77,0,null,null,1,"strong",[],null,null,null,null,null)),(l()(),e.Wb(-1,null,["Email:"])),(l()(),e.Wb(79,null,[" ",""])),(l()(),e.Cb(80,0,null,null,4,"ion-label",[],null,null,null,p.xb,p.A)),e.Bb(81,49152,null,0,i.Q,[e.j,e.p,e.F],null,null),(l()(),e.Cb(82,0,null,0,1,"strong",[],null,null,null,null,null)),(l()(),e.Wb(-1,null,["Cotizacion:"])),(l()(),e.Wb(84,0,[" "," ",""])),(l()(),e.Cb(85,0,null,0,34,"ion-col",[["size-sm","4"],["size-xs","12"]],null,null,null,p.ib,p.l)),e.Bb(86,49152,null,0,i.w,[e.j,e.p,e.F],null,null),(l()(),e.Cb(87,0,null,0,32,"div",[["class","destino"]],null,null,null,null,null)),(l()(),e.Cb(88,0,null,null,3,"ion-label",[],null,null,null,p.xb,p.A)),e.Bb(89,49152,null,0,i.Q,[e.j,e.p,e.F],null,null),(l()(),e.Cb(90,0,null,0,1,"span",[["class","subtitle"]],null,null,null,null,null)),(l()(),e.Wb(-1,null,["Cuenta de Destino"])),(l()(),e.Cb(92,0,null,null,3,"ion-label",[],null,null,null,p.xb,p.A)),e.Bb(93,49152,null,0,i.Q,[e.j,e.p,e.F],null,null),(l()(),e.Cb(94,0,null,0,1,"span",[],null,null,null,null,null)),(l()(),e.Wb(95,null,[" ",""])),(l()(),e.Cb(96,0,null,null,5,"ion-label",[],null,null,null,p.xb,p.A)),e.Bb(97,49152,null,0,i.Q,[e.j,e.p,e.F],null,null),(l()(),e.Cb(98,0,null,0,3,"span",[],null,null,null,null,null)),(l()(),e.Cb(99,0,null,null,1,"strong",[],null,null,null,null,null)),(l()(),e.Wb(-1,null,["Banco:"])),(l()(),e.Wb(101,null,[" ",""])),(l()(),e.Cb(102,0,null,null,5,"ion-label",[],null,null,null,p.xb,p.A)),e.Bb(103,49152,null,0,i.Q,[e.j,e.p,e.F],null,null),(l()(),e.Cb(104,0,null,0,3,"span",[],null,null,null,null,null)),(l()(),e.Cb(105,0,null,null,1,"strong",[],null,null,null,null,null)),(l()(),e.Wb(-1,null,["Tipo:"])),(l()(),e.Wb(107,null,[" ",""])),(l()(),e.Cb(108,0,null,null,5,"ion-label",[],null,null,null,p.xb,p.A)),e.Bb(109,49152,null,0,i.Q,[e.j,e.p,e.F],null,null),(l()(),e.Cb(110,0,null,0,3,"span",[],null,null,null,null,null)),(l()(),e.Cb(111,0,null,null,1,"strong",[],null,null,null,null,null)),(l()(),e.Wb(-1,null,["Numero:"])),(l()(),e.Wb(113,null,[" ",""])),(l()(),e.Cb(114,0,null,null,5,"ion-label",[],null,null,null,p.xb,p.A)),e.Bb(115,49152,null,0,i.Q,[e.j,e.p,e.F],null,null),(l()(),e.Cb(116,0,null,0,3,"span",[],null,null,null,null,null)),(l()(),e.Cb(117,0,null,null,1,"strong",[],null,null,null,null,null)),(l()(),e.Wb(-1,null,["CCI:"])),(l()(),e.Wb(119,null,[" ",""])),(l()(),e.Cb(120,0,null,0,17,"ion-col",[["size-sm","4"],["size-xs","12"]],null,null,null,p.ib,p.l)),e.Bb(121,49152,null,0,i.w,[e.j,e.p,e.F],null,null),(l()(),e.Cb(122,0,null,0,15,"div",[["class","enviar"]],null,null,null,null,null)),(l()(),e.Cb(123,0,null,null,3,"ion-label",[["class","mt_10"]],null,null,null,p.xb,p.A)),e.Bb(124,49152,null,0,i.Q,[e.j,e.p,e.F],null,null),(l()(),e.Cb(125,0,null,0,1,"span",[["class","subtitle"]],null,null,null,null,null)),(l()(),e.Wb(-1,null,["Importe a Transferir"])),(l()(),e.Cb(127,0,null,null,7,"ion-label",[],null,null,null,p.xb,p.A)),e.Bb(128,49152,null,0,i.Q,[e.j,e.p,e.F],null,null),(l()(),e.Cb(129,0,null,0,1,"ion-img",[["class","flag_res"]],null,null,null,p.rb,p.u)),e.Bb(130,49152,null,0,i.G,[e.j,e.p,e.F],{src:[0,"src"]},null),(l()(),e.Cb(131,0,null,0,1,"span",[["class","cantidad"]],null,null,null,null,null)),(l()(),e.Wb(132,null,["",""])),(l()(),e.Cb(133,0,null,0,1,"span",[["class","moneda"]],null,null,null,null,null)),(l()(),e.Wb(134,null,[" ",""])),(l()(),e.Cb(135,0,null,null,2,"ion-button",[["class","mt_10 mb_20"],["fill","outline"],["slot","end"]],null,[[null,"click"]],(function(l,n,u){var e=!0;return"click"===n&&(e=!1!==l.component.confirmarTransferencia(l.context.$implicit._id)&&e),e}),p.bb,p.e)),e.Bb(136,49152,null,0,i.n,[e.j,e.p,e.F],{fill:[0,"fill"]},null),(l()(),e.Wb(-1,0,["Confirmar Transferencia"]))],(function(l,n){l(n,6,0,""),l(n,22,0,e.Gb(1,"/assets/flags/4x3/",n.context.$implicit.monedaDe.pais.valorUno,"")),l(n,42,0,"arrow-round-down"),l(n,50,0,""),l(n,130,0,e.Gb(1,"/assets/flags/4x3/",n.context.$implicit.monedaA.pais.valorUno,"")),l(n,136,0,"outline")}),(function(l,n){l(n,14,0,n.component.tiempo(n.context.$implicit.transferencia.fechaTransferenciaCliente)),l(n,24,0,n.context.$implicit.cantidadDe),l(n,26,0,n.context.$implicit.monedaDe.codigo),l(n,32,0,n.context.$implicit.transferencia.cuentaPropiaDestino.banco.descripcion),l(n,36,0,n.context.$implicit.transferencia.cuentaPropiaDestino.numeroDeCuenta),l(n,46,0,n.context.$implicit.transferencia.numeroOperacionOrigen),l(n,59,0,n.context.$implicit.numeroTransaccion),l(n,65,0,"CuentaPropia"===n.context.$implicit.transferencia.cuentaOrigen.tipoPropiedadCuenta.codigo?n.context.$implicit.cliente.nombre:n.context.$implicit.empresa.razonSocial),l(n,67,0,"CuentaPropia"===n.context.$implicit.transferencia.cuentaOrigen.tipoPropiedadCuenta.codigo?n.context.$implicit.cliente.tipoDocumentoIdentidad.descripcion+"-"+n.context.$implicit.cliente.numeroDocumentoIdentidad:n.context.$implicit.empresa.ruc),l(n,73,0,n.context.$implicit.cliente.telefono),l(n,79,0,n.context.$implicit.cliente.email),l(n,84,0,n.context.$implicit.cotizacion,n.context.$implicit.monedaA.codigo),l(n,95,0,n.context.$implicit.transferencia.cuentaDestino.tipoPropiedadCuenta.descripcion),l(n,101,0,n.context.$implicit.transferencia.cuentaDestino.banco.descripcion),l(n,107,0,n.context.$implicit.transferencia.cuentaDestino.tipoDeCuenta.descripcion),l(n,113,0,n.context.$implicit.transferencia.cuentaDestino.numeroDeCuenta),l(n,119,0,n.context.$implicit.transferencia.cuentaDestino.numeroDeCCI),l(n,132,0,n.context.$implicit.cantidadA),l(n,134,0,n.context.$implicit.monedaA.codigo)}))}function x(l){return e.Yb(0,[(l()(),e.Cb(0,0,null,null,3,"ion-row",[["class","ion-align-items-center ion-justify-content-center pb_40 "]],null,null,null,p.Gb,p.J)),e.Bb(1,49152,null,0,i.mb,[e.j,e.p,e.F],null,null),(l()(),e.rb(16777216,null,0,1,null,g)),e.Bb(3,278528,null,0,d.j,[e.X,e.T,e.x],{ngForOf:[0,"ngForOf"]},null)],(function(l,n){l(n,3,0,n.component.transacciones)}),null)}function v(l){return e.Yb(0,[(l()(),e.Cb(0,0,null,null,13,"ion-header",[["class","header"]],null,null,null,p.pb,p.s)),e.Bb(1,49152,null,0,i.E,[e.j,e.p,e.F],null,null),(l()(),e.Cb(2,0,null,0,11,"ion-toolbar",[["class","ion-toolbar ion-no-padding"]],null,null,null,p.Tb,p.W)),e.Bb(3,49152,null,0,i.Fb,[e.j,e.p,e.F],null,null),(l()(),e.Cb(4,0,null,0,9,"ion-buttons",[["color","primary"],["slot","start"]],null,null,null,p.cb,p.f)),e.Bb(5,49152,null,0,i.o,[e.j,e.p,e.F],null,null),(l()(),e.Cb(6,0,null,0,2,"ion-back-button",[["defaultHref","home"]],null,[[null,"click"]],(function(l,n,u){var t=!0;return"click"===n&&(t=!1!==e.Ob(l,8).onClick(u)&&t),t}),p.Z,p.c)),e.Bb(7,49152,null,0,i.j,[e.j,e.p,e.F],{defaultHref:[0,"defaultHref"]},null),e.Bb(8,16384,null,0,i.k,[[2,i.lb],i.Mb],{defaultHref:[0,"defaultHref"]},null),(l()(),e.Cb(9,0,null,0,4,"div",[["class","ion-text-center ion-no-padding bg-white"]],null,null,null,null,null)),(l()(),e.Cb(10,0,null,null,3,"a",[],null,[[null,"click"]],(function(l,n,u){var e=!0;return"click"===n&&(e=!1!==l.component.irInicio()&&e),e}),null,null)),(l()(),e.Cb(11,0,null,null,2,"ion-text",[["class",""],["color","light"]],null,null,null,p.Qb,p.T)),e.Bb(12,49152,null,0,i.Ab,[e.j,e.p,e.F],{color:[0,"color"]},null),(l()(),e.Cb(13,0,null,0,0,"p",[["class","logo originel ion-no-margin"]],null,null,null,null,null)),(l()(),e.Cb(14,0,null,null,33,"ion-content",[["class","animated fadeIn"]],null,null,null,p.jb,p.m)),e.Bb(15,49152,null,0,i.x,[e.j,e.p,e.F],null,null),(l()(),e.Cb(16,0,null,0,31,"div",[["class","ion-no-margin bg-white pt_40 pb_40"]],null,null,null,null,null)),(l()(),e.Cb(17,0,null,null,30,"ion-grid",[["fixed",""]],null,null,null,p.ob,p.r)),e.Bb(18,49152,null,0,i.D,[e.j,e.p,e.F],{fixed:[0,"fixed"]},null),(l()(),e.Cb(19,0,null,0,22,"ion-row",[["class","ion-align-items-center ion-justify-content-center"]],null,null,null,p.Gb,p.J)),e.Bb(20,49152,null,0,i.mb,[e.j,e.p,e.F],null,null),(l()(),e.Cb(21,0,null,0,20,"ion-col",[["size","12"]],null,null,null,p.ib,p.l)),e.Bb(22,49152,null,0,i.w,[e.j,e.p,e.F],{size:[0,"size"]},null),(l()(),e.Cb(23,0,null,0,18,"div",[["class","cotizacion"]],null,null,null,null,null)),(l()(),e.Cb(24,0,null,null,6,"div",[["class","pr_10"]],null,null,null,null,null)),(l()(),e.Cb(25,0,null,null,5,"ion-label",[["class","label"]],null,null,null,p.xb,p.A)),e.Bb(26,49152,null,0,i.Q,[e.j,e.p,e.F],null,null),(l()(),e.Cb(27,0,null,0,1,"span",[["class","texto"]],null,null,null,null,null)),(l()(),e.Wb(-1,null,["Compra"])),(l()(),e.Cb(29,0,null,0,1,"span",[["class","valor"]],null,null,null,null,null)),(l()(),e.Wb(30,null,["",""])),(l()(),e.Cb(31,0,null,null,6,"div",[],null,null,null,null,null)),(l()(),e.Cb(32,0,null,null,5,"ion-label",[["class","label"]],null,null,null,p.xb,p.A)),e.Bb(33,49152,null,0,i.Q,[e.j,e.p,e.F],null,null),(l()(),e.Cb(34,0,null,0,1,"span",[["class","texto"]],null,null,null,null,null)),(l()(),e.Wb(-1,null,["Venta"])),(l()(),e.Cb(36,0,null,0,1,"span",[["class","valor"]],null,null,null,null,null)),(l()(),e.Wb(37,null,["",""])),(l()(),e.Cb(38,0,null,null,3,"div",[],null,null,null,null,null)),(l()(),e.Cb(39,0,null,null,2,"ion-button",[["fill","outline"],["slot","end"]],null,[[null,"click"]],(function(l,n,u){var e=!0;return"click"===n&&(e=!1!==l.component.modificarCotizacion()&&e),e}),p.bb,p.e)),e.Bb(40,49152,null,0,i.n,[e.j,e.p,e.F],{fill:[0,"fill"]},null),(l()(),e.Wb(-1,0,["Modificar"])),(l()(),e.rb(16777216,null,0,1,null,m)),e.Bb(43,16384,null,0,d.k,[e.X,e.T],{ngIf:[0,"ngIf"]},null),(l()(),e.rb(16777216,null,0,1,null,f)),e.Bb(45,16384,null,0,d.k,[e.X,e.T],{ngIf:[0,"ngIf"]},null),(l()(),e.rb(16777216,null,0,1,null,x)),e.Bb(47,16384,null,0,d.k,[e.X,e.T],{ngIf:[0,"ngIf"]},null)],(function(l,n){var u=n.component;l(n,7,0,"home"),l(n,8,0,"home"),l(n,12,0,"light"),l(n,18,0,""),l(n,22,0,"12"),l(n,40,0,"outline"),l(n,43,0,!u.transacciones),l(n,45,0,u.transacciones),l(n,47,0,u.transacciones)}),(function(l,n){var u=n.component;l(n,30,0,u.cotizacionBase.compra),l(n,37,0,u.cotizacionBase.venta)}))}var h=e.yb("app-about",r,(function(l){return e.Yb(0,[(l()(),e.Cb(0,0,null,null,1,"app-about",[],null,null,null,v,C)),e.Bb(1,114688,null,0,r,[i.Mb,a.a,c.a,i.b],null,null)],(function(l,n){l(n,1,0)}),null)}),{},{},[]),M=u("s7LF"),z=u("TSSN"),_=u("iInd");u.d(n,"ControlOperacionesPageModuleNgFactory",(function(){return B}));var B=e.zb(s,[],(function(l){return e.Lb([e.Mb(512,e.m,e.kb,[[8,[b.a,h]],[3,e.m],e.D]),e.Mb(4608,d.m,d.l,[e.z,[2,d.x]]),e.Mb(4608,M.n,M.n,[]),e.Mb(4608,i.c,i.c,[e.F,e.g]),e.Mb(4608,i.Lb,i.Lb,[i.c,e.m,e.w]),e.Mb(4608,i.Qb,i.Qb,[i.c,e.m,e.w]),e.Mb(4608,z.g,z.f,[]),e.Mb(4608,z.c,z.e,[]),e.Mb(4608,z.i,z.d,[]),e.Mb(4608,z.b,z.a,[]),e.Mb(4608,z.k,z.k,[z.l,z.g,z.c,z.i,z.b,z.m,z.n]),e.Mb(1073742336,d.b,d.b,[]),e.Mb(1073742336,M.m,M.m,[]),e.Mb(1073742336,M.e,M.e,[]),e.Mb(1073742336,i.Hb,i.Hb,[]),e.Mb(1073742336,z.h,z.h,[]),e.Mb(1073742336,_.o,_.o,[[2,_.t],[2,_.m]]),e.Mb(1073742336,s,s,[]),e.Mb(256,z.n,void 0,[]),e.Mb(256,z.m,void 0,[]),e.Mb(1024,_.k,(function(){return[[{path:"",component:r}]]}),[])])}))}}]);