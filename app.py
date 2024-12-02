from flask import Flask, request, jsonify
import pyodbc
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

conn_str = (
    "Driver={ODBC Driver 17 for SQL Server};"
    "Server=DESKTOP-TH\\SQLEXPRESS;"
    "Database=CafeDelivery;"
    "Trusted_Connection=yes;"
)
conn = pyodbc.connect(conn_str)
cursor = conn.cursor()

@app.route('/produtos', methods=['GET'])
def listar_produtos():
    try:
        cursor.execute("SELECT id, nome, descricao, preco FROM Produtos")
        rows = cursor.fetchall()
        
        produtos = []
        for row in rows:
            produtos.append({
                "id": row.id,
                "nome": row.nome,
                "descricao": row.descricao,
                "preco": float(row.preco) if row.preco is not None else None
            })
        return jsonify(produtos), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/produtos/<int:produto_id>', methods=['GET'])
def obter_produto(produto_id):
    try:
        cursor.execute("SELECT id, nome, descricao, preco FROM Produtos WHERE id = ?", (produto_id,))
        row = cursor.fetchone()
        
        if not row:
            return jsonify({"error": "Produto não encontrado"}), 404
        
        produto = {
            "id": row.id,
            "nome": row.nome,
            "descricao": row.descricao,
            "preco": float(row.preco) if row.preco is not None else None
        }
        return jsonify(produto), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/pedidos', methods=['POST'])
def criar_pedido():
    dados = request.json
    cliente_id = dados.get('cliente_id')
    total = dados.get('total')
    if not cliente_id or total is None:
        return jsonify({"error": "Dados inválidos. Verifique 'cliente_id' e 'total'."}), 400

    try:
        cursor.execute(
            "INSERT INTO Pedidos (cliente_id, total) VALUES (?, ?)",
            (cliente_id, total)
        )
        conn.commit()
        return jsonify({"message": "Pedido criado com sucesso!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/entregas/<int:pedido_id>', methods=['PUT'])
def atualizar_status_entrega(pedido_id):
    dados = request.json
    novo_status = dados.get('status_entrega')
    if not novo_status:
        return jsonify({"error": "Dados inválidos. Verifique 'status_entrega'."}), 400

    try:
        cursor.execute(
            "UPDATE Entregas SET status_entrega = ? WHERE pedido_id = ?",
            (novo_status, pedido_id)
        )
        conn.commit()
        return jsonify({"message": "Status de entrega atualizado com sucesso!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
