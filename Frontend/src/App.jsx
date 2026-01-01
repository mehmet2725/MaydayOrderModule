import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = "http://localhost:5005"; 

// urlden dükkan ismi al, yazmazsam standart olarak restoran1'i al
const urlParams = new URLSearchParams(window.location.search);
const TENANT_ID = urlParams.get('dukkan') || "restoran1";

const MENU_ITEMS = [
  { id: 1, name: "Adana Kebap", price: 220 },
  { id: 2, name: "Urfa Kebap", price: 200 },
  { id: 3, name: "Tavuk Şiş", price: 180 },
  { id: 4, name: "Lahmacun", price: 70 },
  { id: 5, name: "Ayran", price: 25 },
  { id: 6, name: "Şalgam", price: 30 },
  { id: 7, name: "Kola", price: 40 },
  { id: 8, name: "Künefe", price: 150 },
];

function App() {
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  
  // durum Yönetimi 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []); // Sayfa ilk açıldığında çalışır

  // 1. Siparişleri Getir
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/orders`, {
        headers: { 'tenant_id': TENANT_ID }
      });
      if (!response.ok) throw new Error("Veri çekilemedi!");
      
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError("Backend ile bağlantı kurulamadı! Lütfen sunucunun açık olduğundan emin olun.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2.sepete Ekle
  const addToCart = (item) => {
    const existing = cart.find(x => x.id === item.id);
    if (existing) {
      setCart(cart.map(x => x.id === item.id ? { ...x, count: x.count + 1 } : x));
    } else {
      setCart([...cart, { ...item, count: 1 }]);
    }
  };

  // sepet toplam tutarı hesabı
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.count), 0);

  // 3. Siparişi Gönder
  const submitOrder = async () => {
    if (cart.length === 0) return;

    setSubmitting(true);
    
    // Backende gönderilecek paket
    const orderData = {
      title: `Masa Siparişi - ${new Date().toLocaleTimeString()}`,
      totalAmount: cartTotal, 
      items: cart.map(item => ({
        productName: item.name,
        quantity: item.count,
        unitPrice: item.price
      }))
    };

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'tenant_id': TENANT_ID,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        setCart([]); // Sepeti temizle
        fetchOrders(); // Listeyi güncelle
        alert("✅ Sipariş başarıyla mutfağa iletildi!");
      } else {
        alert("❌ Sipariş gönderilemedi.");
      }
    } catch (err) {
      alert("Hata: Backend'e ulaşılamıyor.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 p-4">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-dark">🍽️ Mayday Adisyon Sistemi</h2>
        <span className="badge bg-info text-dark">Dükkan: {TENANT_ID}</span>
      </div>

      {error && (
        <div className="alert alert-danger text-center shadow-sm">
          <strong>⚠️ HATA:</strong> {error}
        </div>
      )}

      <div className="row">
        {/* SOL TARAF: MENÜ */}
        <div className="col-md-8">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white"><h5>🍕 Menü</h5></div>
            <div className="card-body">
              <div className="row g-3">
                {MENU_ITEMS.map(item => (
                  <div key={item.id} className="col-md-3 col-6">
                    <button 
                      className="btn btn-outline-dark w-100 h-100 py-3 fw-bold shadow-sm"
                      onClick={() => addToCart(item)}
                    >
                      {item.name} <br />
                      <span className="badge bg-success mt-2">{item.price} ₺</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SİPARİŞ LİSTESİ */}
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">📋 Son Siparişler</h5>
              <button className="btn btn-sm btn-light" onClick={fetchOrders} disabled={loading}>
                {loading ? 'Yükleniyor...' : '🔄 Yenile'}
              </button>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status"></div>
                  <p className="mt-2 text-muted">Siparişler yükleniyor...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="alert alert-warning text-center">Henüz hiç sipariş yok.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Tarih</th>
                        <th>İçerik</th>
                        <th>Tutar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice().reverse().map(order => (
                        <tr key={order.id}>
                          <td><strong>#{order.id}</strong></td>
                          <td>{new Date(order.createdDate).toLocaleTimeString('tr-TR')}</td>
                          <td>
                            {order.items.map((i, idx) => (
                              <div key={idx} className="small">
                                • {i.productName} <span className="text-muted">x{i.quantity}</span>
                              </div>
                            ))}
                          </td>
                          <td>
                            <span className={`badge fs-6 ${order.totalAmount > 0 ? 'bg-success' : 'bg-warning text-dark'}`}>
                              {order.totalAmount} ₺
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SAĞ TARAF: SEPET */}
        <div className="col-md-4">
          <div className="card shadow border-0 sticky-top" style={{top: '20px'}}>
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">🛒 Sepet</h5>
            </div>
            <div className="card-body p-0">
              {cart.length === 0 ? (
                <div className="text-center p-5 text-muted">Sepetiniz boş</div>
              ) : (
                <ul className="list-group list-group-flush">
                  {cart.map(item => (
                    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{item.name}</strong> <small className="text-muted">x{item.count}</small>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span>{item.price * item.count} ₺</span>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => {
                          setCart(cart.filter(x => x.id !== item.id));
                        }}>X</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="card-footer bg-white">
              <div className="d-flex justify-content-between fs-4 fw-bold mb-3">
                <span>Toplam:</span>
                <span className="text-danger">{cartTotal} ₺</span>
              </div>
              <button 
                className="btn btn-success w-100 btn-lg" 
                onClick={submitOrder}
                disabled={cart.length === 0 || submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Gönderiliyor...
                  </>
                ) : (
                  '✅ SİPARİŞİ ONAYLA'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;