/**
 * @typedef {Object} InventoryItem
 * @property {string} id - Identificador único del movimiento de inventario
 * @property {string} fecha - Fecha del movimiento
 * @property {string} lote - Identificador del lote
 * @property {string} producto - Nombre del producto
 * @property {string} cantidad - Cantidad del movimiento
 * @property {string} tipoCafe - Tipo de café (verde, tostado, etc.)
 */

export class InventoryItem {
    constructor({
        id,
        fecha,
        lote,
        producto,
        cantidad,
        tipoCafe
    }) {
        this.id = id;
        this.fecha = fecha;
        this.lote = lote;
        this.producto = producto;
        this.cantidad = cantidad;
        this.tipoCafe = tipoCafe;
    }

    /**
     * Actualiza la cantidad del inventario
     * @param {string} nuevaCantidad - Nueva cantidad
     * @returns {void}
     */
    actualizarCantidad(nuevaCantidad) {
        this.cantidad = nuevaCantidad;
        this.fecha = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    }
}

export default InventoryItem; 