export class Pedido{
    constructor(id, cliente_id, direccion_id, fecha = null, estado = 'pendiente', total = 0){
        this.id = id;
        this.cliente_id = cliente_id;
        this.direccion_id = direccion_id;
        this.fecha = fecha;
        this.estado = estado;
        this.total = total;
    }
    //METODOS
}