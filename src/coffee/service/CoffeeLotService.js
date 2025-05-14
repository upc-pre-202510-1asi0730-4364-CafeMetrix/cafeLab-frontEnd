import { ref } from 'vue';

// Fake API for coffee lot data management using localStorage
export default class CoffeeLotService {
    static STORAGE_KEY = 'coffeeLots';
    static lots = ref([]);

    // Initialize with sample data if empty
    static {
        this.loadLots();
        if (this.lots.value.length === 0) {
            // Add sample data matching the screenshots
            this.addLot({
                id: 1,
                name: 'Lote 1',
                type: 'Arábica',
                origin: 'Chanchamayo',
                process: 'Grano Verde',
                altitude: '900 msnm',
                weight: '10 kg',
                certifications: ['Comercio Justo', 'Bird Friendly', 'UTZ certified'],
                productionDate: '23/04/2025'
            });
            this.addLot({
                id: 2,
                name: 'Lote 2',
                type: 'Robusta',
                origin: 'Villa Rica',
                process: 'Tostado Medio',
                altitude: '1200 msnm',
                weight: '5 kg',
                certifications: ['Orgánico'],
                productionDate: '15/05/2025'
            });
            this.addLot({
                id: 3,
                name: 'Lote 3',
                type: 'Arábica',
                origin: 'Cusco',
                process: 'Lavado',
                altitude: '1700 msnm',
                weight: '8 kg',
                certifications: ['Rain Forest Alliance', 'Orgánico'],
                productionDate: '10/06/2025'
            });
        }
    }

    // Load lots from localStorage
    static loadLots() {
        const storedLots = localStorage.getItem(this.STORAGE_KEY);
        if (storedLots) {
            this.lots.value = JSON.parse(storedLots);
        }
    }

    // Save lots to localStorage
    static saveLots() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.lots.value));
    }

    // Get all lots
    static getLots() {
        return this.lots;
    }

    // Get lot by ID
    static getLotById(id) {
        const lotId = Number(id);
        return this.lots.value.find(lot => Number(lot.id) === lotId);
    }

    // Add a new lot
    static addLot(lot) {
        // Generate new ID if not provided
        if (!lot.id) {
            lot.id = this.getNextId();
        }
        this.lots.value.push(lot);
        this.saveLots();
        return lot;
    }

    // Update an existing lot
    static updateLot(updatedLot) {
        const index = this.lots.value.findIndex(l => l.id === updatedLot.id);
        if (index !== -1) {
            this.lots.value[index] = updatedLot;
            this.saveLots();
            return true;
        }
        return false;
    }

    // Delete a lot
    static deleteLot(id) {
        const initialLength = this.lots.value.length;
        this.lots.value = this.lots.value.filter(l => l.id !== id);
        if (initialLength !== this.lots.value.length) {
            this.saveLots();
            return true;
        }
        return false;
    }

    // Search lots by text
    static searchLots(query) {
        if (!query) return this.lots.value;

        const searchText = query.toLowerCase();
        return this.lots.value.filter(lot =>
            lot.name.toLowerCase().includes(searchText) ||
            lot.type.toLowerCase().includes(searchText) ||
            lot.origin.toLowerCase().includes(searchText) ||
            lot.process.toLowerCase().includes(searchText)
        );
    }

    // Helper method to get next ID
    static getNextId() {
        if (this.lots.value.length === 0) return 1;
        const maxId = Math.max(...this.lots.value.map(l => l.id));
        return maxId + 1;
    }
}