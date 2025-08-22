import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';

const app = express();
const port = 3206;  // Porta para o backend

// Configuração do CORS
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'cpmestoque2025.',
  database: 'ControleEstoque',
});

// Conexão com o banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro de conexão com o banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});


// Endpoint para cadastrar fornecedor
app.post('/api/fornecedores', (req, res) => {
  const { CNPJ, Nome, Endereco, Telefone, Email } = req.body;
  
  const query = `INSERT INTO Fornecedores (CNPJ, Nome, Endereco, Telefone, Email) 
                 VALUES (?, ?, ?, ?, ?)`;

  db.query(query, [CNPJ, Nome, Endereco, Telefone, Email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao cadastrar fornecedor', error: err });
    }
    res.status(201).json({ message: 'Fornecedor cadastrado com sucesso', result });
  });
});

// Endpoint para listar fornecedores
app.get('/api/fornecedores', (req, res) => {
  const query = 'SELECT * FROM Fornecedores';

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao consultar fornecedores', error: err });
    }
    res.status(200).json(results);
  });
});

// Endpoint para cadastrar material
app.post('/api/materiais', (req, res) => {
  const { Nome, Unidade_de_Medida, Estoque_Minimo } = req.body;

  const query = `INSERT INTO Materiais (Nome, Unidade_de_Medida, Estoque_Minimo)
                 VALUES (?, ?, ?)`;

  db.query(query, [Nome, Unidade_de_Medida, Estoque_Minimo], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao cadastrar material', error: err });
    }
    res.status(201).json({ message: 'Material cadastrado com sucesso', result });
  });
});

// Endpoint para listar materiais
app.get('/api/materiais', (req, res) => {
  const query = 'SELECT * FROM Materiais';

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao consultar materiais', error: err });
    }
    res.status(200).json(results);
  });
});

// Endpoint para adicionar o estoque de um material
app.put('/api/estoque', (req, res) => {
  const { ID_Material, Quantidade } = req.body;

  const query = `UPDATE Estoques 
                 SET Quantidade = Quantidade + ? 
                 WHERE ID_Material = ?`;

  db.query(query, [Quantidade, ID_Material], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao atualizar estoque', error: err });
    }
    res.status(200).json({ message: 'Estoque atualizado com sucesso', result });
  });
});

// Endpoint para consultar estoque por material e depósito
app.get('/api/estoques', (req, res) => {
  const query = `SELECT e.ID_Estoque, m.Nome AS Material, d.Nome AS Deposito, e.Quantidade
                 FROM Estoques e
                 JOIN Materiais m ON e.ID_Material = m.ID_Material
                 JOIN Depositos d ON e.ID_Deposito = d.ID_Deposito`;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao consultar estoques', error: err });
    }
    res.status(200).json(results);
  });
});

// Endpoint para transferir material entre depósitos
app.post('/api/transferencias', (req, res) => {
  const { ID_Material, ID_Deposito_Origem, ID_Deposito_Destino, Quantidade } = req.body;

  // Atualizar o estoque de origem
  const queryOrigem = `UPDATE Estoques 
                       SET Quantidade = Quantidade - ? 
                       WHERE ID_Material = ? AND ID_Deposito = ?`;

  // Atualizar o estoque de destino
  const queryDestino = `UPDATE Estoques 
                        SET Quantidade = Quantidade + ? 
                        WHERE ID_Material = ? AND ID_Deposito = ?`;

  db.query(queryOrigem, [Quantidade, ID_Material, ID_Deposito_Origem], (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao transferir material', error: err });

    db.query(queryDestino, [Quantidade, ID_Material, ID_Deposito_Destino], (err2) => {
      if (err2) return res.status(500).json({ message: 'Erro ao transferir material', error: err2 });

      res.status(200).json({ message: 'Material transferido com sucesso' });
    });
  });
});
