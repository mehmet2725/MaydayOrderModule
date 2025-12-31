using System;

namespace Backend.Entities;

public class OrderItem
{
    public int Id { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    // İlişki kısmı=> Bu ürün hangi siparişe ait
    public int OrderId { get; set; }

    // Kod yazarken ürünün sahibine ulaşmak istersem diye bunu koyuyorum
    // Json Ignore'u yeni öğrendim : API cevap verirken "Sipariş -> Ürün -> Sipariş..."
    // diye sonsuz döngüye girmemesini sağlayıp sadece verii tutsun diye bunu gizliyoruz.
    [System.Text.Json.Serialization.JsonIgnore]
    public Order? Order { get; set; }
}
