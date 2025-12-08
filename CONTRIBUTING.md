# Loyihaga Hissa Qo'shish Bo'yicha Qo'llanma

Boshqaruv loyihasiga qiziqish bildirganingiz uchun rahmat! 🎉

## 📋 Mundarija

- [Kod Konvensiyalari](#kod-konvensiyalari)
- [Hissa Qo'shish Jarayoni](#hissa-qoshish-jarayoni)
- [Pull Request Talablari](#pull-request-talablari)
- [Commit Message Formati](#commit-message-formati)
- [Test Yozish](#test-yozish)
- [Kod Review Jarayoni](#kod-review-jarayoni)

---

## 🎯 Kod Konvensiyalari

### TypeScript

- **Strict mode:** Doimo TypeScript strict mode ishlatiladi
- **Type annotations:** Barcha funksiya parametrlari va qaytish qiymatlari type bilan
- **Interface vs Type:** Interface'lar object struktura uchun, Type'lar union/intersection uchun
- **Naming:**
  - Components: PascalCase (`MobileDashboard.tsx`)
  - Functions: camelCase (`getUserData()`)
  - Constants: SCREAMING_SNAKE_CASE (`API_URL`)
  - Files: camelCase yoki kebab-case

### React

- **Functional Components:** Class component'lar ishlatilmaydi
- **Hooks:** Custom hook'lar `use` prefixi bilan boshlanishi kerak
- **Props:** Destructuring ishlatiladi
- **Memo:** Performance uchun `React.memo()` ishlatiladi

```typescript
// ✅ To'g'ri
export const UserCard = memo(({ name, email }: UserCardProps) => {
  return <div>...</div>;
});

// ❌ Noto'g'ri
export function UserCard(props: any) {
  return <div>...</div>;
}
```

### Styling

- **Tailwind CSS:** Asosiy styling framework
- **className:** Conditional classes uchun `clsx` yoki template literals
- **Mobile-first:** Responsive design mobile'dan boshlanadi

```tsx
// ✅ To'g'ri
<div className="flex flex-col md:flex-row gap-4">

// ❌ Noto'g'ri - inline styles
<div style={{ display: 'flex', gap: '16px' }}>
```

---

## 🚀 Hissa Qo'shish Jarayoni

### 1. Repository'ni Fork Qiling

```bash
# GitHub'da fork qiling
# Keyin local'ga clone qiling
git clone https://github.com/YOUR_USERNAME/Boshqaruv.git
cd Boshqaruv
```

### 2. Dependencies O'rnating

```bash
# Corepack'ni yoqing
corepack enable

# Dependencies o'rnating
pnpm install
```

### 3. Development Branch Yarating

```bash
# main branch'dan yangi branch yarating
git checkout -b feature/yangi-xususiyat

# yoki bug fix uchun
git checkout -b fix/muammo-nomi
```

### 4. Kod Yozing

```bash
# Development server ishga tushiring
pnpm dev

# Testlar yozing va test qiling
pnpm test

# Code style tekshiring
pnpm lint
pnpm format:check
```

### 5. Commit Qiling

```bash
# Staging
git add .

# Commit (conventional commits format)
git commit -m "feat: yangi xususiyat qo'shildi"

# Pre-commit hook avtomatik tekshiradi:
# - Prettier formatting
# - ESLint
# - TypeScript
```

### 6. Push va Pull Request

```bash
# Branch'ni push qiling
git push origin feature/yangi-xususiyat

# GitHub'da Pull Request yarating
```

---

## 📝 Pull Request Talablari

### PR Checklist

Pull Request yaratishdan oldin:

- [ ] Barcha testlar o'tmoqda (`pnpm test --run`)
- [ ] TypeScript xatolari yo'q (`pnpm typecheck`)
- [ ] ESLint xatolari yo'q (`pnpm lint`)
- [ ] Kod formatlangan (`pnpm format`)
- [ ] Yangi kod uchun testlar yozilgan
- [ ] Documentation yangilangan (agar kerak bo'lsa)
- [ ] Commit message'lar to'g'ri formatda
- [ ] Branch nomi descriptive

### PR Description Template

```markdown
## O'zgarishlar

Qisqa tavsif...

## Muammo

#123 issue'ni yechadi (agar borsa)

## Screenshot/Demo

(Agar UI o'zgarishlar bo'lsa)

## Test

Qanday test qilish kerak:
1. ...
2. ...

## Checklist

- [ ] Tests passing
- [ ] TypeScript clean
- [ ] ESLint clean
- [ ] Documentation updated
```

---

## 💬 Commit Message Formati

Biz [Conventional Commits](https://www.conventionalcommits.org/) formatidan foydalanamiz:

### Format

```
<type>(<scope>): <subject>

<body> (optional)

<footer> (optional)
```

### Type'lar

- **feat:** Yangi xususiyat
- **fix:** Bug fix
- **docs:** Documentation o'zgarishlari
- **style:** Code style (formatting, semicolons, etc)
- **refactor:** Code refactoring
- **test:** Test qo'shish yoki o'zgartirish
- **chore:** Build, dependencies, config o'zgarishlari
- **perf:** Performance yaxshilash
- **ci:** CI/CD o'zgarishlari

### Misollar

```bash
# Yangi xususiyat
git commit -m "feat: vazifa yaratish funksiyasi qo'shildi"

# Bug fix
git commit -m "fix: login sahifasidagi xato tuzatildi"

# Documentation
git commit -m "docs: README'ga o'rnatish qo'llanmasi qo'shildi"

# Refactoring
git commit -m "refactor: Dashboard komponentini optimallashtirish"

# Multiple lines
git commit -m "feat: real-time notification qo'shildi

- Supabase real-time subscription
- Toast notification component
- Notification sound

Closes #45"
```

---

## 🧪 Test Yozish

### Test Gerekliklari

Har qanday yangi funksiya test bilan birga kelishi kerak:

```typescript
// src/utils/__tests__/myFunction.test.ts
import { describe, it, expect } from 'vitest';
import { myFunction } from '../myFunction';

describe('myFunction', () => {
  it('to\'g\'ri natija qaytarishi kerak', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });

  it('noto\'g\'ri input uchun error berishi kerak', () => {
    expect(() => myFunction('')).toThrow();
  });
});
```

### Component Test

```typescript
// src/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('render qilishi va bosilganda callback chaqirishi', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    const button = screen.getByText('Click');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Test Ishlatish

```bash
# Barcha testlar
pnpm test

# Watch mode
pnpm test

# Coverage
pnpm test:coverage

# UI mode
pnpm test:ui
```

---

## 👀 Kod Review Jarayoni

### Review Criteria

Code reviewer'lar quyidagilarga e'tibor beradi:

1. **Functionality:** Kod ishlayaptimi?
2. **Tests:** Test coverage yetarlimi?
3. **Code Quality:** Clean, readable kodmi?
4. **Performance:** Performance issues yo'qmi?
5. **Security:** Security vulnerabilities yo'qmi?
6. **Documentation:** Yangi code documented'mi?

### Review Timeline

- **Initial Review:** 24-48 soat ichida
- **Follow-up:** O'zgarishlardan keyin 12-24 soat
- **Merge:** Approve'dan keyin 0-2 soat

### Feedback'ga Javob

```bash
# Review feedback'dan keyin o'zgarish qiling
git add .
git commit -m "fix: review feedback'ga muvofiq o'zgarishlar"
git push origin feature/branch-name

# PR avtomatik yangilanadi
```

---

## 🐛 Bug Report

Bug topsangiz, issue yarating:

1. GitHub Issues → New Issue
2. Bug Report template'ni tanlang
3. To'liq ma'lumot bering:
   - Qanday xato?
   - Qanday reproduce qilish mumkin?
   - Kutilgan natija?
   - Actual natija?
   - Screenshot/video

---

## 💡 Feature Request

Yangi xususiyat taklif qilish:

1. GitHub Issues → New Issue
2. Feature Request template'ni tanlang
3. Batafsil tavsif:
   - Qanday xususiyat?
   - Nima uchun kerak?
   - Qanday implement qilish mumkin?
   - Alternativalar?

---

## 📞 Yordam

Savollar bo'lsa:

- **GitHub Issues:** Savol bering
- **Discussions:** Community bilan muhokama
- **Email:** support@boshqaruv.uz

---

## ⚖️ Litsenziya

Loyihaga hissa qo'shish orqali, siz o'z kodingizni MIT litsenziyasi ostida tarqatishga rozi bo'lasiz.

---

**Rahmat!** 🙏

Sizning hissangiz loyihani yaxshilashga yordam beradi!
