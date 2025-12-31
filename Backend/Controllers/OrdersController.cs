using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Entities;

namespace Backend.Controllers;

[ApiController]
[Route("orders")]
public class OrdersController : ControllerBase
{
    // Veri tabanı bağlantısını buraya çağırıyoruz
    private readonly AppDbContext _context;

    // ctor kod çalışınca db bağlantısını otomatik olarak buraya aktaracak
    public OrdersController(AppDbContext context)
    {
        _context = context;
    }

    // 1.Listele
    [HttpGet]
    public async Task<IActionResult> GetOrders([FromHeader] string tenant_id)
    {
        if (string.IsNullOrEmpty(tenant_id))
        {
            return BadRequest(new { message = "Lütfen tenant_id Gönderin!" });
        }

        // Veritabanı işlemleri için linq kullanıyoruz
        var orders = await _context.Orders
            .Include(x => x.Items) // siparişleri getirirkne ürünleride geitr
            .Where(x => x.TenantId == tenant_id) // sadece bu dükkaın siparişlerini getir
            .OrderByDescending(x => x.CreatedDate) // En yeniyi en başa koy
            .ToListAsync(); // listeye çevir ve getir

        return Ok(orders); // 200 ok
    }

    // 2.Sipariş Oluştur
    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] Order order, [FromHeader] string tenant_id)
    {
        if (string.IsNullOrEmpty(tenant_id))
        {
            return BadRequest(new { message = " Lütfen tenant_id gönderin!" });
        }

        // A dükkanı B dükkanına sipariş yazamasın diye headerdaki dükkan kimliğine zorluyoruz
        order.TenantId = tenant_id;

        order.CreatedDate = DateTime.Now;

       // Ekleme işlemi 
        _context.Orders.Add(order);

        // Değişiklikleri kaydedeim
        await _context.SaveChangesAsync();

        return Created("", order);
    }
}
