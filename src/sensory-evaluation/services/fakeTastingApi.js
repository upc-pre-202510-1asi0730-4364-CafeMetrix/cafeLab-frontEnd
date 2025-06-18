export function getTastingData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                labels: ['0 min', '4 min', '8 min', '12 min', '16 min'], // Etiquetas del gráfico
                datasets: [
                    {
                        label: 'Núcleo de consistencia',
                        borderColor: 'rgba(0, 0, 255, 0.5)',
                        backgroundColor: 'rgba(0, 0, 255, 0.2)',
                        data: [30, 50, 70, 90, 110], // Datos del gráfico
                        fill: true,
                    },
                    {
                        label: 'Fuera de núcleo de coincidencia',
                        borderColor: 'rgba(255, 0, 0, 0.5)',
                        backgroundColor: 'rgba(255, 0, 0, 0.2)',
                        data: [40, 60, 80, 100, 120], // Datos del gráfico
                        fill: true,
                    },
                ],
            });
        }, 1000); // Simula un retraso de 1 segundo
    });
}
