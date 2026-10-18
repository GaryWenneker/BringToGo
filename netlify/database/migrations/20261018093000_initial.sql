CREATE TABLE events (
  id text PRIMARY KEY,
  owner_hash text NOT NULL,
  title text NOT NULL,
  location text NOT NULL,
  starts_at timestamptz NOT NULL,
  description text NOT NULL,
  drinks_note text NOT NULL DEFAULT '',
  targets jsonb NOT NULL,
  closed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE parties (
  id uuid PRIMARY KEY,
  event_id text NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  owner_hash text NOT NULL,
  name text NOT NULL CHECK(length(name) BETWEEN 1 AND 60),
  attendees integer NOT NULL CHECK(attendees BETWEEN 1 AND 30),
  dietary_needs text NOT NULL DEFAULT '',
  UNIQUE(event_id,owner_hash),
  UNIQUE(id,event_id)
);
CREATE TABLE contributions (
  id uuid PRIMARY KEY,
  event_id text NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  party_id uuid NOT NULL,
  dish text NOT NULL CHECK(length(dish) BETWEEN 1 AND 100),
  dish_key text NOT NULL,
  category text NOT NULL CHECK(category IN ('hartig','groente','kaas','zoet','overig')),
  portions integer NOT NULL CHECK(portions BETWEEN 1 AND 500),
  diets jsonb NOT NULL DEFAULT '[]',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY(party_id,event_id) REFERENCES parties(id,event_id) ON DELETE CASCADE,
  UNIQUE(event_id,dish_key)
);
CREATE INDEX contributions_event_order ON contributions(event_id,created_at);
-- The date was supplied as 20 December; the upcoming year is 2026.
-- 16:00 Europe/Amsterdam = 15:00 UTC on this date.
INSERT INTO events(id,owner_hash,title,location,starts_at,description,drinks_note,targets) VALUES (
  'buurtborrel-alem-2026', 'seed-event-no-organizer', 'Pré-kerst buurtborrel', 'Hart van Alem', '2026-12-20T15:00:00Z',
  'Beste buurtjes, gezellig dat jullie erbij zijn! Neem een schaaltje kleine hapjes mee, dan maken we samen een heerlijk tapasbuffet. Bekijk even wat er al op tafel komt en kies iets dat er mooi bij past.',
  'Drankjes worden ter plekke genoteerd en afgerekend tegen inkoopprijs.',
  '{"hartig":6,"groente":4,"kaas":3,"zoet":3,"overig":2}'
);
