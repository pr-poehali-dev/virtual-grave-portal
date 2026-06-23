import { useState, useRef, useCallback, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const API_URL = 'https://functions.poehali.dev/502e7b68-cc39-4bd2-b52b-61ca8fa2ee22';
const MEMORIAL_ID = 'kotova';

const DEFAULT_SPOTS = [
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

interface Spot {
  id: string;
  label: string;
  icon: string;
  img: string;
  desc: string;
}

interface Props {
  onClose: () => void;
}

export default function VirtualTour({ onClose }: Props) {
  const [spots, setSpots] = useState<Spot[]>(DEFAULT_SPOTS);
  const [spot, setSpot] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  // Upload panel state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadSpotId, setUploadSpotId] = useState(DEFAULT_SPOTS[0].id);
  const [uploadLabel, setUploadLabel] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileData, setFileData] = useState<{ b64: string; type: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Load custom panoramas from backend on open
  useEffect(() => {
    fetch(`${API_URL}?memorial_id=${MEMORIAL_ID}`)
      .then((r) => r.json())
      .then((data) => {
        const raw = typeof data === 'string' ? JSON.parse(data) : data;
        const panoramas: { spot_id: string; label: string; url: string }[] = raw.panoramas ?? [];
        if (panoramas.length === 0) return;
        // Replace default spot images with the latest uploaded per spot_id
        const latest: Record<string, { label: string; url: string }> = {};
        panoramas.forEach((p) => { latest[p.spot_id] = { label: p.label, url: p.url }; });
        setSpots((prev) =>
          prev.map((s) =>
            latest[s.id] ? { ...s, img: latest[s.id].url, label: latest[s.id].label } : s
          )
        );
      })
      .catch(() => {});
  }, []);

  const changeSpot = useCallback(
    (next: number) => {
      if (transitioning) return;
      setTransitioning(true);
      setTimeout(() => { setSpot(next); setOffsetX(0); setTransitioning(false); }, 380);
    },
    [transitioning]
  );

  const prev = () => changeSpot((spot - 1 + spots.length) % spots.length);
  const next = () => changeSpot((spot + 1) % spots.length);

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (uploadOpen) return;
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPreviewUrl(result);
      const b64 = result.split(',')[1];
      setFileData({ b64, type: file.type });
    };
    reader.readAsDataURL(file);
    setUploadDone(false);
  };

  const handleUpload = async () => {
    if (!fileData) return;
    setUploading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memorial_id: MEMORIAL_ID,
          spot_id: uploadSpotId,
          label: uploadLabel || DEFAULT_SPOTS.find((s) => s.id === uploadSpotId)?.label,
          image_b64: fileData.b64,
          content_type: fileData.type,
        }),
      });
      const raw = await res.json();
      const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (data.url) {
        setSpots((prev) =>
          prev.map((s) =>
            s.id === uploadSpotId
              ? { ...s, img: data.url, label: uploadLabel || s.label }
              : s
          )
        );
        setUploadDone(true);
        setPreviewUrl(null);
        setFileData(null);
        setUploadLabel('');
        if (fileRef.current) fileRef.current.value = '';
      }
    } catch {
      // silent
    }
    setUploading(false);
  };

  const current = spots[spot];

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col" style={{ backdropFilter: 'blur(8px)' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 text-white/80">
        <div className="flex items-center gap-3">
          <Icon name="Box" size={20} className="text-amber-400" />
          <span className="font-serif text-xl text-white">Виртуальный тур</span>
          <span className="text-sm opacity-50 ml-2">· Троекуровское кладбище</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setUploadOpen((v) => !v); setUploadDone(false); }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm transition-all"
          >
            <Icon name="Upload" size={15} />
            Загрузить фото
          </button>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <Icon name="X" size={24} />
          </button>
        </div>
      </div>

      {/* Upload panel */}
      {uploadOpen && (
        <div className="mx-6 mb-4 bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row gap-5 items-start">
          {/* File drop zone */}
          <div
            className="relative flex-shrink-0 w-full md:w-52 h-36 rounded-xl border-2 border-dashed border-white/20 hover:border-amber-400/60 flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden"
            onClick={() => fileRef.current?.click()}
          >
            {previewUrl ? (
              <img src={previewUrl} className="absolute inset-0 w-full h-full object-cover rounded-xl" alt="preview" />
            ) : (
              <>
                <Icon name="ImagePlus" size={28} className="text-white/30 mb-2" />
                <span className="text-white/40 text-xs text-center px-3">Нажмите или перетащите<br/>фото / панораму</span>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />
          </div>

          {/* Settings */}
          <div className="flex-1 space-y-3 w-full">
            <div>
              <p className="text-white/50 text-xs mb-1.5">Точка на туре</p>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_SPOTS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setUploadSpotId(s.id)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                      uploadSpotId === s.id
                        ? 'bg-amber-500 text-black font-medium'
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white/50 text-xs mb-1.5">Подпись (необязательно)</p>
              <Input
                value={uploadLabel}
                onChange={(e) => setUploadLabel(e.target.value)}
                placeholder="Например: Берёзовая аллея, апрель 2024"
                className="bg-white/10 border-white/10 text-white placeholder:text-white/30 h-9 text-sm rounded-xl"
              />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Button
                onClick={handleUpload}
                disabled={!fileData || uploading}
                className="rounded-full bg-amber-500 text-black hover:bg-amber-400 h-9 px-5 text-sm"
              >
                {uploading ? (
                  <><Icon name="Loader2" size={15} className="mr-2 animate-spin" />Загружаю...</>
                ) : (
                  <><Icon name="Upload" size={15} className="mr-2" />Сохранить</>
                )}
              </Button>
              {uploadDone && (
                <span className="text-amber-400 text-sm flex items-center gap-1.5">
                  <Icon name="CheckCircle2" size={15} /> Фото обновлено
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main panorama viewer */}
      <div
        className="flex-1 relative overflow-hidden select-none cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onMouseUp}
      >
        <div
          className="absolute inset-0"
          style={{
            opacity: transitioning ? 0 : 1,
            transform: `translateX(${offsetX * 0.08}px) scale(${dragging ? 1.02 : 1})`,
            transition: dragging ? 'transform 0.05s' : 'opacity 0.38s ease, transform 0.4s ease',
          }}
        >
          <img src={current.img} alt={current.label} className="w-full h-full object-cover" draggable={false} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none" />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)' }} />
        </div>

        <div
          className="absolute bottom-0 inset-x-0 p-8 pointer-events-none"
          style={{ opacity: transitioning ? 0 : 1, transition: 'opacity 0.38s' }}
        >
          <p className="font-serif text-white text-3xl md:text-4xl mb-1">{current.label}</p>
          <p className="text-white/60 text-sm flex items-center gap-2">
            <Icon name="MapPin" size={14} /> {current.desc}
          </p>
        </div>

        <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center text-white transition-all hover:scale-110">
          <Icon name="ChevronLeft" size={22} />
        </button>
        <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center text-white transition-all hover:scale-110">
          <Icon name="ChevronRight" size={22} />
        </button>

        {!uploadOpen && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/40 text-xs pointer-events-none">
            <Icon name="MousePointer2" size={13} /> Перетащите для осмотра · клавиши ←→
          </div>
        )}
      </div>

      {/* Bottom spot selector */}
      <div className="px-6 py-5 flex justify-center gap-3 flex-wrap">
        {spots.map((s, i) => (
          <button
            key={s.id}
            onClick={() => changeSpot(i)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm transition-all font-medium ${
              i === spot ? 'bg-amber-500 text-black scale-105' : 'bg-white/10 text-white/70 hover:bg-white/20'
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
