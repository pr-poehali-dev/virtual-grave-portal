import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const HERO_IMG =
  'https://cdn.poehali.dev/projects/b9873eb4-ed53-4c0f-9fb0-64f71b826c8a/files/f0aad95d-b56a-4ab3-81c4-a5781aefc39e.jpg';

const memorials = [
  {
    name: 'Анна Сергеевна Котова',
    years: '1938 — 2021',
    place: 'Москва, Россия · Троекуровское кладбище',
    initials: 'АК',
  },
  {
    name: 'James Robert Hale',
    years: '1945 — 2019',
    place: 'Brookline, USA · Walnut Hills Cemetery',
    initials: 'JH',
  },
  {
    name: 'Maria Conceição Alves',
    years: '1951 — 2023',
    place: 'Lisboa, Portugal · Cemitério dos Prazeres',
    initials: 'MA',
  },
];

const features = [
  {
    icon: 'Search',
    title: 'Поиск по имени и месту',
    text: 'Найдите место захоронения близкого человека по имени, датам или городу — где бы он ни покоился.',
  },
  {
    icon: 'Box',
    title: 'Виртуальный 3D-тур',
    text: 'Пройдите к месту захоронения, как если бы вы были рядом — панорама и точная навигация по кладбищу.',
  },
  {
    icon: 'Flame',
    title: 'Зажечь свечу',
    text: 'Оставьте свет памяти на странице усопшего — символический жест, доступный из любой точки мира.',
  },
  {
    icon: 'BookHeart',
    title: 'Истории и воспоминания',
    text: 'Делитесь тёплыми моментами, фотографиями и рассказами вместе с другими, кто помнит и любит.',
  },
  {
    icon: 'CalendarHeart',
    title: 'Календарь памятных дат',
    text: 'Дни рождения, годовщины и дни поминовения — мы напомним, чтобы вы не пропустили важное.',
  },
  {
    icon: 'UserRound',
    title: 'Профиль усопшего',
    text: 'Фотография, биография и история жизни — достойная страница памяти о дорогом человеке.',
  },
];

const memories = [
  {
    author: 'Внучка Елена',
    text: 'Бабушка всегда пекла пироги по воскресеньям. Запах этих пирогов — самое тёплое воспоминание моего детства.',
  },
  {
    author: 'Друг семьи',
    text: 'Он умел слушать так, что становилось легче. Светлый, добрый и очень мудрый человек.',
  },
];

