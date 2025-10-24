class AIAssistant {
    constructor() {
        this.chatContainer = document.getElementById('aiChat');
        this.inputElement = document.getElementById('aiInput');
        this.sendButton = document.querySelector('.ai-input button');

        // AI Responses Database
        this.responses = {
            greetings: [
                "Halo! Saya Noxxa AI Assistant. Ada yang bisa saya bantu hari ini?",
                "Selamat datang! Saya siap membantu analisis bisnis Anda.",
                "Hai! Mari kita optimalkan bisnis Anda bersama."
            ],
            sales: [
                "Berdasarkan analisis data, penjualan Anda bulan ini meningkat 12.5% dibandingkan bulan lalu. Produk laptop ASUS ROG menjadi kontributor terbesar.",
                "Prediksi penjualan untuk bulan depan diperkirakan akan meningkat sebesar 15-20% berdasarkan tren historis.",
                "Saya menemukan pola pembelian pelanggan yang menarik: pelanggan yang membeli laptop cenderung juga membeli mouse gaming.",
                "Untuk meningkatkan penjualan, saya sarankan untuk membuat bundle package laptop + aksesoris dengan diskon 10%."
            ],
            inventory: [
                "Saya merekomendasikan untuk menambah stok keyboard mechanical karena stok saat ini sudah rendah dan permintaan tinggi.",
                "Stok produk Anda saat ini dalam kondisi baik. Hanya 3 produk yang perlu segera diisi ulang.",
                "Untuk mengoptimalkan inventory, saya sarankan untuk menerapkan sistem just-in-time untuk produk dengan permintaan stabil.",
                "Berdasarkan data penjualan 3 bulan terakhir, stok optimal untuk mouse gaming adalah sekitar 120-150 unit."
            ],
            finance: [
                "Margin keuntungan rata-rata Anda saat ini adalah 37.4%, ini sudah sangat baik untuk industri retail.",
                "Analisis keuangan menunjukkan bahwa pengeluaran operasional Anda efisien. Rasio biaya terhadap pendapatan hanya 62.6%.",
                "Saya merekomendasikan untuk mengalokasikan 20% dari laba bulan ini untuk investasi pemasaran digital.",
                "Cash flow Anda sehat dengan rasio current ratio 2.3, artinya aset lancar Anda 2.3x lebih besar dari liabilitas lancar."
            ],
            employees: [
                "Departemen keuangan Anda memiliki performa yang baik dengan tingkat akurasi pelaporan 98.5%.",
                "Productivity karyawan Anda meningkat 8% setelah implementasi sistem baru. Pertahankan momentum ini!",
                "Saya menemukan bahwa karyawan di departemen sales memiliki tingkat kepuasan kerja tertinggi (4.2/5).",
                "Untuk meningkatkan retensi karyawan, saya sarankan untuk menambah program training dan development."
            ],
            general: [
                "Saya adalah AI yang dilatih khusus untuk membantu bisnis retail dan manajemen operasional.",
                "Anda bisa bertanya tentang analisis penjualan, manajemen inventory, laporan keuangan, atau saksi bisnis lainnya.",
                "Data saya selalu diperbarui secara real-time, jadi Anda mendapatkan informasi terkini.",
                "Saya juga bisa membantu membuat prediksi dan rekomendasi berdasarkan pola data yang ada."
            ]
        };

        this.quickActions = [
            { text: "Lihat laporan penjualan", category: "sales" },
            { text: "Cek stok produk", category: "inventory" },
            { text: "Analisis keuangan", category: "finance" },
            { text: "Performa karyawan", category: "employees" },
            { text: "Prediksi bisnis", category: "general" }
        ];

        this.init();
    }

    init() {
        // Add quick actions
        this.addQuickActions();

        // Add AI status
        this.addAIStatus();

        // Add welcome message with timestamp
        this.addTimestampToLastMessage();
    }

    addQuickActions() {
        const quickActionsContainer = document.createElement('div');
        quickActionsContainer.className = 'ai-quick-actions';

        this.quickActions.forEach(action => {
            const button = document.createElement('button');
            button.className = 'quick-action-btn';
            button.textContent = action.text;
            button.onclick = () => this.handleQuickAction(action);
            quickActionsContainer.appendChild(button);
        });

        this.chatContainer.appendChild(quickActionsContainer);
    }

    addAIStatus() {
        const statusContainer = document.createElement('div');
        statusContainer.className = 'ai-status';
        statusContainer.innerHTML = `
            <span class="status-dot"></span>
            <span>Noxxa AI Online</span>
        `;

        this.chatContainer.parentNode.appendChild(statusContainer);
    }

    handleQuickAction(action) {
        this.inputElement.value = action.text;
        this.sendMessage();
    }

    sendMessage() {
        const message = this.inputElement.value.trim();
        if (message === '') return;

        // Add user message
        this.addMessage(message, 'user');

        // Clear input
        this.inputElement.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Simulate AI thinking
        setTimeout(() => {
            this.removeTypingIndicator();
            const response = this.generateResponse(message);
            this.addMessage(response, 'ai');
        }, 1000 + Math.random() * 1000); // Random delay 1-2 seconds
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message message-${sender}`;

        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        bubbleDiv.textContent = content;

        messageDiv.appendChild(bubbleDiv);

        // Add timestamp
        const timestamp = document.createElement('div');
        timestamp.className = `message-timestamp message-${sender}`;
        timestamp.textContent = this.getCurrentTime();
        messageDiv.appendChild(timestamp);

        this.chatContainer.appendChild(messageDiv);
        this.scrollToBottom();

        // Add typing animation for AI messages
        if (sender === 'ai') {
            bubbleDiv.style.animation = 'none';
            setTimeout(() => {
                bubbleDiv.style.animation = 'slideIn 0.3s ease';
            }, 10);
        }
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message message-ai';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;

        this.chatContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();

        // Keyword-based response selection
        if (lowerMessage.includes('penjualan') || lowerMessage.includes('sales')) {
            return this.getRandomResponse('sales');
        } else if (lowerMessage.includes('stok') || lowerMessage.includes('inventory')) {
            const jitRecommendations = this.getJITRecommendations();
            let response = this.getRandomResponse('inventory');
            if (jitRecommendations.length > 0) {
                response += "\n\nBerdasarkan sistem just-in-time untuk produk dengan permintaan stabil:\n" + jitRecommendations.join('\n');
            } else {
                response += "\n\nSistem just-in-time: Semua produk dengan permintaan stabil memiliki stok optimal.";
            }
            return response;
        } else if (lowerMessage.includes('keuangan') || lowerMessage.includes('finance') || lowerMessage.includes('laba')) {
            return this.getRandomResponse('finance');
        } else if (lowerMessage.includes('karyawan') || lowerMessage.includes('employee')) {
            return this.getRandomResponse('employees');
        } else if (lowerMessage.includes('hai') || lowerMessage.includes('halo') || lowerMessage.includes('hello')) {
            return this.getRandomResponse('greetings');
        } else {
            return this.getRandomResponse('general');
        }
    }

    getRandomResponse(category) {
        const responses = this.responses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getJITRecommendations() {
        // Simulate JIT analysis for products with stable demand
        // In a real implementation, this would analyze sales data patterns
        const recommendations = [];

        // Get inventory data from localStorage (assuming it's stored there)
        const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        const transaksiData = JSON.parse(localStorage.getItem('transaksiData')) || [];

        // Analyze products with stable demand patterns
        inventory.forEach(item => {
            // Calculate average monthly sales for the last 3 months
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

            const recentSales = transaksiData.filter(t => {
                const transDate = new Date(t.tanggal);
                return transDate >= threeMonthsAgo && t.items.some(transItem => transItem.nama === item.nama);
            });

            const totalSold = recentSales.reduce((sum, t) => {
                const itemInTrans = t.items.find(transItem => transItem.nama === item.nama);
                return sum + (itemInTrans ? itemInTrans.qty : 0);
            }, 0);

            const avgMonthlySales = totalSold / 3;

            // Consider stable demand if sales variation is low (simplified logic)
            if (avgMonthlySales > 0) {
                const optimalStock = Math.ceil(avgMonthlySales * 1.5); // 1.5 months buffer
                const reorderPoint = Math.ceil(avgMonthlySales * 0.5); // Reorder when 0.5 months left

                if (item.stok <= reorderPoint) {
                    recommendations.push(`• ${item.nama}: Stok saat ini ${item.stok}, reorder point ${reorderPoint}, optimal ${optimalStock}`);
                }
            }
        });

        return recommendations;
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    addTimestampToLastMessage() {
        const messages = this.chatContainer.querySelectorAll('.chat-message');
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (!lastMessage.querySelector('.message-timestamp')) {
                const timestamp = document.createElement('div');
                timestamp.className = 'message-timestamp message-ai';
                timestamp.textContent = this.getCurrentTime();
                lastMessage.appendChild(timestamp);
            }
        }
    }

    scrollToBottom() {
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    // Additional utility methods
    clearChat() {
        this.chatContainer.innerHTML = '';
        this.addQuickActions();
        this.addMessage("Halo! Saya Noxxa AI Assistant. Ada yang bisa saya bantu hari ini?", 'ai');
    }

    exportChat() {
        const messages = this.chatContainer.querySelectorAll('.chat-message');
        let chatText = 'Noxxa AI Assistant - Chat History\n';
        chatText += '=' .repeat(50) + '\n\n';

        messages.forEach(msg => {
            const isAI = msg.classList.contains('message-ai');
            const sender = isAI ? 'AI Assistant' : 'You';
            const content = msg.querySelector('.message-bubble').textContent;
            const timestamp = msg.querySelector('.message-timestamp').textContent;

            chatText += `[${timestamp}] ${sender}: ${content}\n\n`;
        });

        // Create and download file
        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `noxxa-ai-chat-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Global functions for HTML onclick events
function sendAIMessage() {
    if (window.aiAssistant) {
        window.aiAssistant.sendMessage();
    }
}

function handleAIInput(event) {
    if (event.key === 'Enter') {
        sendAIMessage();
    }
}

// Initialize AI Assistant when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AI Assistant for NoxAI page
    if (document.getElementById('aiChat')) {
        window.aiAssistant = new AIAssistant();
    }
});

// Make AI Assistant globally accessible
window.AIAssistant = AIAssistant;

const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const navLinks = document.querySelectorAll('.sidebar-menu a');

hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

closeSidebar.addEventListener('click', () => {
    sidebar.classList.remove('open');
});

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});

function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop();
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

setActiveLink();

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        navLinks.forEach(l => l.classList.remove('active'));
        e.target.closest('a').classList.add('active');
    });
});

function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

function updateLoginStatus() {
    const username = localStorage.getItem('username');
    const usernameDisplay = document.getElementById('username-display');
    const loginBtn = document.querySelector('.login-btn');
    if (isLoggedIn() && username) {
        loginBtn.textContent = 'Logout';
        loginBtn.href = '#';
        if (usernameDisplay) {
            usernameDisplay.textContent = `Welcome, ${username}`;
        }
    } else {
        loginBtn.textContent = 'Login / Register';
        loginBtn.href = 'login.html';
        if (usernameDisplay) {
            usernameDisplay.textContent = '';
        }
    }
}

updateLoginStatus();

const loginBtn = document.querySelector('.login-btn');
loginBtn.addEventListener('click', (e) => {
    if (isLoggedIn()) {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        updateLoginStatus();
        alert('Logged out successfully.');
    }
});
