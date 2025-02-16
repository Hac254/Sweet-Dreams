'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Moon, Sun, BedDouble, BookOpen, Calendar, Activity, Heart, BookMarked, Home, Plus, Edit, Trash, Youtube, Headphones, Wind, Play, Pause } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Color scheme from provided palette
const colors = {
  magenta: '#E91E64',
  orange: '#FF5722',
  blue: '#3F51B5',
  navy: '#1A237E',
  green: '#4CAF50',
  pink: '#E91E63'
}

const sleepEmojis = ["😴", "💤", "🌙", "🛏️", "🌜", "✨", "🌠"]

interface SleepEntry {
  id: string
  date: string
  bedTime: string
  wakeTime: string
  sleepQuality: number
  mood: string
  notes: string
}

interface EnvironmentFactor {
  category: string
  status: 'good' | 'warning' | 'bad'
  recommendation: string
}

const educationalResources = {
  books: [
    {
      title: "Why We Sleep",
      author: "Matthew Walker",
      description: "A comprehensive look at the science of sleep and its importance.",
      link: "https://example.com/why-we-sleep"
    },
    {
      title: "The Sleep Solution",
      author: "W. Chris Winter",
      description: "A practical guide to better sleep habits.",
      link: "https://example.com/sleep-solution"
    }
  ],
  videos: [
    {
      title: "How to hack your sleep",
      platform: "YouTube",
      duration: "15:24",
      link: "https://youtube.com/sleep-hack"
    },
    {
      title: "The Science of Sleep",
      platform: "YouTube",
      duration: "20:15",
      link: "https://youtube.com/sleep-science"
    }
  ],
  podcasts: [
    {
      title: "Sleep Better Tonight",
      host: "Dr. Sleep Expert",
      duration: "45:00",
      link: "https://example.com/sleep-better-podcast"
    },
    {
      title: "The Sleep Revolution",
      host: "Sleep Specialist",
      duration: "30:00",
      link: "https://example.com/sleep-revolution"
    }
  ]
}

const relaxationExercises = [
  {
    title: "Progressive Muscle Relaxation",
    duration: "10 minutes",
    description: "Systematically tense and relax muscle groups",
    audioUrl: "https://example.com/pmr-audio.mp3"
  },
  {
    title: "Deep Breathing",
    duration: "5 minutes",
    description: "Calm your mind with deep breathing exercises",
    audioUrl: "https://example.com/breathing-audio.mp3"
  },
  {
    title: "Body Scan Meditation",
    duration: "15 minutes",
    description: "Mindfully scan your body from head to toe",
    audioUrl: "https://example.com/body-scan-audio.mp3"
  }
]

