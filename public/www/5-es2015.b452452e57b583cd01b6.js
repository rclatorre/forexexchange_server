(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{aOeO:function(l,n,u){"use strict";u.r(n);var e=u("8Y7J"),o=u("mrSG"),i=u("ZZ/e"),t=(u("Q1LM"),u("s7LF")),a=u("Qdzf"),r=u("2P1p"),b=u("cEat"),s=u("HgbJ"),d=u("UuUh"),c=u("K/8/");class g{constructor(l,n,u,e,o,i,t,a,r,b,s){this.navCtrl=l,this.modalCtrl=n,this.loadingCtrl=u,this.toastCtrl=e,this.translate=o,this.formBuilder=i,this.usuarioService=t,this.clienteService=a,this.empresaService=r,this.cuentaBancariaService=b,this.tablasService=s,this.showSelects=!0,this.cliente={_id:"",usuarioAsociado:"",nombre:"",primerApellido:"",segundoApellido:"",email:"",telefono:"",fechaNacimiento:(new Date).toISOString(),paisDeOrigen:{_id:"",codigo:"",descripcion:"",tipoTabla:"",activo:!0,valorUno:"",__v:0},tipoDocumentoIdentidad:{_id:"",codigo:"",descripcion:""},numeroDocumentoIdentidad:"",__v:0}}ngOnInit(){this.onRegistroForm=this.formBuilder.group({nombre:[{value:null,disabled:!0}],primerApellido:[{value:null,disabled:!0}],segundoApellido:[{value:null,disabled:!0}],email:[{value:null,disabled:!0}],paisDeOrigen:[null,t.l.compose([t.l.required])],telefono:[null,t.l.compose([t.l.required])],fechaNacimiento:[null,t.l.compose([t.l.required])],tipoDocumentoIdentidad:[null,t.l.compose([t.l.required])],numeroDocumentoIdentidad:[null,t.l.compose([t.l.required])]},{})}ngAfterViewInit(){return o.b(this,void 0,void 0,(function*(){this.cargarTablas(),this.inicializa()}))}inicializa(){return o.b(this,void 0,void 0,(function*(){this.obtieneUsuario()}))}obtieneUsuario(){return o.b(this,void 0,void 0,(function*(){yield this.usuarioService.getUsuario(!1).then(l=>{this.usuario=l,0!==Object.entries(this.usuario).length&&this.obtieneCliente()})}))}obtieneCliente(){return o.b(this,void 0,void 0,(function*(){yield this.clienteService.getClienteUsuario(this.usuario._id).subscribe(l=>{this.cliente=l.cliente[0],console.log(l.cliente[0]),console.log(this.cliente),Object.entries(this.cliente)})}))}actualizar(){return o.b(this,void 0,void 0,(function*(){const l=yield this.loadingCtrl.create({duration:2e3}),n=yield this.toastCtrl.create({showCloseButton:!0,message:"Datos actualizados!",duration:3e3,position:"middle"});yield this.clienteService.modificarCliente(this.cliente).then(u=>{l.dismiss(),n.present(),console.log(u)})}))}validateEmailNotTaken(l){return this.usuarioService.getVerificaEmail(l.value).then(l=>l?{emailTaken:!0}:null)}cargarTablas(){return o.b(this,void 0,void 0,(function*(){this.tipoDocumentoIdentidad=[],yield this.tablasService.getTabla("TipoDocumentoIdentidad").subscribe(l=>{this.tipoDocumentoIdentidad=l.tablas})}))}choosePais(){return o.b(this,void 0,void 0,(function*(){const l=yield this.modalCtrl.create({component:c.a,componentProps:{}});yield l.present();const{data:n}=yield l.onDidDismiss();n.seleccionado&&(this.cliente.paisDeOrigen=n.pais)}))}}class p{}var m=u("pMnS"),f=u("oBZk"),C=u("TSSN"),h=u("SVse"),B=u("2m4Y"),O=e.Ab({encapsulation:0,styles:[["[_nghost-%COMP%]   ion-content[_ngcontent-%COMP%]{--background:linear-gradient(-135deg, var(--ion-color-medium), var(--ion-color-light))}.datospersonales[_ngcontent-%COMP%]   ion-item[_ngcontent-%COMP%]{--background:white;--color:black;--padding-start:10px}.datospersonales[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]{display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center;padding-left:10px}.datospersonales[_ngcontent-%COMP%]   .soyusuario[_ngcontent-%COMP%]{font-size:16px;font-weight:700}.datospersonales[_ngcontent-%COMP%]   .texto-informativo[_ngcontent-%COMP%]{margin-left:10px;font-size:.87em}.datospersonales[_ngcontent-%COMP%]   .texto-registrate[_ngcontent-%COMP%]{margin-left:10px;font-size:1em;font-weight:700}.datospersonales[_ngcontent-%COMP%]   .form-registro[_ngcontent-%COMP%]{background-color:#fff}.datospersonales[_ngcontent-%COMP%]   .flag_res[_ngcontent-%COMP%]{width:20px;padding:0;margin-right:10px}@media (min-width:700px){.datospersonales[_ngcontent-%COMP%]{margin:20px 300px}.datospersonales[_ngcontent-%COMP%]   .form-registro[_ngcontent-%COMP%]{padding:20px;border:dotted 1px var(--ion-color-primary)}}"]],data:{}});function v(l){return e.Yb(0,[(l()(),e.Cb(0,0,null,null,4,"p",[["class","text08"]],null,null,null,null,null)),(l()(),e.Cb(1,0,null,null,3,"ion-text",[["color","danger"]],null,null,null,f.Qb,f.T)),e.Bb(2,49152,null,0,i.Ab,[e.j,e.p,e.F],{color:[0,"color"]},null),(l()(),e.Wb(3,0,[" "," "])),e.Qb(131072,C.j,[C.k,e.j])],(function(l,n){l(n,2,0,"danger")}),(function(l,n){l(n,3,0,e.Xb(n,3,0,e.Ob(n,4).transform("app.label.errors.field")))}))}function j(l){return e.Yb(0,[(l()(),e.Cb(0,0,null,null,4,"p",[["class","text08"]],null,null,null,null,null)),(l()(),e.Cb(1,0,null,null,3,"ion-text",[["color","danger"]],null,null,null,f.Qb,f.T)),e.Bb(2,49152,null,0,i.Ab,[e.j,e.p,e.F],{color:[0,"color"]},null),(l()(),e.Wb(3,0,[" "," "])),e.Qb(131072,C.j,[C.k,e.j])],(function(l,n){l(n,2,0,"danger")}),(function(l,n){l(n,3,0,e.Xb(n,3,0,e.Ob(n,4).transform("app.label.errors.field")))}))}function F(l){return e.Yb(0,[(l()(),e.Cb(0,0,null,null,4,"p",[["class","text08"]],null,null,null,null,null)),(l()(),e.Cb(1,0,null,null,3,"ion-text",[["color","danger"]],null,null,null,f.Qb,f.T)),e.Bb(2,49152,null,0,i.Ab,[e.j,e.p,e.F],{color:[0,"color"]},null),(l()(),e.Wb(3,0,[" "," "])),e.Qb(131072,C.j,[C.k,e.j])],(function(l,n){l(n,2,0,"danger")}),(function(l,n){l(n,3,0,e.Xb(n,3,0,e.Ob(n,4).transform("app.label.errors.field")))}))}function x(l){return e.Yb(0,[(l()(),e.Cb(0,0,null,null,2,"span",[],null,null,null,null,null)),(l()(),e.Wb(1,null,[" ",""])),e.Qb(131072,C.j,[C.k,e.j])],null,(function(l,n){l(n,1,0,e.Xb(n,1,0,e.Ob(n,2).transform("app.label.errors.field")))}))}function y(l){return e.Yb(0,[(l()(),e.Cb(0,0,null,null,4,"p",[["class","text08"]],null,null,null,null,null)),(l()(),e.Cb(1,0,null,null,3,"ion-text",[["color","danger"]],null,null,null,f.Qb,f.T)),e.Bb(2,49152,null,0,i.Ab,[e.j,e.p,e.F],{color:[0,"color"]},null),(l()(),e.rb(16777216,null,0,1,null,x)),e.Bb(4,16384,null,0,h.k,[e.X,e.T],{ngIf:[0,"ngIf"]},null)],(function(l,n){var u=n.component;l(n,2,0,"danger"),l(n,4,0,u.onRegistroForm.get("email").hasError("required"))}),null)}function M(l){return e.Yb(0,[(l()(),e.Cb(0,0,null,null,1,"ion-img",[["class","flag_res"]],null,null,null,f.rb,f.u)),e.Bb(1,49152,null,0,i.G,[e.j,e.p,e.F],{src:[0,"src"]},null)],(function(l,n){l(n,1,0,e.Gb(1,"/assets/flags/4x3/",n.component.cliente.paisDeOrigen.valorUno,""))}),null)}function I(l){return e.Yb(0,[(l()(),e.Cb(0,0,null,null,4,"p",[["class","text08"]],null,null,null,null,null)),(l()(),e.Cb(1,0,null,null,3,"ion-text",[["color","danger"]],null,null,null,f.Qb,f.T)),e.Bb(2,49152,null,0,i.Ab,[e.j,e.p,e.F],{color:[0,"color"]},null),(l()(),e.Wb(3,0,[" "," "])),e.Qb(131072,C.j,[C.k,e.j])],(function(l,n){l(n,2,0,"danger")}),(function(l,n){l(n,3,0,e.Xb(n,3,0,e.Ob(n,4).transform("app.label.errors.field")))}))}function T(l){return e.Yb(0,[(l()(),e.Cb(0,0,null,null,4,"p",[["class","text08"]],null,null,null,null,null)),(l()(),e.Cb(1,0,null,null,3,"ion-text",[["color","danger"]],null,null,null,f.Qb,f.T)),e.Bb(2,49152,null,0,i.Ab,[e.j,e.p,e.F],{color:[0,"color"]},null),(l()(),e.Wb(3,0,[" "," "])),e.Qb(131072,C.j,[C.k,e.j])],(function(l,n){l(n,2,0,"danger")}),(function(l,n){l(n,3,0,e.Xb(n,3,0,e.Ob(n,4).transform("app.label.errors.field")))}))}function w(l){return e.Yb(0,[(l()(),e.Cb(0,0,null,null,4,"p",[["class","text08"]],null,null,null,null,null)),(l()(),e.Cb(1,0,null,null,3,"ion-text",[["color","danger"]],null,null,null,f.Qb,f.T)),e.Bb(2,49152,null,0,i.Ab,[e.j,e.p,e.F],{color:[0,"color"]},null),(l()(),e.Wb(3,0,[" "," "])),e.Qb(131072,C.j,[C.k,e.j])],(function(l,n){l(n,2,0,"danger")}),(function(l,n){l(n,3,0,e.Xb(n,3,0,e.Ob(n,4).transform("app.label.errors.field")))}))}function k(l){return e.Yb(0,[(l()(),e.Cb(0,0,null,null,2,"ion-select-option",[["style","font-size: 1em;"]],null,null,null,f.Ib,f.M)),e.Bb(1,49152,null,0,i.rb,[e.j,e.p,e.F],{value:[0,"value"]},null),(l()(),e.Wb(2,0,[" "," "]))],(function(l,n){l(n,1,0,n.context.$implicit._id)}),(function(l,n){l(n,2,0,n.context.$implicit.descripcion)}))}function D(l){return e.Yb(0,[(l()(),e.Cb(0,0,null,null,8,"ion-select",[["class","colorselect"],["color","primary"],["formControlName","tipoDocumentoIdentidad"],["interface","popover"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"],[null,"ionBlur"],[null,"ionChange"]],(function(l,n,u){var o=!0,i=l.component;return"ionBlur"===n&&(o=!1!==e.Ob(l,1)._handleBlurEvent(u.target)&&o),"ionChange"===n&&(o=!1!==e.Ob(l,1)._handleChangeEvent(u.target)&&o),"ngModelChange"===n&&(o=!1!==(i.cliente.tipoDocumentoIdentidad._id=u)&&o),o}),f.Jb,f.L)),e.Bb(1,16384,null,0,i.Tb,[e.p],null,null),e.Tb(1024,null,t.f,(function(l){return[l]}),[i.Tb]),e.Bb(3,671744,null,0,t.c,[[3,t.a],[8,null],[8,null],[6,t.f],[2,t.o]],{name:[0,"name"],model:[1,"model"]},{update:"ngModelChange"}),e.Tb(2048,null,t.g,null,[t.c]),e.Bb(5,16384,null,0,t.h,[[4,t.g]],null,null),e.Bb(6,49152,[["nacionalidadList",4]],0,i.qb,[e.j,e.p,e.F],{interface:[0,"interface"]},null),(l()(),e.rb(16777216,null,0,1,null,k)),e.Bb(8,278528,null,0,h.j,[e.X,e.T,e.x],{ngForOf:[0,"ngForOf"]},null)],(function(l,n){var u=n.component;l(n,3,0,"tipoDocumentoIdentidad",u.cliente.tipoDocumentoIdentidad._id),l(n,6,0,"popover"),l(n,8,0,u.tipoDocumentoIdentidad)}),(function(l,n){l(n,0,0,e.Ob(n,5).ngClassUntouched,e.Ob(n,5).ngClassTouched,e.Ob(n,5).ngClassPristine,e.Ob(n,5).ngClassDirty,e.Ob(n,5).ngClassValid,e.Ob(n,5).ngClassInvalid,e.Ob(n,5).ngClassPending)}))}function _(l){return e.Yb(0,[(l()(),e.Cb(0,0,null,null,4,"p",[["class","text08"]],null,null,null,null,null)),(l()(),e.Cb(1,0,null,null,3,"ion-text",[["color","danger"]],null,null,null,f.Qb,f.T)),e.Bb(2,49152,null,0,i.Ab,[e.j,e.p,e.F],{color:[0,"color"]},null),(l()(),e.Wb(3,0,[" "," "])),e.Qb(131072,C.j,[C.k,e.j])],(function(l,n){l(n,2,0,"danger")}),(function(l,n){l(n,3,0,e.Xb(n,3,0,e.Ob(n,4).transform("app.label.errors.field")))}))}function z(l){return e.Yb(0,[(l()(),e.Cb(0,0,null,null,4,"p",[["class","text08"]],null,null,null,null,null)),(l()(),e.Cb(1,0,null,null,3,"ion-text",[["color","danger"]],null,null,null,f.Qb,f.T)),e.Bb(2,49152,null,0,i.Ab,[e.j,e.p,e.F],{color:[0,"color"]},null),(l()(),e.Wb(3,0,[" "," "])),e.Qb(131072,C.j,[C.k,e.j])],(function(l,n){l(n,2,0,"danger")}),(function(l,n){l(n,3,0,e.Xb(n,3,0,e.Ob(n,4).transform("app.label.errors.field")))}))}function P(l){return e.Yb(0,[(l()(),e.Cb(0,0,null,null,215,"ion-content",[["class","profile"]],null,null,null,f.jb,f.m)),e.Bb(1,49152,null,0,i.x,[e.j,e.p,e.F],null,null),(l()(),e.Cb(2,0,null,0,213,"div",[["class","datospersonales"]],null,null,null,null,null)),(l()(),e.Cb(3,0,null,null,212,"ion-grid",[["class","center-grid "],["fixed",""]],null,null,null,f.ob,f.r)),e.Bb(4,49152,null,0,i.D,[e.j,e.p,e.F],{fixed:[0,"fixed"]},null),(l()(),e.Cb(5,0,null,0,199,"ion-row",[["class","ion-no-padding ion-no-margin"]],null,null,null,f.Gb,f.J)),e.Bb(6,49152,null,0,i.mb,[e.j,e.p,e.F],null,null),(l()(),e.Cb(7,0,null,0,197,"ion-col",[["class","ion-no-padding ion-no-margin ion-no-border ion-text-center br bb datetime-btn columna"],["size-md","12"],["size-xs","12"]],null,null,null,f.ib,f.l)),e.Bb(8,49152,null,0,i.w,[e.j,e.p,e.F],null,null),(l()(),e.Cb(9,0,null,0,195,"div",[["class","currencyFromBox form-registro"]],null,null,null,null,null)),(l()(),e.Cb(10,0,null,null,194,"ion-grid",[["fixed",""]],null,null,null,f.ob,f.r)),e.Bb(11,49152,null,0,i.D,[e.j,e.p,e.F],{fixed:[0,"fixed"]},null),(l()(),e.Cb(12,0,null,0,11,"ion-row",[["class","ion-no-padding "]],null,null,null,f.Gb,f.J)),e.Bb(13,49152,null,0,i.mb,[e.j,e.p,e.F],null,null),(l()(),e.Cb(14,0,null,0,9,"ion-col",[["class","ion-no-padding pt_10 ion-text-left"],["size","12"]],null,null,null,f.ib,f.l)),e.Bb(15,49152,null,0,i.w,[e.j,e.p,e.F],{size:[0,"size"]},null),(l()(),e.Cb(16,0,null,0,6,"div",[["class","title"],["color","var(--ion-color-dark)"]],null,null,null,null,null)),(l()(),e.Cb(17,0,null,null,3,"ion-label",[["class","f_p titulo-seccion-review"],["style","color: var(--ion-color-dark)"]],null,null,null,f.xb,f.A)),e.Bb(18,49152,null,0,i.Q,[e.j,e.p,e.F],null,null),(l()(),e.Wb(19,0,["",""])),e.Qb(131072,C.j,[C.k,e.j]),(l()(),e.Cb(21,0,null,null,1,"ion-icon",[["name","person"],["style","font-size: 2em; color:var(--ion-color-dark)"]],null,null,null,f.qb,f.t)),e.Bb(22,49152,null,0,i.F,[e.j,e.p,e.F],{name:[0,"name"]},null),(l()(),e.Cb(23,0,null,0,0,"br",[],null,null,null,null,null)),(l()(),e.Cb(24,0,null,0,180,"ion-row",[],null,null,null,f.Gb,f.J)),e.Bb(25,49152,null,0,i.mb,[e.j,e.p,e.F],null,null),(l()(),e.Cb(26,0,null,0,178,"ion-col",[["class","ion-text-left"],["size","12"]],null,null,null,f.ib,f.l)),e.Bb(27,49152,null,0,i.w,[e.j,e.p,e.F],{size:[0,"size"]},null),(l()(),e.Cb(28,0,null,0,176,"form",[["class","list-form"],["novalidate",""]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"submit"],[null,"reset"]],(function(l,n,u){var o=!0;return"submit"===n&&(o=!1!==e.Ob(l,30).onSubmit(u)&&o),"reset"===n&&(o=!1!==e.Ob(l,30).onReset()&&o),o}),null,null)),e.Bb(29,16384,null,0,t.p,[],null,null),e.Bb(30,540672,[["fRegistro",4]],0,t.d,[[8,null],[8,null]],{form:[0,"form"]},null),e.Tb(2048,null,t.a,null,[t.d]),e.Bb(32,16384,null,0,t.i,[[4,t.a]],null,null),(l()(),e.Cb(33,0,null,null,171,"ion-grid",[["fixed",""]],null,null,null,f.ob,f.r)),e.Bb(34,49152,null,0,i.D,[e.j,e.p,e.F],{fixed:[0,"fixed"]},null),(l()(),e.Cb(35,0,null,0,35,"ion-row",[],null,null,null,f.Gb,f.J)),e.Bb(36,49152,null,0,i.mb,[e.j,e.p,e.F],null,null),(l()(),e.Cb(37,0,null,0,16,"ion-col",[["size-md","6"],["size-xs","12"]],null,null,null,f.ib,f.l)),e.Bb(38,49152,null,0,i.w,[e.j,e.p,e.F],null,null),(l()(),e.Cb(39,0,null,0,14,"ion-item",[["class","ion-no-padding animated fadeInUp"]],null,null,null,f.wb,f.w)),e.Bb(40,49152,null,0,i.K,[e.j,e.p,e.F],null,null),(l()(),e.Cb(41,0,null,0,3,"ion-label",[["color","tertiary"],["position","floating"]],null,null,null,f.xb,f.A)),e.Bb(42,49152,null,0,i.Q,[e.j,e.p,e.F],{color:[0,"color"],position:[1,"position"]},null),(l()(),e.Wb(43,0,[" "," "])),e.Qb(131072,C.j,[C.k,e.j]),(l()(),e.Cb(45,0,null,0,6,"ion-input",[["formControlName","nombre"],["type","text"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"],[null,"ionBlur"],[null,"ionChange"]],(function(l,n,u){var o=!0,i=l.component;return"ionBlur"===n&&(o=!1!==e.Ob(l,46)._handleBlurEvent(u.target)&&o),"ionChange"===n&&(o=!1!==e.Ob(l,46)._handleInputEvent(u.target)&&o),"ngModelChange"===n&&(o=!1!==(i.cliente.nombre=u)&&o),o}),f.sb,f.v)),e.Bb(46,16384,null,0,i.Ub,[e.p],null,null),e.Tb(1024,null,t.f,(function(l){return[l]}),[i.Ub]),e.Bb(48,671744,null,0,t.c,[[3,t.a],[8,null],[8,null],[6,t.f],[2,t.o]],{name:[0,"name"],model:[1,"model"]},{update:"ngModelChange"}),e.Tb(2048,null,t.g,null,[t.c]),e.Bb(50,16384,null,0,t.h,[[4,t.g]],null,null),e.Bb(51,49152,null,0,i.J,[e.j,e.p,e.F],{type:[0,"type"]},null),(l()(),e.rb(16777216,null,0,1,null,v)),e.Bb(53,16384,null,0,h.k,[e.X,e.T],{ngIf:[0,"ngIf"]},null),(l()(),e.Cb(54,0,null,0,16,"ion-col",[["size-md","6"],["size-xs","12"]],null,null,null,f.ib,f.l)),e.Bb(55,49152,null,0,i.w,[e.j,e.p,e.F],null,null),(l()(),e.Cb(56,0,null,0,14,"ion-item",[["class","ion-no-padding animated fadeInUp"]],null,null,null,f.wb,f.w)),e.Bb(57,49152,null,0,i.K,[e.j,e.p,e.F],null,null),(l()(),e.Cb(58,0,null,0,3,"ion-label",[["color","tertiary"],["position","floating"]],null,null,null,f.xb,f.A)),e.Bb(59,49152,null,0,i.Q,[e.j,e.p,e.F],{color:[0,"color"],position:[1,"position"]},null),(l()(),e.Wb(60,0,[" "," "])),e.Qb(131072,C.j,[C.k,e.j]),(l()(),e.Cb(62,0,null,0,6,"ion-input",[["formControlName","primerApellido"],["type","text"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"],[null,"ionBlur"],[null,"ionChange"]],(function(l,n,u){var o=!0,i=l.component;return"ionBlur"===n&&(o=!1!==e.Ob(l,63)._handleBlurEvent(u.target)&&o),"ionChange"===n&&(o=!1!==e.Ob(l,63)._handleInputEvent(u.target)&&o),"ngModelChange"===n&&(o=!1!==(i.cliente.primerApellido=u)&&o),o}),f.sb,f.v)),e.Bb(63,16384,null,0,i.Ub,[e.p],null,null),e.Tb(1024,null,t.f,(function(l){return[l]}),[i.Ub]),e.Bb(65,671744,null,0,t.c,[[3,t.a],[8,null],[8,null],[6,t.f],[2,t.o]],{name:[0,"name"],model:[1,"model"]},{update:"ngModelChange"}),e.Tb(2048,null,t.g,null,[t.c]),e.Bb(67,16384,null,0,t.h,[[4,t.g]],null,null),e.Bb(68,49152,null,0,i.J,[e.j,e.p,e.F],{type:[0,"type"]},null),(l()(),e.rb(16777216,null,0,1,null,j)),e.Bb(70,16384,null,0,h.k,[e.X,e.T],{ngIf:[0,"ngIf"]},null),(l()(),e.Cb(71,0,null,0,37,"ion-row",[],null,null,null,f.Gb,f.J)),e.Bb(72,49152,null,0,i.mb,[e.j,e.p,e.F],null,null),(l()(),e.Cb(73,0,null,0,16,"ion-col",[["size-md","6"],["size-xs","12"]],null,null,null,f.ib,f.l)),e.Bb(74,49152,null,0,i.w,[e.j,e.p,e.F],null,null),(l()(),e.Cb(75,0,null,0,14,"ion-item",[["class","ion-no-padding animated fadeInUp"]],null,null,null,f.wb,f.w)),e.Bb(76,49152,null,0,i.K,[e.j,e.p,e.F],null,null),(l()(),e.Cb(77,0,null,0,3,"ion-label",[["color","tertiary"],["position","floating"]],null,null,null,f.xb,f.A)),e.Bb(78,49152,null,0,i.Q,[e.j,e.p,e.F],{color:[0,"color"],position:[1,"position"]},null),(l()(),e.Wb(79,0,[" "," "])),e.Qb(131072,C.j,[C.k,e.j]),(l()(),e.Cb(81,0,null,0,6,"ion-input",[["formControlName","segundoApellido"],["type","text"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"],[null,"ionBlur"],[null,"ionChange"]],(function(l,n,u){var o=!0,i=l.component;return"ionBlur"===n&&(o=!1!==e.Ob(l,82)._handleBlurEvent(u.target)&&o),"ionChange"===n&&(o=!1!==e.Ob(l,82)._handleInputEvent(u.target)&&o),"ngModelChange"===n&&(o=!1!==(i.cliente.segundoApellido=u)&&o),o}),f.sb,f.v)),e.Bb(82,16384,null,0,i.Ub,[e.p],null,null),e.Tb(1024,null,t.f,(function(l){return[l]}),[i.Ub]),e.Bb(84,671744,null,0,t.c,[[3,t.a],[8,null],[8,null],[6,t.f],[2,t.o]],{name:[0,"name"],model:[1,"model"]},{update:"ngModelChange"}),e.Tb(2048,null,t.g,null,[t.c]),e.Bb(86,16384,null,0,t.h,[[4,t.g]],null,null),e.Bb(87,49152,null,0,i.J,[e.j,e.p,e.F],{type:[0,"type"]},null),(l()(),e.rb(16777216,null,0,1,null,F)),e.Bb(89,16384,null,0,h.k,[e.X,e.T],{ngIf:[0,"ngIf"]},null),(l()(),e.Cb(90,0,null,0,18,"ion-col",[["size-md","6"],["size-xs","12"]],null,null,null,f.ib,f.l)),e.Bb(91,49152,null,0,i.w,[e.j,e.p,e.F],null,null),(l()(),e.Cb(92,0,null,0,16,"ion-item",[["class","ion-no-padding animated fadeInUp"]],null,null,null,f.wb,f.w)),e.Bb(93,49152,null,0,i.K,[e.j,e.p,e.F],null,null),(l()(),e.Cb(94,0,null,0,5,"ion-label",[["color","tertiary"],["position","floating"]],null,null,null,f.xb,f.A)),e.Bb(95,49152,null,0,i.Q,[e.j,e.p,e.F],{color:[0,"color"],position:[1,"position"]},null),(l()(),e.Cb(96,0,null,0,1,"ion-icon",[["item-start",""],["name","mail"]],null,null,null,f.qb,f.t)),e.Bb(97,49152,null,0,i.F,[e.j,e.p,e.F],{name:[0,"name"]},null),(l()(),e.Wb(98,0,[" "," "])),e.Qb(131072,C.j,[C.k,e.j]),(l()(),e.Cb(100,0,null,0,6,"ion-input",[["formControlName","email"],["type","email"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"],[null,"ionBlur"],[null,"ionChange"]],(function(l,n,u){var o=!0,i=l.component;return"ionBlur"===n&&(o=!1!==e.Ob(l,101)._handleBlurEvent(u.target)&&o),"ionChange"===n&&(o=!1!==e.Ob(l,101)._handleInputEvent(u.target)&&o),"ngModelChange"===n&&(o=!1!==(i.cliente.email=u)&&o),o}),f.sb,f.v)),e.Bb(101,16384,null,0,i.Ub,[e.p],null,null),e.Tb(1024,null,t.f,(function(l){return[l]}),[i.Ub]),e.Bb(103,671744,null,0,t.c,[[3,t.a],[8,null],[8,null],[6,t.f],[2,t.o]],{name:[0,"name"],model:[1,"model"]},{update:"ngModelChange"}),e.Tb(2048,null,t.g,null,[t.c]),e.Bb(105,16384,null,0,t.h,[[4,t.g]],null,null),e.Bb(106,49152,null,0,i.J,[e.j,e.p,e.F],{type:[0,"type"]},null),(l()(),e.rb(16777216,null,0,1,null,y)),e.Bb(108,16384,null,0,h.k,[e.X,e.T],{ngIf:[0,"ngIf"]},null),(l()(),e.Cb(109,0,null,0,41,"ion-row",[],null,null,null,f.Gb,f.J)),e.Bb(110,49152,null,0,i.mb,[e.j,e.p,e.F],null,null),(l()(),e.Cb(111,0,null,0,20,"ion-col",[["size-md","6"],["size-xs","12"]],null,null,null,f.ib,f.l)),e.Bb(112,49152,null,0,i.w,[e.j,e.p,e.F],null,null),(l()(),e.Cb(113,0,null,0,18,"ion-item",[["class","ion-no-padding"],["tappable",""]],null,[[null,"click"]],(function(l,n,u){var e=!0;return"click"===n&&(e=!1!==l.component.choosePais()&&e),e}),f.wb,f.w)),e.Bb(114,49152,null,0,i.K,[e.j,e.p,e.F],null,null),(l()(),e.Cb(115,0,null,0,5,"ion-label",[["color","tertiary"],["position","floating"]],null,null,null,f.xb,f.A)),e.Bb(116,49152,null,0,i.Q,[e.j,e.p,e.F],{color:[0,"color"],position:[1,"position"]},null),(l()(),e.Cb(117,0,null,0,1,"ion-icon",[["item-start",""],["name","flag"]],null,null,null,f.qb,f.t)),e.Bb(118,49152,null,0,i.F,[e.j,e.p,e.F],{name:[0,"name"]},null),(l()(),e.Wb(119,0,[" "," "])),e.Qb(131072,C.j,[C.k,e.j]),(l()(),e.Cb(121,0,null,0,8,"ion-input",[["formControlName","paisDeOrigen"],["readOnly",""],["type","text"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ionBlur"],[null,"ionChange"]],(function(l,n,u){var o=!0;return"ionBlur"===n&&(o=!1!==e.Ob(l,122)._handleBlurEvent(u.target)&&o),"ionChange"===n&&(o=!1!==e.Ob(l,122)._handleInputEvent(u.target)&&o),o}),f.sb,f.v)),e.Bb(122,16384,null,0,i.Ub,[e.p],null,null),e.Tb(1024,null,t.f,(function(l){return[l]}),[i.Ub]),e.Bb(124,671744,null,0,t.c,[[3,t.a],[8,null],[8,null],[6,t.f],[2,t.o]],{name:[0,"name"]},null),e.Tb(2048,null,t.g,null,[t.c]),e.Bb(126,16384,null,0,t.h,[[4,t.g]],null,null),e.Bb(127,49152,null,0,i.J,[e.j,e.p,e.F],{type:[0,"type"],value:[1,"value"]},null),(l()(),e.rb(16777216,null,0,1,null,M)),e.Bb(129,16384,null,0,h.k,[e.X,e.T],{ngIf:[0,"ngIf"]},null),(l()(),e.rb(16777216,null,0,1,null,I)),e.Bb(131,16384,null,0,h.k,[e.X,e.T],{ngIf:[0,"ngIf"]},null),(l()(),e.Cb(132,0,null,0,18,"ion-col",[["size-md","6"],["size-xs","12"]],null,null,null,f.ib,f.l)),e.Bb(133,49152,null,0,i.w,[e.j,e.p,e.F],null,null),(l()(),e.Cb(134,0,null,0,16,"ion-item",[["class","ion-no-padding animated fadeInUp"]],null,null,null,f.wb,f.w)),e.Bb(135,49152,null,0,i.K,[e.j,e.p,e.F],null,null),(l()(),e.Cb(136,0,null,0,5,"ion-label",[["color","tertiary"],["position","floating"]],null,null,null,f.xb,f.A)),e.Bb(137,49152,null,0,i.Q,[e.j,e.p,e.F],{color:[0,"color"],position:[1,"position"]},null),(l()(),e.Cb(138,0,null,0,1,"ion-icon",[["item-start",""],["name","call"]],null,null,null,f.qb,f.t)),e.Bb(139,49152,null,0,i.F,[e.j,e.p,e.F],{name:[0,"name"]},null),(l()(),e.Wb(140,0,[" "," "])),e.Qb(131072,C.j,[C.k,e.j]),(l()(),e.Cb(142,0,null,0,6,"ion-input",[["formControlName","telefono"],["type","number"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"],[null,"ionBlur"],[null,"ionChange"]],(function(l,n,u){var o=!0,i=l.component;return"ionBlur"===n&&(o=!1!==e.Ob(l,143)._handleBlurEvent(u.target)&&o),"ionChange"===n&&(o=!1!==e.Ob(l,143)._handleIonChange(u.target)&&o),"ngModelChange"===n&&(o=!1!==(i.cliente.telefono=u)&&o),o}),f.sb,f.v)),e.Bb(143,16384,null,0,i.Ob,[e.p],null,null),e.Tb(1024,null,t.f,(function(l){return[l]}),[i.Ob]),e.Bb(145,671744,null,0,t.c,[[3,t.a],[8,null],[8,null],[6,t.f],[2,t.o]],{name:[0,"name"],model:[1,"model"]},{update:"ngModelChange"}),e.Tb(2048,null,t.g,null,[t.c]),e.Bb(147,16384,null,0,t.h,[[4,t.g]],null,null),e.Bb(148,49152,null,0,i.J,[e.j,e.p,e.F],{type:[0,"type"]},null),(l()(),e.rb(16777216,null,0,1,null,T)),e.Bb(150,16384,null,0,h.k,[e.X,e.T],{ngIf:[0,"ngIf"]},null),(l()(),e.Cb(151,0,null,0,22,"ion-row",[],null,null,null,f.Gb,f.J)),e.Bb(152,49152,null,0,i.mb,[e.j,e.p,e.F],null,null),(l()(),e.Cb(153,0,null,0,18,"ion-col",[["size-md","6"],["size-xs","12"]],null,null,null,f.ib,f.l)),e.Bb(154,49152,null,0,i.w,[e.j,e.p,e.F],null,null),(l()(),e.Cb(155,0,null,0,16,"ion-item",[["class","ion-no-padding animated fadeInUp"]],null,null,null,f.wb,f.w)),e.Bb(156,49152,null,0,i.K,[e.j,e.p,e.F],null,null),(l()(),e.Cb(157,0,null,0,5,"ion-label",[["color","tertiary"],["position","floating"]],null,null,null,f.xb,f.A)),e.Bb(158,49152,null,0,i.Q,[e.j,e.p,e.F],{color:[0,"color"],position:[1,"position"]},null),(l()(),e.Cb(159,0,null,0,1,"ion-icon",[["item-start",""],["name","calendar"]],null,null,null,f.qb,f.t)),e.Bb(160,49152,null,0,i.F,[e.j,e.p,e.F],{name:[0,"name"]},null),(l()(),e.Wb(161,0,[" "," "])),e.Qb(131072,C.j,[C.k,e.j]),(l()(),e.Cb(163,0,null,0,6,"ion-datetime",[["displayFormat","DD/MM/YYYY"],["formControlName","fechaNacimiento"],["min","1950"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"],[null,"ionBlur"],[null,"ionChange"]],(function(l,n,u){var o=!0,i=l.component;return"ionBlur"===n&&(o=!1!==e.Ob(l,164)._handleBlurEvent(u.target)&&o),"ionChange"===n&&(o=!1!==e.Ob(l,164)._handleChangeEvent(u.target)&&o),"ngModelChange"===n&&(o=!1!==(i.cliente.fechaNacimiento=u)&&o),o}),f.kb,f.n)),e.Bb(164,16384,null,0,i.Tb,[e.p],null,null),e.Tb(1024,null,t.f,(function(l){return[l]}),[i.Tb]),e.Bb(166,671744,null,0,t.c,[[3,t.a],[8,null],[8,null],[6,t.f],[2,t.o]],{name:[0,"name"],model:[1,"model"]},{update:"ngModelChange"}),e.Tb(2048,null,t.g,null,[t.c]),e.Bb(168,16384,null,0,t.h,[[4,t.g]],null,null),e.Bb(169,49152,null,0,i.y,[e.j,e.p,e.F],{displayFormat:[0,"displayFormat"],min:[1,"min"]},null),(l()(),e.rb(16777216,null,0,1,null,w)),e.Bb(171,16384,null,0,h.k,[e.X,e.T],{ngIf:[0,"ngIf"]},null),(l()(),e.Cb(172,0,null,0,1,"ion-col",[["size-md","6"],["size-xs","12"]],null,null,null,f.ib,f.l)),e.Bb(173,49152,null,0,i.w,[e.j,e.p,e.F],null,null),(l()(),e.Cb(174,0,null,0,30,"ion-row",[],null,null,null,f.Gb,f.J)),e.Bb(175,49152,null,0,i.mb,[e.j,e.p,e.F],null,null),(l()(),e.Cb(176,0,null,0,11,"ion-col",[["size-md","6"],["size-xs","12"]],null,null,null,f.ib,f.l)),e.Bb(177,49152,null,0,i.w,[e.j,e.p,e.F],null,null),(l()(),e.Cb(178,0,null,0,9,"ion-item",[],null,null,null,f.wb,f.w)),e.Bb(179,49152,null,0,i.K,[e.j,e.p,e.F],null,null),(l()(),e.Cb(180,0,null,0,3,"ion-label",[["color","tertiary"],["position","floating"]],null,null,null,f.xb,f.A)),e.Bb(181,49152,null,0,i.Q,[e.j,e.p,e.F],{color:[0,"color"],position:[1,"position"]},null),(l()(),e.Wb(182,0,[" "," "])),e.Qb(131072,C.j,[C.k,e.j]),(l()(),e.rb(16777216,null,0,1,null,D)),e.Bb(185,16384,null,0,h.k,[e.X,e.T],{ngIf:[0,"ngIf"]},null),(l()(),e.rb(16777216,null,0,1,null,_)),e.Bb(187,16384,null,0,h.k,[e.X,e.T],{ngIf:[0,"ngIf"]},null),(l()(),e.Cb(188,0,null,0,16,"ion-col",[["size-md","6"],["size-xs","12"]],null,null,null,f.ib,f.l)),e.Bb(189,49152,null,0,i.w,[e.j,e.p,e.F],null,null),(l()(),e.Cb(190,0,null,0,14,"ion-item",[["class","ion-no-padding animated fadeInUp"]],null,null,null,f.wb,f.w)),e.Bb(191,49152,null,0,i.K,[e.j,e.p,e.F],null,null),(l()(),e.Cb(192,0,null,0,3,"ion-label",[["color","tertiary"],["position","floating"]],null,null,null,f.xb,f.A)),e.Bb(193,49152,null,0,i.Q,[e.j,e.p,e.F],{color:[0,"color"],position:[1,"position"]},null),(l()(),e.Wb(194,0,[" "," "])),e.Qb(131072,C.j,[C.k,e.j]),(l()(),e.Cb(196,0,null,0,6,"ion-input",[["formControlName","numeroDocumentoIdentidad"],["type","text"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"],[null,"ionBlur"],[null,"ionChange"]],(function(l,n,u){var o=!0,i=l.component;return"ionBlur"===n&&(o=!1!==e.Ob(l,197)._handleBlurEvent(u.target)&&o),"ionChange"===n&&(o=!1!==e.Ob(l,197)._handleInputEvent(u.target)&&o),"ngModelChange"===n&&(o=!1!==(i.cliente.numeroDocumentoIdentidad=u)&&o),o}),f.sb,f.v)),e.Bb(197,16384,null,0,i.Ub,[e.p],null,null),e.Tb(1024,null,t.f,(function(l){return[l]}),[i.Ub]),e.Bb(199,671744,null,0,t.c,[[3,t.a],[8,null],[8,null],[6,t.f],[2,t.o]],{name:[0,"name"],model:[1,"model"]},{update:"ngModelChange"}),e.Tb(2048,null,t.g,null,[t.c]),e.Bb(201,16384,null,0,t.h,[[4,t.g]],null,null),e.Bb(202,49152,null,0,i.J,[e.j,e.p,e.F],{type:[0,"type"]},null),(l()(),e.rb(16777216,null,0,1,null,z)),e.Bb(204,16384,null,0,h.k,[e.X,e.T],{ngIf:[0,"ngIf"]},null),(l()(),e.Cb(205,0,null,0,10,"ion-row",[],null,null,null,f.Gb,f.J)),e.Bb(206,49152,null,0,i.mb,[e.j,e.p,e.F],null,null),(l()(),e.Cb(207,0,null,0,8,"ion-col",[["size","12"],["style","height: 80px;"]],null,null,null,f.ib,f.l)),e.Bb(208,49152,null,0,i.w,[e.j,e.p,e.F],{size:[0,"size"]},null),(l()(),e.Cb(209,0,null,0,6,"ion-button",[["color","primary"],["expand","block"],["icon-left",""],["size","large"]],null,[[null,"click"]],(function(l,n,u){var e=!0;return"click"===n&&(e=!1!==l.component.actualizar()&&e),e}),f.bb,f.e)),e.Bb(210,49152,null,0,i.n,[e.j,e.p,e.F],{color:[0,"color"],disabled:[1,"disabled"],expand:[2,"expand"],size:[3,"size"]},null),(l()(),e.Cb(211,0,null,0,1,"ion-ripple-effect",[],null,null,null,f.Fb,f.I)),e.Bb(212,49152,null,0,i.kb,[e.j,e.p,e.F],null,null),(l()(),e.Cb(213,0,null,0,2,"ion-label",[["color","light"]],null,null,null,f.xb,f.A)),e.Bb(214,49152,null,0,i.Q,[e.j,e.p,e.F],{color:[0,"color"]},null),(l()(),e.Wb(-1,0,["actualizar"]))],(function(l,n){var u=n.component;l(n,4,0,""),l(n,11,0,""),l(n,15,0,"12"),l(n,22,0,"person"),l(n,27,0,"12"),l(n,30,0,u.onRegistroForm),l(n,34,0,""),l(n,42,0,"tertiary","floating"),l(n,48,0,"nombre",u.cliente.nombre),l(n,51,0,"text"),l(n,53,0,u.onRegistroForm.get("nombre").touched&&u.onRegistroForm.get("nombre").hasError("required")),l(n,59,0,"tertiary","floating"),l(n,65,0,"primerApellido",u.cliente.primerApellido),l(n,68,0,"text"),l(n,70,0,u.onRegistroForm.get("primerApellido").touched&&u.onRegistroForm.get("primerApellido").hasError("required")),l(n,78,0,"tertiary","floating"),l(n,84,0,"segundoApellido",u.cliente.segundoApellido),l(n,87,0,"text"),l(n,89,0,u.onRegistroForm.get("segundoApellido").touched&&u.onRegistroForm.get("segundoApellido").hasError("required")),l(n,95,0,"tertiary","floating"),l(n,97,0,"mail"),l(n,103,0,"email",u.cliente.email),l(n,106,0,"email"),l(n,108,0,u.onRegistroForm.get("email").touched&&u.onRegistroForm.get("email").hasError("required")),l(n,116,0,"tertiary","floating"),l(n,118,0,"flag"),l(n,124,0,"paisDeOrigen"),l(n,127,0,"text",e.Gb(1,"",u.cliente.paisDeOrigen.descripcion,"")),l(n,129,0,u.cliente.paisDeOrigen.descripcion),l(n,131,0,u.onRegistroForm.get("paisDeOrigen").touched&&u.onRegistroForm.get("paisDeOrigen").hasError("required")),l(n,137,0,"tertiary","floating"),l(n,139,0,"call"),l(n,145,0,"telefono",u.cliente.telefono),l(n,148,0,"number"),l(n,150,0,u.onRegistroForm.get("telefono").touched&&u.onRegistroForm.get("telefono").hasError("required")),l(n,158,0,"tertiary","floating"),l(n,160,0,"calendar"),l(n,166,0,"fechaNacimiento",u.cliente.fechaNacimiento),l(n,169,0,"DD/MM/YYYY","1950"),l(n,171,0,u.onRegistroForm.get("fechaNacimiento").touched&&u.onRegistroForm.get("fechaNacimiento").hasError("required")),l(n,181,0,"tertiary","floating"),l(n,185,0,u.showSelects),l(n,187,0,u.onRegistroForm.get("tipoDocumentoIdentidad").touched&&u.onRegistroForm.get("tipoDocumentoIdentidad").hasError("required")),l(n,193,0,"tertiary","floating"),l(n,199,0,"numeroDocumentoIdentidad",u.cliente.numeroDocumentoIdentidad),l(n,202,0,"text"),l(n,204,0,u.onRegistroForm.get("numeroDocumentoIdentidad").touched&&u.onRegistroForm.get("numeroDocumentoIdentidad").hasError("required")),l(n,208,0,"12"),l(n,210,0,"primary",!u.onRegistroForm.valid,"block","large"),l(n,214,0,"light")}),(function(l,n){l(n,19,0,e.Xb(n,19,0,e.Ob(n,20).transform("app.pages.transaction.label.datos"))),l(n,28,0,e.Ob(n,32).ngClassUntouched,e.Ob(n,32).ngClassTouched,e.Ob(n,32).ngClassPristine,e.Ob(n,32).ngClassDirty,e.Ob(n,32).ngClassValid,e.Ob(n,32).ngClassInvalid,e.Ob(n,32).ngClassPending),l(n,43,0,e.Xb(n,43,0,e.Ob(n,44).transform("app.label.name"))),l(n,45,0,e.Ob(n,50).ngClassUntouched,e.Ob(n,50).ngClassTouched,e.Ob(n,50).ngClassPristine,e.Ob(n,50).ngClassDirty,e.Ob(n,50).ngClassValid,e.Ob(n,50).ngClassInvalid,e.Ob(n,50).ngClassPending),l(n,60,0,e.Xb(n,60,0,e.Ob(n,61).transform("app.label.primerapellido"))),l(n,62,0,e.Ob(n,67).ngClassUntouched,e.Ob(n,67).ngClassTouched,e.Ob(n,67).ngClassPristine,e.Ob(n,67).ngClassDirty,e.Ob(n,67).ngClassValid,e.Ob(n,67).ngClassInvalid,e.Ob(n,67).ngClassPending),l(n,79,0,e.Xb(n,79,0,e.Ob(n,80).transform("app.label.segundoapellido"))),l(n,81,0,e.Ob(n,86).ngClassUntouched,e.Ob(n,86).ngClassTouched,e.Ob(n,86).ngClassPristine,e.Ob(n,86).ngClassDirty,e.Ob(n,86).ngClassValid,e.Ob(n,86).ngClassInvalid,e.Ob(n,86).ngClassPending),l(n,98,0,e.Xb(n,98,0,e.Ob(n,99).transform("app.label.email"))),l(n,100,0,e.Ob(n,105).ngClassUntouched,e.Ob(n,105).ngClassTouched,e.Ob(n,105).ngClassPristine,e.Ob(n,105).ngClassDirty,e.Ob(n,105).ngClassValid,e.Ob(n,105).ngClassInvalid,e.Ob(n,105).ngClassPending),l(n,119,0,e.Xb(n,119,0,e.Ob(n,120).transform("app.label.nacionalidad"))),l(n,121,0,e.Ob(n,126).ngClassUntouched,e.Ob(n,126).ngClassTouched,e.Ob(n,126).ngClassPristine,e.Ob(n,126).ngClassDirty,e.Ob(n,126).ngClassValid,e.Ob(n,126).ngClassInvalid,e.Ob(n,126).ngClassPending),l(n,140,0,e.Xb(n,140,0,e.Ob(n,141).transform("app.label.phone"))),l(n,142,0,e.Ob(n,147).ngClassUntouched,e.Ob(n,147).ngClassTouched,e.Ob(n,147).ngClassPristine,e.Ob(n,147).ngClassDirty,e.Ob(n,147).ngClassValid,e.Ob(n,147).ngClassInvalid,e.Ob(n,147).ngClassPending),l(n,161,0,e.Xb(n,161,0,e.Ob(n,162).transform("app.label.datebirth"))),l(n,163,0,e.Ob(n,168).ngClassUntouched,e.Ob(n,168).ngClassTouched,e.Ob(n,168).ngClassPristine,e.Ob(n,168).ngClassDirty,e.Ob(n,168).ngClassValid,e.Ob(n,168).ngClassInvalid,e.Ob(n,168).ngClassPending),l(n,182,0,e.Xb(n,182,0,e.Ob(n,183).transform("app.pages.transaction.label.tipodocumento"))),l(n,194,0,e.Xb(n,194,0,e.Ob(n,195).transform("app.pages.transaction.label.numerodocumento"))),l(n,196,0,e.Ob(n,201).ngClassUntouched,e.Ob(n,201).ngClassTouched,e.Ob(n,201).ngClassPristine,e.Ob(n,201).ngClassDirty,e.Ob(n,201).ngClassValid,e.Ob(n,201).ngClassInvalid,e.Ob(n,201).ngClassPending)}))}function Q(l){return e.Yb(0,[(l()(),e.Cb(0,0,null,null,1,"app-edit-person",[],null,null,null,P,O)),e.Bb(1,4308992,null,0,g,[i.Mb,i.Lb,i.Jb,i.Vb,B.a,t.b,a.a,r.a,b.a,s.a,d.a],null,null)],(function(l,n){l(n,1,0)}),null)}var A=e.yb("app-edit-person",g,Q,{},{},[]),U=u("iInd");u.d(n,"EditPersonPageModuleNgFactory",(function(){return X}));var X=e.zb(p,[],(function(l){return e.Lb([e.Mb(512,e.m,e.kb,[[8,[m.a,A]],[3,e.m],e.D]),e.Mb(4608,h.m,h.l,[e.z,[2,h.x]]),e.Mb(4608,t.n,t.n,[]),e.Mb(4608,t.b,t.b,[]),e.Mb(4608,i.c,i.c,[e.F,e.g]),e.Mb(4608,i.Lb,i.Lb,[i.c,e.m,e.w]),e.Mb(4608,i.Qb,i.Qb,[i.c,e.m,e.w]),e.Mb(4608,C.g,C.f,[]),e.Mb(4608,C.c,C.e,[]),e.Mb(4608,C.i,C.d,[]),e.Mb(4608,C.b,C.a,[]),e.Mb(4608,C.k,C.k,[C.l,C.g,C.c,C.i,C.b,C.m,C.n]),e.Mb(1073742336,h.b,h.b,[]),e.Mb(1073742336,t.m,t.m,[]),e.Mb(1073742336,t.e,t.e,[]),e.Mb(1073742336,t.k,t.k,[]),e.Mb(1073742336,i.Hb,i.Hb,[]),e.Mb(1073742336,C.h,C.h,[]),e.Mb(1073742336,U.o,U.o,[[2,U.t],[2,U.m]]),e.Mb(1073742336,p,p,[]),e.Mb(256,C.n,void 0,[]),e.Mb(256,C.m,void 0,[]),e.Mb(1024,U.k,(function(){return[[{path:"",component:g}]]}),[])])}))}}]);