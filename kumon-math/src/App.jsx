import { useState } from 'react'
import { useApp } from './context/AppContext.jsx'
import HomeScreen from './components/HomeScreen.jsx'
import LevelMap from './components/LevelMap.jsx'
import PlacementTest from './components/PlacementTest.jsx'
import Session from './components/Session.jsx'
import Summary from './components/Summary.jsx'
import ParentDashboard from './components/ParentDashboard.jsx'

// Lightweight screen router — no external routing dependency needed for a
// single-flow kiosk-style app.
export default function App() {
  const { state } = useApp()
  const [nav, setNav] = useState({ screen: 'home', profileId: null })
  const [summary, setSummary] = useState(null)

  const go = (screen, extra = {}) => setNav((n) => ({ ...n, screen, ...extra }))
  const profile = nav.profileId ? state.profiles[nav.profileId] : null

  return (
    <div className="app-shell">
      {nav.screen === 'home' && (
        <HomeScreen
          onPickProfile={(id) => {
            const p = state.profiles[id]
            go(p.placementDone ? 'map' : 'placement', { profileId: id })
          }}
          onParent={() => go('parent')}
        />
      )}

      {nav.screen === 'map' && profile && (
        <LevelMap
          profile={profile}
          onStart={() => go('session', { sessionLevel: profile.currentLevel })}
          onHome={() => go('home', { profileId: null })}
        />
      )}

      {nav.screen === 'placement' && profile && (
        <PlacementTest
          profile={profile}
          onDone={() => go('map')}
          onHome={() => go('home', { profileId: null })}
        />
      )}

      {nav.screen === 'session' && profile && (
        <Session
          profile={profile}
          levelId={nav.sessionLevel}
          onFinish={(result) => {
            setSummary(result)
            go('summary')
          }}
          onQuit={() => go('map')}
        />
      )}

      {nav.screen === 'summary' && summary && profile && (
        <Summary
          result={summary}
          profile={state.profiles[summary.profileId]}
          onNextSet={() => {
            const p = state.profiles[summary.profileId]
            go('session', { sessionLevel: p.currentLevel })
          }}
          onDone={() => go('map')}
        />
      )}

      {nav.screen === 'parent' && (
        <ParentDashboard onExit={() => go('home', { profileId: null })} />
      )}
    </div>
  )
}
