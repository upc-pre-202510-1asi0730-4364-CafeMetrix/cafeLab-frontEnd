import { ref } from 'vue';

// Fake API for roast profile management using localStorage
export default class RoastingProfileService {
    static STORAGE_KEY = 'roastProfiles';
    static profiles = ref([]);

    // Initialize with sample data if empty
    static {
        this.loadProfiles();
        if (this.profiles.value.length === 0) {
            // Add sample data matching the screenshot
            this.addProfile({
                id: 1,
                name: 'Café amargo',
                type: 'Tueste oscuro',
                altitude: 'Alta',
                supplier: 'Chanchamayo',
                isFavorite: true
            });
            this.addProfile({
                id: 2,
                name: 'Blend suave',
                type: 'Tueste claro',
                altitude: 'Baja',
                supplier: 'Villa Rica',
                isFavorite: false
            });
            this.addProfile({
                id: 3,
                name: 'Tipo brasileño',
                type: 'Tueste medio',
                altitude: 'Media',
                supplier: 'Cusco',
                isFavorite: false
            });
            this.addProfile({
                id: 4,
                name: 'Espresso italiano',
                type: 'Tueste oscuro',
                altitude: 'Alta',
                supplier: 'Importado',
                isFavorite: false
            });
        }
    }

    // Load profiles from localStorage
    static loadProfiles() {
        const storedProfiles = localStorage.getItem(this.STORAGE_KEY);
        if (storedProfiles) {
            this.profiles.value = JSON.parse(storedProfiles);
        }
    }

    // Save profiles to localStorage
    static saveProfiles() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.profiles.value));
    }

    // Get all profiles
    static getProfiles() {
        return this.profiles;
    }

    // Get profile by ID
    static getProfileById(id) {
        const profileId = Number(id);
        return this.profiles.value.find(profile => Number(profile.id) === profileId);
    }

    // Add a new profile
    static addProfile(profile) {
        // Generate new ID if not provided
        if (!profile.id) {
            profile.id = this.getNextId();
        }
        this.profiles.value.push(profile);
        this.saveProfiles();
        return profile;
    }

    // Update an existing profile
    static updateProfile(updatedProfile) {
        const index = this.profiles.value.findIndex(p => p.id === updatedProfile.id);
        if (index !== -1) {
            this.profiles.value[index] = updatedProfile;
            this.saveProfiles();
            return true;
        }
        return false;
    }

    // Delete a profile
    static deleteProfile(id) {
        const initialLength = this.profiles.value.length;
        this.profiles.value = this.profiles.value.filter(p => p.id !== id);
        if (initialLength !== this.profiles.value.length) {
            this.saveProfiles();
            return true;
        }
        return false;
    }

    // Duplicate a profile
    static duplicateProfile(id) {
        const profile = this.getProfileById(id);
        if (profile) {
            const duplicatedProfile = {
                ...profile,
                id: null,
                name: `${profile.name} (copia)`,
            };
            return this.addProfile(duplicatedProfile);
        }
        return null;
    }

    // Toggle favorite status
    static toggleFavorite(id) {
        const profile = this.getProfileById(id);
        if (profile) {
            profile.isFavorite = !profile.isFavorite;
            this.saveProfiles();
            return profile;
        }
        return null;
    }

    // Search profiles by text
    static searchProfiles(query) {
        if (!query) return this.profiles.value;

        const searchText = query.toLowerCase();
        return this.profiles.value.filter(profile =>
            profile.name.toLowerCase().includes(searchText) ||
            profile.type.toLowerCase().includes(searchText) ||
            profile.altitude.toLowerCase().includes(searchText) ||
            profile.supplier.toLowerCase().includes(searchText)
        );
    }

    // Helper method to get next ID
    static getNextId() {
        if (this.profiles.value.length === 0) return 1;
        const maxId = Math.max(...this.profiles.value.map(p => p.id));
        return maxId + 1;
    }
}