export default function Component() {
  const [showSplash, setShowSplash] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([])
  const [showNewEntryDialog, setShowNewEntryDialog] = useState(false)
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0)
  const [selectedExercise, setSelectedExercise] = useState<typeof relaxationExercises[0] | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const emojiInterval = setInterval(() => {
      setCurrentEmojiIndex((prevIndex) => (prevIndex + 1) % sleepEmojis.length)
    }, 2000)

    return () => clearInterval(emojiInterval)
  }, [])

  useEffect(() => {
    if (selectedExercise && audioRef.current) {
      audioRef.current.src = selectedExercise.audioUrl
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [selectedExercise, isPlaying])

  const addSleepEntry = (entry: SleepEntry) => {
    setSleepEntries([...sleepEntries, entry])
  }

  const deleteSleepEntry = (id: string) => {
    setSleepEntries(sleepEntries.filter(entry => entry.id !== id))
  }

  const calculateSleepMetrics = () => {
    if (sleepEntries.length === 0) return null

    const averageQuality = sleepEntries.reduce((acc, entry) => acc + entry.sleepQuality, 0) / sleepEntries.length
    const totalEntries = sleepEntries.length
    const lastWeekEntries = sleepEntries.filter(entry => {
      const entryDate = new Date(entry.date)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return entryDate >= weekAgo
    })

    return {
      averageQuality,
      totalEntries,
      lastWeekEntries: lastWeekEntries.length
    }
  }

  const assessEnvironment = (): EnvironmentFactor[] => {
    return [
      {
        category: "Light Level",
        status: "good",
        recommendation: "Keep your bedroom dark with blackout curtains"
      },
      {
        category: "Temperature",
        status: "warning",
        recommendation: "Maintain room temperature between 60-67°F (15-19°C)"
      },
      {
        category: "Noise Level",
        status: "good",
        recommendation: "Use white noise or earplugs if needed"
      },
      {
        category: "Bed Comfort",
        status: "warning",
        recommendation: "Consider replacing old mattress or pillows"
      }
    ]
  }

  const getSleepDuration = (bedTime: string, wakeTime: string) => {
    const [bedHours, bedMinutes] = bedTime.split(':').map(Number)
    const [wakeHours, wakeMinutes] = wakeTime.split(':').map(Number)
    let duration = (wakeHours * 60 + wakeMinutes) - (bedHours * 60 + bedMinutes)
    if (duration < 0) duration += 24 * 60 // Adjust for next day
    return duration / 60 // Return hours
  }

  if (showSplash) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A237E]/10 to-[#E91E64]/10 flex flex-col items-center justify-center p-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#1A237E] to-[#E91E64]">
            DreamWell
          </h1>
          <p className="text-xl mb-8 text-[#1A237E]">Your personal sleep wellness companion</p>
          <div className="flex justify-center space-x-4 mb-8">
            {sleepEmojis.map((emoji, index) => (
              <motion.span
                key={index}
                className="text-4xl"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>
          <motion.button
            className="px-8 py-3 bg-gradient-to-r from-[#1A237E] to-[#E91E64] text-white rounded-full font-semibold text-lg shadow-lg hover:opacity-90 transition duration-300"
            onClick={() => setShowSplash(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Sleep Journey
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A237E]/5 to-[#E91E64]/5 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-[#1A237E] mb-8 text-center">DreamWell</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span className="hidden md:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="diary" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden md:inline">Sleep Diary</span>
          </TabsTrigger>
          <TabsTrigger value="environment" className="flex items-center gap-2">
            <BedDouble className="w-4 h-4" />
            <span className="hidden md:inline">Environment</span>
          </TabsTrigger>
          <TabsTrigger value="relax" className="flex items-center gap-2">
            <Wind className="w-4 h-4" />
            <span className="hidden md:inline">Relax</span>
          </TabsTrigger>
          <TabsTrigger value="learn" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="hidden md:inline">Learn</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="hidden md:inline">Analysis</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Dashboard</CardTitle>
              <CardDescription>Your sleep wellness at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {calculateSleepMetrics() ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Sleep Quality</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-[#E91E64]">
                          {calculateSleepMetrics()?.averageQuality.toFixed(1)}/10
                        </div>
                        <Progress 
                          value={(calculateSleepMetrics()?.averageQuality ?? 0) * 10} 
                          className="mt-2"
                        />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Total Entries</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-[#4CAF50]">
                          {calculateSleepMetrics()?.totalEntries}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Last 7 Days</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-[#3F51B5]">
                          {calculateSleepMetrics()?.lastWeekEntries}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <div className="col-span-3 text-center py-8 text-muted-foreground">
                    No sleep data available. Start by adding entries to your sleep diary.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diary">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Sleep Diary</span>
                <Button onClick={() => setShowNewEntryDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Entry
                </Button>
              </CardTitle>
              <CardDescription>Track your sleep patterns and quality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sleepEntries.map((entry) => (
                  <Card key={entry.id}>
                    <CardHeader>
                      <CardTitle className="text-lg flex justify-between items-center">
                        <span>{new Date(entry.date).toLocaleDateString()}</span>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => deleteSleepEntry(entry.id)}>
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label>Bed Time</Label>
                          <div>{entry.bedTime}</div>
                        </div>
                        <div>
                          <Label>Wake Time</Label>
                          <div>{entry.wakeTime}</div>
                        </div>
                        <div>
                          <Label>Quality</Label>
                          <div>{entry.sleepQuality}/10</div>
                        </div>
                        <div>
                          <Label>Mood</Label>
                          <div>{entry.mood}</div>
                        </div>
                      </div>
                      {entry.notes && (
                        <div className="mt-4">
                          <Label>Notes</Label>
                          <div className="text-muted-foreground">{entry.notes}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environment">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Environment Assessment</CardTitle>
              <CardDescription>Optimize your sleep space for better rest</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assessEnvironment().map((factor, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          factor.status === 'good' ? 'bg-[#4CAF50]' :
                          factor.status === 'warning' ? 'bg-[#FF5722]' :
                          'bg-[#E91E64]'
                        }`} />
                        {factor.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{factor.recommendation}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relax">
          <Card>
            <CardHeader>
              <CardTitle>Relaxation Exercises</CardTitle>
              <CardDescription>Guided exercises to help you unwind and prepare for sleep</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relaxationExercises.map((exercise, index) => (
                  <Card key={index} className="cursor-pointer hover:border-[#E91E64] transition-colors">
                    <CardHeader>
                      <CardTitle className="text-lg">{exercise.title}</CardTitle>
                      <CardDescription>{exercise.duration}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{exercise.description}</p>
                      <Button 
                        className="w-full bg-gradient-to-r from-[#1A237E] to-[#E91E64]"
                        onClick={() => {
                          setSelectedExercise(exercise)
                          setIsPlaying(!isPlaying)
                        }}
                      >
                        {isPlaying && selectedExercise?.title === exercise.title ? (
                          <>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Start
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <audio ref={audioRef} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learn">
          <Card>
            <CardHeader>
              <CardTitle>Educational Resources</CardTitle>
              <CardDescription>Expand your knowledge about sleep wellness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookMarked className="w-5 h-5" />
                    Recommended Books
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {educationalResources.books.map((book, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-lg">{book.title}</CardTitle>
                          <CardDescription>by {book.author}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4">{book.description}</p>
                          <Button variant="outline" className="w-full" onClick={() => window.open(book.link)}>
                            Learn More
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Youtube className="w-5 h-5" />
                    Video Resources
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {educationalResources.videos.map((video, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-lg">{video.title}</CardTitle>
                          <CardDescription>{video.duration}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button variant="outline" className="w-full" onClick={() => window.open(video.link)}>
                            Watch Video
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Headphones className="w-5 h-5" />
                    Podcasts
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {educationalResources.podcasts.map((podcast, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-lg">{podcast.title}</CardTitle>
                          <CardDescription>Host: {podcast.host}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-2">Duration: {podcast.duration}</p>
                          <Button variant="outline" className="w-full" onClick={() => window.open(podcast.link)}>
                            Listen Now
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Analysis</CardTitle>
              <CardDescription>Insights from your sleep patterns</CardDescription>
            </CardHeader>
            <CardContent>
              {sleepEntries.length > 0 ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Sleep Quality Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={sleepEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 10]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="sleepQuality" stroke="#E91E64" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Sleep Duration Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={sleepEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(entry => ({
                              ...entry,
                              sleepDuration: getSleepDuration(entry.bedTime, entry.wakeTime)
                            }))}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="sleepDuration" stroke="#4CAF50" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Add sleep diary entries to see your analysis
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showNewEntryDialog} onOpenChange={setShowNewEntryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Sleep Entry</DialogTitle>
            <DialogDescription>Record your sleep details</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            addSleepEntry({
              id: Date.now().toString(),
              date: formData.get('date') as string,
              bedTime: formData.get('bedTime') as string,
              wakeTime: formData.get('wakeTime') as string,
              sleepQuality: Number(formData.get('sleepQuality')),
              mood: formData.get('mood') as string,
              notes: formData.get('notes') as string,
            })
            setShowNewEntryDialog(false)
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sleepQuality">Sleep Quality (1-10)</Label>
                  <Input id="sleepQuality" name="sleepQuality" type="number" min="1" max="10" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="bedTime">Bed Time</Label>
                  <Input id="bedTime" name="bedTime" type="time" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="wakeTime">Wake Time</Label>
                  <Input id="wakeTime" name="wakeTime" type="time" required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mood">Mood</Label>
                <Input id="mood" name="mood" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-gradient-to-r from-[#1A237E] to-[#E91E64]">Add Entry</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}