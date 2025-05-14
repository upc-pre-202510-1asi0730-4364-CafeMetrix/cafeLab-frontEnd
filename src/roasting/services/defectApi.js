const STORAGE_KEY = 'defects';  // Llave para acceder al almacenamiento local

// Función para cargar los defectos desde el localStorage
function loadDefects() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];  // Retorna los defectos o un array vacío
}

// Función para guardar los defectos en el localStorage
function saveDefects(defects) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defects));  // Guarda los defectos en el almacenamiento
}

// Obtener todos los defectos
export async function getDefects() {
    const defects = loadDefects();
    console.log("Defectos cargados:", defects);  // Verifica si los defectos están correctamente cargados
    return Promise.resolve(defects);  // Retorna los defectos cargados
}

// Agregar un nuevo defecto
export async function addDefect(newDefect) {
    const defects = loadDefects();
    defects.push(newDefect);  // Agrega el nuevo defecto
    saveDefects(defects);  // Guarda la lista actualizada de defectos
    console.log("Defecto agregado:", newDefect);  // Verifica si el nuevo defecto se agrega correctamente
    return Promise.resolve(newDefect);  // Retorna el defecto agregado
}

// Obtener un defecto por su ID
export async function getDefectById(id) {
    const defects = loadDefects();
    const defect = defects.find(def => def.id === id);
    console.log("Defecto encontrado:", defect);  // Verifica si se encuentra el defecto
    return Promise.resolve(defect);  // Devuelve el defecto con el ID correspondiente
}
