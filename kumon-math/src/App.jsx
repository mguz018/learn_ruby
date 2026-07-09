import { useState } from 'react'
import { useApp } from './context/AppContext.jsx'
import HomeScreen from './components/HomeScreen.jsx'
import SubjectPicker from './components/SubjectPicker.jsx'
import LevelMap from './components/LevelMap.jsx'
import PlacementTest from './components/PlacementTest.jsx'
import Session from './components/Session.jsx'
import Summary from './components/Summary.jsx'
import ParentDashboard from './components/ParentDashboard.jsx'

export default function App() {
  const { state } = useApp()
  const [nav, setNav] = useState({ screen: 'home', profileId: null, subjectId: null })
  const [summary, setSummary] = useState(null)

  const go = (screen, extra = {}) => setNav((n) => ({ ...n, screen, ...extra }))
  const profile = nav.profileId ? state.profiles[nav.profileId] : null

  function openSubject(subjectId) {
    const sp = profile.subjects[subjectId]
    go(sp.placementDone ? 'map' : 'placement', { subjectId })
  }

  return (
    <div className="app-shell">
      {nav.screen === 'home' && (
        <HomeScreen
          onPickProfile={(id) => go('subjects', { profileId: id })}
          onParent={() => go('parent')}
        />
      )}

      {nav.screen === 'subjects' && profile && (
        <SubjectPicker
          profile={profile}
          onPick={openSubject}
          onHome={() => go('home', { profileId: null, subjectId: null })}
        />
      )}

      {nav.screen === 'map' && profile && (
        <LevelMap
          profile={profile}
          subjectId={nav.subjectId}
          onStartLevel={(levelId) => go('session', { sessionLevel: levelId })}
          onRecheck={() => go('placement')}
          onBack={() => go('subjects')}
        />
      )}

      {nav.screen === 'placement' && profile && (
        <PlacementTest
          profile={profile}
          subjectId={nav.subjectId}
          onDone={() => go('map')}
          onBack={() => go('subjects')}
        />
      )}

      {nav.screen === 'session' && profile && (
        <Session
          profile={profile}
          subjectId={nav.subjectId}
          levelId={nav.sessionLevel}
          onFinish={(result) => {
            setSummary(result)
            go('summary')
          }}
          onQuit={() => go('map')}
        />
      )}

      {nav.screen === 'summary' && summary && (
        <Summary
          result={summary}
          profile={state.profiles[summary.profileId]}
          onNextSet={() =>
            go('session', {
              sessionLevel: state.profiles[summary.profileId].subjects[summary.subjectId].currentLevel,
            })
          }
          onDone={() => go('map')}
        />
      )}

      {nav.screen === 'parent' && (
        <ParentDashboard onExit={() => go('home', { profileId: null, subjectId: null })} />
      )}
    </div>
  )
}
