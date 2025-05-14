import { ref } from 'vue';

// Fake API for supplier data management using localStorage
export default class SupplierService {
    static STORAGE_KEY = 'suppliers';
    static suppliers = ref([]);

    // Initialize with sample data if empty
    static {
        this.loadSuppliers();
        if (this.suppliers.value.length === 0) {
            // Add sample data matching the screenshot
            this.addSupplier({
                id: 1,
                name: 'Café Orgánico Andino',
                email: 'juan@cafeandino.com',
                phone: '+51 987 654 321',
                location: 'Perú'
            });
            this.addSupplier({
                id: 2,
                name: 'Equipos de Tostado Premium',
                email: 'maria@equipospremium.com',
                phone: '+51 923 456 789',
                location: 'Perú'
            });
            this.addSupplier({
                id: 3,
                name: 'Empaques del Valle',
                email: 'carlos@empaqueselvalle.com',
                phone: '+51 912 345 678',
                location: 'Perú'
            });
            this.addSupplier({
                id: 4,
                name: 'Agrícola San Martin',
                email: 'ana@agricolasm.com',
                phone: '+51 945 678 123',
                location: 'Perú'
            });
            this.addSupplier({
                id: 5,
                name: 'Distribuidora Peruana',
                email: 'felipe@distperuana.com',
                phone: '+51 976 543 210',
                location: 'Perú'
            });
            this.addSupplier({
                id: 6,
                name: 'Cafés Especiales SAC',
                email: 'lucia@cafesesp.com',
                phone: '+51 934 567 890',
                location: 'Perú'
            });
        }
    }

    // Load suppliers from localStorage
    static loadSuppliers() {
        const storedSuppliers = localStorage.getItem(this.STORAGE_KEY);
        if (storedSuppliers) {
            this.suppliers.value = JSON.parse(storedSuppliers);
        }
    }

    // Save suppliers to localStorage
    static saveSuppliers() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.suppliers.value));
    }

    // Get all suppliers
    static getSuppliers() {
        return this.suppliers;
    }

    // Get supplier by ID
    static getSupplierById(id) {
        console.log('Looking for supplier with ID:', id, 'Type:', typeof id);
        console.log('Available suppliers:', this.suppliers.value);

        // Ensure we're comparing the same types
        const supplierId = Number(id);
        const supplier = this.suppliers.value.find(s => Number(s.id) === supplierId);

        console.log('Found supplier:', supplier);
        return supplier;
    }

    // Add a new supplier
    static addSupplier(supplier) {
        // Generate new ID if not provided
        if (!supplier.id) {
            supplier.id = this.getNextId();
        }
        this.suppliers.value.push(supplier);
        this.saveSuppliers();
        return supplier;
    }

    // Update an existing supplier
    static updateSupplier(updatedSupplier) {
        const index = this.suppliers.value.findIndex(s => s.id === updatedSupplier.id);
        if (index !== -1) {
            this.suppliers.value[index] = updatedSupplier;
            this.saveSuppliers();
            return true;
        }
        return false;
    }

    // Delete a supplier
    static deleteSupplier(id) {
        const initialLength = this.suppliers.value.length;
        this.suppliers.value = this.suppliers.value.filter(s => s.id !== id);
        if (initialLength !== this.suppliers.value.length) {
            this.saveSuppliers();
            return true;
        }
        return false;
    }

    // Search suppliers by text
    static searchSuppliers(query) {
        if (!query) return this.suppliers.value;

        const searchText = query.toLowerCase();
        return this.suppliers.value.filter(supplier =>
            supplier.name.toLowerCase().includes(searchText) ||
            supplier.email.toLowerCase().includes(searchText) ||
            supplier.phone.toLowerCase().includes(searchText) ||
            supplier.location.toLowerCase().includes(searchText)
        );
    }

    // Helper method to get next ID
    static getNextId() {
        if (this.suppliers.value.length === 0) return 1;
        const maxId = Math.max(...this.suppliers.value.map(s => s.id));
        return maxId + 1;
    }
}