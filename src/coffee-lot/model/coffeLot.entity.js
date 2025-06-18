
export function createCoffeeLot(data = {}) {
    return {
        id: data.id || null,
        lot_name: data.lot_name || '',
        coffee_type: data.coffee_type || '',
        processing_method: data.processing_method || '',
        altitude: data.altitude || 0,
        weight: data.weight || 0,
        certifications: Array.isArray(data.certifications) ? data.certifications : [],
        origin: data.origin || '',
        supplier_id: data.supplier_id || '',
        user_id: data.user_id || '',
        status: data.status || '',
    };
}
