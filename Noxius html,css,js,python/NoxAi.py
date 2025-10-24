from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

import re

def get_ai_response(message):
    msg = message.lower()
    # Improved matching using regex for better accuracy
    if re.search(r'\b(inventory|stok|barang|manajemen inventory)\b', msg):
        return "Tips mengelola inventory yang baik: Lakukan stock opname rutin setiap bulan, gunakan sistem FIFO (First In, First Out) untuk barang habis pakai, monitor stok minimum dan maksimum untuk menghindari kekurangan atau kelebihan stok, serta gunakan software manajemen inventory untuk tracking real-time."
    elif re.search(r'\b(analisis keuangan|analisis|keuangan)\b', msg) and ('analisis' in msg or 'keuangan' in msg):
        return "Untuk analisis keuangan: Hitung rasio profitabilitas seperti ROI dan margin laba, analisis arus kas, bandingkan pendapatan vs pengeluaran, dan gunakan tools seperti spreadsheet atau software akuntansi untuk proyeksi keuangan."
    elif re.search(r'\b(keuangan global|global|internasional|pasar saham)\b', msg):
        return "Keuangan global melibatkan pasar saham internasional, mata uang asing, dan ekonomi makro. Tips: Diversifikasi investasi, pantau indeks seperti S&P 500 atau Nikkei, pahami dampak inflasi dan suku bunga, serta gunakan platform trading untuk investasi global."
    elif re.search(r'\b(tips|saran|bisnis|investasi|pengelolaan keuangan)\b', msg):
        return "Tips umum: Tetap disiplin dalam pengelolaan keuangan, investasi jangka panjang, hindari utang berlebih, dan edukasi diri tentang pasar. Untuk bisnis, fokus pada efisiensi operasional dan inovasi."
    else:
        return "Maaf, saya tidak mengerti pertanyaan Anda. Coba tanyakan tentang manajemen inventory, analisis keuangan, keuangan global, atau minta tips bisnis."

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    message = data.get('message', '')
    response = get_ai_response(message)
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Different port if needed
