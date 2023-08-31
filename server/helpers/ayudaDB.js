const Tabla = require('../models/tabla'); //Mayuscula pq desde aqui crearemos instancias con new....
const Usuario = require('../models/usuario'); //Mayuscula pq desde aqui crearemos instancias con new....
const Empresa = require('../models/empresa');
const CuentaBancaria = require('../models/cuentaBancaria');
const CuentaBancariaPropia =require('../models/cuentaBancariaPropia');
const Moneda = require('../models/moneda');
const Cliente = require('../models/cliente');
const log = require('../models/log');

const obtenerTabla = async (codigo) => {
    return new Promise((resolve, reject) => {
        Tabla.find({ codigo: codigo })
            .exec((err, tabla) => {
                if (err) {
                    // 400 bad request   
                    reject('Error');
                }
                resolve(tabla[0]);
            });
    })
  };

const obtenerUsuario = async (email) => {
    return new Promise((resolve, reject) => {
        Usuario.find({ email: email })
            .exec((err, usuario) => {
                if (err) {
                    // 400 bad request   
                    reject('Error');
                }
                resolve(usuario[0]);
            });
    })
  };

  const obtenerEmpresasCliente = async (cliente) => {
    return new Promise((resolve, reject) => {
        Empresa.find({ clienteAsociado: cliente })
            .exec((err, empresas) => {
                if (err) {
                    // 400 bad request   
                    reject('Error');
                }
                resolve(empresas);
            });
    })
  };

  const obtenerEmpresaRUC = async (cliente, ruc) => {
    return new Promise((resolve, reject) => {
        Empresa.find({ clienteAsociado: cliente, ruc })
            .exec((err, empresa) => {
                if (err) {
                    // 400 bad request   
                    reject('Error');
                }
                resolve(empresa[0]);
            });
    })
  };

  const obtenerMoneda = async (codigo) => {
    return new Promise((resolve, reject) => { 
        Moneda.find({ codigo: codigo })
            .populate('pais', 'descripcion valorUno')
            .exec((err, moneda) => {
                if (err) {
                    // 400 bad request
                    reject('Error');
                }
                resolve(moneda[0]);
            });
    })
} 

