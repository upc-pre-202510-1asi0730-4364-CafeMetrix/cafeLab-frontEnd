
export function createSupplier(data = {}) {
    return {
        id: data.id || null,                  // string o null
        name: data.name || '',                // string
        email: data.email || '',              // string
        phone: data.phone || null,            // number
        location: data.location || '',        // string
        specialties: Array.isArray(data.specialties) ? data.specialties : [],
        userId: data.userId || null           // string
    };
}
