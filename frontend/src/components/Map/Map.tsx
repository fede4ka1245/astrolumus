export function createMap(container: HTMLDivElement, lat: number, lon: number) {
  // Очищаем предыдущую карту
  container.innerHTML = '';

  // Создаем iframe с OpenStreetMap
  const iframe = document.createElement('iframe');
  iframe.width = '100%';
  iframe.height = '100%';
  iframe.frameBorder = '0';
  iframe.style.border = 'none';
  // Используем bbox для зума и marker для отображения точки
  const bbox = `${lon - 0.01},${lat - 0.01},${lon + 0.01},${lat + 0.01}`;
  iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
  
  container.appendChild(iframe);
}
