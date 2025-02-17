'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const candidates = [
  { id: 1, name: 'Vitalis', category: 'Tech', image: '/DP-01.png' },
  { id: 2, name: 'Jahswill', category: 'Entertainment', image: '/DP-02.png' },
  { id: 3, name: 'David', category: 'Leadership', image: '/DP-03.png' },
  { id: 4, name: 'John', category: 'Tech', image: '/DP-01.png' },
  { id: 5, name: 'Amaka', category: 'Entertainment', image: '/DP-02.png' },
  { id: 6, name: 'Emeka', category: 'Leadership', image: '/DP-03.png' },
];

export default function VotingDashboard() {
  const [votes, setVotes] = useState({ 1: 10, 2: 15, 3: 5, 4: 20, 5: 8, 6: 12 });

  const totalVotes = Object.values(votes).reduce((acc, val) => acc + val, 0);

  const categories = [...new Set(candidates.map((c) => c.category))];

  const vote = (id) => {
    setVotes((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const categoryVotes = categories.map((category) => ({
    category,
    votes: candidates
      .filter((c) => c.category === category)
      .reduce((acc, c) => acc + votes[c.id], 0),
  }));

  const candidateVotes = candidates.map((c) => ({
    name: c.name,
    votes: votes[c.id],
  }));

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h2 className="text-2xl font-semibold text-center mb-6">Voter & Vote Reporting Dashboard</h2>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Votes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalVotes}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{categories.join(', ')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top Candidate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">
                {candidates.reduce((top, c) => (votes[c.id] > votes[top.id] ? c : top)).name}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Voting Breakdown */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Votes by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryVotes}>
              <XAxis dataKey="category" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="votes" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Candidate Performance */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Candidate Vote Tally</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={candidateVotes}>
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="votes" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Vote Action
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Cast Your Vote</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidates.map((candidate) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-white/10 rounded-xl flex items-center space-x-4"
              >
                <Image
                  src={candidate.image}
                  alt={candidate.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-lg">{candidate.name}</span>
                    <Button
                      onClick={() => vote(candidate.id)}
                      variant="outline"
                      className="border-white/50 text-white hover:bg-white/20"
                    >
                      Vote
                    </Button>
                  </div>
                  <Progress
                    value={totalVotes ? (votes[candidate.id] / totalVotes) * 100 : 0}
                    className="mt-2"
                  />
                  <span className="text-sm text-gray-300">{votes[candidate.id]} votes</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}
