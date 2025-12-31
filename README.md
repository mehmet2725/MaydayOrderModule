# Mayday Sipariş Yönetim Modülü 



Bu proje, Mayday Yazılım yetkinlik değerlendirmesi kapsamında geliştirilmekte olan "Mini Sipariş Yönetim Modülü"dür. Proje şu an geliştirme aşamasındadır (Work In Progress).



## 🚀 Proje Hakkında

Basit bir \*\*Multi-Tenant (Çoklu Kiracı)\*\* yapısına sahip sipariş yönetim sistemidir. 

- *\*Backend:*\* .NET Core Web API (ASP.NET Core)

- *\*Veritabanı:*\* SQLite (Taşınabilirlik ve hız için seçildi)

- *\*Frontend:*\* React (Geliştirme aşamasında)



## 📂 Mimari Yaklaşım

Backend tarafında "Clean Architecture" prensiplerine sadık kalınarak, sorumluluklar katmanlara ayrılmıştır:

- *\*Entities:*\* Veritabanı varlıkları (Order, OrderItem)

- *\*Data:*\* Entity Framework Core konfigürasyonları

- *\*Controllers:*\* API uç noktaları ve Tenant filtreleme mantığı



## 🛠️ Kurulum ve Çalıştırma

*(Proje tamamlandığında burası güncellenecektir)\*



1\. Repoyu klonlayın.

2\. Backend klasöründe `dotnet watch run` komutunu çalıştırın.

3\. Swagger arayüzü üzerinden test edilebilir.



\## 📝 Geliştirme Süreci ve Notlar

Şu an Backend mimarisi (Entity, Data, Controller katmanları) kurgulanmıştır.



*\*Tamamlananlar:\*\*

- \[x] Backend proje kurulumu ve temizliği.

- \[x] Veritabanı tablolarının (Entities) tasarımı.

- \[x] DbContext ve SQLite konfigürasyonu.

- \[x] Sipariş oluşturma ve Listeleme endpoint'leri.

- \[x] TenantID (İşletme) bazlı veri izolasyonu.



*\*Eksik Kalan / Yapılacaklar:\*\*

- \[ ] `Program.cs` servis kayıtlarının tamamlanması.

- \[ ] Veritabanı migration işlemleri.

- \[ ] Frontend (React) geliştirmesi.

- \[ ] Test süreçleri.



## 💡 Karşılaşılan Zorluklar

Projenin mimarisini kurgularken, "Basit ama genişletilebilir" dengesini kurmak üzerine yoğunlaştım. Özellikle `TenantId` kontrolünün güvenli bir şekilde `Header` üzerinden yönetilmesi önceliklendirildi.



---

*Geliştirici: Mehmet Sönmez\*

