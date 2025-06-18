/**
 * @typedef {Object} CostRegister
 * @property {string} id - Identificador único del registro de costos
 * @property {string} fecha - Fecha del registro (formato ISO)
 * @property {string} lote - Identificador del lote
 * @property {string} materiaPrima - Costo de materia prima
 * @property {string} manoObra - Costo de mano de obra
 * @property {string} transporte - Costo de transporte
 * @property {string} almacenamiento - Costo de almacenamiento
 * @property {number} procesamiento - Costo de procesamiento
 * @property {number} otrosCostos - Otros costos
 * @property {Object} totales - Totales calculados
 * @property {number} totales.totalLote - Total del lote
 * @property {number} totales.costPerKg - Costo por kilogramo
 * @property {number} totales.costPerCup - Costo por taza
 * @property {Object} detalle - Detalle de costos
 * @property {number} detalle.costoKgCafeVerde - Costo por kg de café verde
 * @property {number} detalle.cantidadCafeVerde - Cantidad de café verde
 * @property {number} detalle.horasTrabajadas - Horas trabajadas
 * @property {number} detalle.costoPorHora - Costo por hora
 * @property {number} detalle.numeroTrabajadores - Número de trabajadores
 * @property {number} detalle.costoTransporteKgCafeVerde - Costo de transporte por kg
 * @property {number} detalle.cantidadTransporteCafeVerde - Cantidad transportada
 * @property {number} detalle.energiaElectrica - Costo de energía eléctrica
 * @property {number} detalle.mantenimientoMaquinaria - Costo de mantenimiento
 * @property {number} detalle.insumosProcesamiento - Costo de insumos
 * @property {number} detalle.aguaUtilizada - Costo de agua
 * @property {number} detalle.depreciacionEquipos - Depreciación de equipos
 * @property {number} detalle.diasAlmacen - Días de almacenamiento
 * @property {number} detalle.costoDiarioAlmacen - Costo diario de almacén
 * @property {number} detalle.controlCalidad - Costo de control de calidad
 * @property {number} detalle.certificaciones - Costo de certificaciones
 * @property {number} detalle.seguros - Costo de seguros
 * @property {number} detalle.gastosAdministrativos - Gastos administrativos
 */

export class CostRegister {
    constructor({
        id,
        fecha,
        lote,
        materiaPrima,
        manoObra,
        transporte,
        almacenamiento,
        procesamiento,
        otrosCostos,
        totales,
        detalle
    }) {
        this.id = id;
        this.fecha = fecha;
        this.lote = lote;
        this.materiaPrima = materiaPrima;
        this.manoObra = manoObra;
        this.transporte = transporte;
        this.almacenamiento = almacenamiento;
        this.procesamiento = procesamiento;
        this.otrosCostos = otrosCostos;
        this.totales = totales || {
            totalLote: 0,
            costPerKg: 0,
            costPerCup: 0
        };
        this.detalle = detalle || {
            costoKgCafeVerde: 0,
            cantidadCafeVerde: 0,
            horasTrabajadas: 0,
            costoPorHora: 0,
            numeroTrabajadores: 0,
            costoTransporteKgCafeVerde: 0,
            cantidadTransporteCafeVerde: 0,
            energiaElectrica: 0,
            mantenimientoMaquinaria: 0,
            insumosProcesamiento: 0,
            aguaUtilizada: 0,
            depreciacionEquipos: 0,
            diasAlmacen: 0,
            costoDiarioAlmacen: 0,
            controlCalidad: 0,
            certificaciones: 0,
            seguros: 0,
            gastosAdministrativos: 0
        };
    }

    /**
     * Calcula los totales del registro de costos basado en los valores actuales
     * @returns {Object} Objeto con los totales calculados
     */
    calcularTotales() {
        const materiaPrimaNum = parseFloat(this.materiaPrima) || 0;
        const manoObraNum = parseFloat(this.manoObra) || 0;
        const transporteNum = parseFloat(this.transporte) || 0;
        const almacenamientoNum = parseFloat(this.almacenamiento) || 0;
        const procesamientoNum = this.procesamiento || 0;
        const otrosCostosNum = this.otrosCostos || 0;

        const totalLote = materiaPrimaNum + manoObraNum + transporteNum + 
                         almacenamientoNum + procesamientoNum + otrosCostosNum;

        const cantidadCafeVerde = this.detalle.cantidadCafeVerde || 0.4; // valor por defecto según db.json
        const costPerKg = cantidadCafeVerde > 0 ? totalLote / cantidadCafeVerde : 0;
        const costPerCup = costPerKg * 0.0001; // asumiendo 0.0001 kg por taza

        return {
            totalLote,
            costPerKg,
            costPerCup
        };
    }

    /**
     * Actualiza los totales del registro
     * @returns {void}
     */
    actualizarTotales() {
        this.totales = this.calcularTotales();
    }
}

export default CostRegister; 