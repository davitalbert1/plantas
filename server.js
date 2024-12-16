const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'info.json');

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'index'))); // Servir arquivos estáticos da pasta index

// Função para inicializar o arquivo JSON
function initializeJsonFile() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, '[]'); // Cria um JSON vazio se o arquivo não existir
    } else {
        try {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            JSON.parse(data); // Tenta fazer o parse para validar o arquivo
        } catch (error) {
            fs.writeFileSync(DATA_FILE, '[]'); // Recria o arquivo se estiver inválido
        }
    }
}

// Inicializa o arquivo JSON ao iniciar o servidor
initializeJsonFile();

// Rota para buscar plantas
app.get('/plants', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return res.status(500).send('Erro ao ler as plantas.');
        }
        res.json(JSON.parse(data));
    });
});

// Rota para adicionar planta
app.post('/add-plant', (req, res) => {
    const newPlant = req.body;

    if (!newPlant.name || !newPlant.frequency) {
        return res.status(400).send('Nome e frequência são obrigatórios.');
    }

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return res.status(500).send('Erro ao salvar a planta.');
        }

        let plants = [];
        if (data) {
            try {
                plants = JSON.parse(data);
            } catch (parseError) {
                console.error('Erro ao parsear o JSON:', parseError);
                return res.status(500).send('Erro ao processar os dados do arquivo.');
            }
        }

        plants.push(newPlant);

        fs.writeFile(DATA_FILE, JSON.stringify(plants, null, 2), (err) => {
            if (err) {
                console.error('Erro ao salvar a planta:', err);
                return res.status(500).send('Erro ao salvar a planta.');
            }

            res.status(200).send('Planta adicionada com sucesso.');
        });
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Abra o arquivo HTML em http://localhost:${PORT}/index.html`);
});