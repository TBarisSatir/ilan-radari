# İlan Radarı

Günlük taramayla bulunan iş ilanlarını tek sayfada toplayan, başvuru sürecini takip eden ve başvuru istatistiklerini raporlayan kişisel bir pano. Sayfa bir [claude.ai](https://claude.ai) artifact'i olarak çalışır.

<!-- EKRAN GÖRÜNTÜSÜ: ana görünüm (ilan listesi)
     Dosyayı docs/screenshots/ altına koyup aşağıdaki satırın yorumunu kaldır. -->
<!-- ![İlan listesi](docs/screenshots/ilanlar.png) -->

## Özellikler

- **İlan listesi:** Her ilan eşleşme puanı, alan, çalışma şekli, lokasyon ve neden eşleştiğini anlatan kısa bir açıklamayla gelir.
- **Durum sekmeleri:** Yeni, Başvurdum, İlgilenmiyorum ve Tümü. "Başvurdum" veya "İlgilenmiyorum" olarak işaretlenen ilan bir daha önerilmez.
- **Arama, sıralama ve filtreler:** Şirket, pozisyon veya not içinde arama; tarihe ya da puana göre sıralama; favori, not, alan, çalışma şekli, lokasyon, kaynak ve eşleşme düzeyine göre filtreleme.
- **Notlar ve favoriler:** Her ilana not yazılabilir ve ilan favorilere eklenebilir.
- **Süreç takibi:** Başvurulan ilanlara İK ön görüşme, online test, teknik mülakat, teklif, olumsuz sonuç gibi adımlar tarihleriyle eklenir.
- **Elle başvuru ekleme:** Taramanın bulmadığı bir ilana yapılan başvuru elle kaydedilebilir.
- **İstatistik ve rapor:** Özet, başvuru hunisi, ret ve sonuç oranları, alan ve kaynak kırılımı, haftalık başvuru grafiği ve başvuru listesi. Rapor döneme, alana ve kaynağa göre süzülür ve PDF olarak indirilir.
- **Akışkan arka plan:** Başlığın arkasında imleci izleyen, boşta kendi kendine gezinen bir WebGL akışkan simülasyonu.

## Ekran görüntüleri

<img width="1918" height="1028" alt="image" src="https://github.com/user-attachments/assets/d4b8fdee-72d7-42ea-963d-f70251a3bbdc" />


<img width="1919" height="1030" alt="image" src="https://github.com/user-attachments/assets/c4220aec-7850-43aa-80ad-71342f3e0a0a" />


<img width="1919" height="1028" alt="image" src="https://github.com/user-attachments/assets/0ea8e914-6795-4fb0-93a4-c6bb4b913837" />


## Nasıl çalışır

Sayfanın tamamı tek dosyadır: [`ilan-radari.html`](ilan-radari.html). Derleme adımı ve bağımlılık kurulumu yoktur.

- **Veri:** İlanlar ve başvurular dosyada değil, artifact'in kendi veritabanında durur (`jobs` ve `runs` koleksiyonları). Bu repoda yalnızca sayfanın kodu vardır; kişisel başvuru verisi yoktur.
- **Tarama:** İlanları günlük bir tarama bulur ve veritabanına yazar. Sayfa veritabanını canlı dinler, yeni ilanlar yenilemeye gerek kalmadan listeye düşer.
- **PDF:** Rapor tarayıcıda `html2canvas` ve `jsPDF` ile üretilir; bu iki kütüphane yalnızca indirme sırasında cdnjs'ten yüklenir.
- **Arka plan:** Ek kütüphane kullanmayan, WebGL2 üzerinde yazılmış bir akışkan simülasyonu. "Hareketi azalt" ayarı açıkken veya WebGL2 yokken gizlenir.

## Çalıştırma

Dosya bir claude.ai artifact'i olarak yayınlanmak üzere yazılmıştır ve bu yüzden `<html>`, `<head>`, `<body>` etiketlerini içermez; bunları artifact ortamı ekler.

Dosyayı tarayıcıda doğrudan açarsan arayüz görünür ama veri gelmez, çünkü veritabanına yalnızca claude.ai içinde erişilebilir. Bu durumda sayfa "Kayıtlara ulaşılamıyor" mesajını gösterir.

## Sürüm geçmişi

Commit geçmişi artifact'in 17. sürümünden başlar; daha önceki sürümler artifact'ten geri alınamadı.
