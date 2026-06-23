import { useState, useRef, useCallback, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const SPOTS = [
  {
    id: 'entrance',
    label: 'Вход на кладбище',
    icon: 'DoorOpen',
    img: 'https://cdn.poehali.dev/projects/b9873eb4-ed53-4c0f-9fb0-64f71b826c8a/files/77ae1e7c-ba2f-495a-8876-8f5ec2ae183b.jpg',
    desc: 'Главный вход · Троекуровское кладбище, Москва',
  },
  {
    id: 'path',
    label: 'Аллея к могиле',
    icon: 'Footprints',
    img: 'https://cdn.poehali.dev/projects/b9873eb4-ed53-4c0f-9fb0-64f71b826c8a/files/0cb3ee47-053e-4ec1-b455-e0cad167ae55.jpg',
    desc: 'Тихая тенистая аллея · 3-й участок',
  },
  {
    id: 'grave',
    label: 'Место захоронения',
    icon: 'Flower2',
    img: 'https://cdn.poehali.dev/projects/b9873eb4-ed53-4c0f-9fb0-64f71b826c8a/files/253c81c3-6115-4811-9caa-d47bb1f7f569.jpg',
    desc: 'Могила Анны Сергеевны Котовой · ряд 12, место 4',
  },
];

interface Props {
  onClose: () => void;
}

export default function VirtualTour({ onClose }: Props) {
  const [spot, setSpot] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const changeSpot = useCallback(
    (next: number) => {
      if (transitioning) return;
      setTransitioning(true);
      setTimeout(() => {
        setSpot(next);
        setOffsetX(0);
        setTransitioning(false);
      }, 380);
    },
    [transitioning]
  );

  const prev = () => changeSpot((spot - 1 + SPOTS.length) % SPOTS.length);
  const next = () => changeSpot((spot + 1) % SPOTS.length);

  const onMouseDown = (e: React.MouseEvent) => { setDragging(true); setStartX(e.clientX); };
  const onMouseMove = (e: React.MouseEvent) => { if (dragging) setOffsetX(e.clientX - startX); };
  const onMouseUp = () => {
    if (offsetX > 80) prev();
    else if (offsetX < -80) next();
    setDragging(false);
    setOffsetX(0);
  };

  const onTouchStart = (e: React.TouchEvent) => { setDragging(true); setStartX(e.touches[0].clientX); };
  const onTouchMove = (e: React.TouchEvent) => { if (dragging) setOffsetX(e.touches[0].clientX - startX); };
  const onTouchEnd = () => { onMouseUp(); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const current = SPOTS[spot];

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col" style={{ backdropFilter: 'blur(8px)' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 text-white/80">
        <div className="flex items-center gap-3">
          <Icon name="Box" size={20} className="text-amber-400" />
          <span className="font-serif text-xl text-white">Виртуальный тур</span>
          <span className="text-sm opacity-50 ml-2">· Троекуровское кладбище</span>
        </div>
        <button onClick={onClose} className="hover:text-white transition-colors">
          <Icon name="X" size={24} />
        </button>
      </div>

      {/* Main panorama viewer */}
      <div className="flex-1 relative overflow-hidden select-none cursor-grab active:cursor-grabbing"
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Panoramic image with parallax drag */}
        <div
          className="absolute inset-0 transition-all"
          style={{
            opacity: transitioning ? 0 : 1,
            transform: `translateX(${offsetX * 0.08}px) scale(${dragging ? 1.02 : 1})`,
            transition: dragging ? 'transform 0.05s' : 'opacity 0.38s ease, transform 0.4s ease',
          }}
        >
          <img
            src={current.img}
            alt={current.label}
            className="w-full h-full object-cover"
            draggable={false}
          />
          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none" />
          {/* Fog overlay */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)' }} />
        </div>

        {/* Spot label bottom */}
        <div className="absolute bottom-0 inset-x-0 p-8 pointer-events-none"
          style={{ opacity: transitioning ? 0 : 1, transition: 'opacity 0.38s' }}>
          <p className="font-serif text-white text-3xl md:text-4xl mb-1">{current.label}</p>
          <p className="text-white/60 text-sm flex items-center gap-2">
            <Icon name="MapPin" size={14} /> {current.desc}
          </p>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center text-white transition-all hover:scale-110"
        >
          <Icon name="ChevronLeft" size={22} />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center text-white transition-all hover:scale-110"
        >
          <Icon name="ChevronRight" size={22} />
        </button>

        {/* Drag hint */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/40 text-xs pointer-events-none">
          <Icon name="MousePointer2" size={13} /> Перетащите для осмотра · клавиши ←→
        </div>
      </div>

      {/* Bottom spot selector */}
      <div className="px-6 py-5 flex justify-center gap-3 flex-wrap">
        {SPOTS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => changeSpot(i)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm transition-all font-medium ${
              i === spot
                ? 'bg-amber-500 text-black scale-105'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <Icon name={s.icon} size={15} fallback="MapPin" />
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
