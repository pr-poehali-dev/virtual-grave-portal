CREATE TABLE IF NOT EXISTS t_p12648372_virtual_grave_portal.tour_panoramas (
  id SERIAL PRIMARY KEY,
  memorial_id TEXT NOT NULL DEFAULT 'kotova',
  spot_id TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);