const Index = () => {
  const [candles, setCandles] = useState(1284);
  const [lit, setLit] = useState(false);

  const lightCandle = () => {
    if (lit) return;
    setLit(true);
    setCandles((c) => c + 1);
  };

  const nav = [
    ['Главная', 'home'],
    ['Поиск', 'search'],
    ['Виртуальный тур', 'tour'],
    ['Воспоминания', 'memories'],
    ['Календарь', 'calendar'],
    ['О сервисе', 'about'],
    ['Контакты', 'contacts'],
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/60">
        <div className="container flex items-center justify-between h-16">
          <a href="#home" className="flex items-center gap-2">
            <Icon name="Flame" className="text-accent" size={22} />
            <span className="font-serif text-2xl font-semibold tracking-tight">Вечная память</span>
          </a>
          <nav className="hidden lg:flex items-center gap-7 text-sm text-muted-foreground">
            {nav.map(([label, id]) => (
              <a key={id} href={`#${id}`} className="hover:text-foreground transition-colors">
                {label}
              </a>
            ))}
          </nav>
          <Button className="rounded-full bg-primary text-primary-foreground hover:opacity-90">
            Создать страницу памяти
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="relative min-h-screen flex items-center">
        <img src={HERO_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="container relative z-10 pt-20">
          <div className="max-w-3xl">
            <p className="reveal text-accent-foreground/80 tracking-[0.3em] uppercase text-xs mb-6" style={{ animationDelay: '0.1s' }}>
              Глобальный мемориальный сервис
            </p>
            <h1 className="reveal font-serif text-5xl md:text-7xl leading-[1.05] font-medium mb-6" style={{ animationDelay: '0.25s' }}>
              Память, которая <br /> не знает расстояний
            </h1>
            <p className="reveal text-lg md:text-xl text-muted-foreground max-w-xl mb-10" style={{ animationDelay: '0.4s' }}>
              Найдите могилу близкого человека в любой точке мира, посетите её виртуально, зажгите
              свечу и сохраните светлые воспоминания.
            </p>
            <div className="reveal flex flex-col sm:flex-row gap-4" style={{ animationDelay: '0.55s' }}>
              <Button size="lg" className="rounded-full h-13 px-8 bg-accent text-accent-foreground hover:opacity-90 glow">
                <Icon name="Search" size={18} className="mr-2" />
                Найти могилу
              </Button>
              <Button size="lg" variant="outline" className="rounded-full h-13 px-8 border-foreground/20 bg-background/40 backdrop-blur">
                Как это работает
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section id="search" className="py-28">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-4xl md:text-5xl mb-4">Найдите место памяти</h2>
            <p className="text-muted-foreground">
              Введите имя, годы жизни или город — мы поможем найти и навестить дорогого человека.
            </p>
          </div>
          <div className="max-w-3xl mx-auto bg-card rounded-3xl border border-border p-6 md:p-8 shadow-sm">
            <div className="grid md:grid-cols-[1fr_1fr_auto] gap-4">
              <div className="relative">
                <Icon name="UserRound" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Имя и фамилия" className="pl-11 h-13 rounded-full bg-background border-border" />
              </div>
              <div className="relative">
                <Icon name="MapPin" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Город или кладбище" className="pl-11 h-13 rounded-full bg-background border-border" />
              </div>
              <Button className="h-13 px-8 rounded-full bg-primary text-primary-foreground hover:opacity-90">
                Искать
              </Button>
            </div>
          </div>

          {/* Results preview */}
          <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
            {memorials.map((m) => (
              <div key={m.name} className="group bg-card rounded-3xl border border-border p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center font-serif text-xl text-secondary-foreground">
                    {m.initials}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl leading-tight">{m.name}</h3>
                    <p className="text-sm text-muted-foreground">{m.years}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground flex items-start gap-2 mb-5">
                  <Icon name="MapPin" size={15} className="mt-0.5 shrink-0 text-accent" />
                  {m.place}
                </p>
                <Button variant="ghost" className="w-full justify-between rounded-full text-foreground hover:bg-secondary">
                  Открыть страницу
                  <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="tour" className="py-28 bg-secondary/40">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-accent-foreground/70 tracking-[0.3em] uppercase text-xs mb-4">Возможности</p>
            <h2 className="font-serif text-4xl md:text-5xl">Всё, чтобы быть ближе</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-card rounded-3xl border border-border p-8 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center mb-5">
                  <Icon name={f.icon} size={22} className="text-accent" />
                </div>
                <h3 className="font-serif text-2xl mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Candle */}
      <section className="py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center bg-card rounded-[2.5rem] border border-border p-12 md:p-16 shadow-sm">
            <button onClick={lightCandle} className="relative mx-auto mb-8 block" aria-label="Зажечь свечу">
              <div className={`mx-auto w-10 h-24 rounded-t-full bg-gradient-to-b from-amber-50 to-amber-200 relative ${lit ? '' : 'opacity-90'}`}>
                {lit && (
                  <div className="flame absolute -top-9 left-1/2 -translate-x-1/2">
                    <div className="w-5 h-9 rounded-full bg-gradient-to-t from-amber-500 via-orange-400 to-yellow-200 blur-[1px]" />
                  </div>
                )}
                {!lit && <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-3 bg-stone-500 rounded-full" />}
              </div>
              {lit && <div className="absolute inset-0 -m-8 rounded-full bg-amber-300/20 blur-2xl" />}
            </button>
            <h2 className="font-serif text-4xl md:text-5xl mb-4">Зажгите свечу памяти</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              {lit
                ? 'Спасибо. Ваш свет горит в память о дорогом человеке.'
                : 'Символический жест, который согревает на любом расстоянии. Нажмите на свечу.'}
            </p>
            <p className="text-sm text-muted-foreground">
              Сегодня зажжено <span className="font-semibold text-foreground">{candles.toLocaleString('ru-RU')}</span> свечей
            </p>
          </div>
        </div>
      </section>

      {/* Memories */}
      <section id="memories" className="py-28 bg-secondary/40">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-accent-foreground/70 tracking-[0.3em] uppercase text-xs mb-4">Воспоминания</p>
              <h2 className="font-serif text-4xl md:text-5xl mb-6">Истории, которые греют сердце</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Каждая страница памяти — это живая книга. Близкие и друзья делятся рассказами, фотографиями
                и тёплыми моментами, чтобы память жила.
              </p>
              <Button className="rounded-full bg-primary text-primary-foreground hover:opacity-90">
                <Icon name="Plus" size={18} className="mr-2" />
                Поделиться воспоминанием
              </Button>
            </div>
            <div className="space-y-5">
              {memories.map((m) => (
                <div key={m.author} className="bg-card rounded-3xl border border-border p-7">
                  <Icon name="Quote" size={24} className="text-accent mb-3" />
                  <p className="font-serif text-xl leading-relaxed italic mb-4">«{m.text}»</p>
                  <p className="text-sm text-muted-foreground">— {m.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-28">
        <div className="container max-w-3xl text-center">
          <Icon name="Flame" size={32} className="text-accent mx-auto mb-6" />
          <h2 className="font-serif text-4xl md:text-5xl mb-6">Наша миссия</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            Мы верим, что память — это форма любви. «Вечная память» соединяет людей со всего мира с теми,
            кого они потеряли, стирая границы стран и расстояний.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Когда невозможно прийти лично, можно прийти сердцем. Зажечь свечу, оставить цветок, рассказать историю —
            и почувствовать, что близкий человек по-прежнему рядом.
          </p>
        </div>
      </section>

      {/* Contacts */}
      <section id="contacts" className="py-28 bg-secondary/40">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl mb-6">Свяжитесь с нами</h2>
              <p className="text-muted-foreground mb-8">
                Поможем найти место захоронения, создать страницу памяти или ответим на любой вопрос.
              </p>
              <div className="space-y-4 text-muted-foreground">
                <p className="flex items-center gap-3"><Icon name="Mail" size={18} className="text-accent" /> care@vechnaya-pamyat.com</p>
                <p className="flex items-center gap-3"><Icon name="Phone" size={18} className="text-accent" /> +7 (800) 000-00-00</p>
                <p className="flex items-center gap-3"><Icon name="Globe" size={18} className="text-accent" /> Работаем по всему миру, 24/7</p>
              </div>
            </div>
            <form className="bg-card rounded-3xl border border-border p-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <Input placeholder="Ваше имя" className="h-12 rounded-xl bg-background" />
              <Input type="email" placeholder="Электронная почта" className="h-12 rounded-xl bg-background" />
              <Textarea placeholder="Ваше сообщение" rows={4} className="rounded-xl bg-background resize-none" />
              <Button className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:opacity-90">
                Отправить сообщение
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Icon name="Flame" size={18} className="text-accent" />
            <span className="font-serif text-xl text-foreground">Вечная память</span>
          </div>
          <p>© 2026 Вечная память. Память, которая не знает расстояний.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
