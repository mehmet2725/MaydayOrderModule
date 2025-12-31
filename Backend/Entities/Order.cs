using System;

namespace Backend.Entities;

public class Order
{
    public int Id { get; set; }
    public string TenantId { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.Now;
    // Bir sipariş birden fazla ürünü tutabilir o yüzden List
    public List<OrderItem> Items { get; set; } = new();
}
