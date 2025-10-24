from flask import Flask, request, jsonify, send_from_directory, make_response
import pandas as pd
app = Flask(__name__)

@app.route('/')
def index():
    return send_from_directory('.', 'inventory.html')

@app.route('/inventory.html')
def serve_inventory():
    return send_from_directory('.', 'inventory.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

@app.route('/upload', methods=['OPTIONS'])
def upload_options():
    response = make_response()
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
    return response

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        response = jsonify({'error': 'File tidak ditemukan!'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400

    file = request.files['file']
    if file.filename == '':
        response = jsonify({'error': 'Nama file kosong!'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400

    try:
        df = pd.read_excel(file)
    except Exception as e:
        response = jsonify({'error': f'Gagal baca file Excel: {str(e)}'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400

    # Semua nama kolom diubah ke huruf kecil, menghindari agar tidak case sensitive
    df.columns = [col.lower() for col in df.columns]

    # Mapping nama kolom
    col_map = {
        'nama barang': 'nama',
        'jumlah stok': 'stok',
        'minimal stok': 'minStok',
        'maksimum stok': 'maxStok',
        'harga barang' : 'harga'
    }

    # Cek semua kolom wajib ada
    if not all(col in df.columns for col in col_map):
        response = jsonify({'error': f'File Excel harus punya kolom: {list(col_map.keys())}'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400

    df = df.rename(columns=col_map)

    try:
        df['stok'] = df['stok'].apply(lambda x: max(0, int(x)))
        df['minStok'] = df['minStok'].astype(int)
        df['maxStok'] = df['maxStok'].astype(int)
        df = df[df['minStok'] < df['maxStok']]
    except Exception as e:
        response = jsonify({'error': f'Format data tidak valid: {str(e)}'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400

    data = df.to_dict(orient='records')
    response = jsonify(data)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

if __name__ == '__main__':
    app.run(debug=True, port=5000)
