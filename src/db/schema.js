export const schema = `
CREATE TABLE exercises (
  id TEXT PRIMARY KEY,                 -- uuid
  name TEXT NOT NULL,
  name_ar TEXT,
  primary_muscle TEXT NOT NULL,        -- chest, back, shoulders, biceps, triceps, legs, glutes, core, cardio, full_body, other
  secondary_muscles TEXT,              -- JSON array
  equipment TEXT,                      -- barbell, dumbbell, machine, cable, bodyweight, kettlebell, band, other
  tracking_type TEXT NOT NULL DEFAULT 'weight_reps',
  instructions TEXT,
  image_uri TEXT,                      -- local file path (nullable)
  youtube_id TEXT,                     -- nullable
  youtube_start INTEGER DEFAULT 0,
  is_custom INTEGER NOT NULL DEFAULT 0,
  is_favorite INTEGER NOT NULL DEFAULT 0,
  is_archived INTEGER NOT NULL DEFAULT 0,
  rest_seconds INTEGER,                -- per-exercise override
  notes TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE templates (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, folder TEXT, notes TEXT,
  sort_order INTEGER DEFAULT 0, created_at INTEGER NOT NULL
);
CREATE TABLE template_exercises (
  id TEXT PRIMARY KEY, template_id TEXT NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL REFERENCES exercises(id),
  order_index INTEGER NOT NULL, superset_group INTEGER, sets_json TEXT   -- [{type,weight,reps}]
);

CREATE TABLE workouts (
  id TEXT PRIMARY KEY, name TEXT, template_id TEXT,
  start_time INTEGER NOT NULL, end_time INTEGER,
  notes TEXT, is_completed INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE workout_exercises (
  id TEXT PRIMARY KEY, workout_id TEXT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL REFERENCES exercises(id),
  order_index INTEGER NOT NULL, superset_group INTEGER, rest_seconds INTEGER, notes TEXT
);
CREATE TABLE workout_sets (
  id TEXT PRIMARY KEY,
  workout_exercise_id TEXT NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  type TEXT NOT NULL DEFAULT 'normal',  -- normal | warmup | drop | failure
  weight REAL, reps INTEGER, duration_sec INTEGER, distance REAL,
  is_completed INTEGER NOT NULL DEFAULT 0, completed_at INTEGER
);
CREATE TABLE personal_records (
  id TEXT PRIMARY KEY, exercise_id TEXT NOT NULL REFERENCES exercises(id),
  type TEXT NOT NULL,                   -- max_weight | max_reps | max_1rm | max_set_volume
  value REAL NOT NULL, workout_id TEXT, achieved_at INTEGER NOT NULL
);
CREATE INDEX idx_we_workout ON workout_exercises(workout_id);
CREATE INDEX idx_ws_we ON workout_sets(workout_exercise_id);
CREATE INDEX idx_workouts_start ON workouts(start_time);

CREATE UNIQUE INDEX IF NOT EXISTS one_active_workout ON workouts(is_completed) WHERE is_completed = 0;
`;
