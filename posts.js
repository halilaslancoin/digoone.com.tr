// Bu dosya blog yazılarınızı tutar. 
// Siteden "+ Yeni Entry" ile yazı ekleyip "posts.js İndir" diyerek bu dosyanın üzerine yazabilir ve Git'e yükleyebilirsiniz.

const INITIAL_POSTS = [
  {
    id: 1,
    title: "2026'da Üretken Yapay Zeka Araçları: Sadece Sohbetten Otonom İş Akışlarına",
    category: "Yapay Zeka",
    date: "21 Kasım 2026",
    readTime: "4 dk okuma",
    featured: true,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Yapay zeka modelleri artık yalnızca metin üreten asistanlar değil; dosya sistemlerini yöneten, kod derleyen ve süreçleri uçtan uca tamamlayan dijital iş ortaklarına dönüştü.",
    content: `Yapay zeka ekosistemindeki en belirgin kırılma, modellerin pasif yanıtlayıcılardan aktif yürütücülere dönüşmesiyle yaşandı.\n\nEskiden bir metni özetlemek veya kod parçası almak için kullandığımız arayüzler, bugün doğrudan kendi araç setlerimize bağlanarak uçtan uca görevleri tamamlayabiliyor.\n\ndigoone olarak bu dönüşümü karmaşık terimlerden arındırarak, doğrudan günlük iş ve üretim pratiklerinize nasıl entegre edebileceğinizi incelemeye devam edeceğiz.`
  },
  {
    id: 2,
    title: "Minimalist Dijital Çalışma Alanı Kurulumu: Dikkat Dağınıklığını Azaltan 5 Araç",
    category: "Dijital Yaşam",
    date: "18 Kasım 2026",
    readTime: "3 dk okuma",
    featured: true,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    excerpt: "Onlarca açık sekme ve bildirim arasında odaklanmak zorlaşıyor. Sade ve hızlı bir dijital üretim ortamı kurmak için kullandığımız temel yaklaşımlar.",
    content: `İyi bir dijital çalışma ortamı, en çok özelliği barındıran değil; en az sürtünme yaratan ortamdır.\n\nNot alma, görev takibi ve okuma listelerini tek bir sade akışta toplamak zihinsel yorgunluğu ciddi oranda düşürür.`
  },
  {
    id: 3,
    title: "Yeni Nesil Web Tasarımında Editoryal Sadeliğin Yükselişi",
    category: "Trendler",
    date: "14 Kasım 2026",
    readTime: "3 dk okuma",
    featured: true,
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=80",
    excerpt: "Karmaşık animasyonlar yerini yüksek okunabilirliğe, dengeli boşluk kullanımına ve içerik odaklı editoryal tasarımlara bırakıyor.",
    content: `Okuyucular artık bir web sitesine girdiklerinde saniyeler içinde aradıkları bilgiye ve net bir tipografiye ulaşmak istiyor.\n\nBeyaz alanların doğru kullanımı ve güçlü görsel hiyerarşi, içeriğin değerini doğrudan artıran en önemli tasarım kararları arasında.`
  },
  {
    id: 4,
    title: "Haftanın Dikkat Çeken 4 Yeni Üretkenlik ve Tasarım Uygulaması",
    category: "Yenilikler",
    date: "10 Kasım 2026",
    readTime: "2 dk okuma",
    featured: false,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
    excerpt: "Bu hafta radarımıza takılan; not alma, görsel düzenleme ve hızlı prototipleme süreçlerini hızlandıran yeni nesil araçlar.",
    content: `Her hafta onlarca yeni araç yayınlanıyor ancak çok azı günlük alışkanlıklarımıza kalıcı olarak girebiliyor. Bu seçkide gerçekten zaman kazandıran dört aracı bir araya getirdik.`
  },
  {
    id: 5,
    title: "Kişisel Bilgi Yönetimi: Okuduklarınızı Kalıcı Fikirlere Dönüştürmek",
    category: "Dijital Yaşam",
    date: "05 Kasım 2026",
    readTime: "4 dk okuma",
    featured: false,
    image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=900&q=80",
    excerpt: "Kaydedip bir daha bakmadığınız makaleler yerine, kendi yorumlarınızla beslenen canlı bir dijital arşiv oluşturma rehberi.",
    content: `Bilgi tüketmek ile bilgi üretmek arasındaki köprü, aldığınız kısa notlardır. Okuduğunuz her analizden sonra kendi cümlelerinizle üç satırlık bir özet çıkarmak kalıcılığı artırır.`
  }
];
