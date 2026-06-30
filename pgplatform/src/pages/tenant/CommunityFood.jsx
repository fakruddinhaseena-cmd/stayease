import { useState } from 'react';
import { Coffee, Calendar, Users, Megaphone, ChevronRight, Star } from 'lucide-react';
import { foodMenu, announcements } from '../../data/mockData';

const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const today = days[new Date().getDay() === 0 ? 6 : new Date().getDay()-1];

const events = [
  { id:'e1', title:'Game Night 🎮', date:'June 12, 2026', time:'7:00 PM', location:'Common Area', rsvp:14, capacity:30, going:false },
  { id:'e2', title:'Yoga Session 🧘', date:'June 15, 2026', time:'6:30 AM', location:'Terrace', rsvp:8, capacity:20, going:true },
  { id:'e3', title:'Movie Night 🎬', date:'June 20, 2026', time:'8:00 PM', location:'Common Area', rsvp:22, capacity:40, going:false },
];

export default function CommunityFood() {
  const [activeDay, setActiveDay] = useState(today);
  const [evts, setEvts] = useState(events);
  const [activeTab, setActiveTab] = useState('food');

  const toggleRsvp = (id) => {
    setEvts(e => e.map(ev => ev.id===id ? {...ev, going:!ev.going, rsvp:ev.going?ev.rsvp-1:ev.rsvp+1} : ev));
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Tab switch */}
      <div className="flex gap-2">
        {[{k:'food',label:'🍽️ Food Menu'},{k:'community',label:'🏘️ Community'}].map(t => (
          <button key={t.k} onClick={()=>setActiveTab(t.k)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab===t.k?'bg-blue-600 text-white shadow-sm':'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'food' && (
        <div className="space-y-5">
          {/* Day selector */}
          <div className="card p-4">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {days.map(d => (
                <button key={d} onClick={()=>setActiveDay(d)}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${activeDay===d ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : d===today ? 'border-blue-200 text-blue-600 bg-blue-50' : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'}`}>
                  {d.slice(0,3)}
                  {d===today && <span className="block text-xs opacity-70">Today</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Menu for selected day */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { meal:'Breakfast', time:'7:00 – 9:00 AM', color:'bg-amber-50 border-amber-200', accent:'text-amber-700', dot:'bg-amber-400' },
              { meal:'Lunch',     time:'12:30 – 2:30 PM', color:'bg-emerald-50 border-emerald-200', accent:'text-emerald-700', dot:'bg-emerald-400' },
              { meal:'Dinner',    time:'7:30 – 9:30 PM', color:'bg-indigo-50 border-indigo-200', accent:'text-indigo-700', dot:'bg-indigo-400' },
            ].map(m => (
              <div key={m.meal} className={`card p-5 border ${m.color}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${m.dot}`} />
                  <span className={`font-semibold ${m.accent}`}>{m.meal}</span>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed">{foodMenu[activeDay]?.[m.meal.toLowerCase()]}</p>
                <p className="text-xs text-slate-400 mt-2">{m.time}</p>
              </div>
            ))}
          </div>

          {/* Feedback */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 mb-3">Rate Today's Food</h3>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(s => (
                <button key={s} className="w-9 h-9 rounded-lg hover:bg-amber-50 transition-colors flex items-center justify-center">
                  <Star className="w-5 h-5 text-amber-300 hover:text-amber-500 transition-colors" />
                </button>
              ))}
              <input className="input flex-1 ml-2" placeholder="Leave a comment..." />
              <button className="btn-primary">Submit</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'community' && (
        <div className="space-y-5">
          {/* Events */}
          <div className="card">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="section-title text-base flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-600" />Upcoming Events</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {evts.map(e => (
                <div key={e.id} className="p-5 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 rounded-xl p-3 text-center min-w-[52px]">
                      <div className="text-xs font-semibold text-blue-600">{e.date.split(',')[0].split(' ')[0]}</div>
                      <div className="text-lg font-bold text-slate-900">{e.date.split(' ')[1].replace(',','')}</div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{e.title}</h4>
                      <div className="text-sm text-slate-500 mt-0.5">{e.time} • {e.location}</div>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                        <Users className="w-3 h-3" />{e.rsvp}/{e.capacity} going
                      </div>
                    </div>
                  </div>
                  <button onClick={() => toggleRsvp(e.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${e.going ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'}`}>
                    {e.going ? '✓ Going' : 'RSVP'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div className="card">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="section-title text-base flex items-center gap-2"><Megaphone className="w-5 h-5 text-orange-500" />Announcements</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {announcements.map(a => (
                <div key={a.id} className="p-5">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${a.type==='warning'?'bg-amber-400':a.type==='event'?'bg-purple-400':'bg-blue-400'}`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{a.title}</h4>
                      <p className="text-sm text-slate-500 mt-1 leading-relaxed">{a.message}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.type==='warning'?'bg-amber-50 text-amber-600':a.type==='event'?'bg-purple-50 text-purple-600':'bg-blue-50 text-blue-600'}`}>
                          {a.type.charAt(0).toUpperCase()+a.type.slice(1)}
                        </span>
                        <span className="text-xs text-slate-400">{a.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
