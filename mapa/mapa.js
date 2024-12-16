const svg = d3.select("#map")
    .attr("height", "100px");

// Obter as dimensões do elemento #map
const { width, height } = svg.node().getBoundingClientRect();

// Definir a projeção com escala e tradução ajustadas
const projection = d3.geoMercator()
    .scale((width / 2) / Math.PI) // Ajustar a escala com base na largura
    .translate([width / 2, height / 2]); // Centralizar a projeção

const path = d3.geoPath().projection(projection);

// Criação de um grupo para o mapa
const g = svg.append("g").attr("id", "globo");

// Carregar o arquivo JSON localmente
d3.json("../data/world-110m.json").then(data => {
    g.selectAll("path")
        .data(topojson.feature(data, data.objects.countries).features)
        .enter().append("path")
        .attr("d", path)
        .attr("fill", "#ccc")
        .attr("stroke", "#333")
        .attr("stroke-width", 0.5);
}).catch(error => {
    console.error('Erro ao carregar o arquivo JSON:', error);
});

// Variável para armazenar o círculo
let currentCircle = null;

// Função para determinar o tipo de clima
function getClimateType(latitude, longitude) {
    // Clima Equatorial
    if (latitude >= -10 && latitude <= 10) {
        return "Clima Equatorial";
    } 
    // Clima Desértico
    else if (
        ((latitude > 20 && latitude <= 30) || (latitude >= -30 && latitude <= -20)) &&
        ((longitude >= -20 && longitude <= 40) || (longitude >= 110 && longitude <= 150))
    ) {
        return "Clima Desértico";
    }
    // Clima Semiárido
    else if (
        ((latitude > 20 && latitude <= 30) || (latitude >= -30 && latitude <= -20)) &&
        ((longitude >= -120 && longitude <= -70) || (longitude >= 10 && longitude <= 50))
    ) {
        return "Clima Semiárido";
    }
    // Clima Mediterrâneo - antes de Subtropical
    else if (
        ((latitude > 30 && latitude <= 45) || (latitude >= -45 && latitude <= -30)) &&
        ((longitude >= -10 && longitude <= 40) || (longitude >= -130 && longitude <= -110))
    ) {
        return "Clima Mediterrâneo";
    }
    // Clima Tropical
    else if ((latitude > 10 && latitude <= 23.5) || (latitude >= -23.5 && latitude < -10)) {
        return "Clima Tropical";
    } 
    // Clima Subtropical
    else if ((latitude > 23.5 && latitude <= 35) || (latitude >= -35 && latitude < -23.5)) {
        return "Clima Subtropical";
    } 
    // Clima Temperado
    else if ((latitude > 35 && latitude <= 60) || (latitude >= -60 && latitude <= -35)) {
        return "Clima Temperado";
    } 
    // Clima Frio
    else if ((latitude > 60 && latitude <= 70) || (latitude < -60 && latitude >= -70)) {
        return "Clima Frio";
    } 
    // Clima Polar
    else if (latitude > 70 || latitude < -70) {
        return "Clima Polar";
    } 
    // Clima de Montanha
    else {
        return "Clima de Montanha";
    }
}

// Evento de clique para obter coordenadas e tipo de clima
svg.on("click", (event) => {
    const [x, y] = d3.pointer(event);
    const coords = projection.invert([x, y]);

    // Obter latitude e longitude
    const latitude = coords[1];
    const longitude = coords[0];

    // Determinar o tipo de clima
    const climateType = getClimateType(latitude, longitude);

    // Exibir as coordenadas e o tipo de clima
    const coordinatesDiv = d3.select("#coordinates");
    coordinatesDiv.text(`Coordenadas: Latitude ${latitude.toFixed(2)}, Longitude ${longitude.toFixed(2)} | Tipo de clima: ${climateType}`);

    // Remover o círculo anterior, se existir
    if (currentCircle) {
        currentCircle.remove();
    }
    // Adicionar um novo círculo no local clicado, ajustando as coordenadas para o zoom
    const transformedCoords = projection([longitude, latitude]);
    currentCircle = g.append("circle")
        .attr("cx", transformedCoords[0])
        .attr("cy", transformedCoords[1])
        .attr("r", 5) // Raio do círculo
        .attr("fill", " red") // Cor do círculo
        .attr("fill-opacity", 0.5) // Opacidade do preenchimento
        .attr("stroke", "black") // Cor da borda
        .attr("stroke-width", 1); // Largura da borda

    // Criar um objeto com as informações
    const info = {
        latitude: latitude,
        longitude: longitude,
        climateType: climateType
    };

    // Enviar as informações para o servidor
    fetch('/save-info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(info)
    })
    .then(response => response.text())
    .then(data => {
        console.log(data); // Exibir a resposta do servidor
    })
    .catch(error => {
        console.error('Erro ao salvar as informações:', error);
    });
});