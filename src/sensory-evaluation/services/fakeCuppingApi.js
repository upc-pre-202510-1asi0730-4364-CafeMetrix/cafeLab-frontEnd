let cuppings = [
    {
        id: 1,
        nombre: 'Cata Andes',
        fecha: '2024-10-10',
        origen: 'Cajamarca',
        variedad: 'Bourbon',
        favorita: false
    },
    {
        id: 2,
        nombre: 'Cata Huánuco',
        fecha: '2024-11-01',
        origen: 'Huánuco',
        variedad: 'Caturra',
        favorita: false
    },
    {
        id: 3,
        nombre: 'Cusco Blend',
        fecha: '2025-01-15',
        origen: 'Cusco',
        variedad: 'Geisha',
        favorita: true
    },
    {
        id: 4,
        nombre: 'Valle Sur',
        fecha: '2025-03-05',
        origen: 'Puno',
        variedad: 'Typica',
        favorita: false
    }
]

export async function fetchFakeCuppings() {
    return Promise.resolve(cuppings)
}

export async function addFakeCuppingSession(newSession) {
    const id = cuppings.length + 1
    const session = { id, ...newSession }
    cuppings.push(session)
    return Promise.resolve(session)
}

export async function updateFakeCuppingSession(id, updatedData) {
    const index = cuppings.findIndex(s => s.id === id)
    if (index !== -1) {
        cuppings[index] = { ...cuppings[index], ...updatedData }
        return Promise.resolve(cuppings[index])
    }
    return Promise.reject(new Error('Sesión no encontrada'))
}
