-- Criando o banco de dados
CREATE DATABASE CafeDelivery;
GO

-- Usando o banco de dados
USE CafeDelivery;
GO

-- Tabela de clientes
CREATE TABLE Clientes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nome NVARCHAR(100) NOT NULL,
    telefone NVARCHAR(15),
    email NVARCHAR(100) UNIQUE,
    endereco NVARCHAR(MAX) NOT NULL
);
GO

-- Tabela de produtos
CREATE TABLE Produtos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nome NVARCHAR(100) NOT NULL,
    descricao NVARCHAR(MAX),
    preco DECIMAL(10, 2) NOT NULL
);
GO

-- Tabela de pedidos
CREATE TABLE Pedidos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    cliente_id INT NOT NULL,
    data_pedido DATETIME DEFAULT GETDATE(),
    status NVARCHAR(20) DEFAULT 'Pendente',
    total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES Clientes(id)
);
GO

-- Tabela de entregas
CREATE TABLE Entregas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    pedido_id INT NOT NULL,
    status_entrega NVARCHAR(20) DEFAULT 'Pendente',
    horario_previsto DATETIME,
    FOREIGN KEY (pedido_id) REFERENCES Pedidos(id)
);
GO

-- Inserindo dados de exemplo (opcional)
INSERT INTO Clientes (nome, telefone, email, endereco)
VALUES 
    ('João Silva', '31988887777', 'joao.silva@example.com', 'Rua das Flores, 123');
GO

INSERT INTO Produtos (nome, descricao, preco)
VALUES 
    ('Café Espresso', 'Café forte e puro', 5.50),
    ('Cappuccino', 'Café com leite cremoso e chocolate', 8.00),
    ('Croissant', 'Croissant de manteiga', 4.00);
GO

INSERT INTO Pedidos (cliente_id, total)
VALUES (1, 13.50);
GO

INSERT INTO Entregas (pedido_id, status_entrega, horario_previsto)
VALUES (1, 'Saiu para entrega', '2024-11-28 15:00:00');
GO
