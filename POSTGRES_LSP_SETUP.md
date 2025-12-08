# ============================================
# POSTGRES LANGUAGE SERVER SETUP
# ============================================

## 📦 O'rnatish

Postgres Language Server CLI allaqachon o'rnatilgan:
```bash
pnpm add -D @postgres-language-server/cli
```

## 🔧 Sozlash

### 1. VS Code Extension O'rnatish

Cursor/VS Code'da extension'ni o'rnating:
1. Extensions panelini oching (Ctrl+Shift+X)
2. "Postgres Language Server" qidiring
3. "Postgres Language Server" by Supabase'ni o'rnating
4. Extension'ni yoqing

### 2. Database Connection Sozlash

#### Variant A: Connection String (Supabase uchun)

`.env` faylida:
```env
DATABASE_URL=postgresql://user:password@host:port/database
```

#### Variant B: Alohida parametrlar

`.env` faylida:
```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=boshqaruv
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
```

### 3. VS Code Settings

`.vscode/settings.json` faylini yarating (agar yo'q bo'lsa):

```json
{
  "postgres-lsp.connectionString": "${DATABASE_URL}",
  "postgres-lsp.enable": true,
  "postgres-lsp.completion.enable": true,
  "postgres-lsp.diagnostics.enable": true,
  "postgres-lsp.formatting.enable": true,
  
  "[sql]": {
    "editor.defaultFormatter": "supabase.postgres-language-server",
    "editor.formatOnSave": true
  }
}
```

### 4. Workspace Settings

`Boshqaruv.code-workspace` fayli allaqachon yangilangan. Workspace'ni qayta oching:
- File > Open Workspace from File
- `Boshqaruv.code-workspace` ni tanlang

## ✅ Tekshirish

1. `.sql` fayl yarating
2. SQL kod yozing:
```sql
SELECT * FROM users;
```
3. Autocomplete ishlashini tekshiring (Ctrl+Space)
4. Hover qilganda table/column ma'lumotlari ko'rinishi kerak

## 🎯 Xususiyatlar

- ✅ **Autocomplete**: Table, column, function nomlari
- ✅ **Syntax Highlighting**: SQL syntax
- ✅ **Error Detection**: SQL xatolarini aniqlash
- ✅ **Hover Info**: Table/column ma'lumotlari
- ✅ **Formatting**: SQL kod formatlash
- ✅ **Type Checking**: PostgreSQL type checking

## 🔍 Muammolarni Hal Qilish

### Extension ishlamayapti?

1. Extension o'rnatilganini tekshiring
2. Workspace'ni qayta oching
3. VS Code'ni qayta ishga tushiring
4. Output panelida "Postgres Language Server" loglarini ko'ring

### Connection xatosi?

1. `.env` faylidagi connection ma'lumotlarini tekshiring
2. Database ishlab turganini tekshiring
3. Connection string to'g'riligini tekshiring

### Autocomplete ishlamayapti?

1. SQL fayl extension'i `.sql` ekanligini tekshiring
2. `Ctrl+Space` bosing
3. Settings'da `postgres-lsp.completion.enable: true` ekanligini tekshiring

## 📚 Qo'shimcha Ma'lumot

- [Postgres Language Server Documentation](https://pg-language-server.com)
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=supabase.postgres-language-server)
- [GitHub Repository](https://github.com/supabase/postgres-language-server)
