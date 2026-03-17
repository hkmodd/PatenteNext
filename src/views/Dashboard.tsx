import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { getRandomExam, quizDatabase } from '../data/questions';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Play, Activity, CheckCircle2, XCircle, Download, Upload, Zap, BarChart2 } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { DatabaseSync } from '../components/DatabaseSync';

export function Dashboard({ onStartQuiz }: { onStartQuiz: () => void }) {
  const { totalExamsTaken, examsPassed, currentStreak, maxStreak, history, exportData, importData } = useAppStore();

  const handleStart = async () => {
    const newExam = await getRandomExam(30); // 30 questions for official exam
    useAppStore.getState().startExam(newExam);
    onStartQuiz();
  };

  const passRate = totalExamsTaken > 0 ? Math.round((examsPassed / totalExamsTaken) * 100) : 0;

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patentenext-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          importData(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // Calculate category stats
  const categoryStats = useMemo(() => {
    if (history.length === 0) return [];

    const stats: Record<string, { total: number; correct: number }> = {};

    history.forEach(session => {
      // For backward compatibility, if session.exam is not present, use quizDatabase
      const examQuestions = session.exam || quizDatabase;
      
      Object.entries(session.answers).forEach(([qId, userAnswer]) => {
        const question = examQuestions.find(q => q.id === qId);
        if (question) {
          const cat = question.category;
          if (!stats[cat]) stats[cat] = { total: 0, correct: 0 };
          stats[cat].total += 1;
          if (userAnswer === question.answer) {
            stats[cat].correct += 1;
          }
        }
      });
    });

    return Object.entries(stats).map(([category, data]) => ({
      subject: category.replace(/_/g, ' ').toUpperCase(),
      A: Math.round((data.correct / data.total) * 100),
      fullMark: 100,
    })).sort((a, b) => b.A - a.A).slice(0, 6); // Top 6 categories for the radar chart
  }, [history]);

  // Calculate progression over time
  const progressionData = useMemo(() => {
    if (history.length === 0) return [];
    
    // Reverse history to show chronological order (oldest to newest)
    const sortedHistory = [...history].reverse();
    
    return sortedHistory.map((session, index) => ({
      name: `Esame ${index + 1}`,
      score: session.score,
      passed: session.passed ? 1 : 0,
    }));
  }, [history]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col bg-grid-pattern pb-safe"
    >
      {/* Top Navigation Bar */}
      <header className="border-b border-surface-border bg-background/80 backdrop-blur-xl sticky top-0 z-50 pt-safe">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent flex items-center justify-center text-background font-display font-bold text-xl">P</div>
            <h1 className="text-xl font-display font-bold tracking-widest uppercase">Patente<span className="text-accent">Next</span></h1>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleImport} title="Importa Dati" aria-label="Importa Dati">
              <Upload className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleExport} title="Esporta Dati" aria-label="Esporta Dati">
              <Download className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 sm:mt-8">
        
        {/* Left Column: Hero & Stats */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <DatabaseSync />

          {/* Hero Section */}
          <div className="relative overflow-hidden border border-surface-border bg-surface p-6 sm:p-12 flex flex-col justify-between min-h-[350px] sm:min-h-[450px]">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
              <Zap className="w-96 h-96 text-accent" />
            </div>
            
            <div className="space-y-4 z-10">
              <div className="inline-block px-3 py-1 border border-accent/30 bg-accent/10 text-accent font-mono text-xs font-bold uppercase tracking-widest mb-2 sm:mb-4">
                Simulazione Ufficiale MIT
              </div>
              <h2 className="text-fluid-hero font-display font-bold uppercase text-primary glitch" data-text="Domina L'Esame.">
                Domina<br /><span className="text-accent">L'Esame.</span>
              </h2>
              <p className="text-secondary font-sans text-sm sm:text-base max-w-md mt-4 sm:mt-6 leading-relaxed">
                Algoritmo di simulazione ad alta fedeltà. 30 domande, tolleranza 3 errori. Nessuna distrazione, solo performance.
              </p>
            </div>

            <div className="mt-8 sm:mt-12 z-10">
              <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg" onClick={handleStart} aria-label="Inizia Simulazione">
                <Play className="w-5 h-5 mr-3 fill-current" />
                INIZIA SIMULAZIONE
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="bg-surface/50 backdrop-blur-sm">
              <CardHeader className="pb-0">
                <CardDescription>Tasso di Successo</CardDescription>
              </CardHeader>
              <CardContent className="pt-2 sm:pt-4">
                <div className="text-fluid-h1 font-display font-bold text-accent">
                  {passRate}<span className="text-3xl sm:text-4xl text-secondary">%</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-surface/50 backdrop-blur-sm">
              <CardHeader className="pb-0">
                <CardDescription>Esami Completati</CardDescription>
              </CardHeader>
              <CardContent className="pt-2 sm:pt-4">
                <div className="text-fluid-h1 font-display font-bold text-primary">
                  {totalExamsTaken}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface/50 backdrop-blur-sm">
              <CardHeader className="pb-0">
                <CardDescription>Winning Streak</CardDescription>
              </CardHeader>
              <CardContent className="pt-2 sm:pt-4 flex items-baseline gap-2">
                <div className="text-fluid-h1 font-display font-bold text-success">
                  {currentStreak}
                </div>
                <div className="text-sm font-mono text-secondary">
                  MAX: {maxStreak}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Radar Chart for Categories */}
          {categoryStats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-surface/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-surface-border bg-surface/30">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-accent" />
                    <CardTitle className="font-mono text-sm tracking-widest uppercase">Analisi Categorie</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0 h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={categoryStats}>
                      <PolarGrid stroke="#333" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10, fontFamily: 'Fira Code' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#030303', borderColor: '#333', fontFamily: 'Fira Code', fontSize: '12px' }}
                        itemStyle={{ color: '#FF4F00' }}
                        formatter={(value: number) => [`${value}%`, 'Precisione']}
                      />
                      <Radar name="Precisione" dataKey="A" stroke="#FF4F00" fill="#FF4F00" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-surface/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-surface-border bg-surface/30">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-accent" />
                    <CardTitle className="font-mono text-sm tracking-widest uppercase">Progressione</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 10, fontFamily: 'Fira Code' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 30]} tick={{ fill: '#888', fontSize: 10, fontFamily: 'Fira Code' }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#030303', borderColor: '#333', fontFamily: 'Fira Code', fontSize: '12px' }}
                        itemStyle={{ color: '#FF4F00' }}
                        formatter={(value: number) => [`${value}/30`, 'Punteggio']}
                      />
                      <Line type="monotone" dataKey="score" stroke="#FF4F00" strokeWidth={2} dot={{ fill: '#030303', stroke: '#FF4F00', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#FF4F00' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <h3 className="font-mono font-bold uppercase tracking-widest text-lg flex items-center gap-2">
              <span className="text-accent">{'>'}</span> SYS.LOG
            </h3>
            <Activity className="w-5 h-5 text-secondary" />
          </div>
          
          <div className="flex-1 flex flex-col gap-3 sm:gap-4 font-mono text-sm">
            {history.length === 0 ? (
              <div className="flex-1 flex flex-col items-start justify-start p-6 border border-surface-border text-secondary bg-surface/30">
                <div className="text-accent mb-2">System initialized.</div>
                <div className="animate-pulse">Waiting for simulation data_</div>
              </div>
            ) : (
              history.slice(0, 8).map((session) => (
                <div key={session.id} className="group flex flex-col p-3 sm:p-4 border border-surface-border bg-surface/80 hover:bg-surface hover:border-accent transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-secondary text-xs">
                      [{new Date(session.date).toISOString()}]
                    </div>
                    <div className={`text-xs font-bold ${session.passed ? 'text-success' : 'text-danger'}`}>
                      {session.passed ? 'PASS' : 'FAIL'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-primary">
                      <span className="text-accent mr-2">{'>'}</span>
                      EXEC_SIMULATION
                    </div>
                    <div className="text-primary font-bold">
                      {session.score}<span className="text-secondary">/{session.total}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </main>
    </motion.div>
  );
}
