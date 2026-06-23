import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import VirtualTour from '@/components/VirtualTour';

const PORTRAIT =
  'https://cdn.poehali.dev/projects/b9873eb4-ed53-4c0f-9fb0-64f71b826c8a/files/e0ae8a9f-7413-42e7-b11e-68417b294d3e.jpg';
const COVER =
  'https://cdn.poehali.dev/projects/b9873eb4-ed53-4c0f-9fb0-64f71b826c8a/files/f0aad95d-b56a-4ab3-81c4-a5781aefc39e.jpg';

const timeline = [
  { year: '1938', text: 'Родилась в Москве в большой и дружной семье.' },
  { year: '1961', text: 'Окончила педагогический институт, стала учителем литературы.' },
  { year: '1965', text: 'Вышла замуж за Виктора, спутника всей своей жизни.' },
  { year: '1970', text: 'Родились двое детей — Елена и Михаил.' },
  { year: '1998', text: 'Получила звание заслуженного учителя за 35 лет преданности профессии.' },
  { year: '2021', text: 'Ушла из жизни, окружённая любовью родных. Светлая память.' },
];

const initialMemories = [
  {
    author: 'Внучка Елена',
    date: '12 марта 2024',
    text: 'Бабушка всегда пекла пироги по воскресеньям. Запах этих пирогов — самое тёплое воспоминание моего детства.',
  },
  {
    author: 'Бывший ученик Сергей',
    date: '5 февраля 2024',
    text: 'Анна Сергеевна научила меня любить книги. Её уроки литературы я помню до сих пор, спустя 40 лет.',
  },
  {
    author: 'Соседка Тамара',
    date: '20 января 2024',
    text: 'Добрейшей души человек. Всегда готова была помочь, выслушать и поддержать. Очень не хватает наших разговоров за чаем.',
  },
];

