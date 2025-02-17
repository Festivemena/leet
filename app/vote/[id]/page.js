'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import io from 'socket.io-client';

const socket = io('https://bevs.onrender.com');

export default function VotingSystem() {
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    // Fetch candidates from the backend
    fetch('https://bevs.onrender.com/candidates')
      .then((res) => res.json())
      .then((data) => {
        setCandidates(data);
        const initialVotes = data.reduce((acc, candidate) => {
          acc[candidate.id] = candidate.votes || 0;
          return acc;
        }, {});
        setVotes(initialVotes);
        setTotalVotes(Object.values(initialVotes).reduce((acc, val) => acc + val, 0));
      })
      .catch((error) => console.error('Error fetching candidates:', error));

    // Listen for real-time vote updates
    socket.on('voteUpdate', (updatedVotes) => {
      setVotes(updatedVotes);
      setTotalVotes(Object.values(updatedVotes).reduce((acc, val) => acc + val, 0));
    });
  }, []);

  const vote = (id) => {
    fetch(`https://bevs.onrender.com/vote/${id}`, {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((updatedVotes) => {
        setVotes(updatedVotes);
        setTotalVotes(Object.values(updatedVotes).reduce((acc, val) => acc + val, 0));
      })
      .catch((error) => console.error('Error voting:', error));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="w-full max-w-md p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl">
        <h2 className="text-xl font-semibold text-white text-center mb-4">Vote for Your Favorite Candidate</h2>
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-white/20 rounded-xl"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-lg">{candidate.name}</span>
                    <Button onClick={() => vote(candidate.id)} variant="outline" className="border-white/50 text-white hover:bg-white/20">
                      Vote
                    </Button>
                  </div>
                  <Progress value={totalVotes ? (votes[candidate.id] / totalVotes) * 100 : 0} className="mt-2" />
                  <span className="text-sm text-gray-300">{votes[candidate.id]} votes</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
