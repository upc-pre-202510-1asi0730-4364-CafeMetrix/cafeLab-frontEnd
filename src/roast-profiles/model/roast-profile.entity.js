export function createRoastProfile(data = {}) {
    return {
        id: data.id || null,
        profile_name: data.profile_name || '',
        roast_type: data.roast_type || '',
        duration: data.duration || 0,
        coffee_lot_id: data.coffee_lot_id || '',
        temp_start: data.temp_start || 0,
        temp_end: data.temp_end || 0,
        is_favorite: data.is_favorite || false,
        user_id: data.user_id || '',
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
    };
} 