const actualizarCrearEmpresaCliente = async (clienteId, empresaId, ruc, razonSocial, direccion) => {
    let {_id: tipoDocumentoIdentidad} = await obtenerTabla('TipoDocumentoIdentidad_DNI');

    return new Promise(async(resolve, reject) => {
        // Si hay id de empresa actualizamos
        if (empresaId) {
            Empresa.findById(empresaId)
            .exec((err, empresa) => {
                if (err) {
                    // 400 bad request   
                    return reject('Error en llamada a busqueda en actualizarCrearEmpresaCliente');
                }                
                empresa.ruc=ruc;
                empresa.razonSocial=razonSocial;
                empresa.direccion=direccion;                
                empresa.save((err, empresaDB) => {
                    if (err) {
                        return reject('Error en llamada a empresa.save en actualizarCrearEmpresaCliente');
                    }
                    if (!empresaDB) {
                        return reject('Error en llamada no existe la empresa actualizarCrearEmpresaCliente');
                    }
                    resolve(empresaDB);
                });
            });
        } else {
            //Si no hay id quiere decir que el usuario esta asignando una empresa a la transaccion
            //Buscamos el RUC
            let empresa = await obtenerEmpresaRUC(clienteId, ruc);
            
            if (empresa) {
                let {_id: empresaId}=empresa;
                //Actualizamos
                Empresa.findById(empresaId)
                .exec((err, empresa) => {
                    if (err) {
                        // 400 bad request   
                        return reject('Error en llamada a busqueda de empresa en actualizarCrearEmpresaCliente');
                    }                
                    empresa.ruc=ruc;
                    empresa.razonSocial=razonSocial;
                    empresa.direccion=direccion;                
                    empresa.save((err, empresaDB) => {
                        if (err) {
                            return reject('Error en llamada a grabar al actualizar en actualizarCrearEmpresaCliente');
                        } 
                        if (!empresaDB) {
                            return reject('Error en llamada a busqueda de empresa no existe empresa en actualizarCrearEmpresaCliente');
                        }
                        resolve(empresaDB);
                    });
                }); 
            } else {
                //Agregamos
                let empresa = new Empresa({
                    clienteAsociado: clienteId,
                    ruc,
                    razonSocial,
                    direccion,
                    nombreRep: 'Definir',
                    primerApellidoRep: 'Definir',
                    segundoApellidoRep: 'Definir',
                    tipoDocumentoIdentidadRep: tipoDocumentoIdentidad,
                    numeroDocumentoIdentidadRep: 'Definir'
                });

                empresa.save((err, empresaDB) => {
                    if (err) {
                        // 500 bad request 
                        return reject(err); //'Error en llamada a save al crear empresa en actualizarCrearEmpresaCliente'
                    }

                    if (!empresaDB) {
                        // 400 bad request 
                        return reject('Error en llamada a crear empresa en actualizarCrearEmpresaCliente');
                    }

                    resolve(empresaDB);
                });

            }

        }


    })
  };


 
  
  const actualizarCrearCuentaCliente = async (cuentaOrigenId, cliente, empresa, banco, tipoDeCuenta, moneda, numeroDeCuenta, numeroDeCCI) => {
    return new Promise(async(resolve, reject) => {

        let tipoPropiedadCuenta = await obtenerTabla(empresa?'CuentaEmpresa':'CuentaPropia');

        //cuentaOrigenId esta demas, tratr de quitarlo
        let cuentaBancaria = await CuentaBancaria.find({cliente, empresa, banco, tipoDeCuenta, moneda, numeroDeCuenta, tipoPropiedadCuenta}); //sin CCI numeroDeCCI
        if (cuentaBancaria.length>0) {
            cuentaOrigenId=cuentaBancaria[0]._id;
        } else {
            cuentaOrigenId=null;
        }

            // Si hay id de cuenta actualizamos
            if (cuentaOrigenId) {
                CuentaBancaria.findById(cuentaOrigenId)
                .exec((err, cuenta) => {
                    if (err) {
                        // 400 bad request   
                        return reject('Error de instruccion');
                        // throw 'Erro1'
                    }              
                    if (!cuenta) {
                        // 400 bad request   
                        return reject('No existe cuenta');
                    }  
        
                    cuenta.banco=banco;
                    cuenta.tipoDeCuenta=tipoDeCuenta;
                    cuenta.numeroDeCuenta=numeroDeCuenta;
                    cuenta.numeroDeCCI=numeroDeCCI;

                    cuenta.save((err, cuentaDB) => {
                        if (err) {
                            return reject('Error al grabar');
                        }
                        if (!cuentaDB) {
                            return reject('Error no existe cuenta al grabar');
                        }
                        resolve(cuentaDB);
                    });
                });
            } else {
                //Si no hay id quiere decir que el usuario esta asignando una cuenta a la transaccion
    
                    //Agregamos cuenta
                    let cuentaBancaria = new CuentaBancaria({
                        cliente,
                        tipoPropiedadCuenta,
                        empresa,
                        banco,
                        moneda,
                        tipoDeCuenta,
                        numeroDeCuenta,
                        numeroDeCCI,
                        activo: true,
                        default: true
                    });

                    cuentaBancaria.save((err, cuentaBancariaDB) => {
                        if (err) {
                            // 500 bad request 
                            return reject('Error al grabar cuenta bancaria');
                        }

                        if (!cuentaBancariaDB) {
                            // 400 bad request 
                            return reject('Error no existe cuenta');
                        }

                        resolve(cuentaBancariaDB);
                    });

                    //Inactivamos cuentas del mismo banco,tipo,moneda
                    //TODO

    
            }
             
    });
  };

  const buscarCuentaPropia = async (banco, tipoDeCuenta, moneda, numeroDeCuenta, numeroDeCCI) => {
    return new Promise(async(resolve, reject) => {
        CuentaBancariaPropia.find({banco: banco, tipoDeCuenta: tipoDeCuenta, moneda: moneda, numeroDeCuenta: numeroDeCuenta, numeroDeCCI: numeroDeCCI})
        .exec((err, cuentaDB) => {
            if (err) {
                // 400 bad request   
                reject('Error');
            }                
            if (!cuentaDB) {
                // 400 bad request   
                reject('No existe cuenta propia');
            }
            resolve(cuentaDB[0]);
        });
    })
  };

  

  const actualizarCliente = async (clienteId, nombre, primerApellido, segundoApellido, email, telefono, direccion, tipoDocumentoIdentidad, numeroDocumentoIdentidad) => {
    return new Promise(async(resolve, reject) => {
        // Si hay id de cuenta actualizamos
        Cliente.findById(clienteId)
        .exec((err, cliente) => {
            if (err) {
                // 400 bad request   
                return reject('No se pudo encontrar al cliente');
            }                
            cliente.nombre=nombre;
            cliente.primerApellido=primerApellido;
            cliente.segundoApellido=segundoApellido;
            cliente.email=email;
            cliente.telefono=telefono;
            cliente.direccion=direccion;
            cliente.tipoDocumentoIdentidad=tipoDocumentoIdentidad;
            cliente.numeroDocumentoIdentidad=numeroDocumentoIdentidad;
            
            cliente.save((err, clienteDB) => {
                if (err) {
                    return reject('No se pudo actualizar cliente. Verifique que el email no exista');
                }
                if (!clienteDB) {
                    return reject('Error');
                }
                let usuario=cliente.usuarioAsociado;
                
                console.log(usuario);

                Usuario.findById(usuario)
                .exec((err, usuario)=> {

                    if (err) {
                        return reject('No se pudo actualizar usuario');
                    }
                    if (!usuario) {
                        return reject('No existe el usuario');
                    }
    
                    usuario.email=email;

                    usuario.save((err, usuarioDB) => {
                        resolve(usuarioDB);
                    })
                })


            });
        });


    })
  };

exports.obtenerTabla = obtenerTabla;
exports.obtenerUsuario = obtenerUsuario;
exports.obtenerEmpresasCliente = obtenerEmpresasCliente;
exports.obtenerMoneda = obtenerMoneda;
exports.actualizarCrearEmpresaCliente = actualizarCrearEmpresaCliente;
exports.obtenerEmpresaRUC = obtenerEmpresaRUC;
exports.actualizarCrearCuentaCliente = actualizarCrearCuentaCliente;
exports.buscarCuentaPropia = buscarCuentaPropia;
exports.actualizarCliente = actualizarCliente;