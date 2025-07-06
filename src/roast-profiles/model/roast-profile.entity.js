export function createRoastProfile(data = {}) {
    return {
        id: data.id || null,
        profileName: data.profileName || '',
        roastType: data.roastType || '',
        duration: data.duration || 0,
        coffeeLotId: data.coffeeLotId || '',
        tempStart: data.tempStart || 0,
        tempEnd: data.tempEnd || 0,
        isFavorite: data.isFavorite || false,
        userId: data.userId || '',
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString()
    };
} 