(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{"bY/x":function(n,l,e){"use strict";e.r(l);var t=e("8Y7J"),o=e("mrSG"),i=e("ZZ/e"),u=(e("Q1LM"),e("Qdzf")),a=e("2P1p"),r=e("cEat"),c=e("HgbJ"),s=e("UuUh"),b=e("ILhL"),d=e("TzRf");class g{constructor(n,l,e,t,o,i,u,a,r,c,s,b){this.navCtrl=n,this.loadingCtrl=l,this.toastCtrl=e,this.translate=t,this.formBuilder=o,this.usuarioService=i,this.clienteService=u,this.empresaService=a,this.cuentaBancariaService=r,this.tablasService=c,this.modalCtrl=s,this.events=b,this.showSelects=!0,this.cuentasBancarias=[],this.empresasCliente=[]}ngOnInit(){}ngAfterViewInit(){return o.b(this,void 0,void 0,(function*(){this.cargarTablas(),this.inicializa()}))}inicializa(){return o.b(this,void 0,void 0,(function*(){this.obtieneUsuario()}))}obtieneUsuario(){return o.b(this,void 0,void 0,(function*(){yield this.usuarioService.getUsuario(!1).then(n=>{this.usuario=n,0!==Object.entries(this.usuario).length&&this.obtieneCliente()})}))}obtieneCliente(){return o.b(this,void 0,void 0,(function*(){yield this.clienteService.getClienteUsuario(this.usuario._id).subscribe(n=>{this.cliente=n.cliente[0],this.cargarEmpresasCliente().then(n=>{this.obtieneCuentas().then(n=>{this.empresa="-"})})})}))}obtieneCuentas(){return o.b(this,void 0,void 0,(function*(){"-"===this.empresa?yield this.cuentaBancariaService.getCuentaBancariaCliente().subscribe(n=>{this.cuentasBancarias=n.cuentasBancarias}):yield this.cuentaBancariaService.getCuentaBancariaClienteEmpresa(this.empresa).subscribe(n=>{this.cuentasBancarias=n.cuentasBancarias})}))}cargarTablas(){return o.b(this,void 0,void 0,(function*(){}))}agregarCuentaBancaria(){this.modalCuentaBancaria({empresa:this.empresa,moneda:""}).then(n=>{n.seleccionado&&this.obtieneCuentas()})}modalCuentaBancaria(n){return o.b(this,void 0,void 0,(function*(){const l=yield this.modalCtrl.create({component:b.a,cssClass:"my-custom-modal-css-empresa",componentProps:{parametros:n}});yield l.present();const{data:e}=yield l.onDidDismiss();return e||{seleccionado:!1}}))}cargarEmpresasCliente(){return o.b(this,void 0,void 0,(function*(){yield this.empresaService.getEmpresaCliente().subscribe(n=>{this.empresasCliente=n.empresas,this.empresasCliente.push({_id:"-",ruc:"",razonSocial:"Personales",direccion:"",telefono:""}),this.empresasCliente.push({_id:"+",ruc:"",razonSocial:"+ Agregar Empresa",direccion:"",telefono:""}),this.refrescaSelects()})}))}selectEmpresa(n){return o.b(this,void 0,void 0,(function*(){"+"===n.detail.value?this.modalEmpresa().then(n=>{console.log(n),n.seleccionado?this.cargarEmpresasCliente().then(l=>{this.empresa=n.empresa._id}):this.empresa="-"}):this.obtieneCuentas()}))}modalEmpresa(){return o.b(this,void 0,void 0,(function*(){const n=yield this.modalCtrl.create({component:d.a,cssClass:"my-custom-modal-css-empresa",componentProps:{}});yield n.present();const{data:l}=yield n.onDidDismiss();return l||{seleccionado:!1}}))}refrescaSelects(){this.showSelects=!1,window.setTimeout(()=>{this.showSelects=!0},500)}setDefault(n,l){this.cuentaBancariaService.setDefaultCuentaBancaria({_id:l,default:n}).then(n=>{this.obtieneCuentas(),this.events.publish("transaccion:refreshusuario")}).catch(n=>{console.log(n)})}setActiva(n,l){this.cuentaBancariaService.setActivaCuentaBancaria({_id:l,activo:n}).then(n=>{this.events.publish("transaccion:refreshusuario")}).catch(n=>{console.log(n)})}}class p{}var C=e("pMnS"),m=e("oBZk"),h=e("s7LF"),f=e("SVse"),M=e("2m4Y"),O=t.Ab({encapsulation:0,styles:[["[_nghost-%COMP%]   ion-content[_ngcontent-%COMP%]{--background:linear-gradient(-135deg, var(--ion-color-medium), var(--ion-color-light))}.contenedor[_ngcontent-%COMP%]{display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center}.contenedor[_ngcontent-%COMP%]   .zonacero[_ngcontent-%COMP%]   .headerback[_ngcontent-%COMP%]{float:initial;position:absolute;top:0;clear:both;margin-top:10px;height:100px;width:100%;box-shadow:0 0 5px 0 rgba(0,0,0,.35);display:block;left:0;background-color:var(--ion-color-primary)}.contenedor[_ngcontent-%COMP%]   .zonacero[_ngcontent-%COMP%]   .headerback[_ngcontent-%COMP%]   .myCustomSelect[_ngcontent-%COMP%]{max-width:100%!important}.contenedor[_ngcontent-%COMP%]   .zonacero[_ngcontent-%COMP%]   .headerback[_ngcontent-%COMP%]   .params[_ngcontent-%COMP%]{display:-webkit-box;display:flex;-webkit-box-pack:center;justify-content:center}.contenedor[_ngcontent-%COMP%]   .zonacero[_ngcontent-%COMP%]   .datospersonales[_ngcontent-%COMP%]{width:400px;z-index:2;margin-top:50px}.contenedor[_ngcontent-%COMP%]   .zonacero[_ngcontent-%COMP%]   .datospersonales[_ngcontent-%COMP%]   ion-item[_ngcontent-%COMP%]{--background:white;--color:black;--padding-start:10px}.contenedor[_ngcontent-%COMP%]   .zonacero[_ngcontent-%COMP%]   .datospersonales[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]{display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center;padding-left:10px}.contenedor[_ngcontent-%COMP%]   .zonacero[_ngcontent-%COMP%]   .datospersonales[_ngcontent-%COMP%]   .soyusuario[_ngcontent-%COMP%]{font-size:16px;font-weight:700}.contenedor[_ngcontent-%COMP%]   .zonacero[_ngcontent-%COMP%]   .datospersonales[_ngcontent-%COMP%]   .texto-informativo[_ngcontent-%COMP%]{margin-left:10px;font-size:.87em}.contenedor[_ngcontent-%COMP%]   .zonacero[_ngcontent-%COMP%]   .datospersonales[_ngcontent-%COMP%]   .texto-registrate[_ngcontent-%COMP%]{margin-left:10px;font-size:1em;font-weight:700}.contenedor[_ngcontent-%COMP%]   .zonacero[_ngcontent-%COMP%]   .datospersonales[_ngcontent-%COMP%]   .form-registro[_ngcontent-%COMP%]{background-color:#fff}.contenedor[_ngcontent-%COMP%]   .zonacero[_ngcontent-%COMP%]   .datospersonales[_ngcontent-%COMP%]   .flag_res[_ngcontent-%COMP%]{width:20px;padding:0;margin-right:10px}.contenedor[_ngcontent-%COMP%]   .zonacero[_ngcontent-%COMP%]   .datospersonales[_ngcontent-%COMP%]   .logo_banco[_ngcontent-%COMP%]{width:30px;padding:0;margin-right:10px}.contenedor[_ngcontent-%COMP%]   .zonacero[_ngcontent-%COMP%]   .datospersonales[_ngcontent-%COMP%]   ion-card[_ngcontent-%COMP%]{text-align:-moz-center;text-align:-webkit-center;background-color:#fff}.contenedor[_ngcontent-%COMP%]   .zonacero[_ngcontent-%COMP%]   .datospersonales[_ngcontent-%COMP%]   ion-toggle[_ngcontent-%COMP%]{--background:rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.088);--background-checked:#3880ff;--handle-background:#fff;--handle-background-checked:#fff;--border-radius:16px;--handle-border-radius:14px}.contenedor[_ngcontent-%COMP%]   .sindatos[_ngcontent-%COMP%]{font-size:1.5em;position:absolute;top:200px;text-align:center;color:var(--ion-color-primary);padding:20px;-webkit-animation-duration:3s;animation-duration:3s;-webkit-animation-name:slidein;animation-name:slidein}@media (min-width:700px){.contenedor[_ngcontent-%COMP%]   .zonacero[_ngcontent-%COMP%]   .datospersonales[_ngcontent-%COMP%]   .form-registro[_ngcontent-%COMP%]{padding:20px;border:dotted 1px var(--ion-color-primary)}.contenedor[_ngcontent-%COMP%]   .sindatos[_ngcontent-%COMP%], .contenedor[_ngcontent-%COMP%]   .zonacero[_ngcontent-%COMP%]{width:400px}}"]],data:{}});function v(n){return t.Yb(0,[(n()(),t.Cb(0,0,null,null,4,"ion-select-option",[["style","font-size: 1em;"]],null,null,null,m.Ib,m.M)),t.Bb(1,49152,null,0,i.rb,[t.j,t.p,t.F],{value:[0,"value"]},null),(n()(),t.Wb(2,0,[" "," "," "])),t.Sb(3,1),t.Sb(4,1)],(function(n,l){n(l,1,0,l.context.$implicit._id)}),(function(n,l){var e="+"===l.context.$implicit._id?"":t.Xb(l,2,0,n(l,3,0,t.Ob(l.parent.parent,0),"Cuentas Bancarias - ")),o=t.Xb(l,2,1,n(l,4,0,t.Ob(l.parent.parent,0),l.context.$implicit.razonSocial));n(l,2,0,e,o)}))}function _(n){return t.Yb(0,[(n()(),t.Cb(0,0,null,null,8,"ion-select",[["class","ion-no-padding colorselect  fw700 myCustomSelect"],["color","ligth"],["interface","popover"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"],[null,"ionChange"],[null,"ionBlur"]],(function(n,l,e){var o=!0,i=n.component;return"ionBlur"===l&&(o=!1!==t.Ob(n,1)._handleBlurEvent(e.target)&&o),"ionChange"===l&&(o=!1!==t.Ob(n,1)._handleChangeEvent(e.target)&&o),"ngModelChange"===l&&(o=!1!==(i.empresa=e)&&o),"ionChange"===l&&(o=!1!==i.selectEmpresa(e)&&o),o}),m.Jb,m.L)),t.Bb(1,16384,null,0,i.Tb,[t.p],null,null),t.Tb(1024,null,h.f,(function(n){return[n]}),[i.Tb]),t.Bb(3,671744,null,0,h.j,[[8,null],[8,null],[8,null],[6,h.f]],{model:[0,"model"]},{update:"ngModelChange"}),t.Tb(2048,null,h.g,null,[h.j]),t.Bb(5,16384,null,0,h.h,[[4,h.g]],null,null),t.Bb(6,49152,[["empresaList",4]],0,i.qb,[t.j,t.p,t.F],{interface:[0,"interface"]},null),(n()(),t.rb(16777216,null,0,1,null,v)),t.Bb(8,278528,null,0,f.j,[t.X,t.T,t.x],{ngForOf:[0,"ngForOf"]},null)],(function(n,l){var e=l.component;n(l,3,0,e.empresa),n(l,6,0,"popover"),n(l,8,0,e.empresasCliente)}),(function(n,l){n(l,0,0,t.Ob(l,5).ngClassUntouched,t.Ob(l,5).ngClassTouched,t.Ob(l,5).ngClassPristine,t.Ob(l,5).ngClassDirty,t.Ob(l,5).ngClassValid,t.Ob(l,5).ngClassInvalid,t.Ob(l,5).ngClassPending)}))}function x(n){return t.Yb(0,[(n()(),t.Cb(0,0,null,null,50,"ion-card",[],null,null,null,m.hb,m.g)),t.Bb(1,49152,null,0,i.p,[t.j,t.p,t.F],null,null),(n()(),t.Cb(2,0,null,0,6,"ion-card-header",[],null,null,null,m.eb,m.i)),t.Bb(3,49152,null,0,i.r,[t.j,t.p,t.F],null,null),(n()(),t.Cb(4,0,null,0,4,"ion-card-title",[],null,null,null,m.gb,m.k)),t.Bb(5,49152,null,0,i.t,[t.j,t.p,t.F],null,null),(n()(),t.Cb(6,0,null,0,2,"div",[["style","display: flex; flex-direction: row; align-items: center;"]],null,null,null,null,null)),(n()(),t.Cb(7,0,null,null,0,"img",[["class","logo_banco"]],[[8,"src",4]],null,null,null,null)),(n()(),t.Wb(8,null,[" "," "," "," "])),(n()(),t.Cb(9,0,null,0,41,"ion-card-content",[],null,null,null,m.db,m.h)),t.Bb(10,49152,null,0,i.q,[t.j,t.p,t.F],null,null),(n()(),t.Cb(11,0,null,0,7,"ion-item",[],null,null,null,m.wb,m.w)),t.Bb(12,49152,null,0,i.K,[t.j,t.p,t.F],null,null),(n()(),t.Cb(13,0,null,0,2,"ion-label",[],null,null,null,m.xb,m.A)),t.Bb(14,49152,null,0,i.Q,[t.j,t.p,t.F],null,null),(n()(),t.Wb(-1,0,["Numero de Cuenta"])),(n()(),t.Cb(16,0,null,0,2,"ion-text",[["color","primary"]],null,null,null,m.Qb,m.T)),t.Bb(17,49152,null,0,i.Ab,[t.j,t.p,t.F],{color:[0,"color"]},null),(n()(),t.Wb(18,0,[" "," "])),(n()(),t.Cb(19,0,null,0,7,"ion-item",[],null,null,null,m.wb,m.w)),t.Bb(20,49152,null,0,i.K,[t.j,t.p,t.F],null,null),(n()(),t.Cb(21,0,null,0,2,"ion-label",[],null,null,null,m.xb,m.A)),t.Bb(22,49152,null,0,i.Q,[t.j,t.p,t.F],null,null),(n()(),t.Wb(-1,0,["Numero de CCI"])),(n()(),t.Cb(24,0,null,0,2,"ion-text",[["color","primary"]],null,null,null,m.Qb,m.T)),t.Bb(25,49152,null,0,i.Ab,[t.j,t.p,t.F],{color:[0,"color"]},null),(n()(),t.Wb(26,0,[" "," "])),(n()(),t.Cb(27,0,null,0,11,"ion-item",[],null,null,null,m.wb,m.w)),t.Bb(28,49152,null,0,i.K,[t.j,t.p,t.F],null,null),(n()(),t.Cb(29,0,null,0,2,"ion-label",[],null,null,null,m.xb,m.A)),t.Bb(30,49152,null,0,i.Q,[t.j,t.p,t.F],null,null),(n()(),t.Wb(-1,0,["Usar la pr\xf3xima vez"])),(n()(),t.Cb(32,0,null,0,6,"ion-toggle",[],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"],[null,"ionBlur"],[null,"ionChange"]],(function(n,l,e){var o=!0,i=n.component;return"ionBlur"===l&&(o=!1!==t.Ob(n,33)._handleBlurEvent(e.target)&&o),"ionChange"===l&&(o=!1!==t.Ob(n,33)._handleIonChange(e.target)&&o),"ngModelChange"===l&&(o=!1!==(n.context.$implicit.default=e)&&o),"ngModelChange"===l&&(o=!1!==i.setDefault(e,n.context.$implicit._id)&&o),o}),m.Sb,m.V)),t.Bb(33,16384,null,0,i.d,[t.p],null,null),t.Tb(1024,null,h.f,(function(n){return[n]}),[i.d]),t.Bb(35,671744,null,0,h.j,[[8,null],[8,null],[8,null],[6,h.f]],{model:[0,"model"]},{update:"ngModelChange"}),t.Tb(2048,null,h.g,null,[h.j]),t.Bb(37,16384,null,0,h.h,[[4,h.g]],null,null),t.Bb(38,49152,null,0,i.Eb,[t.j,t.p,t.F],null,null),(n()(),t.Cb(39,0,null,0,11,"ion-item",[],null,null,null,m.wb,m.w)),t.Bb(40,49152,null,0,i.K,[t.j,t.p,t.F],null,null),(n()(),t.Cb(41,0,null,0,2,"ion-label",[],null,null,null,m.xb,m.A)),t.Bb(42,49152,null,0,i.Q,[t.j,t.p,t.F],null,null),(n()(),t.Wb(-1,0,["Activa"])),(n()(),t.Cb(44,0,null,0,6,"ion-toggle",[],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"],[null,"ionBlur"],[null,"ionChange"]],(function(n,l,e){var o=!0,i=n.component;return"ionBlur"===l&&(o=!1!==t.Ob(n,45)._handleBlurEvent(e.target)&&o),"ionChange"===l&&(o=!1!==t.Ob(n,45)._handleIonChange(e.target)&&o),"ngModelChange"===l&&(o=!1!==(n.context.$implicit.activo=e)&&o),"ngModelChange"===l&&(o=!1!==i.setActiva(e,n.context.$implicit._id)&&o),o}),m.Sb,m.V)),t.Bb(45,16384,null,0,i.d,[t.p],null,null),t.Tb(1024,null,h.f,(function(n){return[n]}),[i.d]),t.Bb(47,671744,null,0,h.j,[[8,null],[8,null],[8,null],[6,h.f]],{model:[0,"model"]},{update:"ngModelChange"}),t.Tb(2048,null,h.g,null,[h.j]),t.Bb(49,16384,null,0,h.h,[[4,h.g]],null,null),t.Bb(50,49152,null,0,i.Eb,[t.j,t.p,t.F],null,null)],(function(n,l){n(l,17,0,"primary"),n(l,25,0,"primary"),n(l,35,0,l.context.$implicit.default),n(l,47,0,l.context.$implicit.activo)}),(function(n,l){n(l,7,0,t.Gb(1,"/assets/bancos/",l.context.$implicit.banco.valorUno,"")),n(l,8,0,l.context.$implicit.banco.descripcion,l.context.$implicit.tipoDeCuenta.descripcion,l.context.$implicit.moneda.descripcion),n(l,18,0,l.context.$implicit.numeroDeCuenta),n(l,26,0,l.context.$implicit.numeroDeCCI),n(l,32,0,t.Ob(l,37).ngClassUntouched,t.Ob(l,37).ngClassTouched,t.Ob(l,37).ngClassPristine,t.Ob(l,37).ngClassDirty,t.Ob(l,37).ngClassValid,t.Ob(l,37).ngClassInvalid,t.Ob(l,37).ngClassPending),n(l,44,0,t.Ob(l,49).ngClassUntouched,t.Ob(l,49).ngClassTouched,t.Ob(l,49).ngClassPristine,t.Ob(l,49).ngClassDirty,t.Ob(l,49).ngClassValid,t.Ob(l,49).ngClassInvalid,t.Ob(l,49).ngClassPending)}))}function B(n){return t.Yb(0,[(n()(),t.Cb(0,0,null,null,6,"div",[["class","sindatos"]],null,null,null,null,null)),(n()(),t.Cb(1,0,null,null,1,"p",[],null,null,null,null,null)),(n()(),t.Wb(-1,null,["A\xfan no tienes cuentas bancarias registradas, agrega una cuenta con el boton + ubicado en la parte de abajo."])),(n()(),t.Cb(3,0,null,null,3,"div",[["class","flecha-animada"]],null,null,null,null,null)),(n()(),t.Cb(4,0,null,null,2,"div",[["class","elemento"]],null,null,null,null,null)),(n()(),t.Cb(5,0,null,null,1,"ion-icon",[["class","flecha"],["name","arrow-round-down"],["size","large"]],null,null,null,m.qb,m.t)),t.Bb(6,49152,null,0,i.F,[t.j,t.p,t.F],{name:[0,"name"],size:[1,"size"]},null)],(function(n,l){n(l,6,0,"arrow-round-down","large")}),null)}function P(n){return t.Yb(0,[t.Qb(0,f.p,[]),(n()(),t.Cb(1,0,null,null,1,"ion-header",[],null,null,null,m.pb,m.s)),t.Bb(2,49152,null,0,i.E,[t.j,t.p,t.F],null,null),(n()(),t.Cb(3,0,null,null,28,"ion-content",[["class","profile"]],null,null,null,m.jb,m.m)),t.Bb(4,49152,null,0,i.x,[t.j,t.p,t.F],null,null),(n()(),t.Cb(5,0,null,0,26,"div",[["class","contenedor"]],null,null,null,null,null)),(n()(),t.Cb(6,0,null,null,23,"div",[["class","zonacero"]],null,null,null,null,null)),(n()(),t.Cb(7,0,null,null,9,"div",[["class","headerback"]],null,null,null,null,null)),(n()(),t.Cb(8,0,null,null,8,"div",[["class","params"]],null,null,null,null,null)),(n()(),t.Cb(9,0,null,null,7,"ion-item",[["color","primary"],["lines","none"]],null,null,null,m.wb,m.w)),t.Bb(10,49152,null,0,i.K,[t.j,t.p,t.F],{color:[0,"color"],lines:[1,"lines"]},null),(n()(),t.Cb(11,0,null,0,3,"ion-label",[["class","ion-no-padding ion-no-margin text-primary"],["color","tertiary"]],null,null,null,m.xb,m.A)),t.Bb(12,49152,null,0,i.Q,[t.j,t.p,t.F],{color:[0,"color"]},null),(n()(),t.Cb(13,0,null,0,1,"ion-text",[["color","ligth"]],null,null,null,m.Qb,m.T)),t.Bb(14,49152,null,0,i.Ab,[t.j,t.p,t.F],{color:[0,"color"]},null),(n()(),t.rb(16777216,null,0,1,null,_)),t.Bb(16,16384,null,0,f.k,[t.X,t.T],{ngIf:[0,"ngIf"]},null),(n()(),t.Cb(17,0,null,null,12,"div",[["class","datospersonales"]],null,null,null,null,null)),(n()(),t.Cb(18,0,null,null,11,"ion-grid",[["class","center-grid "],["fixed",""]],null,null,null,m.ob,m.r)),t.Bb(19,49152,null,0,i.D,[t.j,t.p,t.F],{fixed:[0,"fixed"]},null),(n()(),t.Cb(20,0,null,0,3,"ion-row",[["class","ion-no-padding ion-no-margin"]],null,null,null,m.Gb,m.J)),t.Bb(21,49152,null,0,i.mb,[t.j,t.p,t.F],null,null),(n()(),t.Cb(22,0,null,0,1,"ion-col",[["class","ion-no-padding ion-no-margin ion-no-border ion-text-center br bb datetime-btn columna"],["size-md","12"],["size-xs","12"]],null,null,null,m.ib,m.l)),t.Bb(23,49152,null,0,i.w,[t.j,t.p,t.F],null,null),(n()(),t.Cb(24,0,null,0,5,"ion-row",[["class","ion-no-padding ion-no-margin"]],null,null,null,m.Gb,m.J)),t.Bb(25,49152,null,0,i.mb,[t.j,t.p,t.F],null,null),(n()(),t.Cb(26,0,null,0,3,"ion-col",[["class","ion-no-padding ion-no-margin ion-no-border ion-text-center br bb datetime-btn columna"],["size-md","12"],["size-xs","12"]],null,null,null,m.ib,m.l)),t.Bb(27,49152,null,0,i.w,[t.j,t.p,t.F],null,null),(n()(),t.rb(16777216,null,0,1,null,x)),t.Bb(29,278528,null,0,f.j,[t.X,t.T,t.x],{ngForOf:[0,"ngForOf"]},null),(n()(),t.rb(16777216,null,null,1,null,B)),t.Bb(31,16384,null,0,f.k,[t.X,t.T],{ngIf:[0,"ngIf"]},null),(n()(),t.Cb(32,0,null,null,7,"ion-footer",[],null,null,null,m.nb,m.q)),t.Bb(33,49152,null,0,i.C,[t.j,t.p,t.F],null,null),(n()(),t.Cb(34,0,null,0,5,"ion-fab",[["horizontal","center"],["slot","fixed"],["vertical","bottom"]],null,[[null,"click"]],(function(n,l,e){var t=!0;return"click"===l&&(t=!1!==n.component.agregarCuentaBancaria()&&t),t}),m.mb,m.o)),t.Bb(35,49152,null,0,i.z,[t.j,t.p,t.F],{horizontal:[0,"horizontal"],vertical:[1,"vertical"]},null),(n()(),t.Cb(36,0,null,0,3,"ion-fab-button",[["color","primary"]],null,null,null,m.lb,m.p)),t.Bb(37,49152,null,0,i.A,[t.j,t.p,t.F],{color:[0,"color"]},null),(n()(),t.Cb(38,0,null,0,1,"ion-icon",[["name","add"]],null,null,null,m.qb,m.t)),t.Bb(39,49152,null,0,i.F,[t.j,t.p,t.F],{name:[0,"name"]},null)],(function(n,l){var e=l.component;n(l,10,0,"primary","none"),n(l,12,0,"tertiary"),n(l,14,0,"ligth"),n(l,16,0,e.showSelects),n(l,19,0,""),n(l,29,0,e.cuentasBancarias),n(l,31,0,0===e.cuentasBancarias.length),n(l,35,0,"center","bottom"),n(l,37,0,"primary"),n(l,39,0,"add")}),null)}function w(n){return t.Yb(0,[(n()(),t.Cb(0,0,null,null,1,"app-edit-account",[],null,null,null,P,O)),t.Bb(1,4308992,null,0,g,[i.Mb,i.Jb,i.Vb,M.a,h.b,u.a,a.a,r.a,c.a,s.a,i.Lb,i.g],null,null)],(function(n,l){n(l,1,0)}),null)}var y=t.yb("app-edit-account",g,w,{},{},[]),j=e("TSSN"),z=e("iInd");e.d(l,"EditAccountPageModuleNgFactory",(function(){return k}));var k=t.zb(p,[],(function(n){return t.Lb([t.Mb(512,t.m,t.kb,[[8,[C.a,y]],[3,t.m],t.D]),t.Mb(4608,f.m,f.l,[t.z,[2,f.x]]),t.Mb(4608,h.n,h.n,[]),t.Mb(4608,h.b,h.b,[]),t.Mb(4608,i.c,i.c,[t.F,t.g]),t.Mb(4608,i.Lb,i.Lb,[i.c,t.m,t.w]),t.Mb(4608,i.Qb,i.Qb,[i.c,t.m,t.w]),t.Mb(4608,j.g,j.f,[]),t.Mb(4608,j.c,j.e,[]),t.Mb(4608,j.i,j.d,[]),t.Mb(4608,j.b,j.a,[]),t.Mb(4608,j.k,j.k,[j.l,j.g,j.c,j.i,j.b,j.m,j.n]),t.Mb(1073742336,f.b,f.b,[]),t.Mb(1073742336,h.m,h.m,[]),t.Mb(1073742336,h.e,h.e,[]),t.Mb(1073742336,h.k,h.k,[]),t.Mb(1073742336,i.Hb,i.Hb,[]),t.Mb(1073742336,j.h,j.h,[]),t.Mb(1073742336,z.o,z.o,[[2,z.t],[2,z.m]]),t.Mb(1073742336,p,p,[]),t.Mb(256,j.n,void 0,[]),t.Mb(256,j.m,void 0,[]),t.Mb(1024,z.k,(function(){return[[{path:"",component:g}]]}),[])])}))}}]);