using Microsoft.EntityFrameworkCore;
using Backend.Entities;


namespace Backend.Data;

public class AppDbContext : DbContext
{
    //ctor dışarıdan ayar alabilmemizi sağlayan standart yapı
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {

    }

    // Tablolarımız
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseSqlite("Data Source=mayday.db");
    }
}
