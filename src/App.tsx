import { useMemo } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useLocalState } from './lib/state';
import type { MoodId, TemplateId } from './lib/data';
import { RitualContext } from './screens/ritual/state';

import { Landing } from './screens/Landing';
import { Onboard } from './screens/Onboard';
import { Home } from './screens/Home';
import { Dashboard } from './screens/Dashboard';
import { Settings } from './screens/Settings';
import { Welcome } from './screens/ritual/Welcome';
import { Checkin } from './screens/ritual/Checkin';
import { Scripture } from './screens/ritual/Scripture';
import { Prayer } from './screens/ritual/Prayer';
import { Space } from './screens/ritual/Space';
import { Intention } from './screens/ritual/Intention';
import { Complete } from './screens/ritual/Complete';

export function App() {
  const [mood, setMood] = useLocalState<MoodId>('prayup.mood', 'anxious');
  const [heart, setHeart] = useLocalState<string>('prayup.heart', '');
  const [template, setTemplate] = useLocalState<TemplateId>('prayup.template', 'personal');
  const [intention, setIntention] = useLocalState<string>('prayup.intention', '');

  const ritualCtx = useMemo(
    () => ({ mood, setMood, heart, setHeart, template, setTemplate, intention, setIntention }),
    [mood, setMood, heart, setHeart, template, setTemplate, intention, setIntention],
  );

  return (
    <RitualContext.Provider value={ritualCtx}>
      <div className="pu-app">
        <div className="pu-screen">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/onboard/:step" element={<Onboard />} />
              <Route path="/home" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/ritual" element={<Navigate to="/ritual/welcome" replace />} />
              <Route path="/ritual/welcome" element={<Welcome />} />
              <Route path="/ritual/checkin" element={<Checkin />} />
              <Route path="/ritual/scripture" element={<Scripture />} />
              <Route path="/ritual/prayer" element={<Prayer />} />
              <Route path="/ritual/space" element={<Space />} />
              <Route path="/ritual/intention" element={<Intention />} />
              <Route path="/ritual/complete" element={<Complete />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </RitualContext.Provider>
  );
}
