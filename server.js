require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public')); // Serve o seu HTML

// Conexão MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://SEU_MONGO_URI_AQUI')
    .then(() => console.log('MongoDB Conectado'))
    .catch(err => console.error(err));

// Modelo do Item (Schema)
const ItemSchema = new mongoose.Schema({
    id: Number,
    type: String,
    name: String,
    img: String,
    parent: Number
});

const Item = mongoose.model('Item', ItemSchema);

// ITENS PADRÃO (Se o banco estiver vazio, cria estes)
const DEFAULT_ITEMS = [
    { id: 1, type: 'product', name: 'Robux', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Robux_2019_Logo_gold.svg/1200px-Robux_2019_Logo_gold.svg.png', parent: 0 },
    { id: 2, type: 'product', name: 'Tapete Steal a Brainrot', img: 'https://tr.rbxcdn.com/180DAY-21db24dd8b8664aa2ab34aeb640c54fd/420/420/Gear/Png/noFilter', parent: 0 },
    { id: 3, type: 'category', name: 'Blox Fruits', img: 'https://www.bloxfruits.net/wp-content/uploads/2023/11/cropped-Blox_Fruits_logo.png', parent: 0 },
    { id: 4, type: 'product', name: 'Plants vs Brainrots', img: 'https://cdn.selectgame.net/wp-content/uploads/2025/09/Sneak-Peeks-Plants-vs-Brainrots-no-sabado-20-09.webp', parent: 0 },
    { id: 5, type: 'product', name: 'Steal a Brainrot', img: 'https://static.wikia.nocookie.net/stealabr/images/5/58/Strawberryelephant.png/revision/latest/smart/width/250/height/250?cb=20250830235735', parent: 0 }
];

// API Routes
app.get('/api/items', async (req, res) => {
    let items = await Item.find({});
    if (items.length === 0) {
        await Item.insertMany(DEFAULT_ITEMS);
        items = await Item.find({});
    }
    res.json(items);
});

app.post('/api/items', async (req, res) => {
    const { id, type, name, img, parent } = req.body;
    // Tenta atualizar, se não existir, cria (upsert)
    await Item.findOneAndUpdate({ id: id }, { type, name, img, parent }, { upsert: true, new: true });
    res.json({ success: true });
});

app.delete('/api/items/:id', async (req, res) => {
    await Item.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