const Memorial = () => {
  const [candles, setCandles] = useState(342);
  const [lit, setLit] = useState(false);
  const [memories, setMemories] = useState(initialMemories);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [tourOpen, setTourOpen] = useState(false);

  const lightCandle = () => {
    if (lit) return;
    setLit(true);
    setCandles((c) => c + 1);
  };

  const addMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;
    setMemories([
      {
        author,
        date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
        text,
      },
      ...memories,
    ]);
    setAuthor('');
    setText('');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {tourOpen && <VirtualTour onClose={() => setTourOpen(false)} />}
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/60">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Icon name="Flame" className="text-accent" size={22} />
            <span className="font-serif text-2xl font-semibold tracking-tight">Вечная память</span>
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors">
            <Icon name="ArrowLeft" size={16} /> На главную
          </Link>
        </div>
      </header>

      {/* Cover + portrait */}
      <section className="relative pt-16">
        <div className="relative h-72 md:h-96 overflow-hidden">
          <img src={COVER} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background" />
        </div>
        <div className="container">
          <div className="relative -mt-28 md:-mt-32 flex flex-col items-center text-center reveal">
            <div className="w-44 h-44 md:w-52 md:h-52 rounded-full border-4 border-background overflow-hidden shadow-xl glow">
              <img src={PORTRAIT} alt="Анна Сергеевна Котова" className="w-full h-full object-cover" />
            </div>
            <h1 className="font-serif text-4xl md:text-6xl mt-6 mb-2">Анна Сергеевна Котова</h1>
            <p className="text-lg text-muted-foreground">1938 — 2021</p>
            <p className="text-muted-foreground flex items-center gap-2 mt-2">
              <Icon name="MapPin" size={16} className="text-accent" />
              Москва, Россия · Троекуровское кладбище
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Button className="rounded-full bg-accent text-accent-foreground hover:opacity-90" onClick={lightCandle}>
                <Icon name="Flame" size={18} className="mr-2" />
                Зажечь свечу
              </Button>
              <Button variant="outline" className="rounded-full border-foreground/20" onClick={() => setTourOpen(true)}>
                <Icon name="Box" size={18} className="mr-2" />
                Виртуальный 3D-тур
              </Button>
              <Button variant="outline" className="rounded-full border-foreground/20">
                <Icon name="Share2" size={18} className="mr-2" />
                Поделиться
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container max-w-5xl py-20 grid lg:grid-cols-[1fr_300px] gap-12">
        {/* Main column */}
        <div className="space-y-16">
          {/* Biography */}
          <section>
            <h2 className="font-serif text-3xl md:text-4xl mb-5">Биография</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Анна Сергеевна посвятила всю свою жизнь детям и литературе. Более 35 лет она работала учителем,
              и тысячи учеников пронесли через жизнь её любовь к слову, доброту и мудрость.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Она была заботливой матерью, любящей бабушкой и верным другом. Её дом всегда был полон тепла,
              смеха и запаха свежей выпечки. Память о ней живёт в сердцах всех, кто её знал.
            </p>
          </section>

          {/* Timeline */}
          <section>
            <h2 className="font-serif text-3xl md:text-4xl mb-8">Путь длиною в жизнь</h2>
            <div className="relative border-l-2 border-border pl-8 space-y-8">
              {timeline.map((t) => (
                <div key={t.year} className="relative">
                  <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-accent border-4 border-background" />
                  <p className="font-serif text-2xl text-accent mb-1">{t.year}</p>
                  <p className="text-muted-foreground">{t.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Memories */}
          <section id="memories">
            <h2 className="font-serif text-3xl md:text-4xl mb-6">Воспоминания близких</h2>

            <form onSubmit={addMemory} className="bg-card rounded-3xl border border-border p-6 mb-8 space-y-4">
              <Input
                placeholder="Ваше имя"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="h-12 rounded-xl bg-background"
              />
              <Textarea
                placeholder="Поделитесь тёплым воспоминанием..."
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="rounded-xl bg-background resize-none"
              />
              <Button type="submit" className="rounded-full bg-primary text-primary-foreground hover:opacity-90">
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить воспоминание
              </Button>
            </form>

            <div className="space-y-5">
              {memories.map((m, i) => (
                <div key={i} className="bg-card rounded-3xl border border-border p-7">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium">{m.author}</p>
                    <p className="text-xs text-muted-foreground">{m.date}</p>
                  </div>
                  <p className="font-serif text-xl leading-relaxed italic">«{m.text}»</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="bg-card rounded-3xl border border-border p-8 text-center sticky top-24">
            <button onClick={lightCandle} className="relative mx-auto mb-6 block" aria-label="Зажечь свечу">
              <div className="mx-auto w-8 h-20 rounded-t-full bg-gradient-to-b from-amber-50 to-amber-200 relative">
                {lit ? (
                  <div className="flame absolute -top-8 left-1/2 -translate-x-1/2">
                    <div className="w-4 h-8 rounded-full bg-gradient-to-t from-amber-500 via-orange-400 to-yellow-200 blur-[1px]" />
                  </div>
                ) : (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-3 bg-stone-500 rounded-full" />
                )}
              </div>
              {lit && <div className="absolute inset-0 -m-6 rounded-full bg-amber-300/20 blur-2xl" />}
            </button>
            <p className="text-sm text-muted-foreground mb-1">Зажжено свечей</p>
            <p className="font-serif text-4xl mb-4">{candles.toLocaleString('ru-RU')}</p>
            <p className="text-xs text-muted-foreground">
              {lit ? 'Спасибо, ваш свет горит.' : 'Нажмите на свечу, чтобы почтить память.'}
            </p>
          </div>

          <div className="bg-card rounded-3xl border border-border p-6">
            <h3 className="font-serif text-xl mb-4">Памятные даты</h3>
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2 text-muted-foreground">
                <Icon name="Cake" size={16} className="text-accent" /> День рождения — 14 апреля
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Icon name="CalendarHeart" size={16} className="text-accent" /> День памяти — 3 ноября
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <Link to="/" className="flex items-center gap-2">
            <Icon name="Flame" size={18} className="text-accent" />
            <span className="font-serif text-xl text-foreground">Вечная память</span>
          </Link>
          <p>© 2026 Вечная память. Память, которая не знает расстояний.</p>
        </div>
      </footer>
    </div>
  );
};

export default Memorial;