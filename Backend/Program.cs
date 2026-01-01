using Backend.Data;

var builder = WebApplication.CreateBuilder(args);

// Servisleri Ekleme işlemi
builder.Services.AddControllers();

// Swashbuckle ekranı
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// veritabanını servislere ekleme işlemi
builder.Services.AddDbContext<AppDbContext>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

// geliştirme ortamındaysak swaggerı aç
// Not: Render'da Production modunda çalıştığı için Swagger açılmaz, sorun değil. Frontend çalışsın yeter.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// cors iznini aktif et
app.UseCors("AllowAll");

// Basit Loglama 
app.Use(async (context, next) =>
{
    Console.WriteLine($"[LOG] İstek Geldi: {context.Request.Method} {context.Request.Path} - Zaman: {DateTime.Now}");
    await next();
});

app.MapControllers();

// Uygulama her başladığında veritabanı yoksa sıfırdan oluşturur.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}
// ----------------------------

app.Run();