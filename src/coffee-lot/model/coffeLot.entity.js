
export function createCoffeeLot(data = {}) {
    return {
        id: data.id || null,
        lotName: data.lotName || '',
        coffee_type: data.coffee_type || '',
        processing_method: data.processing_method || '',
        altitude: data.altitude || 0,
        weight: data.weight || 0,
        certifications: Array.isArray(data.certifications) ? data.certifications : [],
        origin: data.origin || '',
        supplierId: data.supplierId || null,
        userId: data.userId || null,
        status: data.status || '',
    };
}
